import { ApiProperty } from '@nestjs/swagger';
import { TipoUsuario, UserStatus } from '@prisma/client';

export class UserProfileDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: TipoUsuario })
  tipo: TipoUsuario;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  cep: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  street: string;

  @ApiProperty({ required: false, nullable: true })
  number?: number;

  @ApiProperty({ required: false, nullable: true })
  complement?: string;

  @ApiProperty({ required: false, nullable: true })
  fotoUrl?: string;

  @ApiProperty()
  cpfCnpj: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty({ required: false, nullable: true })
  outlookId?: string;
}