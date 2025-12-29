package com.StudyConnect.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.StudyConnect.dtos.ChangePasswordRequest;
import com.StudyConnect.model.StudyGroup;
import com.StudyConnect.model.User;
import com.StudyConnect.service.UserService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me/groups")
    public ResponseEntity<List<StudyGroup>> getMyGroups(@AuthenticationPrincipal UserDetails userDetails) {
        List<StudyGroup> groups = userService.getUserStudyGroup(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(groups);

    }

    @PutMapping("/me/update")
    public ResponseEntity<User> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody User updatedUser) {
        User user = userService.updateUser(userDetails.getUsername(), updatedUser)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
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