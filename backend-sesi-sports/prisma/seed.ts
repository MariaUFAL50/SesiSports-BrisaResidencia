import { PrismaClient, TipoUsuario, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
      tipo: TipoUsuario.ADMIN,
      status: UserStatus.ATIVO
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
      tipo: TipoUsuario.TECNICO,
      status: UserStatus.ATIVO
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