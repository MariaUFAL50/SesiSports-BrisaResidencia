import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OutlookStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('MICROSOFT_CLIENT_ID'),
      clientSecret: configService.get<string>('MICROSOFT_CLIENT_SECRET'),
      callbackURL: 'http://localhost:8080/auth/outlook/callback',
      scope: ['user.read'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err?: Error, user?: any, info?: any) => void,
  ): Promise<any> {
    const { id, displayName, emails } = profile;

    const email = emails && emails.length > 0 ? emails[0].value : null;

    const user = {
      outlookId: id,
      nome: displayName,
      email: email,
    };

    done(undefined, user);
  }
}