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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(data, userType = client_1.TipoUsuario.CLIENTE) {
        if (!data.password) {
            throw new common_1.BadRequestException('Senha é obrigatória para registro.');
        }
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    ...(data.cpfCnpj ? [{ cpfCnpj: data.cpfCnpj }] : []),
                ]
            }
        });
        if (existingUser) {
            throw new common_1.ConflictException('E-mail ou CPF/CNPJ já cadastrado.');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const tipo = userType || client_1.TipoUsuario.CLIENTE;
        const newUser = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                tipo: tipo,
            },
        });
        return newUser;
    }
    async login(data) {
        const user = await this.prisma.user.findUnique({
            where: { cpfCnpj: data.cpfCnpj },
        });
        if (!user) {
            throw new common_1.NotFoundException('CPF/CNPJ não encontrado.');
        }
        if (!user.password) {
            throw new common_1.NotFoundException('Dados de login inválidos.');
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.NotFoundException('Dados de login inválidos.');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            tipoUsuario: user.tipo,
            nome: user.nome,
            fotoUrl: user.fotoUrl
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                tipo: user.tipo,
                fotoUrl: user.fotoUrl
            }
        };
    }
    isProfileComplete(user) {
        return !!user.cpfCnpj;
    }
    async completeProfile(userId, data) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        if (!user.outlookId) {
            throw new common_1.BadRequestException('Acesso negado: Este endpoint é exclusivo para usuários que fizeram login via Outlook');
        }
        if (user.cpfCnpj) {
            throw new common_1.ConflictException('Perfil já está completo. Não é possível completar novamente');
        }
        const existingUser = await this.prisma.user.findFirst({
            where: {
                cpfCnpj: data.cpfCnpj,
                NOT: { id: userId }
            }
        });
        if (existingUser) {
            throw new common_1.ConflictException('Este CPF/CNPJ já está em uso por outro usuário');
        }
        try {
            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    cpfCnpj: data.cpfCnpj,
                    phoneNumber: data.phoneNumber,
                    cep: data.cep,
                    city: data.city,
                    state: data.state,
                    street: data.street,
                    number: data.number,
                    complement: data.complement,
                    updatedAt: new Date(),
                },
            });
            const payload = {
                sub: updatedUser.id,
                email: updatedUser.email,
                tipoUsuario: updatedUser.tipo,
                profileComplete: true,
                outlookId: updatedUser.outlookId,
                cpfCnpj: updatedUser.cpfCnpj,
                nome: updatedUser.nome,
                fotoUrl: updatedUser.fotoUrl
            };
            return {
                user: {
                    id: updatedUser.id,
                    nome: updatedUser.nome,
                    email: updatedUser.email,
                    tipo: updatedUser.tipo,
                    fotoUrl: updatedUser.fotoUrl,
                    cpfCnpj: updatedUser.cpfCnpj,
                    phoneNumber: updatedUser.phoneNumber,
                    profileComplete: true
                },
                access_token: this.jwtService.sign(payload),
            };
        }
        catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            throw new Error('Não foi possível atualizar o perfil. Por favor, tente novamente.');
        }
    }
    async findOrCreateOutlookUser(userData) {
        try {
            let user = await this.prisma.user.findUnique({
                where: { outlookId: userData.outlookId },
            });
            if (!user && userData.email) {
                user = await this.prisma.user.findUnique({
                    where: { email: userData.email },
                });
                if (user) {
                    console.log('Usuário encontrado por email, atualizando outlookId');
                    user = await this.prisma.user.update({
                        where: { id: user.id },
                        data: { outlookId: userData.outlookId },
                    });
                }
            }
            if (user) {
                console.log('Usuário do Outlook encontrado, gerando token');
                const isProfileComplete = this.isProfileComplete(user);
                const payload = {
                    sub: user.id,
                    email: user.email,
                    tipoUsuario: user.tipo,
                    profileComplete: isProfileComplete,
                    outlookId: user.outlookId,
                    cpfCnpj: user.cpfCnpj,
                    nome: user.nome,
                    fotoUrl: user.fotoUrl
                };
                return {
                    access_token: this.jwtService.sign(payload),
                    isProfileComplete,
                    user: {
                        id: user.id,
                        nome: user.nome,
                        email: user.email,
                        tipo: user.tipo,
                        fotoUrl: user.fotoUrl,
                        cpfCnpj: user.cpfCnpj
                    }
                };
            }
            const newUser = await this.prisma.user.create({
                data: {
                    outlookId: userData.outlookId,
                    email: userData.email,
                    nome: userData.nome,
                    tipo: client_1.TipoUsuario.CLIENTE,
                    status: 'ATIVO',
                    cpfCnpj: null,
                    phoneNumber: 'TEMP_PHONE',
                    cep: 'TEMP_CEP',
                    city: 'TEMPORARIO',
                    state: 'TMP',
                    street: 'ENDERECO_TEMPORARIO',
                    number: null,
                    complement: 'Aguardando completar perfil',
                },
            });
            const payload = {
                sub: newUser.id,
                email: newUser.email,
                tipoUsuario: newUser.tipo,
                profileComplete: false,
                outlookId: newUser.outlookId,
                cpfCnpj: newUser.cpfCnpj,
                nome: newUser.nome,
                fotoUrl: newUser.fotoUrl
            };
            return {
                access_token: this.jwtService.sign(payload),
                isProfileComplete: false,
                user: {
                    id: newUser.id,
                    nome: newUser.nome,
                    email: newUser.email,
                    tipo: newUser.tipo,
                    fotoUrl: newUser.fotoUrl,
                    cpfCnpj: null
                }
            };
        }
        catch (error) {
            console.error('Erro ao processar autenticação Outlook:', error);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map