ALTER TABLE `admin_sessions` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT '62d30e57-b430-4a61-8dfb-66b388f2fa09';--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT '60e9c2e7-0df9-429e-876f-45779acedbde';--> statement-breakpoint
ALTER TABLE `posts` ADD `mediaUrl` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` DROP COLUMN `image`;