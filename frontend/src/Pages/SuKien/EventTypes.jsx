import React, { useState, useEffect } from "react";
import { getAllEventTypes, createEventType, updateEventType, deleteEventType } from "../../services/eventServices";

function EventTypes() {
    const [eventTypes, setEventTypes] = useState([]); // Store event types
    const [error, setError] = useState(""); // Store error message
    const [successMessage, setSuccessMessage] = useState(""); // Store success message
    const [showCreateModal, setShowCreateModal] = useState(false); // Create modal visibility
    const [showEditModal, setShowEditModal] = useState(false); // Edit modal visibility
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Delete modal visibility
    const [selectedEventType, setSelectedEventType] = useState(null); // Event type for edit/delete
    const [newEventType, setNewEventType] = useState({ name: "" }); // Data for creating a new event type

    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const data = await getAllEventTypes();
                setEventTypes(data);
            } catch (err) {
                setError("Unable to fetch event types.");
            }
        };
        fetchEventTypes();
    }, []);

    // Validate function
    const validateEventTypeName = (name) => {
        if (!name.trim()) {
            setError("Event type name cannot be empty.");
            return false;
        }
        if (name.length < 3) {
            setError("Event type name must be at least 3 characters.");
            return false;
        }
        setError(""); // Clear any previous error
        return true;
    };

    // Handle Create Event Type
    const handleCreateEventType = async () => {
        if (!validateEventTypeName(newEventType.name)) return;

        try {
            const createdEvent = await createEventType({ eventTypeName: newEventType.name });
            setEventTypes([...eventTypes, createdEvent]);
            setShowCreateModal(false);
            setSuccessMessage("Event type created successfully.");
            setNewEventType({ name: "" });
        } catch (err) {
            setError("Failed to create event type.");
        }
    };

    // Handle Edit Event Type
    const handleEditEventType = (id) => {
        const eventTypeToEdit = eventTypes.find((type) => type.eventTypeId === id);
        setSelectedEventType(eventTypeToEdit);
        setShowEditModal(true);
    };

    const handleUpdateEventType = async () => {
        if (!validateEventTypeName(selectedEventType.eventTypeName)) return;

        try {
            const updatedEvent = await updateEventType(selectedEventType.eventTypeId, {
                eventTypeName: selectedEventType.eventTypeName,
            });
            setEventTypes(eventTypes.map((type) =>
                type.eventTypeId === updatedEvent.eventTypeId ? updatedEvent : type
            ));
            setShowEditModal(false);
            setSuccessMessage("Event type updated successfully.");
        } catch (err) {
            setError("Failed to update event type.");
        }
    };

    // Handle Delete Event Type
    const handleDeleteEventType = async () => {
        try {
            await deleteEventType(selectedEventType.eventTypeId);
            setEventTypes(eventTypes.filter((type) => type.eventTypeId !== selectedEventType.eventTypeId));
            setShowDeleteModal(false);
            setSuccessMessage("Event type deleted successfully.");
        } catch (err) {
            setError("Failed to delete event type.");
        }
    };

    // Display error or success messages
    const MessageAlert = ({ message, type }) => (
        message && <div className={`alert alert-${type} mt-3`}>{message}</div>
    );

    return (
        <div>
            <button className="btn btn-primary mb-3" onClick={() => setShowCreateModal(true)}>
                Tạo loại sự kiện
            </button>

            {error && <MessageAlert message={error} type="danger" />}
            {successMessage && <MessageAlert message={successMessage} type="success" />}

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Event Type Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventTypes.map((eventType) => (
                            <tr key={eventType.eventTypeId}>
                                <td>{eventType.eventTypeName}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEditEventType(eventType.eventTypeId)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => {
                                            setSelectedEventType(eventType);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                       Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <Modal
                    title="Tạo loại sự kiện"
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSave={handleCreateEventType}
                >
                    <InputField
                        label="Tên loại sự kiện"
                        value={newEventType.name}
                        onChange={(e) => setNewEventType({ name: e.target.value })}
                    />
                </Modal>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedEventType && (
                <Modal
                    title="Sửa loại sự kiện"
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleUpdateEventType}
                >
                    <InputField
                        label="Tên loại sự kiện"
                        value={selectedEventType.eventTypeName}
                        onChange={(e) =>
                            setSelectedEventType({ ...selectedEventType, eventTypeName: e.target.value })
                        }
                    />
                </Modal>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <Modal
                    title="Delete Event Type"
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onSave={handleDeleteEventType}
                >
                    Are you sure you want to delete this event type?
                </Modal>
            )}
        </div>
    );
}

// Reusable Modal Component
const Modal = ({ title, isOpen, onClose, onSave, children }) => (
    <div className={`modal fade ${isOpen ? "show" : ""}`} style={{ display: isOpen ? "block" : "none" }}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{title}</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <div className="modal-body">{children}</div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Hủy 
                    </button>
                    <button type="button" className="btn btn-primary" onClick={onSave}>
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// Reusable InputField Component
const InputField = ({ label, value, onChange }) => (
    <div className="mb-3">
        <label className="form-label">{label}</label>
        <input type="text" className="form-control" value={value} onChange={onChange} />
    </div>
);

export default EventTypes;
