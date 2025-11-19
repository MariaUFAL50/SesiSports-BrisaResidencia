import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        number: number | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        nome: string;
        email: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
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
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        number: number | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        nome: string;
        email: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
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
    updatePhoto(req: any, updatePhotoDto: UpdatePhotoDto): Promise<{
        number: number | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        nome: string;
        email: string;
        tipo: import("@prisma/client").$Enums.TipoUsuario;
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
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
