const swaggerAutogen = require('swagger-autogen')();

  const doc = {
  info: {
    title: 'Frank API',
    description: 'API documentation for Events',
  },
  host: 'frank-5580.onrender.com',
  schemes: ['https'],
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