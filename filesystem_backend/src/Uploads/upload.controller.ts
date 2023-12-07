import {
  Controller,
  Post,
  Get,
  Delete,
  Res,
  Req,
  Param,
  UseInterceptors,
  Dependencies,
  UseGuards,
  UploadedFiles,
  Inject,
  Logger,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/Auth/Login/auth.guard';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Response, Request, NextFunction } from 'express';
import * as fs from 'fs';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from 'src/Auth/Signup/user.schema';
import { Connection, Model } from 'mongoose';
import {
  ClientGrpc,
  ClientProxy,
  ClientProxyFactory,
  Transport,
  Client,
  ClientOptions,
} from '@nestjs/microservices';
import { microserviceService } from 'src/Microservices/microservice.service';
import { Image } from './image.schema';
import { SocketGateway } from './socket.gateway';
import { uploadService } from './upload.service';
import * as Grid from 'gridfs-stream';
import * as mongoose from 'mongoose';
import { GridFSBucketReadStream } from 'mongodb';
import { Observable, of } from 'rxjs';
import { HeroById } from 'src/Microservices/interfaces/hero-by-id.interface';
import { Hero } from 'src/Microservices/interfaces/hero.interface';

interface ExtendedRequest extends Request {
  user: { id: string; uname: string };
  userId?: string;
  userName?: string;
}

interface HeroService {
  findOne(data: HeroById): Observable<Hero>;
  findMany(upstream: Observable<HeroById>): Observable<Hero>;
}

const imageResizeClient: ClientProxy = ClientProxyFactory.create({
  transport: Transport.REDIS,
  options: {
    name: 'ImageResizeService',
  },
});

@Controller('upload')
export class uploadController {
  private gfs: Grid.Grid;
  private heroService: HeroService;
  private readonly logger = new Logger(uploadController.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(microserviceService)
    private microserviceService: microserviceService,
    @InjectModel(Image.name) private imageModel: Model<Image>,
    private socketGateway: SocketGateway,
    private uploadService: uploadService,
    @InjectConnection() private connection: Connection,
    @Inject('HERO_PACKAGE') private readonly client: ClientGrpc,
  ) {
    this.gfs = new mongoose.mongo.GridFSBucket(this.connection.db, {
      bucketName: 'uploads',
    });
  }

  onModuleInit() {
    this.heroService = this.client.getService<HeroService>('HeroService');
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('file'))
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: ExtendedRequest,
  ) {
    files.map(async (file) => {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { id: req.user.id },
        {
          $push: {
            events: {
              eventName: 'file upload',
              timeStamp: new Date(),
            },
          },
        },
        { new: true },
      );
      const image = new this.imageModel({
        fileName: file.originalname,
        fileId: await uuidv4(),
        user: updatedUser._id,
      });

      await image.save();
      const byteArray = await Buffer.from(file.buffer);
      await this.uploadService.uploadImage(
        byteArray,
        file.originalname,
        image._id.toString(),
        'Original',
      );

      const size = [
        { width: 800, height: 600 },
        { width: 600, height: 400 },
        { width: 400, height: 300 },
        { width: 100, height: 80 },
      ];

      for (let i = 0; i < size.length; i++) {
        this.socketGateway.imageStatusUpdated({
          fileName: file.originalname,
          status: 'Processing',
          size: `${size[i].width}${size[i].height}`,
        });
        const updatedImage = await this.imageModel.findOneAndUpdate(
          { fileName: file.originalname },
          {
            $push: {
              status: {
                size: `${size[i].width}/${size[i].height}`,
                status: 'Processing ',
                timeStamp: new Date(),
              },
            },
          },
          { new: true },
        );

        const byteArray = Buffer.from(file.buffer);
        const data = {
          inputImage: byteArray,
          width: size[i].width,
          height: size[i].height,
        };

        try {
          const result = await imageResizeClient
            .send<any>('resizeImage', data)
            .toPromise();

          const resizedByteArray = await Buffer.from(result);

          await this.uploadService.uploadImage(
            resizedByteArray,
            file.originalname,
            image._id.toString(),
            `${size[i].width}/${size[i].height}`,
          );
          this.socketGateway.imageStatusUpdated({
            fileName: file.originalname,
            status: 'Completed',
            size: `${size[i].width}${size[i].height}`,
          });
          const updatedImage = await this.imageModel.findOneAndUpdate(
            { fileName: file.originalname },
            {
              $push: {
                status: {
                  size: `${size[i].width}/${size[i].height}`,
                  status: 'Completed ',
                  timeStamp: new Date(),
                },
              },
            },
            { new: true },
          );
        } catch (e) {
          console.log(e, 'in controller');
          this.socketGateway.imageStatusUpdated({
            fileName: file.originalname,
            status: 'Error',
            size: `${size[i].width}${size[i].height}`,
          });
          const updatedImage = await this.imageModel.findOneAndUpdate(
            { fileName: file.originalname },
            {
              $push: {
                status: {
                  size: `${size[i].width}/${size[i].height}`,
                  status: 'Error ',
                  timeStamp: new Date(),
                },
              },
            },
            { new: true },
          );
        }
      }
    });

    return { message: 'Image uploaded successfully' };
  }

  @UseGuards(AuthGuard)
  @Get('list')
  async listFiles(@Res() res: Response, @Req() req): Promise<void> {
    this.logger.log('listFiles');
    this.logger.warn('listing is about to complete');

    const dd = this.heroService.findOne({ id: 1 });

    dd.subscribe({
      next: (hero: Hero) => {
        console.log(hero);
      },
      complete: () => {
        console.log('Operation completed.');
      },
    });

    // const data = await this.redisService.getClient().get('size');
    // console.log(data, 'redis data');

    const user = await this.userModel.findOne({ id: req.user.id }).exec();

    if (!user) {
      console.log('user not found');
    }

    const images = await this.imageModel
      .find({ user: user._id })
      .populate('user')
      .exec();

    res.json({ images });
  }

  @UseGuards(AuthGuard)
  @Get(':filedata')
  async deleteFile(
    @Res() res: Response,
    @Req() req,
    @Param('filedata') filedata: string,
  ): Promise<void> {
    const image = await this.imageModel.findOne({
      fileId: filedata.split('_')[0],
    });

    const deletedFileIds = await this.fetchFilesByImageId(image._id.toString());
    console.log(deletedFileIds, 'array');

    deletedFileIds.forEach(async (fileId) => {
      await this.removeFile(fileId);
    });

    const deletedImage = await this.imageModel.deleteOne(image._id);
    console.log(deletedImage);

    res.status(200).send('File deleted successfully');
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { id: req.user.id },
        {
          $push: {
            events: {
              eventName: 'delete the files',
              timeStamp: new Date(),
            },
          },
        },
        { new: true },
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
    // } else {
    //   console.log('File not found');
    //   res.status(404).send('File not found');
    // }
  }
  async fetchFilesByImageId(imageId: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const deletedFileIds: string[] = [];
      const stream: GridFSBucketReadStream = this.gfs
        .find({ 'metadata.imageId': imageId })
        .stream();

      stream.on('data', (file) => {
        console.log('File:', file);
        const fileId = file._id.toString();
        deletedFileIds.push(fileId);
      });

      stream.on('end', () => {
        console.log('Stream ended');
        resolve(deletedFileIds);
      });

      stream.on('error', (error) => {
        console.error('Stream error:', error);
        reject(error);
      });
    });
  }
  private async removeFile(fileId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log('in remove');

      this.gfs.delete(new mongoose.Types.ObjectId(fileId), (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('deleted');

          resolve();
        }
      });
    });
  }
}

// @UseGuards(AuthGuard)
// @Post()
// @UseInterceptors(
//   FilesInterceptor('file', 50, {
//     storage: diskStorage({
//       destination: (req: ExtendedRequest, file, cb) => {
//         const userId = req.user?.id;
//         const userName = req.user?.uname;
//         console.log('inside interseptor');

//         req.userId = userId;
//         req.userName = userName;

//         const folderName = `${userName}_${userId}`;
//         const folderPath = `./Fileuploads/${folderName}`;

//         fs.promises
//           .mkdir(folderPath, { recursive: true })
//           .then(() => cb(null, folderPath))
//           .catch((err) => cb(err, folderPath));
//       },
//       filename: (req, file, cb) => {
//         const uniqueFilename = `${uuidv4()}_${file.originalname}`;
//         cb(null, uniqueFilename);
//       },
//     }),
//   }),
// )
// async upload(
//   @Res() res,
//   @Req() req: ExtendedRequest,
//   @UploadedFiles() files: Express.Multer.File[],
// ): Promise<unknown> {
//   try {
//     const updatedUser = await this.userModel.findOneAndUpdate(
//       { id: req.user.id },
//       {
//         $push: {
//           events: {
//             eventName: 'file upload',
//             timeStamp: new Date(),
//           },
//         },
//       },
//       { new: true },
//     );

//     files.map(async (file) => {
//       const image = new this.imageModel({
//         fileName: file.originalname,
//         imageId: file.filename.split('_')[0],
//         user: updatedUser._id,
//       });
//       console.log(file.filename);

//       await image.save();
//     });
//     console.log('Updated User:', updatedUser);

//     res.status(200).send('File uploaded successfully');
//   } catch (error) {
//     console.error('Error updating user:', error);
//   }

//   const resizedResults = await Promise.all(
//     files.map(async (file) => {
//       // const originalImageData = fs.readFileSync(file.path);

//       const size = [
//         { width: 800, height: 600 },
//         { width: 600, height: 400 },
//         { width: 400, height: 300 },
//         { width: 100, height: 80 },
//       ];

//       for (let i = 0; i < size.length; i++) {
//         this.socketGateway.imageStatusUpdated({
//           fileName: file.originalname,
//           status: 'Processing',
//           size: `${size[i].width}${size[i].height}`,
//         });

//         const updatedImage = await this.imageModel.findOneAndUpdate(
//           { fileName: file.originalname },
//           {
//             $push: {
//               status: {
//                 size: `${size[i].width}/${size[i].height}`,
//                 status: 'Processing ',
//                 timeStamp: new Date(),
//               },
//             },
//           },
//           { new: true },
//         );

//         const filePath = `./Fileuploads/${req.userName}_${req.userId}/${size[i].width}-${size[i].height}_${file.filename}`;

//         const data = {
//           inputPath: file.path,
//           outputPath: filePath,
//           width: size[i].width,
//           height: size[i].height,
//         };

//         try {
//           const result = await imageResizeClient
//             .send<any>('resizeImage', data)
//             .toPromise();
//           console.log(result, 'in microservice');
//           const updatedImage = await this.imageModel.findOneAndUpdate(
//             { fileName: file.originalname },
//             {
//               $push: {
//                 status: {
//                   size: `${size[i].width}/${size[i].height}`,
//                   status: 'Completed ',
//                   timeStamp: new Date(),
//                 },
//               },
//             },
//             { new: true },
//           );
//           this.socketGateway.imageStatusUpdated({
//             fileName: file.originalname,
//             status: 'Completed',
//             size: `${size[i].width}${size[i].height}`,
//           });
//         } catch (error) {
//           console.error('Error in microservice communication:', error);
//           const updatedImage = await this.imageModel.findOneAndUpdate(
//             { fileName: file.originalname },
//             {
//               $push: {
//                 status: {
//                   size: `${size[i].width}/${size[i].height}`,
//                   status: 'Error in resizing image',
//                   timeStamp: new Date(),
//                 },
//               },
//             },
//             { new: true },
//           );
//           this.socketGateway.imageStatusUpdated({
//             fileName: file.originalname,
//             status: 'Error',
//             size: `${size[i].width}${size[i].height}`,
//           });
//         }
//       }

//       return `${file.filename} is resized`;
//     }),
//   );
//   console.log(resizedResults, 're');

//   return 'upload and resize completed successfully';
// }
