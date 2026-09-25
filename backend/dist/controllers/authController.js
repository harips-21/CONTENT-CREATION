"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("../prisma/client");
const JWT_SECRET = process.env.JWT_SECRET || 'ai-content-studio-super-secret-jwt-key-2026';
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: 'Name, email, and password are required.' });
            return;
        }
        // Check existing user
        const existingUser = await client_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User with this email already exists.' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await client_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            message: 'Registration successful.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error during registration.' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required.' });
            return;
        }
        const user = await client_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error during login.' });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized.' });
            return;
        }
        const user = await client_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, createdAt: true },
        });
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching profile.' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name, password } = req.body;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized.' });
            return;
        }
        const updateData = {};
        if (name)
            updateData.name = name;
        if (password) {
            updateData.password = await bcryptjs_1.default.hash(password, 10);
        }
        const updatedUser = await client_1.prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, name: true, email: true, createdAt: true },
        });
        res.json({ message: 'Profile updated successfully.', user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating profile.' });
    }
};
exports.updateProfile = updateProfile;
