const Organizer = require('../models/Organizer');

const validateOrganizerBody = (body) => {
    const errors = [];

    if (!body || typeof body !== 'object') {
        return ['Request body must be a valid JSON object'];
    }

    if (body.name === undefined || body.name === null || body.name === '') {
        errors.push('Name is required');
    } else if (typeof body.name !== 'string') {
        errors.push('Name must be a string');
    } else if (body.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }

    if (body.email === undefined || body.email === null || body.email === '') {
        errors.push('Email is required');
    } else if (typeof body.email !== 'string') {
        errors.push('Email must be a string');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        errors.push('Email must be a valid email address');
    }

    if (body.phone === undefined || body.phone === null || body.phone === '') {
        errors.push('Phone is required');
    } else if (typeof body.phone !== 'string') {
        errors.push('Phone must be a string');
    } else if (!/^\+?[\d\s-]{7,15}$/.test(body.phone)) {
        errors.push('Phone must be a valid phone number');
    }

    if (body.role === undefined || body.role === null || body.role === '') {
        errors.push('Role is required');
    } else if (typeof body.role !== 'string') {
        errors.push('Role must be a string');
    } else if (!['Coordinator', 'Volunteer', 'Manager', 'Teacher'].includes(body.role)) {
        errors.push('Role must be Coordinator, Volunteer, Manager, or Teacher');
    }

    for (const field of ['department', 'office']) {
        if (body[field] === undefined || body[field] === null || body[field] === '') {
            errors.push(`${field[0].toUpperCase()}${field.slice(1)} is required`);
        } else if (typeof body[field] !== 'string') {
            errors.push(`${field[0].toUpperCase()}${field.slice(1)} must be a string`);
        } else if (body[field].trim().length < 2) {
            errors.push(`${field[0].toUpperCase()}${field.slice(1)} must be at least 2 characters`);
        }
    }

    if (body.experience === undefined || body.experience === null) {
        errors.push('Experience is required');
    } else if (typeof body.experience !== 'number' || body.experience < 0 || body.experience > 50) {
        errors.push('Experience must be a number from 0 to 50');
    }

    if (body.bio === undefined || body.bio === null || body.bio === '') {
        errors.push('Bio is required');
    } else if (typeof body.bio !== 'string' || body.bio.trim().length < 10) {
        errors.push('Bio must be a string of at least 10 characters');
    }

    if (typeof body.isActive !== 'boolean') {
        errors.push('IsActive must be a boolean');
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
        const organizers = await Organizer.find().lean();
        res.status(200).json(organizers);
    } catch (error) {
        res.status(500).json({ error: getErrorMessage(error, 'Unable to retrieve organizers') });
    }
};

const getSingle = async (req, res) => {
    try {
        if (!req.params.id || !/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const organizer = await Organizer.findById(req.params.id).lean();

        if (!organizer) {
            return res.status(404).json({ error: 'Organizer not found' });
        }

        res.status(200).json(organizer);
    } catch (error) {
        res.status(500).json({ error: getErrorMessage(error, 'Unable to retrieve organizer') });
    }
};

const createOrganizers = async (req, res) => {
    try {
        const errors = validateOrganizerBody(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: errors[0] });
        }

        const organizer = new Organizer({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            role: req.body.role,
            department: req.body.department,
            office: req.body.office,
            experience: req.body.experience,
            bio: req.body.bio,
            isActive: req.body.isActive,
        });

        const savedOrganizer = await organizer.save();
        res.status(201).json(savedOrganizer);
    } catch (error) {
        res.status(error.name === 'ValidationError' ? 400 : 500).json({
            error: getErrorMessage(error, 'Unable to create organizer'),
        });
    }
};

const updateOrganizers = async (req, res) => {
    try {
        if (!req.params.id || !/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const errors = validateOrganizerBody(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: errors[0] });
        }

        const organizer = await Organizer.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role,
                department: req.body.department,
                office: req.body.office,
                experience: req.body.experience,
                bio: req.body.bio,
                isActive: req.body.isActive,
            },
            { new: true, runValidators: true }
        ).lean();

        if (!organizer) {
            return res.status(404).json({ error: 'Organizer not found' });
        }

        res.status(200).json(organizer);
    } catch (error) {
        res.status(error.name === 'ValidationError' ? 400 : 500).json({
            error: getErrorMessage(error, 'Unable to update organizer'),
        });
    }
};

const deleteOrganizers = async (req, res) => {
    try {
        if (!req.params.id || !/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const organizer = await Organizer.findByIdAndDelete(req.params.id);

        if (!organizer) {
            return res.status(404).json({ error: 'Organizer not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: getErrorMessage(error, 'Unable to delete organizer') });
    }
};

module.exports = {
    getAll,
    getSingle,
    createOrganizers,
    updateOrganizers,
    deleteOrganizers,
};
