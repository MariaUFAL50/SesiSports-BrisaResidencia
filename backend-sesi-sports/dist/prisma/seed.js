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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Iniciando seed de usuários...');
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@esportess.com' },
        update: {},
        create: {
            email: 'admin@esportess.com',
            nome: 'Administrador Sistema',
            password: adminPassword,
            cpfCnpj: '11144477735',
            phoneNumber: '8532001000',
            cep: '57000-000',
            city: 'Maceió',
            state: 'AL',
            street: 'Rua Principal',
            tipo: client_1.TipoUsuario.ADMIN,
            status: client_1.UserStatus.ATIVO
        },
    });
    console.log(`Administrador criado: ${admin.nome} (${admin.email})`);
    const tecnicoPassword = await bcrypt.hash('Tecnico@123', 10);
    const tecnico = await prisma.user.upsert({
        where: { email: 'tecnico@esportess.com' },
        update: {},
        create: {
            email: 'tecnico@esportess.com',
            nome: 'Técnico Teste',
            password: tecnicoPassword,
            cpfCnpj: '52998224725',
            phoneNumber: '8532001001',
            cep: '57000-000',
            city: 'Maceió',
            state: 'AL',
            street: 'Rua dos Técnicos',
            tipo: client_1.TipoUsuario.TECNICO,
            status: client_1.UserStatus.ATIVO
        },
    });
    console.log(`Técnico criado: ${tecnico.nome} (${tecnico.email})`);
}
main()
    .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map