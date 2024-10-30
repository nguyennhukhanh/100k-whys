import {
  index,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

import { admins } from './admins.schema';

export const posts = mysqlTable(
  'posts',
  {
    id: int().primaryKey().autoincrement(),
    title: varchar({ length: 255 }).notNull(),
    content: text().notNull(),
    image: varchar({ length: 255 }).notNull(),
    authorId: int()
      .notNull()
      .references(() => admins.id, { onDelete: 'cascade' }),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (table) => {
    return {
      authorIndex: index('authorIdx').on(table.authorId),
    };
  },
);
