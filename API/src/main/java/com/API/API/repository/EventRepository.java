package com.API.API.repository;

import com.API.API.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findDistinctByAssignedUsersUserId(Integer userId);
    Page<Event> findAll(Pageable pageable);

    @Query("SELECT e FROM Event e WHERE " +
            "(:eventTypeId IS NULL OR e.eventType.eventTypeId = :eventTypeId) AND " +
            "(:eventDate IS NULL OR e.eventDate = :eventDate) AND " +
            "(:status IS NULL OR e.status = :status) AND " +
            "(:reminderSent IS NULL OR e.reminderSent = :reminderSent) AND " +
            "(:description IS NULL OR e.description LIKE %:description%)")
    List<Event> searchEvents(
            @Param("eventTypeId") Integer eventTypeId,
            @Param("eventDate") LocalDate eventDate,
            @Param("status") Event.EventStatus status,
            @Param("reminderSent") Boolean reminderSent,
            @Param("description") String description
    );
}
