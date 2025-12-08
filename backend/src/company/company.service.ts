import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { Company } from './company.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CompanyService implements OnModuleInit {
  private companies: Company[] = [];
  private readonly filePath = path.join(process.cwd(), 'src/company/company.json');

  onModuleInit() {
    this.loadCompanies();
  }

  private loadCompanies() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.companies = JSON.parse(data);
      console.log(`Loaded ${this.companies.length} companies from ${this.filePath}`);
    } catch (error) {
      console.error('Error loading company.json:', error);
      this.companies = [];
    }
  }

     private saveCompanies() {
      try {
        console.log(`Saving ${this.companies.length} companies to ${this.filePath}`);
        fs.writeFileSync(this.filePath, JSON.stringify(this.companies, null, 2));
        console.log('Companies saved successfully.');
      } catch (error) {
        console.error('Error saving companies.json:', error);
      }
    }

  findAll(): Company[] {
    return this.companies;
  }

  findOne(id: string): Company {
    const company = this.companies.find((c) => c._id === id);
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  create(createCompanyDto: CreateCompanyDto): Company {
    const newCompany: Company = {
      _id: uuidv4(),
      ...createCompanyDto,
    };
    this.companies.push(newCompany);
    this.saveCompanies();
    return newCompany;
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto): Company {
    const index = this.companies.findIndex((c) => c._id === id);
    if (index === -1) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    const updatedCompany = { ...this.companies[index], ...updateCompanyDto };
    this.companies[index] = updatedCompany;
    this.saveCompanies();
    return updatedCompany;
  }

  remove(id: string): void {
    const index = this.companies.findIndex((c) => c._id === id);
    if (index === -1) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    this.companies.splice(index, 1);
    this.saveCompanies();
  }
}
