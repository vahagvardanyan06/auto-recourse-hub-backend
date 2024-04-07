import { Exclude } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRoles } from '../enums/Roles.enum';
@Schema()
export class User extends Document {
    @Prop({ required : true })
    @IsNotEmpty({ message : 'Email is required' })
    name : string    

    @Prop()
    @IsNotEmpty({ message : 'Email is required' })
    @IsEmail()
    email : string;
    
    @Exclude()
    @Prop()
    @IsNotEmpty({ message : 'Password is required' })
    @IsString({ message : 'Password must be a string' })
    @MinLength(6)
    password : string
    
    @Prop({ type: [String], enum: UserRoles, default: [UserRoles.User] })
    @IsString()
    roles: UserRoles[];

    @Prop()
    phoneNumber : string

    constructor(partial: Partial<User>) {
        super()
        Object.assign(this, partial);
    }
}
export const UserModel = SchemaFactory.createForClass(User);