import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) { }

  async findAll(): Promise<Company[]> {
    return this.companyModel.find().exec();
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyModel.findById(id).exec();
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const newCompany = new this.companyModel({
      _id: uuidv4(),
      ...createCompanyDto,
    });
    return newCompany.save();
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      id,
      updateCompanyDto,
      { new: true }
    ).exec();

    if (!updatedCompany) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return updatedCompany;
  }

  async remove(id: string): Promise<void> {
    const result = await this.companyModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
  }
}
