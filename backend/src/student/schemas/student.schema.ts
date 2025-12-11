
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema()
export class Student {
    @Prop({ type: String, required: true })
    _id: string;

    @Prop({ required: true })
    student_name: string;

    @Prop()
    title: string;

    @Prop()
    gender: string;

    @Prop()
    adhar_no?: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    mobile: string;

    @Prop()
    college_name: string;

    @Prop({ required: true })
    college_id: string;

    @Prop()
    university: string;

    @Prop()
    dateofbirth: string;

    @Prop()
    state: string;

    @Prop()
    city: string;

    @Prop()
    currentlocation: string;

    @Prop()
    pincode: string;

    @Prop()
    about?: string;

    @Prop({ default: true })
    active: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
