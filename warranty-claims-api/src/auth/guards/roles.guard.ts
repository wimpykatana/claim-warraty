import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromExtractors([
      (request: Request) => request.cookies?.Authentication,
    ])(request);

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const secret = this.configService.getOrThrow<string>(
        'JWT_ACCCESS_TOKEN_SECRET',
      );
      const decoded = this.jwtService.verify(token, { secret });
      const user = await this.userService.findOneUserByID(decoded.userId);

      return roles.some((role) => user.role?.includes(role));
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
