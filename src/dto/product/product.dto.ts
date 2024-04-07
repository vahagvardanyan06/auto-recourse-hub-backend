import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Product } from '../../entities/product.entity';
import { ProductDescriptionDto } from './productDescription.dto';
import { Type } from 'class-transformer';
import { ProductContactInfo } from './productContactInfo.dto';
import { ProductNameInfo } from './prodcutNameInfo.dto';
import { CategoryNameInfo } from '../category/categoryName.dto';
import { ImageDto } from '../image/image.dto';


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

  @ApiPropertyOptional({ name: 'images', type: [ImageDto] })
  @IsOptional()
  images?: ImageDto[];

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({ name : "topSale", type : String})
  @IsNotEmpty()
  @IsString()
  topSale : string;
 
  @ApiResponseProperty({ type : CategoryNameInfo })
  category_display_name : CategoryNameInfo;
  
  @ApiResponseProperty({ type : String })
  category_name : string;


  static convertToDto (productEntity : Product) : ProductDto {
    const productDto = new ProductDto();
    productDto.product_name = productEntity.product_name;
    productDto.id = productEntity._id;
    productDto.description = productEntity.description;
    productDto.price = productEntity.price;
    productDto.images = productEntity.images.map(image => ImageDto.convertToDto(image));
    productDto.contactInfo = productEntity.contactInfo;
    productDto.topSale = productEntity.topSale ? "true" : "false";
    productDto.category_display_name = productEntity.categoryNameInfo;
    productDto.category_name = productEntity.category_name;
    return productDto;
  }
}
