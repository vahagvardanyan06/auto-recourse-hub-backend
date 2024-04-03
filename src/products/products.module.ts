import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductModel } from 'src/entities/product.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { User, UserModel } from 'src/entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Category, CategoryModel } from 'src/entities/category.entity';
import { CategoryService } from 'src/category/category.service';
import { S3Service } from 'src/s3Service/s3.service';
import { ImageModel, MImage } from 'src/entities/image.entity';
import { ImageService } from 'src/imageService/image.service';




@Module({
  imports : [
    MongooseModule.forFeature([{ name : Product.name, schema : ProductModel}, { name : User.name, schema : UserModel}, { name : Category.name, schema : CategoryModel}, { name : MImage.name, schema : ImageModel }]),
  ],
  providers : [
    ProductsService,
    JwtService,
    UserService,
    CategoryService,
    S3Service,
    ImageService
  ],
  controllers : [
    ProductsController
  ],
})

export class ProductModule {}