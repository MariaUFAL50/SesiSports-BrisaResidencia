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
exports.CreateSpaceDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
class CreateSpaceDto {
    name;
    description;
    hourPrice;
    spaceType;
    sportType;
    spaceStatus;
    openingHour;
    closingHour;
    availableDays;
    photos;
}
exports.CreateSpaceDto = CreateSpaceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Quadra A - Centro', description: 'Nome do espaço' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpaceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Quadra coberta para futsal', description: 'Descrição do espaço', maxLength: 400 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(400),
    __metadata("design:type", String)
], CreateSpaceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100.0, description: 'Preço por hora em reais' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSpaceDto.prototype, "hourPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.SpaceType, isArray: true, example: [client_1.SpaceType.QUADRA], description: 'Tipo(s) do espaço' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(client_1.SpaceType, { each: true }),
    __metadata("design:type", Array)
], CreateSpaceDto.prototype, "spaceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.SportType, example: client_1.SportType.FUTSAL, description: 'Modalidade esportiva' }),
    (0, class_validator_1.IsEnum)(client_1.SportType),
    __metadata("design:type", String)
], CreateSpaceDto.prototype, "sportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Status, example: client_1.Status.DISPONIVEL, description: 'Status do espaço' }),
    (0, class_validator_1.IsEnum)(client_1.Status),
    __metadata("design:type", String)
], CreateSpaceDto.prototype, "spaceStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '09:00', description: 'Hora de abertura (HH:mm)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpaceDto.prototype, "openingHour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '21:00', description: 'Hora de fechamento (HH:mm)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpaceDto.prototype, "closingHour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.WeekDay, isArray: true, example: [client_1.WeekDay.SEGUNDA, client_1.WeekDay.QUARTA], description: 'Dias da semana em que o espaço está disponível' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(client_1.WeekDay, { each: true }),
    __metadata("design:type", Array)
], CreateSpaceDto.prototype, "availableDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: [String], example: ['https://exemplo.com/foto1.jpg'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMaxSize)(5),
    __metadata("design:type", Array)
], CreateSpaceDto.prototype, "photos", void 0);
//# sourceMappingURL=create-space.dto.js.map