import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
    getAllEvents,
    deleteEvent,
    createEvent,
    updateEvent,
    getAllEventTypes,
    getPaginatedEvents,
    searchEvents
} from "../../services/eventServices";
import { PATHS } from "../../constant/pathnames";

function Event() {
    const [events, setEvents] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false); // State for loading
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [eventToDelete, setEventToDelete] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [eventsPerPage, setEventsPerPage] = useState(2);
    const [customEventsPerPage, setCustomEventsPerPage] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);

    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [errors, setErrors] = useState({});
    //==============================

    // Add/Edit form state
    const [formData, setFormData] = useState({
        eventTypeId: "",
        description: "",
        eventDate: "",
    });

    useEffect(() => {
        const fetchEventTypes = async () => {
            setLoading(true);
            try {
                const data = await getAllEventTypes();
                if (data && Array.isArray(data)) {
                    setEventTypes(data);
                }
            } catch (err) {
                console.error("Error fetching event type:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEventTypes();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const data = await getPaginatedEvents(currentPage, eventsPerPage);
                if (data && Array.isArray(data.content)) {
                    setEvents(data.content);
                    setTotalPages(data.totalPages);
                }
            } catch (err) {
                console.error("Error fetching events:", err);
            } finally {
                setLoading(false);
            }

        };

        fetchEvents();
    }, [currentPage, eventsPerPage]);

    useEffect(() => {
        if (!Array.isArray(events)) return;

        let tempEvetns = [...events];

        // // Filter by status if selected
        // if (statusFilter) {
        //     tempProjects = tempProjects.filter(
        //         (project) => project.status === statusFilter
        //     );
        // }

        // // Filter by type if selected
        // if (typeFilter) {
        //     tempProjects = tempProjects.filter(
        //         (project) => project.type?.typeName === typeFilter
        //     );
        // }

        setFilteredEvents(tempEvetns);
    }, [events]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();

        // Validate trước khi xử lý
        if (!validate()) {
            setError("Vui lòng kiểm tra lại thông tin nhập.");
            setTimeout(() => setError(""), 2000);
            return;
        }

        const eventPayload = {
            eventType: { eventTypeId: parseInt(formData.eventTypeId) },
            description: formData.description,
            eventDate: formData.eventDate,
        };

        setLoading(true);
        try {
            if (editingEventId) {
                // Update existing event
                const updatedEvent = await updateEvent(editingEventId, eventPayload);
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.eventId === editingEventId ? updatedEvent : event
                    )
                );
                setSuccessMessage("Sự kiện đã được cập nhật thành công!");
            } else {
                // Add new event
                const newEvent = await createEvent(eventPayload);
                const eventType = eventTypes.find(
                    (type) => type.eventTypeId === parseInt(formData.eventTypeId)
                );
                setEvents((prevEvents) => [{ ...newEvent, eventType }, ...prevEvents]);
                setSuccessMessage("Sự kiện đã được thêm thành công!");
            }

            // Đóng modal và reset form
            setShowAddModal(false);
            setFormData({ eventTypeId: "", description: "", eventDate: "" });
            setEditingEventId(null);

            // Tự động xóa thông báo thành công sau 2 giây
            setTimeout(() => setSuccessMessage(""), 2000);
        } catch (err) {
            console.error(err);
            setError("Không thể thêm hoặc cập nhật sự kiện. Vui lòng thử lại.");
            setTimeout(() => setError(""), 2000); // Clear error after 2 seconds
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = (event) => {
        setEditingEventId(event.eventId);
        setFormData({
            eventTypeId: event.eventType?.eventTypeId || "",
            description: event.description,
            eventDate: event.eventDate,
        });
        setShowAddModal(true);
    };
    const confirmDelete = (eventId) => {
        setEventToDelete(eventId);
    };

    const handleDelete = async () => {
        try {
            await deleteEvent(eventToDelete);
            setEvents((prevEvents) => prevEvents.filter((event) => event.eventId !== eventToDelete));
            setSuccessMessage("Sự kiện đã được xóa thành công!");
            setEventToDelete(null);
            setTimeout(() => setSuccessMessage(""), 2000);
        } catch (err) {
            console.error("Error deleting event:", err);
            setError("Không thể xóa sự kiện. Vui lòng thử lại.");
        }
    };

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };


    // Phân Quyền
    const user = JSON.parse(localStorage.getItem("user"));
    const isAuthorized = user?.role === "Admin" || user?.role === "Manager"; // Allow Admin and Manager

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    //them moi

    // Sắp xếp dữ liệu dựa trên cột và thứ tự
    const sortedEvents = Array.isArray(filteredEvents) ? [...filteredEvents].sort((a, b) => {
        if (!sortColumn) return 0;
        if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
        return 0;
    }) : [];

    const validate = () => {
        const newErrors = {};

        if (!formData.eventTypeId) {
            newErrors.eventTypeId = "Loại sự kiện là bắt buộc.";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Mô tả không được để trống.";
        }

        if (!formData.eventDate) {
            newErrors.eventDate = "Ngày diễn ra là bắt buộc.";
        } else if (new Date(formData.eventDate) < new Date().setHours(0, 0, 0, 0)) {
            newErrors.eventDate = "Ngày diễn ra phải từ hôm nay trở đi.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [columnSearch, setColumnSearch] = useState({
        eventTypeId: "",
        eventDate: "",
        status: "",
        reminderSent: "",
        description: "",
    });
    const [showSearchInput, setShowSearchInput] = useState({
        eventTypeId: false,
        eventDate: false,
        status: false,
        reminderSent: false,
        description: false,
    });
    const [filters, setFilters] = useState({
        eventTypeId: "",
        eventDate: "",
        status: "",
        reminderSent: "",
        description: "",
        searchTerm: "",
    });
    const handleColumnSearch = async (column) => {
        // Gọi API tìm kiếm tương ứng
        try {
            let results = [];
            if (column === "eventTypeId") {
                results = await searchEvents(columnSearch.eventTypeId);
            } else if (column === "eventDate") {
                results = await searchEvents(columnSearch.eventDate);
            } else if (column === "status") {
                results = await searchEvents(columnSearch.status);
            } else if (column === "reminderSent") {
                results = await searchEvents(columnSearch.reminderSent);
            } else if (column === "description") {
                results = await searchProjects(columnSearch.description);
            }
            setFilteredEvents(results);
        } catch (err) {
            console.error("Error searching column:", err);
        }
    };


    const handleSearch = async () => {
        try {
            setLoading(true);
            const data = await searchEvents(filters);
            setFilteredEvents(data);
        } catch (error) {
            console.error("Error during search:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value === "custom") {
            setEventsPerPage(""); // Reset giá trị nếu chọn "Tùy chỉnh"
        } else {
            setEventsPerPage(Number(value));
            setCustomEventsPerPage(""); // Xóa giá trị tùy chỉnh nếu chọn option khác
        }
    };

    const handleCustomInputChange = (e) => {
        const value = e.target.value;
        const number = Number(value);
        if (!isNaN(number) && number > 0) {
            setEventsPerPage(number); // Cập nhật số lượng người dùng khi nhập đúng số
        }
        setCustomEventsPerPage(value); // Lưu giá trị trong input
    };

    return (
        <div className="container">
            {loading && <div className="spinner-border text-primary" role="status"></div>}
            {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Danh sách Sự kiện</h1>
                <div className="d-flex">
                    <select
                        className="form-select w-25"
                        value={eventsPerPage || "custom"}
                        onChange={handleSelectChange}
                    >
                        <option value={2}>2 per page</option>
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value="custom">Tùy chỉnh</option>
                    </select>
                    {eventsPerPage === "" && (
                        <input
                            type="number"
                            className="form-control w-25 mt-2"
                            placeholder="Nhập số sự kiện mỗi trang"
                            value={customEventsPerPage}
                            onChange={handleCustomInputChange}
                            min={1}
                        />
                    )}
                    <NavLink
                        to={`${PATHS.EVENT_TYPES}`}
                        className="btn btn-primary btn-sm me-2"
                    >
                        Thêm Loại Sự kiện
                    </NavLink>

                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setShowAddModal(true);
                            setEditingEventId(null);
                            setFormData({ eventTypeId: "", description: "", eventDate: "" });
                        }}
                    >
                        Thêm Sự kiện
                    </button>
                </div>
            </div>


            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th onClick={() => handleSort("eventId")}>
                                ID {sortColumn === "eventId" && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                            <th onClick={() => handleSort("eventType.eventTypeName")}>
                                Tên Sự kiện {sortColumn === "eventType.eventTypeName" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, eventTypeId: !showSearchInput.eventTypeId });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.eventTypeId && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search eventTypeId"
                                        value={filters.eventTypeId}
                                        onChange={(e) => setFilters({ ...filters, eventTypeId: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            <th onClick={() => handleSort("description")}>
                                Mô tả {sortColumn === "description" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, description: !showSearchInput.description });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.description && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search description"
                                        value={filters.description}
                                        onChange={(e) => setFilters({ ...filters, description: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            <th onClick={() => handleSort("eventDate")}>
                                Ngày Diễn ra {sortColumn === "eventDate" && (sortOrder === "asc" ? "↑" : "↓")}
                                <span
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowSearchInput({ ...showSearchInput, eventDate: !showSearchInput.eventDate });
                                    }}
                                >
                                    🔍
                                </span>
                                {showSearchInput.eventDate && (
                                    <input
                                        type="text"
                                        className="form-control mt-1"
                                        placeholder="Search eventDate"
                                        value={filters.eventDate}
                                        onChange={(e) => setFilters({ ...filters, eventDate: e.target.value })}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                )}
                            </th>
                            <th onClick={() => handleSort("status")}>
                                Trạng Thái Sự Kiện {sortColumn === "status" && (sortOrder === "asc" ? "↑" : "↓")}
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
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {currentEvents.map((event) => ( */}
                        {sortedEvents.map((event) => (
                            <tr key={event.eventId}>
                                <td>{event.eventId}</td>
                                <td>{event.eventType?.eventTypeName || "N/A"}</td>
                                <td>{event.description}</td>
                                <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                                <td>{event.status}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(event)}
                                    >
                                        Sửa
                                    </button>
                                    {isAuthorized && (
                                        <>
                                            <button
                                                className="btn btn-danger btn-sm me-2"
                                                onClick={() => confirmDelete(event.eventId)}
                                            >
                                                Xóa
                                            </button>

                                            <NavLink
                                                to={`${PATHS.EVENT_DETAIL}/${event.eventId}`}
                                                className="btn btn-primary btn-sm me-2"
                                            >
                                                Phân Công Người Phụ Trách
                                            </NavLink>
                                        </>
                                    )}

                                </td>
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

            {/* Modal for Add/Edit Event */}
            {showAddModal && (
                <div className="modal fade show" style={{ display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleAddEvent}>
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {editingEventId ? "Sửa Sự kiện" : "Thêm Sự kiện"}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowAddModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="eventTypeId">Loại Sự kiện</label>
                                        <select
                                            className="form-select"
                                            id="eventTypeId"
                                            name="eventTypeId"
                                            value={formData.eventTypeId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Chọn loại sự kiện</option>
                                            {eventTypes.map((type) => (
                                                <option key={type.eventTypeId} value={type.eventTypeId}>
                                                    {type.eventTypeName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description">Mô tả</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="3"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="eventDate">Ngày Diễn ra</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="eventDate"
                                            name="eventDate"
                                            value={formData.eventDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingEventId ? "Cập nhật" : "Thêm"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {eventToDelete && (
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
                                    onClick={() => setEventToDelete(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Bạn có chắc chắn muốn xóa sự kiện này?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setEventToDelete(null)}
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

export default Event;