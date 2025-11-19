import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsInt, IsUrl, Matches, MaxLength, MinLength, Validate } from 'class-validator';
import { IsCep } from '../../auth/validators/is-cep.validator';
import { IsCpfCnpj } from '../../auth/validators/is-cpf-cnpj.validator';

enum TipoUsuario {
  ADMIN = 'ADMIN',
  TECNICO = 'TECNICO',
  CLIENTE = 'CLIENTE',
}

enum UserStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export class UpdateUserAdminDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nome?: string;

  @ApiProperty({
    description: 'Endereço de email do usuário',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Tipo de usuário',
    required: false,
    enum: TipoUsuario,
  })
  @IsOptional()
  @IsEnum(TipoUsuario)
  tipo?: TipoUsuario;

  @ApiProperty({
    description: 'Status do usuário',
    required: false,
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiProperty({
    description: 'CPF ou CNPJ do usuário',
    required: false,
  })
  @IsOptional()
  @Validate(IsCpfCnpj)
  cpfCnpj?: string;

  @ApiProperty({
    description: 'Número de telefone do usuário',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('BR')
  phoneNumber?: string;

  @ApiProperty({
    description: 'CEP',
    required: false,
  })
  @IsOptional()
  @Validate(IsCep)
  cep?: string;

  @ApiProperty({
    description: 'Cidade',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'Estado (UF)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  state?: string;

  @ApiProperty({
    description: 'Rua/Logradouro',
    required: false,
  })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({
    description: 'Número',
    required: false,
  })
  @IsOptional()
  @IsInt()
  number?: number;

  @ApiProperty({
    description: 'Complemento',
    required: false,
  })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({
    description: 'URL da foto de perfil',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  fotoUrl?: string;
}