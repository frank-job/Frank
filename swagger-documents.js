const swaggerDocument = require('./swagger.json');
const swaggerScheme = process.env.SWAGGER_SCHEME || 'http';
const swaggerHost = process.env.SWAGGER_HOST || 'localhost:8080';

const swaggerConnection = {
    host: swaggerHost,
    schemes: [swaggerScheme],
};

const eventDefinition = {
    type: 'object',
    required: [
        'title',
        'description',
        'date',
        'location',
        'category',
        'organizer',
        'capacity',
        'isPublic',
        'ticketPrice',
    ],
    properties: {
        title: { type: 'string', example: 'Science Fair 2026' },
        description: { type: 'string', example: 'Annual school science fair.' },
        date: { type: 'string', example: '10/05/2026' },
        location: { type: 'string', example: 'Main Hall' },
        category: { type: 'string', example: 'Academic' },
        organizer: { type: 'string', example: 'Science Department' },
        capacity: { type: 'integer', example: 250 },
        isPublic: { type: 'boolean', example: true },
        ticketPrice: { type: 'number', example: 0 },
    },
};

const organizerDefinition = {
    type: 'object',
    required: [
        'name',
        'email',
        'phone',
        'role',
        'department',
        'office',
        'experience',
        'bio',
        'isActive',
    ],
    properties: {
        name: { type: 'string', example: 'Taylor Morgan' },
        email: { type: 'string', example: 'taylor@example.com' },
        phone: { type: 'string', example: '+1 555-123-4567' },
        role: { type: 'string', example: 'Coordinator' },
        department: { type: 'string', example: 'Science' },
        office: { type: 'string', example: 'Building A 204' },
        experience: { type: 'integer', example: 8 },
        bio: { type: 'string', example: 'Coordinates academic events and student programs.' },
        isActive: { type: 'boolean', example: true },
    },
};

const createDocument = (resource, definitionName, definition) => ({
    ...swaggerDocument,
    ...swaggerConnection,
    info: {
        ...swaggerDocument.info,
        title: `${definitionName} API`,
    },
    paths: Object.fromEntries(
        Object.entries(swaggerDocument.paths).filter(([path]) => path.startsWith(`/${resource}/`))
    ),
    definitions: {
        [definitionName]: definition,
    },
});

module.exports = {
    all: {
        ...swaggerDocument,
        ...swaggerConnection,
        definitions: {
            Event: eventDefinition,
            Organizer: organizerDefinition,
        },
    },
    events: createDocument('events', 'Event', eventDefinition),
    organizers: createDocument('organizers', 'Organizer', organizerDefinition),
};
