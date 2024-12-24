import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Slidebar from "../Components/Slidebar/Slidebar";

const HomeLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };

    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                {/* Sidebar */}
                <div
                    className={`sidebar-wrapper ${isSidebarCollapsed ? "col-auto" : "col-md-3 col-lg-2"} bg-dark text-white p-0`}
                >
                    <Slidebar isCollapsed={isSidebarCollapsed} />
                </div>

                {/* Main content area */}
                <div
                    className={`main-content-wrapper ${isSidebarCollapsed ? "col" : "col-md-9 col-lg-10"} p-0 d-flex flex-column`}
                >
                    <Header toggleSidebar={toggleSidebar} />

                    {/* Scrollable content */}
                    <main className="content flex-grow-1 p-4 bg-light overflow-auto">
                        <Outlet />
                    </main>

                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default HomeLayout;
