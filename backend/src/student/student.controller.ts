import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import type { Student } from './student.interface';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto): Student {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  findAll(): Student[] {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Student {
    return this.studentService.findOne(id);
  }

  @Get('college/:collegeId')
  findByCollegeId(@Param('collegeId') collegeId: string): Student[] {
    return this.studentService.findByCollegeId(collegeId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto): Student {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    return this.studentService.remove(id);
  }
}
