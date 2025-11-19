import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ArrayMaxSize,
  IsOptional,
  MaxLength,
} from 'class-validator';
import {
  Status,
  SpaceType,
  SportType,
  WeekDay,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpaceDto {
  @ApiProperty({ example: 'Quadra A - Centro', description: 'Nome do espaço' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Quadra coberta para futsal', description: 'Descrição do espaço', maxLength: 400 })
  @IsString()
  @MaxLength(400)
  description: string;

  @ApiProperty({ example: 100.0, description: 'Preço por hora em reais' })
  @IsNumber()
  hourPrice: number;

  @ApiProperty({ enum: SpaceType, isArray: true, example: [SpaceType.QUADRA], description: 'Tipo(s) do espaço' })
  @IsArray()
  @IsEnum(SpaceType, { each: true })
  spaceType: SpaceType[]; 

  @ApiProperty({ enum: SportType, example: SportType.FUTSAL, description: 'Modalidade esportiva' })
  @IsEnum(SportType)
  sportType: SportType;

  @ApiProperty({ enum: Status, example: Status.DISPONIVEL, description: 'Status do espaço' })
  @IsEnum(Status)
  spaceStatus: Status;

  @ApiProperty({ example: '09:00', description: 'Hora de abertura (HH:mm)' })
  @IsString()
  openingHour: string;

  @ApiProperty({ example: '21:00', description: 'Hora de fechamento (HH:mm)' })
  @IsString()
  closingHour: string;

  @ApiProperty({ enum: WeekDay, isArray: true, example: [WeekDay.SEGUNDA, WeekDay.QUARTA], description: 'Dias da semana em que o espaço está disponível' })
  @IsArray()
  @IsEnum(WeekDay, { each: true })
  availableDays: WeekDay[];

  @ApiProperty({ required: false, type: [String], example: ['https://exemplo.com/foto1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  photos?: string[];
}
