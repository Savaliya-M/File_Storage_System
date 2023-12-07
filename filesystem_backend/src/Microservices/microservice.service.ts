import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  Transport,
  ClientProxyFactory,
} from '@nestjs/microservices';
import sharp from 'sharp';

@Injectable()
export class microserviceService {
  private imageResizeClient: ClientProxy;

  constructor() {
    this.imageResizeClient = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        name: 'ImageResizeService',
      },
    });
  }

  async handleEvent(data: {
    inputImage: Buffer;
    width: number;
    height: number;
  }): Promise<unknown> {
    const resizedImageBuffer = await sharp(Buffer.from(data.inputImage))
      .resize(data.width, data.height)
      .toBuffer();

    return resizedImageBuffer;
  }
}
