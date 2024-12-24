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
// API cho Events (Sự kiện)
// ============================

// Lấy danh sách tất cả các sự kiện
export const getAllEvents = async () => {
    return handleRequest(() => axios.get(`${API_BASE_URL}/events`));
};

// Lấy chi tiết một sự kiện theo ID
export const getEventById = async (id) => {
    return handleRequest(() => axios.get(`${API_BASE_URL}/events/${id}`));
};

export const getPaginatedEvents = async (page = 0, size = 5) => {
    const response = await axios.get(`${API_BASE_URL}/events/paginated`, {
        params: { page, size },
    });
    return response.data; 
};

export const searchEvents = async ({ eventTypeId, eventDate, status, reminderSent, description }) => {
    const response = await axios.get(`${API_BASE_URL}/events/search`, {
        params: {
            eventTypeId,
            eventDate,
            status,
            reminderSent,
            description,
        },
    });
    return response.data;
};

// Tạo mới một sự kiện
export const createEvent = async (event) => {
    return handleRequest(() => axios.post(`${API_BASE_URL}/events`, event));
};

// Cập nhật thông tin sự kiện
export const updateEvent = async (id, event) => {
    return handleRequest(() => axios.put(`${API_BASE_URL}/events/${id}`, event));
};

// Xóa một sự kiện
export const deleteEvent = async (id) => {
    return handleRequest(() => axios.delete(`${API_BASE_URL}/events/${id}`));
};

// ============================
// API cho Event Users
// ============================

// Gán người dùng và khách hàng vào sự kiện
export const assignUserAndCustomerToEvent = async (eventId, userId, customerId) => {
    return handleRequest(() =>
        axios.post(`${API_BASE_URL}/events/${eventId}/users/${userId}/customers/${customerId}`)
    );
};
// Lấy danh sách khách hàng có thể tham gia sự kiện
export const getAvailableCustomersForEvent = async (eventId) => {
    return handleRequest(() => axios.get(`${API_BASE_URL}/events/${eventId}/available-customers`));
};

// Lấy danh sách người dùng phụ trách sự kiện
export const getEventUsersByEventId = async (eventId) => {
    return handleRequest(() => axios.get(`${API_BASE_URL}/events/${eventId}/users`));
};
// Xóa người dùng và khách hàng khỏi sự kiện
export const deleteUserAndCustomerFromEvent = async (eventId, userId, customerId) => {
    return handleRequest(() =>
        axios.delete(`${API_BASE_URL}/events/${eventId}/users/${userId}/customers/${customerId}`)
    );
};

// ============================
// API cho Event Types
// ============================

// Lấy tất cả các loại sự kiện
export const getAllEventTypes = async () => {
    const response = await axios.get(`${API_BASE_URL}/event-types`);
    return response.data;
};

// Lấy thông tin loại sự kiện theo ID
export const getEventTypeById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/event-types/${id}`);
    return response.data;
};

// Tạo loại sự kiện mới
export const createEventType = async (eventType) => {
    const response = await axios.post(`${API_BASE_URL}/event-types`, eventType);
    return response.data;
};

// Cập nhật loại sự kiện
export const updateEventType = async (id, eventType) => {
    const response = await axios.put(`${API_BASE_URL}/event-types/${id}`, eventType);
    return response.data;
};

// Xóa loại sự kiện
export const deleteEventType = async (id) => {
    await axios.delete(`${API_BASE_URL}/event-types/${id}`);
};
