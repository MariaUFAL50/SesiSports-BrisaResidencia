import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Senha@123', 10);
  
  console.log('🔐 Atualizando senhas para Senha@123...');
  
  await prisma.user.updateMany({
    data: { password },
  });
  
  console.log('✅ Senhas atualizadas!');
  console.log('\n🔑 USE ESTAS CREDENCIAIS:\n');
  console.log('TÉCNICO: CPF: 529.982.247-25 | Senha: Senha@123');
  console.log('ADMIN:   CPF: 111.444.777-35 | Senha: Senha@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
