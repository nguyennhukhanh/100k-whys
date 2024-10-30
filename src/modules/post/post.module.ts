import type { IRequestContext, ThanhHoa } from '@thanhhoajs/thanhhoa';
import { RoleEnum } from 'src/shared/enums';

import { GUARD } from '../services/guard.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

export class PostModule {
  constructor(app: ThanhHoa) {
    const postService = new PostService();
    const postController = new PostController(postService);

    app.get('/post', (context: IRequestContext) =>
      postController.getItemsWithPagination(context),
    );

    app.post('/post', GUARD(RoleEnum.ADMIN), (context: IRequestContext) =>
      postController.createPost(context),
    );
  }
}
