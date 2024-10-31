import { int, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

import { categories } from './categories.schema';
import { posts } from './posts.schema';

export const postCategories = mysqlTable(
  'post_categories',
  {
    postId: varchar({ length: 36 })
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
