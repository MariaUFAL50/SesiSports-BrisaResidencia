import { SpaceType, SportType, Status, WeekDay } from '@prisma/client';
export declare class Space {
    id: number;
    name: string;
    description: string;
    hourPrice: number;
    spaceType: SpaceType[];
    sportType: SportType;
    spaceStatus: Status;
    openingHour: string;
    closingHour: string;
    availableDays: WeekDay[];
    createdAt: Date;
    updatedAt: Date;
    photos?: SpacePhoto[];
}
declare class SpacePhoto {
    id: number;
    url: string;
    spaceId: number;
}
export {};
