import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    getEventById,
    assignUserAndCustomerToEvent,
    getEventUsersByEventId,
    getAvailableCustomersForEvent,
} from "../../services/eventServices";
import { getAllUsers } from "../../services/authService";

function EventDetails() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [users, setUsers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [customerFilter, setCustomerFilter] = useState(""); // Từ khóa tìm kiếm khách hàng
    const [userFilter, setUserFilter] = useState(""); // Từ khóa tìm kiếm người phụ trách

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const eventData = await getEventById(eventId);
                setEvent(eventData);
            } catch (err) {
                setError("Unable to fetch event details.");
            }
        };

        const fetchUsers = async () => {
            try {
                const allUsers = await getAllUsers();
                setUsers(allUsers.filter((user) => user.role !== "Admin"));
            } catch (err) {
                setError("Unable to fetch users.");
            }
        };

        const fetchEventUsers = async () => {
            try {
                const eventUsers = await getEventUsersByEventId(eventId);
                setEvent((prevEvent) => ({
                    ...prevEvent,
                    assignedUsers: eventUsers,
                }));
            } catch (err) {
                setError("Unable to fetch assigned users.");
            }
        };

        fetchEventDetails();
        fetchUsers();
        fetchEventUsers();
        fetchCustomers(eventId);
    }, [eventId]);

    const fetchCustomers = async (eventId) => {
        try {
            const availableCustomers = await getAvailableCustomersForEvent(eventId);
            setCustomers(availableCustomers);
        } catch (err) {
            setError("Unable to fetch available customers.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCustomerSelection = (customerId) => {
        setSelectedCustomers((prevSelected) =>
            prevSelected.includes(customerId)
                ? prevSelected.filter((id) => id !== customerId)
                : [...prevSelected, customerId]
        );
    };

    const handleAssignUserAndCustomer = async (userId) => {
        if (selectedCustomers.length === 0) {
            setError("Please select at least one customer.");
            return;
        }
        try {
            const assignments = await Promise.all(
                selectedCustomers.map((customerId) =>
                    assignUserAndCustomerToEvent(eventId, userId, customerId)
                )
            );

            setEvent((prevEvent) => ({
                ...prevEvent,
                assignedUsers: [...(prevEvent?.assignedUsers || []), ...assignments],
            }));

            setSuccessMessage("Assignment successful!");
            setError("");
            fetchCustomers(eventId);
            setSelectedCustomers([]);
            setTimeout(() => {
                setSuccessMessage("");
                setShowModal(false);
            }, 2000);
        } catch (err) {
            setError("Unable to assign user and customers to event.");
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setError("");
        setSelectedCustomers([]);
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(customerFilter.toLowerCase())
    );

    const filteredUsers = users.filter((user) =>
        user.fullName.toLowerCase().includes(userFilter.toLowerCase())
    );

    if (isLoading) return <div className="text-center my-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <div className="text-center">
                <h1 className="display-4">Thông Tin Về Sự Kiện</h1>
            </div>
            <div className="card shadow mt-4">
                <div className="card-body">
                    <h4 className="card-title">
                        Loại Sự Kiện: <span className="text-primary">{event.eventType?.eventTypeName}</span>
                    </h4>
                    <p className="card-text" style={{ fontWeight: "bold" }}>
                        Thời Gian Diễn Ra Sự Kiện -{" "}
                        <span>Vào Ngày:</span> {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                        <strong>Mô Tả Về Sự Kiện:</strong> {event.description}
                    </p>
                </div>
            </div>

            <div className="text-center mt-4">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={() => setShowModal(true)}
                >
                    Gán Người Phụ Trách và Khách Hàng
                </button>
            </div>

            {showModal && (
                <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Gán Người Phụ Trách và Khách Hàng</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {successMessage && (
                                    <div className="alert alert-success">{successMessage}</div>
                                )}
                                {error && <div className="alert alert-danger">{error}</div>}

                                <h5>Danh Sách Khách Hàng Chưa Tham Gia</h5>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Tìm kiếm khách hàng..."
                                    value={customerFilter}
                                    onChange={(e) => setCustomerFilter(e.target.value)}
                                />
                                <ul className="list-group mb-3">
                                    {filteredCustomers.length > 0 ? (
                                        filteredCustomers.map((customer) => (
                                            <li
                                                key={customer.customerId}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                            >
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input me-2"
                                                        checked={selectedCustomers.includes(customer.customerId)}
                                                        onChange={() => toggleCustomerSelection(customer.customerId)}
                                                    />
                                                    <strong>{customer.name}</strong> - {customer.email || "Không có email"}
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="list-group-item text-center text-muted">
                                            Không có khách hàng phù hợp.
                                        </li>
                                    )}
                                </ul>

                                <h5>Danh Sách Người Phụ Trách</h5>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Tìm kiếm người phụ trách..."
                                    value={userFilter}
                                    onChange={(e) => setUserFilter(e.target.value)}
                                />
                                <ul className="list-group">
                                    {filteredUsers.map((user) => (
                                        <li
                                            key={user.userId}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            {user.fullName} ({user.role})
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleAssignUserAndCustomer(user.userId)}
                                                disabled={selectedCustomers.length === 0}
                                            >
                                                Gán
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
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

export default EventDetails;
