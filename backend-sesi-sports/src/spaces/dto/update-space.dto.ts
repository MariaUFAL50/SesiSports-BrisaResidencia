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

export class UpdateSpaceDto {
    @ApiProperty({ required: false, example: 'Quadra A - Centro', description: 'Nome do espaço' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false, example: 'Quadra coberta para futsal', description: 'Descrição do espaço', maxLength: 400 })
    @IsOptional()
    @IsString()
    @MaxLength(400)
    description?: string;

    @ApiProperty({ required: false, example: 100.0, description: 'Preço por hora em reais' })
    @IsOptional()
    @IsNumber()
    hourPrice?: number;

    @ApiProperty({ required: false, enum: SpaceType, isArray: true, example: [SpaceType.QUADRA], description: 'Tipo(s) do espaço' })
    @IsOptional()
    @IsArray()
    @IsEnum(SpaceType, { each: true })
    spaceType?: SpaceType[]; 

    @ApiProperty({ required: false, enum: SportType, example: SportType.FUTSAL, description: 'Modalidade esportiva' })
    @IsOptional()
    @IsEnum(SportType)
    sportType?: SportType;

    @ApiProperty({ required: false, enum: Status, example: Status.DISPONIVEL, description: 'Status do espaço' })
    @IsOptional()
    @IsEnum(Status)
    spaceStatus?: Status;

    @ApiProperty({ required: false, example: '09:00', description: 'Hora de abertura (HH:mm)' })
    @IsOptional()
    @IsString()
    openingHour?: string;

    @ApiProperty({ required: false, example: '21:00', description: 'Hora de fechamento (HH:mm)' })
    @IsOptional()
    @IsString()
    closingHour?: string;

    @ApiProperty({ required: false, enum: WeekDay, isArray: true, example: [WeekDay.SEGUNDA, WeekDay.QUARTA], description: 'Dias da semana em que o espaço está disponível' })
    @IsOptional()
    @IsArray()
    @IsEnum(WeekDay, { each: true })
    availableDays?: WeekDay[];

    @ApiProperty({ required: false, type: [String], example: ['https://exemplo.com/foto1.jpg'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(5)
    photos?: string[];
}
