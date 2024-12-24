import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService"; // Gọi API từ authService
import { PATHS } from "../../constant/pathnames"; // Đường dẫn

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState(""); // Lưu username trong state
    const [password, setPassword] = useState(""); // Lưu password trong state
    const [error, setError] = useState(""); // Lưu lỗi nếu có
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi chờ API

    // Xử lý khi submit form
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Gửi thông tin đăng nhập tới API
            const response = await login(username, password);

            // Debug: Hiển thị phản hồi từ API
            console.log("Login Response:", response);

            // Kiểm tra role từ API
            if (!response.role) {
                throw new Error("Role not provided by the server.");
            }

            // Lưu thông tin người dùng vào localStorage
            const userData = {
                username: response.username,
                userId: response.userId,
                role: response.role,
            };
            localStorage.setItem("user", JSON.stringify(userData));

            // Cập nhật trạng thái người dùng ở App.js (qua prop onLogin)
            onLogin(userData);

            // Điều hướng về trang HOME
            navigate(PATHS.HOME);
        } catch (err) {
            // Nếu lỗi, hiển thị thông báo
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Invalid username or password.");
        } finally {
            // Tắt trạng thái loading
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow-sm p-4" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Login</h2>
                {/* Hiển thị lỗi nếu có */}
                {error && <div className="alert alert-danger text-center">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
