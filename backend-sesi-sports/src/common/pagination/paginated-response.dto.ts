import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Lista de itens' })
  items: T[];

  @ApiProperty({ description: 'Total de itens encontrados' })
  @Type(() => Number)
  total: number;

  @ApiProperty({ description: 'Página atual' })
  @Type(() => Number)
  page: number;

  @ApiProperty({ description: 'Número de itens por página' })
  @Type(() => Number)
  limit: number;

  @ApiProperty({ description: 'Total de páginas' })
  @Type(() => Number)
  totalPages: number;

  @ApiProperty({ description: 'Se existe página anterior' })
  hasPreviousPage: boolean;

  @ApiProperty({ description: 'Se existe próxima página' })
  hasNextPage: boolean;
}