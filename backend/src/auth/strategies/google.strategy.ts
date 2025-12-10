import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    console.log('Google Strategy Callback URL:', process.env.GOOGLE_CALLBACK_URL || 'UNDEFINED');
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get('GOOGLE_CALLBACK_URL') || '',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos, id } = profile;
    const user = {
      email: emails && emails[0] ? emails[0].value : null,
      firstName: name ? name.givenName : '',
      lastName: name ? name.familyName : '',
      picture: photos && photos[0] ? photos[0].value : null,
      accessToken,
      googleId: id
    };
    done(null, user);
  }
}
