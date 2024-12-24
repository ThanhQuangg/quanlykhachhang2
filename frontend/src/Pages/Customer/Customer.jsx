import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { PATHS } from "../../constant/pathnames";
import { getPaginatedCustomers, deleteCustomer, searchCustomers } from "../../services/customerServices";

function Customer() {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [classificationFilter, setClassificationFilter] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [customersPerPage, setCustomersPerPage] = useState(2);
    const [customUsersPerPage, setCustomUsersPerPage] = useState("");
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    // Fetch all customers
    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const data = await getPaginatedCustomers(currentPage, customersPerPage);
                if (data && Array.isArray(data.content)) {
                    setCustomers(data.content);
                    setTotalPages(data.totalPages);
                }
            } catch (err) {
                console.error("Error fetching customers:", err);
            } finally {
                setLoading(false);
            }

        };

        fetchCustomers();
    }, [currentPage, customersPerPage]);

    // Apply search and classification filter
    useEffect(() => {
        if (!Array.isArray(customers)) return;

        let tempCustomers = [...customers];

        // Filter by classification if selected
        if (classificationFilter) {
            tempCustomers = tempCustomers.filter(
                (customer) =>
                    customer.classification?.classificationName === classificationFilter
            );
        }

        //Filter by search term
        if (searchTerm) {
            tempCustomers = tempCustomers.filter(
                (customer) =>
                    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredCustomers(tempCustomers);
        // setCurrentPage(1); // Reset to the first page after filtering
    }, [searchTerm, classificationFilter, customers]);

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

    const sortedCustomers = Array.isArray(filteredCustomers) ? [...filteredCustomers].sort((a, b) => {
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

    // Handle delete customer
    // const confirmDelete = (customerId) => {
    //     setCustomerToDelete(customerId);
    // };
    const confirmDelete = async (customerId) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                await deleteCustomer(customerId);
                setCustomers(customers.filter((customer) => customer.customerId !== customerId));
            } catch (err) {
                console.error("Error deleting customer:", err);
            }
        }
    };

    // const handleDelete = async () => {
    //     try {
    //         await deleteCustomer(customerToDelete);
    //         setCustomers(customers.filter((customer) => customer.customerId !== customerToDelete));
    //         setSuccessMessage("Customer deleted successfully!");
    //         setCustomerToDelete(null);
    //         setTimeout(() => setSuccessMessage(""), 3000);
    //     } catch (err) {
    //         console.error("Error deleting customer:", err);
    //         setError("Unable to delete customer.");
    //     }
    // };

    // const handleNextPage = () => {
    //     if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    // };

    // const handlePreviousPage = () => {
    //     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    // };

    // Get user role from localStorage (e.g., "Admin", "Staff")
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.role; // Assuming the user object contains the role

    // if (error) {
    //     return <div className="alert alert-danger">{error}</div>;
    // }

    // if (customers.length === 0) {
    //     return <div className="alert alert-warning">Không có khách hàng nào được tìm thấy.</div>;
    // }

    //them moi

    // Sắp xếp dữ liệu dựa trên cột và thứ tự
    // const sortedCustomers = [...currentCustomers].sort((a, b) => {
    //     if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
    //     if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
    //     return 0;
    // });



    const [columnSearch, setColumnSearch] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        classificationId: ""
    });
    const [showSearchInput, setShowSearchInput] = useState({
        name: false,
        email: false,
        phone: false,
        gender: false,
        classificationId: false,
    });
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        classificationId: "",
        searchTerm: "",
    });
    const handleColumnSearch = async (column) => {
        // Gọi API tìm kiếm tương ứng
        try {
            let results = [];
            if (column === "name") {
                results = await searchCustomers(columnSearch.name);
            } else if (column === "email") {
                results = await searchCustomers(columnSearch.email);
            } else if (column === "phone") {
                results = await searchCustomers(columnSearch.phone);
            } else if (column === "gender") {
                results = await searchCustomers(columnSearch.gender);
            }
            setFilteredCustomers(results);
        } catch (err) {
            console.error("Error searching column:", err);
        }
    };


    const handleSearch = async () => {
        try {
            setLoading(true);
            const data = await searchCustomers(filters);
            setFilteredCustomers(data);
        } catch (error) {
            console.error("Error during search:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value === "custom") {
            setCustomersPerPage(""); // Reset giá trị nếu chọn "Tùy chỉnh"
        } else {
            setCustomersPerPage(Number(value));
            setCustomUsersPerPage(""); // Xóa giá trị tùy chỉnh nếu chọn option khác
        }
    };

    const handleCustomInputChange = (e) => {
        const value = e.target.value;
        const number = Number(value);
        if (!isNaN(number) && number > 0) {
            setCustomersPerPage(number); // Cập nhật số lượng người dùng khi nhập đúng số
        }
        setCustomUsersPerPage(value); // Lưu giá trị trong input
    };

    return (
        <div className="container">
            {/* Success Message */}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {/* Add Customer Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Danh sách khách hàng</h1>
                <NavLink to={PATHS.ADD_CUSTOMER} className="btn btn-primary">
                    Thêm khách hàng
                </NavLink>
            </div>

            {/* Search and Filter */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                {/* Search */}
                {/* <input
                        type="text"
                        className="form-control w-50 me-3"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    /> */}
                {/* Filter */}
                <select
                    className="form-select w-25"
                    value={classificationFilter}
                    onChange={(e) => setClassificationFilter(e.target.value)}
                >
                    <option value="">Tất cả phân loại</option>
                    <option value="VIP">VIP</option>
                    <option value="Normal">Normal</option>
                    <option value="Potential">Potential</option>
                </select>
                <select
                    className="form-select w-25"
                    value={customersPerPage || "custom"}
                    // onChange={(e) => setUsersPerPage(Number(e.target.value))}
                    onChange={handleSelectChange}
                >
                    <option value={2}>2 per page</option>
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value="custom">Tùy chỉnh</option>
                </select>
                {customersPerPage === "" && (
                    <input
                        type="number"
                        className="form-control w-25 mt-2"
                        placeholder="Nhập số khách hàng mỗi trang"
                        value={customUsersPerPage}
                        onChange={handleCustomInputChange}
                        min={1}
                    />
                )}
            </div>

            {/* Customer Table */}
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">


                        <tr>
                            <th onClick={() => handleSort("customerId")}>ID {sortColumn === "customerId" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                            <th onClick={() => handleSort("name")}>Tên {sortColumn === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, name: !showSearchInput.name });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.name && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search CustomerName"
                                        value={filters.name}
                                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            <th onClick={() => handleSort("email")}>Email {sortColumn === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, email: !showSearchInput.email });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.email && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search email"
                                        value={filters.email}
                                        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            <th onClick={() => handleSort("phone")}>Điện thoại {sortColumn === "phone" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, phone: !showSearchInput.phone });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.phone && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search phone"
                                        value={filters.phone}
                                        onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            <th onClick={() => handleSort("address")}>Địa chỉ {sortColumn === "address" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, address: !showSearchInput.address });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.address && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search address"
                                        value={filters.address}
                                        onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            <th onClick={() => handleSort("category")}>Phân loại {sortColumn === "classificationId" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, classificationId: !showSearchInput.classificationId });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.classificationId && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search classificationId"
                                        value={filters.classificationId}
                                        onChange={(e) => setFilters({ ...filters, classificationId: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* {currentCustomers.map((customer) => ( */}
                        {sortedCustomers.map((customer) => (
                            <tr key={customer.customerId}>
                                <td>{customer.customerId}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.address}</td>
                                <td>{customer.classification?.classificationName}</td>
                                <td>
                                    <NavLink
                                        to={`${PATHS.EDIT_CUSTOMER}/${customer.customerId}`}
                                        className="btn btn-warning btn-sm me-2"
                                    >
                                        Sửa
                                    </NavLink>
                                    {/* Only render Delete button if user role is "Admin" */}
                                    {userRole === "Admin" && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => confirmDelete(customer.customerId)}
                                        >
                                            Xóa
                                        </button>
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
            {customerToDelete && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xác nhận xóa</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setCustomerToDelete(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xóa khách hàng này?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setCustomerToDelete(null)}
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
        </div>
    );
}

export default Customer;
