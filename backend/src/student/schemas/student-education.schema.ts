import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type StudentEducationDocument = StudentEducation & Document;

@Schema()
export class EducationItem {
    @Prop({ required: true })
    degree: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    end_year: string;

    @Prop({ required: true })
    field_of_study: string;

    @Prop({ required: true })
    grade: string;

    @Prop({ required: true })
    institute_name: string;

    @Prop({ required: true })
    start_year: string;
}

const EducationItemSchema = SchemaFactory.createForClass(EducationItem);

@Schema({ collection: 'student_educations', timestamps: { createdAt: 'created_at', updatedAt: false } }) // JSON schema showed created_at
export class StudentEducation {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true })
    student: string;

    @Prop({ type: [EducationItemSchema], default: [] })
    educations: EducationItem[];

    @Prop()
    created_at: Date;
}

export const StudentEducationSchema = SchemaFactory.createForClass(StudentEducation);
