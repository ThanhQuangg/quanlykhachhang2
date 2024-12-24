// Initial state for events
const initialState = {
    events: [], // Danh sách tất cả các sự kiện
    currentEvent: null, // Chi tiết sự kiện hiện tại
    eventsByUser: [], // Danh sách sự kiện theo người dùng
    loading: false, // Trạng thái tải
    error: null, // Lỗi từ server hoặc client
};

// Event Reducer
const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SEARCH_EVENTS_SUCCESS":
            return {
                ...state,
                searchResults: action.payload, 
            };

        case "FETCH_PAGINATED_EVENTS_SUCCESS":
            return {
                ...state,
                customers: action.payload.content, // Danh sách người dùng
                currentPage: action.payload.number, // Trang hiện tại
                totalPages: action.payload.totalPages, // Tổng số trang
            };
        case "FETCH_EVENTS_REQUEST":
        case "FETCH_EVENT_REQUEST":
        case "CREATE_EVENT_REQUEST":
        case "UPDATE_EVENT_REQUEST":
        case "DELETE_EVENT_REQUEST":
        case "FETCH_EVENTS_BY_USER_REQUEST":
            return { ...state, loading: true, error: null }; // Set trạng thái đang tải

        case "FETCH_EVENTS_SUCCESS":
            return { ...state, events: action.payload, loading: false, error: null };

        case "FETCH_EVENT_SUCCESS":
            return { ...state, currentEvent: action.payload, loading: false, error: null };

        case "CREATE_EVENT_SUCCESS":
            return {
                ...state,
                events: [...state.events, action.payload],
                loading: false,
                error: null,
            };

        case "UPDATE_EVENT_SUCCESS":
            return {
                ...state,
                events: state.events.map((event) =>
                    event.eventId === action.payload.eventId ? action.payload : event
                ),
                loading: false,
                error: null,
            };

        case "DELETE_EVENT_SUCCESS":
            return {
                ...state,
                events: state.events.filter((event) => event.eventId !== action.payload),
                loading: false,
                error: null,
            };

        case "FETCH_EVENTS_BY_USER_SUCCESS":
            return { ...state, eventsByUser: action.payload, loading: false, error: null };

        case "EVENT_ERROR":
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default eventReducer;
