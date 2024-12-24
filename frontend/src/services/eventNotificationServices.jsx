import axios from "axios";
import environments from "../constant/environment";

const API_BASE_URL = environments.apiBaseUrl;

// Hàm tiện ích để xử lý yêu cầu API
const handleRequest = async (request) => {
    try {
        const response = await request();
        return response.data;
    } catch (error) {
        console.error("Lỗi yêu cầu API:", error.response || error.message);
        throw error.response?.data || new Error("Yêu cầu API thất bại");
    }
};

// ============================
// API cho Notifications (Thông báo)
// ============================

// Lấy danh sách tất cả các thông báo
export const getAllNotifications = async () => {
    return handleRequest(() => axios.get(`${API_BASE_URL}/notifications`));
};

// Lấy chi tiết một thông báo theo ID
export const getNotificationById = async (notificationId) => {
    return handleRequest(() => axios.get(`${API_BASE_URL}/notifications/${notificationId}`));
};

export const getPaginatedNotifications = async (page = 0, size = 5) => {
    const response = await axios.get(`${API_BASE_URL}/notifications/paginated`, {
        params: { page, size },
    });
    return response.data; 
};

export const searchNotifications = async ({ eventUserID, method, status, eventName, eventDate, location }) => {
    const response = await axios.get(`${API_BASE_URL}/notifications/search`, {
        params: {
            eventUserID,
            method,
            status,
            eventName,
            eventDate,
            location
        },
    });
    return response.data;
};

// Tạo mới một thông báo
export const createNotification = async (notification) => {
    return handleRequest(() => axios.post(`${API_BASE_URL}/notifications`, notification));
};

// Cập nhật trạng thái thông báo
export const updateNotificationStatus = async (notificationId, status) => {
    return handleRequest(() =>
        axios.put(`${API_BASE_URL}/notifications/${notificationId}/status`, null, {
            params: { status },
        })
    );
};

// Xóa một thông báo
export const deleteNotification = async (notificationId) => {
    return handleRequest(() => axios.delete(`${API_BASE_URL}/notifications/${notificationId}`));
};


// Gửi thông báo
// export const sendNotification = async (notificationId, data) => {
//     return handleRequest(() =>
//         axios.put(`${API_BASE_URL}/notifications/${notificationId}/send`, data, {
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         })
//     );
// };
export const sendNotification = async (notificationId, data) => {
    try {
        const formData = new FormData();
        formData.append('eventName', data.eventName);
        formData.append('eventDescription', data.eventDescription);
        formData.append('eventDate', data.eventDate);
        formData.append('location', data.location);
        formData.append('message', data.message);
        formData.append('sentAt', data.sentAt);

        // Nếu có tệp đính kèm, thêm chúng vào formData
        if (data.attachments && data.attachments.length > 0) {
            data.attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });
        }
        const response = await axios.put(`${API_BASE_URL}/notifications/${notificationId}/send`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;  
    } catch (error) {
        throw new Error("Failed to send notification: " + error.message);
    }
};
