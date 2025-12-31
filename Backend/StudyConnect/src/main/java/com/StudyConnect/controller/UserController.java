package com.StudyConnect.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.StudyConnect.dtos.ChangePasswordRequest;
import com.StudyConnect.dtos.StudyGroupDto;
import com.StudyConnect.dtos.UserDto;
import com.StudyConnect.mappers.UserMapper;
import com.StudyConnect.model.Subject;
import com.StudyConnect.model.User;
import com.StudyConnect.service.UserService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserDto>> getUsers() {
        List<UserDto> users = userService.getUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null || userDetails.getUsername() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        Optional<UserDto> dto = userService.getProfile(userDetails.getUsername());
        return dto.map(ResponseEntity::ok)
                  .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @GetMapping("/me/groups")
    public ResponseEntity<List<StudyGroupDto>> getMyGroups(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null || userDetails.getUsername() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        List<StudyGroupDto> groups = userService.getUserStudyGroup(userDetails.getUsername());
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/me/subjects")
    public ResponseEntity<List<Subject>> getMySubjects(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null || userDetails.getUsername() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        List<Subject> subjectsOfInterest = userService.getUsersubjectsOfInterest(userDetails.getUsername());
        return ResponseEntity.ok(subjectsOfInterest);
    }

    @PutMapping("/me/update")
    public ResponseEntity<UserDto> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserDto updatedUserDto) {
        if (userDetails == null || userDetails.getUsername() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        User updatedEntity = userMapper.toEntity(updatedUserDto);
        Optional<UserDto> updated = userService.updateUser(userDetails.getUsername(), updatedEntity);

        return updated.map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
    @PutMapping("/me/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChangePasswordRequest request) {
        boolean changed = userService.changePassword(userDetails.getUsername(), request.getOldPassword(),
                request.getNewPassword());
        if (changed) {
            return ResponseEntity.ok("Password updated sucsseful");
        } else {
            return ResponseEntity.badRequest().body("Old password is incorrect.");
        }
    }
}