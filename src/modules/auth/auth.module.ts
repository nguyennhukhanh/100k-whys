import type { IRequestContext, ThanhHoa } from '@thanhhoajs/thanhhoa';
import { UserRefreshTokenGuard } from 'src/common/middlewares/user-refresh-token-guard.middleware';

import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';
import { JwtService } from './jwt.service';

export class AuthModule {
  constructor(app: ThanhHoa) {
    const userService = new UserService();
    const sessionService = new SessionService();
    const hashService = new HashService();
    const jwtService = new JwtService(sessionService);
    const authService = new AuthService(
      userService,
      hashService,
      jwtService,
      sessionService,
    );
    const authController = new AuthController(authService);
    const guard = new UserRefreshTokenGuard(jwtService);

    app.post('/auth/login', (context: IRequestContext) =>
      authController.login(context),
    );

    app.post('/auth/register', (context: IRequestContext) =>
      authController.register(context),
    );

    app.get('/auth/logout', guard.check, (context: IRequestContext) =>
      authController.logout(context),
    );

    app.get('/auth/refresh-token', guard.check, (context: IRequestContext) =>
      authController.refreshToken(context),
    );
  }
}
