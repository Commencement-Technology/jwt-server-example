import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Prisma, Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto
  implements Prisma.UserCreateInput, Prisma.AuthenticationCreateInput
{
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @ApiProperty()
  phoneNumber: string;

  @IsEnum(Role)
  @ApiProperty()
  role?: $Enums.Role;
}
