import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRoles } from 'src/enums/Roles.enum';

export class UserUpdateDto {
    @ApiPropertyOptional({ name : 'name', type : String, required : false})
    @IsOptional()
    name? : string

    @ApiPropertyOptional({ name : 'email', type : String, required : false })
    @IsOptional()
    email? : string;

    @ApiPropertyOptional({ name : 'phoneNumber', type : String, required : false })
    @IsOptional()
    phoneNumber? : string

    @ApiPropertyOptional({ name : 'password', type : String, required : false })
    @IsOptional()
    password? : string;


    constructor(partial: Partial<UserUpdateDto>) {
        Object.assign(this, partial);
    }
   
}