import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema({collection : 'company_list'})
export class Company {

  @Prop({ required: true })
  company_name: string;

  @Prop({ default: '' })
  company_shortname: string;

  @Prop({ default: '' })
  company_code: string;

  @Prop({ default: '' })
  company_type: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: '' })
  website: string;

  @Prop({ default: '' })
  mobile: string;

  @Prop({ default: '' })
  contact_mobile: string;

  @Prop({ default: '' })
  contact_email: string;

  @Prop({ default: '' })
  country: string;

  @Prop({ default: '' })
  state: string;

  @Prop({ default: '' })
  city: string;
}


export const CompanySchema = SchemaFactory.createForClass(Company);
