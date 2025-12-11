import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    return user || undefined;
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.userModel.findById(id).exec();
    return user || undefined;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log(`Creating user: ${createUserDto.email}`);
    const salt = await bcrypt.genSalt();
    const hashedPassword = createUserDto.password ? await bcrypt.hash(createUserDto.password, salt) : undefined;

    const createdUser = new this.userModel({
      _id: uuidv4(),
      ...createUserDto,
      password: hashedPassword,
      status: 1,
      role: createUserDto.role || 'student',
      __v: 0
    });
    return createdUser.save();
  }

  async update(user: any): Promise<User> {
    // Assuming user object has _id or email to identify
    // If user is Mongoose Document, we can use save, but here we likely receive a plain object or DTO
    const filter = user._id ? { _id: user._id } : { email: user.email };
    const updated = await this.userModel.findOneAndUpdate(filter, user, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }
}
