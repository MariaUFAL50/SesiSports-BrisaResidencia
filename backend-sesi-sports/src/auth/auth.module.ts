import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DtoModule } from './dto/dto.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt-strategy';
import { IsCpfCnpj } from './validators/is-cpf-cnpj.validator';
import { OutlookStrategy } from './strategies/outlook-strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, IsCpfCnpj, OutlookStrategy],
  exports: [AuthService],
})
export class AuthModule {}
