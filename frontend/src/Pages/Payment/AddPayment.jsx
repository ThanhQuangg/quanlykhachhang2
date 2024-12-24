import React, { useState, useEffect } from "react";

import { createPayment } from "../../services/paymentService";
import { useNavigate } from "react-router-dom";
import { getAllProjects } from "../../services/projectServices";


function AddPayment() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [installments, setInstallments] = useState(1);
    const [installmentPercentage, setInstallmentPercentage] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    // Fetch all projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getAllProjects();
                setProjects(data);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError("Unable to fetch projects.");
            }
        };

        fetchProjects();
    }, []);

    // Handle project selection
    const handleProjectChange = (projectId) => {
        const project = projects.find((proj) => proj.projectId === parseInt(projectId));
        setSelectedProject(project);
        setInstallments(1); // Reset installments
        setInstallmentPercentage([]); // Reset percentages
    };

    // Handle installments change
    const handleInstallmentsChange = (value) => {
        const totalInstallments = Math.max(1, parseInt(value));
        setInstallments(totalInstallments);

        // Evenly distribute percentages initially
        const percentage = 100 / totalInstallments;
        setInstallmentPercentage(Array(totalInstallments).fill(percentage));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProject) {
            setError("Please select a project.");
            return;
        }

        const payments = installmentPercentage.map((percentage, index) => ({
            projectId: selectedProject.projectId,
            installmentNumber: index + 1,
            amount: (selectedProject.totalAmount * percentage) / 100,
            paymentDate: new Date().toISOString().split("T")[0], // Current date
            paymentStatus: "Đang Thanh Toán",
        }));

        try {
            for (const payment of payments) {
                await createPayment(payment);
            }
            setSuccessMessage("Payments created successfully!");
            setTimeout(() => navigate("/payments"), 3000); // Redirect after success
        } catch (err) {
            console.error("Error creating payments:", err);
            setError("Unable to create payments.");
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container">
            <h1>Thêm Thanh Toán</h1>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form onSubmit={handleSubmit}>
                {/* Select Project */}
                <div className="mb-3">
                    <label htmlFor="project" className="form-label">Dự Án</label>
                    <select
                        id="project"
                        className="form-select"
                        onChange={(e) => handleProjectChange(e.target.value)}
                    >
                        <option value="">Chọn dự án</option>
                        {projects.map((project) => (
                            <option key={project.projectId} value={project.projectId}>
                                {project.projectName} - Tổng tiền: {project.totalAmount}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Installments */}
                {selectedProject && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="installments" className="form-label">Số đợt</label>
                            <input
                                id="installments"
                                type="number"
                                min="1"
                                className="form-control"
                                value={installments}
                                onChange={(e) => handleInstallmentsChange(e.target.value)}
                            />
                        </div>

                        {/* Installment Percentages */}
                        {Array.from({ length: installments }, (_, index) => (
                            <div className="mb-3" key={index}>
                                <label htmlFor={`installment-${index}`} className="form-label">
                                    Đợt {index + 1} (%)
                                </label>
                                <input
                                    id={`installment-${index}`}
                                    type="number"
                                    className="form-control"
                                    value={installmentPercentage[index]}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        setInstallmentPercentage((prev) => {
                                            const updated = [...prev];
                                            updated[index] = value;
                                            return updated;
                                        });
                                    }}
                                />
                            </div>
                        ))}
                    </>
                )}

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary">Tạo Thanh Toán</button>
            </form>
        </div>
    );
}

export default AddPayment;
