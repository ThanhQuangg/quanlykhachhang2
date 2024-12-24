import * as api from "../../services/authService";
import { getPaginatedUsers } from "../services/authService";


export const fetchUsers = () => async (dispatch) => {
    try {
        const users = await api.getAllUsers();
        dispatch({ type: "FETCH_USERS_SUCCESS", payload: users });
    } catch (error) {
        dispatch({ type: "USER_ERROR", payload: error.message });
    }
};

export const fetchUserById = (id) => async (dispatch) => {
    try {
        const user = await api.getUserById(id);
        dispatch({ type: "FETCH_USER_SUCCESS", payload: user });
    } catch (error) {
        dispatch({ type: "USER_ERROR", payload: error.message });
    }
};

export const fetchPaginatedUsers = (page = 0, size = 5) => async (dispatch) => {
    try {
        const data = await getPaginatedUsers(page, size);
        dispatch({
            type: "FETCH_PAGINATED_USERS_SUCCESS",
            payload: data, // Gửi toàn bộ dữ liệu phân trang về reducer
        });
    } catch (error) {
        dispatch({
            type: "USER_ERROR",
            payload: error.message,
        });
    }
};

export const searchUsersByUsername = (username) => async (dispatch) => {
    try {
        const users = await api.searchByUsername(username);
        dispatch({ type: "SEARCH_USERS_SUCCESS", payload: users });
    } catch (error) {
        dispatch({ type: "USER_ERROR", payload: error.message });
    }
};

export const searchUsersByEmail = (email) => async (dispatch) => {
    try {
        const users = await api.searchByEmail(email);
        dispatch({ type: "SEARCH_USERS_SUCCESS", payload: users });
    } catch (error) {
        dispatch({ type: "USER_ERROR", payload: error.message });
    }
};

export const searchUsersByFullName = (fullName) => async (dispatch) => {
    try {
        const users = await api.searchByFullName(fullName);
        dispatch({ type: "SEARCH_USERS_SUCCESS", payload: users });
    } catch (error) {
        dispatch({ type: "USER_ERROR", payload: error.message });
    }
};

export const searchUsersByRole = (role) => async (dispatch) => {
    try {
        const users = await api.searchByRole(role);
        dispatch({ type: "SEARCH_USERS_SUCCESS", payload: users });
    } catch (error) {
        dispatch({ type: "USER_ERROR", payload: error.message });
    }
};

export const searchUsers = (filters) => async (dispatch) => {
    try {
        const users = await api.searchUsers(filters);
        dispatch({ type: "SEARCH_USERS_SUCCESS", payload: users });
    } catch (error) {
        dispatch({ type: "USER_ERROR", payload: error.message });
    }
};

export const createUser = (user) => async (dispatch) => {
    try {
        const newUser = await api.createUser(user);
        dispatch({ type: "CREATE_USER_SUCCESS", payload: newUser });
    } catch (error) {
        dispatch({ type: "USER_ERROR", payload: error.message });
    }
};

export const updateUser = (id, user) => async (dispatch) => {
    try {
        const updatedUser = await api.updateUser(id, user);
        dispatch({ type: "UPDATE_USER_SUCCESS", payload: updatedUser });
    } catch (error) {
        dispatch({ type: "USER_ERROR", payload: error.message });
    }
};

export const deleteUser = (id) => async (dispatch) => {
    try {
        await api.deleteUser(id);
        dispatch({ type: "DELETE_USER_SUCCESS", payload: id });
    } catch (error) {
        dispatch({ type: "USER_ERROR", payload: error.message });
    }
};
