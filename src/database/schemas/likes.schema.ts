import {
  int,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';

import { posts } from './posts.schema';
import { users } from './users.schema';

export const likes = mysqlTable(
  'likes',
  {
    id: int().primaryKey().autoincrement(),
    postId: varchar({ length: 36 })
      .notNull()
      .references(() => posts.id),
    userId: int()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp({ mode: 'date' })
      .notNull()
      .$default(() => new Date()),
  },
  (table) => {
    return {
      postUserIndex: uniqueIndex('postUserIdx').on(table.postId, table.userId),
    };
  },
);
