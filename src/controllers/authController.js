const User = require('../models/User');
const generateToken = require('../config/generateToken');
const { getCurrentUtcTimestamp } = require('../config/timeUtils');
const argon2 = require('argon2');

// Temporary in-memory store (only used when MongoDB is down)
const memoryUsers = [];

// @desc    Register
exports.registerUser = async (req, res) => {
    try {
        const { employee_id, full_name, email, password, role, timezone } = req.body;

        if (!employee_id || !full_name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if MongoDB is connected
        if (require('../config/db').getDBStatus && require('../config/db').getDBStatus()) {
            // ===== REAL DATABASE MODE =====
            const exists = await User.findOne({ $or: [{ email }, { employee_id }] });
            if (exists) {
                return res.status(400).json({ success: false, message: 'User already exists with this Email or Employee ID' });
            }

            const user = await User.create({
                employee_id,
                full_name,
                email,
                password,
                role: role || 'LEARNER',
                timezone: timezone || 'Asia/Karachi'
            });

            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    _id: user._id,
                    employee_id: user.employee_id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role,
                    timezone: user.timezone,
                    token: generateToken(user._id, user.role)
                }
            });
        } else {
            // ===== DEMO / MEMORY MODE =====
            const exists = memoryUsers.find(u => u.email === email || u.employee_id === employee_id);
            if (exists) {
                return res.status(400).json({ success: false, message: 'User already exists' });
            }

            const hashed = await argon2.hash(password, { type: argon2.argon2id });
            const newUser = {
                _id: 'mem_' + Date.now(),
                employee_id,
                full_name,
                email,
                password: hashed,
                role: role || 'LEARNER',
                timezone: timezone || 'Asia/Karachi'
            };
            memoryUsers.push(newUser);

            return res.status(201).json({
                success: true,
                message: 'User registered (Demo Mode)',
                data: {
                    _id: newUser._id,
                    employee_id: newUser.employee_id,
                    full_name: newUser.full_name,
                    email: newUser.email,
                    role: newUser.role,
                    timezone: newUser.timezone,
                    token: generateToken(newUser._id, newUser.role)
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        if (require('../config/db').getDBStatus && require('../config/db').getDBStatus()) {
            // ===== REAL DATABASE MODE =====
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    _id: user._id,
                    employee_id: user.employee_id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role,
                    timezone: user.timezone,
                    token: generateToken(user._id, user.role)
                }
            });
        } else {
            // ===== DEMO / MEMORY MODE =====
            const user = memoryUsers.find(u => u.email === email);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            const isMatch = await argon2.verify(user.password, password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            return res.status(200).json({
                success: true,
                message: 'Login successful (Demo Mode)',
                data: {
                    _id: user._id,
                    employee_id: user.employee_id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role,
                    timezone: user.timezone,
                    token: generateToken(user._id, user.role)
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};