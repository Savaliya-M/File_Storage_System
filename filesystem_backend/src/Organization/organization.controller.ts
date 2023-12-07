import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateUserDto, loginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateOrgDto } from './dto/create-org.dto';
import { CreateNotesDto } from './dto/create-note.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { provisioningProductDto } from './dto/provisioning-product.dto';

@Controller('api')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post('user')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.organizationService.create(createUserDto);
  }

  @Post('organization')
  createOrganization(@Body() createorgDto: CreateOrgDto) {
    return this.organizationService.createOrganization(createorgDto);
  }

  @Post('notes')
  createNotes(@Body() notesDto: CreateNotesDto) {
    return this.organizationService.createNotes(notesDto);
  }

  @Post('todo')
  createTodos(@Body() todoDto: CreateTodoDto) {
    return this.organizationService.createTodo(todoDto);
  }

  @Post('login')
  async login(@Body() loginuserDto: loginUserDto) {
    return this.organizationService.login(loginuserDto);
  }

  @Post('provisioning')
  async provisioning(@Body() provisioningProductDto: provisioningProductDto) {
    return this.organizationService.provisioning(provisioningProductDto);
  }

  @Get('notes/:id')
  findAllNotes(@Param('id') id: string) {
    return this.organizationService.findAllNotes(id);
  }

  @Get('todo/:id')
  findAllTodos(@Param('id') id: string) {
    return this.organizationService.findAllTodos(id);
  }

  @Get('subscription/:id')
  findSubscription(@Param('id') id: number) {
    return this.organizationService.findSubscription(id);
  }

  @Get('organization')
  findAllOrg() {
    return this.organizationService.findAllOrg();
  }

  @Delete('organization/:id')
  removeOrg(@Param('id') id: number) {
    return this.organizationService.removeOrg(id);
  }

  @Delete('notes/:id')
  removeNote(@Param('id') id: string) {
    return this.organizationService.removeNote(id);
  }

  @Delete('todo/:id')
  removeTodo(@Param('id') id: string) {
    return this.organizationService.removeTodo(id);
  }
}
