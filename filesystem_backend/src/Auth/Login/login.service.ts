import { Injectable, UnauthorizedException, Req } from '@nestjs/common';
import { userDto } from './Dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../Signup/user.schema';
import { Model } from 'mongoose';
import md5 from 'md5';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class loginService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async findByUsername(userDto: userDto, @Req() req) {
    const { userName, password } = userDto;
    console.log(userName, 'in login', password);

    try {
      const userData = await this.userModel
        .findOne({ userName: userName })
        .exec();
      if (userData) {
        console.log(userData);
      }

      if (md5(password) === userData.password) {
        console.log('Login successful');
        const payload = { id: userData.id, uname: userData.userName };
        console.log(req.sessionID, 'sessionID');
        try {
          this.userModel.findOneAndUpdate(
            { id: userData.id },
            {
              $push: {
                events: {
                  eventName: 'login',
                  timeStamp: new Date(),
                  data: await req.sessionID,
                },
              },
            },
            { new: true },
          );
        } catch (error) {
          console.error('Error updating user:', error);
        }

        return { access_token: await this.jwtService.signAsync(payload) };
      } else {
        console.log('Login failed');
        throw new UnauthorizedException();
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
