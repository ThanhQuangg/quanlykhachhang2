package com.API.API.repository;

import com.API.API.model.EventNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventNotificationRepository extends JpaRepository<EventNotification, Integer> {

    @Query("SELECT n.eventUser.eventUserId FROM EventNotification n")
    List<Integer> findAllEventUserIdsWithNotifications();
    Page<EventNotification> findAll(Pageable pageable);

    @Query("SELECT en FROM EventNotification en WHERE " +
            "(:eventUserID IS NULL OR en.eventUser.eventUserId = :eventUserID) AND " +
            "(:method IS NULL OR en.method = :method) AND " +
            "(:status IS NULL OR en.status = :status) AND " +
            "(:eventName IS NULL OR en.eventName LIKE %:eventName%) AND " +
            "(:eventDate IS NULL OR en.eventDate = :eventDate) AND " +
            "(:location IS NULL OR en.location LIKE %:location%)")
    List<EventNotification> searchEventNotifications(
            @Param("eventUserID") Integer eventUserID,
            @Param("method") EventNotification.Method method,
            @Param("status") EventNotification.Status status,
            @Param("eventName") String eventName,
            @Param("eventDate") LocalDate eventDate,
            @Param("location") String location
    );
}
