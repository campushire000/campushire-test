import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && user.password && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user
    };
  }

  async register(user: any) {
      // Check if user exists
      const existingUser = await this.usersService.findOne(user.email);
      if (existingUser) {
          throw new UnauthorizedException('User already exists');
      }
      return this.usersService.create(user);
  }

  async forgotPassword(email: string) {
      const user = await this.usersService.findOne(email);
      if (!user) {
          throw new NotFoundException('User not found');
      }
      // Generate a fake token
      const token = Math.random().toString(36).substring(7);
      console.log(`[RESET PASSWORD] Token for ${email}: ${token}`);
      return { message: 'Password reset instructions sent to email' };
  }

  async resetPassword(user: any, newPassword: string) {
      const foundUser = await this.usersService.findOne(user.email);
      if (!foundUser) {
          throw new NotFoundException('User not found');
      }
      // In a real app, we would verify the old password or a token here.
      // Since this is an authenticated endpoint (JWT), we assume the user is valid.
      // We need to update the password.
      // Since UsersService.create handles hashing, we might need a specific update method or manually hash here.
      // Let's manually hash for now as UsersService doesn't have an update method exposed yet.
      
      const salt = await bcrypt.genSalt();
      foundUser.password = await bcrypt.hash(newPassword, salt);
      
      // We need to save the user. UsersService needs a save/update method.
      // For now, we can use a workaround if saveUsers is private, but ideally we add an update method.
      // Let's add an update method to UsersService.
      await this.usersService.update(foundUser);

      return { message: 'Password updated successfully' };
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    // Logic to find or create user based on Google profile
    // req.user contains profile info from GoogleStrategy
    let user = await this.usersService.findOne(req.user.email);
    if (!user) {
        user = await this.usersService.create({
            email: req.user.email,
            name: req.user.firstName + ' ' + req.user.lastName,
            googleId: req.user.googleId,
            role: 'student' // Default role
        });
    }
    return this.login(user);
  }

  async facebookLogin(req) {
      if (!req.user) {
          return 'No user from facebook';
      }
      let user = await this.usersService.findOne(req.user.email);
      if (!user) {
          user = await this.usersService.create({
              email: req.user.email,
              name: req.user.firstName + ' ' + req.user.lastName,
              facebookId: req.user.facebookId,
              role: 'student'
          });
      }
      return this.login(user);
  }
}
