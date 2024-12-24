import React, { useEffect, useState } from "react";

function Home() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState("Guest");

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
            setUser(userData);
            setRole(userData.role || "Guest"); // Nếu không có role, mặc định là Guest
        }
    }, []);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                    <div className="p-5 bg-white shadow rounded">
                        {/* Tiêu đề lớn với màu sắc */}
                        <h1 className="display-3 text-primary fw-bold mb-4">
                            Xin chào, {user?.username || "Admin"}!
                        </h1>
                        {/* Vai trò của người dùng */}
                        <p className="fs-4 text-secondary">
                            Chào mừng bạn đến với hệ thống quản lý khách hàng Với vai trò là: <strong className="text-success">{role}</strong>
                        </p>
                        {/* Lời chào mừng */}
                        <p className="text-muted fs-5">

                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
