import React, { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { getPaginatedUsers, searchByUsername, searchByEmail, searchByFullName, searchByRole, searchUsers, deleteUser } from "../../services/authService";
import { PATHS } from "../../constant/pathnames";
// import Pagination from "../../Pages/Pagination";


function User() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(0);
    const [usersPerPage, setUsersPerPage] = useState(2);
    const [customUsersPerPage, setCustomUsersPerPage] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const paginatedData = await getPaginatedUsers(currentPage, usersPerPage);
                if (paginatedData && Array.isArray(paginatedData.content)) {
                    setUsers(paginatedData.content);
                    setTotalPages(paginatedData.totalPages);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage, usersPerPage]);

    useEffect(() => {
        if (!Array.isArray(users)) return;

        let tempUsers = [...users];

        // Exclude "Admin" role
        tempUsers = tempUsers.filter((user) => user.role !== "Admin");

        // Apply role filter
        if (roleFilter) {
            tempUsers = tempUsers.filter((user) => user.role === roleFilter);
        }

        // Apply search filter
        if (searchTerm) {
            tempUsers = tempUsers.filter(
                (user) =>
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredUsers(tempUsers);
    }, [users, searchTerm, roleFilter]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortOrder("asc");
        }
    };

    const sortedUsers = Array.isArray(filteredUsers) ? [...filteredUsers].sort((a, b) => {
        if (!sortColumn) return 0;
        if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
        return 0;
    }) : [];

    const currentUsers = useMemo(() => {
        const dataToPaginate = filteredUsers.length > 0 ? filteredUsers : users;
        return dataToPaginate;
    }, [filteredUsers, users]);






    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const confirmDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(userId);
                setUsers(users.filter((user) => user.userId !== userId));
            } catch (err) {
                console.error("Error deleting user:", err);
            }
        }
    };

    const [columnSearch, setColumnSearch] = useState({
        userId: "",
        username: "",
        fullName: "",
        email: "",
        role: "",
    });
    const [showSearchInput, setShowSearchInput] = useState({
        userId: false,
        username: false,
        fullName: false,
        email: false,
        role: false,
    });
    const [filters, setFilters] = useState({
        username: "",
        email: "",
        role: "",
        fullName: "",
        searchTerm: "",
    });
    const handleColumnSearch = async (column) => {
        // Gọi API tìm kiếm tương ứng
        try {
            let results = [];
            if (column === "username") {
                results = await searchByUsername(columnSearch.username);
            } else if (column === "email") {
                results = await searchByEmail(columnSearch.email);
            } else if (column === "fullName") {
                results = await searchByFullName(columnSearch.fullName);
            } else if (column === "role") {
                results = await searchByRole(columnSearch.role);
            }
            setFilteredUsers(results);
        } catch (err) {
            console.error("Error searching column:", err);
        }
    };
    const handleSearch = async () => {
        try {
            setLoading(true);
            const data = await searchUsers(filters);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Error during search:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value === "custom") {
            setUsersPerPage(""); // Reset giá trị nếu chọn "Tùy chỉnh"
        } else {
            setUsersPerPage(Number(value));
            setCustomUsersPerPage(""); // Xóa giá trị tùy chỉnh nếu chọn option khác
        }
    };

    const handleCustomInputChange = (e) => {
        const value = e.target.value;
        const number = Number(value);
        if (!isNaN(number) && number > 0) {
            setUsersPerPage(number); // Cập nhật số lượng người dùng khi nhập đúng số
        }
        setCustomUsersPerPage(value); // Lưu giá trị trong input
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>User List</h1>
                <NavLink to={PATHS.ADD_USER} className="btn btn-primary">
                    Add User
                </NavLink>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <select
                    className="form-select w-25"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="Manager">Manager</option>
                    <option value="Staff">Staff</option>
                </select>
                <select
                    className="form-select w-25"
                    value={usersPerPage || "custom"}
                    onChange={handleSelectChange}
                >
                    <option value={2}>2 per page</option>
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value="custom">Tùy chỉnh</option>
                </select>
                {usersPerPage === "" && (
                    <input
                        type="number"
                        className="form-control w-25 mt-2"
                        placeholder="Nhập số người dùng mỗi trang"
                        value={customUsersPerPage}
                        onChange={handleCustomInputChange}
                        min={1}
                    />
                )}
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th onClick={() => handleSort("userId")}>
                                ID {sortColumn === "userId" && (sortOrder === "asc" ? "↑" : "↓")}

                            </th>
                            <th onClick={() => handleSort("username")}>
                                Username {sortColumn === "username" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, username: !showSearchInput.username });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.username && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search Username"
                                        value={filters.username}
                                        onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    // value={columnSearch.username}
                                    // onChange={(e) => setColumnSearch({ ...columnSearch, username: e.target.value })}

                                    // onKeyDown={(e) => {
                                    //     if (e.key === "Enter") {
                                    //         handleColumnSearch("username");
                                    //     }
                                    // }}
                                    />
                                )}
                            </th>
                            <th onClick={() => handleSort("fullName")}>
                                Full Name {sortColumn === "fullName" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={() => setShowSearchInput({ ...showSearchInput, fullName: !showSearchInput.fullName })}
                                >
                                    🔍
                                </span>
                                {showSearchInput.fullName && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search Full Name"
                                        value={filters.fullName}
                                        onChange={(e) => setFilters({ ...filters, fullName: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                    // <input
                                    //     type="text"
                                    //     className="form-control mt-1"
                                    //     placeholder="Search Full Name"
                                    //     value={columnSearch.fullName}
                                    //     onChange={(e) =>
                                    //         setColumnSearch({ ...columnSearch, fullName: e.target.value })
                                    //     }
                                    //     onKeyDown={(e) => {
                                    //         if (e.key === "Enter") handleColumnSearch("fullName");
                                    //     }}
                                    // />
                                )}
                            </th>
                            <th onClick={() => handleSort("email")}>
                                Email {sortColumn === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={() => setShowSearchInput({ ...showSearchInput, email: !showSearchInput.email })}
                                >
                                    🔍
                                </span>
                                {showSearchInput.email && (
                                    // <input
                                    //     type="text"
                                    //     className="form-control mt-1"
                                    //     placeholder="Search Email"
                                    //     value={columnSearch.email}
                                    //     onChange={(e) =>
                                    //         setColumnSearch({ ...columnSearch, email: e.target.value })
                                    //     }
                                    //     onKeyDown={(e) => {
                                    //         if (e.key === "Enter") handleColumnSearch("email");
                                    //     }}
                                    // />
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search Email"
                                        value={filters.email}
                                        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            <th onClick={() => handleSort("role")}>
                                Role {sortColumn === "role" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, role: !showSearchInput.role });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.role && (
                                    // <select
                                    //     className="form-select mt-1"
                                    //     value={filters.role}
                                    //     onChange={(e) => {
                                    //         setFilters({ ...filters, role: e.target.value });
                                    //         handleSearch();
                                    //     }}

                                    // >
                                    //     <option value="">Select Role</option>
                                    //     <option value="Manager">Manager</option>
                                    //     <option value="Staff">Staff</option>
                                    // </select>
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search Role"
                                        value={filters.role}
                                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}

                                    />
                                )}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map((user) => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.username}</td>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <NavLink
                                        to={`${PATHS.EDIT_USER}/${user.userId}`}
                                        className="btn btn-warning btn-sm me-2"
                                    >
                                        Edit
                                    </NavLink>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => confirmDelete(user.userId)}
                                    >
                                        Delete
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

            {/* <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                    className="btn btn-secondary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage + 1} of {totalPages}
                </span>
                <button
                    className="btn btn-secondary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage + 1 >= totalPages}
                >
                    Next
                </button>
            </div> */}
        </div>
    );
}

export default User;