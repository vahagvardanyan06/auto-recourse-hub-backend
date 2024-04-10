import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MImage } from '../entities/image.entity';
import { Model } from 'mongoose';
import { S3Service } from '../s3Service/s3.service';
import * as querystring from 'querystring';
import * as path from 'path'

@Injectable()
export class ImageService {
  constructor (
    @InjectModel(MImage.name) private imageModel : Model<MImage>,
    private s3Service : S3Service
  ) {}

  private  findImageWithId (id : string) {
    return  this.imageModel.findById(id);
  }

  async saveImages(imageFile: Express.Multer.File) {
    const encodedFileName = querystring.escape(path.basename(imageFile.originalname));
    const s3Data = await this.s3Service.s3_upload(imageFile.buffer, process.env.BUCKET_NAME, encodedFileName, imageFile.mimetype);
    const newImage = await this.imageModel.create({ fileName: encodedFileName, url: s3Data.Location });
    return await newImage.save();
  }

  async deleteImage (imageId : string) {
    const image =  await this.findImageWithId(imageId);
    if (!image) {
      console.log('no image');
      
      return;
    };
    await this.imageModel.deleteOne({ _id : image._id })
    return await this.s3Service.deleteFIle(process.env.BUCKET_NAME, image.fileName);
  }
}