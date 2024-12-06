import {
  IsDecimal,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Min(6)
  @Max(30)
  password: string;

  @IsEnum(['admin', 'worker', 'user'])
  @IsNotEmpty()
  role: 'admin' | 'worker' | 'user';

  // Bu maydon faqat 'admin' yoki 'worker' roli uchun kerak bo'ladi
  @IsDecimal({ decimal_digits: '10, 2' })
  @Min(0) // Oylik musbat bo'lishi kerak
  @IsOptional()
  salary?: number;
}
