import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { IsPassword } from '../../auth/validators/is-password.validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Senha atual do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'A senha atual é obrigatória' })
  currentPassword: string;

  @ApiProperty({ description: 'Nova senha do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'A nova senha é obrigatória' })
  @Validate(IsPassword, { 
    message: 'A nova senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número ou caractere especial' 
  })
  newPassword: string;

  @ApiProperty({ description: 'Confirmação da nova senha' })
  @IsString()
  @IsNotEmpty({ message: 'A confirmação da nova senha é obrigatória' })
  confirmPassword: string;
}