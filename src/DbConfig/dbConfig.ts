import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from 'src/entities/user.entity';

export const configService : TypeOrmModule = {
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'auto',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};