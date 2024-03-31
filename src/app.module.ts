import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configService } from './DbConfig/dbConfig';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { User, UserModel } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://geghamsimonyan08:Aphxp4JXBy9RKW03@auto-recourse-hub.uyliisn.mongodb.net/auto-recourse-hub'),
        AuthModule,
        UsersModule,
        ProductModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath : './.env'}),
        CategoryModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}