
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CollegeDocument = College & Document;

import * as mongoose from 'mongoose';

@Schema({ _id: false }) // helper schema
export class Contact {
    @Prop({ required: true })
    person_name: string;

    @Prop({ required: true })
    person_email: string;

    @Prop({ required: true })
    person_mobile: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

@Schema({ timestamps: true }) // Adds createdAt, updatedAt
export class College {
    // _id is auto-generated ObjectId

    @Prop({ type: mongoose.Schema.Types.Mixed, default: true }) // Using Mixed to handle existing numbering safely, logically boolean
    status: any;

    @Prop({ required: true })
    college_name: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    college_type: string;

    @Prop()
    country: string;

    @Prop()
    state: string;

    @Prop()
    city: string;

    @Prop()
    pincode: string;

    @Prop({ type: ContactSchema })
    contact: Contact;

    @Prop()
    phone?: string; // Optional global phone, separate from contact person

    @Prop()
    website?: string;

    @Prop()
    about?: string;

    @Prop()
    address?: string; // Renamed from address_line



    @Prop()
    tenant_id?: string;

    // Explicitly defining timestamps for TS if needed, usually handled by schema options
    createdAt?: Date;
    updatedAt?: Date;
}

export const CollegeSchema = SchemaFactory.createForClass(College);
