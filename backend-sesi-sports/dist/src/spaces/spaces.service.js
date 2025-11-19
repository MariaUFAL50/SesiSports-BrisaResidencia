"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SpacesService = class SpacesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSpaceDto) {
        const { photos, ...spaceData } = createSpaceDto;
        const spaceCreateData = {
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
    async findOne(id) {
        return this.prisma.space.findUnique({
            where: { id },
            include: { photos: true },
        });
    }
    async findFiltered(filters) {
        const { spaceType, sportType } = filters;
        const where = {};
        if (spaceType) {
            let types = [];
            if (Array.isArray(spaceType)) {
                types = spaceType;
            }
            else if (typeof spaceType === 'string') {
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
    async update(id, updateSpaceDto) {
        const { photos, ...spaceData } = updateSpaceDto;
        Object.keys(spaceData).forEach((key) => spaceData[key] === undefined && delete spaceData[key]);
        const data = { ...spaceData };
        if (photos && Array.isArray(photos) && photos.length > 0) {
            data.photos = {
                deleteMany: {},
                create: photos.map((url) => ({ url })),
            };
        }
        return await this.prisma.space.update({
            where: { id: Number(id) },
            data,
            include: { photos: true },
        });
    }
    async remove(id) {
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
};
exports.SpacesService = SpacesService;
exports.SpacesService = SpacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpacesService);
//# sourceMappingURL=spaces.service.js.map