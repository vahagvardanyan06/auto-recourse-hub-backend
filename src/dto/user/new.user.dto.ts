import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { User } from '../../entities/user.entity';
import { UserRoles } from '../../enums/Roles.enum';


export class NewUserDto {
    @ApiProperty({ name: 'name', type: String, description: 'User name' })
    @IsNotEmpty({ message: 'Name is required' })
    name : string;

    @ApiProperty({ name: 'email', type: String, description: 'User email address' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: "Please enter a valid email address"})
    email : string;

    @ApiProperty({ name: 'password', type: String, description: 'User password' })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password : string;

    @ApiProperty({ name: 'phoneNumber', type: String, description: 'User phone number' })
    phoneNumber : string;

    
    roles : UserRoles[];
    id : string;

    static convertToDto(userEntity : User) {
        const userDto = new NewUserDto();
        userDto.id = userEntity._id;
        userDto.email = userEntity.email;
        userDto.name = userEntity.name;
        userDto.phoneNumber = userEntity.phoneNumber;
        return userDto;
    }


}