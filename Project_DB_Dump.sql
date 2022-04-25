CREATE DATABASE  IF NOT EXISTS `testdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `testdb`;
-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: project-db.cy9yp9l7shrh.us-east-2.rds.amazonaws.com    Database: testdb
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `assigned_to`
--

DROP TABLE IF EXISTS `assigned_to`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assigned_to` (
  `pid` char(32) DEFAULT NULL,
  `eid` char(32) DEFAULT NULL,
  `tid` char(32) DEFAULT NULL,
  `hours` int DEFAULT '0',
  `access` enum('projectLead','taskEdit','taskModify','viewOnly') DEFAULT NULL,
  KEY `pid` (`pid`),
  KEY `tid` (`tid`),
  KEY `eid` (`eid`),
  CONSTRAINT `assigned_to_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `projects` (`project_id`),
  CONSTRAINT `assigned_to_ibfk_2` FOREIGN KEY (`tid`) REFERENCES `tasks` (`task_id`),
  CONSTRAINT `assigned_to_ibfk_3` FOREIGN KEY (`eid`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assigned_to`
--

LOCK TABLES `assigned_to` WRITE;
/*!40000 ALTER TABLE `assigned_to` DISABLE KEYS */;
/*!40000 ALTER TABLE `assigned_to` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cookies`
--

DROP TABLE IF EXISTS `cookies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cookies` (
  `auth_token` char(64) NOT NULL,
  `eid` char(32) DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`auth_token`),
  KEY `cookies_fk` (`eid`),
  CONSTRAINT `cookies_fk` FOREIGN KEY (`eid`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cookies`
--

LOCK TABLES `cookies` WRITE;
/*!40000 ALTER TABLE `cookies` DISABLE KEYS */;
INSERT INTO `cookies` VALUES ('02eca80a-b5fd-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:58:02'),('13e7f9b8-c1cd-11ec-bd40-843497876c5f','1625DC5EC00001D','2022-04-21 18:45:08'),('148693f0-c13d-11ec-bcc3-843497876c5f','1624766CA000003','2022-04-21 01:34:22'),('156436f0-aef5-11ec-9eed-843497876c5f',NULL,'2022-03-30 11:59:22'),('1f39c966-b613-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 20:36:18'),('2b92ed2d-b613-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 20:36:39'),('2f4b6a52-b5ca-11ec-a5ae-843497876c5f','1624766CA000003','2022-04-06 11:54:12'),('3d6b4460-c1c6-11ec-bd40-843497876c5f','1625DC5EC00001D','2022-04-21 17:56:11'),('48b83c1f-c009-11ec-9a18-843497876c5f','1624766CA000003','2022-04-19 12:51:04'),('4f39cbb9-aef5-11ec-9eed-843497876c5f',NULL,'2022-03-30 11:59:22'),('555c81c1-b510-11ec-a5ae-843497876c5f','1624766CA000001','2022-04-05 13:43:49'),('63ecbf7f-b514-11ec-a5ae-843497876c5f','1624766CA000001','2022-04-05 14:12:52'),('6d24a337-b510-11ec-a5ae-843497876c5f','1624766CA000001','2022-04-05 13:44:29'),('78a9389a-b5f6-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:11:13'),('79a406df-b510-11ec-a5ae-843497876c5f','1624766CA000001','2022-04-05 13:44:50'),('7a2b2ae8-b52c-11ec-a5ae-843497876c5f','1624766CA000001','2022-04-05 17:05:17'),('7bf4dd12-c34a-11ec-842d-0ad12931c6b4','1625DC5EC000017','2022-04-23 21:15:21'),('7c36006f-b5f2-11ec-a5ae-843497876c5f','1624766CA000000','2022-04-06 16:42:41'),('7fde1d6c-b5fc-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:54:22'),('82e2a2b1-b5f6-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:11:30'),('8fb16a07-c34b-11ec-842d-0ad12931c6b4','1625DC5EC000017','2022-04-23 21:23:04'),('915a4bfa-bc3a-11ec-94ac-843497876c5f','1624766CA000003','2022-04-14 16:33:47'),('956709dd-b5fc-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:54:58'),('959cc4b4-c1c7-11ec-bd40-843497876c5f','16261A621000000','2022-04-21 18:05:49'),('9948802a-b5fc-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:55:04'),('9e3c947c-b5f5-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:05:06'),('a0dcae20-b514-11ec-a5ae-843497876c5f','1624766CA000000','2022-04-05 14:14:34'),('a3417276-b5f9-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:33:53'),('a783b3ba-ba8f-11ec-94ac-843497876c5f','1624766CA000003','2022-04-12 13:37:49'),('ad09fc40-c009-11ec-9a18-843497876c5f','1624766CA000003','2022-04-19 12:53:53'),('b41d1583-c1c3-11ec-bd40-843497876c5f','1625DC5EC000019','2022-04-21 17:38:02'),('b6e8f0f6-ba8f-11ec-94ac-843497876c5f','1624766CA000003','2022-04-12 13:38:15'),('b9a87d0f-c1c7-11ec-bd40-843497876c5f','1625DC5EC00001D','2022-04-21 18:06:49'),('be08ffb1-b50f-11ec-a5ae-843497876c5f','1624766CA000001','2022-04-05 13:39:35'),('c00ec248-b5f9-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:34:41'),('c62f5a83-b5f6-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:13:23'),('c974ec77-b510-11ec-a5ae-843497876c5f','1624766CA000001','2022-04-05 13:47:04'),('ca340823-b5fc-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:56:27'),('ca89ac53-c36c-11ec-842d-0ad12931c6b4','1625DC5EC000017','2022-04-24 01:20:56'),('d544623e-b6cb-11ec-94ac-843497876c5f','1624766CA000003','2022-04-07 18:38:31'),('d584a152-b5fc-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:56:46'),('e26dc022-ba8f-11ec-94ac-843497876c5f','1624766CA000003','2022-04-12 13:39:28'),('e9d225f7-b5f6-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:14:23'),('f1eac4a7-b5fc-11ec-94ac-843497876c5f','1624766CA000003','2022-04-06 17:57:33'),('f41a9d36-c053-11ec-9a18-843497876c5f','1624766CA000003','2022-04-19 21:45:35'),('f5d74007-bc3a-11ec-94ac-843497876c5f','1624766CA000003','2022-04-14 16:36:36');
/*!40000 ALTER TABLE `cookies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` char(32) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(155) DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `subdepartment_of` char(16) DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`department_id`),
  KEY `dep_subdep_fk_idx` (`subdepartment_of`),
  CONSTRAINT `dep_subdep_fk` FOREIGN KEY (`subdepartment_of`) REFERENCES `departments` (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES ('16240ADCD000007','dep1',NULL,'3538 test address','spring','tx',NULL,0),('1624766CA000007','Test Department 1',NULL,NULL,NULL,NULL,NULL,0),('1625DC5EC000000','Sales and Marketing','The sales and marketing department has the responsibility to decide how the company should sell and what its p','9959 Wallosvale Rd.','Houston','TX',NULL,0),('1625DC5EC000001','Research','Determine the viability of a new service or product through research conducted directly with potential customers.','9959 Wallosvale Rd.','Houston','TX','1625DC5EC000000',1),('1625DC5EC000002','Support','provide assistance to the sales team to ensure customers are satisfied with the sales department performance.','9959 Wallosvale Rd.','Houston','TX','1625DC5EC000000',1),('1625DC5EC000020','fdsa','fdsaf',NULL,NULL,NULL,'1625DC5EC000000',1),('1625DC5EC000021','fdsa','fds',NULL,NULL,NULL,'1625DC5EC000000',1),('1625DC5EC000022','fdsfdsfds5555','fdsafdsafdsa',NULL,NULL,NULL,'1625DC5EC000000',1),('1625DC5EC00002C','123','8479',NULL,NULL,NULL,'1625DC5EC000000',1),('1625DC5EC00002D','23','',NULL,NULL,NULL,'1625DC5EC000000',1),('1625DC5EC00002E','456','7486',NULL,NULL,NULL,'1625DC5EC000000',1),('1625DC5EC00002F','456','456456',NULL,NULL,NULL,'1625DC5EC000000',1),('1625DC5EC000032','fdsaf69','fadsfdsa',NULL,NULL,NULL,'1625DC5EC000000',1),('1625DC5EC000033','456','46',NULL,NULL,NULL,'1625DC5EC000000',1),('1625DC5EC000034','Research','Determine the viability of a new service or product through research conducted directly with potential customers.',NULL,NULL,NULL,'1625DC5EC000000',0),('1625DC5EC000035','Support','Provide assistance to the sales team to ensure customers are satisfied with the sales department performance.',NULL,NULL,NULL,'1625DC5EC000000',0),('1625DC5EC000036','gfgfds','fdsfds',NULL,NULL,NULL,'1625DC5EC000000',1);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_activity`
--

DROP TABLE IF EXISTS `employee_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_activity` (
  `pid` char(32) DEFAULT '0',
  `eid` char(32) DEFAULT NULL,
  `tid` char(32) DEFAULT '0',
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  KEY `eid` (`eid`),
  KEY `employee_activity_ibfk_1` (`pid`),
  KEY `employee_activity_ibfk_2` (`tid`),
  CONSTRAINT `employee_activity_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `projects` (`project_id`),
  CONSTRAINT `employee_activity_ibfk_2` FOREIGN KEY (`tid`) REFERENCES `tasks` (`task_id`),
  CONSTRAINT `employee_activity_ibfk_3` FOREIGN KEY (`eid`) REFERENCES `employees` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_activity`
--

LOCK TABLES `employee_activity` WRITE;
/*!40000 ALTER TABLE `employee_activity` DISABLE KEYS */;
INSERT INTO `employee_activity` VALUES ('1625DC5EC000003','1624766CA000000','1625DC5EC000005',NULL,'2022-04-05 21:25:48'),('1625DC5EC000003','1624766CA000003','1625DC5EC000005','2022-04-06 21:25:56','2022-04-06 21:25:58'),('1624766CA000019','1624766CA000003','1625DC5EC000005','2022-04-06 21:27:35','2022-04-06 21:30:54'),('1625DC5EC000003','1624766CA000003','1625DC5EC000005','2022-04-14 21:40:39','2022-04-19 23:37:18'),('1625DC5EC000003','1625DC5EC000017','1625DC5EC000005','2022-04-19 23:37:02','2022-04-19 23:37:18'),('1625DC5EC000003','1624766CA000003','1625DC5EC000005','2022-04-20 02:45:53','2022-04-20 02:45:54'),('1625DC5EC000003','1624766CA000003','1625DC5EC000005','2022-04-20 02:45:55','2022-04-20 02:45:56'),('1625DC5EC000003','1624766CA000003','1625DC5EC000005','2022-04-20 02:45:59','2022-04-20 02:46:00'),('1625DC5EC000003','1624766CA000003','1625DC5EC000005','2022-04-20 02:46:02','2022-04-20 02:46:04'),('1625DC5EC000003','1625DC5EC000017','1625DC5EC000005','2022-04-21 04:05:52','2022-04-21 04:06:05'),('0','1625DC5EC000017','0','2022-04-21 04:27:49','2022-04-21 04:27:53'),('0','1625DC5EC000017','0','2022-04-21 04:28:09','2022-04-21 04:28:18'),('0','1625DC5EC000017','0','2022-04-21 04:28:22','2022-04-21 04:28:24'),('1625DC5EC000003','1625DC5EC000017','1625DC5EC000005','2022-04-21 04:45:02','2022-04-21 04:47:15'),('0','1625DC5EC000017','0','2022-04-21 04:49:10','2022-04-21 04:49:18'),('0','1624766CA000003','0','2022-04-21 06:35:55','2022-04-21 06:35:57'),('1625DC5EC000003','1625DC5EC000017','1625DC5EC000005','2022-04-21 17:27:05','2022-04-21 17:27:08'),('1625DC5EC000003','1625DC5EC000017','1625DC5EC000005','2022-04-21 17:27:12','2022-04-21 17:27:16'),(NULL,'1625DC5EC000017',NULL,'2022-04-21 17:31:37','2022-04-21 17:31:38'),(NULL,'1625DC5EC000017',NULL,'2022-04-21 17:31:40','2022-04-21 17:31:41'),(NULL,'1625DC5EC000017',NULL,'2022-04-21 17:31:46','2022-04-21 17:31:47'),(NULL,'1625DC5EC000017',NULL,'2022-04-21 18:28:14','2022-04-21 18:28:17'),(NULL,'1625DC5EC000017',NULL,'2022-04-21 18:28:19','2022-04-21 18:28:20'),(NULL,'1625DC5EC000017',NULL,'2022-04-21 18:28:22','2022-04-21 18:29:31'),('1625DC5EC000003','1625DC5EC000017','1625DC5EC000009','2022-04-21 18:31:00','2022-04-21 18:33:02'),(NULL,'1625DC5EC000017',NULL,'2022-04-21 18:42:10','2022-04-21 18:42:15'),('1625DC5EC000003','1625DC5EC000017','1625DC5EC000009','2022-04-21 18:43:13','2022-04-21 18:44:06'),(NULL,'1625DC5EC000017',NULL,'2022-04-21 19:22:23','2022-04-21 19:22:31'),('0','1625DC5EC000017','0','2022-04-21 20:10:16','2022-04-21 20:15:30'),('0','1625DC5EC000017','0','2022-04-21 20:41:06','2022-04-21 20:41:08'),('1625DC5EC000003','1625DC5EC000017','1625DC5EC000012','2022-04-21 20:49:27','2022-04-21 20:53:35'),('1625DC5EC000003','1625DC5EC000017','1625DC5EC00000C','2022-04-21 23:39:32','2022-04-21 23:39:38');
/*!40000 ALTER TABLE `employee_activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `employee_id` char(32) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `wage` int NOT NULL,
  `hours` double DEFAULT NULL,
  `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `absent_days` int DEFAULT NULL,
  `is_clocked_in` tinyint(1) DEFAULT '0',
  `clock_in_time` timestamp NULL DEFAULT NULL,
  `current_project` char(32) DEFAULT '0',
  `current_task` char(32) DEFAULT '0',
  `current_activity` varchar(64) DEFAULT '0',
  `is_deleted` tinyint DEFAULT '0',
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `curtask_fk_emp_idx` (`current_task`),
  KEY `curproject_fk_emp` (`current_project`),
  CONSTRAINT `curproject_fk_emp` FOREIGN KEY (`current_project`) REFERENCES `projects` (`project_id`),
  CONSTRAINT `curtask_fk_emp` FOREIGN KEY (`current_task`) REFERENCES `tasks` (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES ('16240ADCD000004','john','smith','me','pass','male',15,NULL,'2022-03-28 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,NULL),('1624766CA000000','Conner','Reimers','conner1','password','male',15,NULL,'2022-04-05 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,NULL),('1624766CA000001','Jackson','Heppell','jackson1','password','male',15,NULL,'2022-04-05 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,NULL),('1624766CA000003','Firstname','Lastname','firstname.lastname','password','male',69,NULL,'2022-04-06 00:00:00',NULL,0,'2022-04-21 06:35:55',NULL,NULL,NULL,0,NULL),('1624766CA000009','John','Dodge','john.dodge','123456789','male',69,NULL,'2022-04-06 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,NULL),('1624766CA00000B','Michell','Moreland','michell.moreland','123456789','male',69,NULL,'2022-04-06 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,NULL),('1624766CA00000D','Josh','Nerry','josh.nerry','123456789','male',69,NULL,'2022-04-06 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,NULL),('1624766CA00000F','Jennifer','Akagi','jennifer.akagi','123456789','male',69,NULL,'2022-04-06 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,NULL),('1624766CA000011','Mark','Shelter','mark.shelter','123456789','male',69,NULL,'2022-04-06 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,NULL),('1624766CA000013','Josh','Florentino','josh.florentino','123456789','male',69,NULL,'2022-04-06 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,NULL),('1624766CA000015','Anna','Loli','anna.loli','123456789','male',69,NULL,'2022-04-06 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,NULL),('16259B82D000000','test','empl','testuser','','male',34,NULL,'2022-04-17 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,1,NULL),('1625DC5EC000017','Adeeb','Reilly','areilly','123456789','male',56,NULL,'2022-04-19 00:00:00',NULL,0,'2022-04-21 23:39:32','1625DC5EC000003','1625DC5EC00000C',NULL,0,'adreil343@gmail.com'),('1625DC5EC000018','Tia','Shepard','tshepard','123456789','female',63,NULL,'2022-04-19 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,'tshepard343@gmail.com'),('1625DC5EC000019','Jaeden','Woolley','jwooley','123456789','female',63,NULL,'2022-04-19 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,'jwooley343@gmail.com'),('1625DC5EC00001A','Edwin','Paterson','epaterson','123456789','female',63,NULL,'2022-04-19 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,'epaterson@gmail.com'),('1625DC5EC00001B','Arya','Villanueva','avillanueva','123456789','male',69,NULL,'2022-04-19 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,'avillanueva343@gmail.com'),('1625DC5EC00001C','Alexander','Maximilian','amaximilian ','123456789','male',64,NULL,'2022-04-19 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,'amaximilian343@gmail.com'),('1625DC5EC00001D','Peter','Watson','pwatson','123456789','male',52,NULL,'2022-04-19 00:00:00',NULL,1,'2022-04-21 23:46:01','1625DC5EC000003','1625DC5EC000013','1625DC5EC0000131625DC5EC000003',0,'pwatson343@gmail.com'),('1625DC5EC00001E','Arthur','Merlyn','amerlyn','123456789','male',60,NULL,'2022-04-19 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,'amerlyn343@gmail.com'),('1625DC5EC00001F','John','Smit','john.smith','','male',32,NULL,'2022-04-19 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,'jfjdsf@gmail.com'),('1625DC5EC00002B','test','test','test','','male',67,NULL,'2022-04-19 00:00:00',NULL,0,NULL,'1625DC5EC000003','1625DC5EC000005',NULL,0,'test666@6.com'),('16260F10D000000','Johnny','Lap','jlap','','male',10,NULL,'2022-04-21 00:00:00',NULL,0,NULL,NULL,NULL,NULL,0,'johnnylapp@mail.com'),('16260F10D000001','Saul','Figueroa','saulf1','','male',40,NULL,'2022-04-21 00:00:00',NULL,0,NULL,NULL,NULL,NULL,0,'salf@mail.com'),('16260F10D000002','Johnny','Lap','johnlap','','male',50,NULL,'2022-04-21 00:00:00',NULL,0,NULL,NULL,NULL,NULL,0,'johnlap@mail.com'),('16260F10D000003','fdsfd','fdsfd','fdsaf','','male',1,NULL,'2022-04-21 00:00:00',NULL,0,NULL,NULL,NULL,NULL,0,'fdsafd'),('16260F10D000004','fdsaf','fdsa','fdsffdsf','','male',2,NULL,'2022-04-21 00:00:00',NULL,0,NULL,NULL,NULL,NULL,0,'fds'),('16260F10D000005','Joe','Smith','fdsafdsa','','male',1,NULL,'2022-04-21 00:00:00',NULL,0,NULL,NULL,NULL,NULL,0,'4156f45'),('16260F10D000007','fdsaffdsa','fdsafds','fdsafd','','male',0,NULL,'2022-04-21 00:00:00',NULL,0,NULL,NULL,NULL,NULL,0,'fdsafdf'),('16260F10D000008','fdsfsa','fdsfdsa','erwfds','','male',1,NULL,'2022-04-21 00:00:00',NULL,0,NULL,NULL,NULL,NULL,0,'rewrewrew'),('16260F10D000009','fdsfds','fdsafd','fsdfds','','male',4,NULL,'2022-04-21 00:00:00',NULL,0,NULL,NULL,NULL,NULL,0,'rewcxdsf'),('16260F10D00000A','fdsrew','fdsaew','fdsfds','','male',1,NULL,'2022-04-21 00:00:00',NULL,0,NULL,NULL,NULL,NULL,0,'fdsvcxfs'),('16260F10D000011','TEst','2','fdsafds','','male',1,NULL,'2022-04-21 00:00:00',NULL,0,NULL,NULL,NULL,NULL,0,'fdsrew456'),('16260F10D000012','dfsads','fsdfds','ewfdsaf','','male',56,NULL,'2022-04-21 00:00:00',NULL,0,NULL,NULL,NULL,NULL,0,'rewfvcxdfs'),('16260F10D000017','fdsafds','fdsafd','fdsfds4576','','male',4,NULL,'2022-04-21 00:00:00',NULL,0,NULL,NULL,NULL,NULL,0,'fdsfderwre45465'),('16261A621000000','Thai','Nguyen','thaidui','123456789','male',60,NULL,'2022-04-21 00:00:00',NULL,0,NULL,'0','0',NULL,0,'thai3011@gmail.com'),('16261D164000000','test','trwt','testaetg','','male',33,NULL,'2022-04-21 00:00:00',NULL,0,NULL,'0','0',NULL,0,'test@testasdfjgfjaogirj.com'),('16261D164000001','Thai','Nguyen','tnguyen','','male',10,NULL,'2022-04-21 00:00:00',NULL,0,NULL,'0','0',NULL,0,'abc@gmsil.com'),('16261D164000002','john','smith','jsmith9','','male',50,NULL,'2022-04-21 00:00:00',NULL,0,NULL,'0','0',NULL,0,'abcd@gmail.com');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_in_department`
--

DROP TABLE IF EXISTS `project_in_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_in_department` (
  `pid` char(32) NOT NULL,
  `did` char(32) NOT NULL,
  PRIMARY KEY (`pid`,`did`),
  KEY `project_in_department_fk1` (`did`),
  CONSTRAINT `project_in_department_fk1` FOREIGN KEY (`did`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE,
  CONSTRAINT `project_in_department_fk2` FOREIGN KEY (`pid`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_in_department`
--

LOCK TABLES `project_in_department` WRITE;
/*!40000 ALTER TABLE `project_in_department` DISABLE KEYS */;
INSERT INTO `project_in_department` VALUES ('1624766CA000019','1624766CA000007'),('1624766CA00001B','1624766CA000007'),('1624766CA00001D','1624766CA000007'),('1624766CA000021','1624766CA000007'),('1625DC5EC000003','1625DC5EC000000'),('1625DC5EC000004','1625DC5EC000000'),('1625DC5EC00000D','1625DC5EC000000'),('1625DC5EC00000E','1625DC5EC000000'),('1625DC5EC00000F','1625DC5EC000000'),('1625DC5EC000010','1625DC5EC000000'),('1625DC5EC000011','1625DC5EC000000'),('1625DC5EC000029','1625DC5EC000000'),('1625DC5EC00002A','1625DC5EC000000'),('1625DC5EC000037','1625DC5EC000000'),('1625DC5EC000038','1625DC5EC000000'),('16260F10D00000B','1625DC5EC000000'),('16261D164000003','1625DC5EC000000');
/*!40000 ALTER TABLE `project_in_department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `project_id` char(32) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `due_date` date NOT NULL,
  `cost` double DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `budget` double DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `total_task_count` int DEFAULT '0',
  `completed_task_count` int DEFAULT '0',
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES ('0','unspecified','unspecified','8414-10-21',NULL,NULL,NULL,NULL,1,0,0),('16240ADCD000005','test project','desc test.....','2022-03-28',NULL,NULL,999,NULL,1,1,0),('1624766CA000019','Project enim','Lectus malesuada tristique in enim hendrerit sit tortor eget nec neque interdum gravida orci metus amet nam aliquam purus aliquam ullamcorper tempor egestas lacus facilisi amet vel lacus vulputate adipiscing molestie sit et','2022-12-01',NULL,NULL,NULL,NULL,2,8,0),('1624766CA00001B','Project odio','Sed sodales orci quisque massa non ultrices felis nibh quam dignissim praesent odio quisque etiam dignissim aliquet felis duis lectus dui convallis enim convallis interdum ullamcorper facilisi rutrum augue ultrices arcu felis','2022-05-08',NULL,NULL,NULL,NULL,7,8,0),('1624766CA00001D','Project diam','Nam pulvinar gravida lectus mollis quam vulputate enim in diam id sed nulla duis consectetur nulla felis tincidunt varius auctor eget diam volutpat risus placerat nunc nunc malesuada pellentesque morbi auctor et lectus ultricies','2022-06-23',NULL,NULL,NULL,NULL,9,12,0),('1624766CA00001F','Project etiam','Sit sed diam fusce lorem sit bibendum consequat consequat non eget nulla a nulla magna egestas euismod aliquam vel ut massa a velit elit neque tellus dignissim sit condimentum fames porta vitae adipiscing suspendisse risus','2022-09-29',NULL,NULL,NULL,NULL,4,12,0),('1624766CA000021','Project quam','Egestas tellus vulputate faucibus venenatis et amet nec augue faucibus dignissim vel tristique cursus duis eget dolor metus cras tincidunt at proin turpis neque sed dolore mattis posuere molestie mattis ultricies mollis','2022-06-09',NULL,NULL,NULL,NULL,4,10,0),('1625DC5EC000003','Quarterly research','Conduct research on previous customers in spring','2022-06-28',NULL,'inProgress',5313,NULL,12,4,0),('1625DC5EC000004','Product training','Train sale department on new products','2022-08-28',NULL,'inProgress',4522,NULL,6,0,0),('1625DC5EC00000D','Capture Customer Success Stories','Plan which customer success stories you’d like to feature on the website and start reaching out to your customer contacts.','2022-07-28',NULL,'inProgress',2892,NULL,0,0,0),('1625DC5EC00000E','Set up scalable processes and agile workflows','Agile marketing works by building a dedicated cross-functional team that meets regularly to review progress and understand new insights.','2022-04-18',NULL,'complete',2892,NULL,0,0,0),('1625DC5EC00000F','Evaluate new tools','test some new software and see whether it can enhance or replace your current line-up of marketing tools.','2022-03-18',NULL,'complete',3829,NULL,0,0,0),('1625DC5EC000010','Maintain existing content','Audit existing content and checking what could be improved, and by how much it needs improving','2022-06-17',NULL,'inProgress',4229,NULL,0,0,0),('1625DC5EC000011','Explore video marketing','Create a plan to implement a youtube channel and ads to market products','2022-07-17',NULL,'inProgress',5666,NULL,0,0,0),('1625DC5EC000029','fdsaf','fdsfa','6465-04-05',NULL,NULL,NULL,NULL,0,0,1),('1625DC5EC00002A','Test','Teest','2022-04-11',NULL,NULL,NULL,NULL,0,0,1),('1625DC5EC000037','New Project Test','Project desc','8414-10-21',NULL,NULL,NULL,NULL,0,0,1),('1625DC5EC000038','456','','0001-01-01',NULL,NULL,NULL,NULL,0,0,1),('16260F10D00000B','test','test','2022-05-04',NULL,NULL,NULL,NULL,0,0,1),('16261D164000003','New project','test','2022-05-06',NULL,NULL,NULL,NULL,0,0,1);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_in_project`
--

DROP TABLE IF EXISTS `task_in_project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_in_project` (
  `pid` char(16) NOT NULL,
  `tid` char(16) NOT NULL,
  `finished` tinyint DEFAULT '0',
  PRIMARY KEY (`pid`,`tid`),
  KEY `task_in_project_fk1` (`tid`),
  CONSTRAINT `task_in_project_fk1` FOREIGN KEY (`tid`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `task_in_project_fk2` FOREIGN KEY (`pid`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_in_project`
--

LOCK TABLES `task_in_project` WRITE;
/*!40000 ALTER TABLE `task_in_project` DISABLE KEYS */;
INSERT INTO `task_in_project` VALUES ('0','0',0),('16240ADCD000005','1624766CA000023',0),('1625DC5EC000003','1625DC5EC000005',0),('1625DC5EC000003','1625DC5EC000006',0),('1625DC5EC000003','1625DC5EC000008',0),('1625DC5EC000003','1625DC5EC000009',0),('1625DC5EC000003','1625DC5EC00000A',0),('1625DC5EC000003','1625DC5EC00000B',0),('1625DC5EC000003','1625DC5EC00000C',0),('1625DC5EC000003','1625DC5EC000012',0),('1625DC5EC000003','1625DC5EC000013',0),('1625DC5EC000003','1625DC5EC000014',0),('1625DC5EC000003','1625DC5EC000015',0),('1625DC5EC000003','1625DC5EC000016',0),('1625DC5EC000004','16260F10D00000F',0),('1625DC5EC000004','16260F10D000010',0);
/*!40000 ALTER TABLE `task_in_project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `task_id` char(32) NOT NULL,
  `status` enum('todo','inProgress','complete','pendingApproval') NOT NULL,
  `description` text NOT NULL,
  `due_date` date DEFAULT NULL,
  `priority` enum('high','normal','low') DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `total_todo_count` int DEFAULT '0',
  `completed_todo_count` int DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `is_deleted` tinyint DEFAULT '0',
  `pid` char(16) DEFAULT NULL,
  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES ('0','todo','unspecified','8414-10-21',NULL,NULL,0,NULL,'unspecified',0,NULL),('1624766CA000023','inProgress','test task','2022-04-06',NULL,NULL,0,NULL,'',0,NULL),('1624766CA000024','inProgress','test task','2022-04-06',NULL,NULL,0,NULL,'',0,NULL),('1625DC5EC000005','complete','Gather data on previous customers to help with research','2022-05-02','high',NULL,0,NULL,'Gather Data',0,'1625DC5EC000003'),('1625DC5EC000006','inProgress','Create reports on data that was gathered on previous customers to help with research','2022-05-25','high',NULL,0,NULL,'Create reports',0,NULL),('1625DC5EC000007','todo','Use data from reports to make changes to marketing campaign','2022-05-30','normal',NULL,0,NULL,'Alter marketing campaign',0,NULL),('1625DC5EC000008','complete','Use the data from reports to determine if there are untapped markets where we could thrive','2022-05-30','normal',NULL,0,NULL,'Look into untapped markets',0,'1625DC5EC000003'),('1625DC5EC000009','inProgress','Interview previous customers to determine their satisfaction, store the data','2022-05-02','high',NULL,0,NULL,'Conduct customer surveys',0,NULL),('1625DC5EC00000A','complete','Collect data on competitors to help with sales research','2022-05-18','high',NULL,0,NULL,'Competition research',0,'1625DC5EC000003'),('1625DC5EC00000B','inProgress','Do some routine research on the overall market','2022-05-08','low',NULL,0,NULL,'Investigate market activity',0,'1625DC5EC000003'),('1625DC5EC00000C','todo','Determine viability of new incoming leads','2022-05-08','high',NULL,0,NULL,'Track new leads',0,NULL),('1625DC5EC000012','todo','Combine all data and analyze outcomes','2022-06-08','normal',NULL,0,NULL,'Analyze overall findings',0,NULL),('1625DC5EC000013','todo','Fully understand who your customers are and where they come from','2022-05-10','high',NULL,0,NULL,'Pinpoint target customers',0,NULL),('1625DC5EC000014','todo','Outline the current state of your industry and where it is headed','2022-05-04','normal',NULL,0,NULL,'Look at your industry’s outlook',0,NULL),('1625DC5EC000015','todo','Conduct secondary research on free publicly available information','2022-05-07','normal',NULL,0,NULL,'Secondary Research',0,NULL),('1625DC5EC000016','complete','Determine what the income range and employment rate is','2022-05-08','normal',NULL,0,NULL,'Determine Economic indicators',0,'1625DC5EC000003'),('16260F10D00000F','complete','test','2022-04-13','normal',NULL,0,NULL,'test',1,NULL),('16260F10D000010','inProgress','testing 123\n','2022-05-07','low',NULL,0,NULL,'test',1,NULL);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `works_in`
--

DROP TABLE IF EXISTS `works_in`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `works_in` (
  `eid` char(32) NOT NULL,
  `did` char(32) NOT NULL,
  `role` varchar(155) DEFAULT NULL,
  `access` enum('overseer','manager','standard','asstManager') DEFAULT NULL,
  KEY `works_in_fk1` (`did`),
  CONSTRAINT `works_in_fk1` FOREIGN KEY (`did`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `works_in`
--

LOCK TABLES `works_in` WRITE;
/*!40000 ALTER TABLE `works_in` DISABLE KEYS */;
INSERT INTO `works_in` VALUES ('1624766CA000003','1624766CA000007','Manager','manager'),('1624766CA000009','1624766CA000007','Project Lead','standard'),('1624766CA00000B','1624766CA000007','Project Lead','standard'),('1624766CA00000D','1624766CA000007','','standard'),('1624766CA00000F','1624766CA000007','','standard'),('1624766CA000011','1624766CA000007','','standard'),('16259B82D000000','1624766CA000007',NULL,NULL),('1625DC5EC000017','1625DC5EC000000','Manager','manager'),('1625DC5EC000017','1625DC5EC000020',NULL,'overseer'),('1625DC5EC000017','1625DC5EC000021',NULL,'overseer'),('1625DC5EC000017','1625DC5EC000022',NULL,'overseer'),('1625DC5EC000017','1625DC5EC00002C',NULL,'overseer'),('1625DC5EC000017','1625DC5EC00002D',NULL,'overseer'),('1625DC5EC000017','1625DC5EC00002E',NULL,'overseer'),('1625DC5EC000017','1625DC5EC00002F',NULL,'overseer'),('1625DC5EC000018','1625DC5EC000000','Pricing Strategist','standard'),('1625DC5EC000019','1625DC5EC000000','Customer Review','standard'),('1625DC5EC00001A','1625DC5EC000000','Market Consultant','standard'),('1625DC5EC00001B','1625DC5EC000000','Assistant Manager','asstManager'),('1625DC5EC00001C','1625DC5EC000000','Lead Research','standard'),('1625DC5EC00001D','1625DC5EC000000','Project Lead','standard'),('1625DC5EC000017','1625DC5EC000032',NULL,'overseer'),('1625DC5EC000017','1625DC5EC000032',NULL,'manager'),('1625DC5EC000017','1625DC5EC000033',NULL,'overseer'),('1625DC5EC00001A','1625DC5EC000033',NULL,'manager'),('1625DC5EC000017','1625DC5EC000034',NULL,'overseer'),('1625DC5EC00001C','1625DC5EC000034',NULL,'manager'),('1625DC5EC000017','1625DC5EC000035',NULL,'overseer'),('1625DC5EC000019','1625DC5EC000035',NULL,'manager'),('1625DC5EC000017','1625DC5EC000036',NULL,'overseer'),('1625DC5EC00001B','1625DC5EC000036',NULL,'manager'),('16261D164000001','1625DC5EC000034','yui','standard'),('A262634130000001','1625DC5EC000034','test','asstManager'),('A262634130000004','1625DC5EC000034','4','asstManager');
/*!40000 ALTER TABLE `works_in` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-23 21:38:08
