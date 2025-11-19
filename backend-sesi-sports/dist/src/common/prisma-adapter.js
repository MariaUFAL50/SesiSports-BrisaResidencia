"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapTipoUsuarioToUserType = exports.mapUserTypeToTipoUsuario = exports.mapUserToDb = exports.mapUserFromDb = void 0;
const mapUserFromDb = (user) => {
    if (!user)
        return null;
    return {
        ...user,
        nome: user.name,
        cpfCnpj: user.cpf,
        phoneNumber: user.phoneNo,
        tipo: (0, exports.mapUserTypeToTipoUsuario)(user.type),
        fotoUrl: null,
        outlookId: null,
        status: 'ATIVO',
        city: user.Address?.complement || '',
        state: '',
        street: user.Address?.street || '',
        number: user.Address?.number ? parseInt(user.Address.number) : null,
        complement: user.Address?.complement || null,
        cep: user.Address?.cep || '',
    };
};
exports.mapUserFromDb = mapUserFromDb;
const mapUserToDb = (userData) => {
    return {
        name: userData.nome || userData.name,
        cpf: userData.cpfCnpj || userData.cpf,
        phoneNo: userData.phoneNumber || userData.phoneNo,
        email: userData.email,
        password: userData.password,
        type: (0, exports.mapTipoUsuarioToUserType)(userData.tipo || userData.type),
        Address: userData.Address || {
            create: {
                cep: userData.cep || '',
                street: userData.street || '',
                number: userData.number?.toString() || '',
                complement: userData.complement || null,
            }
        }
    };
};
exports.mapUserToDb = mapUserToDb;
const mapUserTypeToTipoUsuario = (type) => {
    const mapping = {
        'CLIENT': 'CLIENTE',
        'TECHNICIAN': 'TECNICO',
        'ADMINISTRATOR': 'ADMIN',
    };
    return mapping[type] || type;
};
exports.mapUserTypeToTipoUsuario = mapUserTypeToTipoUsuario;
const mapTipoUsuarioToUserType = (tipo) => {
    const mapping = {
        'CLIENTE': 'CLIENT',
        'TECNICO': 'TECHNICIAN',
        'ADMIN': 'ADMINISTRATOR',
    };
    return mapping[tipo] || tipo;
};
exports.mapTipoUsuarioToUserType = mapTipoUsuarioToUserType;
//# sourceMappingURL=prisma-adapter.js.map