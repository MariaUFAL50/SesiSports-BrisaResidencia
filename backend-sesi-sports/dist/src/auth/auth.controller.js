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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const complete_registration_dto_1 = require("./dto/complete-registration.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("@nestjs/passport/dist/auth.guard");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const admin_register_dto_1 = require("./dto/admin-register.dto");
const roles_decorators_1 = require("./decorators/roles.decorators");
const holes_guard_1 = require("./guards/holes.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(data) {
        return this.authService.register(data);
    }
    async login(data) {
        return this.authService.login(data);
    }
    async completeOutlookProfile(req, data) {
        return this.authService.completeProfile(req.user.id, data);
    }
    async adminRegister(data) {
        const { tipo, ...userData } = data;
        return this.authService.register(userData, tipo);
    }
    async outlookAuth(req) {
    }
    async outlookAuthRedirect(req, res) {
        try {
            const result = await this.authService.findOrCreateOutlookUser(req.user);
            return res.send(result);
        }
        catch (error) {
            console.error('Erro no callback do Outlook:', error);
            throw error;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Registra um novo usuário (sempre do tipo CLIENTE)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Patch)('complete-outlook-profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Completa o perfil do usuário especificamente após login com Outlook' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, complete_registration_dto_1.CompleteProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "completeOutlookProfile", null);
__decorate([
    (0, common_1.Post)('admin/register'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, holes_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Cadastra um novo usuário de qualquer tipo (apenas administradores)' }),
    (0, swagger_1.ApiBody)({ type: admin_register_dto_1.AdminRegisterDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_register_dto_1.AdminRegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminRegister", null);
__decorate([
    (0, common_1.Get)('outlook'),
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)('microsoft')),
    (0, swagger_1.ApiOperation)({ summary: 'Inicia o fluxo de login com a Microsoft (Outlook)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "outlookAuth", null);
__decorate([
    (0, common_1.Get)('outlook/callback'),
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)('microsoft')),
    (0, swagger_1.ApiOperation)({ summary: 'Callback da Microsoft após o login' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "outlookAuthRedirect", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map