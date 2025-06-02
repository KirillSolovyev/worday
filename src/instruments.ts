import 'dotenv/config'; // Load dotenv to load env variables from .env file
import { init } from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
});
