import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
export declare class SpacesController {
    private readonly spacesService;
    constructor(spacesService: SpacesService);
    create(body: CreateSpaceDto): Promise<{
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
    findFiltered(spaceType?: string, sportType?: string): Promise<({
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
    findOne(id: string): Promise<({
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
    update(id: string, body: UpdateSpaceDto): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
}
