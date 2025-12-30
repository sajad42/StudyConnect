package com.StudyConnect.mappers;

import org.springframework.stereotype.Component;

import com.StudyConnect.model.User;

import com.StudyConnect.dtos.UserDto;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setUniversity(user.getUniversity());
        userDto.setMajor(user.getMajor());
        userDto.setYear(user.getYear());
        userDto.setBio(user.getBio());
        userDto.setRole(user.getRole());

        return userDto;
    }

    public User toEntity(UserDto userDto) {
        if (userDto == null) {
            return null;
        }

        return User.builder()
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .email(userDto.getEmail())
                .university(userDto.getUniversity())
                .major(userDto.getMajor())
                .year(userDto.getYear())
                .bio(userDto.getBio())
                .role(userDto.getRole())
                .build();
    }
}