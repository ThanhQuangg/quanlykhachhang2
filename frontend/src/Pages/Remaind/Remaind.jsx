import React, { useEffect, useState } from "react";
import { getAllNotifications, getPaginatedNotifications, searchNotifications } from "../../services/eventNotificationServices";

function Remaind() {
    const [notifications, setNotifications] = useState([]);
    const [groupedNotifications, setGroupedNotifications] = useState({});
    const [error, setError] = useState("");
    const [sortConfig, setSortConfig] = useState({ column: null, order: "asc" });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [notificationsPerPage, setNotificationsPerPage] = useState(2);
    const [customNotificationsPerPage, setCustomNotificationsPerPage] = useState("");
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getPaginatedNotifications(currentPage, notificationsPerPage);
                if (data && Array.isArray(data.content)) {
                    setNotifications(data.content);
                    setTotalPages(data.totalPages);
                }
            } catch (err) {
                console.error("Error fetching notifications:", err);
            } finally {
                setLoading(false);
            }

        };

        fetchNotifications();
    }, [currentPage, notificationsPerPage]);

    useEffect(() => {
        if (!Array.isArray(notifications)) return;

        let tempNotifications = [...notifications];
        setFilteredNotifications(tempNotifications);

    }, [notifications]);

    // const handleSort = (column, keyExtractor) => {
    //     const newOrder = sortConfig.column === column && sortConfig.order === "asc" ? "desc" : "asc";
    //     setSortConfig({ column, order: newOrder });

    //     const sortFunction = (a, b) => {
    //         const valueA = keyExtractor(a) ?? "";
    //         const valueB = keyExtractor(b) ?? "";
    //         if (valueA < valueB) return newOrder === "asc" ? -1 : 1;
    //         if (valueA > valueB) return newOrder === "asc" ? 1 : -1;
    //         return 0;
    //     };

    //     const updatedGroups = Object.fromEntries(
    //         Object.entries(groupedNotifications).map(([key, notifications]) => [
    //             key,
    //             [...notifications].sort(sortFunction),
    //         ])
    //     );

    //     setGroupedNotifications(updatedGroups);
    // };

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

    const sortedNotifications = Array.isArray(filteredNotifications) ? [...filteredNotifications].sort((a, b) => {
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
        eventUserID: "",
        method: "",
        status: "",
        eventName: "",
        eventDate: "",
        location: ""
    });
    const [showSearchInput, setShowSearchInput] = useState({
        eventUserID: false,
        method: false,
        status: false,
        eventName: false,
        eventDate: false,
        location: false
    });
    const [filters, setFilters] = useState({
        eventUserID: "",
        method: "",
        status: "",
        eventName: "",
        eventDate: "",
        location: "",
        searchTerm: "",
    });
    // const handleColumnSearch = async (column) => {
    //     // Gọi API tìm kiếm tương ứng
    //     try {
    //         let results = [];
    //         if (column === "name") {
    //             results = await searchCustomers(columnSearch.name);
    //         } else if (column === "email") {
    //             results = await searchCustomers(columnSearch.email);
    //         } else if (column === "phone") {
    //             results = await searchCustomers(columnSearch.phone);
    //         } else if (column === "gender") {
    //             results = await searchCustomers(columnSearch.gender);
    //         }
    //         setFilteredCustomers(results);
    //     } catch (err) {
    //         console.error("Error searching column:", err);
    //     }
    // };


    const handleSearch = async () => {
        try {
            setLoading(true);
            const data = await searchNotifications(filters);
            setFilteredNotifications(data);
        } catch (error) {
            console.error("Error during search:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value === "custom") {
            setNotificationsPerPage(""); // Reset giá trị nếu chọn "Tùy chỉnh"
        } else {
            setNotificationsPerPage(Number(value));
            setCustomNotificationsPerPage(""); // Xóa giá trị tùy chỉnh nếu chọn option khác
        }
    };

    const handleCustomInputChange = (e) => {
        const value = e.target.value;
        const number = Number(value);
        if (!isNaN(number) && number > 0) {
            setNotificationsPerPage(number); // Cập nhật số lượng người dùng khi nhập đúng số
        }
        setCustomNotificationsPerPage(value); // Lưu giá trị trong input
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };



    // if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="table-responsive">
            <h2 className="text-center">Danh Sách Thông Báo Theo Sự Kiện</h2>

            <select
                className="form-select w-25"
                value={notificationsPerPage || "custom"}
                onChange={handleSelectChange}
            >
                <option value={2}>2 per page</option>
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value="custom">Tùy chỉnh</option>
            </select>
            {notificationsPerPage === "" && (
                <input
                    type="number"
                    className="form-control w-25 mt-2"
                    placeholder="Nhập số khách hàng mỗi trang"
                    value={customNotificationsPerPage}
                    onChange={handleCustomInputChange}
                    min={1}
                />
            )}

            {/* {Object.entries(groupedNotifications).map(([eventKey, notifications], index) => (
                <div key={index} className="mb-5">
                    <h3>{eventKey}</h3> */}
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            
                            <th onClick={() => handleSort("notificationId")}>
                                ID {sortColumn === "notificationId" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                           
                            <th onClick={() => handleSort("manager")}>
                                Người Phụ Trách {sortColumn === "manager" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>

                            
                            <th onClick={() => handleSort("customer")}>
                                Khách Hàng {sortColumn === "customer" && (sortOrder === "asc" ? "↑" : "↓")}
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
                            <th onClick={() => handleSort("method", (n) => n.method)}>
                                Hình Thức Thông Báo {sortConfig.column === "method" && (sortConfig.order === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, method: !showSearchInput.method });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.method && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search method"
                                        value={filters.method}
                                        onChange={(e) => setFilters({ ...filters, method: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            <th onClick={() => handleSort("sentAt", (n) => n.sentAt || "")}>
                                Thời Gian Gửi {sortConfig.column === "sentAt" && (sortConfig.order === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, sentAt: !showSearchInput.sentAt });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.sentAt && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search sentAt"
                                        value={filters.sentAt}
                                        onChange={(e) => setFilters({ ...filters, sentAt: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            <th onClick={() => handleSort("message", (n) => n.message)}>
                                Nội Dung {sortConfig.column === "message" && (sortConfig.order === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, sentAt: !showSearchInput.sentAt });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.sentAt && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search sentAt"
                                        value={filters.sentAt}
                                        onChange={(e) => setFilters({ ...filters, sentAt: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedNotifications.map((notification, idx) => (
                            <tr key={notification.notificationId}>
                                <td>{notification.notificationId}</td>
                                <td>{notification.eventUser.user.fullName}</td>
                                <td>{notification.eventUser.customer.name}</td>
                                <td>{notification.status}</td>
                                <td>{notification.method}</td>
                                <td>
                                    {notification.sentAt
                                        ? new Date(notification.sentAt).toLocaleString()
                                        : "Chưa gửi"}
                                </td>
                                <td>{notification.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <div className="d-flex justify-content-center align-items-center mt-3">
                <button
                    className="btn btn-secondary"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="mx-2">Page {currentPage} of {totalPages}</span>
                <button
                    className="btn btn-secondary"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

        </div>
    );
}

export default Remaind;
