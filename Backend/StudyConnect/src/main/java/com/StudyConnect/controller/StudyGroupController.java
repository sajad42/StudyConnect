package com.StudyConnect.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.StudyConnect.dtos.StudyGroupCreateRequest;
import com.StudyConnect.dtos.StudyGroupDto;
import com.StudyConnect.dtos.StudyGroupWithSessionDto;
import com.StudyConnect.model.User;
import com.StudyConnect.service.StudyGroupService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/groups")
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class StudyGroupController {

    @Autowired
    private StudyGroupService studyGroupService;

    @PostMapping
    public ResponseEntity<StudyGroupWithSessionDto> createGroup(
            @AuthenticationPrincipal User currentUser,
            @RequestBody StudyGroupCreateRequest request) {
        StudyGroupWithSessionDto createdGroup = studyGroupService.createGroupWithInitialSession(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGroup);
    }

    @PostMapping("/{studyGroupId}/join")
    public ResponseEntity<Void> joinStudyGroup(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long studyGroupId) {

        try {
            studyGroupService.joinStudyGroup(studyGroupId, currentUser.getId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Controller error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{studyGroupId}/leave")
    public ResponseEntity<Void> leaveStudyGroup(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long studyGroupId) {

        try {
            studyGroupService.leaveStudyGroup(studyGroupId, currentUser.getId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Controller error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<StudyGroupWithSessionDto>> getAllGroups(@AuthenticationPrincipal User currentUser) {
        try {
            List<StudyGroupWithSessionDto> groups = studyGroupService.getAllGroups(currentUser);
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            System.err.println("Controller error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<List<StudyGroupWithSessionDto>> getUserGroups(@AuthenticationPrincipal User currentUser) {
        try {
            List<StudyGroupWithSessionDto> groups = studyGroupService.getUserGroups(currentUser);
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            System.err.println("Controller error in getUserGroups: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyGroupWithSessionDto> getGroupById(@PathVariable Long id) {
        return ResponseEntity.ok(studyGroupService.getGroupById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @studyGroupService.isOwner(#id, authentication.principal.id)")
    public ResponseEntity<StudyGroupDto> updateGroup(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser,
            @RequestBody StudyGroupDto request) {

        Optional<StudyGroupDto> updated = studyGroupService.updateStudyGroup(id, currentUser, request);

        return updated
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // @PreAuthorize("hasRole('ADMIN') or @studyGroupService.isOwner(#id,
    // authentication.principal.id)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        boolean deleted = studyGroupService.deleteStudyGroup(currentUser, id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

}