import mongoose, { Schema, Model } from 'mongoose';

const ProfileSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    bio: String,
    avatarUrl: String,
    // We can keep specific profile settings here
    theme: { type: String, default: 'light' },
    createdAt: { type: Date, default: Date.now }
});

const Profile: Model<any> = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

export default Profile;
