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
exports.AdminPanelService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_1 = require("../common/pagination");
let AdminPanelService = class AdminPanelService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllUsers(filterDto) {
        const { search, tipo, status } = filterDto;
        const where = {};
        if (search) {
            where.OR = [
                { nome: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { cpfCnpj: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (tipo) {
            where.tipo = tipo;
        }
        if (status) {
            where.status = status;
        }
        if (Object.keys(where).length === 0 && !where.OR) {
            return (0, pagination_1.createPaginatedResponse)([], 0, filterDto);
        }
        const orderBy = {};
        if (filterDto.orderBy) {
            orderBy[filterDto.orderBy] = filterDto.orderDirection;
        }
        else {
            orderBy['createdAt'] = 'desc';
        }
        const total = await this.prisma.user.count({ where });
        const users = await this.prisma.user.findMany({
            where,
            select: {
                id: true,
                nome: true,
                email: true,
                tipo: true,
                phoneNumber: true,
                cep: true,
                city: true,
                state: true,
                street: true,
                number: true,
                complement: true,
                fotoUrl: true,
                cpfCnpj: true,
                createdAt: true,
                updatedAt: true,
                outlookId: true,
                status: true,
            },
            skip: filterDto.skip,
            take: filterDto.take,
            orderBy,
        });
        return (0, pagination_1.createPaginatedResponse)(users, total, filterDto);
    }
    async findUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                nome: true,
                email: true,
                tipo: true,
                phoneNumber: true,
                cep: true,
                city: true,
                state: true,
                street: true,
                number: true,
                complement: true,
                fotoUrl: true,
                cpfCnpj: true,
                createdAt: true,
                updatedAt: true,
                outlookId: true,
                status: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuário com ID ${id} não encontrado`);
        }
        return user;
    }
    async updateUser(userId, updateDto) {
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!userExists) {
            throw new common_1.NotFoundException(`Usuário com ID ${userId} não encontrado`);
        }
        if (updateDto.email && updateDto.email !== userExists.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateDto.email },
            });
            if (existingUser && existingUser.id !== userId) {
                throw new common_1.ConflictException('Este email já está em uso por outro usuário');
            }
        }
        if (updateDto.cpfCnpj && updateDto.cpfCnpj !== userExists.cpfCnpj) {
            const existingUserCpfCnpj = await this.prisma.user.findUnique({
                where: { cpfCnpj: updateDto.cpfCnpj },
            });
            if (existingUserCpfCnpj && existingUserCpfCnpj.id !== userId) {
                throw new common_1.ConflictException('Este CPF/CNPJ já está em uso por outro usuário');
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...updateDto,
                updatedAt: new Date(),
            },
            select: {
                id: true,
                nome: true,
                email: true,
                tipo: true,
                phoneNumber: true,
                cep: true,
                city: true,
                state: true,
                street: true,
                number: true,
                complement: true,
                fotoUrl: true,
                cpfCnpj: true,
                createdAt: true,
                updatedAt: true,
                outlookId: true,
                status: true,
            },
        });
        return updatedUser;
    }
};
exports.AdminPanelService = AdminPanelService;
exports.AdminPanelService = AdminPanelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminPanelService);
//# sourceMappingURL=admin-panel.service.js.map