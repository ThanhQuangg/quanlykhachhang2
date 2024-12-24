import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../../services/customerServices";
import { PATHS } from "../../constant/pathnames";

function AddCustomer() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        classificationId: "",
        dateOfBirth: "", // Thêm trường ngày sinh
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({ ...errors, [name]: "" }); // Xóa lỗi khi người dùng chỉnh sửa
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Customer name is required.";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format.";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^\d{10,11}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be 10-11 digits.";
        }
        if (!formData.address.trim()) {
            newErrors.address = "Address is required.";
        }
        if (!formData.classificationId) {
            newErrors.classificationId = "Please select a classification.";
        }
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth is required.";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Run validation
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setError("Please fix the errors in the form.");
            setSuccessMessage("");
            return;
        }

        try {
            await createCustomer(formData); // Gọi API tạo customer
            setSuccessMessage("Customer added successfully!");
            setError("");
            setTimeout(() => navigate(PATHS.CUSTOMER), 2000); // Chuyển hướng sau 2 giây
        } catch (err) {
            console.error("Error adding customer:", err);
            setError("Unable to add customer. Please try again.");
            setSuccessMessage("");
        }
    };

    return (
        <div className="container mt-4">
            <h1>Thêm khách hàng</h1>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Customer Name
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                        Phone
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                        Address
                    </label>
                    <input
                        type="text"
                        className={`form-control ${errors.address ? "is-invalid" : ""}`}
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="classificationId" className="form-label">
                        Classification
                    </label>
                    <select
                        className={`form-select ${errors.classificationId ? "is-invalid" : ""}`}
                        id="classificationId"
                        name="classificationId"
                        value={formData.classificationId}
                        onChange={handleChange}
                    >
                        <option value="">Select Classification</option>
                        <option value="1">VIP</option>
                        <option value="2">Normal</option>
                        <option value="3">Potential</option>
                    </select>
                    {errors.classificationId && (
                        <div className="invalid-feedback">{errors.classificationId}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="dateOfBirth" className="form-label">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""}`}
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                    {errors.dateOfBirth && (
                        <div className="invalid-feedback">{errors.dateOfBirth}</div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">
                    Add Customer
                </button>
            </form>
        </div>
    );
}

export default AddCustomer;
