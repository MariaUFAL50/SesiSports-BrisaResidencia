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
exports.UserFilterDto = exports.UserStatus = exports.UserType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pagination_1 = require("../../common/pagination");
var UserType;
(function (UserType) {
    UserType["ADMIN"] = "ADMIN";
    UserType["TECNICO"] = "TECNICO";
    UserType["CLIENTE"] = "CLIENTE";
})(UserType || (exports.UserType = UserType = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ATIVO"] = "ATIVO";
    UserStatus["INATIVO"] = "INATIVO";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
class UserFilterDto extends pagination_1.PaginationDto {
    search;
    tipo;
    status;
}
exports.UserFilterDto = UserFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filtro por nome, email ou CPF/CNPJ do usuário',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filtro por tipo de usuário',
        required: false,
        enum: UserType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(UserType, { message: 'Tipo de usuário inválido' }),
    __metadata("design:type", String)
], UserFilterDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filtro por status do usuário',
        required: false,
        enum: UserStatus,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(UserStatus, { message: 'Status de usuário inválido' }),
    __metadata("design:type", String)
], UserFilterDto.prototype, "status", void 0);
//# sourceMappingURL=user-filter.dto.js.map