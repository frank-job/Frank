const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const eventCollection = () => mongodb.getDatabase().collection('Frankapi');

const eventFromBody = (body) => ({
    title: body.title,
    description: body.description,
    date: body.date,
    location: body.location,
});

const getAll = async(req, res) => {
    try {
        const collection = eventCollection();
        const results = await collection.find().toArray();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve events' });
    }
}

const getSingle = async(req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const userId = new ObjectId(req.params.id);
        const collection = eventCollection();
        const event = await collection.findOne({ _id: userId });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve event' });
    }
}

const createEvents = async(req, res) => {
    /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            title: 'string',
            description: 'string',
            date: 'string',
            location: 'string'
        }
    } */
    try {
        const events = eventFromBody(req.body);
        const response = await eventCollection().insertOne(events);

        if (response.acknowledged) {
            return res.status(201).json(response.insertedId);
        }

        return res.status(500).json({ error: 'Error when creating event' });
    } catch (error) {
        res.status(500).json({ error: 'Unable to create event' });
    }
}

const updateEvents = async(req, res) => {
    /* #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            title: 'string',
            description: 'string',
            date: 'string',
            location: 'string'
        }
    } */
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const userId = new ObjectId(req.params.id);
        const events = eventFromBody(req.body);

        const response = await eventCollection().replaceOne({ _id: userId }, events);
        if (response.matchedCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Unable to update event' });
    }
}

const deleteEvents = async(req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const userId = new ObjectId(req.params.id);

        const response = await eventCollection().deleteOne({ _id: userId });
        if (response.deletedCount === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete event' });
    }
}

module.exports = {
    getAll,
    getSingle,
    createEvents,
    updateEvents,
    deleteEvents
};
