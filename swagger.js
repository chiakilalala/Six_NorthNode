const swaggerAutogen = require('swagger-autogen')()
const config = require('./utilities/config')
const doc = {
  info: {
    version: '2.5.10',
    title: 'META API',
    description: 'API文件'
  },
  host: config.host,
  schemes: ['http', 'https']
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)
