CREATE DATABASE IF NOT EXISTS photos_db;

USE photos_db;

CREATE TABLE IF NOT EXISTS `photos_db`.`users` (
  `id` CHAR(8) NOT NULL,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `privilege` CHAR(1) NULL DEFAULT 'R',
  `profilePhotoPath` VARCHAR(100) NULL,
  `profilePhotoPathThumb` VARCHAR(100) NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `photos_db`.`files` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` CHAR(8) NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `filePath` VARCHAR(100) NOT NULL,
  `filePathThumb` VARCHAR(100) NOT NULL,
  `uploadedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  INDEX `fk_files_users_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_files_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `photos_db`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT INTO `photos_db`.`users` VALUES (
  '00000000', 'admin', 'admin', 'admin@email.com', '$2b$10$KYEDKvhgO/6N0iUqh.jOM.7UTLD4l9IokdiWTwUvh17TfweSmaTWi', 'A', 'public\default\default_profile.svg', 'public/default/default_profile.svg', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
);