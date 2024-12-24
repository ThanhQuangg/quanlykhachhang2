import React, { useState, useEffect } from "react";
import {
    getAllProjectTypes,
    createProjectType,
    updateProjectType,
    deleteProjectType,
} from "../../services/projectServices";
import { PATHS } from "../../constant/pathnames";
import { NavLink } from "react-router-dom";

function ProjectType() {
    const [projectTypes, setProjectTypes] = useState([]); // Danh sách loại dự án
    const [error, setError] = useState(""); // Lỗi
    const [selectedType, setSelectedType] = useState(null); // Loại dự án được chọn để sửa
    const [showAddEditModal, setShowAddEditModal] = useState(false); // Hiển thị modal thêm/sửa
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Hiển thị modal xóa
    const [newTypeName, setNewTypeName] = useState(""); // Giá trị tên loại dự án mới

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const projectTypesPerPage = 5; // Number of project types per page

    // Fetch the list of project types
    useEffect(() => {
        const fetchProjectTypes = async () => {
            try {
                const data = await getAllProjectTypes();
                setProjectTypes(data);
            } catch (err) {
                console.error("Error fetching project types:", err);
                setError("Không thể tải danh sách loại dự án.");
            }
        };

        fetchProjectTypes();
    }, []);

    // Handle pagination logic
    const indexOfLastProjectType = currentPage * projectTypesPerPage;
    const indexOfFirstProjectType = indexOfLastProjectType - projectTypesPerPage;
    const currentProjectTypes = projectTypes.slice(indexOfFirstProjectType, indexOfLastProjectType);

    const totalPages = Math.ceil(projectTypes.length / projectTypesPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    // Open add/edit modal
    const handleShowAddEditModal = (type = null) => {
        setSelectedType(type); // If edit, set selected project type
        setNewTypeName(type ? type.typeName : ""); // If edit, fill the input with the name
        setShowAddEditModal(true);
    };

    // Close add/edit modal
    const handleCloseAddEditModal = () => {
        setShowAddEditModal(false);
        setSelectedType(null);
        setNewTypeName("");
    };

    // Save project type (add or update)
    const handleSaveType = async () => {
        try {
            if (selectedType) {
                // Update project type
                await updateProjectType(selectedType.projectTypeId, { typeName: newTypeName });
                setProjectTypes((prev) =>
                    prev.map((type) =>
                        type.projectTypeId === selectedType.projectTypeId
                            ? { ...type, typeName: newTypeName }
                            : type
                    )
                );
            } else {
                // Add new project type
                const newType = await createProjectType({ typeName: newTypeName });
                setProjectTypes((prev) => [...prev, newType]);
            }
            handleCloseAddEditModal();
        } catch (err) {
            console.error("Error saving project type:", err);
            setError("Không thể lưu loại dự án.");
        }
    };

    // Confirm delete
    const handleDeleteType = async () => {
        try {
            await deleteProjectType(selectedType.projectTypeId);
            setProjectTypes((prev) =>
                prev.filter((type) => type.projectTypeId !== selectedType.projectTypeId)
            );
            setShowDeleteModal(false);
        } catch (err) {
            console.error("Error deleting project type:", err);
            setError("Không thể xóa loại dự án.");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Danh sách loại dự án</h1>

            {/* Error Message */}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="gap-2 mb-3">
                <NavLink to={`${PATHS.PROJECT}`} className="btn btn-primary flex-grow-1">
                    Quay Về Trang Quản Lý Dự Án
                </NavLink>
                <button style={{marginLeft:"50px", paddingTop:"8px",paddingBottom:"8px"}}
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleShowAddEditModal()}
                >
                    Thêm loại dự án
                </button>
            </div>


            {/* Project Types Table */}
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Tên loại dự án</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProjectTypes.length > 0 ? (
                            currentProjectTypes.map((type) => (
                                <tr key={type.projectTypeId}>
                                    <td>{type.projectTypeId}</td>
                                    <td>{type.typeName}</td>
                                    <td>

                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleShowAddEditModal(type)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => {
                                                setSelectedType(type);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    Không có loại dự án nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {/* Add/Edit Modal */}
            {showAddEditModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectedType ? "Sửa Loại Dự Án" : "Thêm Loại Dự Án"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseAddEditModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tên loại dự án"
                                        value={newTypeName}
                                        onChange={(e) => setNewTypeName(e.target.value)}
                                    />
                                    <label htmlFor="newTypeName">Tên loại dự án</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleCloseAddEditModal}>
                                    Hủy
                                </button>
                                <button className="btn btn-primary" onClick={handleSaveType}>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xóa Loại Dự Án</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDeleteModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    Bạn có chắc chắn muốn xóa loại dự án{" "}
                                    <strong>{selectedType?.typeName}</strong>?
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                                    Hủy
                                </button>
                                <button className="btn btn-danger" onClick={handleDeleteType}>
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

export default ProjectType;
