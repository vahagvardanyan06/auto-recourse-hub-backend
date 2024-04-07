import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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