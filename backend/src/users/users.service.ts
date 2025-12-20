import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

import { Student, StudentDocument } from '../student/schemas/student.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) { }

  async findAll(user?: any): Promise<User[]> {
    if (user && user.role === 'admin') {
      return this.userModel.find()
        .populate('group_ids', 'college_name')
        .exec();
    } else if (user && user.role === 'staff') {
      const groups = user.group_ids || [];

      // Find students belonging to these colleges
      const students = await this.studentModel.find({ college: { $in: groups } }).select('user').exec();
      const studentUserIds = students.map(s => s.user);

      return this.userModel.find({
        $or: [
          { group_ids: { $in: groups } }, // Other staff/admins for these groups
          { _id: { $in: studentUserIds } } // Students for these groups
        ]
      })
        .populate('group_ids', 'college_name')
        .exec();
    }
    return [];
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
      ...createUserDto,
      password: hashedPassword,
      status: true,
      role: createUserDto.role || 'student',
      __v: 0
    });
    return createdUser.save();
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    const updated = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }
}
