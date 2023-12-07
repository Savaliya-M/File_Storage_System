import { Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { createUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import md5 from 'md5';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class signupService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: createUserDto): Promise<User> {
    const Userdata = {
      id: await uuidv4(),
      userName: user.userName,
      password: await md5(user.password),
    };
    const createdUser = new this.userModel(await Userdata);
    return createdUser.save();
  }
}
