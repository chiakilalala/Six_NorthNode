const swaggerAutogen = require('swagger-autogen')()
const config = require('./utilities/config')
const doc = {
  info: {
    version: '2.5.10',
    title: 'META API',
    description: 'API文件'
  },
  host: config.HOST,
  schemes: ['http', 'https'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'Authorization', // name of the header, query parameter or cookie
      description: 'jwt token'
    }
  }
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)
