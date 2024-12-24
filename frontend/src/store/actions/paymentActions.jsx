import {getPaginatedPayments} from "../../services/paymentService";

export const fetchPaginatedPayments = (page = 0, size = 5) => async (dispatch) => {
    try {
        const data = await getPaginatedPayments(page, size);
        dispatch({
            type: "FETCH_PAGINATED_PAYMENTS_SUCCESS",
            payload: data, // Gửi toàn bộ dữ liệu phân trang về reducer
        });
    } catch (error) {
        dispatch({
            type: "PAYMENT_ERROR",
            payload: error.message,
        });
    }
};

export const searchPayments = (criteria) => async (dispatch) => {
    try {
        const customers = await api.searchPayments(criteria);
        dispatch({
            type: "SEARCH_PAYMENTS_SUCCESS",
            payload: customers,
        });
    } catch (error) {
        dispatch({
            type: "PAYMENT_ERROR",
            payload: error.message,
        });
    }
};