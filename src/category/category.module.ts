import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategoryModel } from 'src/entities/category.entity';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';
import { User, UserModel } from 'src/entities/user.entity';
import { S3Service } from 'src/s3Service/s3.service';

@Module({
  imports : [
    MongooseModule.forFeature([{ name : Category.name, schema : CategoryModel}, { name : User.name, schema : UserModel}]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService, UserService, S3Service]
})
export class CategoryModule {}
