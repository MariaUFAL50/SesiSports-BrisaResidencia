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
exports.UpdateUserAdminDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const is_cep_validator_1 = require("../../auth/validators/is-cep.validator");
const is_cpf_cnpj_validator_1 = require("../../auth/validators/is-cpf-cnpj.validator");
var TipoUsuario;
(function (TipoUsuario) {
    TipoUsuario["ADMIN"] = "ADMIN";
    TipoUsuario["TECNICO"] = "TECNICO";
    TipoUsuario["CLIENTE"] = "CLIENTE";
})(TipoUsuario || (TipoUsuario = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ATIVO"] = "ATIVO";
    UserStatus["INATIVO"] = "INATIVO";
})(UserStatus || (UserStatus = {}));
class UpdateUserAdminDto {
    nome;
    email;
    tipo;
    status;
    cpfCnpj;
    phoneNumber;
    cep;
    city;
    state;
    street;
    number;
    complement;
    fotoUrl;
}
exports.UpdateUserAdminDto = UpdateUserAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nome completo do usuário',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Endereço de email do usuário',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de usuário',
        required: false,
        enum: TipoUsuario,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TipoUsuario),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status do usuário',
        required: false,
        enum: UserStatus,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(UserStatus),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CPF ou CNPJ do usuário',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Validate)(is_cpf_cnpj_validator_1.IsCpfCnpj),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "cpfCnpj", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de telefone do usuário',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)('BR'),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CEP',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Validate)(is_cep_validator_1.IsCep),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "cep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cidade',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado (UF)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Rua/Logradouro',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateUserAdminDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Complemento',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "complement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL da foto de perfil',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateUserAdminDto.prototype, "fotoUrl", void 0);
//# sourceMappingURL=update-user-admin.dto.js.map