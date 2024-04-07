import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategoryModel } from '../entities/category.entity';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { User, UserModel } from '../entities/user.entity';
import { S3Service } from '../s3Service/s3.service';
import { ImageService } from '../imageService/image.service';
import { ImageModel, MImage } from '../entities/image.entity';
import { ProductsService } from '../products/products.service';
import { Product, ProductModel } from '../entities/product.entity';

@Module({
  imports : [
    MongooseModule.forFeature([{ name : Category.name, schema : CategoryModel}, { name : User.name, schema : UserModel}, { name : MImage.name, schema : ImageModel}, { name : Product.name, schema : ProductModel}]),
  ],
  controllers: [CategoryController],
  providers: [ProductsService, CategoryService, JwtService, UserService, S3Service, ImageService],
  exports : [CategoryModule]
})
export class CategoryModule {}
