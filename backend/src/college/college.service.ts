import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { College, CollegeDocument } from './schemas/college.schema';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CollegeService {
  constructor(
    @InjectModel(College.name) private collegeModel: Model<CollegeDocument>,
  ) { }

  async findAll(): Promise<College[]> {
    return this.collegeModel.find().exec();
  }

  async findOne(id: string): Promise<College> {
    const college = await this.collegeModel.findById(id).exec();
    if (!college) {
      throw new NotFoundException(`College with ID ${id} not found`);
    }
    return college;
  }

  async create(createCollegeDto: CreateCollegeDto): Promise<College> {
    const newCollege = new this.collegeModel({
      _id: uuidv4(),
      ...createCollegeDto,
    });
    return newCollege.save();
  }

  async update(id: string, updateCollegeDto: UpdateCollegeDto): Promise<College> {
    const updatedCollege = await this.collegeModel.findByIdAndUpdate(
      id,
      updateCollegeDto,
      { new: true }
    ).exec();

    if (!updatedCollege) {
      throw new NotFoundException(`College with ID ${id} not found`);
    }
    return updatedCollege;
  }

  async remove(id: string): Promise<void> {
    const result = await this.collegeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`College with ID ${id} not found`);
    }
  }
}
