import * as Joi from 'joi';

export interface ENVVariables {
  NODE_ENV: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  ENCRYPTION_ROUNDS: string;
  JWT_SECRET_KEY: string;
}

const configs: () => ENVVariables = () => ({
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: +process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  ENCRYPTION_ROUNDS: process.env.ENCRYPTION_ROUNDS,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
});

export const configsValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  DB_HOST: Joi.string().empty(),
  DB_PORT: Joi.number().port().default(5432),
  DB_NAME: Joi.string().empty(),
  DB_USERNAME: Joi.string().empty(),
  DB_PASSWORD: Joi.string().empty(),
  ENCRYPTION_ROUNDS: Joi.number().empty(),
  JWT_SECRET_KEY: Joi.string().empty(),
});

export default configs;
