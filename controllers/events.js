const Event = require('../models/Event');

const validateEventBody = (body) => {
    const errors = [];

    if (!body || typeof body !== 'object') {
        return ['Request body must be a valid JSON object'];
    }

    if (body.title === undefined || body.title === null || body.title === '') {
        errors.push('Title is required');
    } else if (typeof body.title !== 'string') {
        errors.push('Title must be a string');
    } else if (body.title.trim().length < 2) {
        errors.push('Title must be at least 2 characters');
    }

    if (body.description === undefined || body.description === null || body.description === '') {
        errors.push('Description is required');
    } else if (typeof body.description !== 'string') {
        errors.push('Description must be a string');
    } else if (body.description.trim().length < 2) {
        errors.push('Description must be at least 2 characters');
    }

    if (body.date === undefined || body.date === null || body.date === '') {
        errors.push('Date is required');
    } else if (typeof body.date !== 'string') {
        errors.push('Date must be a string in DD/MM/YYYY format');
    } else if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(body.date)) {
        errors.push('Date must be in DD/MM/YYYY format (e.g., 24/09/2026)');
    }

    if (body.location === undefined || body.location === null || body.location === '') {
        errors.push('Location is required');
    } else if (typeof body.location !== 'string') {
        errors.push('Location must be a string');
    } else if (body.location.trim().length < 2) {
        errors.push('Location must be at least 2 characters');
    }

    for (const field of ['category', 'organizer']) {
        if (body[field] === undefined || body[field] === null || body[field] === '') {
            errors.push(`${field[0].toUpperCase()}${field.slice(1)} is required`);
        } else if (typeof body[field] !== 'string') {
            errors.push(`${field[0].toUpperCase()}${field.slice(1)} must be a string`);
        } else if (body[field].trim().length < 2) {
            errors.push(`${field[0].toUpperCase()}${field.slice(1)} must be at least 2 characters`);
        }
    }

    if (body.capacity === undefined || body.capacity === null) {
        errors.push('Capacity is required');
    } else if (!Number.isInteger(body.capacity) || body.capacity < 1) {
        errors.push('Capacity must be a whole number greater than 0');
    }

    if (typeof body.isPublic !== 'boolean') {
        errors.push('IsPublic must be a boolean');
    }

    if (body.ticketPrice === undefined || body.ticketPrice === null) {
        errors.push('TicketPrice is required');
    } else if (typeof body.ticketPrice !== 'number' || body.ticketPrice < 0) {
        errors.push('TicketPrice must be a number greater than or equal to 0');
    }

    return errors;
};

const getErrorMessage = (error, fallback) => {
    if (error.name === 'ValidationError') {
        return Object.values(error.errors).map((item) => item.message);
    }
    return fallback;
};

const getAll = async (req, res) => {
    try {
        const events = await Event.find().lean();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: getErrorMessage(error, 'Unable to retrieve events') });
    }
};

const getSingle = async (req, res) => {
    try {
        if (!req.params.id || !/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const event = await Event.findById(req.params.id).lean();

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: getErrorMessage(error, 'Unable to retrieve event') });
    }
};

const createEvents = async (req, res) => {
    try {
        const errors = validateEventBody(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: errors[0] });
        }

        const event = new Event({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            location: req.body.location,
            category: req.body.category,
            organizer: req.body.organizer,
            capacity: req.body.capacity,
            isPublic: req.body.isPublic,
            ticketPrice: req.body.ticketPrice,
        });

        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(error.name === 'ValidationError' ? 400 : 500).json({
            error: getErrorMessage(error, 'Unable to create event'),
        });
    }
};

const updateEvents = async (req, res) => {
    try {
        if (!req.params.id || !/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const errors = validateEventBody(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: errors[0] });
        }

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                date: req.body.date,
                location: req.body.location,
                category: req.body.category,
                organizer: req.body.organizer,
                capacity: req.body.capacity,
                isPublic: req.body.isPublic,
                ticketPrice: req.body.ticketPrice,
            },
            { new: true, runValidators: true }
        ).lean();

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(error.name === 'ValidationError' ? 400 : 500).json({
            error: getErrorMessage(error, 'Unable to update event'),
        });
    }
};

const deleteEvents = async (req, res) => {
    try {
        if (!req.params.id || !/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: getErrorMessage(error, 'Unable to delete event') });
    }
};

module.exports = {
    getAll,
    getSingle,
    createEvents,
    updateEvents,
    deleteEvents,
};
