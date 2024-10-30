CREATE TABLE `admin_sessions` (
	`id` varchar(36) NOT NULL DEFAULT '8d547faa-26e7-4fba-9c6e-8a9ed51d8c50',
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
	`role` enum('ADMIN','SUPER_ADMIN') DEFAULT 'ADMIN',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_email_unique` UNIQUE(`email`),
	CONSTRAINT `emailIdx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`),
	CONSTRAINT `nameIdx` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `likes_id` PRIMARY KEY(`id`),
	CONSTRAINT `postUserIdx` UNIQUE(`postId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `post_categories` (
	`postId` int NOT NULL,
	`categoryId` int NOT NULL,
	CONSTRAINT `postCategoryIdx` UNIQUE(`postId`,`categoryId`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`image` varchar(255) NOT NULL,
	`authorId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` varchar(36) NOT NULL DEFAULT '66c790c6-e234-443a-93d7-19ba09f6e293',
	`expiresAt` timestamp NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_socials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(100) NOT NULL,
	`fullName` varchar(100) NOT NULL,
	`socialId` varchar(255) NOT NULL,
	`socialType` enum('GOOGLE','FACEBOOK') DEFAULT 'GOOGLE',
	`isActive` boolean NOT NULL DEFAULT true,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_socials_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_socials_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(100),
	`fullName` varchar(100),
	`password` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `emailIdx` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `admin_sessions` ADD CONSTRAINT `admin_sessions_adminId_admins_id_fk` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admins` ADD CONSTRAINT `admins_createdBy_admins_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `admins`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_postId_posts_id_fk` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `likes` ADD CONSTRAINT `likes_postId_posts_id_fk` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `likes` ADD CONSTRAINT `likes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_categories` ADD CONSTRAINT `post_categories_postId_posts_id_fk` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post_categories` ADD CONSTRAINT `post_categories_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `posts` ADD CONSTRAINT `posts_authorId_admins_id_fk` FOREIGN KEY (`authorId`) REFERENCES `admins`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_socials` ADD CONSTRAINT `user_socials_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `postUserIdx` ON `comments` (`postId`,`userId`);--> statement-breakpoint
CREATE INDEX `authorIdx` ON `posts` (`authorId`);