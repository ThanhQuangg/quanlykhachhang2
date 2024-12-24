package com.API.API.dto;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public class UpdateNotificationRequest {
    private String message;
    private LocalDateTime sentAt;
    private List<String> attachmentPaths;  // Renamed field to hold list of attachment paths (can be images or other files)
    private String eventName;
    private String eventDescription;
    private String  eventDate;
    private String location;

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public List<String> getAttachmentPaths() {
        return attachmentPaths;
    }

    public void setAttachmentPaths(List<String> attachmentPaths) {
        this.attachmentPaths = attachmentPaths;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public String   getEventDate() {
        return eventDate;
    }

    public void setEventDate(String   eventDate) {
        this.eventDate = eventDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
