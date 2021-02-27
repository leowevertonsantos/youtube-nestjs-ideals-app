import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<any> | Observable<any> {
    let request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      return false;

    } else if (token.split(' ')[0] != 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    
    request.user = this.validateToken(token.split(' ')[1]);
    return true;
  }


  private validateToken(token: string) {
    
    try {
      const userInformation = jwt.verify(token, process.env.SECRET);
      return userInformation;

    } catch (error) {
      throw new HttpException(
        `Invalid token: ${error.message || error.name}`,
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
