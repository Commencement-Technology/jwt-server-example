import { Request, Response } from 'express';
import { AuthService } from '@/auth/auth.service';
import { LoginDto } from '@/auth/dto/login-dto';
import { AuthEntity } from '@/auth/entities/auth.entity';
import { JwtAuthGuard } from '@/auth/jwt-auth-guard';
import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOkResponse({ type: AuthEntity })
  @ApiBody({ type: LoginDto })
  login(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto,
  ) {
    return this.authService.login(request, response, loginDto);
  }

  @Get('/refresh')
  @ApiOkResponse({ type: AuthEntity })
  refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshToken(request, response);
  }

  @Post('/logout')
  @ApiOkResponse({ status: '2XX' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(request, response);
  }
}
