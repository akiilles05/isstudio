-- AlterTable
ALTER TABLE `Project` ADD COLUMN `content` TEXT NOT NULL,
    ADD COLUMN `image` VARCHAR(300) NULL,
    ADD COLUMN `results` TEXT NULL,
    ADD COLUMN `slug` VARCHAR(120) NOT NULL;

-- CreateTable
CREATE TABLE `Testimonial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order` INTEGER NOT NULL DEFAULT 0,
    `content` TEXT NOT NULL,
    `author` VARCHAR(100) NOT NULL,
    `role` VARCHAR(100) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FAQ` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order` INTEGER NOT NULL DEFAULT 0,
    `question` TEXT NOT NULL,
    `answer` TEXT NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingSlot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL DEFAULT 30,
    `booked` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(120) NULL,
    `email` VARCHAR(200) NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Project_slug_key` ON `Project`(`slug`);

