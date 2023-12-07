import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './Auth/Signup/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getHello(): string {
    return 'Hello World!';
  }

  async addEvents(uid: string, event: string): Promise<void> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { id: uid },
        {
          $push: {
            events: {
              eventName: event,
              timeStamp: new Date(),
            },
          },
        },
        { new: true },
      );
      console.log('Updated User:', updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }
}
