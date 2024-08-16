import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsCurrency,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreatePaymentSessionDto {
  @IsString()
  orderId: string;

  @IsCurrency()
  currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}

class ItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
