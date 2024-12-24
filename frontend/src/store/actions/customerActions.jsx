import * as api from "../../services/customerServices";
import {getPaginatedCustomers} from "../../services/customerServices"

export const fetchCustomers = () => async (dispatch) => {
    try {
        const customers = await api.getAllCustomers();
        dispatch({ type: "FETCH_CUSTOMERS_SUCCESS", payload: customers });
    } catch (error) {
        dispatch({ type: "CUSTOMER_ERROR", payload: error.message });
    }
};

export const fetchPaginatedCustomers = (page = 0, size = 5) => async (dispatch) => {
    try {
        const data = await getPaginatedCustomers(page, size);
        dispatch({
            type: "FETCH_PAGINATED_CUSTOMERS_SUCCESS",
            payload: data, // Gửi toàn bộ dữ liệu phân trang về reducer
        });
    } catch (error) {
        dispatch({
            type: "CUSTOMER_ERROR",
            payload: error.message,
        });
    }
};

export const searchCustomers = (criteria) => async (dispatch) => {
    try {
        const customers = await api.searchCustomers(criteria);
        dispatch({
            type: "SEARCH_CUSTOMERS_SUCCESS",
            payload: customers,
        });
    } catch (error) {
        dispatch({
            type: "CUSTOMER_ERROR",
            payload: error.message,
        });
    }
};

export const createCustomer = (customer) => async (dispatch) => {
    try {
        const newCustomer = await api.createCustomer(customer);
        dispatch({ type: "CREATE_CUSTOMER_SUCCESS", payload: newCustomer });
    } catch (error) {
        dispatch({ type: "CUSTOMER_ERROR", payload: error.message });
    }
};

export const updateCustomer = (id, customer) => async (dispatch) => {
    try {
        const updatedCustomer = await api.updateCustomer(id, customer);
        dispatch({ type: "UPDATE_CUSTOMER_SUCCESS", payload: updatedCustomer });
    } catch (error) {
        dispatch({ type: "CUSTOMER_ERROR", payload: error.message });
    }
};

export const deleteCustomer = (id) => async (dispatch) => {
    try {
        await api.deleteCustomer(id);
        dispatch({ type: "DELETE_CUSTOMER_SUCCESS", payload: id });
    } catch (error) {
        dispatch({ type: "CUSTOMER_ERROR", payload: error.message });
    }
};
