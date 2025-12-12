import express from 'express';
import Profile from '../models/Profile';
import mongoose from 'mongoose';
import { protect, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

const offlineProfiles: any[] = []; // In-memory store

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
router.get('/', protect, async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        if (mongoose.connection.readyState !== 1) {
            const profile = offlineProfiles.find(p => p.user.toString() === req.user._id.toString());
            if (!profile) {
                // Create default offline profile
                const newProfile = {
                    user: req.user._id,
                    username: req.user.username,
                    bio: '',
                    avatarUrl: ''
                };
                offlineProfiles.push(newProfile);
                res.json(newProfile);
            } else {
                res.json(profile);
            }
            return;
        }

        let profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            profile = await Profile.create({
                user: req.user._id,
                username: req.user.username,
                email: req.user.email,
            });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
router.put('/', protect, async (req: AuthRequest, res) => {
    const { bio, avatarUrl } = req.body;

    try {
        if (!req.user) return res.status(401).json({ error: 'Not authorized' });

        if (mongoose.connection.readyState !== 1) {
            let profile = offlineProfiles.find(p => p.user.toString() === req.user._id.toString());
            if (profile) {
                profile.bio = bio;
                profile.avatarUrl = avatarUrl;
                res.json(profile);
            } else {
                res.status(404).json({ error: 'Profile not found (Offline)' });
            }
            return;
        }

        let profile = await Profile.findOne({ user: req.user._id });

        if (profile) {
            profile.bio = bio || profile.bio;
            profile.avatarUrl = avatarUrl || profile.avatarUrl;

            const updatedProfile = await profile.save();
            res.json(updatedProfile);
        } else {
            // Create if not found (should be handled by GET but just in case)
            profile = await Profile.create({
                user: req.user._id,
                bio: bio,
                avatarUrl: avatarUrl
            });
            res.json(profile);
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

export default router;
