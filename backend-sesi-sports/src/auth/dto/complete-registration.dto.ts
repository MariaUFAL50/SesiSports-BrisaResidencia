import { IsString, IsNotEmpty, IsOptional, Validate, IsInt, Min, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCpfCnpj } from '../validators/is-cpf-cnpj.validator';
import { IsPhone } from '../validators/is-phone.validator';
import { IsCep } from '../validators/is-cep.validator';
import { Type } from 'class-transformer';

export class CompleteProfileDto {
  @IsString()
  @IsNotEmpty()
  @Validate(IsCpfCnpj)
  cpfCnpj: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsPhone)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsCep)
  cep: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  state: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  number: number;

  @IsString()
  @IsOptional()
  complement?: string;
}