import type { IRequestContext, ThanhHoa } from '@thanhhoajs/thanhhoa';
import { RoleEnum } from 'src/shared/enums';

import { GUARD } from '../services/guard.service';
import { redisService } from '../services/shared.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

export class PostModule {
  constructor(app: ThanhHoa) {
    const postService = new PostService(redisService);
    const postController = new PostController(postService);

    app.group('/post', (app) => {
      app.get('', (context: IRequestContext) =>
        postController.getPostsWithPagination(context),
      );

      app.get('/:id', (context: IRequestContext) =>
        postController.getPostById(context),
      );

      app.post('', GUARD(RoleEnum.ADMIN), (context: IRequestContext) =>
        postController.createPost(context),
      );

      app.patch('/:id', GUARD(RoleEnum.ADMIN), (context: IRequestContext) =>
        postController.updatePost(context),
      );

      app.delete('/:id', GUARD(RoleEnum.ADMIN), (context: IRequestContext) =>
        postController.softDeletePost(context),
      );
    });
  }
}
