import type { SQL } from 'drizzle-orm';
import { and, asc, desc, eq, gte, ilike, lte, sql } from 'drizzle-orm';
import type { MySqlSelect } from 'drizzle-orm/mysql-core';
import { db } from 'src/database/db';
import { posts } from 'src/database/schemas/posts.schema';
import { SortEnum } from 'src/shared/enums';
import { uploadFile } from 'src/utils/file-upload-local';
import { paginate, type PaginatedResult } from 'src/utils/paginate';

import { admins } from './../../database/schemas/admins.schema';
import type { PostCreate } from './dto/post.create';
import type { PostQuery } from './dto/post.query';

export class PostService {
  constructor() {}

  async getItemsWithPagination<T>(
    query: PostQuery,
  ): Promise<PaginatedResult<T>> {
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

    const filters: SQL[] = [];
    const {
      search,
      fromDate,
      toDate,
      sort,
      authorId,
      page = 1,
      limit = 10,
    } = query;

    if (search) filters.push(ilike(posts.title, `%${search}%`));
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

    return await paginate(db, queryBuilder, page, limit);
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
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();
    return {
      id: newPost[0].id,
      title,
      content,
      mediaUrl: filePath,
    };
  }
}
