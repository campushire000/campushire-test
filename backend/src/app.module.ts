// /backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CollegeModule } from './college/college.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule, CollegeModule, StudentModule, AuthModule, CompanyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
