import axios from "axios";
import environments from "../constant/environment";

const API_BASE_URL = environments.apiBaseUrl;

// Fetch all payments
export const getAllPayments = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/payments`);
        return response.data;
    } catch (error) {
        console.error("Error fetching payments:", error);
        throw new Error("Unable to fetch payments.");
    }
};

// Fetch a payment by ID
export const getPaymentById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/payments/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching payment with ID ${id}:`, error);
        throw new Error("Unable to fetch payment.");
    }
};

export const getPaginatedPayments = async (page = 0, size = 5) => {
    const response = await axios.get(`${API_BASE_URL}/payments/paginated`, {
        params: { page, size },
    });
    return response.data; 
};

export const searchPayments = async ({ customerId, projectId, installmentNumber, paymentStatus, paymentDate, amountMin, amountMax }) => {
    const response = await axios.get(`${API_BASE_URL}/payments/search`, {
        params: {
            customerId,
            projectId,
            installmentNumber,
            paymentStatus,
            paymentDate,
            amountMin,
            amountMax
        },
    });
    return response.data;
};


// Create a new payment
export const createPayment = async (payment) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/payments`, payment);
        return response.data;
    } catch (error) {
        console.error("Error creating payment:", error);
        throw new Error("Unable to create payment.");
    }
};

// Update an existing payment
export const updatePayment = async (id, payment) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/payments/${id}`, payment);
        return response.data;
    } catch (error) {
        console.error(`Error updating payment with ID ${id}:`, error);
        throw new Error("Unable to update payment.");
    }
};

// Delete a payment
export const deletePayment = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/payments/${id}`);
    } catch (error) {
        console.error(`Error deleting payment with ID ${id}:`, error);
        throw new Error("Unable to delete payment.");
    }
};
