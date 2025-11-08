import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaChartBar, FaCalendarAlt, FaCut, FaImages, FaCog } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="d-flex flex-column bg-dark text-light vh-100 p-3" style={{ width: "400px" }}>
      <h4 className="text-center mb-4">Admin</h4>
      <Nav className="flex-column">
        <Nav.Item><Link className="nav-link text-light" to="/admin/dashboard"> <FaChartBar /> Dashboard</Link></Nav.Item>
        <Nav.Item><Link className="nav-link text-light" to="/appointments"> <FaCalendarAlt /> Appointments</Link></Nav.Item>
        <Nav.Item><Link className="nav-link text-light" to="/services"> <FaCut /> Services</Link></Nav.Item>
        <Nav.Item><Link className="nav-link text-light" to="/gallery"> <FaImages /> Gallery</Link></Nav.Item>
        <Nav.Item><Link className="nav-link text-light" to="/settings"> <FaCog /> Settings</Link></Nav.Item>
        <Nav.Item><Link className="nav-link text-light" to="/admin/login"> <FaCog /> Login</Link></Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;
