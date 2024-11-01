import type { ThanhHoa } from '@thanhhoajs/thanhhoa';

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { DefaultModule } from './default/default.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

export class AppModule {
  constructor(app: ThanhHoa) {
    new DefaultModule(app);
    new AuthModule(app);
    new AdminModule(app);
    new UserModule(app);
    new PostModule(app);
    new CategoryModule(app);
  }
}
