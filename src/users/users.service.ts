import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '@/database/database.service';

const SALT_ROUND = 10;

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createUserDto: CreateUserDto) {
    const { email, name, password, phoneNumber, role } = createUserDto;

    const hashPassword = await bcrypt.hash(password, SALT_ROUND);

    return await this.databaseService.user.create({
      data: {
        name,
        phoneNumber,
        authentication: { create: { email, password: hashPassword, role } },
      },
    });
  }

  async findAll() {
    const users = await this.databaseService.user.findMany({
      include: { authentication: { select: { email: true, role: true } } },
    });

    const normalizeUser = users.map((user) => {
      const { authentication, ...rest } = user;
      return { ...rest, ...authentication };
    });

    return normalizeUser;
  }

  async findOne(id: string) {
    return await this.databaseService.user.findUnique({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        SALT_ROUND,
      );
    }

    return await this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return await this.databaseService.user.delete({
      where: { id },
    });
  }
}
