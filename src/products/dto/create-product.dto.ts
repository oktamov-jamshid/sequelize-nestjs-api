import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDecimal({ decimal_digits: '10, 2' })
  @IsNotEmpty()
  price: string;

  @IsNumber()
  @IsNotEmpty()
  stock: number; // maxsulot bor yoqligi uchun
}
