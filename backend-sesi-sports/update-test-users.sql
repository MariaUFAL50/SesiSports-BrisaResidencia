-- Script para atualizar CPFs dos usuários de teste
-- Senha para todos: Senha@123
-- Hash bcrypt: $2b$10$ylfuzd8IIjQ1DFK/G2idGuJ43yUjAdly5zM5tRXUDSPEYu1ETP3eW

-- Atualizar CPFs dos usuários existentes (sem formatação - apenas números)

-- João Silva - Cliente
UPDATE "User" SET "cpfCnpj" = '52998224725' WHERE email = 'joao.silva@email.com';

-- Maria Santos - Cliente  
UPDATE "User" SET "cpfCnpj" = '12345678900' WHERE email = 'maria.santos@email.com';

-- Carlos Oliveira - Cliente
UPDATE "User" SET "cpfCnpj" = '98765432100' WHERE email = 'carlos.oliveira@email.com';

-- Pedro Técnico
UPDATE "User" SET "cpfCnpj" = '11122233344' WHERE email = 'pedro.tecnico@sesi.com';

-- Ana Técnica
UPDATE "User" SET "cpfCnpj" = '55566677788' WHERE email = 'ana.tecnica@sesi.com';

-- Admin SESI
UPDATE "User" SET "cpfCnpj" = '99988877766' WHERE email = 'admin@sesi.com';

-- Verificar os usuários atualizados
SELECT id, nome, email, "cpfCnpj", tipo, status FROM "User" ORDER BY tipo, nome;
