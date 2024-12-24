import React from "react";
import { NavLink } from "react-router-dom";
import { PATHS } from "../../constant/pathnames";

function Slidebar({ isCollapsed }) {
    // Lấy thông tin người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // Danh sách menu kèm điều kiện theo role
    const menuItems = [
        {
            path: PATHS.USER,
            icon: "bi-person",
            label: "Quản lý người dùng",
            roles: ["Admin"], // Chỉ Admin có quyền
        },
        {
            path: PATHS.CUSTOMER,
            icon: "bi bi-people",
            label: "Quản lý khách hàng",
            roles: ["Admin", "Manager", "Staff"], // Ai cũng có quyền
        },
        {
            path: PATHS.PROJECT,
            icon: "bi-bar-chart",
            label: "Quản lý dự án",
            roles: ["Admin", "Manager", "Staff"], // Ai cũng có quyền
        },
        {
            path: PATHS.EVENT,
            icon: "bi-calendar-event",
            label: "Quản lý sự kiện",
            roles: ["Admin", "Manager", "Staff"], // Ai cũng có quyền
        },
        {
            path: PATHS.REMAIND,
            icon: "bi-bell",
            label: "Thông Báo nhắc nhở",
            roles: ["Admin", "Manager", "Staff"], // Ai cũng có quyền
        },
        {
            path: PATHS.PAYMENT,
            icon: "bi-credit-card",
            label: "Quản lý thanh toán",
            roles: ["Admin", "Manager", "Staff"], // Ai cũng có quyền
        },
    ];

    return (
        <nav className={`bg-dark text-white p-3 vh-100 d-flex flex-column ${isCollapsed ? "collapsed-sidebar" : ""}`}>
            <h5 className={`text-white mb-4 ${isCollapsed ? "d-none" : ""}`}>Trang Admin</h5>
            <ul className="nav flex-column">
                {menuItems
                    .filter((item) => item.roles.includes(user?.role)) // Lọc theo vai trò người dùng
                    .map((item, index) => (
                        <li className="nav-item mb-2" key={index}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `nav-link text-white ${isActive ? "active" : ""}`
                                }
                            >
                                <i className={`bi ${item.icon} me-2`}></i>
                                {!isCollapsed && item.label}
                            </NavLink>
                        </li>
                    ))}
            </ul>
        </nav>
    );
}

export default Slidebar;
