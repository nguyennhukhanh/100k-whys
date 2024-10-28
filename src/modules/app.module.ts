import type { ThanhHoa } from '@thanhhoajs/thanhhoa';

import { AuthModule } from './auth/auth.module';
import { DefaultModule } from './default/default.module';
import { UserModule } from './user/user.module';

export class AppModule {
  constructor(app: ThanhHoa) {
    new DefaultModule(app);
    new AuthModule(app);
    new UserModule(app);
  }
}
