import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsUrl } from 'class-validator';

export class CategoryUpdateDto {
  @ApiPropertyOptional({ name: "category_name", type: String, required: false })
  @IsOptional()
  category_name?: string;

  @ApiPropertyOptional({ name: "logo_url", type: String, required: false })
  @IsOptional()
  logo_url?: string;
}
