package com.StudyConnect.mappers;

import com.StudyConnect.dtos.SessionDto;
import com.StudyConnect.dtos.StudyGroupDto;
import com.StudyConnect.dtos.StudyGroupWithSessionDto;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StudyGroupWithSessionMapper {

    StudyGroupWithSessionDto toDto(StudyGroupDto studyGroup, SessionDto session);

}
