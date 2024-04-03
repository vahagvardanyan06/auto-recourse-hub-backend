import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategoryModel } from 'src/entities/category.entity';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { User, UserModel } from 'src/entities/user.entity';
import { S3Service } from 'src/s3Service/s3.service';
import { ImageService } from 'src/imageService/image.service';
import { ImageModel, MImage } from 'src/entities/image.entity';
import { ProductsService } from 'src/products/products.service';
import { Product, ProductModel } from 'src/entities/product.entity';
import { ProductModule } from 'src/products/products.module';

@Module({
  imports : [
    MongooseModule.forFeature([{ name : Category.name, schema : CategoryModel}, { name : User.name, schema : UserModel}, { name : MImage.name, schema : ImageModel}, { name : Product.name, schema : ProductModel}]),
  ],
  controllers: [CategoryController],
  providers: [ProductsService, CategoryService, JwtService, UserService, S3Service, ImageService]
})
export class CategoryModule {}
