package com.StudyConnect.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.StudyConnect.dtos.SessionDto;
import com.StudyConnect.dtos.StudyGroupCreateRequest;
import com.StudyConnect.dtos.StudyGroupDto;
import com.StudyConnect.dtos.StudyGroupWithSessionDto;
import com.StudyConnect.mappers.StudyGroupMapper;
import com.StudyConnect.model.Role;
import com.StudyConnect.model.Session;
import com.StudyConnect.model.StudyGroup;
import com.StudyConnect.model.Subject;
import com.StudyConnect.model.User;
import com.StudyConnect.repository.SessionRepository;
import com.StudyConnect.repository.StudyGroupRepository;
import com.StudyConnect.repository.SubjectRepository;
import com.StudyConnect.repository.UserRepository;

import static com.StudyConnect.mappers.StudyGroupMapper.*;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class StudyGroupService {

    @Autowired
    private StudyGroupRepository studyGroupRepository;

    @Autowired
    private SessionRepository studySessionRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    public boolean isOwner(Long studyGroupId, Long userId) {
        return studyGroupRepository.findById(studyGroupId)
                .map(group -> group.getCreatedBy() != null && group.getCreatedBy().getId().equals(userId))
                .orElse(false);
    }

    @Transactional
    public StudyGroupWithSessionDto createGroupWithInitialSession(User currentUser, StudyGroupCreateRequest req) {
        if (req.getTitle() == null || req.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Group title is required");
        }
        if (req.getSubject() == null || req.getSubject().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Subject is required");
        }
        if (req.getMaxMembers() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Max members must be at least 2");
        }

        Subject subject = getOrCreateSubject(req.getSubject().trim());

        StudyGroup group = buildStudyGroup(currentUser, req, subject);
        StudyGroup savedGroup = studyGroupRepository.save(group);

        SessionDto sessionDto = createSessionIfRequested(req, savedGroup);
        List<SessionDto> sessions = sessionDto != null ? List.of(sessionDto) : List.of();

        StudyGroupWithSessionDto result = StudyGroupMapper.toGroupWithSessionDto(savedGroup, sessions);
        result.setMember(true);
        return result;
    }

    private Subject getOrCreateSubject(String subjectName) {
        return subjectRepository.findByName(subjectName)
                .orElseGet(() -> subjectRepository.save(
                        Subject.builder().name(subjectName).build()));
    }

    private StudyGroup buildStudyGroup(User creator, StudyGroupCreateRequest req, Subject subject) {
        User managedUser = userRepository.findById(creator.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Set<User> members = new HashSet<>();
        members.add(managedUser);

        return StudyGroup.builder()
                .title(req.getTitle().trim())
                .description(req.getDescription() != null ? req.getDescription().trim() : "")
                .tags(req.getTags() != null ? req.getTags() : new String[0])
                .createdBy(managedUser)
                .maxMembers(req.getMaxMembers())
                .subject(subject)
                .currentMembers(members)
                .build();
    }

    private SessionDto createSessionIfRequested(StudyGroupCreateRequest req, StudyGroup group) {
        if (req.getSessionTitle() == null || req.getSessionDateTime() == null || req.getSessionLocation() == null) {
            return null;
        }

        Session session = Session.builder()
                .studyGroup(group)
                .title(req.getSessionTitle().trim())
                .dateTime(req.getSessionDateTime())
                .location(req.getSessionLocation().trim())
                .isOnline(Boolean.TRUE.equals(req.getIsOnline()))
                .build();

        return StudyGroupMapper.toSessionDto(studySessionRepository.save(session));
    }

    @Transactional(readOnly = true)
    public List<StudyGroupWithSessionDto> getUserGroups(User currentUser) {
        List<StudyGroup> groups = studyGroupRepository.findByCurrentMembersContaining(currentUser);
        List<StudyGroupWithSessionDto> result = new ArrayList<>();

        for (StudyGroup group : groups) {
            try {
                List<SessionDto> sessionDtos = studySessionRepository.findByStudyGroupId(group.getId())
                        .stream()
                        .map(StudyGroupMapper::toSessionDto)
                        .collect(Collectors.toList());

                StudyGroupWithSessionDto dto = StudyGroupMapper.toGroupWithSessionDto(group, sessionDtos);
                dto.setMember(true);
                result.add(dto);
            } catch (Exception e) {
                System.err.println("Error processing group " + group.getId() + ": " + e.getMessage());
            }
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<StudyGroupWithSessionDto> getAllGroups(User currentUser) {
        List<StudyGroup> groups = studyGroupRepository.findAll();
        List<StudyGroupWithSessionDto> result = new ArrayList<>();

        for (StudyGroup group : groups) {
            try {
                List<SessionDto> sessionDtos = studySessionRepository.findByStudyGroupId(group.getId())
                        .stream()
                        .map(StudyGroupMapper::toSessionDto)
                        .collect(Collectors.toList());

                StudyGroupWithSessionDto dto = StudyGroupMapper.toGroupWithSessionDto(group, sessionDtos);

                boolean isMember = group.getCurrentMembers() != null && group.getCurrentMembers()
                        .stream()
                        .anyMatch(member -> member.getId().equals(currentUser.getId()));
                dto.setMember(isMember);

                if (group.getTags() != null) {
                    String[] safeTags = new String[group.getTags().length];
                    System.arraycopy(group.getTags(), 0, safeTags, 0, group.getTags().length);
                    dto.setTags(safeTags);
                } else {
                    dto.setTags(new String[0]);
                }

                result.add(dto);
            } catch (Exception e) {
                System.err.println("Error processing group " + group.getId() + ": " + e.getMessage());
            }
        }

        return result;
    }

    @Transactional(readOnly = true)
    public StudyGroupWithSessionDto getGroupById(Long id) {
        StudyGroup group = studyGroupRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Study group not found"));
        List<Session> sessions = studySessionRepository.findByStudyGroupId(group.getId());
        List<SessionDto> sessionDtos = sessions.stream()
                .map(StudyGroupMapper::toSessionDto)
                .collect(Collectors.toList());
        return toGroupWithSessionDto(group, sessionDtos);
    }

    @Transactional
    public Optional<StudyGroupDto> updateStudyGroup(Long id, User currentUser, StudyGroupDto updateStudyGroup) {
        return studyGroupRepository.findById(id)
                .filter(studyGroup -> currentUser.getRole() == Role.ADMIN
                        || (studyGroup.getCreatedBy() != null
                                && studyGroup.getCreatedBy().getId().equals(currentUser.getId())))
                .map(studyGroup -> {
                    studyGroup.setTitle(updateStudyGroup.getTitle());
                    studyGroup.setDescription(updateStudyGroup.getDescription());
                    studyGroup.setTags(updateStudyGroup.getTags());

                    Subject subject = subjectRepository.findByName(updateStudyGroup.getSubject())
                            .orElseGet(() -> {
                                Subject newSubject = new Subject();
                                newSubject.setName(updateStudyGroup.getSubject());
                                return subjectRepository.save(newSubject);
                            });
                    studyGroup.setSubject(subject);

                    studyGroup.setMaxMembers(updateStudyGroup.getMaxMembers());
                    StudyGroup saved = studyGroupRepository.save(studyGroup);
                    return toStudyGroupDto(saved);
                });
    }

    @Transactional
    public boolean deleteStudyGroup(User currentUser, Long id) {
        Optional<StudyGroup> groupOpt = studyGroupRepository.findById(id);
        if (groupOpt.isEmpty()) {
            return false;
        }

        StudyGroup studyGroup = groupOpt.get();
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isCreator = studyGroup.getCreatedBy() != null
                && studyGroup.getCreatedBy().getId().equals(currentUser.getId());

        if (!isAdmin && !isCreator) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Only the group creator or an admin can delete this study group");
        }

        if (studyGroup.getCurrentMembers() != null) {
            studyGroup.getCurrentMembers().clear();
            studyGroupRepository.save(studyGroup);
        }

        studyGroupRepository.delete(studyGroup);
        return true;
    }

    @Transactional
    public void joinStudyGroup(Long studyGroupId, Long userId) {
        StudyGroup group = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Study group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (group.getCurrentMembers() == null) {
            group.setCurrentMembers(new HashSet<>());
        }

        boolean alreadyMember = group.getCurrentMembers().stream()
                .anyMatch(m -> m.getId().equals(userId));
        if (alreadyMember) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You are already a member of this group");
        }

        if (group.getMaxMembers() != null && group.getCurrentMembers().size() >= group.getMaxMembers()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This study group is already full");
        }

        group.getCurrentMembers().add(user);
        studyGroupRepository.save(group);
    }

    @Transactional
    public void leaveStudyGroup(Long studyGroupId, Long userId) {
        StudyGroup group = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Study group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        boolean isMember = group.getCurrentMembers() != null && group.getCurrentMembers().stream()
                .anyMatch(m -> m.getId().equals(userId));
        if (!isMember) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You are not a member of this group");
        }

        group.getCurrentMembers().removeIf(m -> m.getId().equals(user.getId()));
        studyGroupRepository.save(group);
    }
}
