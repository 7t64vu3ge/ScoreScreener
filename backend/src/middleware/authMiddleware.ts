import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
    user?: any;
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            if (mongoose.connection.readyState !== 1) {
                // Offline Mode: Verify token but mock user retrieval
                const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
                req.user = {
                    _id: decoded.id,
                    username: decoded.username || 'OfflineUser',
                    email: 'offline@test.com'
                };
                return next();
            }

            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};

export { protect, AuthRequest };
