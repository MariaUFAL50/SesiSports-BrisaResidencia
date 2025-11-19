import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, Validate, Length, IsInt, Min } from 'class-validator';
import { IsCpfCnpj } from '../../auth/validators/is-cpf-cnpj.validator';
import { IsPhone } from '../../auth/validators/is-phone.validator';
import { IsCep } from '../../auth/validators/is-cep.validator';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fotoUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Validate(IsPhone)
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Validate(IsCep)
  cep?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Length(2, 2)
  state?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  number?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  complement?: string;
}