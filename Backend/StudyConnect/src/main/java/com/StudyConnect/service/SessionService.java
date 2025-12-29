package com.StudyConnect.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.StudyConnect.dtos.SessionDto;
import com.StudyConnect.model.Session;
import com.StudyConnect.model.StudyGroup;
import com.StudyConnect.model.User;
import com.StudyConnect.repository.SessionRepository;

import lombok.AllArgsConstructor;

import static com.StudyConnect.mappers.SessionMapper.*;

@AllArgsConstructor
@Service
public class SessionService {

    private final SessionRepository sessionRepository;

    public SessionDto createSession(SessionDto request, StudyGroup studyGroup) {
        Session session = new Session();
        session.setTitle(request.getTitle());
        session.setDateTime(request.getDateTime());
        session.setLocation(request.getLocation());
        session.setOnline(request.isOnline());
        session.setStudyGroup(studyGroup);

        return toSessionDto(sessionRepository.save(session));

    }

    public Optional<SessionDto> updateSession(Long id, SessionDto upDateSession, User currentUser) {
        System.out.println();
        return sessionRepository.findById(id)
                .filter(session -> session.getStudyGroup().getCreatedBy().getId().equals(currentUser.getId()))
                .map(session -> {
                    session.setTitle(upDateSession.getTitle());
                    session.setDateTime(upDateSession.getDateTime());
                    session.setLocation(upDateSession.getLocation());
                    session.setOnline(upDateSession.isOnline());
                    return toSessionDto(sessionRepository.save(session));
                });
    }

    public boolean deleteSession(Long sessionId, User currentUser) {
        return sessionRepository.findById(sessionId)
                .filter(session -> session.getStudyGroup().getCreatedBy().getId().equals(currentUser.getId()))
                .map(session -> {
                    sessionRepository.delete(session);
                    return true;
                })
                .orElse(false);
    }

    public SessionDto findSessionById(Long sessionId) {
        return toSessionDto(sessionRepository.findById(sessionId).orElse(null));
    }

    // not used yet
    public Session findSessionByLocation(String location) {
        return sessionRepository.findByLocation(location).orElse(null);
    }

    // not used yet
    public List<Session> findSessionByStudyGroup(Long studyGroupId) {

        return sessionRepository.findByStudyGroupId(studyGroupId);
    }

    // not used yet
    public Iterable<Session> findAllSessions() {
        return sessionRepository.findAll();
    }
}
