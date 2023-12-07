import { Module } from '@nestjs/common';
import { uploadController } from './upload.controller';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { User, UserSchema } from '../Auth/Signup/user.schema';
import { MicroservicesController } from 'src/Microservices/microservice.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microserviceService } from 'src/Microservices/microservice.service';
import { Image, ImageSchema } from './image.schema';
import { SocketGateway } from './socket.gateway';
import { MulterModule } from '@nestjs/platform-express';
import * as multerGridFSStorage from 'multer-gridfs-storage';
import { Connection } from 'mongoose';
import { uploadService } from './upload.service';
import { join } from 'path';
import { grpcClientOptions } from 'src/grpc-client.options';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
    ClientsModule.register([
      {
        name: 'ImageResizeService',
        transport: Transport.REDIS,
      },
      {
        name: 'HERO_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [uploadController, MicroservicesController],
  providers: [microserviceService, SocketGateway, uploadService],
})
export class UploadModule {}
