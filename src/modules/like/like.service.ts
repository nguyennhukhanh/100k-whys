import { HttpException } from '@thanhhoajs/thanhhoa';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { likes } from 'src/database/schemas/likes.schema';

import type { PostService } from './../post/post.service';

export class LikeService {
  constructor(private readonly postService: PostService) {}
  async isLikedPost(user: { id: number }, postId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, user.id)))
      .limit(1);

    return result.length > 0;
  }
  async likePost(user: { id: number }, postId: string): Promise<boolean> {
    const [, isLiked] = await Promise.all([
      this.postService.getPostById(postId),
      this.isLikedPost(user, postId),
    ]);

    if (isLiked) {
      throw new HttpException('You already like this post', 400);
    }

    const result = await db.insert(likes).values({ postId, userId: user.id });

    return result[0].affectedRows > 0;
  }

  async unlikePost(user: { id: number }, postId: string): Promise<boolean> {
    const isLiked = await this.isLikedPost(user, postId);
    if (!isLiked) throw new HttpException('You have not liked this post', 400);

    const result = await db
      .delete(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, user.id)));

    return result[0].affectedRows > 0;
  }
}
