import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { College } from './schemas/college.schema';

@Controller('colleges')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) { }

  @Post()
  async create(@Body() createCollegeDto: CreateCollegeDto): Promise<College> {
    return this.collegeService.create(createCollegeDto);
  }

  @Get()
  async findAll(): Promise<College[]> {
    return this.collegeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<College> {
    return this.collegeService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCollegeDto: UpdateCollegeDto): Promise<College> {
    return this.collegeService.update(id, updateCollegeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.collegeService.remove(id);
  }
}
