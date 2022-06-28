CREATE DATABASE `tripledb_development` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
CREATE TABLE `mileagehistory` (
  `historyId` char(36) CHARACTER SET utf8mb3 COLLATE utf8_bin NOT NULL,
  `type` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb3 COLLATE utf8_bin NOT NULL,
  `reviewId` char(36) CHARACTER SET utf8mb3 COLLATE utf8_bin NOT NULL,
  `placeId` char(36) CHARACTER SET utf8mb3 COLLATE utf8_bin NOT NULL,
  `hasText` tinyint(1) DEFAULT '0',
  `hasPhoto` tinyint(1) DEFAULT '0',
  `isFirst` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`historyId`),
  UNIQUE KEY `historyId` (`historyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
CREATE TABLE `user` (
  `userId` char(36) CHARACTER SET utf8mb3 COLLATE utf8_bin NOT NULL,
  `name` varchar(100) NOT NULL,
  `mileage` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
