import {
  index,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { v4 as uuidv4 } from 'uuid';

import { admins } from './admins.schema';

export const posts = mysqlTable(
  'posts',
  {
    id: varchar({ length: 36 })
      .primaryKey()
      .$default(() => uuidv4()),
    title: varchar({ length: 255 }).notNull(),
    content: text().notNull(),
    mediaUrl: varchar({ length: 255 }).notNull(),
    authorId: int()
      .notNull()
      .references(() => admins.id, { onDelete: 'cascade' }),
    publishedAt: timestamp({ mode: 'date' }).notNull(),
    createdAt: timestamp({ mode: 'date' })
      .notNull()
      .$default(() => new Date()),
    updatedAt: timestamp({ mode: 'date' })
      .notNull()
      .$default(() => new Date()),
    deletedAt: timestamp(),
  },
  (table) => {
    return {
      authorIndex: index('authorIdx').on(table.authorId),
    };
  },
);
