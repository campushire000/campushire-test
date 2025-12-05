import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CollegeModule } from './college/college.module';
import { StudentModule } from './student/student.module';
import { CompanyModule } from './company/company.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UsersModule, CollegeModule, CompanyModule, StudentModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/crodesk'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
