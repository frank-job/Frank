const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [2, 'Description must be at least 2 characters'],
    },
    date: {
        type: String,
        required: [true, 'Date is required'],
        match: [
            /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
            'Date must be in DD/MM/YYYY format (e.g., 24/09/2026)'
        ],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        minlength: [2, 'Location must be at least 2 characters'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        minlength: [2, 'Category must be at least 2 characters'],
    },
    organizer: {
        type: String,
        required: [true, 'Organizer is required'],
        trim: true,
        minlength: [2, 'Organizer must be at least 2 characters'],
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: [1, 'Capacity must be at least 1'],
    },
    isPublic: {
        type: Boolean,
        required: [true, 'IsPublic is required'],
    },
    ticketPrice: {
        type: Number,
        required: [true, 'TicketPrice is required'],
        min: [0, 'TicketPrice must be 0 or greater'],
    },
}, {
    timestamps: true,
    strict: true,
});

module.exports = mongoose.model('Event', eventSchema, 'events');
