import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    console.log(`[DEBUG] Validating user: ${email}`);
    const user = await this.usersService.findOne(email);
    console.log(`[DEBUG] User found: ${!!user}`);

    if (user && user.password) {
      if (user.status === false) {
        console.log(`[DEBUG] User is inactive.`);
        throw new UnauthorizedException('User account is inactive');
      }
      console.log(`[DEBUG] Comparing password...`);
      const isMatch = await bcrypt.compare(pass, user.password);
      console.log(`[DEBUG] Password match: ${isMatch}`);
      if (isMatch) {
        const userObj = (user as any).toObject ? (user as any).toObject() : user;
        const { password, ...result } = userObj;
        return result;
      }
    } else {
      console.log(`[DEBUG] User missing or no password.`);
    }
    return null;
  }

  async login(user: any) {
    // If user is a Mongoose document, convert to plain object
    const userObj = user.toObject ? user.toObject() : user;

    if (userObj.status === false || userObj.status === 'false') {
      console.log(`[DEBUG] User is inactive (login check).`);
      throw new UnauthorizedException('User account is inactive');
    }

    const role = userObj.role || 'student';

    const payload = {
      email: userObj.email,
      sub: userObj._id,
      role: role,
      name: userObj.name,
      group_ids: userObj.group_ids
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: userObj._id,
        email: userObj.email,
        name: userObj.name,
        role: role,
        picture: userObj.picture,
        group_ids: userObj.group_ids
      }
    };
  }

  async register(createUserDto: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.usersService.findOne(createUserDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    return this.usersService.create(createUserDto);
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

    const salt = await bcrypt.genSalt();
    foundUser.password = await bcrypt.hash(newPassword, salt);

    await this.usersService.update(foundUser._id, { password: foundUser.password });

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
        role: 'student', // Default role
        createdAt: new Date(),
        group_ids: []
      } as CreateUserDto);
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
        role: 'student', // Default role
        createdAt: new Date(),
        group_ids: []
      } as CreateUserDto);
    }
    return this.login(user);
  }
}
