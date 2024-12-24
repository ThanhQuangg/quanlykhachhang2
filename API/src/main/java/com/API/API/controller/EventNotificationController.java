package com.API.API.controller;

import com.API.API.dto.ResponseMessage;
import com.API.API.dto.UpdateNotificationRequest;
import com.API.API.model.EventNotification;
import com.API.API.model.User;
import com.API.API.service.EventNotificationService;
import com.API.API.service.FileUploadService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class EventNotificationController {

    @Autowired
    private EventNotificationService notificationService;

    @Autowired
    private FileUploadService fileUploadService;

    // Lấy tất cả thông báo (bao gồm tự động tạo thông báo nếu chưa tồn tại)
    @GetMapping
    public ResponseEntity<List<EventNotification>> getAllNotifications() {
        List<EventNotification> notifications = notificationService.getAllNotificationsWithEventUserIds();
        return ResponseEntity.ok(notifications);
    }

    // Lấy thông báo chi tiết theo ID
    @GetMapping("/{notificationId}")
    public ResponseEntity<EventNotification> getNotificationById(@PathVariable Integer notificationId) {
        EventNotification notification = notificationService.getNotificationById(notificationId);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<EventNotification>> getPaginatedEventNotifications(
            @RequestParam(defaultValue = "0") int page,  // Trang mặc định là 0
            @RequestParam(defaultValue = "10") int size // Kích thước mặc định là 10
    ) {
        Page<EventNotification> paginatedEventNotifications = notificationService.getNotifications(page, size);
        return ResponseEntity.ok(paginatedEventNotifications);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EventNotification>> searchEventNotifications(
            @RequestParam(required = false) Integer eventUserID,
            @RequestParam(required = false) EventNotification.Method method,
            @RequestParam(required = false) EventNotification.Status status,
            @RequestParam(required = false) String eventName,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate eventDate,
            @RequestParam(required = false) String location
    ) {
        List<EventNotification> notifications = notificationService.searchEventNotifications(eventUserID, method, status, eventName, eventDate, location);
        return ResponseEntity.ok(notifications);
    }

    // API để gửi thông báo (cho phép gửi nhiều loại tệp đính kèm)
    @PutMapping("/{notificationId}/send")
    public ResponseEntity<?> sendNotification(
            @PathVariable Integer notificationId,
            @RequestParam String message,
            @RequestParam String sentAt,
            @RequestParam String eventName,
            @RequestParam String eventDescription,
            @RequestParam String eventDate,
            @RequestParam String location,
            @RequestParam(value = "attachments", required = false) List<MultipartFile> attachments) {
        try {
            // Parse sentAt to LocalDateTime
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            LocalDateTime parsedSentAt = LocalDateTime.parse(sentAt, formatter);

            // Chuyển đổi eventDate từ String sang Date
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date parsedEventDate = dateFormat.parse(eventDate);

            // Create a list to store the paths of uploaded files
            List<String> attachmentPaths = new ArrayList<>();
            if (attachments != null && !attachments.isEmpty()) {
                // Handle each attachment and upload it
                for (MultipartFile attachment : attachments) {
                    String filePath = fileUploadService.uploadFile(attachment); // Upload the file and get its path
                    attachmentPaths.add(filePath);
                }
            }

            // Prepare the notification request
            UpdateNotificationRequest request = new UpdateNotificationRequest();
            request.setMessage(message);
            request.setSentAt(parsedSentAt);
            request.setEventName(eventName);
            request.setEventDescription(eventDescription);
            request.setEventDate(eventDate);
            request.setLocation(location);

            // Send the notification with the attachments
            EventNotification updatedNotification = notificationService.sendNotification(notificationId, request, attachmentPaths);

            // Return a success response with the updated notification
            return ResponseEntity.ok(new ResponseMessage("Thông báo đã gửi thành công", updatedNotification));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ: " + e.getMessage());
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Lỗi khi gửi email: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }


    // Xóa thông báo
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<String> deleteNotification(@PathVariable Integer notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok("Notification deleted successfully.");
    }
}
