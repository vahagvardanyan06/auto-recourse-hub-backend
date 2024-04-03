import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ProductDescriptionDto } from './productDescription.dto';
import { ProductContactInfo } from './productContactInfo.dto';
import { UpdateProductDescriptionDto } from './updateProductDescriptio.dto';
import { UpdateProductContactInfo } from './updateProductContactInfo.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductNameInfo } from './prodcutNameInfo.dto';
import { UpdateProductNameDto } from './updateProductName.dto';

export class UpdateProductDto {
  @ApiPropertyOptional({ name : 'product_name', type : UpdateProductNameDto})
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateProductDescriptionDto)
  product_name?: UpdateProductNameDto;

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


  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  imageIds?: string[]; 
}