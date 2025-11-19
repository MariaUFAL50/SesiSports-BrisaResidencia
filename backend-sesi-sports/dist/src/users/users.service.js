"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const pagination_1 = require("../common/pagination");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
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
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        return user;
    }
    async findMe(userId) {
        return this.findById(userId);
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        if (updateProfileDto.email && updateProfileDto.email !== user.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateProfileDto.email },
            });
            if (existingUser && existingUser.id !== userId) {
                throw new common_1.ConflictException('Este email já está em uso por outro usuário');
            }
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...updateProfileDto,
                updatedAt: new Date()
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
    async changePassword(userId, changePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                password: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        if (!user.password) {
            throw new common_1.BadRequestException('Usuário não possui senha definida (login via provedor externo)');
        }
        const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Senha atual incorreta');
        }
        if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
            throw new common_1.BadRequestException('A nova senha e a confirmação não coincidem');
        }
        const isSameAsCurrent = await bcrypt.compare(changePasswordDto.newPassword, user.password);
        if (isSameAsCurrent) {
            throw new common_1.BadRequestException('A nova senha deve ser diferente da senha atual');
        }
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                updatedAt: new Date(),
            },
        });
        return { message: 'Senha alterada com sucesso' };
    }
    async findAll(paginationDto, search) {
        const where = search
            ? {
                OR: [
                    { nome: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { cpfCnpj: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const orderBy = {};
        if (paginationDto.orderBy) {
            orderBy[paginationDto.orderBy] = paginationDto.orderDirection;
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
            skip: paginationDto.skip,
            take: paginationDto.take,
            orderBy,
        });
        return (0, pagination_1.createPaginatedResponse)(users, total, paginationDto);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map