CREATE TABLE `admin_sessions` (
	`id` varchar(36) NOT NULL DEFAULT 'f9b59862-74ce-4614-af6d-7137eaab7409',
	`expiresAt` timestamp NOT NULL,
	`adminId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `admins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(100),
	`fullName` varchar(100),
	`password` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_email_unique` UNIQUE(`email`),
	CONSTRAINT `email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `id` varchar(36) NOT NULL DEFAULT '38307702-75d4-47f6-bd30-b23a4f85b8c1';--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `expiresAt` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `user_socials` ADD `socialType` enum('GOOGLE','FACEBOOK') DEFAULT 'GOOGLE';--> statement-breakpoint
ALTER TABLE `admin_sessions` ADD CONSTRAINT `admin_sessions_adminId_admins_id_fk` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admins` ADD CONSTRAINT `admins_createdBy_admins_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `admins`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_socials` DROP COLUMN `social_auth_enum`;