const swaggerAutogen = require('swagger-autogen')();

  const doc = {
  info: {
    title: 'Frank API',
    description: 'API documentation for Events and Organizers',
    version: '1.0.0',
  },
    host: 'localhost:8080',
    schemes: ['http'],
  definitions: {
    Event: {
        type: 'object',
        required: ['title', 'description', 'date', 'location', 'category', 'organizer', 'capacity', 'isPublic', 'ticketPrice'],
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
      },
      Organizer: {
        type: 'object',
        required: ['name', 'email', 'phone', 'role', 'department', 'office', 'experience', 'bio', 'isActive'],
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
    },
  },
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);