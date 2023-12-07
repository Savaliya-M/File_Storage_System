import {
  Body,
  Controller,
  Dependencies,
  Post,
  Get,
  Request,
  UseGuards,
  Req,
} from '@nestjs/common';
import { loginService } from './login.service';
import { userDto } from './Dto/user.dto';
import { AuthGuard } from './auth.guard';
import * as session from 'express-session';

@Controller('login')
@Dependencies(loginService)
export class loginController {
  constructor(private loginService: loginService) {}

  @Post()
  async findOne(@Body() userDto: userDto, @Req() req) {
    req.session.user = userDto;
    return this.loginService.findByUsername(userDto, req);
  }
}
