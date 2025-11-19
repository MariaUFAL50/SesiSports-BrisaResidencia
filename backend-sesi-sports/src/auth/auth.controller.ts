import { Controller, Post, Body, Get, UseGuards, Req, Patch, Res, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CompleteProfileDto } from './dto/complete-registration.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { Roles } from './decorators/roles.decorators';
import { RolesGuard } from './guards/holes.guard';
import { TipoUsuario } from '@prisma/client';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registra um novo usuário (sempre do tipo CLIENTE)' })
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }
  
@Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Patch('complete-outlook-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Completa o perfil do usuário especificamente após login com Outlook' })
  async completeOutlookProfile(@Req() req, @Body() data: CompleteProfileDto) {
    return this.authService.completeProfile(req.user.id, data);
  }

  @Post('admin/register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cadastra um novo usuário de qualquer tipo (apenas administradores)' })
  @ApiBody({ type: AdminRegisterDto })
  async adminRegister(@Body() data: AdminRegisterDto) {
    const { tipo, ...userData } = data;
    return this.authService.register(userData, tipo);
  }

  @Get('outlook')
  @UseGuards(AuthGuard('microsoft'))
  @ApiOperation({ summary: 'Inicia o fluxo de login com a Microsoft (Outlook)' })
  async outlookAuth(@Req() req) {
  }

  @Get('outlook/callback')
  @UseGuards(AuthGuard('microsoft'))
  @ApiOperation({ summary: 'Callback da Microsoft após o login' })
  async outlookAuthRedirect(@Req() req, @Res() res) {
    try {
      const result = await this.authService.findOrCreateOutlookUser(req.user);
      return res.send(result);
    } catch (error) {
      console.error('Erro no callback do Outlook:', error);
      throw error;
    }
  }
}