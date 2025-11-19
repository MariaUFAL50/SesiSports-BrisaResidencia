import { IsEnum } from 'class-validator';
import { RegisterDto } from './register.dto';
import { TipoUsuario } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AdminRegisterDto extends RegisterDto {
  @ApiProperty({
    description: 'Tipo de usuário a ser criado',
    enum: ['ADMIN', 'TECNICO', 'CLIENTE'],
    default: 'ADMIN'
  })
  @IsEnum(['ADMIN', 'TECNICO', 'CLIENTE'])
  tipo: TipoUsuario = TipoUsuario.ADMIN;
}
