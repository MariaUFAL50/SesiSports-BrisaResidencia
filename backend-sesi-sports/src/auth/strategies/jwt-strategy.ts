import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload);
    return { 
      id: Number(payload.sub), 
      email: payload.email, 
      tipo: payload.tipoUsuario,
      profileComplete: payload.profileComplete,
      outlookId: payload.outlookId,
      cpfCnpj: payload.cpfCnpj,
      nome: payload.nome,
      fotoUrl: payload.fotoUrl
    };
  }
}