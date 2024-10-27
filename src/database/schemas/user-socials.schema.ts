import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

import { users } from './users.schema';

export const userSocials = mysqlTable('user_socials', {
  id: int().primaryKey().autoincrement(),
  email: varchar({ length: 100 }).notNull().unique(),
  fullName: varchar({ length: 100 }).notNull(),
  socialId: varchar({ length: 255 }).notNull(),
  socialType: mysqlEnum('social_auth_enum', ['GOOGLE', 'FACEBOOK']).default(
    'GOOGLE',
  ),
  isActive: boolean().notNull().default(true),
  userId: int()
    .notNull()
    .references(() => users.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});
