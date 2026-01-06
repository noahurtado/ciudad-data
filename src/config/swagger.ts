const swaggerDoc = {
  openapi: '3.0.0',
  info: { title: 'CiudadData API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/geo/city/{city}': {
      get: {
        summary: 'Datos geográficos de ciudad',
        parameters: [{ name: 'city', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } }
      }
    },
    '/geo/population/{country}': {
      get: {
        summary: 'Población por país',
        parameters: [{ name: 'country', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } }
      }
    },
    '/geo/report': {
      post: {
        summary: 'Reporte ciudadano',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Report' } } }
        },
        responses: { '201': { description: 'Created' }, '400': { description: 'Bad Request' } }
      }
    },
    '/transit/routes/{city}': {
      get: {
        summary: 'Rutas de transporte por ciudad',
        parameters: [{ name: 'city', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK' } }
      }
    },
    '/transit/eta': {
      get: {
        summary: 'ETA por parada',
        parameters: [{ name: 'stop_id', in: 'query', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK' }, '400': { description: 'Bad Request' } }
      }
    },
    '/transit/incident': {
      post: {
        summary: 'Incidente de transporte',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TransitIncident' } } }
        },
        responses: { '201': { description: 'Created' }, '400': { description: 'Bad Request' } }
      }
    }
  },
  components: {
    schemas: {
      Report: {
        type: 'object',
        required: ['type', 'description', 'city', 'location'],
        properties: {
          type: { type: 'string', enum: ['bache', 'iluminacion', 'transporte', 'otro'] },
          description: { type: 'string' },
          city: { type: 'string' },
          location: {
            type: 'object',
            properties: { lat: { type: 'number' }, lon: { type: 'number' } }
          }
        }
      },
      TransitIncident: {
        type: 'object',
        required: ['line', 'city', 'description'],
        properties: { line: { type: 'string' }, city: { type: 'string' }, description: { type: 'string' } }
      }
    }
  }
};
export default swaggerDoc;
