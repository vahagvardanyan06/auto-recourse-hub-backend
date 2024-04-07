import { IsNotEmpty, IsOptional, ValidateNested} from "class-validator";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductDescriptionDto } from '../dto/product/productDescription.dto';
import { Type } from 'class-transformer';
import { ProductContactInfo } from '../dto/product/productContactInfo.dto';
import { ProductNameInfo } from '../dto/product/prodcutNameInfo.dto';
import { CategoryNameInfo } from '../dto/category/categoryName.dto';
import { MImage } from './image.entity';
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

  @Prop({ type: [{ type: 'ObjectId', ref: 'MImage' }] })
  images? : MImage []

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





