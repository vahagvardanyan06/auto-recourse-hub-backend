import { Exclude } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4} from 'uuid'
import { UserRoles } from 'src/enums/Roles.enum';
import { Product } from './product.entity';
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