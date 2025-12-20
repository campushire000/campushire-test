import { Controller, Request, Post, UseGuards, Get, Body, Res, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reset-password')
  async resetPassword(@Request() req, @Body('password') password: string) {
    return this.authService.resetPassword(req.user, password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req, @Res() res) {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:4200';

    try {
      const result = await this.authService.googleLogin(req) as any;

      if (result && result.access_token) {
        const name = result.user ? encodeURIComponent(result.user.name) : 'User';
        res.redirect(`${frontendUrl}/authentication/login?token=${result.access_token}&name=${name}`);
      } else {
        res.redirect(`${frontendUrl}/authentication/login?error=auth_failed`);
      }
    } catch (err: any) {
      if (err.message === 'User account is inactive') {
        res.redirect(`${frontendUrl}/authentication/login?error=inactive`);
      } else {
        res.redirect(`${frontendUrl}/authentication/login?error=auth_failed`);
      }
    }
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Request() req) { }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Request() req, @Res() res) {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:4200';

    try {
      const result = await this.authService.facebookLogin(req) as any;

      if (result && result.access_token) {
        const name = result.user ? encodeURIComponent(result.user.name) : 'User';
        res.redirect(`${frontendUrl}/authentication/login?token=${result.access_token}&name=${name}`);
      } else {
        res.redirect(`${frontendUrl}/authentication/login?error=auth_failed`);
      }
    } catch (err: any) {
      if (err.message === 'User account is inactive') {
        res.redirect(`${frontendUrl}/authentication/login?error=inactive`);
      } else {
        res.redirect(`${frontendUrl}/authentication/login?error=auth_failed`);
      }
    }
  }
}
