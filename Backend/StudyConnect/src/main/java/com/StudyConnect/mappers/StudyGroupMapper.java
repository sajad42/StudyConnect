package com.StudyConnect.mappers;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.StudyConnect.dtos.SessionDto;
import com.StudyConnect.dtos.StudyGroupDto;
import com.StudyConnect.dtos.StudyGroupWithSessionDto;
import com.StudyConnect.model.StudyGroup;
import com.StudyConnect.model.Session;

public interface StudyGroupMapper {

    public static StudyGroupDto toStudyGroupDto(StudyGroup group) {
        if (group == null) return null;
        StudyGroupDto dto = new StudyGroupDto();
        dto.setId(group.getId());
        dto.setTitle(group.getTitle());
        dto.setDescription(group.getDescription());
        dto.setSubject(group.getSubject() != null ? group.getSubject().getName() : null);
        dto.setTags(group.getTags() != null ? group.getTags() : new String[0]);
        dto.setCreatedBy(group.getCreatedBy() != null ? group.getCreatedBy().getId() : null);
        dto.setMaxMembers(group.getMaxMembers());
        dto.setCurrentMembers(group.getCurrentMembers() != null ? group.getCurrentMembers().size() : 0);
        return dto;
    }

    public static List<StudyGroupDto> toDto(List<StudyGroup> groups) {
        if (groups == null || groups.isEmpty()) return Collections.emptyList();
        return groups.stream()
                .filter(Objects::nonNull)
                .map(StudyGroupMapper::toStudyGroupDto)
                .collect(Collectors.toList());
    }

    public static StudyGroupWithSessionDto toGroupWithSessionDto(StudyGroup group, List<SessionDto> sessionDtos) {
        if (group == null) return null;
        StudyGroupWithSessionDto dto = new StudyGroupWithSessionDto();
        dto.setId(group.getId());
        dto.setTitle(group.getTitle());
        dto.setDescription(group.getDescription());
        dto.setSubject(group.getSubject() != null ? group.getSubject().getName() : null);
        dto.setTags(group.getTags() != null ? group.getTags() : new String[0]);
        dto.setCreatedBy(group.getCreatedBy() != null ? group.getCreatedBy().getId() : null);
        dto.setMaxMembers(group.getMaxMembers());
        dto.setCurrentMembers(group.getCurrentMembers() != null ? group.getCurrentMembers().size() : 0);
        dto.setSessions(sessionDtos != null ? sessionDtos : Collections.emptyList());
        return dto;
    }

    public static SessionDto toSessionDto(Session session) {
        if (session == null) return null;
        SessionDto dto = new SessionDto();
        dto.setId(session.getId());
        dto.setTitle(session.getTitle());
        dto.setDateTime(session.getDateTime());
        dto.setLocation(session.getLocation());
        dto.setOnline(session.isOnline());
        if (session.getStudyGroup() != null) {
            dto.setStudyGroupId(session.getStudyGroup().getId());
            dto.setStudyGroupTitle(session.getStudyGroup().getTitle());
        }
        return dto;
    }
}
