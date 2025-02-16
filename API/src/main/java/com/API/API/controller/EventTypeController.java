package com.API.API.controller;

import com.API.API.model.EventType;
import com.API.API.model.User;
import com.API.API.service.EventTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/event-types")
public class EventTypeController {

    @Autowired
    private EventTypeService eventTypeService;

    // GET: /api/event-types
    @GetMapping
    public List<EventType> getAllEventTypes() {
        return eventTypeService.getAllEventTypes();
    }

    // GET: /api/event-types/{id}
    @GetMapping("/{id}")
    public ResponseEntity<EventType> getEventTypeById(@PathVariable Integer id) {
        Optional<EventType> eventType = eventTypeService.getEventTypeById(id);
        return eventType.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<EventType>> getPaginatedEventTypes(
            @RequestParam(defaultValue = "0") int page,  // Trang mặc định là 0
            @RequestParam(defaultValue = "10") int size // Kích thước mặc định là 10
    ) {
        Page<EventType> paginatedEventTypes = eventTypeService.getPaginatedEventTypes(page, size);
        return ResponseEntity.ok(paginatedEventTypes);
    }

    // POST: /api/event-types
    @PostMapping
    public EventType createEventType(@RequestBody EventType eventType) {
        return eventTypeService.createEventType(eventType);
    }

    // PUT: /api/event-types/{id}
    @PutMapping("/{id}")
    public ResponseEntity<EventType> updateEventType(@PathVariable Integer id, @RequestBody EventType eventType) {
        try {
            EventType updatedEventType = eventTypeService.updateEventType(id, eventType);
            return ResponseEntity.ok(updatedEventType);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: /api/event-types/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEventType(@PathVariable Integer id) {
        eventTypeService.deleteEventType(id);
        return ResponseEntity.noContent().build();
    }
}
