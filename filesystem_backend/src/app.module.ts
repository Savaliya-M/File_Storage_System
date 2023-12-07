import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './Auth/auth.module';
import { UploadModule } from './Uploads/upload.module';
import { User, UserSchema } from './Auth/Signup/user.schema';
import { MicroservicesModule } from './Microservices/microservices.module';
// import { RedisModule, RedisService } from 'nestjs-redis';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { OrganizationModule } from './Organization/organization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User as Userps } from './Organization/entities/user.entity';
import { Organization } from './Organization/entities/organization.entity';
import { User_creds } from './Organization/entities/user_creds.entity';
import { Sessions } from './Organization/entities/sessions.entity';
import { Subscription } from './Organization/entities/subscription.entity';
import { Notes } from './Organization/entities/notes.entity';
import { Todo } from './Organization/entities/todo.entity';
import { Product_provisioning } from './Organization/entities/product_provisioning.entity';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule,
    MicroservicesModule,
    UploadModule,
    OrganizationModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/FileSystem'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'masavaliya',
      username: 'postgres',
      entities: [
        Userps,
        Organization,
        User_creds,
        Sessions,
        Subscription,
        Notes,
        Todo,
        Product_provisioning,
      ],
      database: 'Organization',
      synchronize: true,
      logging: true,
    }),
  ],
})
export class AppModule {}
