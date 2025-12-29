package com.StudyConnect.mappers;

import com.StudyConnect.dtos.SessionDto;
import com.StudyConnect.model.Session;

import java.util.List;

// import org.mapstruct.Mapper;

// @Mapper(componentModel = "spring")
public interface SessionMapper {

    public static SessionDto toSessionDto(Session session) {
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

    public static List<SessionDto> toSessionDtoList(List<Session> sessions) {
        return sessions.stream().map(SessionMapper::toSessionDto).toList();
    }

}
