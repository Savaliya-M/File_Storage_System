import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { MicroservicesController } from './microservice.controller';
import { microserviceService } from './microservice.service';
import { grpcClientOptions } from 'src/grpc-client.options';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [MicroservicesController],
  providers: [microserviceService],
  imports: [
    // ConfigModule,
    // RedisModule.register({
    //   host: 'localhost',
    //   port: 6379,
    // }),

    ClientsModule.register([
      {
        name: 'ImageResizeService',
        transport: Transport.REDIS,
      },
      {
        name: 'DataStored',
        transport: Transport.REDIS,
      },
      {
        name: 'HERO_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
})
export class MicroservicesModule {}
