import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<any> | Observable<any> {

    let request = context.switchToHttp().getRequest();

    if (request) {
      return this.hasPermissionByHandleHttpRequest(request);

    } else {
      return this.hasPermissionByHandleGraphQL(context);
    }
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
  

  private hasPermissionByHandleHttpRequest(request) {
    const authorization: string = request.headers.authorization;

    if (!authorization) {
      return false;
    }

    const token: string = this.getToken(authorization);
    request.user = this.validateToken(token);
    return true;
  }



  private hasPermissionByHandleGraphQL(context: ExecutionContext) {
    let graphqlContext = GqlExecutionContext.create(context).getContext();
    const authorization = graphqlContext?.req?.headers?.authorization;

    if (!authorization) {
      return false;
    }
    const token: string = this.getToken(authorization);
    graphqlContext.user = this.validateToken(token);
    return true;
  }



  private getToken(authorization: string): string {
    if (authorization.split(' ')[0] != 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }

    return authorization.split(' ')[1];
  }
}
