import { IsEmail, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Min(6)
  @Max(30)
  password: string;
}
