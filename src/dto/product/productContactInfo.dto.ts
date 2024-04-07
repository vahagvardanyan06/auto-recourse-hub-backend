import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class ProductContactInfo {
  @ApiProperty({ name : "phoneNumber", type : String})
  @IsNotEmpty()
  @IsString()
  phoneNumber : string
  
  @ApiPropertyOptional({ name: 'email', type: String })
  @IsOptional()
  @IsString()
  email?: string

  @ApiProperty({ name : "fullname", type : String})
  @IsNotEmpty()
  @IsString()
  fullname : string
}