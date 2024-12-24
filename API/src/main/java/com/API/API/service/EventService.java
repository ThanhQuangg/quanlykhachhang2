package com.API.API.service;

import com.API.API.model.Event;
import com.API.API.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // Retrieve all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Retrieve an event by ID
    public Optional<Event> getEventById(Integer id) {
        return eventRepository.findById(id);
    }

    // Create a new event
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    // Update an event
    public Event updateEvent(Integer id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));

        event.setEventType(eventDetails.getEventType());
        event.setEventDate(eventDetails.getEventDate());
        event.setDescription(eventDetails.getDescription());
        event.setReminderDate(eventDetails.getReminderDate());
        event.setReminderSent(eventDetails.getReminderSent());
        event.setStatus(eventDetails.getStatus());

        return eventRepository.save(event);
    }

    // Delete an event
    public void deleteEvent(Integer id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with ID: " + id);
        }
        eventRepository.deleteById(id);
    }

    // Retrieve events by user ID
    public List<Event> getEventsByUserId(Integer userId) {
        return eventRepository.findDistinctByAssignedUsersUserId(userId);
    }

    public Page<Event> getPaginatedEvents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Tạo Pageable
        return eventRepository.findAll(pageable);
    }

    public List<Event> searchEvents(Integer eventTypeId, LocalDate eventDate, Event.EventStatus status, Boolean reminderSent, String description) {
        return eventRepository.searchEvents(eventTypeId, eventDate, status, reminderSent, description);
    }
}

