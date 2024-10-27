import { Logger } from '@thanhhoajs/logger';
import type { ThanhHoa } from '@thanhhoajs/thanhhoa';

import { AuthModule } from './auth/auth.module';
import { DefaultModule } from './default/default.module';
import { UserModule } from './user/user.module';

const logger = Logger.get('RESPONSE');

export class AppModule {
  constructor(app: ThanhHoa) {
    new DefaultModule(app);
    new AuthModule(app);
    new UserModule(app);
  }
}
