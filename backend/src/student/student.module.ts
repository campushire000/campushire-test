import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student, StudentSchema } from './schemas/student.schema';
import { StudentEducation, StudentEducationSchema } from './schemas/student-education.schema';
import { StudentLanguage, StudentLanguageSchema } from './schemas/student-language.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Student.name, schema: StudentSchema },
    { name: StudentEducation.name, schema: StudentEducationSchema },
    { name: StudentLanguage.name, schema: StudentLanguageSchema }
  ]), UsersModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule { }
