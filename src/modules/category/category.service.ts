import { HttpException } from '@thanhhoajs/thanhhoa';
import type { SQL } from 'drizzle-orm';
import { and, asc, desc, eq, like, or } from 'drizzle-orm';
import type { MySqlSelect } from 'drizzle-orm/mysql-core';
import { db } from 'src/database/db';
import { categories } from 'src/database/schemas/categories.schema';
import { SortEnum } from 'src/shared/enums';
import { paginate, type PaginatedResult } from 'src/utils/paginate';

import type { RedisService } from '../services/redis.service';
import type { CategoryCreate } from './dto/category.create';
import type { CategoryQuery } from './dto/category.query';
import type { CategoryUpdate } from './dto/category.update';

export class CategoryService {
  constructor(private readonly redisService: RedisService) {}

  async getCategoriesWithPagination<T>(
    query: CategoryQuery,
  ): Promise<PaginatedResult<T>> {
    const key = `categories:${JSON.stringify(query)}`;

    let result = await this.redisService.get(key);
    if (result) return result;

    const queryBuilder = db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
      })
      .from(categories);

    const filters: SQL[] = [];
    const { search, fromDate, toDate, sort, page = 1, limit = 10 } = query;

    if (search) {
      filters.push(
        or(
          like(categories.name, `%${search}%`),
          like(categories.description, `%${search}%`),
        ) as SQL,
      );
    }
    if (fromDate || toDate) {
      throw new HttpException('Not implemented', 501);
    }

    if (filters.length > 0) {
      queryBuilder.where(and(...filters));
    }

    if (sort) {
      (queryBuilder as unknown as MySqlSelect).orderBy(
        sort === SortEnum.ASC ? asc(categories.name) : desc(categories.name),
      );
    }

    result = await paginate(db, queryBuilder, page, limit);

    await this.redisService.set(key, result, 60); // 1 minute

    return result;
  }

  async getCategory(params: { id?: number; name?: string }) {
    const { id, name } = params;
    const key = id ? `category:${id}` : `category:${name}`;

    const result = await this.redisService.get(key);
    if (result) return result;

    const [categoryExist] = await db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
      })
      .from(categories)
      .where(id ? eq(categories.id, id) : like(categories.name, `%${name}%`))
      .limit(1);

    if (!categoryExist) {
      throw new HttpException('Category not found', 404);
    }

    await this.redisService.set(key, categoryExist, 60); // 1 minute

    return categoryExist;
  }

  async createCategory(dto: CategoryCreate) {
    const { name, description } = dto;

    const [categoryExist] = await db
      .select({
        id: categories.id,
      })
      .from(categories)
      .where(eq(categories.name, name))
      .limit(1);

    if (categoryExist) {
      throw new HttpException('Category already exist', 409);
    }

    const newCategory = await db
      .insert(categories)
      .values({
        name,
        description,
      })
      .$returningId();

    return {
      id: newCategory[0].id,
      name,
      description,
    };
  }

  async updateCategory(id: number, dto: CategoryUpdate): Promise<boolean> {
    const { name, description } = dto;

    await this.getCategory({ id });

    const result = await db
      .update(categories)
      .set({ name, description })
      .where(eq(categories.id, id));

    return result[0].affectedRows > 0;
  }

  async deleteCategory(id: number): Promise<boolean> {
    await this.getCategory({ id });

    const result = await db.delete(categories).where(eq(categories.id, id));

    return result[0].affectedRows > 0;
  }
}
