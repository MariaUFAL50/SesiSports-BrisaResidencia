import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, Query, UseGuards } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/holes.guard';
import { TipoUsuario } from '@prisma/client';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Spaces')
@ApiBearerAuth('JWT-auth')
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}
  
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TipoUsuario.ADMIN)
  async create(@Body() body: CreateSpaceDto) {
    // normaliza body para evitar erros quando undefined
    body = body ?? {};
    const parseField = (field: any) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return field;
        }
      }
      return field;
    };

    const trimField = (field: any) => {
      if (typeof field === 'string') return field.trim();
      if (Array.isArray(field)) return field.map(item => typeof item === 'string' ? item.trim() : item);
      return field;
    };

    const createSpaceDto: any = {
      ...body,
      spaceType: trimField(parseField(body.spaceType)),
      availableDays: trimField(parseField(body.availableDays)),
      photos: body.photos || [],
      description: body.description ? String(body.description).slice(0, 400) : '',
    };

    if (createSpaceDto.hourPrice !== undefined) {
      if (typeof createSpaceDto.hourPrice === 'string') {
        createSpaceDto.hourPrice = createSpaceDto.hourPrice.trim();
        if (!isNaN(Number(createSpaceDto.hourPrice))) {
          createSpaceDto.hourPrice = Number(createSpaceDto.hourPrice);
        }
      }
    }

    ['name','sportType','spaceStatus','openingHour','closingHour','description'].forEach(key => {
      if (typeof createSpaceDto[key] === 'string') {
        createSpaceDto[key] = createSpaceDto[key].trim();
      }
    });

    try {
      return await this.spacesService.create(createSpaceDto);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar espaço: ' + (error?.message || 'Erro desconhecido'));
    }
  }

  @Get()
  findAll() {
    return this.spacesService.findAll();
  }

  @Get('filter')
  async findFiltered(@Query('spaceType') spaceType?: string, @Query('sportType') sportType?: string) {
    return this.spacesService.findFiltered({ spaceType, sportType });
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spacesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TipoUsuario.ADMIN)
  async update(@Param('id') id: string, @Body() body: UpdateSpaceDto) {
    const parseField = (field: any) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return field;
        }
      }
      return field;
    };

    const trimField = (field: any) => {
      if (typeof field === 'string') return field.trim();
      if (Array.isArray(field)) return field.map(item => typeof item === 'string' ? item.trim() : item);
      return field;
    };

    const updateSpaceDto: any = {
      ...body,
      spaceType: trimField(parseField(body?.spaceType)),
      availableDays: trimField(parseField(body?.availableDays)),
      photos: body?.photos || undefined,
      description: body?.description ? String(body.description).slice(0, 400) : undefined,
    };

    if (updateSpaceDto.hourPrice !== undefined) {
      if (typeof updateSpaceDto.hourPrice === 'string') {
        updateSpaceDto.hourPrice = updateSpaceDto.hourPrice.trim();
        if (!isNaN(Number(updateSpaceDto.hourPrice))) {
          updateSpaceDto.hourPrice = Number(updateSpaceDto.hourPrice);
        }
      }
    }

    ['name','sportType','spaceStatus','openingHour','closingHour','description'].forEach(key => {
      if (typeof updateSpaceDto[key] === 'string') {
        updateSpaceDto[key] = updateSpaceDto[key].trim();
      }
    });

    try {
      return await this.spacesService.update(+id, updateSpaceDto);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar espaço: ' + (error?.message || 'Erro desconhecido'));
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TipoUsuario.ADMIN)
  remove(@Param('id') id: string) {
    return this.spacesService.remove(+id);
  }

}
