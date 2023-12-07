import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { User_creds } from './entities/user_creds.entity';
import { Organization } from './entities/organization.entity';
import { Sessions } from './entities/sessions.entity';
import { Subscription } from './entities/subscription.entity';
import { Notes } from './entities/notes.entity';
import { Todo } from './entities/todo.entity';
import { Product_provisioning } from './entities/product_provisioning.entity';
import { ProvisioningModule } from './Provisioning_Microservices/provisioning/provisioning.module';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  imports: [
    TypeOrmModule.forFeature([
      User,
      User_creds,
      Organization,
      Sessions,
      Subscription,
      Notes,
      Todo,
      Product_provisioning,
    ]),
    ProvisioningModule,
  ],
})
export class OrganizationModule {}
