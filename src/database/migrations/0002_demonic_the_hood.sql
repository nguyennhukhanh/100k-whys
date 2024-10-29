ALTER TABLE `admin_sessions` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT 'bf871f87-f39c-4749-a3a4-6d3551ddc4b9';--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT 'e03b4f56-7259-4f86-ba7a-cfa9830dd392';--> statement-breakpoint
ALTER TABLE `admins` ADD `role` enum('ADMIN','SUPER_ADMIN') DEFAULT 'ADMIN';