import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../../services/authService";

function EditUser() {
    const { id } = useParams(); // Get user ID from URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        email: "",
        role: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // State for success message

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserById(id); // Fetch user data by ID
                setFormData(user);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Unable to fetch user details.");
            }
        };

        fetchUser();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(id, formData); // Update user details
            setSuccessMessage("User updated successfully!");
            setError("");

            // Clear the success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage("");
                navigate("/user"); // Redirect back to Manager page
            }, 2000);
        } catch (err) {
            console.error("Error updating user:", err);
            setError("Unable to update user.");
            setSuccessMessage("");
        }
    };

    return (
        <div className="container mt-4">
            <h1>Sửa User</h1>

            {/* Display success message */}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {/* Display error message */}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                        className="form-select"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Staff">Staff</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-success">Cập nhật</button>
            </form>
        </div>
    );
}

export default EditUser;
