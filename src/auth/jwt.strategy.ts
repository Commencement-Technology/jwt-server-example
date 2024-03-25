import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtSecret } from '@/auth/auth.module';

/**
 * @description The jwtFromRequest option expects a method that can be used to extract the JWT from the request.
 *              In this case, you will use the standard approach of supplying a bearer token in the Authorization header of our API requests.
 *              The secretOrKey option tells the strategy what secret to use to verify the JWT.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JwtSecret,
    });
  }

  async validate({ userId }: { userId: string }) {
    const user = await this.userService.findOne(userId);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
