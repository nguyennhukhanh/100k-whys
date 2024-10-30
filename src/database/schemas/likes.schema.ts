import {
  int,
  mysqlTable,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';

import { posts } from './posts.schema';
import { users } from './users.schema';

export const likes = mysqlTable(
  'likes',
  {
    id: int().primaryKey().autoincrement(),
    postId: int()
      .notNull()
      .references(() => posts.id),
    userId: int()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => {
    return {
      postUserIndex: uniqueIndex('postUserIdx').on(table.postId, table.userId),
    };
  },
);
