import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/pagination';

export enum UserType {
  ADMIN = 'ADMIN',
  TECNICO = 'TECNICO',
  CLIENTE = 'CLIENTE',
}

export enum UserStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export class UserFilterDto extends PaginationDto {
  @ApiProperty({
    description: 'Filtro por nome, email ou CPF/CNPJ do usuário',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filtro por tipo de usuário',
    required: false,
    enum: UserType,
  })
  @IsOptional()
  @IsEnum(UserType, { message: 'Tipo de usuário inválido' })
  tipo?: UserType;

  @ApiProperty({
    description: 'Filtro por status do usuário',
    required: false,
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status de usuário inválido' })
  status?: UserStatus;
}