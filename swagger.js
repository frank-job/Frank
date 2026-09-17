const swaggerAutogen = require('swagger-autogen')();

  const doc = {
  info: {
    title: 'Frank API',
    description: 'API documentation for Events',
  },
  host: 'localhost:8080',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter: Bearer {token}'
    }
  },
  definitions: {
    Event: {
      title: 'string',
      description: 'string',
      date: 'string',
      location: 'string',
    },
  },
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);