import { IsNotEmpty, IsNumber } from 'class-validator';

export class provisioningProductDto {
  @IsNumber()
  orgid: number;

  @IsNotEmpty()
  products: [];
}
