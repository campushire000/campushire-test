import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollegeService } from './college.service';
import { CollegeController } from './college.controller';
import { College, CollegeSchema } from './schemas/college.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: College.name, schema: CollegeSchema }])],
  controllers: [CollegeController],
  providers: [CollegeService],
})
export class CollegeModule { }
