package com.StudyConnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.StudyConnect.model.StudyGroup;
import com.StudyConnect.model.User;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {

    // StudyGroup findByCreatedBy(Long id);

    @Query("SELECT DISTINCT sg FROM StudyGroup sg LEFT JOIN FETCH sg.currentMembers cm LEFT JOIN FETCH sg.subject LEFT JOIN FETCH sg.createdBy")
    List<StudyGroup> findAllWithMembers();

    @Query("SELECT COUNT(cm) FROM StudyGroup sg JOIN sg.currentMembers cm WHERE sg.id = :groupId")
    int countMembersByGroupId(@Param("groupId") Long groupId);

    List<StudyGroup> findByCurrentMembersContaining(User user);

}
