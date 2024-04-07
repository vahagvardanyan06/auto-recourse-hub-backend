import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class MImage extends Document  {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  url: string;
}


export const ImageModel = SchemaFactory.createForClass(MImage);