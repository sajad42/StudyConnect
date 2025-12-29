package com.StudyConnect.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.StudyConnect.dtos.SessionDto;
import com.StudyConnect.dtos.StudyGroupCreateRequest;
import com.StudyConnect.dtos.StudyGroupDto;
import com.StudyConnect.dtos.StudyGroupWithSessionDto;
import com.StudyConnect.mappers.StudyGroupMapper;
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
        // Add logging here
        System.out.println("isOwner called with groupId: " + studyGroupId + ", userId: " + userId);
        return studyGroupRepository.findById(studyGroupId)
                .map(group -> group.getCreatedBy().getId().equals(userId))
                .orElse(false);
    }

    @Transactional
    public StudyGroupWithSessionDto createGroupWithInitialSession(User currentUser, StudyGroupCreateRequest req) {
        Subject subject = getOrCreateSubject(req.getSubject());

        StudyGroup group = buildStudyGroup(currentUser, req, subject);
        StudyGroup savedGroup = studyGroupRepository.save(group);

        SessionDto sessionDto = createSessionIfRequested(req, savedGroup);
        List<SessionDto> sessions = sessionDto != null ? List.of(sessionDto) : List.of();

        return StudyGroupMapper.toGroupWithSessionDto(savedGroup, sessions);
    }

    private Subject getOrCreateSubject(String subjectName) {
        return subjectRepository.findByName(subjectName)
                .orElseGet(() -> subjectRepository.save(
                        Subject.builder().name(subjectName).build()));
    }

    private StudyGroup buildStudyGroup(User creator, StudyGroupCreateRequest req, Subject subject) {
        return StudyGroup.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .tags(req.getTags())
                .createdBy(creator)
                .maxMembers(req.getMaxMembers())
                .subject(subject)
                .currentMembers(Set.of(creator))
                .build();
    }

    private SessionDto createSessionIfRequested(StudyGroupCreateRequest req, StudyGroup group) {
        if (req.getSessionTitle() == null || req.getSessionDateTime() == null || req.getSessionLocation() == null) {
            return null;
        }

        Session session = Session.builder()
                .studyGroup(group)
                .title(req.getSessionTitle())
                .dateTime(req.getSessionDateTime())
                .location(req.getSessionLocation())
                .isOnline(req.getIsOnline() != null ? req.getIsOnline() : false)
                .build();

        return StudyGroupMapper.toSessionDto(studySessionRepository.save(session));
    }

    @Transactional(readOnly = true)
    public List<StudyGroupWithSessionDto> getUserGroups(User currentUser) {
        try {
            List<StudyGroup> groups = studyGroupRepository.findByCurrentMembersContaining(currentUser);
            List<StudyGroupWithSessionDto> result = new ArrayList<>();

            for (StudyGroup group : groups) {
                try {
                    StudyGroupWithSessionDto dto = new StudyGroupWithSessionDto();
                    dto.setId(group.getId());
                    dto.setTitle(group.getTitle());
                    dto.setDescription(group.getDescription());
                    dto.setSubject(group.getSubject() != null ? group.getSubject().getName() : null);
                    dto.setTags(group.getTags() != null ? group.getTags() : new String[0]);
                    dto.setCreatedBy(group.getCreatedBy() != null ? group.getCreatedBy().getId() : null);
                    dto.setMaxMembers(group.getMaxMembers());
                    dto.setCurrentMembers(group.getCurrentMembers() != null ? group.getCurrentMembers().size() : 0);

                    List<Session> sessions = studySessionRepository.findByStudyGroupId(group.getId());
                    List<SessionDto> sessionDtos = new ArrayList<>();
                    for (Session session : sessions) {
                        SessionDto sessionDto = new SessionDto();
                        sessionDto.setId(session.getId());
                        sessionDto.setTitle(session.getTitle());
                        sessionDto.setDateTime(session.getDateTime());
                        sessionDto.setLocation(session.getLocation());
                        sessionDtos.add(sessionDto);
                    }
                    dto.setSessions(sessionDtos);
                    result.add(dto);
                } catch (Exception e) {
                    System.err.println("Error processing group " + group.getId() + ": " + e.getMessage());
                    continue;
                }
            }
            return result;
        } catch (Exception e) {
            System.err.println("Error in getUserGroups: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Transactional(readOnly = true)
    public List<StudyGroupWithSessionDto> getAllGroups() {
        try {
            List<StudyGroup> groups = studyGroupRepository.findAll(); // Use simple findAll instead
            List<StudyGroupWithSessionDto> result = new ArrayList<>();

            for (StudyGroup group : groups) {
                try {
                    StudyGroupWithSessionDto dto = new StudyGroupWithSessionDto();

                    // Set basic fields safely
                    dto.setId(group.getId());
                    dto.setTitle(group.getTitle());
                    dto.setDescription(group.getDescription());

                    // Handle subject safely
                    if (group.getSubject() != null) {
                        dto.setSubject(group.getSubject().getName());
                    } else {
                        dto.setSubject(null);
                    }

                    // Handle tags safely - create new array to avoid concurrent modification
                    if (group.getTags() != null) {
                        String[] safeTags = new String[group.getTags().length];
                        System.arraycopy(group.getTags(), 0, safeTags, 0, group.getTags().length);
                        dto.setTags(safeTags);
                    } else {
                        dto.setTags(new String[0]);
                    }

                    // Handle creator safely
                    if (group.getCreatedBy() != null) {
                        dto.setCreatedBy(group.getCreatedBy().getId());
                    }

                    dto.setMaxMembers(group.getMaxMembers());

                    // Handle current members count safely
                    if (group.getCurrentMembers() != null) {
                        dto.setCurrentMembers(group.getCurrentMembers().size());
                    } else {
                        dto.setCurrentMembers(0);
                    }

                    // Handle sessions
                    List<Session> sessions = studySessionRepository.findByStudyGroupId(group.getId());
                    List<SessionDto> sessionDtos = new ArrayList<>();

                    for (Session session : sessions) {
                        SessionDto sessionDto = new SessionDto();
                        sessionDto.setId(session.getId());
                        sessionDto.setTitle(session.getTitle());
                        sessionDto.setDateTime(session.getDateTime());
                        sessionDto.setLocation(session.getLocation());
                        sessionDtos.add(sessionDto);
                    }

                    dto.setSessions(sessionDtos);
                    result.add(dto);

                } catch (Exception e) {
                    // Skip this group if there's an issue
                    System.err.println("Error processing group " + group.getId() + ": " + e.getMessage());
                    continue;
                }
            }

            return result;

        } catch (Exception e) {
            System.err.println("Error in getAllGroups: " + e.getMessage());
            return new ArrayList<>(); // Return empty list instead of throwing exception
        }
    }

    public StudyGroupWithSessionDto getGroupById(Long id) {
        StudyGroup group = studyGroupRepository.findById(id).orElseThrow();
        List<Session> sessions = studySessionRepository.findByStudyGroupId(group.getId());
        List<SessionDto> sessionDtos = sessions.stream()
                .map(StudyGroupMapper::toSessionDto)
                .collect(Collectors.toList());
        return toGroupWithSessionDto(group, sessionDtos);
    }

    public Optional<StudyGroupDto> updateStudyGroup(Long id, User currentUser, StudyGroupDto updateStudyGroup) {
        return studyGroupRepository.findById(id)
                .filter(studyGroup -> studyGroup.getCreatedBy().getId().equals(currentUser.getId()))
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

    public boolean deleteStudyGroup(User currentUser, Long id) {

        System.out.println("Delete study group called with ID: " + id);
        System.out.println("Current user ID: " + currentUser.getId());

        // Check if group exists first test
        Optional<StudyGroup> groupOpt = studyGroupRepository.findById(id);
        if (groupOpt.isEmpty()) {
            System.out.println("Group with ID " + id + " not found!");
            return false;
        }

        StudyGroup group = groupOpt.get();
        System.out.println("Found group: " + group.getTitle());
        System.out.println("Group created by: " + group.getCreatedBy().getId());

        return studyGroupRepository.findById(id)
                .filter(studyGroup -> {
                    System.out.println("Filter check - Owner: " + studyGroup.getCreatedBy().getId() + ", Current: "
                            + currentUser.getId());
                    return studyGroup.getCreatedBy().getId().equals(currentUser.getId());
                })
                .map(studyGroup -> {
                    try {
                        System.out.println("Starting delete operations...");

                        System.out.println("Step 1: Clearing members...");
                        studyGroup.getCurrentMembers().clear();

                        System.out.println("Step 2: Saving group...");
                        studyGroupRepository.save(studyGroup);

                        System.out.println("Step 3: Deleting group...");
                    studyGroupRepository.delete(studyGroup);

                        System.out.println("Delete completed successfully");
                    return true;
                    } catch (Exception e) {
                        System.err.println("Error during delete: " + e.getClass().getSimpleName());
                        System.err.println("Error message: " + e.getMessage());
                        e.printStackTrace();
                        throw e;
                    }
                }).orElse(false);
    }

    // boolean b = studyGroupRepository.findById(id)
    // .filter(studyGroup ->
    // studyGroup.getCreatedBy().getId().equals(currentUser.getId()))
    // .map(studyGroup -> {

    // // Clear member relationships to avoid constraint violation
    // studyGroup.getCurrentMembers().clear();
    // studyGroupRepository.save(studyGroup);

    // studyGroupRepository.delete(studyGroup);
    // return true;
    // }).orElse(false);
    // return b;
    // }

    @Transactional
    public void joinStudyGroup(Long studyGroupId, Long userId) {
        StudyGroup group = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new RuntimeException("Study group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (group.getCurrentMembers() == null) {
            group.setCurrentMembers(new HashSet<>());
        }

        if (group.getCurrentMembers().size() >= group.getMaxMembers()) {
            throw new RuntimeException("Study group is full");
        }
        // Check if user is already a member
        // if (group.getCurrentMembers().contains(user)) {
        // throw new RuntimeException("User is already a member of this group");
        // }

        group.getCurrentMembers().add(user);
        studyGroupRepository.save(group);
    }
}