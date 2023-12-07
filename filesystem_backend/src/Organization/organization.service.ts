import { Injectable, Res } from '@nestjs/common';
import { CreateUserDto, loginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { User_creds } from './entities/user_creds.entity';
import { Keccak } from 'sha3';
import md5 from 'md5';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CreateOrgDto } from './dto/create-org.dto';
import { Organization } from './entities/organization.entity';
import { Subscription } from './entities/subscription.entity';
import { CreateNotesDto } from './dto/create-note.dto';
import { Notes } from './entities/notes.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  EntityRepository,
} from 'typeorm';
import { Connection } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './entities/todo.entity';
import { QueryRunner } from 'typeorm';
import { provisioningProductDto } from './dto/provisioning-product.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class OrganizationService {
  private queryRunner: QueryRunner;
  private subscriptionClient: ClientProxy;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(User_creds)
    private user_credsRepository: Repository<User_creds>,
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Notes) private notesRepository: Repository<Notes>,
    private readonly entityManager: EntityManager,
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,

    private jwtService: JwtService,
  ) {
    this.subscriptionClient = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        name: 'ProductProvisioning',
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const user: User = new User();
    const user_creds: User_creds = new User_creds();
    const sha3 = new Keccak(256);
    sha3.update(createUserDto.password);

    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.orgid = createUserDto.orgid;

    const savedUser = await this.userRepository.save(user);

    user_creds.uid = savedUser.id;
    user_creds.sha32 = sha3.digest('hex');
    user_creds.md5 = md5(createUserDto.password);

    const savedUserCreds = await this.user_credsRepository.save(user_creds);

    const id = createUserDto.orgid;
    const organization = await this.orgRepository.findOneBy({ id });
    console.log(organization);

    if (organization) {
      const users = organization.users || [];
      users.push(savedUser.id);
      organization.users = users;

      await this.orgRepository.save(organization);
    }

    return { user: savedUser, user_creds: savedUserCreds };
  }

  async createOrganization(createorgDto: CreateOrgDto) {
    const org: Organization = new Organization();
    const subscription: Subscription = new Subscription();
    org.org_name = createorgDto.org_name;
    org.is_active = createorgDto.is_active;
    org.domain = createorgDto.domain;

    const createdOrg = await this.orgRepository.save(org);

    let random = Math.floor(Math.random() * 2) + 1;
    subscription.org_id = createdOrg.id;
    const products = subscription.products || [];
    if (random === 1) {
      products.push('notes');
    } else {
      products.push('notes');
      products.push('todo');
    }
    subscription.products = products;
    const createdSubscription =
      await this.subscriptionRepository.save(subscription);

    return { organization: createdOrg, subscription: createdSubscription };
  }

  async createNotes(createNotesDto: CreateNotesDto) {
    const note: Notes = new Notes();

    note.uid = createNotesDto.uid;
    note.title = createNotesDto.title;
    note.description = createNotesDto.description;

    this.queryRunner = await this.getQueryRunner(createNotesDto.orgid);

    const result = await this.queryRunner.manager.save(Notes, note);
    return result;
  }

  async createTodo(createTodoDto: CreateTodoDto) {
    const todo: Todo = new Todo();

    todo.orgid = createTodoDto.orgid;
    todo.todo = createTodoDto.todo;
    todo.uid = createTodoDto.uid;

    this.queryRunner = await this.getQueryRunner(createTodoDto.orgid);

    const result = await this.queryRunner.manager.save(Todo, todo);
    return result;
  }

  async login(loginuserDto: loginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginuserDto.email },
    });
    const user_creds = await this.user_credsRepository.findOne({
      where: { uid: user.id },
    });
    if (user_creds.md5 === md5(loginuserDto.password)) {
      console.log(user);
      const payload = {
        id: user.id,
        orgid: user.orgid,
        name: user.name,
        email: user.email,
      };
      if (user.orgid === 1) {
        return {
          role: 'Admin',
          access_token: await this.jwtService.signAsync(payload),
        };
      }
      return {
        role: 'User',
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      return 'wrong credentials';
    }
  }

  async provisioning(provisioningproductDto: provisioningProductDto) {
    return this.subscriptionClient.emit('subscribingProducts', {
      orgid: provisioningproductDto.orgid,
      products: provisioningproductDto.products,
    });
  }

  async findAllNotes(id: string) {
    const [uid, orgid] = id.split('_').map(Number);

    this.queryRunner = await this.getQueryRunner(orgid);

    const notequery = `SELECT * FROM notes WHERE uid = ${uid}`;
    const notesData = this.queryRunner.query(notequery);

    return notesData;
  }

  async findAllTodos(id: string) {
    try {
      const [uid, orgid] = id.split('_').map(Number);

      this.queryRunner = await this.getQueryRunner(orgid);

      const query = `SELECT * FROM todo WHERE uid = ${uid}`;
      const Data = await this.queryRunner.query(query);

      return Data;
    } catch (error) {
      console.error('Error in findAllTodos:', error);
      throw error;
    }
  }

  findSubscription(id: number) {
    return this.subscriptionRepository.findOne({ where: { org_id: id } });
  }

  async findAllOrg() {
    const orgs = await this.orgRepository.find();
    const subs = await this.subscriptionRepository.find();
    return {
      organizations: orgs,
      subscription: subs,
    };
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  removeOrg(id: number) {
    return this.orgRepository.delete({ id });
  }

  async removeNote(nid: string) {
    const [id, uid] = nid.split('_').map(Number);
    const user = await this.userRepository.findOneBy({ id: uid });

    this.queryRunner = await this.getQueryRunner(user.orgid);

    const result = await this.queryRunner.manager
      .getRepository(Notes)
      .delete(id);

    return result;
  }

  async removeTodo(ids: string) {
    const [id, orgid] = ids.split('_').map(Number);

    this.queryRunner = await this.getQueryRunner(orgid);

    const result = await this.queryRunner.manager
      .getRepository(Todo)
      .delete(id);

    return result;
  }

  async getQueryRunner(id: number) {
    console.log(id, 'this');

    const organization = await this.orgRepository.findOneBy({ id });
    const subscription = await this.subscriptionRepository.findOne({
      where: { org_id: id },
    });

    if (!organization || !subscription) {
      throw new Error('Organization or subscription not found');
    }

    const schemaName = `schema_${id}_${organization.org_name.replace(
      / /g,
      '_',
    )}`.toLowerCase();

    const query = `
        SELECT create_tables($1, $2);
    `;

    const re = await this.entityManager.query(query, [
      schemaName,
      subscription.products,
    ]);

    const queryRunner =
      this.todoRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(`SET search_path TO ${schemaName}`);

    return queryRunner;
  }
  async dispose() {
    if (this.queryRunner) {
      await this.queryRunner.release();
    }
  }
}
