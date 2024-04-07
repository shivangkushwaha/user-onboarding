const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./router/*.js'];

const config = {
    info: {
        title: 'Ecom API Documentation',
        description: '',
    },
    tags: [ ],
    host: '51.20.44.57:8080/api',
    schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);