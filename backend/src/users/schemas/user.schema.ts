
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
    // _id is automatically added by Mongoose, but we need to declare it for TS
    _id: string;

    @Prop()
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    password?: string;

    @Prop({ default: 'student' })
    role?: string;

    @Prop()
    googleId?: string;

    @Prop()
    facebookId?: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }], default: [] })
    group_ids: string[];

    @Prop({ type: mongoose.Schema.Types.Mixed, default: true })
    status: any;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'College' })
    college?: string;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;

    @Prop()
    category?: string;

    @Prop()
    reference_id?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
