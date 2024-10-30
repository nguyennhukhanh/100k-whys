import { int, mysqlTable, uniqueIndex } from 'drizzle-orm/mysql-core';

import { categories } from './categories.schema';
import { posts } from './posts.schema';

export const postCategories = mysqlTable(
  'post_categories',
  {
    postId: int()
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    categoryId: int()
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      postCategoryIndex: uniqueIndex('postCategoryIdx').on(
        table.postId,
        table.categoryId,
      ),
    };
  },
);
