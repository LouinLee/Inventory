// src/services/AuthService.js
const API_URL = "http://localhost:5000/api/auth"; // change port if needed

const register = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for sending cookies
        body: JSON.stringify(userData),
    });
    return response.json();
};

const login = async (userData) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
    });
    return response.json();
};

export default { register, login };
