import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional,ValidateNested } from 'class-validator';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';
import { CategoryNameInfo } from './categoryName.dto';
import { Type } from 'class-transformer';
import { ProductDto } from '../product/product.dto';
import { ImageDto } from '../image/image.dto';
import { FILE } from 'dns';



export class CategoryDto {
  id : string;

  @ApiResponseProperty({ type : String })
  name : String

  @ApiProperty({ name : "category_name" , type : CategoryNameInfo })
  @ValidateNested()
  @Type(() => CategoryNameInfo)
  @IsNotEmpty({ message : "Category name is required "})
  category_name : CategoryNameInfo

  @ApiProperty({ name : 'logo_url', type : FILE})
  @ApiResponseProperty({type : ImageDto })
  logo_url : ImageDto;

  @ApiProperty({ name: "products", type: Product, isArray: true, required: false })
  @IsOptional()
  products?: ProductDto[];

  static convertToDto (categoryEntity : Category, includeProducts : boolean) : CategoryDto {
    const categoryDto = new CategoryDto();
    categoryDto.name = categoryEntity.name;
    categoryDto.category_name = categoryEntity.category_name;
    if (categoryEntity.logo_url && Object.keys(categoryEntity.logo_url).length) {
      categoryDto.logo_url = ImageDto.convertToDto(categoryEntity.logo_url);
    }
    if (includeProducts && categoryEntity.products && categoryEntity.products.length) {
      categoryDto.products = categoryEntity.products.map((each : Product) => {
        return ProductDto.convertToDto(each);
      });
    } 
    categoryDto.id = categoryEntity._id;
    return categoryDto;
  }
}