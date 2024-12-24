import {getPaginatedNotifications} from "../../services/eventNotificationServices"

export const fetchPaginatedNotifications = (page = 0, size = 5) => async (dispatch) => {
    try {
        const data = await getPaginatedNotifications(page, size);
        dispatch({
            type: "FETCH_PAGINATED_NOTIFICATIONS_SUCCESS",
            payload: data, // Gửi toàn bộ dữ liệu phân trang về reducer
        });
    } catch (error) {
        dispatch({
            type: "NOTIFICATION_ERROR",
            payload: error.message,
        });
    }
};

export const searchNotifications = (criteria) => async (dispatch) => {
    try {
        const Notifications = await api.searchNotifications(criteria);
        dispatch({
            type: "SEARCH_NOTIFICATIONS_SUCCESS",
            payload: Notifications,
        });
    } catch (error) {
        dispatch({
            type: "NOTIFICATION_ERROR",
            payload: error.message,
        });
    }
};