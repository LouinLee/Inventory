// controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/auth");

// Show register page
exports.registerForm = (req, res) => {
    res.render("register");
};

// Handle user registration
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.render("register", { error: "Username already taken" });

        // Create and save new user
        const user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: "Register successful!" }); //For Postman

        // res.redirect("/login");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Show login page
exports.loginForm = (req, res) => {
    res.render("login");
};

// Handle user login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) return res.render("login", { error: "User not found" });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.render("login", { error: "Invalid credentials" });

        // Generate JWT token & store in cookie
        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: false, // ⚠️ allow client-side access
            sameSite: "Lax", // or "None" if using cross-site (and set secure: true)
            maxAge: 3600000
        });

        res.status(201).json({ token }); //For Postman token

        // res.redirect("/home");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Create and save new user
        const user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: "Register successful!" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
};

// Handle user logout
exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
};
