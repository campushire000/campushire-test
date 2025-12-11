
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ type: String, required: true })
    _id: string;

    @Prop()
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    password?: string;

    @Prop()
    role?: string;

    @Prop()
    googleId?: string;

    @Prop()
    facebookId?: string;

    @Prop({ default: 1 })
    status: number;

    @Prop()
    category?: string;

    @Prop()
    reference_id?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
