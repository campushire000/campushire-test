import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

export interface User extends CreateUserDto {
  id: number;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student' },
  ];

  findAll(): User[] {
    return this.users;
  }

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1,
      ...createUserDto,
    };

    this.users.push(newUser);
    return newUser;
  }
}
