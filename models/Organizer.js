const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Email must be a valid email address'
        ],
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        trim: true,
        match: [
            /^\+?[\d\s-]{7,15}$/,
            'Phone must be a valid phone number'
        ],
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        trim: true,
        enum: {
            values: ['Coordinator', 'Volunteer', 'Manager', 'Teacher'],
            message: 'Role must be Coordinator, Volunteer, Manager, or Teacher',
        },
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        minlength: [2, 'Department must be at least 2 characters'],
    },
    office: {
        type: String,
        required: [true, 'Office is required'],
        trim: true,
        minlength: [2, 'Office must be at least 2 characters'],
    },
    experience: {
        type: Number,
        required: [true, 'Experience is required'],
        min: [0, 'Experience must be 0 or greater'],
        max: [50, 'Experience must be 50 or less'],
    },
    bio: {
        type: String,
        required: [true, 'Bio is required'],
        trim: true,
        minlength: [10, 'Bio must be at least 10 characters'],
    },
    isActive: {
        type: Boolean,
        required: [true, 'IsActive is required'],
        default: true,
    },
}, {
    timestamps: true,
    strict: true,
});

module.exports = mongoose.model('Organizer', organizerSchema, 'organizer');
