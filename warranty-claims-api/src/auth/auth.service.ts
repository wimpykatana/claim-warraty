import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { User } from 'src/user/schema/user.schema';
import { TokenPayload } from './token-payload.interface';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userServices: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow<string>('JWT_ACCCESS_TOKEN_SECRET_EXPIRES')}`,
    });

    response.cookie('Authentication', accessToken, {
      expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 1 day from now
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
    });

    response.json({
      isError: false,
      accessToken: accessToken,
      message: 'Login successful',
    });
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userServices.getUser({
        email,
      });
      const authenticated = await compare(password, user.password);

      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
