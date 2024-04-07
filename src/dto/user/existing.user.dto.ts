import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';


export class UserDto {
  @ApiResponseProperty({ type : String})
  id : string;

  @ApiResponseProperty({type : String})
  name : string;

  @ApiResponseProperty({ type : String})
  email : string;

  @ApiResponseProperty({ type : String })
  phoneNumber : string;


  static convertToDto (userEntity : User) : UserDto {
    const userDto = new UserDto();
    userDto.id = userEntity._id;
    userDto.email = userEntity.email;
    userDto.name = userEntity.name;
    userDto.phoneNumber = userEntity.phoneNumber;
    return userDto;
  }
}