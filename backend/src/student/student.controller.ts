import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { Student } from './schemas/student.schema';
import { StudentEducation } from './schemas/student-education.schema';
import { StudentLanguage } from './schemas/student-language.schema';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  async findAll(@Request() req): Promise<Student[]> {
    return this.studentService.findAll(req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Student> {
    return this.studentService.findOne(id);
  }

  @Get('college/:collegeId')
  async findByCollegeId(@Param('collegeId') collegeId: string): Promise<Student[]> {
    return this.studentService.findByCollegeId(collegeId);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Student> {
    return this.studentService.findByUserId(userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto): Promise<Student> {
    return this.studentService.update(id, updateStudentDto);
  }

  @Put(':id/education')
  async updateEducation(@Param('id') id: string, @Body() updateEducationDto: UpdateEducationDto): Promise<StudentEducation> {
    console.log(`UpdateEducation request for Student ID: ${id}`, updateEducationDto);
    return this.studentService.updateEducation(id, updateEducationDto);
  }

  @Delete(':id/education/:eduId')
  async deleteEducation(@Param('id') id: string, @Param('eduId') eduId: string): Promise<StudentEducation> {
    return this.studentService.deleteEducation(id, eduId);
  }

  @Put(':id/education/reorder')
  async reorderEducation(@Param('id') id: string, @Body() educationList: UpdateEducationDto[]): Promise<StudentEducation> {
    return this.studentService.reorderEducation(id, educationList);
  }

  // --- Language Endpoints ---

  @Put(':id/language')
  async updateLanguage(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageDto): Promise<StudentLanguage> {
    return this.studentService.updateLanguage(id, updateLanguageDto);
  }

  @Delete(':id/language/:langId')
  async deleteLanguage(@Param('id') id: string, @Param('langId') langId: string): Promise<StudentLanguage> {
    return this.studentService.deleteLanguage(id, langId);
  }

  @Put(':id/language/reorder')
  async reorderLanguages(@Param('id') id: string, @Body() languageList: UpdateLanguageDto[]): Promise<StudentLanguage> {
    return this.studentService.reorderLanguages(id, languageList);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.studentService.remove(id);
  }
}
