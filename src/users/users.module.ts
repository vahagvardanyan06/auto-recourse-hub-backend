import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserModel } from 'src/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.contoller';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from 'src/s3Service/s3.service';

@Module({
  imports : [MongooseModule.forFeature([{ name: User.name, schema: UserModel }])], // Register UserModel],
  providers: [
    UserService,
    JwtService,
    S3Service
  ],
  controllers : [
    UserController,
  ],
  exports : [UserService]
})
export class UsersModule {}
