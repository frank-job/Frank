const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const eventCollection = () => mongodb.getDatabase().collection('Frankapi');

const EventFromBody = (body) => ({
  title: body.title,
  description: body.description,
  date: body.date,
  location: body.location,
 
});
const getAll = async(req, res) => {
    const collection = eventCollection();
    const results = await collection.find();
    results.toArray().then((users) => {
        res.setHeader('content-type', 'application/json');
        res.status(200).json(users);
    })
}

const getSingle = async(req, res) => {
    const userId = new ObjectId(req.params.id);

    const collection = eventCollection();
    const results = await collection.find({_id: userId});
    results.toArray().then((user) => {
        res.setHeader('content-type', 'application/json');
        res.status(200).json(user[0]);
    })
}

const createEvents = async(req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body must be valid JSON' });
    }

    const event = EventFromBody(req.body);

        const response = await eventCollection().insertOne(event)

    if(response.acknowledged ) {
          res.status(201).json(response.insertedId);
    } else {
        res.status(500).json(response.error || 'Error when Creating user')
    }
  

}



const updateEvents = async(req, res) => {
  const userId = new ObjectId(req.params.id);

        if (!req.body) {
                return res.status(400).json({ error: 'Request body must be valid JSON' });
        }

    const event = EventFromBody(req.body);

        const response = await eventCollection().replaceOne({_id: userId}, event)
    if(response.modifiedCount > 0) {
          res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error when updating user')
    }
  

}

const deleteEvents = async(req, res) => {
  const userId = new ObjectId(req.params.id);

    const response = await eventCollection().deleteOne({_id: userId})
    if(response.deletedCount > 0) {
          res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error when deleting user')
    }
  

}


module.exports = {
    getAll,
    getSingle,
    createEvents,
    updateEvents,
    deleteEvents
};