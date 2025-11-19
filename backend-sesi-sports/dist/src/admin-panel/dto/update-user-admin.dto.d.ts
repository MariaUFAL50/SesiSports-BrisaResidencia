declare enum TipoUsuario {
    ADMIN = "ADMIN",
    TECNICO = "TECNICO",
    CLIENTE = "CLIENTE"
}
declare enum UserStatus {
    ATIVO = "ATIVO",
    INATIVO = "INATIVO"
}
export declare class UpdateUserAdminDto {
    nome?: string;
    email?: string;
    tipo?: TipoUsuario;
    status?: UserStatus;
    cpfCnpj?: string;
    phoneNumber?: string;
    cep?: string;
    city?: string;
    state?: string;
    street?: string;
    number?: number;
    complement?: string;
    fotoUrl?: string;
}
export {};
