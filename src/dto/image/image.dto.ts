import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { MImage } from 'src/entities/image.entity';


export class ImageDto {
  @ApiResponseProperty({ type : String})
  id : string


  @ApiResponseProperty({ type : String})
  url : string;


  static convertToDto (imageEntity : MImage) : ImageDto {
    const newImage = new ImageDto();
    newImage.id = imageEntity._id;
    console.log('imageEntity.url', imageEntity.url);
    
    newImage.url = imageEntity.url;

    return newImage;
  }
 }