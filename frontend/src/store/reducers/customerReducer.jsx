const initialState = {
    customers: [],
    searchResults: [],
    error: null,
};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SEARCH_CUSTOMERS_SUCCESS":
            return {
                ...state,
                searchResults: action.payload, 
            };

        case "FETCH_PAGINATED_CUSTOMERS_SUCCESS":
            return {
                ...state,
                customers: action.payload.content, // Danh sách người dùng
                currentPage: action.payload.number, // Trang hiện tại
                totalPages: action.payload.totalPages, // Tổng số trang
            };
        case "FETCH_CUSTOMERS_SUCCESS":
            return { ...state, customers: action.payload };
        case "CREATE_CUSTOMER_SUCCESS":
            return { ...state, customers: [...state.customers, action.payload] };
        case "UPDATE_CUSTOMER_SUCCESS":
            return {
                ...state,
                customers: state.customers.map((customer) =>
                    customer.id === action.payload.id ? action.payload : customer
                ),
            };
        case "DELETE_CUSTOMER_SUCCESS":
            return {
                ...state,
                customers: state.customers.filter((customer) => customer.id !== action.payload),
            };
        case "CUSTOMER_ERROR":
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export default customerReducer;
