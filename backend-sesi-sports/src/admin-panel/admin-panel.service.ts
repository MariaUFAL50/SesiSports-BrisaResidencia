import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserFilterDto } from './dto/user-filter.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { Prisma } from '@prisma/client';
import { createPaginatedResponse } from '../common/pagination';

@Injectable()
export class AdminPanelService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers(filterDto: UserFilterDto) {
    const { search, tipo, status } = filterDto;

    // Construir a consulta com filtros opcionais
    const where: Prisma.UserWhereInput = {};

    // Filtro por texto (nome, email ou CPF/CNPJ)
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        { email: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        { cpfCnpj: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      ];
    }

    // Filtro por tipo de usuário
    if (tipo) {
      where.tipo = tipo;
    }

    // Filtro por status
    if (status) {
      where.status = status;
    }

    // Verificar se pelo menos um filtro foi fornecido
    if (Object.keys(where).length === 0 && !where.OR) {
      // Se não houver filtros, retornar uma lista vazia com paginação
      return createPaginatedResponse([], 0, filterDto);
    }

    // Configurar a ordenação
    const orderBy: Prisma.UserOrderByWithRelationInput = {};
    if (filterDto.orderBy) {
      orderBy[filterDto.orderBy] = filterDto.orderDirection;
    } else {
      orderBy['createdAt'] = 'desc'; // Ordenação padrão
    }

    // Contar o total de itens (para a paginação)
    const total = await this.prisma.user.count({ where });

    // Buscar os itens paginados
    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        phoneNumber: true,
        cep: true,
        city: true,
        state: true,
        street: true,
        number: true,
        complement: true,
        fotoUrl: true,
        cpfCnpj: true,
        createdAt: true,
        updatedAt: true,
        outlookId: true,
        status: true,
        // Não incluímos a senha por motivos de segurança
      },
      skip: filterDto.skip,
      take: filterDto.take,
      orderBy,
    });

    // Retornar o resultado paginado
    return createPaginatedResponse(users, total, filterDto);
  }

  async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        phoneNumber: true,
        cep: true,
        city: true,
        state: true,
        street: true,
        number: true,
        complement: true,
        fotoUrl: true,
        cpfCnpj: true,
        createdAt: true,
        updatedAt: true,
        outlookId: true,
        status: true,
        // Não incluímos a senha por motivos de segurança
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  async updateUser(userId: number, updateDto: UpdateUserAdminDto) {
    // Verificar se o usuário existe
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException(`Usuário com ID ${userId} não encontrado`);
    }

    // Verificar se o email já está em uso (caso esteja sendo atualizado)
    if (updateDto.email && updateDto.email !== userExists.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateDto.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Este email já está em uso por outro usuário');
      }
    }

    // Verificar se o CPF/CNPJ já está em uso (caso esteja sendo atualizado)
    if (updateDto.cpfCnpj && updateDto.cpfCnpj !== userExists.cpfCnpj) {
      const existingUserCpfCnpj = await this.prisma.user.findUnique({
        where: { cpfCnpj: updateDto.cpfCnpj },
      });

      if (existingUserCpfCnpj && existingUserCpfCnpj.id !== userId) {
        throw new ConflictException('Este CPF/CNPJ já está em uso por outro usuário');
      }
    }

    // Atualizar o usuário
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateDto,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        phoneNumber: true,
        cep: true,
        city: true,
        state: true,
        street: true,
        number: true,
        complement: true,
        fotoUrl: true,
        cpfCnpj: true,
        createdAt: true,
        updatedAt: true,
        outlookId: true,
        status: true,
        // Não incluímos a senha por motivos de segurança
      },
    });

    return updatedUser;
  }
}