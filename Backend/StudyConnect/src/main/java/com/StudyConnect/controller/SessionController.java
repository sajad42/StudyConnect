package com.StudyConnect.controller;

import com.StudyConnect.dtos.SessionDto;
import com.StudyConnect.model.StudyGroup;
import com.StudyConnect.model.User;
import com.StudyConnect.repository.StudyGroupRepository;
import com.StudyConnect.service.SessionService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/sessions")
public class SessionController {

    @Autowired
    private final SessionService sessionService;

    private final StudyGroupRepository studyGroupRepository;

    @PostMapping
    public ResponseEntity<SessionDto> createSession(
            @AuthenticationPrincipal User currentUser,
            @RequestBody SessionDto request) {

        StudyGroup studyGroup = studyGroupRepository.findById(request.getStudyGroupId()).orElse(null);
        if (studyGroup == null) {
            return ResponseEntity.badRequest().build();
        }

        SessionDto createdSession = sessionService.createSession(request, studyGroup);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createdSession);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionDto> getSessionById(
            @AuthenticationPrincipal User currenUser,
            @PathVariable Long id) {

        SessionDto sessionDto = sessionService.findSessionById(id);
        // check if the session was found if not it sends back a not found.
        if (sessionDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(sessionService.findSessionById(id));

    }

    @PutMapping("/{id}")
    public ResponseEntity<SessionDto> putMethodName(
            @AuthenticationPrincipal User currenUser,
            @PathVariable Long id,
            @RequestBody SessionDto request) {

        StudyGroup studyGroup = studyGroupRepository.findById(request.getStudyGroupId()).orElse(null);
        if (studyGroup == null) {
            return ResponseEntity.notFound().build();
        }

        Optional<SessionDto> updated = sessionService.updateSession(id, request, currenUser);

        return updated
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        boolean deleted = sessionService.deleteSession(id, currentUser);

        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

}
