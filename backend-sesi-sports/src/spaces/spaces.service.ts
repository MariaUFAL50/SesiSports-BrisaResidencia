import { Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSpaceDto: CreateSpaceDto) {
    const { photos, ...spaceData } = createSpaceDto;

    const spaceCreateData: any = {
      ...spaceData,
      photos: {
        create: photos?.map((url) => ({ url })) || [],
      }
    };

    return await this.prisma.space.create({
      data: spaceCreateData,
      include: { photos: true },
    });
  }

  async findAll() {
    return this.prisma.space.findMany({ include: { photos: true } });
  }

  async findOne(id: number) {
    return this.prisma.space.findUnique({
      where: { id },
      include: { photos: true },
    });
  }
  
  async findFiltered(filters: { spaceType?: string | string[]; sportType?: string }) {
    const { spaceType, sportType } = filters;

    const where: any = {};

    if (spaceType) {
      let types: string[] = [];
      if (Array.isArray(spaceType)) {
        types = spaceType;
      } else if (typeof spaceType === 'string') {
        types = spaceType.includes(',')
          ? spaceType.split(',').map(s => s.trim())
          : [spaceType];
      }
      where.spaceType = { hasSome: types };
    }

    if (sportType) {
      where.sportType = sportType;
    }

    return this.prisma.space.findMany({ where, include: { photos: true } });
  }

  async update(id: number, updateSpaceDto: UpdateSpaceDto) {
    const { photos, ...spaceData } = updateSpaceDto;

    Object.keys(spaceData).forEach(
      (key) => spaceData[key] === undefined && delete spaceData[key]
    );

    const data: any = { ...spaceData };

    if (photos && Array.isArray(photos) && photos.length > 0) {
      data.photos = {
        deleteMany: {},
        create: photos.map((url: string) => ({ url })),
      };
    }

    return await this.prisma.space.update({
      where: { id: Number(id) },
      data,
      include: { photos: true },
    });
  }

  async remove(id: number) {
    const space = await this.prisma.space.findUnique({
      where: { id },
      include: { photos: true },
    });
    if (!space) {
      throw new Error('Espaço não encontrado');
    }

    await this.prisma.spacePhoto.deleteMany({ where: { spaceId: id } });

    await this.prisma.space.delete({ where: { id } });

    return { message: 'Espaço removido com sucesso.' };
  }
}
