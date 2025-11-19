import { Controller, Get, Put, Query, Body, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/holes.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { AdminPanelService } from './admin-panel.service';
import { UserFilterDto } from './dto/user-filter.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { PaginatedResponseDto } from '../common/pagination';

@ApiTags('Admin Panel')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AdminPanelController {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  @Get('users')
  @Roles('ADMIN', 'TECNICO')
  @ApiOperation({ 
    summary: 'Lista todos os usuários com filtros e paginação',
    description: 'Endpoint restrito a administradores e técnicos. É obrigatório fornecer pelo menos um filtro.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários paginada',
    type: PaginatedResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async findAllUsers(@Query() filterDto: UserFilterDto) {
    return this.adminPanelService.findAllUsers(filterDto);
  }

  @Get('users/:id')
  @Roles('ADMIN')
  @ApiOperation({ 
    summary: 'Obtém informações detalhadas de um usuário específico por ID',
    description: 'Endpoint restrito apenas a administradores.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do usuário',
    schema: { type: 'integer' }
  })
  @ApiResponse({
    status: 200,
    description: 'Informações do usuário',
    schema: {
      properties: {
        id: { type: 'number' },
        nome: { type: 'string' },
        email: { type: 'string' },
        tipo: { type: 'string', enum: ['ADMIN', 'TECNICO', 'CLIENTE'] },
        phoneNumber: { type: 'string' },
        cep: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        street: { type: 'string' },
        number: { type: 'number', nullable: true },
        complement: { type: 'string', nullable: true },
        fotoUrl: { type: 'string', nullable: true },
        cpfCnpj: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        outlookId: { type: 'string', nullable: true },
        status: { type: 'string', enum: ['ATIVO', 'INATIVO'] }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.adminPanelService.findUserById(id);
  }

  @Put('users/:id')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Atualiza informações de um usuário específico',
    description: 'Endpoint restrito apenas a administradores.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID do usuário',
    schema: { type: 'integer' }
  })
  @ApiResponse({
    status: 200,
    description: 'Informações do usuário atualizadas',
    schema: {
      properties: {
        id: { type: 'number' },
        nome: { type: 'string' },
        email: { type: 'string' },
        tipo: { type: 'string', enum: ['ADMIN', 'TECNICO', 'CLIENTE'] },
        phoneNumber: { type: 'string' },
        cep: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        street: { type: 'string' },
        number: { type: 'number', nullable: true },
        complement: { type: 'string', nullable: true },
        fotoUrl: { type: 'string', nullable: true },
        cpfCnpj: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        outlookId: { type: 'string', nullable: true },
        status: { type: 'string', enum: ['ATIVO', 'INATIVO'] }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 409, description: 'Conflito - Email ou CPF/CNPJ já em uso' })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserAdminDto
  ) {
    return this.adminPanelService.updateUser(id, updateUserDto);
  }
}