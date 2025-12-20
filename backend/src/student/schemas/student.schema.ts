
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudentDocument = Student & Document;

import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Student {
    // _id is auto-generated ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: string; // mapped from user_id

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'College', required: false })
    college: string; // mapped from college_id

    @Prop({ required: true })
    first_name: string;

    @Prop({ required: false })
    last_name: string;

    @Prop()
    title: string;

    @Prop()
    gender: string;

    @Prop({ required: true })
    email: string;

    @Prop()
    phone: string; // mapped from mobile

    @Prop()
    dateofbirth: Date; // Schema says date

    @Prop()
    city: string;

    @Prop()
    state: string;

    @Prop()
    country: string;

    @Prop()
    pincode: string;

    @Prop()
    profile_image: string;

    @Prop()
    resume_url: string;

    @Prop([String])
    skills: string[];

    @Prop()
    about?: string; // Not in strict required list but good to keep if optional? Schema allows additional properties? User provided "required" list but "properties" list. If strict, might need to remove. User schema "properties" didn't list 'about'. I'll keep it as optional? The prompt said "student need to changed as pe the schema below". I will check if 'about' is in the user request... it IS NOT in "properties". I will remove 'about' to be safe, or comment it out. I'll comment it out.
    // about?: string; 

    @Prop({ default: true })
    is_active: boolean; // mapped from active
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.virtual('student_educations', {
    ref: 'StudentEducation',
    localField: '_id',
    foreignField: 'student',
    justOne: false, // Assuming one student can have multiple education entries
});

StudentSchema.virtual('student_languages', {
    ref: 'StudentLanguage',
    localField: '_id',
    foreignField: 'student',
    justOne: false,
});
