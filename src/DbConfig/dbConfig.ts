import { TypeOrmModule } from "@nestjs/typeorm";


export const configService : TypeOrmModule = {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'auto',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};