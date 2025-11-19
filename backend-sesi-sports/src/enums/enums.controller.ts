import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EnumsService } from './enums.service';

@ApiTags('Enums')
@Controller('enums')
export class EnumsController {
  constructor(private readonly enumsService: EnumsService) {}

  @Get('user-types')
  @ApiOperation({ summary: 'Retorna todos os tipos de usuário disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de usuário',
    schema: {
      type: 'object',
      properties: {
        types: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', example: 'ADMIN' },
              label: { type: 'string', example: 'Administrador' },
            },
          },
        },
      },
    },
  })
  getUserTypes() {
    return this.enumsService.getUserTypes();
  }

  @Get('user-status')
  @ApiOperation({ summary: 'Retorna todos os status de usuário disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de status de usuário',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', example: 'ATIVO' },
              label: { type: 'string', example: 'Ativo' },
            },
          },
        },
      },
    },
  })
  getUserStatus() {
    return this.enumsService.getUserStatus();
  }
}