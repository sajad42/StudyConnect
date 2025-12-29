package com.StudyConnect.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.StudyConnect.config.JwtService;
import com.StudyConnect.mappers.UserMapper;
import com.StudyConnect.model.Role;
import com.StudyConnect.model.User;
import com.StudyConnect.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final UserMapper userMapper;

        public AuthenticationResponse register(RegisterRequest request) {
                var user = User.builder()
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .university(request.getUniversity())
                                .major(request.getMajor())
                                .year(request.getYear())
                                .role(Role.USER)
                                .build();

                repository.save(user);

                var jwtToken = jwtService.generateToken(user);

                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .user(userMapper.toDto(user))
                                .expiresIn(86400000) // 24 hours
                                .build();
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));

                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                var jwtToken = jwtService.generateToken(user);

                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .user(userMapper.toDto(user))
                                .expiresIn(86400000)
                                .build();
        }
}