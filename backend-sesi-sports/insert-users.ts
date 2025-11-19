// Script para inserir usuários de teste
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️ Deletando usuários antigos...');
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          'joao.silva@email.com',
          'maria.santos@email.com',
          'carlos.oliveira@email.com',
          'pedro.tecnico@sesi.com',
          'ana.tecnica@sesi.com',
          'admin@sesi.com',
        ],
      },
    },
  });

  const password = await bcrypt.hash('Senha@123', 10);

  console.log('✅ Inserindo novos usuários...');

  const users = await prisma.user.createMany({
    data: [
      // CLIENTES
      {
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        tipo: 'CLIENTE',
        password: password,
        status: 'ATIVO',
        cpfCnpj: '52998224725',
        phoneNumber: '82999887766',
        cep: '57000-000',
        city: 'Maceió',
        state: 'AL',
        street: 'Rua João Silva',
        number: 100,
        complement: 'Apto 101',
      },
      {
        nome: 'Maria Santos',
        email: 'maria.santos@email.com',
        tipo: 'CLIENTE',
        password: password,
        status: 'ATIVO',
        cpfCnpj: '12345678900',
        phoneNumber: '82999887755',
        cep: '57000-001',
        city: 'Maceió',
        state: 'AL',
        street: 'Rua Maria Santos',
        number: 200,
        complement: 'Casa',
      },
      {
        nome: 'Carlos Oliveira',
        email: 'carlos.oliveira@email.com',
        tipo: 'CLIENTE',
        password: password,
        status: 'ATIVO',
        cpfCnpj: '98765432100',
        phoneNumber: '82999887744',
        cep: '57000-002',
        city: 'Maceió',
        state: 'AL',
        street: 'Rua Carlos Oliveira',
        number: 300,
        complement: null,
      },
      // TÉCNICOS
      {
        nome: 'Pedro Técnico',
        email: 'pedro.tecnico@sesi.com',
        tipo: 'TECNICO',
        password: password,
        status: 'ATIVO',
        cpfCnpj: '11122233344',
        phoneNumber: '82999887733',
        cep: '57000-003',
        city: 'Maceió',
        state: 'AL',
        street: 'Rua Pedro Técnico',
        number: 400,
        complement: 'Sala 1',
      },
      {
        nome: 'Ana Técnica',
        email: 'ana.tecnica@sesi.com',
        tipo: 'TECNICO',
        password: password,
        status: 'ATIVO',
        cpfCnpj: '55566677788',
        phoneNumber: '82999887722',
        cep: '57000-004',
        city: 'Maceió',
        state: 'AL',
        street: 'Rua Ana Técnica',
        number: 500,
        complement: null,
      },
      // ADMIN
      {
        nome: 'Admin SESI',
        email: 'admin@sesi.com',
        tipo: 'ADMIN',
        password: password,
        status: 'ATIVO',
        cpfCnpj: '99988877766',
        phoneNumber: '82999887711',
        cep: '57000-005',
        city: 'Maceió',
        state: 'AL',
        street: 'Rua Admin SESI',
        number: 600,
        complement: 'Cobertura',
      },
    ],
  });

  console.log(`✅ ${users.count} usuários inseridos com sucesso!`);

  const allUsers = await prisma.user.findMany({
    select: { nome: true, email: true, cpfCnpj: true, tipo: true },
    orderBy: [{ tipo: 'asc' }, { nome: 'asc' }],
  });

  console.log('\n📋 Usuários no banco:');
  console.table(allUsers);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
