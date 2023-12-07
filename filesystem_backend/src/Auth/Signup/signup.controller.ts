import { Body, Controller, Dependencies, Post, Req, Res } from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';
import { signupService } from './signup.service';
import { Request, Response } from 'express';

@Controller('signup')
@Dependencies(signupService)
export class signupController {
  constructor(private signupService: signupService) {}

  @Post()
  async create(
    @Res() res: Response,
    @Body() createUserDto: createUserDto,
  ): Promise<void> {
    await this.signupService.create(createUserDto).then(() => {
      res.status(200).send('OK');
    });
  }
}
