import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './schemas/student.schema';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  async findAll(): Promise<Student[]> {
    return this.studentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Student> {
    return this.studentService.findOne(id);
  }

  @Get('college/:collegeId')
  async findByCollegeId(@Param('collegeId') collegeId: string): Promise<Student[]> {
    return this.studentService.findByCollegeId(collegeId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto): Promise<Student> {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.studentService.remove(id);
  }
}
