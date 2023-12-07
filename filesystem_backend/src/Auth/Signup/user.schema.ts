import { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  id: string;

  @Prop()
  userName: string;

  @Prop()
  password: string;

  @Prop([{ eventName: String, timeStamp: Date, data: String }])
  events: [];

  @Prop()
  createdAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
