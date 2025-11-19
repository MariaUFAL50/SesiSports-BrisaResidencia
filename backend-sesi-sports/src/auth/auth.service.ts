import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CompleteProfileDto } from './dto/complete-registration.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { TipoUsuario, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

export interface GoogleUser {
  googleId: string;
  nome: string;
  email: string;
  fotoUrl?: string;
}

export interface OutlookUser {
  outlookId: string;
  nome: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(data: RegisterDto, userType: TipoUsuario = TipoUsuario.CLIENTE) {
    if (!data.password) {
      throw new BadRequestException('Senha é obrigatória para registro.');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          ...(data.cpfCnpj ? [{ cpfCnpj: data.cpfCnpj }] : []),
        ]
      }
    });

    if (existingUser) {
      throw new ConflictException('E-mail ou CPF/CNPJ já cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const tipo = userType || TipoUsuario.CLIENTE;
    
    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        tipo: tipo,
      },
    });

    return newUser;
  }

    async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { cpfCnpj: data.cpfCnpj },
    });

    if (!user) {
      throw new NotFoundException('CPF/CNPJ não encontrado.');
    }

    if (!user.password) {
      throw new NotFoundException('Dados de login inválidos.');
    }
    
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Dados de login inválidos.');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      tipoUsuario: user.tipo,
      nome: user.nome,
      fotoUrl: user.fotoUrl
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        fotoUrl: user.fotoUrl
      }
    };
  }

private isProfileComplete(user: User): boolean {
  return !!user.cpfCnpj;
}

async completeProfile(userId: number, data: CompleteProfileDto) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new NotFoundException('Usuário não encontrado');
  }

  if (!user.outlookId) {
    throw new BadRequestException('Acesso negado: Este endpoint é exclusivo para usuários que fizeram login via Outlook');
  }

  if (user.cpfCnpj) {
    throw new ConflictException('Perfil já está completo. Não é possível completar novamente');
  }

  const existingUser = await this.prisma.user.findFirst({
    where: { 
      cpfCnpj: data.cpfCnpj,
      NOT: { id: userId }
    }
  });

  if (existingUser) {
    throw new ConflictException('Este CPF/CNPJ já está em uso por outro usuário');
  }

  try {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        cpfCnpj: data.cpfCnpj,
        phoneNumber: data.phoneNumber,
        cep: data.cep,
        city: data.city,
        state: data.state,
        street: data.street,
        number: data.number,
        complement: data.complement,
        updatedAt: new Date(),
      },
    });

    const payload = {
      sub: updatedUser.id,
      email: updatedUser.email,
      tipoUsuario: updatedUser.tipo,
      profileComplete: true,
      outlookId: updatedUser.outlookId,
      cpfCnpj: updatedUser.cpfCnpj,
      nome: updatedUser.nome,
      fotoUrl: updatedUser.fotoUrl
    };

    return {
      user: {
        id: updatedUser.id,
        nome: updatedUser.nome,
        email: updatedUser.email,
        tipo: updatedUser.tipo,
        fotoUrl: updatedUser.fotoUrl,
        cpfCnpj: updatedUser.cpfCnpj,
        phoneNumber: updatedUser.phoneNumber,
        profileComplete: true
      },
      access_token: this.jwtService.sign(payload),
    };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw new Error('Não foi possível atualizar o perfil. Por favor, tente novamente.');
  }
}

async findOrCreateOutlookUser(userData: OutlookUser) {
    try {
      let user = await this.prisma.user.findUnique({
        where: { outlookId: userData.outlookId },
      });

      if (!user && userData.email) {
        user = await this.prisma.user.findUnique({
          where: { email: userData.email },
        });

        if (user) {
          console.log('Usuário encontrado por email, atualizando outlookId');
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: { outlookId: userData.outlookId },
          });
        }
      }

      if (user) {
        console.log('Usuário do Outlook encontrado, gerando token');
        const isProfileComplete = this.isProfileComplete(user);

        const payload = {
          sub: user.id,
          email: user.email,
          tipoUsuario: user.tipo,
          profileComplete: isProfileComplete,
          outlookId: user.outlookId,
          cpfCnpj: user.cpfCnpj,
          nome: user.nome,
          fotoUrl: user.fotoUrl
        };

        return {
          access_token: this.jwtService.sign(payload),
          isProfileComplete,
          user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipo: user.tipo,
            fotoUrl: user.fotoUrl,
            cpfCnpj: user.cpfCnpj
          }
        };
      }

      const newUser = await this.prisma.user.create({
        data: {
          outlookId: userData.outlookId,
          email: userData.email,
          nome: userData.nome,
          tipo: TipoUsuario.CLIENTE,
          status: 'ATIVO',
          cpfCnpj: null,
          phoneNumber: 'TEMP_PHONE',
          cep: 'TEMP_CEP',
          city: 'TEMPORARIO',
          state: 'TMP',
          street: 'ENDERECO_TEMPORARIO',
          number: null,
          complement: 'Aguardando completar perfil',
        },
      });

      const payload = {
        sub: newUser.id,
        email: newUser.email,
        tipoUsuario: newUser.tipo,
        profileComplete: false,
        outlookId: newUser.outlookId,
        cpfCnpj: newUser.cpfCnpj,
        nome: newUser.nome,
        fotoUrl: newUser.fotoUrl
      };

      return {
        access_token: this.jwtService.sign(payload),
        isProfileComplete: false,
        user: {
          id: newUser.id,
          nome: newUser.nome,
          email: newUser.email,
          tipo: newUser.tipo,
          fotoUrl: newUser.fotoUrl,
          cpfCnpj: null
        }
      };
    } catch (error) {
      console.error('Erro ao processar autenticação Outlook:', error);
      throw error;
    }
  }
}