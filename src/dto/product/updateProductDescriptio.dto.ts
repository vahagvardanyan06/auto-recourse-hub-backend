import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateProductDescriptionDto {
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
