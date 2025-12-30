package com.StudyConnect.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.StudyConnect.dtos.StudyGroupDto;
import com.StudyConnect.dtos.UserDto;
import com.StudyConnect.mappers.StudyGroupMapper;
import com.StudyConnect.mappers.UserMapper;
import com.StudyConnect.model.StudyGroup;
import com.StudyConnect.model.User;
import com.StudyConnect.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean isUserExistsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public Optional<UserDto> getProfile(String email) {
        return userRepository.findByEmail(email).map(userMapper::toDto);
    }

    public List<StudyGroupDto> getUserStudyGroup(String email) {
        List<StudyGroup> groups = userRepository.findByEmail(email)
                .map(User::getStudyGroups)
                .orElseGet(Collections::emptySet)
                .stream()
                .collect(Collectors.toList());

        return StudyGroupMapper.toDto(groups);
    }

    @Transactional
    public Optional<UserDto> updateUser(String email, User updatedUser) {
        return userRepository.findByEmail(email).map(user -> {
            if (updatedUser.getFirstName() != null) user.setFirstName(updatedUser.getFirstName());
            if (updatedUser.getLastName() != null) user.setLastName(updatedUser.getLastName());
            if (updatedUser.getUniversity() != null) user.setUniversity(updatedUser.getUniversity());
            if (updatedUser.getMajor() != null) user.setMajor(updatedUser.getMajor());
            if (updatedUser.getYear() != null) user.setYear(updatedUser.getYear());
            if (updatedUser.getBio() != null) user.setBio(updatedUser.getBio());
            // Keep email/password/role unchanged here for security.
            User saved = userRepository.save(user);
            return userMapper.toDto(saved);
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