import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CompleteProfileDto } from './dto/complete-registration.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TipoUsuario } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
export interface GoogleUser {
    googleId: string;
    nome: string;
    email: string;
    fotoUrl?: string;
}
export interface OutlookUser {
    outlookId: string;
    nome: string;
    email: string;
}
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: RegisterDto, userType?: TipoUsuario): Promise<{
        number: number | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        nome: string;
        email: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
        password: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        cpfCnpj: string | null;
        phoneNumber: string;
        cep: string;
        city: string;
        state: string;
        complement: string | null;
        street: string;
        fotoUrl: string | null;
        outlookId: string | null;
    }>;
    login(data: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            nome: string;
            email: string;
            tipo: import("@prisma/client").$Enums.TipoUsuario;
            fotoUrl: string | null;
        };
    }>;
    private isProfileComplete;
    completeProfile(userId: number, data: CompleteProfileDto): Promise<{
        user: {
            id: number;
            nome: string;
            email: string;
            tipo: import("@prisma/client").$Enums.TipoUsuario;
            fotoUrl: string | null;
            cpfCnpj: string | null;
            phoneNumber: string;
            profileComplete: boolean;
        };
        access_token: string;
    }>;
    findOrCreateOutlookUser(userData: OutlookUser): Promise<{
        access_token: string;
        isProfileComplete: boolean;
        user: {
            id: number;
            nome: string;
            email: string;
            tipo: import("@prisma/client").$Enums.TipoUsuario;
            fotoUrl: string | null;
            cpfCnpj: string | null;
        };
    }>;
}
