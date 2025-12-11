
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema()
export class Company {
    @Prop({ type: String, required: true })
    _id: string;

    @Prop({ default: 1 })
    status: number;

    @Prop({ required: true })
    company_name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    mobile: string;

    @Prop()
    website?: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
