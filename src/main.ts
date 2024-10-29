import {
  cacheMiddleware,
  compression,
  corsMiddleware,
  helmetMiddleware,
  type INextFunction,
  type IRequestContext,
  rateLimiter,
  setupSwagger,
  ThanhHoa,
} from '@thanhhoajs/thanhhoa';

import { swaggerSpec } from './common/swagger/swagger-spec';
import { runValidators } from './configs';
import { appConfig } from './configs/app.config';
import { AppModule } from './modules/app.module';

// Set the timezone to UTC
process.env.TZ = 'Etc/Universal';
const docsRoute = '/docs';
const prefix = '/api';

runValidators();

const app = new ThanhHoa(prefix);

new AppModule(app);

const applyMiddlewareIfNeeded = (
  middleware: any,
  context: IRequestContext,
  next: INextFunction,
) => {
  if (!context.request.url.includes(docsRoute)) {
    return middleware()(context, next);
  }
  return next();
};

app.use((context, next) =>
  applyMiddlewareIfNeeded(corsMiddleware, context, next),
);
app.use((context, next) =>
  applyMiddlewareIfNeeded(helmetMiddleware, context, next),
);
app.use(
  rateLimiter({
    windowMs: 30000, // 30 seconds
    maxRequests: 5, // 5 requests
    message: 'Too many requests, please try again later',
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
  }),
);
app.use(cacheMiddleware());
app.use(
  compression({
    level: 1,
    library: 'zlib',
    memLevel: 9,
    windowBits: 9,
  }),
);

setupSwagger(app, docsRoute, swaggerSpec);

app.listen({ port: appConfig.port, development: true });
