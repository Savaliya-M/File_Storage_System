import { otelSDK } from './tracing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const session = require('express-session');
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as connectRedis from 'connect-redis';
import { RedisService } from 'nestjs-redis';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import * as cors from 'cors';
import { grpcClientOptions } from './grpc-client.options';

async function bootstrap() {
  await otelSDK.start();
  const app = await NestFactory.create(AppModule);

  const microservice = app.connectMicroservice({
    transport: Transport.REDIS,
    options: { host: 'localhost', port: 6379 },
  });

  app.connectMicroservice<MicroserviceOptions>(grpcClientOptions);

  app.use(
    session({
      secret:
        'akjsbcuas6we3rwef3fERW$RT#$RFwef3#$R#$RF34f34f3$T#$R#$RR#F3434f#$',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.enableCors();

  // const io = app.getHttpAdapter().getInstance().of('/socket');
  // io.use(cors());
  app.useWebSocketAdapter(new IoAdapter(app));

  const httpAdapter = app.getHttpAdapter();
  // const io = require('socket.io')(httpAdapter.getHttpServer(), {
  //   origins: ['*'],
  // });

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
