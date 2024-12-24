const initialState = {
    Notification: [],
    searchResults: [],
    error: null,
};
const eventNotificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SEARCH_NOTIFICATIONS_SUCCESS":
            return {
                ...state,
                searchResults: action.payload,
            };

        case "FETCH_PAGINATED_NOTIFICATIONS_SUCCESS":
            return {
                ...state,
                customers: action.payload.content, // Danh sách người dùng
                currentPage: action.payload.number, // Trang hiện tại
                totalPages: action.payload.totalPages, // Tổng số trang
            };
        case "NOTIFICATION_ERROR":
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
export default eventNotificationReducer;