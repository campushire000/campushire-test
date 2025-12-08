import { Controller, Request, Post, UseGuards, Get, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: any) {
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
  async googleAuth(@Request() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req, @Res() res) {
    const result = await this.authService.googleLogin(req) as any;
    // Redirect to frontend with token
    // Assuming frontend runs on localhost:4200
    // In production, use env var
    if (result && result.access_token) {
        res.redirect(`http://localhost:4200/authentication/login?token=${result.access_token}`);
    } else {
        res.redirect('http://localhost:4200/authentication/login?error=auth_failed');
    }
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Request() req) {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Request() req, @Res() res) {
    const result = await this.authService.facebookLogin(req) as any;
    if (result && result.access_token) {
        res.redirect(`http://localhost:4200/authentication/login?token=${result.access_token}`);
    } else {
        res.redirect('http://localhost:4200/authentication/login?error=auth_failed');
    }
  }
}
