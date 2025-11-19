import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CompleteProfileDto } from './dto/complete-registration.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(data: RegisterDto): Promise<{
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
    completeOutlookProfile(req: any, data: CompleteProfileDto): Promise<{
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
    adminRegister(data: AdminRegisterDto): Promise<{
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
    outlookAuth(req: any): Promise<void>;
    outlookAuthRedirect(req: any, res: any): Promise<any>;
}
