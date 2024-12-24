import React, { useState, useEffect } from "react";

// Import thành phần NotificationList
import Remaind from "./Remaind";
import NotificationList from "./NotificationList";

function NotificationDashboard() {
    const [user, setUser] = useState(null); // Lưu thông tin người dùng
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (!user) {
        return <div className="text-center text-danger">Người dùng chưa đăng nhập!</div>;
    }

    return (
        <div className="container mt-4">
            {user.role === "Admin" ? (
                <Remaind />
            ) : (
                <NotificationList />
            )}
        </div>
    );
}

export default NotificationDashboard;
