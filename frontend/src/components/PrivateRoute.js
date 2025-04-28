// src/components/PrivateRoute.js

import React from "react";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const PrivateRoute = ({ children }) => {
    const [cookies] = useCookies(["token"]);

    // Optional: log to see what's inside
    console.log("Token from cookie:", cookies.token);

    return cookies.token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
