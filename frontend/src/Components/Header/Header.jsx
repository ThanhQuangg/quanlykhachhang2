import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ toggleSidebar }) {
    const [username, setUsername] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Quản lý trạng thái dropdown
    const navigate = useNavigate(); // Điều hướng

    // Lấy dữ liệu từ localStorage khi component được render
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.username) {
            setUsername(user.username); // Cập nhật username từ localStorage
        }
    }, []);

    // Hàm đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("user"); // Xóa dữ liệu người dùng khỏi localStorage
        setUsername(""); // Xóa username khỏi state
        navigate("/login"); // Điều hướng về trang đăng nhập
    };

    // Hàm xem thông tin cá nhân
    const handleViewProfile = () => {
        navigate("/profile"); // Điều hướng đến trang thông tin cá nhân
    };

    return (
        <header className="bg-white shadow-sm p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    {/* Sidebar Toggle Button */}
                    <button className="btn btn-outline-primary me-3" onClick={toggleSidebar}>
                        <i className="bi bi-list"></i>
                    </button>
                    <h5 className="text-primary m-0">Dashboard</h5>
                </div>
                <div className="d-flex align-items-center">
                    {/* Notification Icon */}
                    <div className="me-3 position-relative">
                        <i className="bi bi-bell-fill text-primary fs-4"></i>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            3
                        </span>
                    </div>
                    {/* User Dropdown */}
                    <div className="dropdown">
                        <div
                            className="d-flex align-items-center cursor-pointer"
                            onClick={() => setIsDropdownOpen((prev) => !prev)} // Toggle dropdown
                        >
                            <img
                                src="https://via.placeholder.com/40"
                                alt="Profile"
                                className="rounded-circle me-2"
                            />
                            <span className="text-dark fw-bold">{username || "Guest"}</span>
                            <i className="bi bi-caret-down-fill ms-2"></i>
                        </div>
                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div
                                className="dropdown-menu dropdown-menu-end show mt-2 shadow"
                                style={{ position: "absolute", right: "0", zIndex: "1050" }}
                            >
                                <button
                                    className="dropdown-item"
                                    onClick={handleViewProfile}
                                >
                                    View Profile
                                </button>
                                <button
                                    className="dropdown-item text-danger fw-bold"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
