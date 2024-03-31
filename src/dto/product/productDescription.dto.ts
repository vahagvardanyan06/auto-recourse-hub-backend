import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ProductDescriptionDto {
  @ApiProperty({ name : "am", type : String})
  @IsNotEmpty()
  @IsString()
  am: string;

  @ApiProperty({ name : "us", type : String})
  @IsNotEmpty()
  @IsString()
  us: string;

  @ApiProperty({ name : "ru", type : String})
  @IsNotEmpty()
  @IsString()
  ru: string;
}
