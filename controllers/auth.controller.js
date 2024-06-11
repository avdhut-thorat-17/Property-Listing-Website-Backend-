import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();

const saltRounds = 10;

export const register = [
    body('username').trim().isLength({ min: 3 }).escape(),
    body('password').isLength({ min: 6 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('phone').trim().isLength({ min: 10 }).escape(),
    body('role').trim().isIn(['Student', 'Property Owner']).escape(), // Add validation for role

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, email, phone, role } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = new User({
                username,
                password: hashedPassword,
                email,
                phone,
                role, // Include role in the user creation
            });

            await user.save();
            res.status(201).send('User Registered Successfully!');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error registering user');
        }
    }
];

export const login = [
    body('username').trim().isLength({ min: 3 }).escape(),
    body('password').isLength({ min: 6 }).escape(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).send('Authentication failed: User not found');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const age = 1000 * 60 * 60 * 24 * 7; // 1 week

                const token = jwt.sign(
                    { id: user.id },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '7d' }
                );

                // Extract only the necessary information
                const { id, username, avatar, email } = user;

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                    maxAge: age,
                }).status(200).json({ id, username, avatar, email });
            } else {
                res.status(401).send('Authentication failed: Incorrect password');
            }
        } catch (err) {
            console.error('Error during login:', err);
            res.status(500).send('Server error');
        }
    }
];

export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    }).status(200).send('User logged out successfully');
};
