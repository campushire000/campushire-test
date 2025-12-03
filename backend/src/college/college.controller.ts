import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import type { College } from './college.interface';

@Controller('colleges')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Post()
  create(@Body() createCollegeDto: CreateCollegeDto): College {
    return this.collegeService.create(createCollegeDto);
  }

  @Get()
  findAll(): College[] {
    return this.collegeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): College {
    return this.collegeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCollegeDto: UpdateCollegeDto): College {
    return this.collegeService.update(id, updateCollegeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    return this.collegeService.remove(id);
  }
}
