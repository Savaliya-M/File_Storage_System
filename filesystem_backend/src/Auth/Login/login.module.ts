import { Module, MiddlewareConsumer } from '@nestjs/common';
import { loginController } from './login.controller';
import { loginService } from './login.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../Signup/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { loginMiddleware } from './login.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [loginController],
  providers: [loginService],
})
export class LoginModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loginMiddleware).forRoutes('login');
  }
}
