import {
  index,
  int,
  mysqlTable,
  text,
  timestamp,
} from 'drizzle-orm/mysql-core';

import { posts } from './posts.schema';
import { users } from './users.schema';

export const comments = mysqlTable(
  'comments',
  {
    id: int().primaryKey().autoincrement(),
    postId: int()
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: int()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    content: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (table) => {
    return {
      postUserIndex: index('postUserIdx').on(table.postId, table.userId),
    };
  },
);
