import { HttpException } from '@thanhhoajs/thanhhoa';
import type { SQL } from 'drizzle-orm';
import {
  and,
  asc,
  desc,
  eq,
  gte,
  isNull,
  like,
  lte,
  or,
  sql,
} from 'drizzle-orm';
import type { MySqlSelect } from 'drizzle-orm/mysql-core';
import { db } from 'src/database/db';
import { posts } from 'src/database/schemas/posts.schema';
import { SortEnum } from 'src/shared/enums';
import { deleteFile, uploadFile } from 'src/utils/file-local';
import { paginate, type PaginatedResult } from 'src/utils/paginate';

import type { RedisService } from '../services/redis.service';
import { admins } from './../../database/schemas/admins.schema';
import type { PostCreate } from './dto/post.create';
import type { PostQuery } from './dto/post.query';
import type { PostUpdate } from './dto/post.update';

export class PostService {
  constructor(private readonly redisService: RedisService) {}

  async getPostsWithPagination<T>(
    query: PostQuery,
  ): Promise<PaginatedResult<T>> {
    const key = `posts:${JSON.stringify(query)}`;

    let result = await this.redisService.get(key);
    if (result) return result;

    const queryBuilder = db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        mediaUrl: posts.mediaUrl,
        author: {
          id: sql`${admins.id} as authorId`,
          fullName: admins.fullName,
        },
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .innerJoin(admins, eq(posts.authorId, admins.id));

    const filters: SQL[] = [isNull(posts.deletedAt)];
    const {
      search,
      fromDate,
      toDate,
      sort,
      authorId,
      page = 1,
      limit = 10,
    } = query;

    if (search) {
      filters.push(
        or(
          like(posts.title, `%${search}%`),
          like(posts.content, `%${search}%`),
          like(admins.fullName, `%${search}%`),
        ) as SQL,
      );
    }
    if (authorId) filters.push(eq(posts.authorId, authorId));
    if (fromDate) filters.push(gte(posts.createdAt, fromDate));
    if (toDate) filters.push(lte(posts.createdAt, toDate));

    if (filters.length > 0) {
      queryBuilder.where(and(...filters));
    }

    if (sort) {
      (queryBuilder as unknown as MySqlSelect).orderBy(
        sort === SortEnum.ASC ? asc(posts.createdAt) : desc(posts.createdAt),
      );
    }

    result = await paginate(db, queryBuilder, page, limit);

    await this.redisService.set(key, result, 60); // 1 minute

    return result;
  }

  async getPostById(id: string) {
    const key = `post:${id}`;
    const result = await this.redisService.get(key);
    if (result) return result;

    const [postExist] = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        mediaUrl: posts.mediaUrl,
        author: {
          id: sql`${admins.id} as authorId`,
          fullName: admins.fullName,
        },
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .innerJoin(admins, eq(posts.authorId, admins.id))
      .where(and(eq(posts.id, id), isNull(posts.deletedAt)))
      .limit(1);

    if (!postExist) {
      throw new HttpException('Post not found', 404);
    }

    await this.redisService.set(key, postExist, 60); // 1 minute

    return postExist;
  }

  async createPost(author: { id: number }, dto: PostCreate) {
    const { title, content, file } = dto;

    const filePath = await uploadFile(file, 'images');

    const newPost = await db
      .insert(posts)
      .values({
        title,
        content,
        mediaUrl: filePath,
        authorId: author.id,
      })
      .$returningId();
    return {
      id: newPost[0].id,
      title,
      content,
      mediaUrl: filePath,
    };
  }

  async updatePost(
    author: { id: number },
    id: string,
    dto: PostUpdate,
  ): Promise<boolean> {
    const { title, content, file } = dto;

    const [postExist] = await db
      .select({ id: posts.id, mediaUrl: posts.mediaUrl })
      .from(posts)
      .where(and(eq(posts.id, id), eq(posts.authorId, author.id)))
      .limit(1);
    if (!postExist) {
      throw new HttpException('Post not found', 404);
    }

    let isUpdated = false;

    if (file) {
      const filePath = await uploadFile(file, 'images');
      const result = await db
        .update(posts)
        .set({ title, content, mediaUrl: filePath })
        .where(eq(posts.id, id));

      isUpdated = result[0].affectedRows > 0;
    } else {
      const result = await db
        .update(posts)
        .set({ title, content })
        .where(eq(posts.id, id));

      isUpdated = result[0].affectedRows > 0;
    }

    if (isUpdated) deleteFile(postExist.mediaUrl);

    return isUpdated;
  }

  async softDeletePost(author: { id: number }, id: string): Promise<boolean> {
    const [postExist] = await db
      .select({ id: posts.id, mediaUrl: posts.mediaUrl })
      .from(posts)
      .where(
        and(
          eq(posts.id, id),
          eq(posts.authorId, author.id),
          isNull(posts.deletedAt),
        ),
      )
      .limit(1);
    if (!postExist) {
      throw new HttpException('Post not found', 404);
    }

    const result = await db
      .update(posts)
      .set({ deletedAt: new Date() })
      .where(eq(posts.id, id));

    if (result[0].affectedRows > 0) deleteFile(postExist.mediaUrl);

    return result[0].affectedRows > 0;
  }
}
