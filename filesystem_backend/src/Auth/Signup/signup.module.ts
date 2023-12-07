import { Module } from "@nestjs/common";
import { signupController } from "./signup.controller";
import { signupService } from "./signup.service";
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from "./user.schema";




@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [signupController],
    providers: [signupService]
})
export class SignupModule {}