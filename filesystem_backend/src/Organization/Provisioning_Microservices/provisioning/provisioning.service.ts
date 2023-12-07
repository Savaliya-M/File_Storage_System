// provisioning-microservice/provisioning.service.ts
import { Injectable } from '@nestjs/common';
import {
  Client,
  ClientProxy,
  Transport,
  ClientProxyFactory,
} from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Product_provisioning } from 'src/Organization/entities/product_provisioning.entity';
import { Subscription } from 'src/Organization/entities/subscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProvisioningService {
  private subscriptionClient: ClientProxy;

  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Product_provisioning)
    private provisioningRepo: Repository<Product_provisioning>,
  ) {
    this.subscriptionClient = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        name: 'ProductProvisioning',
      },
    });
  }

  async subscribingProducts(data: { orgid: number; products: Array<string> }) {
    const subscription = await this.subscriptionRepo.findOne({
      where: { org_id: data.orgid },
    });

    if (subscription) {
      const existingProducts = subscription.products;
      const newProducts = data.products;

      const productsToAdd = newProducts.filter(
        (product) => !existingProducts.includes(product),
      );
      const productsToRemove = existingProducts.filter(
        (product) => !newProducts.includes(product),
      );

      console.log(
        productsToAdd,
        'ADD product',
        productsToRemove,
        'remove Products',
      );

      subscription.products = data.products;
      await this.subscriptionRepo.save(subscription);
      var added, removed;
      if (productsToAdd) {
        added = productsToAdd.map((element) => {
          return this.subscriptionClient.emit('provisioningProducts', {
            orgid: data.orgid,
            subscription_id: subscription.id,
            product: element,
            event: 'Provisioning Product',
          });
        });
        added = added.filter((result) => result !== undefined);
      }
      if (productsToRemove) {
        removed = productsToRemove.map((element) => {
          return this.subscriptionClient.emit('provisioningProducts', {
            orgid: data.orgid,
            subscription_id: subscription.id,
            product: element,
            event: 'Removing Product',
          });
        });
        removed = removed.filter((result) => result !== undefined);
      }
    } else {
      const sub: Subscription = new Subscription();
      sub.org_id = data.orgid;
      sub.products = data.products;
      added = data.products.map((element) => {
        return this.subscriptionClient.emit('provisioningProducts', {
          orgid: data.orgid,
          subscription_id: subscription.id,
          product: element,
          event: 'Provisioning Product',
        });
      });
      added = added.filter((result) => result !== undefined);

      const subscribed = await this.subscriptionRepo.save(sub);
    }
    return { rem: removed, add: added };
  }

  async provisioningProduct(data: {
    orgid: number;
    subscription_id: number;
    product: string;
    event: string;
  }) {
    const provisionData = await this.provisioningRepo.findOne({
      where: { orgid: data.orgid },
    });

    const eventObject = JSON.stringify({
      eventName: data.event,
      timestamp: new Date(),
      product_name: data.product,
    });

    if (provisionData) {
      //   provisionData.events.push({
      //     eventName: data.event,
      //     timestamp: new Date(),
      //     product_name: data.product,
      //   });

      //   return await this.provisioningRepo.save(provisionData);

      provisionData.events.push(eventObject);
      return await this.provisioningRepo.update(provisionData.id, {
        events: provisionData.events,
      });
    } else {
      const proData: Product_provisioning = new Product_provisioning();
      proData.orgid = data.orgid;
      proData.subscription_id = data.subscription_id;
      proData.events = [eventObject];

      console.log('provisionData:', proData);
      return await this.provisioningRepo.save(proData);
    }
  }
}
