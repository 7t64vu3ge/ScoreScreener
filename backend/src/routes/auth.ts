import express from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const offlineUsers: any[] = []; // In-memory store for offline mode

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (mongoose.connection.readyState !== 1) {
            // Offline Mode: Use in-memory store
            const userExists = offlineUsers.find(u => u.email === email);
            if (userExists) {
                res.status(400).json({ error: 'User already exists (Offline)' });
                return;
            }

            const newUser = {
                _id: 'offline_' + Date.now(),
                username,
                email,
                password, // Storing plain text for mock offline is redundant but we'll mock hash check
                matchPassword: async function (entered: string) { return entered === this.password }
            };
            offlineUsers.push(newUser);

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                token: generateToken(newUser._id), // We can include username in token for middleware if we want
                bio: ''
            });
            return;
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
                bio: '' // Initial bio
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (mongoose.connection.readyState !== 1) {
            // Offline Mode
            const user = offlineUsers.find(u => u.email === email);
            if (user && user.password === password) { // Simple check for offline
                res.json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    token: generateToken(user._id),
                });
                return;
            } else {
                res.status(401).json({ error: 'Invalid email or password (Offline)' });
                return;
            }
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
                // We'll fetch full profile separate or include minimal info here
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

export default router;
