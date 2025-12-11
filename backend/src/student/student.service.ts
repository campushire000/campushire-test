import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) { }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async findByCollegeId(collegeId: string): Promise<Student[]> {
    return this.studentModel.find({ college_id: collegeId }).exec();
  }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const newStudent = new this.studentModel({
      _id: uuidv4(),
      ...createStudentDto,
      active: createStudentDto.active ?? true,
    });
    return newStudent.save();
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const updatedStudent = await this.studentModel.findByIdAndUpdate(
      id,
      updateStudentDto,
      { new: true }
    ).exec();

    if (!updatedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return updatedStudent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }
}
