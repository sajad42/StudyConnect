package com.StudyConnect.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.ManyToMany;
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
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "study_group_seq")
    @SequenceGenerator(name = "study_group_seq", sequenceName = "study_group_sequence", allocationSize = 1)
    private Long id;

    private String title;
    private String location;
    private Integer maxMembers;

    @ElementCollection
    private String[] tags;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User createdBy;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "studygroup_members", joinColumns = @JoinColumn(name = "studygroup_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JsonIgnoreProperties("studyGroups")
    @Builder.Default
    private Set<User> currentMembers = new HashSet<>();

    @OneToMany(mappedBy = "studyGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Session> sessions;

    public void addMember(User user) {
        // Initialize collections if null
        if (this.currentMembers == null) {
            this.currentMembers = new HashSet<>();
        }
        if (user.getStudyGroups() == null) {
            user.setStudyGroups(new HashSet<>());
        }

        // Create new collections to avoid Hibernate proxy issues
        Set<User> newMembers = new HashSet<>(this.currentMembers);
        newMembers.add(user);
        this.currentMembers = newMembers;

    }

}
