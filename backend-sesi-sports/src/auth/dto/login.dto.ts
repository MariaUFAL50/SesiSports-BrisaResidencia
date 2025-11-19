import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { IsCpfCnpj } from '../validators/is-cpf-cnpj.validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'O CPF/CNPJ não pode estar vazio.' })
  @Validate(IsCpfCnpj)
  cpfCnpj: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  password: string;
}