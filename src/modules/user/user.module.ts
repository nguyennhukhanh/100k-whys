import type { IRequestContext, ThanhHoa } from '@thanhhoajs/thanhhoa';
import { UserGuard } from 'src/common/middlewares/user-guard.middleware';

import { JwtService } from '../auth/jwt.service';
import { SessionService } from '../session/session.service';
import { UserController } from './user.controller';

export class UserModule {
  constructor(app: ThanhHoa) {
    const sessionService = new SessionService();
    const jwtService = new JwtService(sessionService);
    const guard = new UserGuard(jwtService);
    const userController = new UserController();

    app.get('/user', guard.check, (context: IRequestContext) =>
      userController.getProfile(context),
    );
  }
}
