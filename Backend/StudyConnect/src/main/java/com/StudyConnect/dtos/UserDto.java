package com.StudyConnect.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.StudyConnect.model.Role;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String university;
    private String major;
    private String year;
    private String bio;
    private LocalDateTime createdAt;

    private Role role;
}