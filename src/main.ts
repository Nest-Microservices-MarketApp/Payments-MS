import { NestFactory } from '@nestjs/core';
import { INestMicroservice, Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';

async function configureMiddleware(app: INestMicroservice) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}

async function bootstrap() {
  const logger = new Logger('MS Payments - Bootstrap');

  //TODO: maybe you have to set rawBody to true for the webhook to work
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.NATS,
  //     options: {
  //       servers: envs.natsServers,
  //     },
  //   },
  // );

  await configureMiddleware(app);

  await app.listen();
  logger.log(`Payments Microservice running on: ${envs.port}`);
}
bootstrap();
