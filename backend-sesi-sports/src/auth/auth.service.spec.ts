import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { TipoUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Mock do bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService - Register', () => {
  let service: AuthService;
  let prismaService: any;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validRegisterDto: RegisterDto = {
      nome: 'João Silva',
      email: 'joao@test.com',
      password: 'senha123A',
      cpfCnpj: '123.456.789-09',
      phoneNumber: '(11) 99999-9999',
      cep: '01234-567',
      city: 'São Paulo',
      state: 'SP',
      street: 'Rua Test',
      complement: 'Apto 45',
    };

    it('deve registrar um novo usuário com sucesso (tipo CLIENTE por padrão)', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);
      
      const mockCreatedUser = {
        id: 1,
        ...validRegisterDto,
        password: 'hashedPassword123',
        tipo: TipoUsuario.CLIENTE,
        status: 'ATIVO',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      prismaService.user.create.mockResolvedValue(mockCreatedUser as any);

      const result = await service.register(validRegisterDto);

      expect(result).toEqual(mockCreatedUser);
      
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: validRegisterDto.email },
            { cpfCnpj: validRegisterDto.cpfCnpj },
          ]
        }
      });
      
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(validRegisterDto.password, 10);
      
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...validRegisterDto,
          password: 'hashedPassword123',
          tipo: TipoUsuario.CLIENTE,
        },
      });
    });

    it('deve registrar usuário com tipo específico quando fornecido', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);
      
      const mockCreatedUser = {
        id: 1,
        ...validRegisterDto,
        password: 'hashedPassword123',
        tipo: TipoUsuario.ADMIN,
        status: 'ATIVO',
      };
      
      prismaService.user.create.mockResolvedValue(mockCreatedUser as any);

      const result = await service.register(validRegisterDto, TipoUsuario.ADMIN);

      expect(result).toEqual(mockCreatedUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...validRegisterDto,
          password: 'hashedPassword123',
          tipo: TipoUsuario.ADMIN,
        },
      });
    });

    it('deve lançar ConflictException se email já existir', async () => {
      const existingUser = {
        id: 1,
        email: validRegisterDto.email,
        cpfCnpj: 'outro-cpf',
      };
      
      prismaService.user.findFirst.mockResolvedValue(existingUser as any);

      await expect(service.register(validRegisterDto)).rejects.toThrow(
        new ConflictException('E-mail ou CPF/CNPJ já cadastrado.')
      );

      expect(prismaService.user.create).not.toHaveBeenCalled();
      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
    });

    it('deve lançar ConflictException se CPF/CNPJ já existir', async () => {
      const existingUser = {
        id: 1,
        email: 'outro@email.com',
        cpfCnpj: validRegisterDto.cpfCnpj,
      };
      
      prismaService.user.findFirst.mockResolvedValue(existingUser as any);

      await expect(service.register(validRegisterDto)).rejects.toThrow(
        new ConflictException('E-mail ou CPF/CNPJ já cadastrado.')
      );

      expect(prismaService.user.create).not.toHaveBeenCalled();
    });

    it('deve fazer hash da senha antes de salvar', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);
      prismaService.user.create.mockResolvedValue({} as any);

      await service.register(validRegisterDto);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('senha123A', 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...validRegisterDto,
          password: 'hashedPassword123',
          tipo: TipoUsuario.CLIENTE,
        },
      });
    });

    it('deve permitir senha null quando não fornecida', async () => {
      const registerDtoWithoutPassword = { ...validRegisterDto };
      delete (registerDtoWithoutPassword as any).password;
      
      prismaService.user.findFirst.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue({} as any);

      await service.register(registerDtoWithoutPassword as RegisterDto);

      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...registerDtoWithoutPassword,
          password: null,
          tipo: TipoUsuario.CLIENTE,
        },
      });
    });

    it('deve permitir registro sem CPF/CNPJ', async () => {
      const registerDtoWithoutCpf = { ...validRegisterDto };
      delete (registerDtoWithoutCpf as any).cpfCnpj;
      
      prismaService.user.findFirst.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);
      prismaService.user.create.mockResolvedValue({} as any);

      await service.register(registerDtoWithoutCpf as RegisterDto);

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: registerDtoWithoutCpf.email },
          ]
        }
      });
      
      expect(prismaService.user.create).toHaveBeenCalled();
    });

    it('deve definir status como ATIVO por padrão', async () => {

      prismaService.user.findFirst.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);
      const mockUser = { id: 1, status: 'ATIVO' };
      prismaService.user.create.mockResolvedValue(mockUser as any);

      const result = await service.register(validRegisterDto);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...validRegisterDto,
          password: 'hashedPassword123',
          tipo: TipoUsuario.CLIENTE,
        },
      });
    });
  });
});