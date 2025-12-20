import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { College } from './schemas/college.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('colleges')
@UseGuards(JwtAuthGuard)
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) { }

  @Post()
  async create(@Body() createCollegeDto: CreateCollegeDto): Promise<College> {
    return this.collegeService.create(createCollegeDto);
  }

  @Get()
  async findAll(@Request() req): Promise<College[]> {
    console.log('[DEBUG] CollegeController.findAll User:', req.user);
    return this.collegeService.findAll(req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<College> {
    return this.collegeService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCollegeDto: UpdateCollegeDto): Promise<College> {
    console.log(`[DEBUG] Update College Request - ID: ${id}`, updateCollegeDto);
    return this.collegeService.update(id, updateCollegeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.collegeService.remove(id);
  }
}
