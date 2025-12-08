import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { College } from './college.interface';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CollegeService implements OnModuleInit {
  private colleges: College[] = [];
  private readonly filePath = path.join(__dirname, 'colleges.json');

  onModuleInit() {
    this.loadColleges();
  }

  private loadColleges() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.colleges = JSON.parse(data);
      console.log(`Loaded ${this.colleges.length} colleges from ${this.filePath}`);
    } catch (error) {
      console.error('Error loading colleges.json:', error);
      this.colleges = [];
    }
  }

  findAll(): College[] {
    return this.colleges;
  }

  findOne(id: string): College {
    const college = this.colleges.find((c) => c._id === id);
    if (!college) {
      throw new NotFoundException(`College with ID ${id} not found`);
    }
    return college;
  }

  create(createCollegeDto: CreateCollegeDto): College {
    const newCollege: College = {
      _id: uuidv4(),
      ...createCollegeDto,
    };
    this.colleges.push(newCollege);
    return newCollege;
  }

  update(id: string, updateCollegeDto: UpdateCollegeDto): College {
    const index = this.colleges.findIndex((c) => c._id === id);
    if (index === -1) {
      throw new NotFoundException(`College with ID ${id} not found`);
    }
    const updatedCollege = { ...this.colleges[index], ...updateCollegeDto };
    this.colleges[index] = updatedCollege;
    return updatedCollege;
  }

  remove(id: string): void {
    const index = this.colleges.findIndex((c) => c._id === id);
    if (index === -1) {
      throw new NotFoundException(`College with ID ${id} not found`);
    }
    this.colleges.splice(index, 1);
  }
}
