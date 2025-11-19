import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class UpdatePhotoDto {
  @ApiProperty({ description: 'URL da foto do perfil do usuário' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  fotoUrl: string;
}