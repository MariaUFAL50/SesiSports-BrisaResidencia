"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const users = await prisma.user.findMany({
        select: { id: true, nome: true, email: true, cpfCnpj: true, tipo: true },
        orderBy: [{ tipo: 'asc' }, { nome: 'asc' }],
    });
    console.log('\n📋 TODOS OS USUÁRIOS NO BANCO:\n');
    console.table(users);
    console.log('\n🔑 CREDENCIAIS DE TESTE:\n');
    console.log('Senha para TODOS: Senha@123\n');
    users.forEach(u => {
        const cpfFormatado = u.cpfCnpj ? u.cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : 'N/A';
        console.log(`${u.tipo.padEnd(10)} | CPF: ${cpfFormatado} | ${u.nome}`);
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=list-users.js.map