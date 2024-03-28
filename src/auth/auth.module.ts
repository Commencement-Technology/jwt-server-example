import { Module } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { DatabaseModule } from '@/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { UsersModule } from '@/users/users.module';

export const JwtSecret = '4SLq4Za6bB80jM3lEXmqv9ghgVVR/QB14OMOMof2XEA=';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: JwtSecret,
      signOptions: { expiresIn: '2m' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
