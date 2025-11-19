import { Injectable, NotFoundException, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { PaginationDto, createPaginatedResponse } from '../common/pagination';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findMe(userId: number) {
    return this.findById(userId);
  }
  
  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o email já está em uso (caso esteja sendo atualizado)
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateProfileDto.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Este email já está em uso por outro usuário');
      }
    }

    // Atualizar o perfil do usuário
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateProfileDto,
        updatedAt: new Date()
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
  
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    // Verificar se o usuário existe e obter a senha atual
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o usuário tem senha definida
    if (!user.password) {
      throw new BadRequestException('Usuário não possui senha definida (login via provedor externo)');
    }

    // Verificar se a senha atual está correta
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Verificar se a nova senha e a confirmação coincidem
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('A nova senha e a confirmação não coincidem');
    }

    // Verificar se a nova senha é diferente da atual
    const isSameAsCurrent = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.password as string,
    );

    if (isSameAsCurrent) {
      throw new BadRequestException('A nova senha deve ser diferente da senha atual');
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Atualizar a senha do usuário
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    return { message: 'Senha alterada com sucesso' };
  }
  
  async findAll(paginationDto: PaginationDto, search?: string) {
    // Construir a consulta com filtros opcionais
    const where: Prisma.UserWhereInput = search 
      ? {
          OR: [
            { nome: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { email: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { cpfCnpj: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          ],
        }
      : {};

    // Configurar a ordenação
    const orderBy: Prisma.UserOrderByWithRelationInput = {};
    if (paginationDto.orderBy) {
      orderBy[paginationDto.orderBy] = paginationDto.orderDirection;
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
      skip: paginationDto.skip,
      take: paginationDto.take,
      orderBy,
    });

    // Retornar o resultado paginado
    return createPaginatedResponse(users, total, paginationDto);
  }
}