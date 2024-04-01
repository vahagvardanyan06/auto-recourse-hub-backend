import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/product.entity';
import { CategoryNameInfo } from './categoryName.dto';
import { Type } from 'class-transformer';
import { ProductDto } from '../product/product.dto';



export class CategoryDto {
  id : string;

  @ApiProperty({name : 'name', type : String})
  @IsNotEmpty()
  @IsString()
  name : String

  @ApiProperty({ name : "category_name" , type : CategoryNameInfo })
  @ValidateNested()
  @Type(() => CategoryNameInfo)
  @IsNotEmpty({ message : "Category name is required "})
  category_name : CategoryNameInfo

  @ApiProperty({ name : "logo_url", type : String })
  @IsNotEmpty({ message : "Logo url is required"})
  @IsUrl()
  logo_url : string

  @ApiProperty({ name: "products", type: Product, isArray: true, required: false })
  @IsOptional()
  products?: ProductDto[];

  static convertToDto (categoryEntity : Category, includeProducts : boolean) : CategoryDto {
    const categoryDto = new CategoryDto();
    categoryDto.name = categoryEntity.name;
    categoryDto.category_name = categoryEntity.category_name;
    categoryDto.logo_url = categoryEntity.logo_url;
    if (includeProducts) {
      categoryDto.products = categoryEntity.products.map((each : Product) => {
        return ProductDto.convertToDto(each);
      });
    } 
    categoryDto.id = categoryEntity._id;
    return categoryDto;
  }
}