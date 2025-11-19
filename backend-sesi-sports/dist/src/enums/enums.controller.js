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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const enums_service_1 = require("./enums.service");
let EnumsController = class EnumsController {
    enumsService;
    constructor(enumsService) {
        this.enumsService = enumsService;
    }
    getUserTypes() {
        return this.enumsService.getUserTypes();
    }
    getUserStatus() {
        return this.enumsService.getUserStatus();
    }
};
exports.EnumsController = EnumsController;
__decorate([
    (0, common_1.Get)('user-types'),
    (0, swagger_1.ApiOperation)({ summary: 'Retorna todos os tipos de usuário disponíveis' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EnumsController.prototype, "getUserTypes", null);
__decorate([
    (0, common_1.Get)('user-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Retorna todos os status de usuário disponíveis' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EnumsController.prototype, "getUserStatus", null);
exports.EnumsController = EnumsController = __decorate([
    (0, swagger_1.ApiTags)('Enums'),
    (0, common_1.Controller)('enums'),
    __metadata("design:paramtypes", [enums_service_1.EnumsService])
], EnumsController);
//# sourceMappingURL=enums.controller.js.map