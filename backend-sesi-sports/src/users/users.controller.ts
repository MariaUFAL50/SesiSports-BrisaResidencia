import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UserProfileDto } from './dto/user-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtém os dados do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário obtido com sucesso',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getProfile(@Req() req) {
    return this.usersService.findMe(req.user.id);
  }
  
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualiza os dados do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário atualizado com sucesso',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Email já em uso' })
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  @Patch('profile/photo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualiza a foto do perfil do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Foto de perfil atualizada com sucesso',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async updatePhoto(@Req() req, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.usersService.updateProfile(req.user.id, updatePhotoDto);
  }
  
  @Patch('profile/password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Altera a senha do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Senha alterada com sucesso',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Senha alterada com sucesso'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Senha atual incorreta' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.id, changePasswordDto);
  }
}