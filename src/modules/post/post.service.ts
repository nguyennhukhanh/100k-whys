import { HttpException } from '@thanhhoajs/thanhhoa';
import type { SQL } from 'drizzle-orm';
import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  isNull,
  like,
  lte,
  or,
  sql,
} from 'drizzle-orm';
import { type MySqlSelect } from 'drizzle-orm/mysql-core';
import { db } from 'src/database/db';
import { categories } from 'src/database/schemas/categories.schema';
import { postCategories } from 'src/database/schemas/post-categories.schema';
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
    if (fromDate) filters.push(gte(posts.publishedAt, fromDate));
    if (toDate) filters.push(lte(posts.publishedAt, toDate));

    if (filters.length > 0) {
      queryBuilder.where(and(...filters));
    }

    if (sort) {
      (queryBuilder as unknown as MySqlSelect).orderBy(
        sort === SortEnum.ASC
          ? asc(posts.publishedAt)
          : desc(posts.publishedAt),
      );
    } else {
      {
        (queryBuilder as unknown as MySqlSelect).orderBy(sql`RAND()`);
      }
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
    const { title, content, categoryIds, publishedAt, file } = dto;

    const [filePath, categoriesExist] = await Promise.all([
      uploadFile(file, 'images'),
      db
        .select({ id: categories.id })
        .from(categories)
        .where(inArray(categories.id, categoryIds)),
    ]);

    if (categoriesExist.length < categoryIds.length) {
      throw new HttpException('Category not found', 404);
    }

    const newPostId = await db
      .insert(posts)
      .values({
        title,
        content,
        mediaUrl: filePath,
        publishedAt: publishedAt || new Date(),
        authorId: author.id,
      })
      .$returningId();

    await db.insert(postCategories).values(
      categoryIds.map((categoryId) => ({
        postId: newPostId[0].id,
        categoryId,
      })),
    );

    return {
      id: newPostId[0].id,
      title,
      content,
      mediaUrl: filePath,
      publishedAt,
    };
  }

  async updatePost(
    author: { id: number },
    id: string,
    dto: PostUpdate,
  ): Promise<boolean> {
    const { title, content, categoryIds, publishedAt, file } = dto;

    const [postExist] = await db
      .select({ id: posts.id, mediaUrl: posts.mediaUrl })
      .from(posts)
      .where(and(eq(posts.id, id), eq(posts.authorId, author.id)))
      .limit(1);

    if (!postExist) {
      throw new HttpException('Post not found', 404);
    }

    const updates = { title, content, publishedAt } as any;
    let filePath;
    if (file) {
      filePath = await uploadFile(file, 'images');
      updates.mediaUrl = filePath;
    }

    const result = await db.update(posts).set(updates).where(eq(posts.id, id));

    const isUpdated = result[0].affectedRows > 0;

    if (isUpdated && categoryIds) {
      const categoriesExist = await db
        .select({ id: categories.id })
        .from(categories)
        .where(inArray(categories.id, categoryIds));

      if (categoriesExist.length < categoryIds.length) {
        throw new HttpException('Category not found', 404);
      }

      await db.transaction(async (trx) => {
        await trx.delete(postCategories).where(eq(postCategories.postId, id));
        await trx.insert(postCategories).values(
          categoryIds.map((categoryId) => ({
            postId: id,
            categoryId,
          })),
        );
      });
    }

    if (isUpdated && file) {
      deleteFile(postExist.mediaUrl);
    }

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
