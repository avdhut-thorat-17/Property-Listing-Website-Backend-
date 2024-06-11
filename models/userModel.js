import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Student', 'Property Owner'],
        default: 'Student'
    },
    avatar: {
        type: String, // URL or file path to the avatar image
        default: ''   // Default value can be an empty string or a default image URL
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
