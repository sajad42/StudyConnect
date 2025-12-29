package com.StudyConnect.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Session {

    @Id
    @GeneratedValue
    private Long id;

    private String title;
    private LocalDateTime dateTime;
    private String location;
    private boolean isOnline;

    @ManyToOne
    @JoinColumn(name = "study_group_id")
    private StudyGroup studyGroup;
}
