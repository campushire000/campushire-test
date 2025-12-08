import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { Student } from './student.interface';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StudentService implements OnModuleInit {
  private students: Student[] = [];
  private readonly filePath = path.join(__dirname, 'students.json');

  onModuleInit() {
    this.loadStudents();
  }

  private loadStudents() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.students = JSON.parse(data);
      console.log(`Loaded ${this.students.length} students from ${this.filePath}`);
    } catch (error) {
      console.error('Error loading students.json:', error);
      this.students = [];
    }
  }

  findAll(): Student[] {
    return this.students;
  }

  findOne(id: string): Student {
    const student = this.students.find((s) => s._id === id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  findByCollegeId(collegeId: string): Student[] {
    return this.students.filter((s) => s.college_id === collegeId);
  }

  create(createStudentDto: CreateStudentDto): Student {
    const newStudent: Student = {
      _id: uuidv4(),
      ...createStudentDto,
      active: createStudentDto.active ?? true,
    };
    this.students.push(newStudent);
    return newStudent;
  }

  update(id: string, updateStudentDto: UpdateStudentDto): Student {
    const index = this.students.findIndex((s) => s._id === id);
    if (index === -1) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    const updatedStudent = { ...this.students[index], ...updateStudentDto };
    this.students[index] = updatedStudent;
    return updatedStudent;
  }

  remove(id: string): void {
    const index = this.students.findIndex((s) => s._id === id);
    if (index === -1) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    this.students.splice(index, 1);
  }
}
