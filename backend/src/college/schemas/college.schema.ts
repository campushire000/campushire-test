
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CollegeDocument = College & Document;

@Schema()
export class College {
    @Prop({ type: String, required: true })
    _id: string;

    @Prop({ default: 1 })
    status: number;

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

    @Prop()
    contact_person_mobile: string;

    @Prop()
    contact_person_email: string;

    @Prop()
    website?: string;

    @Prop()
    contact_person_name?: string;

    @Prop()
    about?: string;

    @Prop()
    address_line?: string;

    @Prop()
    cro_id?: string;
}

export const CollegeSchema = SchemaFactory.createForClass(College);
