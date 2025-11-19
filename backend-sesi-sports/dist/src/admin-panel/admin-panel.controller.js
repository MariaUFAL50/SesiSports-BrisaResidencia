"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPanelController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const holes_guard_1 = require("../auth/guards/holes.guard");
const roles_decorators_1 = require("../auth/decorators/roles.decorators");
const admin_panel_service_1 = require("./admin-panel.service");
const user_filter_dto_1 = require("./dto/user-filter.dto");
const update_user_admin_dto_1 = require("./dto/update-user-admin.dto");
const pagination_1 = require("../common/pagination");
let AdminPanelController = class AdminPanelController {
    adminPanelService;
    constructor(adminPanelService) {
        this.adminPanelService = adminPanelService;
    }
    async findAllUsers(filterDto) {
        return this.adminPanelService.findAllUsers(filterDto);
    }
    async findUserById(id) {
        return this.adminPanelService.findUserById(id);
    }
    async updateUser(id, updateUserDto) {
        return this.adminPanelService.updateUser(id, updateUserDto);
    }
};
exports.AdminPanelController = AdminPanelController;
__decorate([
    (0, common_1.Get)('users'),
    (0, roles_decorators_1.Roles)('ADMIN', 'TECNICO'),
    (0, swagger_1.ApiOperation)({
        summary: 'Lista todos os usuários com filtros e paginação',
        description: 'Endpoint restrito a administradores e técnicos. É obrigatório fornecer pelo menos um filtro.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de usuários paginada',
        type: pagination_1.PaginatedResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_filter_dto_1.UserFilterDto]),
    __metadata("design:returntype", Promise)
], AdminPanelController.prototype, "findAllUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, roles_decorators_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtém informações detalhadas de um usuário específico por ID',
        description: 'Endpoint restrito apenas a administradores.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'ID do usuário',
        schema: { type: 'integer' }
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuário não encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdminPanelController.prototype, "findUserById", null);
__decorate([
    (0, common_1.Put)('users/:id'),
    (0, roles_decorators_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({
        summary: 'Atualiza informações de um usuário específico',
        description: 'Endpoint restrito apenas a administradores.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        required: true,
        description: 'ID do usuário',
        schema: { type: 'integer' }
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Dados inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acesso negado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuário não encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflito - Email ou CPF/CNPJ já em uso' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_admin_dto_1.UpdateUserAdminDto]),
    __metadata("design:returntype", Promise)
], AdminPanelController.prototype, "updateUser", null);
exports.AdminPanelController = AdminPanelController = __decorate([
    (0, swagger_1.ApiTags)('Admin Panel'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, holes_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    __metadata("design:paramtypes", [admin_panel_service_1.AdminPanelService])
], AdminPanelController);
//# sourceMappingURL=admin-panel.controller.js.map