import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../public/css/style.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "./constant/pathnames";
import User from "./Pages/User/User";
import Customer from "./Pages/Customer/Customer";
import Project from "./Pages/Project/Project";
import Remaind from "./Pages/Remaind/Remaind";
import Payment from "./Pages/Payment/Payment";
import HomeLayout from "./layout/HomeLayout";
import Login from "./Pages/Login/Login";
import AddUser from "./Pages/User/AddUser";
import EditUser from "./Pages/User/EditUser";
import Home from "./Pages/Home";
import AddCustomer from "./Pages/Customer/AddCustomer";
import EditCustomer from "./Pages/Customer/EditCustomer";
import ProjectType from "./Pages/Project/ProjectType";
import EditProject from "./Pages/Project/EditProject";
import AddProject from "./Pages/Project/AddProject";
import AddPayment from "./Pages/Payment/AddPayment";
import PaymentList from "./Pages/Payment/PaymentList";
import SuKien from "./Pages/SuKien/SuKien";
import EventDetails from "./Pages/SuKien/EventDetails";
import NotificationDashboard from "./Pages/Remaind/NotificationDashboard";
import EventTypes from "./Pages/SuKien/EventTypes";
// Helper function to check if the user has the required role
function ProtectedRoute({ children, requiredRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !requiredRoles.includes(user.role)) {
    return <Navigate to={PATHS.HOME} replace />; // Redirect if no role or insufficient role
  }
  return children;  // Render the children if role matches
}
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path={PATHS.LOGIN}
          element={<Login onLogin={handleLogin} />}
        />

        {/* Admin Routes (Protected) */}
        <Route
          path={PATHS.HOME}
          element={
            isLoggedIn ? (
              <HomeLayout onLogout={handleLogout} />
            ) : (
              <Navigate to={PATHS.LOGIN} replace />
            )
          }
        >
          <Route index element={<Home />} />
          {/* ----------------USER------------------------- */}
          <Route path={PATHS.USER} element={<ProtectedRoute requiredRoles={["Admin"]}> <User /></ProtectedRoute>} />
          <Route path={PATHS.ADD_USER} element={<ProtectedRoute requiredRoles={["Admin"]}><AddUser /></ProtectedRoute>} />
          <Route path={`${PATHS.EDIT_USER}/:id`} element={<ProtectedRoute requiredRoles={["Admin"]}><EditUser /> </ProtectedRoute>} />

          {/* ----------------CUSTOMER------------------------- */}
          <Route path={PATHS.CUSTOMER} element={<Customer />} />
          <Route path={PATHS.ADD_CUSTOMER} element={<AddCustomer />} />
          <Route path={`${PATHS.EDIT_CUSTOMER}/:id`} element={<EditCustomer />} />

          {/* ----------------PROJECT------------------------- */}
          <Route path={PATHS.PROJECT} element={<Project />} />
          <Route path={PATHS.ADD_PROJECT} element={<AddProject />} />
          <Route path={`${PATHS.EDIT_PROJECT}/:id`} element={<EditProject />} />


          {/* ----------------PROJECT-TYPES--------------------- */}
          <Route path={PATHS.PROJECT_TYPES} element={<ProjectType />} />


          {/* ----------------PAYMENT-------------------- */}
          <Route path={PATHS.PAYMENT} element={<Payment />} />
          <Route path={PATHS.ADD_PAYMENT} element={<AddPayment />} />
          <Route path={PATHS.PAYMENT_LIST} element={<PaymentList />} />
          {/* <Route path={`${PATHS.EDIT_PROJECT}/:id`} element={<EditProject />} /> */}


          {/* ----------------SUKIEN-------------------- */}
          <Route path={PATHS.EVENT} element={<SuKien />} />
          <Route path="/EventDetails/:eventId" element={<EventDetails />} />
          <Route path={PATHS.EVENT_TYPES} element={<EventTypes />} />



          {/* ----------------THÔNG BÁO-------------------- */}
          {/* <Route path={PATHS.REMAIND} element={<Remaind />} /> */}
          <Route path={PATHS.REMAIND} element={<NotificationDashboard />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;

