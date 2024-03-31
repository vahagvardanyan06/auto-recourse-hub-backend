import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';


export class UpdateProductContactInfo {
  @ApiPropertyOptional({ name : "phoneNumber", type : String})
  @IsOptional()
  @IsString()
  phoneNumber? : string


  @ApiPropertyOptional({ name : "email", type : String})
  @IsOptional()
  @IsString()
  email? : string

  @ApiPropertyOptional({ name : "fullname", type : String})
  @IsOptional()
  @IsString()
  fullname? : string
}