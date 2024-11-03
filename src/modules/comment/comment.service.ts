import { HttpException } from '@thanhhoajs/thanhhoa';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import { comments } from 'src/database/schemas/comments.schema';
import { users } from 'src/database/schemas/users.schema';
import type { CommonQuery } from 'src/shared/dto/common.query';
import { paginate, type PaginatedResult } from 'src/utils/paginate';

import type { PostService } from '../post/post.service';
import type { RedisService } from '../services/redis.service';
import type { CommentCreate } from './dto/comment.create';

export class CommentService {
  constructor(
    private readonly postService: PostService,
    private readonly redisService: RedisService,
  ) {}
  async getCommentsByPostId<T>(
    postId: string,
    query: CommonQuery,
  ): Promise<PaginatedResult<T>> {
    const key = `comments:${JSON.stringify(query)}-postId:${postId}`;

    let result = await this.redisService.get(key);
    if (result) return result;

    const queryBuilder = db
      .select({
        id: comments.id,
        postId: comments.postId,
        parentId: comments.parentId,
        responder: {
          id: sql`${users.id} as responderId`,
          fullName: users.fullName,
        },
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(and(eq(comments.postId, postId), isNull(comments.parentId)))
      .orderBy(desc(comments.createdAt));

    const { page = 1, limit = 10 } = query;

    result = await paginate(db, queryBuilder, page, limit);

    await this.redisService.set(key, result, 5); // 5 seconds

    return result;
  }

  async getCommentByParentCommentId(commentId: number, query: CommonQuery) {
    const key = `comments:${JSON.stringify(query)}-commentId:${commentId}`;

    let result = await this.redisService.get(key);
    if (result) return result;

    const queryBuilder = db
      .select({
        id: comments.id,
        postId: comments.postId,
        parentId: comments.parentId,
        responder: {
          id: sql`${users.id} as responderId`,
          fullName: users.fullName,
        },
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.parentId, commentId))
      .orderBy(desc(comments.createdAt));

    const { page = 1, limit = 10 } = query;

    result = await paginate(db, queryBuilder, page, limit);

    await this.redisService.set(key, result, 5); // 5 seconds

    return result;
  }

  async createCommentByPostId(
    user: { id: number },
    postId: string,
    dto: CommentCreate,
  ) {
    await this.postService.getPostById(postId);

    const result = await db
      .insert(comments)
      .values({ userId: user.id, postId, ...dto })
      .$returningId();

    return {
      id: result[0].id,
      ...dto,
    };
  }

  async createCommentByParentCommentId(
    user: { id: number },
    commentId: number,
    dto: CommentCreate,
  ) {
    const [parentComment] = await db
      .select({
        id: comments.id,
        postId: comments.postId,
      })
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (!parentComment) {
      throw new HttpException(`Comment with ID ${commentId} not found`, 404);
    }

    const postId = parentComment.postId;

    const result = await db
      .insert(comments)
      .values({ userId: user.id, postId, parentId: commentId, ...dto })
      .$returningId();

    return {
      id: result[0].id,
      ...dto,
    };
  }

  async updateComment(
    user: { id: number },
    id: number,
    dto: CommentCreate,
  ): Promise<boolean> {
    const [commentExist] = await db
      .select({ id: comments.id })
      .from(comments)
      .where(and(eq(comments.id, id), eq(comments.userId, user.id)))
      .limit(1);
    if (!commentExist) {
      throw new HttpException('Comment not found', 404);
    }

    const result = await db
      .update(comments)
      .set({ content: dto.content })
      .where(and(eq(comments.id, id), eq(comments.userId, user.id)));

    return result[0].affectedRows > 0;
  }

  async deleteComment(user: { id: number }, id: number) {
    const [commentExist] = await db
      .select({ id: comments.id })
      .from(comments)
      .where(and(eq(comments.id, id), eq(comments.userId, user.id)))
      .limit(1);
    if (!commentExist) {
      throw new HttpException('Comment not found', 404);
    }

    const result = await db.delete(comments).where(eq(comments.id, id));

    return result[0].affectedRows > 0;
  }
}
