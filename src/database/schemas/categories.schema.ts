import {
  int,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';

export const categories = mysqlTable(
  'categories',
  {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 100 }).notNull().unique(),
    description: text(),
  },
  (table) => {
    return {
      nameIndex: uniqueIndex('nameIdx').on(table.name),
    };
  },
);
