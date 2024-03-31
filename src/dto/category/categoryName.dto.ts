import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';



export class CategoryNameInfo {
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
  
  constructor(partial : Partial<CategoryNameInfo>) {
    Object.assign(this, partial)
  }

}