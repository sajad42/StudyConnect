package com.StudyConnect.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
                if (request.getEmail() == null || request.getEmail().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
                }
                if (request.getPassword() == null || request.getPassword().length() < 6) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "Password must be at least 6 characters long");
                }

                String normalizedEmail = request.getEmail().trim().toLowerCase();
                if (repository.existsByEmailIgnoreCase(normalizedEmail)) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT,
                                        "An account with this email already exists");
                }

                var user = User.builder()
                                .firstName(request.getFirstName() != null ? request.getFirstName().trim() : "")
                                .lastName(request.getLastName() != null ? request.getLastName().trim() : "")
                                .email(normalizedEmail)
                                .password(passwordEncoder.encode(request.getPassword()))
                                .university(request.getUniversity() != null ? request.getUniversity().trim() : null)
                                .major(request.getMajor() != null ? request.getMajor().trim() : null)
                                .year(request.getYear() != null ? request.getYear().trim() : null)
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
                String normalizedEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                normalizedEmail,
                                                request.getPassword()));

                var user = repository.findByEmailIgnoreCase(normalizedEmail)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                                                "Invalid email or password"));

                var jwtToken = jwtService.generateToken(user);

                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .user(userMapper.toDto(user))
                                .expiresIn(86400000)
                                .build();
        }
}
