package com.StudyConnect.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.StudyConnect.model.Session;
import com.StudyConnect.model.StudyGroup;

public interface SessionRepository extends JpaRepository<Session, Integer> {

    Optional<Session> findByLocation(String location);

    Optional<Session> findById(Long sessionId);

    boolean deleteById(Long sessionId);

    List<Session> findByStudyGroupId(Long studyGroupId);

    Optional<Session> findByStudyGroup(StudyGroup studyGroup);

    void deleteByStudyGroup(StudyGroup studyGroup);

    @Modifying
    @Transactional
    @Query("DELETE FROM Session s WHERE s.studyGroup.id = :groupId")
    void deleteByStudyGroupId(@Param("groupId") Long groupId);

}
