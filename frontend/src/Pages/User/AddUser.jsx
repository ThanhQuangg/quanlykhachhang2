import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { createUser } from "../../services/authService";
import { PATHS } from "../../constant/pathnames"; // Import đường dẫn PATHS

function AddUser() {
    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        email: "",
        role: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng

    const validate = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required.";
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!formData.role) {
            newErrors.role = "Role is required.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            setMessage("Vui lòng kiểm tra lại các trường thông tin.");
            return;
        }

        try {
            await createUser(formData); // Gọi API tạo user
            setMessage("User added successfully!");
            setFormData({
                username: "",
                fullName: "",
                email: "",
                role: "",
                password: "",
            });
            setErrors({});
            setError("");
            setTimeout(() => {
                navigate(PATHS.USER);
            }, 1000);
        } catch (err) {
            console.error("Error adding user:", err);
            setError("Failed to add user. Please try again.");
            setMessage("");
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Thêm User</h1>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className={`form-control ${errors.username ? "is-invalid" : ""}`}
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <input
                        type="text"
                        className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                    />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select
                        className={`form-select ${errors.role ? "is-invalid" : ""}`}
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Staff">Staff</option>
                    </select>
                    {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Add User</button>
            </form>
        </div>
    );
}

export default AddUser;
