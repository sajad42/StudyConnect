package com.StudyConnect.dtos;

import com.StudyConnect.model.Subject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudyGroupDto { // GroupDto

    private Long id;
    private String title;
    private String description;
    private String subject;
    private String[] tags;
    private Long createdBy;
    private boolean isPrivate;
    private int maxMembers;
    private int currentMembers;
}
