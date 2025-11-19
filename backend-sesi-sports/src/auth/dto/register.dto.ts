import { IsString, IsEmail, IsNotEmpty, IsOptional, Validate, IsEnum, IsInt } from 'class-validator';
import { IsCpfCnpj } from '../validators/is-cpf-cnpj.validator';
import { IsPhone } from '../validators/is-phone.validator';
import { IsPassword } from '../validators/is-password.validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsPassword)
  password: string;

  @IsString()
  @Validate(IsCpfCnpj)
    @IsNotEmpty({ message: 'O CPF/CNPJ não pode estar vazio.' })
    cpfCnpj: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsPhone)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  number?: number;
}