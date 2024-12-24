import React, { useState, useEffect } from "react";
import { createProject } from "../../services/projectServices";
import { getAllUsers } from "../../services/authService";
import { getAllCustomers } from "../../services/customerServices";
import { getAllProjectTypes } from "../../services/projectServices";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../constant/pathnames";

const AddProject = () => {
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [userId, setUserId] = useState("");
    const [projectTypeId, setProjectTypeId] = useState("");
    const [message, setMessage] = useState("");
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const customersResponse = await getAllCustomers();
                setCustomers(customersResponse);

                const usersResponse = await getAllUsers();
                setUsers(usersResponse.filter((user) => user.role !== "admin"));

                const projectTypesResponse = await getAllProjectTypes();
                setProjectTypes(projectTypesResponse);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const validateInputs = () => {
        const newErrors = {};

        if (!projectName.trim())
            newErrors.projectName = "Tên dự án không được để trống.";
        if (!description.trim())
            newErrors.description = "Mô tả không được để trống.";
        if (!totalAmount.trim()) {
            newErrors.totalAmount = "Tổng số tiền không được để trống.";
        } else if (isNaN(totalAmount.replace(/\./g, ""))) {
            newErrors.totalAmount = "Tổng số tiền phải là số.";
        }
        if (!customerId) newErrors.customerId = "Vui lòng chọn khách hàng.";
        if (!userId) newErrors.userId = "Vui lòng chọn người phụ trách.";
        if (!projectTypeId) newErrors.projectTypeId = "Vui lòng chọn loại dự án.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTotalAmountChange = (e) => {
        const value = e.target.value.replace(/\./g, "").replace(",", ".");
        if (!isNaN(value)) {
            setTotalAmount(value.replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInputs()) {
            setMessage("Vui lòng kiểm tra lại các trường thông tin.");
            return;
        }

        const newProject = {
            projectName,
            description,
            status: "Ongoing",
            totalAmount: parseFloat(totalAmount.replace(/\./g, "")),
            paidAmount: 0,
            customer: { customerId: parseInt(customerId) },
            user: { userId: parseInt(userId) },
            projectType: { projectTypeId: parseInt(projectTypeId) },
        };

        try {
            await createProject(newProject);
            setMessage("Project created successfully!");
            navigate(PATHS.PROJECT);
        } catch (error) {
            setMessage("Error creating project: " + error.message);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4 display-4">Tạo Dự Án Mới</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                    <label htmlFor="projectName" className="h4">Tên Dự Án</label>
                    <input
                        id="projectName"
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className={`form-control form-control-lg ${
                            errors.projectName ? "is-invalid" : ""
                        }`}
                        placeholder="Nhập tên dự án"
                    />
                    {errors.projectName && (
                        <div className="invalid-feedback">{errors.projectName}</div>
                    )}
                </div>

                <div className="form-group mb-4">
                    <label htmlFor="description" className="h4">Mô Tả</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`form-control form-control-lg ${
                            errors.description ? "is-invalid" : ""
                        }`}
                        placeholder="Nhập mô tả dự án"
                    />
                    {errors.description && (
                        <div className="invalid-feedback">{errors.description}</div>
                    )}
                </div>

                <div className="form-group mb-4">
                    <label htmlFor="totalAmount" className="h4">Tổng Số Tiền</label>
                    <input
                        id="totalAmount"
                        type="text"
                        value={totalAmount}
                        onChange={handleTotalAmountChange}
                        className={`form-control form-control-lg ${
                            errors.totalAmount ? "is-invalid" : ""
                        }`}
                        placeholder="Nhập tổng số tiền"
                    />
                    {errors.totalAmount && (
                        <div className="invalid-feedback">{errors.totalAmount}</div>
                    )}
                </div>

                <div className="form-group mb-4">
                    <label className="h4">Khách Hàng</label>
                    <select
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        className={`form-control form-control-lg ${
                            errors.customerId ? "is-invalid" : ""
                        }`}
                    >
                        <option value="">Chọn Khách Hàng</option>
                        {customers.map((customer) => (
                            <option key={customer.customerId} value={customer.customerId}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                    {errors.customerId && (
                        <div className="invalid-feedback">{errors.customerId}</div>
                    )}
                </div>

                <div className="form-group mb-4">
                    <label className="h4">Người Phụ Trách</label>
                    <select
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className={`form-control form-control-lg ${
                            errors.userId ? "is-invalid" : ""
                        }`}
                    >
                        <option value="">Chọn Người Phụ Trách</option>
                        {users.map((user) => (
                            <option key={user.userId} value={user.userId}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                    {errors.userId && (
                        <div className="invalid-feedback">{errors.userId}</div>
                    )}
                </div>

                <div className="form-group mb-4">
                    <label className="h4">Loại Dự Án</label>
                    <select
                        value={projectTypeId}
                        onChange={(e) => setProjectTypeId(e.target.value)}
                        className={`form-control form-control-lg ${
                            errors.projectTypeId ? "is-invalid" : ""
                        }`}
                    >
                        <option value="">Chọn Loại Dự Án</option>
                        {projectTypes.map((type) => (
                            <option key={type.projectTypeId} value={type.projectTypeId}>
                                {type.typeName}
                            </option>
                        ))}
                    </select>
                    {errors.projectTypeId && (
                        <div className="invalid-feedback">{errors.projectTypeId}</div>
                    )}
                </div>

                <div className="form-group mb-4">
                    <button type="submit" className="btn btn-primary btn-lg btn-block">
                        Tạo Dự Án
                    </button>
                </div>
            </form>

            {message && <p className="text-center mt-3">{message}</p>}
        </div>
    );
};

export default AddProject;
