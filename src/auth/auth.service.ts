import {
  Body,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { LoginDto } from '@/auth/dto/login-dto';
import { DatabaseService } from '@/database/database.service';
import { JwtSecret } from '@/auth/auth.module';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}
  async login(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() { email, password }: LoginDto,
  ) {
    const user = await this.databaseService.authentication.findUnique({
      where: { email },
    });

    if (!user) throw new NotFoundException(`No user found with email ${email}`);

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) throw new UnauthorizedException('Invalid Password');

    const { id, name, imageUrl } = await this.databaseService.user.findUnique({
      where: { id: user.userId },
    });

    const UserInfo = {
      name,
      imageUrl,
      userId: id,
    };

    const accessToken = this.jwtService.sign(UserInfo, { expiresIn: '2m' });

    const refreshToken = this.jwtService.sign(
      { userId: id },
      { expiresIn: '7d' },
    );

    response
      .cookie('refreshToken', refreshToken, {
        httpOnly: true, // accessible only by the web server
        secure: false, // https
        sameSite: 'strict', // cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, // cookie exprire
      })
      .status(200)
      .send({
        status: true,
        message: 'Login Sucessfully',
        payload: { accessToken },
      });
  }

  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookies = request.cookies;

    if (!cookies?.refreshToken) throw new ForbiddenException();

    const refreshToken = cookies.refreshToken;

    const userInfo = this.jwtService.verify(refreshToken, {
      secret: JwtSecret,
    });

    if (!userInfo) throw new ForbiddenException();

    const { id, name, imageUrl } = await this.databaseService.user.findUnique({
      where: { id: userInfo.userId },
    });

    if (!id) throw new UnauthorizedException();

    const UserInfo = {
      name,
      imageUrl,
      userId: id,
    };

    const accessToken = this.jwtService.sign(UserInfo, { expiresIn: '30s' });

    response.status(200).send({
      status: true,
      message: 'Token Refresh Sucessfully',
      payload: {
        accessToken,
      },
    });
  }

  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookies = request.cookies;

    if (!cookies?.refreshToken) throw new UnauthorizedException();
    response
      .clearCookie('refreshToken', {
        httpOnly: true, // accessible only by the web server
        secure: true, // https
        sameSite: 'strict', // cross-site cookie
      })
      .status(200)
      .send({ status: true, message: 'Logout Successfully', payload: {} });
  }
}
