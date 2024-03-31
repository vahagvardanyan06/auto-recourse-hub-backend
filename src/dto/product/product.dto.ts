import { ApiProperty, ApiPropertyOptional, ApiResponseProperty, OmitType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Product } from 'src/entities/product.entity';
import { ProductDescriptionDto } from './productDescription.dto';
import { Type } from 'class-transformer';
import { ProductContactInfo } from './productContactInfo.dto';
import { FILE } from 'dns';
import { File } from 'buffer';
import { ProductNameInfo } from './prodcutNameInfo.dto';
import { Category } from 'src/entities/category.entity';
import { Types } from 'mongoose';
import { CategoryNameInfo } from '../category/categoryName.dto';


export class ProductDto {
  @ApiResponseProperty()
  id : string



  @ApiProperty({ name :  'product_name' , type : ProductNameInfo})
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProductNameInfo)
  @IsNotEmpty({ message : "Category name is required "})
  product_name: ProductNameInfo;

  @ApiProperty({ name :  'price' , type : String})
  @IsNotEmpty()
  @IsString()
  price: string;

  @ApiPropertyOptional({name : 'description', type : ProductDescriptionDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductDescriptionDto)
  description?: ProductDescriptionDto;

  @ApiProperty({name : 'contactInfo', type : ProductContactInfo})
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductContactInfo)
  contactInfo: ProductContactInfo;


  @ApiPropertyOptional( {name : 'images', type : File})
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];


  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({ name : "topSale", type : String})
  @IsNotEmpty()
  @IsString()
  topSale : string;
 
  @ApiResponseProperty({ type : CategoryNameInfo })
  display_name : CategoryNameInfo;
  
  @ApiResponseProperty({ type : String })
  category_name : string;


  static convertToDto (productEntity : Product) : ProductDto {
    const productDto = new ProductDto();
    productDto.product_name = productEntity.product_name;
    productDto.id = productEntity._id;
    productDto.description = productEntity.description;
    productDto.price = productEntity.price;
    productDto.images = productEntity.images;
    productDto.contactInfo = productEntity.contactInfo;
    productDto.topSale = productEntity.topSale ? "true" : "false";
    productDto.display_name = productEntity.categoryNameInfo;
    productDto.category_name = productEntity.category_name;
    return productDto;
  }
}
