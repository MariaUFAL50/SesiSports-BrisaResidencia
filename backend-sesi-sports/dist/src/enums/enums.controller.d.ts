import { EnumsService } from './enums.service';
export declare class EnumsController {
    private readonly enumsService;
    constructor(enumsService: EnumsService);
    getUserTypes(): {
        types: {
            value: string;
            label: string;
        }[];
    };
    getUserStatus(): {
        status: {
            value: string;
            label: string;
        }[];
    };
}
