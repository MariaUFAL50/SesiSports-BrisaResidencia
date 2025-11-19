import { TipoUsuario, UserStatus } from '@prisma/client';
export declare class UserProfileDto {
    id: number;
    nome: string;
    email: string;
    tipo: TipoUsuario;
    phoneNumber: string;
    cep: string;
    city: string;
    state: string;
    street: string;
    number?: number;
    complement?: string;
    fotoUrl?: string;
    cpfCnpj: string;
    createdAt: Date;
    updatedAt: Date;
    status: UserStatus;
    outlookId?: string;
}
