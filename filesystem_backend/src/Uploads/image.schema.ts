import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema({ timestamps: true })
export class Image {
  @Prop()
  fileName: string;

  @Prop()
  fileId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop([{ size: String, status: String, timeStamp: Date }])
  status: [];

  @Prop()
  createdAt?: Date;
}
export const ImageSchema = SchemaFactory.createForClass(Image);

ImageSchema.post('save', function (doc, next) {
  console.log('Image saved:', doc);
  next();
});
