import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class SpacesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createSpaceDto: CreateSpaceDto): Promise<{
        photos: {
            id: number;
            spaceId: number;
            url: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        hourPrice: import("@prisma/client/runtime/library").Decimal;
        spaceType: import("@prisma/client").$Enums.SpaceType[];
        sportType: import("@prisma/client").$Enums.SportType;
        spaceStatus: import("@prisma/client").$Enums.Status;
        openingHour: string;
        closingHour: string;
        availableDays: import("@prisma/client").$Enums.WeekDay[];
    }>;
    findAll(): Promise<({
        photos: {
            id: number;
            spaceId: number;
            url: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        hourPrice: import("@prisma/client/runtime/library").Decimal;
        spaceType: import("@prisma/client").$Enums.SpaceType[];
        sportType: import("@prisma/client").$Enums.SportType;
        spaceStatus: import("@prisma/client").$Enums.Status;
        openingHour: string;
        closingHour: string;
        availableDays: import("@prisma/client").$Enums.WeekDay[];
    })[]>;
    findOne(id: number): Promise<({
        photos: {
            id: number;
            spaceId: number;
            url: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        hourPrice: import("@prisma/client/runtime/library").Decimal;
        spaceType: import("@prisma/client").$Enums.SpaceType[];
        sportType: import("@prisma/client").$Enums.SportType;
        spaceStatus: import("@prisma/client").$Enums.Status;
        openingHour: string;
        closingHour: string;
        availableDays: import("@prisma/client").$Enums.WeekDay[];
    }) | null>;
    findFiltered(filters: {
        spaceType?: string | string[];
        sportType?: string;
    }): Promise<({
        photos: {
            id: number;
            spaceId: number;
            url: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        hourPrice: import("@prisma/client/runtime/library").Decimal;
        spaceType: import("@prisma/client").$Enums.SpaceType[];
        sportType: import("@prisma/client").$Enums.SportType;
        spaceStatus: import("@prisma/client").$Enums.Status;
        openingHour: string;
        closingHour: string;
        availableDays: import("@prisma/client").$Enums.WeekDay[];
    })[]>;
    update(id: number, updateSpaceDto: UpdateSpaceDto): Promise<{
        photos: {
            id: number;
            spaceId: number;
            url: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        hourPrice: import("@prisma/client/runtime/library").Decimal;
        spaceType: import("@prisma/client").$Enums.SpaceType[];
        sportType: import("@prisma/client").$Enums.SportType;
        spaceStatus: import("@prisma/client").$Enums.Status;
        openingHour: string;
        closingHour: string;
        availableDays: import("@prisma/client").$Enums.WeekDay[];
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
