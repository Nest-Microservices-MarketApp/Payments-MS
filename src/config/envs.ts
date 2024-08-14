import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_SECRET_KEY: string;
}

const envSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required().default(3003),
    STRIPE_PUBLISHABLE_KEY: joi.string().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
  })
  .unknown(true);

const { error, value: envVars } = envSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(
    `Config validation error: ${error.message}. Please check your environment variables.`,
  );
}

export const envs = {
  port: envVars.PORT,
  stripePublishableKey: envVars.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: envVars.STRIPE_SECRET_KEY,
};
