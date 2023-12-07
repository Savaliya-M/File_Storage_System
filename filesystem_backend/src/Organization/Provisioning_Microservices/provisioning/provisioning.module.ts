import { Module } from '@nestjs/common';
import { ProvisioningService } from './provisioning.service';
import { ProvisioningController } from './provisioning.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/Organization/entities/subscription.entity';
import { Product_provisioning } from 'src/Organization/entities/product_provisioning.entity';

@Module({
  providers: [ProvisioningService],
  controllers: [ProvisioningController],
  imports: [
    ClientsModule.register([
      { name: 'ProductProvisioning', transport: Transport.REDIS },
    ]),
    TypeOrmModule.forFeature([Subscription, Product_provisioning]),
  ],
})
export class ProvisioningModule {}
