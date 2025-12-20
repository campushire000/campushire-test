import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { College, CollegeDocument } from './schemas/college.schema';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';

@Injectable()
export class CollegeService {
  constructor(
    @InjectModel(College.name) private collegeModel: Model<CollegeDocument>,
  ) { }

  // --- Mappers ---

  private toDomain(collegeDoc: CollegeDocument): any {
    const doc = collegeDoc.toObject ? collegeDoc.toObject() : collegeDoc;
    return {
      ...doc,
      _id: doc._id.toString(), // Ensure ID is string for frontend
      contact_person_name: doc.contact?.person_name,
      contact_person_email: doc.contact?.person_email,
      contact_person_mobile: doc.contact?.person_mobile,
      address_line: doc.address, // mapping back
      // Keep any other existing fields
    };
  }

  private toPersistenceCreate(dto: CreateCollegeDto): any {
    const { contact_person_name, contact_person_email, contact_person_mobile, address_line, ...rest } = dto as any;
    return {
      ...rest,
      contact: {
        person_name: contact_person_name,
        person_email: contact_person_email,
        person_mobile: contact_person_mobile,
      },
      address: address_line,
      tenant_id: 'default', // Default tenant
    };
  }

  private toPersistenceUpdate(dto: UpdateCollegeDto): any {
    const updateData: any = {};
    const { contact_person_name, contact_person_email, contact_person_mobile, address_line, ...rest } = dto as any;

    // Map regular fields
    Object.assign(updateData, rest);

    // Map aliased fields
    if (address_line !== undefined) updateData.address = address_line;

    // Map nested contact fields using dot notation for partial updates
    if (contact_person_name !== undefined) updateData['contact.person_name'] = contact_person_name;
    if (contact_person_email !== undefined) updateData['contact.person_email'] = contact_person_email;
    if (contact_person_mobile !== undefined) updateData['contact.person_mobile'] = contact_person_mobile;

    return updateData;
  }

  // --- Methods ---

  async findAll(user?: any): Promise<College[]> {
    console.log('[DEBUG] findAll called. User:', user ? JSON.stringify(user) : 'Undefined');
    if (user && (user.role === 'admin' || user.role === 'student')) {
      const colleges = await this.collegeModel.find().exec();
      return colleges.map(c => this.toDomain(c));
    } else if (user && user.role === 'staff') {
      const groups = user.group_ids || [];
      const colleges = await this.collegeModel.find({ _id: { $in: groups } }).exec();
      return colleges.map(c => this.toDomain(c));
    }

    return [];
  }

  async findOne(id: string): Promise<College> {
    const college = await this.collegeModel.findById(id).exec();
    if (!college) {
      throw new NotFoundException(`College with ID ${id} not found`);
    }
    return this.toDomain(college);
  }

  async create(createCollegeDto: CreateCollegeDto): Promise<College> {
    const persistenceData = this.toPersistenceCreate(createCollegeDto);
    const newCollege = new this.collegeModel(persistenceData);
    const saved = await newCollege.save();
    return this.toDomain(saved);
  }

  async update(id: string, updateCollegeDto: UpdateCollegeDto): Promise<College> {
    console.log(`[DEBUG] Service attempting update for ${id}`);
    try {
      // Logic for converting DTO to nested/dot-notation update
      // But first check: did we receive ONLY status?
      // If updateCollegeDto only has 'status', toPersistenceUpdate handles it (copies ...rest).

      const updateData = this.toPersistenceUpdate(updateCollegeDto);
      console.log(`[DEBUG] Update Data (Persistence):`, updateData);

      const updatedCollege = await this.collegeModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).exec();

      if (!updatedCollege) {
        console.warn(`[DEBUG] College not found: ${id}`);
        throw new NotFoundException(`College with ID ${id} not found`);
      }
      console.log(`[DEBUG] Update successful`);
      return this.toDomain(updatedCollege);
    } catch (err) {
      console.error(`[DEBUG] Update failed error:`, err);
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.collegeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`College with ID ${id} not found`);
    }
  }
}
