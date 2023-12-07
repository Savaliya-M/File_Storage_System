import { Controller } from '@nestjs/common';
import { ProvisioningService } from './provisioning.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ProvisioningController {
  constructor(private provisioningService: ProvisioningService) {}

  @MessagePattern('subscribingProducts')
  async subscribeProducts(data: { orgid: number; products: Array<string> }) {
    return this.provisioningService.subscribingProducts(data);
  }

  @MessagePattern('provisioningProducts')
  async provisioningProducts(data: {
    orgid: number;
    subscription_id: number;
    product: string;
    event: string;
  }) {
    return this.provisioningService.provisioningProduct(data);
  }
}
