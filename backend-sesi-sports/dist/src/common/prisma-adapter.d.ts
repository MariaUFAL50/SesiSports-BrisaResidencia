export declare const mapUserFromDb: (user: any) => any;
export declare const mapUserToDb: (userData: any) => {
    name: any;
    cpf: any;
    phoneNo: any;
    email: any;
    password: any;
    type: string;
    Address: any;
};
export declare const mapUserTypeToTipoUsuario: (type: string) => string;
export declare const mapTipoUsuarioToUserType: (tipo: string) => string;
