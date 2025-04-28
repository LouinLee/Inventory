// src/components/NewLayout.js

import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBars } from 'react-icons/fa';

const NewLayout = () => {
    const [sidebarVisible, setSidebarVisible] = useState(() => {
        return localStorage.getItem('sidebarVisible') === 'true';
    });
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        document.cookie = "token=; Max-Age=0";
        navigate("/login");
    };

    const toggleSidebar = () => {
        const newState = !sidebarVisible;
        setSidebarVisible(newState);
        localStorage.setItem('sidebarVisible', newState);
    };

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Products', path: '/products' },
        { name: 'Categories', path: '/categories' },
        { name: 'Warehouses', path: '/warehouses' },
        { name: 'Inbound', path: '/inbound' },
        { name: 'Outbound', path: '/outbound' },
    ];

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {/* Header */}
            <nav className="navbar navbar-light bg-white shadow-sm px-4 py-3">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    {/* Left Section: Sidebar toggle button */}
                    <div className="d-flex align-items-center gap-3">
                        <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center" onClick={toggleSidebar}>
                            <FaBars />
                        </button>
                    </div>

                    {/* Center the text by adjusting the flex container */}
                    <div className="d-flex justify-content-center flex-grow-1">
                        <h5 className="mb-0 fw-semibold">Inventory Management System</h5>
                    </div>

                    {/* Right Section: Logout button */}
                    <button className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>
            </nav>

            <div className="d-flex flex-grow-1">
                {/* Sidebar */}
                <div
                    className={`bg-white border-end shadow-sm pt-4 px-3 ${sidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}
                    style={{
                        width: sidebarVisible ? '220px' : '0',
                        minHeight: '100%',
                        transition: 'width 0.3s ease-in-out, opacity 0.3s ease-in-out',
                        opacity: sidebarVisible ? 1 : 0,
                        pointerEvents: sidebarVisible ? 'auto' : 'none',
                    }}
                >
                    <ul className="nav nav-pills flex-column gap-2">
                        {menuItems.map((item) => (
                            <li className="nav-item" key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`nav-link rounded ${location.pathname === item.path
                                        ? 'active bg-primary text-white'
                                        : 'text-dark'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content */}
                <main
                    className="flex-grow-1 p-4"
                    style={{
                        backgroundColor: '#f8f9fa',
                        marginLeft: sidebarVisible ? '30px' : '0',
                        transition: 'margin-left 0.3s ease-in-out',
                    }}
                >
                    <div className="container-fluid">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default NewLayout;
