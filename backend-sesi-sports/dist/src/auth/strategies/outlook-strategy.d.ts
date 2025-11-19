import { ConfigService } from '@nestjs/config';
declare const OutlookStrategy_base: new (...args: any) => any;
export declare class OutlookStrategy extends OutlookStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any, done: (err?: Error, user?: any, info?: any) => void): Promise<any>;
}
export {};
