package com.StudyConnect.dtos;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class SessionDto {

    private Long id;
    private String title;
    private LocalDateTime dateTime;
    private String location;
    private boolean isOnline;
    private Long studyGroupId;
    private String studyGroupTitle;

}
