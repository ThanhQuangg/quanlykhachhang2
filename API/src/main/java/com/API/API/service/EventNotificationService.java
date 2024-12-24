package com.API.API.service;

import com.API.API.dto.UpdateNotificationRequest;
import com.API.API.model.Customer;
import com.API.API.model.Event;
import com.API.API.model.EventNotification;
import com.API.API.repository.EventNotificationRepository;
import com.API.API.repository.EventRepository;
import com.API.API.repository.EventUserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
public class EventNotificationService {

    @Autowired
    private EventNotificationRepository notificationRepository;

    @Autowired
    private EventUserRepository eventUserRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EventRepository eventRepository;

    // Lấy tất cả thông báo, tự động tạo thông báo cho các EventUserID chưa có
    public List<EventNotification> getAllNotificationsWithEventUserIds() {
        List<Integer> allEventUserIds = eventUserRepository.findAllEventUserIds();
        List<Integer> existingNotificationEventUserIds = notificationRepository.findAllEventUserIdsWithNotifications();
        List<Integer> missingEventUserIds = allEventUserIds.stream()
                .filter(id -> !existingNotificationEventUserIds.contains(id))
                .toList();

        for (Integer eventUserId : missingEventUserIds) {
            EventNotification newNotification = new EventNotification();
            newNotification.setEventUser(eventUserRepository.findById(eventUserId).orElseThrow());
            newNotification.setMethod(EventNotification.Method.Email);
            newNotification.setStatus(EventNotification.Status.Pending);
            newNotification.setMessage(null);
            newNotification.setSentAt(null);
            notificationRepository.save(newNotification);
        }

        return notificationRepository.findAll();
    }

    // Gửi thông báo hỗ trợ nhiều tệp đính kèm
    public EventNotification sendNotification(Integer notificationId, UpdateNotificationRequest request, List<String> attachmentPaths) throws MessagingException {
        EventNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification không tồn tại"));

        // Kiểm tra khách hàng
        Customer customer = notification.getEventUser().getCustomer();
        if (customer == null || customer.getEmail() == null || customer.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Khách hàng hoặc email không tồn tại.");
        }

        // Lấy thông tin sự kiện
//        Event event = notification.getEventUser().getEvent();
//        String eventTypeName = event.getEventType().getEventTypeName();
//        String eventDescription = event.getDescription() != null ? event.getDescription() : "Không có mô tả";
//        String eventDate = event.getEventDate() != null ? event.getEventDate().toString() : "Không xác định";


        // Lấy thông tin sự kiện từ request
        Event event = notification.getEventUser().getEvent();
        String eventName = request.getEventName();
        String eventDescription = request.getEventDescription() != null ? request.getEventDescription() : "Không có mô tả";
//        Date eventDate = request.getEventDate() != null ? request.getEventDate() : "Không xác định";
//        Date eventDate = request.getEventDate() != null ? request.getEventDate() : null;
        // Chuyển đổi eventDate từ String sang Date
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date eventDate = null;
        try {
            eventDate = request.getEventDate() != null ? dateFormat.parse(request.getEventDate()) : null;
        } catch (ParseException e) {
            throw new IllegalArgumentException("Định dạng ngày không hợp lệ.");
        }
        String location = request.getLocation() != null ? request.getLocation() : "Không xác định";

        // Lấy email khách hàng
        String toEmail = customer.getEmail();

        // Cập nhật nội dung thông báo
        notification.setMessage(request.getMessage());
        notification.setSentAt(request.getSentAt());
        notification.setStatus(EventNotification.Status.Success);
        notification.setEventName(eventName);
        notification.setEventDescription(eventDescription);
        notification.setEventDate(eventDate);
        notification.setLocation(location);

        // Định dạng ngày theo kiểu dd/MM/yyyy
        SimpleDateFormat outputDateFormat = new SimpleDateFormat("dd/MM/yyyy");
        String formattedEventDate = eventDate != null ? outputDateFormat.format(eventDate) : "Không xác định";

        // Tạo nội dung email
        String subject = "Thông báo sự kiện: " + eventName;
        String body = String.format("""
       <!DOCTYPE html>
                           <html lang="vi">
                           <head>
                               <meta charset="UTF-8">
                               <meta name="viewport" content="width=device-width, initial-scale=1.0">
                               <title>Thông Báo Sự Kiện</title>
                               <style>
                                   body {
                                       font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                       background-color: #f4f4f4;
                                       margin: 0;
                                       padding: 0;
                                       color: #333;
                                       white-space: normal; /* Đảm bảo văn bản không bị cắt */
                                   }
                                   .email-container {
                                       background-color: #ffffff;
                                       border-radius: 8px;
                                       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                                       margin-top: 20px;
                                       max-width: 600px; /* Giới hạn chiều rộng container */
                                       margin-left: auto;
                                       margin-right: auto;
                                   }
                                   .header {
                                       background-color: #007BFF;
                                       color: white;
                                       padding: 30px;
                                       text-align: center;
                                       border-top-left-radius: 8px;
                                       border-top-right-radius: 8px;
                                   }
                                   .content {
                                       padding: 20px;
                                   }
                                   .footer {
                                       background-color: #f1f1f1;
                                       text-align: center;
                                       padding: 15px;
                                       font-size: 14px;
                                       color: #777;
                                   }
                               </style>
                           </head>
                           <body>
                               <div class="container email-container">
                                   <div class="header">
                                       <h1>Thông Báo Sự Kiện</h1>
                                   </div>
                                   <div class="content">
                                       <h2>Kính gửi Ông/Bà %s,</h2>
                                       <p>Chúng tôi xin thông báo về sự kiện sắp diễn ra:</p>
                                       <ul>
                                           <li><strong>Tên sự kiện:</strong> %s</li>
                                           <li><strong>Mô tả:</strong> %s</li>
                                           <li><strong>Ngày diễn ra:</strong> %s</li>
                                            <li><strong>Địa điểm:</strong> %s</li>                                       </ul>
                                       <p>Thông báo từ hệ thống: <strong>%s</strong></p>
                                   </div>
                                   <div class="footer">
                                       <img src="https://saca.com.vn/vnt_upload/partner/47_ztt.png" alt="Logo Hòa Bình ">
                                       <p>Cảm ơn bạn đã quan tâm! <br> Công ty Hòa Bình - Điện thoại: 123-456-7890</p>
                                   </div>
                               </div>
                           </body>
                           </html>
    """, customer.getName(), eventName, eventDescription, formattedEventDate, location, request.getMessage());

        // Gửi email với các tệp đính kèm
        emailService.sendEmail(toEmail, subject, body, attachmentPaths);

        // Tự động cập nhật ngày nhắc nhở nếu cần
        if (event.getReminderDate() == null) {
            event.setReminderDate(LocalDate.now().plusDays(7)); // Đặt nhắc nhở 7 ngày sau
            eventRepository.save(event); // Lưu sự kiện đã cập nhật
        }

        // Lưu thông báo đã cập nhật
        return notificationRepository.save(notification);
    }

    // Lấy thông báo theo ID
    public EventNotification getNotificationById(Integer notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with ID: " + notificationId));
    }

    public Page<EventNotification> getNotifications(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Tạo Pageable
        return notificationRepository.findAll(pageable);
    }

    public List<EventNotification> searchEventNotifications(Integer eventUserID, EventNotification.Method method,
                                                            EventNotification.Status status, String eventName,
                                                            LocalDate eventDate, String location) {
        return notificationRepository.searchEventNotifications(eventUserID, method, status, eventName, eventDate, location);
    }

    // Xóa thông báo
    public void deleteNotification(Integer notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}
