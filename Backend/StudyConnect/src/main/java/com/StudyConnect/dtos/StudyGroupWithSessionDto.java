package com.StudyConnect.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudyGroupWithSessionDto extends StudyGroupDto {

    private List<SessionDto> sessions;
}