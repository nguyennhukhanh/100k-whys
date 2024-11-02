import {
  type AnyMySqlColumn,
  index,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

import { posts } from './posts.schema';
import { users } from './users.schema';

export const comments = mysqlTable(
  'comments',
  {
    id: int().primaryKey().autoincrement(),
    postId: varchar({ length: 36 })
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: int()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    parentId: int().references((): AnyMySqlColumn => comments.id, {
      onDelete: 'cascade',
    }),
    content: text().notNull(),
    createdAt: timestamp({ mode: 'date' })
      .notNull()
      .$default(() => new Date()),
    updatedAt: timestamp({ mode: 'date' })
      .notNull()
      .$default(() => new Date()),
  },
  (table) => {
    return {
      postUserIndex: index('postUserIdx').on(table.postId, table.userId),
      parentIndex: index('parentIdx').on(table.parentId),
    };
  },
);
