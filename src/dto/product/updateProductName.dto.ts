import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';



export class UpdateProductNameDto {
  @ApiPropertyOptional({ name : "am", type : String})
  @IsOptional()
  @IsString()
  am?: string;

  @ApiPropertyOptional({ name : "us", type : String})
  @IsOptional()
  @IsString()
  us?: string;

  @ApiPropertyOptional({ name : "ru", type : String})
  @IsOptional()
  @IsString()
  ru?: string;
}