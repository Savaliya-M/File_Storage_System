import { Module } from '@nestjs/common';
import { SignupModule } from './Signup/signup.module';
import { LoginModule } from './Login/login.module';

@Module({
  imports: [SignupModule, LoginModule],
  controllers: [],
  providers: [],
})
export class AuthModule {}
