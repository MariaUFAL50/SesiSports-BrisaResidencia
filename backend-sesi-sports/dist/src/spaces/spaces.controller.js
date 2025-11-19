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
exports.SpacesController = void 0;
const common_1 = require("@nestjs/common");
const spaces_service_1 = require("./spaces.service");
const roles_decorators_1 = require("../auth/decorators/roles.decorators");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const holes_guard_1 = require("../auth/guards/holes.guard");
const client_1 = require("@prisma/client");
const create_space_dto_1 = require("./dto/create-space.dto");
const update_space_dto_1 = require("./dto/update-space.dto");
const swagger_1 = require("@nestjs/swagger");
let SpacesController = class SpacesController {
    spacesService;
    constructor(spacesService) {
        this.spacesService = spacesService;
    }
    async create(body) {
        body = body ?? {};
        const parseField = (field) => {
            if (typeof field === 'string') {
                try {
                    return JSON.parse(field);
                }
                catch {
                    return field;
                }
            }
            return field;
        };
        const trimField = (field) => {
            if (typeof field === 'string')
                return field.trim();
            if (Array.isArray(field))
                return field.map(item => typeof item === 'string' ? item.trim() : item);
            return field;
        };
        const createSpaceDto = {
            ...body,
            spaceType: trimField(parseField(body.spaceType)),
            availableDays: trimField(parseField(body.availableDays)),
            photos: body.photos || [],
            description: body.description ? String(body.description).slice(0, 400) : '',
        };
        if (createSpaceDto.hourPrice !== undefined) {
            if (typeof createSpaceDto.hourPrice === 'string') {
                createSpaceDto.hourPrice = createSpaceDto.hourPrice.trim();
                if (!isNaN(Number(createSpaceDto.hourPrice))) {
                    createSpaceDto.hourPrice = Number(createSpaceDto.hourPrice);
                }
            }
        }
        ['name', 'sportType', 'spaceStatus', 'openingHour', 'closingHour', 'description'].forEach(key => {
            if (typeof createSpaceDto[key] === 'string') {
                createSpaceDto[key] = createSpaceDto[key].trim();
            }
        });
        try {
            return await this.spacesService.create(createSpaceDto);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Erro ao criar espaço: ' + (error?.message || 'Erro desconhecido'));
        }
    }
    findAll() {
        return this.spacesService.findAll();
    }
    async findFiltered(spaceType, sportType) {
        return this.spacesService.findFiltered({ spaceType, sportType });
    }
    findOne(id) {
        return this.spacesService.findOne(+id);
    }
    async update(id, body) {
        const parseField = (field) => {
            if (typeof field === 'string') {
                try {
                    return JSON.parse(field);
                }
                catch {
                    return field;
                }
            }
            return field;
        };
        const trimField = (field) => {
            if (typeof field === 'string')
                return field.trim();
            if (Array.isArray(field))
                return field.map(item => typeof item === 'string' ? item.trim() : item);
            return field;
        };
        const updateSpaceDto = {
            ...body,
            spaceType: trimField(parseField(body?.spaceType)),
            availableDays: trimField(parseField(body?.availableDays)),
            photos: body?.photos || undefined,
            description: body?.description ? String(body.description).slice(0, 400) : undefined,
        };
        if (updateSpaceDto.hourPrice !== undefined) {
            if (typeof updateSpaceDto.hourPrice === 'string') {
                updateSpaceDto.hourPrice = updateSpaceDto.hourPrice.trim();
                if (!isNaN(Number(updateSpaceDto.hourPrice))) {
                    updateSpaceDto.hourPrice = Number(updateSpaceDto.hourPrice);
                }
            }
        }
        ['name', 'sportType', 'spaceStatus', 'openingHour', 'closingHour', 'description'].forEach(key => {
            if (typeof updateSpaceDto[key] === 'string') {
                updateSpaceDto[key] = updateSpaceDto[key].trim();
            }
        });
        try {
            return await this.spacesService.update(+id, updateSpaceDto);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Erro ao atualizar espaço: ' + (error?.message || 'Erro desconhecido'));
        }
    }
    remove(id) {
        return this.spacesService.remove(+id);
    }
};
exports.SpacesController = SpacesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, holes_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)(client_1.TipoUsuario.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_space_dto_1.CreateSpaceDto]),
    __metadata("design:returntype", Promise)
], SpacesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('filter'),
    __param(0, (0, common_1.Query)('spaceType')),
    __param(1, (0, common_1.Query)('sportType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SpacesController.prototype, "findFiltered", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, holes_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)(client_1.TipoUsuario.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_space_dto_1.UpdateSpaceDto]),
    __metadata("design:returntype", Promise)
], SpacesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, holes_guard_1.RolesGuard),
    (0, roles_decorators_1.Roles)(client_1.TipoUsuario.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpacesController.prototype, "remove", null);
exports.SpacesController = SpacesController = __decorate([
    (0, swagger_1.ApiTags)('Spaces'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('spaces'),
    __metadata("design:paramtypes", [spaces_service_1.SpacesService])
], SpacesController);
//# sourceMappingURL=spaces.controller.js.map