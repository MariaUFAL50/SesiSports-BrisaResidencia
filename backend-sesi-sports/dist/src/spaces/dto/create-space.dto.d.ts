import { Status, SpaceType, SportType, WeekDay } from '@prisma/client';
export declare class CreateSpaceDto {
    name: string;
    description: string;
    hourPrice: number;
    spaceType: SpaceType[];
    sportType: SportType;
    spaceStatus: Status;
    openingHour: string;
    closingHour: string;
    availableDays: WeekDay[];
    photos?: string[];
}
