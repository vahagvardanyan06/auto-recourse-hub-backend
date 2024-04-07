import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from '../strategies/local.strategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RoleGuard } from 'src/guards/role.guard';
import { JwtService } from '@nestjs/jwt';
import { LocalGuard } from 'src/guards/local.guard';

@Module({
  imports : [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync ({
      useFactory : () => ({
          secret : process.env.SECRET_KEY,
      }),
  })
],
  
  providers : [LocalStrategy,LocalGuard, AuthService, RoleGuard, JwtService],
  controllers: [AuthController]
})
export class AuthModule {}
