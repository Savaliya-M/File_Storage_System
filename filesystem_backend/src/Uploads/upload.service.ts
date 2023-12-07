import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { GridFSBucket } from 'mongoose-gridfs';
import { Connection } from 'mongoose';
import * as mongoose from 'mongoose';
import { Image, ImageDocument } from './image.schema';
import { Model } from 'mongoose';

@Injectable()
export class uploadService {
  private gridFsBucket: GridFSBucket;
  private gfs: any;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Image.name) private imageModel: Model<Image>,
  ) {
    this.gridFsBucket = new mongoose.mongo.GridFSBucket(this.connection.db, {
      bucketName: 'uploads',
    });
  }

  async uploadImage(
    uploadedFile: Buffer,
    fileName: string,
    imageId: string,
    versionType: string,
  ): Promise<string> {
    const fileId = new mongoose.Types.ObjectId();

    const uploadStream = await this.gridFsBucket.openUploadStreamWithId(
      fileId,
      fileName,
      {
        metadata: {
          imageId: imageId,
          versionType: versionType,
        },
      },
    );
    uploadStream.end(uploadedFile);

    return fileId.toString();
  }
}
