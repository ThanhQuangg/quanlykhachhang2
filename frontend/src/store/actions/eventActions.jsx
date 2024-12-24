import * as api from "../../services/eventServices";
import {getPaginatedEvents} from "../../services/eventServices"
// Action Types
export const FETCH_EVENTS_SUCCESS = "FETCH_EVENTS_SUCCESS";
export const FETCH_EVENT_SUCCESS = "FETCH_EVENT_SUCCESS";
export const CREATE_EVENT_SUCCESS = "CREATE_EVENT_SUCCESS";
export const UPDATE_EVENT_SUCCESS = "UPDATE_EVENT_SUCCESS";
export const DELETE_EVENT_SUCCESS = "DELETE_EVENT_SUCCESS";
export const FETCH_EVENTS_BY_USER_SUCCESS = "FETCH_EVENTS_BY_USER_SUCCESS";
export const EVENT_ERROR = "EVENT_ERROR";

// Action Creators

// Fetch all events
export const fetchEvents = () => async (dispatch) => {
    try {
        const events = await api.getAllEvents();
        dispatch({ type: FETCH_EVENTS_SUCCESS, payload: events });
    } catch (error) {
        dispatch({ type: EVENT_ERROR, payload: error.response?.message || "Lỗi khi lấy danh sách sự kiện." });
    }
};

// Fetch event by ID
export const fetchEventById = (id) => async (dispatch) => {
    try {
        const event = await api.getEventById(id);
        dispatch({ type: FETCH_EVENT_SUCCESS, payload: event });
    } catch (error) {
        dispatch({ type: EVENT_ERROR, payload: error.response?.message || "Lỗi khi lấy thông tin sự kiện." });
    }
};

// Create a new event
export const createEvent = (event) => async (dispatch) => {
    try {
        const newEvent = await api.createEvent(event);
        dispatch({ type: CREATE_EVENT_SUCCESS, payload: newEvent });
    } catch (error) {
        dispatch({ type: EVENT_ERROR, payload: error.response?.message || "Lỗi khi tạo sự kiện." });
    }
};

// Update an existing event
export const updateEvent = (id, event) => async (dispatch) => {
    try {
        const updatedEvent = await api.updateEvent(id, event);
        dispatch({ type: UPDATE_EVENT_SUCCESS, payload: updatedEvent });
    } catch (error) {
        dispatch({ type: EVENT_ERROR, payload: error.response?.message || "Lỗi khi cập nhật sự kiện." });
    }
};

// Delete an event
export const deleteEvent = (id) => async (dispatch) => {
    try {
        await api.deleteEvent(id);
        dispatch({ type: DELETE_EVENT_SUCCESS, payload: id });
    } catch (error) {
        dispatch({ type: EVENT_ERROR, payload: error.response?.message || "Lỗi khi xóa sự kiện." });
    }
};

// Fetch events by user ID
export const fetchEventsByUserId = (userId) => async (dispatch) => {
    try {
        const events = await api.getEventsByUserId(userId);
        dispatch({ type: FETCH_EVENTS_BY_USER_SUCCESS, payload: events });
    } catch (error) {
        dispatch({ type: EVENT_ERROR, payload: error.response?.message || "Lỗi khi lấy sự kiện của người dùng." });
    }
};

export const fetchPaginatedEvents = (page = 0, size = 5) => async (dispatch) => {
    try {
        const data = await getPaginatedEvents(page, size);
        dispatch({
            type: "FETCH_PAGINATED_EVENTS_SUCCESS",
            payload: data, // Gửi toàn bộ dữ liệu phân trang về reducer
        });
    } catch (error) {
        dispatch({
            type: "EVENT_ERROR",
            payload: error.message,
        });
    }
};

export const searchEvents = (criteria) => async (dispatch) => {
    try {
        const Events = await api.searchEvents(criteria);
        dispatch({
            type: "SEARCH_EVENTS_SUCCESS",
            payload: Events,
        });
    } catch (error) {
        dispatch({
            type: "EVENT_ERROR",
            payload: error.message,
        });
    }
};
