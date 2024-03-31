import { IsBoolean, IsNotEmpty, IsOptional, ValidateNested} from "class-validator";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductDescriptionDto } from 'src/dto/product/productDescription.dto';
import { Type } from 'class-transformer';
import { ProductContactInfo } from 'src/dto/product/productContactInfo.dto';
import { ProductNameInfo } from 'src/dto/product/prodcutNameInfo.dto';
import { Category } from './category.entity';
import { CategoryNameInfo } from 'src/dto/category/categoryName.dto';
@Schema()
export class Product extends Document {
  @ValidateNested()
  @Type(() => ProductNameInfo)
  @IsNotEmpty()
  @Prop({ type : ProductNameInfo, required : true })
  product_name : ProductNameInfo;
 
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductDescriptionDto)
  @Prop({ type : Object, required : false })
  description? : ProductDescriptionDto
  
  @Prop({ type : String, required : true })
  price : string

  @Prop([String])
  images : string[]

  @ValidateNested()
  @Type(() => ProductContactInfo)
  @Prop({ type : Object, required : true})
  contactInfo : ProductContactInfo

  @Prop({ type : Boolean, required : true })
  topSale : boolean;

  @Prop({type : CategoryNameInfo})
  categoryNameInfo: CategoryNameInfo;

  @Prop({type : String})
  category_name : string
  
  @Prop({ type: [String] })
  fileNames: string[];

  constructor(partial : Partial<Product>) {
    super()
    Object.assign(this, partial)
  }
}

export const ProductModel = SchemaFactory.createForClass(Product);





