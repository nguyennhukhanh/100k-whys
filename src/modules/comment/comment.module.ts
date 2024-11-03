import type { IRequestContext, ThanhHoa } from '@thanhhoajs/thanhhoa';
import { RoleEnum } from 'src/shared/enums';

import { GUARD } from '../services/guard.service';
import { postService, redisService } from '../services/shared.service';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

export class CommentModule {
  constructor(app: ThanhHoa) {
    const commentService = new CommentService(postService, redisService);
    const commentController = new CommentController(commentService);

    app.group('/comment', (app) => {
      app.group('/p', (app) => {
        app.get('/:postId', (context: IRequestContext) =>
          commentController.getCommentsByPostId(context),
        );

        app.post('/:postId', GUARD(RoleEnum.USER), (context: IRequestContext) =>
          commentController.createCommentByPostId(context),
        );
      });

      app.group('/c', (app) => {
        app.get('/:commentId', (context: IRequestContext) =>
          commentController.getCommentByParentCommentId(context),
        );

        app.post(
          '/:commentId',
          GUARD(RoleEnum.USER),
          (context: IRequestContext) =>
            commentController.createCommentByParentCommentId(context),
        );
      });

      app.put('/:commentId', GUARD(RoleEnum.USER), (context: IRequestContext) =>
        commentController.updateComment(context),
      );

      app.delete(
        '/:commentId',
        GUARD(RoleEnum.USER),
        (context: IRequestContext) => commentController.deleteComment(context),
      );
    });
  }
}
