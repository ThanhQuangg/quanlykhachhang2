import React, { useState, useEffect } from "react";
import {
    getAllPayments,
    updatePayment,
} from "../../services/paymentService";
import { getAllProjects, updateProject, getPaginatedProjects, searchProjects } from "../../services/projectServices";
import { Modal, Button, Form } from "react-bootstrap";


function PaymentList() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentPayment, setCurrentPayment] = useState(null);
    const [paidAmount, setPaidAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [projectsPerPage, setProjectsPerPage] = useState(2);
    const [customProjectsPerPage, setCustomProjectsPerPage] = useState("");
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    // Hàm định dạng tiền tệ
    const formatCurrency = (value) => {
        return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    };

    // Fetch all projects
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const data = await getPaginatedProjects(currentPage, projectsPerPage);
                if (data && Array.isArray(data.content)) {
                    setProjects(data.content);
                    setTotalPages(data.totalPages);
                }
            } catch (err) {
                console.error("Error fetching customers:", err);
            } finally {
                setLoading(false);
            }

        };

        fetchProjects();
    }, [currentPage, projectsPerPage]);

    useEffect(() => {
        if (!Array.isArray(projects)) return;

        let tempProjects = [...projects];



        setFilteredProjects(tempProjects);
    }, [projects]);

    // Fetch payments for the selected project
    const fetchPaymentsForProject = async (projectId) => {
        try {
            const paymentData = await getAllPayments();
            const filteredPayments = paymentData.filter(
                (payment) => payment.project?.projectId === projectId
            );

            // Tính tổng số tiền đã thanh toán
            const totalPaidAmount = filteredPayments
                .filter((payment) => payment.paymentStatus === "Paid")
                .reduce((sum, payment) => sum + payment.amount, 0);

            setPayments(filteredPayments);

            const updatedProject = projects.find(
                (project) => project.projectId === projectId
            );

            // Cập nhật `paidAmount` của dự án
            updatedProject.paidAmount = totalPaidAmount;

            // Cập nhật UI
            setSelectedProject(updatedProject);
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.projectId === projectId ? updatedProject : project
                )
            );
        } catch (err) {
            console.error("Error fetching payments:", err);
            setError("Unable to fetch payments.");
        }
    };


    const handlePaymentStatusUpdate = async (paymentId, amount) => {
        if (!selectedProject) return;

        try {
            // Update payment status to "Paid"
            await updatePayment(paymentId, { paymentStatus: "Paid" });

            // Fetch updated payments for the selected project
            const paymentData = await getAllPayments();
            const filteredPayments = paymentData.filter(
                (payment) => payment.project?.projectId === selectedProject.projectId
            );

            // Tính toán lại số tiền đã thanh toán
            const totalPaidAmount = filteredPayments
                .filter((payment) => payment.paymentStatus === "Paid")
                .reduce((sum, payment) => sum + payment.amount, 0);

            // Lấy ngày hiện tại theo múi giờ Việt Nam
            const currentDate = new Date().toLocaleDateString("en-CA", {
                timeZone: "Asia/Ho_Chi_Minh",
            }); // Định dạng YYYY-MM-DD

            // Cập nhật thông tin dự án
            const updatedProject = {
                ...selectedProject,
                paidAmount: totalPaidAmount,
            };

            // Nếu số tiền đã thanh toán đủ, chuyển trạng thái dự án và cập nhật endDate
            if (totalPaidAmount >= selectedProject.totalAmount) {
                updatedProject.status = "Completed";
                updatedProject.endDate = currentDate; // Cập nhật ngày hiện tại
            }

            await updateProject(selectedProject.projectId, updatedProject);

            // Cập nhật UI
            setPayments(filteredPayments);
            setSelectedProject(updatedProject);
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.projectId === updatedProject.projectId
                        ? updatedProject
                        : project
                )
            );

            setSuccessMessage("Payment marked as Paid successfully!");
            setTimeout(() => setSuccessMessage(""), 3000); // Clear success message
        } catch (err) {
            console.error("Error updating payment status:", err);
            setError("Unable to update payment status.");
        }
    };

    const handleShowModal = (payment) => {
        setCurrentPayment(payment);
        setPaidAmount(payment.amount);
        setShowModal(true);
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            // Đổi thứ tự nếu cùng cột
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            // Đổi cột và đặt thứ tự mặc định là tăng dần
            setSortColumn(column);
            setSortOrder("asc");
        }
    };

    const sortedProjects = Array.isArray(filteredProjects) ? [...filteredProjects].sort((a, b) => {
        if (!sortColumn) return 0;
        if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
        return 0;
    }) : [];

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const [columnSearch, setColumnSearch] = useState({
        customerId: "",
        userId: "",
        projectTypeId: "",
        projectName: "",
        status: "",
        startDate: "",
        endDate: "",
        minAmount: "",
        maxAmount: ""
    });
    const [showSearchInput, setShowSearchInput] = useState({
        customerId: false,
        userId: false,
        projectTypeId: false,
        projectName: false,
        status: false,
        startDate: false,
        endDate: false,
        minAmount: false,
        maxAmount: false
    });
    const [filters, setFilters] = useState({
        customerId: "",
        userId: "",
        projectTypeId: "",
        projectName: "",
        status: "",
        startDate: "",
        endDate: "",
        minAmount: "",
        maxAmount: "",
        searchTerm: "",
    });
    const handleColumnSearch = async (column) => {
        // Gọi API tìm kiếm tương ứng
        try {
            let results = [];
            if (column === "customerId") {
                results = await searchProjects(columnSearch.customerId);
            } else if (column === "userId") {
                results = await searchProjects(columnSearch.userId);
            } else if (column === "projectTypeId") {
                results = await searchProjects(columnSearch.projectTypeId);
            } else if (column === "projectName") {
                results = await searchProjects(columnSearch.projectName);
            } else if (column === "status") {
                results = await searchProjects(columnSearch.status);
            } else if (column === "startDate") {
                results = await searchProjects(columnSearch.startDate);
            } else if (column === "endDate") {
                results = await searchProjects(columnSearch.endDate);
            } else if (column === "minAmount") {
                results = await searchProjects(columnSearch.minAmount);
            } else if (column === "maxAmount") {
                results = await searchProjects(columnSearch.maxAmount);
            }
            setFilteredCustomers(results);
        } catch (err) {
            console.error("Error searching column:", err);
        }
    };


    const handleSearch = async () => {
        try {
            setLoading(true);
            const data = await searchProjects(filters);
            setFilteredProjects(data);
        } catch (error) {
            console.error("Error during search:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value === "custom") {
            setProjectsPerPage(""); // Reset giá trị nếu chọn "Tùy chỉnh"
        } else {
            setProjectsPerPage(Number(value));
            setCustomProjectsPerPage(""); // Xóa giá trị tùy chỉnh nếu chọn option khác
        }
    };

    const handleCustomInputChange = (e) => {
        const value = e.target.value;
        const number = Number(value);
        if (!isNaN(number) && number > 0) {
            setProjectsPerPage(number); // Cập nhật số lượng người dùng khi nhập đúng số
        }
        setCustomProjectsPerPage(value); // Lưu giá trị trong input
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container">
            {/* Success Message */}
            {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
            )}

            <h2>Danh sách Dự Án</h2>
            <select
                className="form-select w-25"
                value={projectsPerPage || "custom"}
                onChange={handleSelectChange}
            >
                <option value={2}>2 per page</option>
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value="custom">Tùy chỉnh</option>
            </select>
            {projectsPerPage === "" && (
                <input
                    type="number"
                    className="form-control w-25 mt-2"
                    placeholder="Nhập số khách hàng mỗi trang"
                    value={customProjectsPerPage}
                    onChange={handleCustomInputChange}
                    min={1}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            {/* <th>ID</th> */}
                            <th onClick={() => handleSort("projectId")}>
                                ID {sortColumn === "projectId" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            {/* <th>Tên Dự Án</th> */}
                            <th onClick={() => handleSort("projectName")}>
                                Tên dự án {sortColumn === "projectName" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, projectName: !showSearchInput.projectName });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.projectName && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search projectName"
                                        value={filters.projectName}
                                        onChange={(e) => setFilters({ ...filters, projectName: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            {/* <th>Tổng Tiền</th> */}
                            <th onClick={() => handleSort("totalAmount")}>
                                Tổng tiền {sortColumn === "totalAmount" && (sortOrder === "asc" ? "↑" : "↓")}
                                {/* <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, projectName: !showSearchInput.projectName });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.projectName && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search projectName"
                                        value={filters.projectName}
                                        onChange={(e) => setFilters({ ...filters, projectName: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )} */}
                            </th>
                            <th onClick={() => handleSort("paidAmount")}>
                                Số tiền đã thanh toán {sortColumn === "paidAmount" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                            <th onClick={() => handleSort("remainingAmount")}>
                                Số tiền còn lại {sortColumn === "remainingAmount" && (sortOrder === "asc" ? "↑" : "↓")}</th>

                            <th onClick={() => handleSort("status")}>
                                Trạng thái dự án {sortColumn === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, status: !showSearchInput.status });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.status && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search status"
                                        value={filters.status}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>

                            <th onClick={() => handleSort("customerId")}>
                                Khách Hàng {sortColumn === "customerId" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, customerId: !showSearchInput.customerId });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.customerId && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search customerId"
                                        value={filters.customerId}
                                        onChange={(e) => setFilters({ ...filters, customerId: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            <th>Chi Tiết Thanh Toán</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedProjects.map((project) => (
                            <tr key={project.projectId}>
                                <td>{project.projectId}</td>
                                <td>{project.projectName}</td>
                                <td>{formatCurrency(project.totalAmount)}</td>
                                <td>{formatCurrency(project.paidAmount)}</td>

                                <td>
                                    {formatCurrency(
                                        project.totalAmount - project.paidAmount
                                    )}
                                </td>
                                <td>
                                    <span
                                        className={`badge ${project.status === "Ongoing"
                                            ? "bg-primary"
                                            : project.status === "Completed"
                                                ? "bg-success"
                                                : project.status === "Accepted_NotPaid"
                                                    ? "bg-warning text-dark"
                                                    : "bg-danger"
                                            }`}
                                    >
                                        {project.status === "Ongoing"
                                            ? "Đang thực hiện"
                                            : project.status === "Completed"
                                                ? "Hoàn thành"
                                                : project.status === "Accepted_NotPaid"
                                                    ? "Chấp nhận nhưng chưa thanh toán"
                                                    : "Đã hủy"}
                                    </span>
                                </td>

                                <td>{project.customer?.name || "Không rõ"}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() =>
                                            fetchPaymentsForProject(
                                                project.projectId
                                            )
                                        }
                                    >
                                        Xem Chi Tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage + 1 >= totalPages}
                >
                    Next
                </button>
            </div>

            {/* Display payments for the selected project */}
            {selectedProject && (
                <>
                    <h3 className="mt-4">
                        Chi Tiết Thanh Toán Dự Án: {selectedProject.projectName}
                    </h3>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Đợt</th>
                                    <th>Số Tiền</th>
                                    <th>Ngày Thanh Toán</th>
                                    <th>Trạng Thái</th>
                                    <th>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.paymentId}>
                                        <td>{payment.paymentId}</td>
                                        <td>{payment.installmentNumber}</td>
                                        <td>{formatCurrency(payment.amount)}</td>
                                        <td>{payment.paymentDate}</td>
                                        <td>{payment.paymentStatus}</td>

                                        <td>
                                            {payment.paymentStatus !== "Paid" && (
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleShowModal(payment)}
                                                >
                                                    Thanh Toán
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        className="btn btn-secondary mt-3"
                        onClick={() => setSelectedProject(null)}
                    >
                        Quay Lại
                    </button>
                </>
            )}
            {/* Modal for payment confirmation */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formPaidAmount">
                            <Form.Label>Số tiền đã thanh toán</Form.Label>
                            <Form.Control
                                type="number"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(Number(e.target.value))}
                            />
                        </Form.Group>
                        <p>
                            Bạn có chắc chắn muốn đánh dấu thanh toán này là "Đã thanh toán" với số tiền {formatCurrency(paidAmount)} không?
                        </p>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handlePaymentStatusUpdate}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default PaymentList;
