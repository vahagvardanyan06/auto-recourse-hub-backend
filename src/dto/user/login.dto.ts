import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty({ name : 'email', type : String})
    @IsNotEmpty({ message: 'Name is required' })
    email : string;

    @ApiProperty({ name : 'password', type : String})
    @IsNotEmpty({ message: 'Password is required' })
    password : string;
}
