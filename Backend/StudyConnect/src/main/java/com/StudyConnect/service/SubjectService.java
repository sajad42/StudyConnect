package com.StudyConnect.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.StudyConnect.model.Subject;
import com.StudyConnect.repository.SubjectRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public Subject insertSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public List<Subject> getAllSubjects() {
        try {
            return subjectRepository.findAll();
        } catch (Exception e) {
            System.err.println("Service error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
