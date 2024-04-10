import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Product } from './product.entity';
import { Document } from 'mongoose';
import { CategoryNameInfo } from '../dto/category/categoryName.dto';
import { Type } from 'class-transformer';
import { MImage } from './image.entity';

@Schema()
export class Category extends Document {
  @Prop({ type: 'ObjectId', ref: 'MImage' })
  logo_url: MImage;
  
  @ValidateNested()
  @Type(() => CategoryNameInfo)
  @IsNotEmpty()
  @IsString()
  @Prop({ type : Object, required : true })
  category_name : CategoryNameInfo

  @Prop({ type : String, required : true })
  @IsNotEmpty()
  @IsString()
  name : String

  @Prop({ type: [{ type: 'ObjectId', ref: 'Product' }] })     
  products?: Product[];

  constructor(partial : Partial<Product>) {
    super()
    Object.assign(this, partial)
  }
}

export const CategoryModel = SchemaFactory.createForClass(Category);