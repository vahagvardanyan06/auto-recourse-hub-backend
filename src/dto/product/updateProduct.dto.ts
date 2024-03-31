import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { ProductDescriptionDto } from './productDescription.dto';
import { ProductContactInfo } from './productContactInfo.dto';
import { UpdateProductDescriptionDto } from './updateProductDescriptio.dto';
import { UpdateProductContactInfo } from './updateProductContactInfo.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  
  @ApiPropertyOptional({ name : 'product_name', type : String})
  @IsOptional()
  @IsString()
  product_name?: string;

  @ApiPropertyOptional({ name : 'description', type : UpdateProductDescriptionDto})
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateProductDescriptionDto)
  description?: UpdateProductDescriptionDto;

  @ApiPropertyOptional({ name : 'price', type : String})

  @IsOptional()
  @IsString()
  price? : string;


  @ApiPropertyOptional({ name : 'contactInfo', type : UpdateProductContactInfo})
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductContactInfo)
  contactInfo?: UpdateProductContactInfo;

  
  @ApiPropertyOptional({ name : 'topSale', type : String})
  @IsOptional()
  @IsString()
  topSale? : string;
}