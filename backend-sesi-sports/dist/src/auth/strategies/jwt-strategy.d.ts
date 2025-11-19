import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        id: number;
        email: any;
        tipo: any;
        profileComplete: any;
        outlookId: any;
        cpfCnpj: any;
        nome: any;
        fotoUrl: any;
    }>;
}
export {};
