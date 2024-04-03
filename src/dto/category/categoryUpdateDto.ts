import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsUrl, IsArray } from 'class-validator';
import { ImageDto } from '../image/image.dto';
import { CategoryNameInfo } from './categoryName.dto';

export class CategoryUpdateDto {
  @ApiPropertyOptional({ name: "category_name", type: CategoryNameInfo, required: false })
  @IsOptional()
  category_name?: CategoryNameInfo;

  @ApiResponseProperty({type : ImageDto })
  logo_url? : ImageDto;
}
