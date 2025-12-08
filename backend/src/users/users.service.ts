import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

export interface User extends CreateUserDto {
  _id: string;
  status?: number;
  category?: string;
  reference_id?: string;
  __v?: number;
}

@Injectable()
export class UsersService implements OnModuleInit {
  private users: User[] = [];
  // Adjust path to point to backend/src/user/users.json
  // __dirname is likely dist/users, so we need to go up or find the correct path.
  // The file structure showed backend/src/user/users.json.
  // But the module is in backend/src/users (plural).
  // Let's assume the json is in ../user/users.json relative to this service source,
  // but in dist it might be different.
  // Safest is to use an absolute path or relative to project root if possible,
  // but for now I'll try to locate it relative to the src folder structure.
  // existing student service used path.join(__dirname, 'students.json').
  // I'll assume users.json is in 'src/user/users.json'.
  // If this service is in 'src/users/users.service.ts', then '../user/users.json' is correct.
  // Use process.cwd() to reliably find the file in the project root
  private readonly filePath = path.join(process.cwd(), 'src/users/users.json');

  onModuleInit() {
    this.loadUsers();
  }

  private loadUsers() {
    try {
      console.log(`Attempting to load users from: ${this.filePath}`);
      if (!fs.existsSync(this.filePath)) {
          console.warn(`Users file not found at ${this.filePath}. Starting with empty list.`);
          this.users = [];
          return;
      }
      
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.users = JSON.parse(data);
      console.log(`Successfully loaded ${this.users.length} users.`);
    } catch (error) {
      console.error('Error loading users.json:', error);
      this.users = [];
    }
  }

  private saveUsers() {
    try {
      console.log(`Saving ${this.users.length} users to ${this.filePath}`);
      fs.writeFileSync(this.filePath, JSON.stringify(this.users, null, 2));
      console.log('Users saved successfully.');
    } catch (error) {
      console.error('Error saving users.json:', error);
    }
  }

  findAll(): User[] {
    return this.users;
  }

  async findOne(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email);
    console.log(`[UsersService] findOne(${email}): ${user ? 'Found' : 'Not Found'}`);
    return user;
  }
  
  async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user._id === id);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log(`Creating user: ${createUserDto.email}`);
    const newUser: User = {
      _id: uuidv4(),
      ...createUserDto,
      status: 1,
      role: createUserDto.role || 'student',
      __v: 0
    };

    if (createUserDto.password) {
        const salt = await bcrypt.genSalt();
        newUser.password = await bcrypt.hash(createUserDto.password, salt);
    }

    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  async update(user: User): Promise<User> {
      const index = this.users.findIndex(u => u.email === user.email);
      if (index !== -1) {
          this.users[index] = user;
          this.saveUsers();
          return user;
      }
      throw new NotFoundException('User not found');
  }
}
