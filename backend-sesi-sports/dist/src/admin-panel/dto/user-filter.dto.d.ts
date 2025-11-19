import { PaginationDto } from '../../common/pagination';
export declare enum UserType {
    ADMIN = "ADMIN",
    TECNICO = "TECNICO",
    CLIENTE = "CLIENTE"
}
export declare enum UserStatus {
    ATIVO = "ATIVO",
    INATIVO = "INATIVO"
}
export declare class UserFilterDto extends PaginationDto {
    search?: string;
    tipo?: UserType;
    status?: UserStatus;
}
