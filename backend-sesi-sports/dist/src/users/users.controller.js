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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const users_service_1 = require("./users.service");
const user_profile_dto_1 = require("./dto/user-profile.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const update_photo_dto_1 = require("./dto/update-photo.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getProfile(req) {
        return this.usersService.findMe(req.user.id);
    }
    async updateProfile(req, updateProfileDto) {
        return this.usersService.updateProfile(req.user.id, updateProfileDto);
    }
    async updatePhoto(req, updatePhotoDto) {
        return this.usersService.updateProfile(req.user.id, updatePhotoDto);
    }
    async changePassword(req, changePasswordDto) {
        return this.usersService.changePassword(req.user.id, changePasswordDto);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtém os dados do usuário autenticado' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil do usuário obtido com sucesso',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualiza os dados do usuário autenticado' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil do usuário atualizado com sucesso',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Requisição inválida' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email já em uso' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('profile/photo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualiza a foto do perfil do usuário autenticado' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Foto de perfil atualizada com sucesso',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Requisição inválida' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_photo_dto_1.UpdatePhotoDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePhoto", null);
__decorate([
    (0, common_1.Patch)('profile/password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Altera a senha do usuário autenticado' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Senha alterada com sucesso',
        schema: {
            properties: {
                message: {
                    type: 'string',
                    example: 'Senha alterada com sucesso'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Requisição inválida' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Senha atual incorreta' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuário não encontrado' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map