package com.StudyConnect.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.StudyConnect.model.StudyGroup;
import com.StudyConnect.model.User;
import com.StudyConnect.repository.UserRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean isUserExistsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<List<StudyGroup>> getUserStudyGroup(String email) {
        return userRepository.findByEmail(email)
                .map(user -> user.getStudyGroups().stream().collect(Collectors.toList()));
    }

    public Optional<User> updateUser(String email, User updatedUser) {
        return userRepository.findByEmail(email).map(user -> {

            if (updatedUser.getFirstName() != null)
                user.setFirstName(updatedUser.getFirstName());
            if (updatedUser.getLastName() != null)
                user.setLastName(updatedUser.getLastName());
            if (updatedUser.getUniversity() != null)
                user.setUniversity(updatedUser.getUniversity());
            if (updatedUser.getMajor() != null)
                user.setMajor(updatedUser.getMajor());
            if (updatedUser.getYear() != null)
                user.setYear(updatedUser.getYear());
            if (updatedUser.getBio() != null)
                user.setBio(updatedUser.getBio());
            // Do NOT update email, password, or role here for security reasons
            return userRepository.save(user);
        });
    }

    public boolean changePassword(String email, String oldPassword, String newPassword) {
        return userRepository.findByEmail(email).map(user -> {
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return false; // Old password does not match
            }
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return true;
        }).orElse(false);

    }
}