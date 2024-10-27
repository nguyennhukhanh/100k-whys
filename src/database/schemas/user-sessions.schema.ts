import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { v4 as uuidv4 } from 'uuid';

import { users } from './users.schema';

export const userSessions = mysqlTable('user_sessions', {
  id: varchar({ length: 36 }).primaryKey().default(uuidv4()),
  expiresAt: timestamp()
    .notNull()
    .default(
      new Date(
        Date.now() + Number(process.env.USER_REFRESH_TOKEN_LIFETIME) * 1000,
      ),
    ),
  userId: int()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
});
