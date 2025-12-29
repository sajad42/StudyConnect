package com.StudyConnect.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudyGroupCreateRequest {
    private String title;
    private String description;
    private String subject;
    private String[] tags;
    private Long createdBy;
    private boolean isPrivate;
    private int maxMembers;

    // Session details (optional)
    private String sessionTitle;
    private LocalDateTime sessionDateTime;
    private String sessionLocation;
    private Boolean isOnline;
}
