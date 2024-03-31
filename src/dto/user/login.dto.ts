import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty({ name : 'email', type : String})
    @IsNotEmpty({ message: 'Name is required' })
    @IsEmail({}, { message : "Enter a correct email address"})
    email : string;

    @ApiProperty({ name : 'password', type : String})
    @IsNotEmpty({ message: 'Password is required' })
    password : string;
}
