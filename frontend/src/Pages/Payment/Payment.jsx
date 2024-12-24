import React, { useState, useEffect } from "react";
import { getAllProjects, getPaginatedProjects } from "../../services/projectServices";
import { getAllPayments, createPayment } from "../../services/paymentService";
import { NavLink, useNavigate } from "react-router-dom";
import { PATHS } from "../../constant/pathnames";

function Payment() {
    const [projects, setProjects] = useState([]);
    const [payments, setPayments] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [installments, setInstallments] = useState(1);
    const [installmentDetails, setInstallmentDetails] = useState([]);
    const [splitMethod, setSplitMethod] = useState("equal");
    const [percentages, setPercentages] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [highlightedRow, setHighlightedRow] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [projectsPerPage, setProjectsPerPage] = useState(2);
    const [customProjectsPerPage, setCustomProjectsPerPage] = useState("");

    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true);
    //         try {
    //             // Lấy dữ liệu dựa trên phân trang
    //             const paginatedProjects = await getPaginatedProjects(currentPage, projectsPerPage);
    //             const paymentData = await getAllPayments();
    
    //             if (paginatedProjects && Array.isArray(paginatedProjects.content)) {
    //                 const projectData = paginatedProjects.content;
    //                 console.log("paginatedProjects", paginatedProjects.content)
    //                 setProjects(projectData); // Lưu danh sách dự án
    //                 setTotalPages(paginatedProjects.totalPages); // Tổng số trang
    
    //                 // Lọc các dự án không có thanh toán
    //                 const projectsWithNoPayments = projectData.filter(
    //                     (project) =>
    //                         !paymentData.some((payment) => payment.project?.projectId === project.projectId)
    //                 );
    
    //                 setFilteredProjects(projectsWithNoPayments); // Cập nhật danh sách dự án đã lọc
    //                 console.log("projectsWithNoPayments", projectsWithNoPayments)
    //             }
    //         } catch (err) {
    //             console.error("Error fetching data:", err);
    //             setError("Unable to fetch data.");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    
    //     fetchData();
    // }, [currentPage, projectsPerPage]); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectData = await getAllProjects();
                const paymentData = await getAllPayments();
                setProjects(projectData);
                setPayments(paymentData);

                const projectsWithNoPayments = projectData.filter(
                    (project) =>
                        !paymentData.some((payment) => payment.project?.projectId === project.projectId)
                );
                setFilteredProjects(projectsWithNoPayments);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Unable to fetch data.");
            }
        };
        fetchData();
    }, []);

    const handleProjectSelect = (projectId) => {
        const project = projects.find((p) => p.projectId === parseInt(projectId));
        setSelectedProject(project);
        setHighlightedRow(projectId);
        setInstallments(1);
        setInstallmentDetails([]);
        setPercentages([]);
    };

    const handleSplitMethodChange = (method) => {
        setSplitMethod(method);
        setInstallmentDetails([]);
        setPercentages(method === "percentage" ? Array(installments).fill(0) : []);
    };

    const handleInstallmentsChange = (value) => {
        const numInstallments = Math.max(1, parseInt(value));
        setInstallments(numInstallments);

        if (splitMethod === "equal" && selectedProject) {
            const amountPerInstallment = selectedProject.totalAmount / numInstallments;
            const details = Array.from({ length: numInstallments }, (_, index) => ({
                installmentNumber: index + 1,
                amount: amountPerInstallment,
                paymentDate: new Date().toISOString().split("T")[0],
            }));
            setInstallmentDetails(details);
        } else if (splitMethod === "percentage") {
            setPercentages(Array(numInstallments).fill(0));
        }
    };

    const handlePercentagesChange = (index, value) => {
        const updatedPercentages = [...percentages];
        updatedPercentages[index] = Math.max(0, Math.min(100, parseFloat(value) || 0));
        setPercentages(updatedPercentages);

        if (selectedProject) {
            const totalAmount = selectedProject.totalAmount;
            const updatedDetails = updatedPercentages.map((percentage, idx) => ({
                installmentNumber: idx + 1,
                amount: (totalAmount * percentage) / 100,
                paymentDate: installmentDetails[idx]?.paymentDate || new Date().toISOString().split("T")[0],
            }));
            setInstallmentDetails(updatedDetails);
        }
    };

    const handleAddPayments = async () => {
        if (!selectedProject || installmentDetails.length === 0) {
            setError("Please select a project and configure installments.");
            return;
        }

        const totalPercentage = percentages.reduce((sum, p) => sum + p, 0);
        if (splitMethod === "percentage" && totalPercentage !== 100) {
            setError("Total percentage must equal 100%.");
            return;
        }

        const paymentsToAdd = installmentDetails.map((installment) => ({
            customer: { customerId: selectedProject.customer.customerId },
            project: { projectId: selectedProject.projectId },
            installmentNumber: installment.installmentNumber,
            amount: installment.amount,
            paymentDate: installment.paymentDate,
        }));

        try {
            for (const payment of paymentsToAdd) {
                await createPayment(payment);
            }
            setSuccessMessage("Payments added successfully!");
            setError("");
            navigate(PATHS.PAYMENT_LIST);
        } catch (err) {
            console.error("Error adding payments:", err);
            setError("Unable to add payments.");
        }
    };

    const formatCurrency = (value) => value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

    const rowStyle = {
        border: '5px solid blue'
    };
    const handleSort = (column, keyExtractor) => {
        const newOrder = sortConfig.column === column && sortConfig.order === "asc" ? "desc" : "asc";
        setSortConfig({ column, order: newOrder });

        const sortedProjects = [...filteredProjects].sort((a, b) => {
            const valueA = keyExtractor(a);
            const valueB = keyExtractor(b);

            if (valueA < valueB) return newOrder === "asc" ? -1 : 1;
            if (valueA > valueB) return newOrder === "asc" ? 1 : -1;
            return 0;
        });

        setFilteredProjects(sortedProjects);
    };
    return (
        <div className="container">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <h2>Danh sách Dự Án Chưa Thanh Toán</h2>
            <NavLink to={PATHS.PAYMENT_LIST} className="btn btn-primary mb-4 mt-3">
                Xem Danh Sách Dự Án
            </NavLink>
            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th onClick={() => handleSort("projectId", (p) => p.projectId)}>
                            ID {sortConfig.column === "projectId" && (sortConfig.order === "asc" ? "↑" : "↓")}
                        </th>
                        <th onClick={() => handleSort("projectName", (p) => p.projectName)}>
                            Tên Dự Án {sortConfig.column === "projectName" && (sortConfig.order === "asc" ? "↑" : "↓")}
                        </th>
                        <th onClick={() => handleSort("totalAmount", (p) => p.totalAmount)}>
                            Tổng Số Tiền {sortConfig.column === "totalAmount" && (sortConfig.order === "asc" ? "↑" : "↓")}
                        </th>
                        <th onClick={() => handleSort("customerName", (p) => p.customer?.name || "")}>
                            Khách Hàng {sortConfig.column === "customerName" && (sortConfig.order === "asc" ? "↑" : "↓")}
                        </th>
                        <th>Chọn</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProjects.map((project) => (
                        <tr
                            key={project.projectId}
                            style={highlightedRow === project.projectId ? rowStyle : null}  
                        >
                            <td>{project.projectId}</td>
                            <td>{project.projectName}</td>
                            <td>{project.totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
                            <td>{project.customer?.name || "Không rõ"}</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleProjectSelect(project.projectId)}
                                >
                                    Chọn
                                </button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>

            {selectedProject && (
                <>
                    <p>
                        <strong>Dự án:</strong> {selectedProject.projectName} <br />
                        <strong>Khách hàng:</strong> {selectedProject.customer?.name || "Không rõ"}
                    </p>
                    <label className="form-label">Phương pháp phân bổ:</label>
                    <select
                        className="form-select"
                        value={splitMethod}
                        onChange={(e) => handleSplitMethodChange(e.target.value)}
                    >
                        <option value="equal">Chia đều</option>
                        <option value="percentage">Chia theo phần trăm</option>
                    </select>
                    <div className="mb-3">
                        <label htmlFor="installments" className="form-label">
                            Số đợt
                        </label>
                        <input
                            id="installments"
                            type="number"
                            className="form-control"
                            value={installments}
                            min="1"
                            onChange={(e) => handleInstallmentsChange(e.target.value)}
                        />
                    </div>
                    {splitMethod === "percentage" &&
                        percentages.map((percentage, index) => (
                            <div key={index} className="mb-2">
                                <label>
                                    Đợt {index + 1} (%):
                                    <input
                                        type="number"
                                        className="form-control d-inline-block w-25 ms-2"
                                        value={percentage}
                                        onChange={(e) => handlePercentagesChange(index, e.target.value)}
                                    />
                                </label>
                            </div>
                        ))}
                    {installmentDetails.length > 0 && (
                        <div>
                            <h4>Chi tiết các đợt thanh toán</h4>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Đợt</th>
                                        <th>Số Tiền</th>
                                        <th>Ngày Thanh Toán</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {installmentDetails.map((installment) => (
                                        <tr key={installment.installmentNumber}>
                                            <td>{installment.installmentNumber}</td>
                                            <td>{formatCurrency(installment.amount)}</td>
                                            <td>{installment.paymentDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <button className="btn btn-primary" onClick={handleAddPayments}>
                        Thêm Thanh Toán
                    </button>
                </>

            )}
        </div>
    );
}

export default Payment;