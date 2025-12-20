import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type StudentLanguageDocument = StudentLanguage & Document;

@Schema()
export class LanguageItem {
    @Prop({ required: true })
    language: string;

    @Prop({ required: true })
    proficiency: string;

    @Prop({ required: true, default: false })
    can_read: boolean;

    @Prop({ required: true, default: false })
    can_write: boolean;

    @Prop({ required: true, default: false })
    can_speak: boolean;
}

export const LanguageItemSchema = SchemaFactory.createForClass(LanguageItem);

@Schema({ collection: 'student_languages', timestamps: { createdAt: 'created_at', updatedAt: 'updatedat' } })
export class StudentLanguage {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true })
    student: string;

    @Prop({ type: [LanguageItemSchema], default: [] })
    languages: LanguageItem[];

    @Prop()
    created_at: Date;

    @Prop()
    updatedat: Date;
}

export const StudentLanguageSchema = SchemaFactory.createForClass(StudentLanguage);
