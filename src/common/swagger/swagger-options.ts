import type { Options } from 'swagger-jsdoc';

const currentDir = process.cwd();

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '100,000 Whys API',
      version: '1.0.0',
      description: 'API documentation for 100,000 Whys app',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [`${currentDir}/src/modules/**/*.controller.ts`],
};
