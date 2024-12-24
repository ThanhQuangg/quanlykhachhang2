import axios from "axios";
import environments from "../constant/environment";


const API_BASE_URL = environments.apiBaseUrl;

export const login = async (username, password) => {
    const response = await axios.post(`${API_BASE_URL}/users/login`, { username, password });
    return response.data; // Ensure response contains user data
};


export const getAllUsers = async () => {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
};

export const getUserById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`);
    return response.data;
};

export const getPaginatedUsers = async (page = 0, size = 5) => {
    const response = await axios.get(`${API_BASE_URL}/users/paginated`, {
        params: { page, size },
    });
    return response.data; 
};

export const searchByUsername = async (username) => {
    const response = await axios.get(`${API_BASE_URL}/users/search/username`, {
        params: { username },
    });
    return response.data;
};

export const searchByEmail = async (email) => {
    const response = await axios.get(`${API_BASE_URL}/users/search/email`, {
        params: { email },
    });
    return response.data;
};

export const searchByFullName = async (fullName) => {
    const response = await axios.get(`${API_BASE_URL}/users/search/fullName`, {
        params: { fullName },
    });
    return response.data;
};

export const searchByRole = async (role) => {
    const response = await axios.get(`${API_BASE_URL}/users/search/role`, {
        params: { role },
    });
    return response.data;
};

export const searchUsers = async ({ username, email, role, fullName }) => {
    const response = await axios.get(`${API_BASE_URL}/users/search`, {
        params: {
            username,
            email,
            role,
            fullName,
        },
    });
    return response.data;
};

export const createUser = async (user) => {
    const response = await axios.post(`${API_BASE_URL}/users`, user);
    return response.data;
};

export const updateUser = async (id, user) => {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, user);
    return response.data;
};

export const deleteUser = async (id) => {
    await axios.delete(`${API_BASE_URL}/users/${id}`);
};
