import { RegisterDto } from './register.dto';
import { TipoUsuario } from '@prisma/client';
export declare class AdminRegisterDto extends RegisterDto {
    tipo: TipoUsuario;
}
