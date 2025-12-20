import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentEducation, StudentEducationDocument } from './schemas/student-education.schema';
import { UpdateEducationDto } from './dto/update-education.dto';
import { StudentLanguage, StudentLanguageDocument } from './schemas/student-language.schema';
import { UpdateLanguageDto } from './dto/update-language.dto';

import { UsersService } from '../users/users.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(StudentEducation.name) private studentEducationModel: Model<StudentEducationDocument>,
    @InjectModel(StudentLanguage.name) private studentLanguageModel: Model<StudentLanguageDocument>,
    private usersService: UsersService
  ) { }

  // --- Mappers ---

  private toDomain(studentDoc: any): any {
    const doc = studentDoc.toObject ? studentDoc.toObject() : studentDoc;
    return {
      ...doc,
      _id: doc._id.toString(),
      student_name: doc.first_name && doc.last_name ? `${doc.first_name} ${doc.last_name}` : doc.first_name || '',
      college_id: doc.college?._id?.toString() || doc.college?.toString(),
      college_name: doc.college?.college_name || '', // Requires population
      user_id: doc.user?._id?.toString() || doc.user?.toString(),
      user_name: doc.user?.name || '',
      user_email: doc.user?.email || '',
      mobile: doc.phone,
      active: doc.is_active,
      dateofbirth: doc.dateofbirth ? new Date(doc.dateofbirth).toISOString().split('T')[0] : '', // Format to YYYY-MM-DD
      // Map populated education. Assuming virtual returns an array (default) or single object depending on configuration.
      // If justOne: false (default), it's an array. The User Schema implies one doc with 'educations' array.
      // So we likely get [ { educations: [...] } ].
      educations: doc.student_educations && doc.student_educations.length > 0
        ? doc.student_educations[0].educations
        : [],
      languages: doc.student_languages && doc.student_languages.length > 0
        ? doc.student_languages[0].languages
        : [],
    };
  }

  private toPersistence(dto: any): any {
    const { student_name, college_id, user_id, mobile, active, dateofbirth, ...rest } = dto;

    let first_name = '';
    let last_name = '';
    if (student_name) {
      const parts = student_name.trim().split(' ');
      first_name = parts[0];
      last_name = parts.slice(1).join(' ') || '';
    }

    return {
      ...rest,
      first_name,
      last_name,
      college: college_id, // Assuming ID passed
      user: user_id, // Assuming ID passed
      phone: mobile,
      is_active: active === undefined ? true : active, // Default true
      dateofbirth: dateofbirth ? new Date(dateofbirth) : undefined,
    };
  }

  // --- Methods ---

  async findAll(user?: any): Promise<Student[]> {
    if (user && user.role === 'admin') {
      const students = await this.studentModel.find().populate('college').exec();
      return students.map(s => this.toDomain(s));
    } else if (user && user.role === 'staff') {
      const groups = user.group_ids || [];
      const students = await this.studentModel.find({ college: { $in: groups } }).populate('college').exec();
      return students.map(s => this.toDomain(s));
    }

    return [];
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).populate('college').exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return this.toDomain(student);
  }

  async findByCollegeId(collegeId: string): Promise<Student[]> {
    const students = await this.studentModel.find({ college: collegeId }).populate('college').exec();
    return students.map(s => this.toDomain(s));
  }

  async findByUserId(userId: string): Promise<Student> {
    const student = await this.studentModel.findOne({ user: userId })
      .populate('user', 'name email role')
      .populate('college', 'college_name city state')
      .populate('student_educations') // TODO: Define Virtuals in Schema
      .populate('student_languages')
      .lean()
      .exec();

    if (!student) {
      throw new NotFoundException(`Student with User ID ${userId} not found`);
    }

    return this.toDomain(student);
  }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const persistenceData = this.toPersistence(createStudentDto);
    const newStudent = new this.studentModel(persistenceData);
    const saved = await newStudent.save();

    // Sync college to User record
    if (saved.user && saved.college) {
      const collegeId = (saved.college as any)._id || saved.college;
      await this.usersService.update(saved.user as string, { college: collegeId });
    }

    // Re-fetch to populate if needed, or just return mapped
    return this.toDomain(saved);
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const updateData = this.toPersistence(updateStudentDto);
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedStudent = await this.studentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('college').exec();

    if (!updatedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // Sync college to User record
    if (updatedStudent.user && updatedStudent.college) {
      const collegeId = (updatedStudent.college as any)._id || updatedStudent.college;
      await this.usersService.update(updatedStudent.user as string, { college: collegeId });
    }

    return this.toDomain(updatedStudent);
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }

  async updateEducation(studentId: string, educationDto: UpdateEducationDto): Promise<StudentEducation> {
    // Find the student education document
    let studentEducation = await this.studentEducationModel.findOne({ student: studentId }).exec();

    if (!studentEducation) {
      // Create new if not exists
      studentEducation = new this.studentEducationModel({ student: studentId, educations: [] });
    }

    if (educationDto._id) {
      // Update existing item
      const existingIndex = studentEducation.educations.findIndex(e => (e as any)._id.toString() === educationDto._id);
      if (existingIndex > -1) {
        // Update fields
        studentEducation.educations[existingIndex].degree = educationDto.degree;
        studentEducation.educations[existingIndex].institute_name = educationDto.institute_name;
        studentEducation.educations[existingIndex].field_of_study = educationDto.field_of_study;
        studentEducation.educations[existingIndex].start_year = educationDto.start_year;
        studentEducation.educations[existingIndex].end_year = educationDto.end_year;
        studentEducation.educations[existingIndex].grade = educationDto.grade;
        studentEducation.educations[existingIndex].description = educationDto.description || '';
      } else {
        throw new NotFoundException(`Education item with ID ${educationDto._id} not found`);
      }
    } else {
      // Add new item
      studentEducation.educations.push({ ...educationDto, description: educationDto.description || '' });
    }

    return studentEducation.save();
  }

  async deleteEducation(studentId: string, educationId: string): Promise<StudentEducation> {
    const studentEducation = await this.studentEducationModel.findOne({ student: studentId }).exec();
    if (!studentEducation) {
      throw new NotFoundException(`Student education not found`);
    }

    const initialLength = studentEducation.educations.length;
    studentEducation.educations = studentEducation.educations.filter(e => (e as any)._id.toString() !== educationId);

    if (studentEducation.educations.length === initialLength) {
      throw new NotFoundException(`Education item with ID ${educationId} not found`);
    }

    return studentEducation.save();
  }

  async reorderEducation(studentId: string, educationList: UpdateEducationDto[]): Promise<StudentEducation> {
    let studentEducation = await this.studentEducationModel.findOne({ student: studentId }).exec();
    if (!studentEducation) {
      studentEducation = new this.studentEducationModel({ student: studentId, educations: [] });
    }

    // We assume the list contains full objects. We replace the current list.
    // Mongoose schemas might need casting if DTO doesn't match exactly, but spreading should work for basic fields.
    // Also need to ensure _id is preserved if passed, or handled correctly.
    // The frontend will send the reordered list of objects.
    studentEducation.educations = educationList as any; // Cast to bypass strict type checks for now, relying on schema validation on save.

    return studentEducation.save();
  }

  // --- Language Methods ---

  async updateLanguage(studentId: string, languageDto: UpdateLanguageDto): Promise<StudentLanguage> {
    let studentLanguage = await this.studentLanguageModel.findOne({ student: studentId }).exec();

    if (!studentLanguage) {
      studentLanguage = new this.studentLanguageModel({ student: studentId, languages: [] });
    }

    if (languageDto._id) {
      // Update existing
      const existingIndex = studentLanguage.languages.findIndex(l => (l as any)._id.toString() === languageDto._id);
      if (existingIndex > -1) {
        studentLanguage.languages[existingIndex].language = languageDto.language;
        studentLanguage.languages[existingIndex].proficiency = languageDto.proficiency;
        studentLanguage.languages[existingIndex].can_read = languageDto.can_read;
        studentLanguage.languages[existingIndex].can_write = languageDto.can_write;
        studentLanguage.languages[existingIndex].can_speak = languageDto.can_speak;
      } else {
        throw new NotFoundException(`Language item with ID ${languageDto._id} not found`);
      }
    } else {
      // Add new
      studentLanguage.languages.push({ ...languageDto });
    }

    return studentLanguage.save();
  }

  async deleteLanguage(studentId: string, languageId: string): Promise<StudentLanguage> {
    const studentLanguage = await this.studentLanguageModel.findOne({ student: studentId }).exec();
    if (!studentLanguage) {
      throw new NotFoundException(`Student language not found`);
    }

    const initialLength = studentLanguage.languages.length;
    studentLanguage.languages = studentLanguage.languages.filter(l => (l as any)._id.toString() !== languageId);

    if (studentLanguage.languages.length === initialLength) {
      throw new NotFoundException(`Language item with ID ${languageId} not found`);
    }

    return studentLanguage.save();
  }

  async reorderLanguages(studentId: string, languageList: UpdateLanguageDto[]): Promise<StudentLanguage> {
    let studentLanguage = await this.studentLanguageModel.findOne({ student: studentId }).exec();
    if (!studentLanguage) {
      studentLanguage = new this.studentLanguageModel({ student: studentId, languages: [] });
    }

    studentLanguage.languages = languageList as any;
    return studentLanguage.save();
  }
}
