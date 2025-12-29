package com.StudyConnect.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class User implements UserDetails {

    @Id
    @GeneratedValue
    private Long id;
    private String firstName;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;
    private String password;
    private String university;
    private String major;
    private String year;
    private String bio;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToMany(mappedBy = "currentMembers")
    @Builder.Default
    private Set<StudyGroup> studyGroups = new HashSet<>();

    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(role.getAuthority()));

        // Simple permission system
        if (role == Role.ADMIN) {
            authorities.add(new SimpleGrantedAuthority("PERMISSION_MANAGE_ALL"));
            authorities.add(new SimpleGrantedAuthority("PERMISSION_DELETE_ANY"));
        }

        authorities.add(new SimpleGrantedAuthority("PERMISSION_MANAGE_OWN"));

        return authorities;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // or add your own logic
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // or add your own logic
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // or add your own logic
    }

    @Override
    public boolean isEnabled() {
        return true; // or add your own logic
    }
}
