import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getPaginatedProjects, deleteProject, getAllProjectTypes, searchProjects } from "../../services/projectServices";
import { PATHS } from "../../constant/pathnames";

function Project() {
    const [projects, setProjects] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]); // State for project types
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null); // Project details being viewed
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [projectsPerPage, setProjectsPerPage] = useState(2);
    const [customProjectsPerPage, setCustomProjectsPerPage] = useState("");


    //them moi
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    //====================================================


    // Fetch projects and project types when the component mounts
    useEffect(() => {
        const fetchProjectTypes = async () => {
            setLoading(true);
            try {
                const data = await getAllProjectTypes();
                if (data && Array.isArray(data)) {
                    setProjectTypes(data);
                }
            } catch (err) {
                console.error("Error fetching project type:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectTypes();
    }, []);

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

        // Filter by status if selected
        if (statusFilter) {
            tempProjects = tempProjects.filter(
                (project) => project.status === statusFilter
            );
        }

        // Filter by type if selected
        if (typeFilter) {
            tempProjects = tempProjects.filter(
                (project) => project.type?.typeName === typeFilter
            );
        }

        setFilteredProjects(tempProjects);
    }, [statusFilter, typeFilter, projects]);


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

    // Function to confirm deletion of a project
    const confirmDelete = (projectId) => {
        setProjectToDelete(projectId);
    };

    // Handle deletion of a project
    const handleDelete = async () => {
        try {
            await deleteProject(projectToDelete);
            setProjects((prevProjects) =>
                prevProjects.filter((project) => project.projectId !== projectToDelete)
            );
            setSuccessMessage("Dự án đã được xóa thành công!");
            setProjectToDelete(null);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Error deleting project:", err);
            setError("Không thể xóa dự án.");
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

    // Function to show project details in a modal
    const viewProjectDetails = (project) => {
        setProjectDetails(project);
    };

    // Format currency with dot separator
    const formatCurrency = (value) => {
        let num = value.toString().replace(/\./g, '').replace(',', '.');
        if (isNaN(num)) return value;
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };


    // Phân Quyền
    const user = JSON.parse(localStorage.getItem("user"));
    const isAuthorized = user?.role === "Admin" || user?.role === "Manager"; // Allow Admin and Manager


    return (
        <div className="container">
            {/* Success Message */}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {/* Add Project and View Project Types Buttons */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Danh sách dự án</h1>
                <div className="d-flex gap-2">
                    <NavLink to={PATHS.ADD_PROJECT} className="btn btn-primary">
                        Thêm dự án
                    </NavLink>
                    <NavLink to={PATHS.PROJECT_TYPES} className="btn btn-secondary">
                        Xem danh sách loại dự án
                    </NavLink>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="d-flex gap-3 align-items-center mb-4">
                <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Accepted_NotPaid">Accepted - Not Paid</option>
                    <option value="Canceled">Canceled</option>
                </select>

                <select
                    className="form-select"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                >
                    <option value="">Tất cả loại dự án</option>
                    {projectTypes.map((type) => (
                        <option key={type.typeId} value={type.typeName}>
                            {type.typeName}
                        </option>
                    ))}
                </select>
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
                        value={customUsersPerPage}
                        onChange={handleCustomInputChange}
                        min={1}
                    />
                )}

                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm tên dự án..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* <button className="btn btn-outline-secondary" onClick={clearFilters}>
                    Xóa bộ lọc
                </button> */}
            </div>

            {/* Project Table */}
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th onClick={() => handleSort("projectId")}>
                                ID {sortColumn === "projectId" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
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
                            <th onClick={() => handleSort("customer")}>
                                Khách hàng {sortColumn === "customer" && (sortOrder === "asc" ? "↑" : "↓")}
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
                            <th onClick={() => handleSort("manager")}>
                                Người quản lý {sortColumn === "manager" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, userId: !showSearchInput.userId });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.userId && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search userId"
                                        value={filters.userId}
                                        onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>

                            <th onClick={() => handleSort("projectType")}>
                                Loại dự án {sortColumn === "projectType" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, projectTypeId: !showSearchInput.projectTypeId });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.projectTypeId && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search projectTypeId"
                                        value={filters.projectTypeId}
                                        onChange={(e) => setFilters({ ...filters, projectTypeId: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>

                            <th onClick={() => handleSort("status")}>
                                Trạng thái {sortColumn === "status" && (sortOrder === "asc" ? "↑" : "↓")}
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

                            <th onClick={() => handleSort("startDate")}>
                                Ngày bắt đầu {sortColumn === "startDate" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, startDate: !showSearchInput.startDate });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.startDate && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search startDate"
                                        value={filters.startDate}
                                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>

                            <th onClick={() => handleSort("endDate")}>
                                Ngày kết thúc {sortColumn === "endDate" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, endDate: !showSearchInput.endDate });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.endDate && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search endDate"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            <th>Actions</th>
                        </tr>

                    </thead>
                    <tbody>
                        {/* {currentProjects.map((project) => ( */}
                        {sortedProjects.map((project) => (
                            <tr key={project.projectId}>
                                <td>{project.projectId}</td>
                                <td>{project.projectName}</td>
                                <td>{project.customer?.name || "Không có khách hàng"}</td>
                                <td>{project.user?.fullName || "Không có người quản lý"}</td>
                                <td>{project.projectType?.typeName || "Không có loại dự án"}</td>
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
                                <td>{project.startDate}</td>
                                <td>{project.endDate || "Chưa có ngày kết thúc"}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm me-2"
                                        onClick={() => viewProjectDetails(project)}
                                    >
                                        Xem
                                    </button>
                                    {isAuthorized && (
                                        <>
                                            <NavLink
                                                to={`${PATHS.EDIT_PROJECT}/${project.projectId}`}
                                                className="btn btn-warning btn-sm me-2"
                                            >
                                                Sửa
                                            </NavLink>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => confirmDelete(project.projectId)}
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    )}

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

            {/* Delete Confirmation Modal */}
            {projectToDelete && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    tabIndex="-1"
                    aria-labelledby="deleteConfirmationModal"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xác nhận xóa</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setProjectToDelete(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xóa dự án này?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setProjectToDelete(null)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Project Details Modal */}
            {projectDetails && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    tabIndex="-1"
                    aria-labelledby="projectDetailsModal"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi tiết dự án</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setProjectDetails(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>ID:</strong> {projectDetails.projectId}</p>
                                <p><strong>Tên dự án:</strong> {projectDetails.projectName}</p>
                                <p><strong>Mô tả:</strong> {projectDetails.description}</p>
                                <p><strong>Trạng thái:</strong> {projectDetails.status}</p>
                                <p><strong>Ngày bắt đầu:</strong> {projectDetails.startDate}</p>
                                <p><strong>Ngày kết thúc:</strong> {projectDetails.endDate || "Chưa có ngày kết thúc"}</p>
                                <p><strong>Số tiền tổng:</strong> {formatCurrency(projectDetails.totalAmount)}</p>
                                <p><strong>Số tiền đã trả:</strong> {formatCurrency(projectDetails.paidAmount)}</p>
                                <p><strong>Số tiền còn lại:</strong> {formatCurrency(projectDetails.remainingAmount)}</p>
                                <p><strong>Người quản lý:</strong> {projectDetails.user.fullName || "Không có"}({projectDetails.user.role || "Không có"})   </p>
                                <p><strong>Khách hàng:</strong> {projectDetails.customer.name || "Không có"}</p>
                                <p><strong>Loại dự án:</strong> {projectDetails.projectType.typeName}</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setProjectDetails(null)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Project;
