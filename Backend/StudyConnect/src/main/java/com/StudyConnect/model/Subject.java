package com.StudyConnect.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Entity
public class Subject {

    @Id
    @GeneratedValue
    private Long id;
    private String name;

    public Subject() {
    }
}
