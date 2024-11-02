import type { IRequestContext, ThanhHoa } from '@thanhhoajs/thanhhoa';
import { AdminRefreshTokenGuard } from 'src/common/middlewares/admin-refresh-token-guard.middleware';
import { UserRefreshTokenGuard } from 'src/common/middlewares/user-refresh-token-guard.middleware';
import { RoleEnum } from 'src/shared/enums';

import { AdminService } from '../admin/admin.service';
import { GUARD, ROLE_GUARD } from '../services/guard.service';
import {
  hashService,
  jwtService,
  sessionService,
} from '../services/shared.service';
import { UserService } from '../user/user.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';

export class AuthModule {
  constructor(app: ThanhHoa) {
    const userService = new UserService();
    const adminService = new AdminService();
    const userAuthService = new UserAuthService(
      userService,
      hashService,
      jwtService,
      sessionService,
    );
    const adminAuthService = new AdminAuthService(
      adminService,
      hashService,
      jwtService,
      sessionService,
    );
    const userAuthController = new UserAuthController(userAuthService);
    const adminAuthController = new AdminAuthController(adminAuthService);
    const userRefreshTokenGuard = new UserRefreshTokenGuard(jwtService);
    const adminRefreshTokenGuard = new AdminRefreshTokenGuard(jwtService);

    app.group('/user', (app) => {
      app.post('/auth/login', (context: IRequestContext) =>
        userAuthController.login(context),
      );

      app.post('/auth/register', (context: IRequestContext) =>
        userAuthController.register(context),
      );

      app.get(
        '/auth/logout',
        userRefreshTokenGuard.check,
        (context: IRequestContext) => userAuthController.logout(context),
      );

      app.get(
        '/auth/refresh-token',
        userRefreshTokenGuard.check,
        (context: IRequestContext) => userAuthController.refreshToken(context),
      );
    });

    app.group('/admin', (app) => {
      app.post('/auth/login', (context: IRequestContext) =>
        adminAuthController.login(context),
      );

      app.post(
        '/auth/register',
        GUARD(RoleEnum.ADMIN),
        ROLE_GUARD(RoleEnum.SUPER_ADMIN),
        (context: IRequestContext) => adminAuthController.register(context),
      );

      app.get(
        '/auth/logout',
        adminRefreshTokenGuard.check,
        (context: IRequestContext) => adminAuthController.logout(context),
      );

      app.get(
        '/auth/refresh-token',
        adminRefreshTokenGuard.check,
        (context: IRequestContext) => adminAuthController.refreshToken(context),
      );
    });
  }
}
