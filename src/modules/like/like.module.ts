import type { IRequestContext, ThanhHoa } from '@thanhhoajs/thanhhoa';
import { RoleEnum } from 'src/shared/enums';

import { GUARD } from '../services/guard.service';
import { postService } from '../services/shared.service';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

export class LikeModule {
  constructor(app: ThanhHoa) {
    const likeService = new LikeService(postService);
    const likeController = new LikeController(likeService);

    app.group('/like', (app) => {
      app.get('/:postId', GUARD(RoleEnum.USER), (context: IRequestContext) =>
        likeController.isLikedPost(context),
      );

      app.post('/:postId', GUARD(RoleEnum.USER), (context: IRequestContext) =>
        likeController.likePost(context),
      );
    });

    app.group('/unlike', (app) => {
      app.post('/:postId', GUARD(RoleEnum.USER), (context: IRequestContext) =>
        likeController.unlikePost(context),
      );
    });
  }
}
