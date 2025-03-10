-- Table for users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for managers
CREATE TABLE IF NOT EXISTS `managers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `plan` ENUM('FREE', 'PAID1', 'PAID2') DEFAULT 'FREE'
);

-- Table for restaurants
CREATE TABLE IF NOT EXISTS `restaurants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255),
  `description` TEXT,
  `averagePrice` INT CHECK (`averagePrice` BETWEEN 1 AND 3),
  `averageService` INT CHECK (`averageService` BETWEEN 1 AND 3),
  `phoneNumber` VARCHAR(20) CHECK (`phoneNumber` REGEXP '^[0-9+(). -]+$'),
  `plan` ENUM('FREE', 'PAID1', 'PAID2') DEFAULT 'FREE',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ownerId` INT NOT NULL,
  CONSTRAINT `fk_restaurant_owner` FOREIGN KEY (`ownerId`) REFERENCES `managers` (`id`) ON DELETE CASCADE
);

-- Table for photos
CREATE TABLE IF NOT EXISTS `photos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `url` VARCHAR(255) NOT NULL,
  `restaurantId` INT NOT NULL,
  CONSTRAINT `fk_photo_restaurant` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
);

-- Table for tags
CREATE TABLE IF NOT EXISTS `tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE
);

-- Join table for restaurant tags
CREATE TABLE IF NOT EXISTS `restaurant_tags` (
  `restaurantId` INT NOT NULL,
  `tagId` INT NOT NULL,
  PRIMARY KEY (`restaurantId`, `tagId`),
  CONSTRAINT `fk_restaurant_tag_restaurant` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_restaurant_tag_tag` FOREIGN KEY (`tagId`) REFERENCES `tags` (`id`) ON DELETE CASCADE
);

-- Table for menus
CREATE TABLE IF NOT EXISTS `menus` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `item` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) CHECK (`price` >= 0),
  `restaurantId` INT NOT NULL,
  CONSTRAINT `fk_menu_restaurant` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
);

-- Table for favorites
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `restaurantId` INT NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_favorite_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorite_restaurant` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
  UNIQUE (`userId`, `restaurantId`)
);

-- Table for swipes
CREATE TABLE IF NOT EXISTS `swipes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `restaurantId` INT NOT NULL,
  `liked` BOOLEAN NOT NULL,
  `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_swipe_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_swipe_restaurant` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
  UNIQUE (`userId`, `restaurantId`)
);

-- Table for polls
CREATE TABLE IF NOT EXISTS `polls` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `creatorId` INT NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_poll_creator` FOREIGN KEY (`creatorId`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

-- Table for poll options
CREATE TABLE IF NOT EXISTS `poll_options` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pollId` INT NOT NULL,
  `restaurantId` INT NOT NULL,
  CONSTRAINT `fk_poll_option_poll` FOREIGN KEY (`pollId`) REFERENCES `polls` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_poll_option_restaurant` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
  UNIQUE (`pollId`, `restaurantId`)
);

-- Join table for poll participants
CREATE TABLE IF NOT EXISTS `poll_participants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pollId` INT NOT NULL,
  `userId` INT NOT NULL,
  CONSTRAINT `fk_poll_participant_poll` FOREIGN KEY (`pollId`) REFERENCES `polls` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_poll_participant_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  UNIQUE (`pollId`, `userId`)
);

CREATE TABLE IF NOT EXISTS `poll_votes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pollId` INT NOT NULL,
  `userId` INT NOT NULL,
  `optionId` INT NOT NULL,
  `vote` BOOLEAN NOT NULL,
  CONSTRAINT `fk_poll_vote_poll` FOREIGN KEY (`pollId`) REFERENCES `polls` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_poll_vote_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_poll_vote_option` FOREIGN KEY (`optionId`) REFERENCES `poll_options` (`id`) ON DELETE CASCADE,
  UNIQUE (`pollId`, `userId`),
  UNIQUE (`userId`, `optionId`)
);

-- Table for friends
CREATE TABLE IF NOT EXISTS `friends` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user1Id` INT NOT NULL,
  `user2Id` INT NOT NULL,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` ENUM('pending', 'accept', 'reject') DEFAULT 'pending',
  UNIQUE (`user1Id`, `user2Id`),
  CONSTRAINT `fk_friend_user1` FOREIGN KEY (`user1Id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_friend_user2` FOREIGN KEY (`user2Id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

ALTER TABLE `users` ADD COLUMN `socketId` VARCHAR(255) NULL;
