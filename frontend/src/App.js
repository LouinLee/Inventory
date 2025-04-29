import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Warehouses from "./pages/Warehouses";
import Inbound from "./pages/Inbound";
import Outbound from "./pages/Outbound";

import PrivateRoute from "./components/PrivateRoute";
import NewLayout from "./components/NewLayout";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <Router>
            {/* Add ToastContainer to render toast notifications */}
            <ToastContainer />
            <Routes>
                {/* Redirect root path to /dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Public Routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Route with Layout */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <NewLayout />
                        </PrivateRoute>
                    }
                >
                    {/* This is where the child route for Dashboard should be rendered */}
                    <Route index element={<Dashboard />} /> {/* Ensure index route */}
                </Route>

                {/* Product List Route inside Layout */}
                <Route
                    path="/products"
                    element={
                        <PrivateRoute>
                            <NewLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Products />} />
                </Route>

                <Route
                    path="/categories"
                    element={
                        <PrivateRoute>
                            <NewLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Categories />} />
                </Route>

                <Route
                    path="/warehouses"
                    element={
                        <PrivateRoute>
                            <NewLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Warehouses />} />
                </Route>

                <Route
                    path="/inbound"
                    element={
                        <PrivateRoute>
                            <NewLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Inbound />} />
                </Route>

                <Route
                    path="/outbound"
                    element={
                        <PrivateRoute>
                            <NewLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Outbound />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
