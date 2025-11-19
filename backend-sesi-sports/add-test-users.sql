-- Script para adicionar usuários de teste
-- Senha para todos: Senha@123
-- Hash bcrypt: $2b$10$ylfuzd8IIjQ1DFK/G2idGuJ43yUjAdly5zM5tRXUDSPEYu1ETP3eW

-- Inserir usuários (senha: Senha@123)
INSERT INTO "User" (nome, email, tipo, password, status, "cpfCnpj", "phoneNumber", cep, city, state, street, number, complement, "createdAt", "updatedAt") VALUES
-- CLIENTES
('João Silva', 'joao.silva@email.com', 'CLIENTE', '$2b$10$ylfuzd8IIjQ1DFK/G2idGuJ43yUjAdly5zM5tRXUDSPEYu1ETP3eW', 'ATIVO', '52998224725', '82999887766', '57000-000', 'Maceió', 'AL', 'Rua João Silva', 100, 'Apto 101', NOW(), NOW()),
('Maria Santos', 'maria.santos@email.com', 'CLIENTE', '$2b$10$ylfuzd8IIjQ1DFK/G2idGuJ43yUjAdly5zM5tRXUDSPEYu1ETP3eW', 'ATIVO', '12345678900', '82999887755', '57000-001', 'Maceió', 'AL', 'Rua Maria Santos', 200, 'Casa', NOW(), NOW()),
('Carlos Oliveira', 'carlos.oliveira@email.com', 'CLIENTE', '$2b$10$ylfuzd8IIjQ1DFK/G2idGuJ43yUjAdly5zM5tRXUDSPEYu1ETP3eW', 'ATIVO', '98765432100', '82999887744', '57000-002', 'Maceió', 'AL', 'Rua Carlos Oliveira', 300, NULL, NOW(), NOW()),

-- TÉCNICOS
('Pedro Técnico', 'pedro.tecnico@sesi.com', 'TECNICO', '$2b$10$ylfuzd8IIjQ1DFK/G2idGuJ43yUjAdly5zM5tRXUDSPEYu1ETP3eW', 'ATIVO', '11122233344', '82999887733', '57000-003', 'Maceió', 'AL', 'Rua Pedro Técnico', 400, 'Sala 1', NOW(), NOW()),
('Ana Técnica', 'ana.tecnica@sesi.com', 'TECNICO', '$2b$10$ylfuzd8IIjQ1DFK/G2idGuJ43yUjAdly5zM5tRXUDSPEYu1ETP3eW', 'ATIVO', '55566677788', '82999887722', '57000-004', 'Maceió', 'AL', 'Rua Ana Técnica', 500, NULL, NOW(), NOW()),

-- ADMIN
('Admin SESI', 'admin@sesi.com', 'ADMIN', '$2b$10$ylfuzd8IIjQ1DFK/G2idGuJ43yUjAdly5zM5tRXUDSPEYu1ETP3eW', 'ATIVO', '99988877766', '82999887711', '57000-005', 'Maceió', 'AL', 'Rua Admin SESI', 600, 'Cobertura', NOW(), NOW());

