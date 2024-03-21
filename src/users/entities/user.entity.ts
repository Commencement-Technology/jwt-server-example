import { ApiProperty } from '@nestjs/swagger';
import { User, Authentication, $Enums } from '@prisma/client';

export class UserEntity implements User, Authentication {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  role: $Enums.Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  authenticationId: string;

  password: string;

  userId: string;
}
