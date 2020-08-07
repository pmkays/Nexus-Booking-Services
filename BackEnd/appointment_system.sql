CREATE DATABASE  IF NOT EXISTS `appointment_system`;
USE `appointment_system`;

--
-- Table structure for table `security_role`
--

DROP TABLE IF EXISTS `security_role`;

CREATE TABLE `security_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;

CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `phone_no` varchar(11) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Table structure for table `security_user`
--

DROP TABLE IF EXISTS `security_user`;

CREATE TABLE `security_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `account_id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_account` FOREIGN KEY (`account_id`) REFERENCES `acaccountcount` (`id`),
  CONSTRAINT `fk_role` FOREIGN KEY (`role_id`) REFERENCES `security_role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
  
--
-- Data for table `account`
--

INSERT INTO `account` VALUES 
    (1,'Leslie','Uzumaki','leslie@hotmail.com', 0410101010, '4 Poornima Road'),
    (2,'Emma','Gaumbarten','emma@gmail.com', 0423101563, '3 Buttersworth Street'),
    (3,'Avani','Yupta','avani@hotmail.com', 0445231020, '9 King Court'),
    (4,'Yuri','Detrov','yuri@gmail.com', 0410164823, '2 Salamander Way'),
    (5,'Juan','Yega','juan@hotmail.com', 0410567343, '1 Digger Road');
    
--
-- Data for table `security_role`
--

INSERT INTO `security_role` VALUES 
    (1, 'ROLE_CUSTOMER', 'Customer role.' ),
    (2,'ROLE_EMPLOYEE', 'Employee role.'),
    (3,'ROLE_ADMIN', 'Admin role.');
    
    
--
-- Data for table `security_user`
--

INSERT INTO `security_user` VALUES 
    (1,'sasuke1', 'abc123', 1, 1),
    (2,'sakura1', 'abc123', 2, 1),
    (3,'naruto1', 'abc123', 3, 1),
    (4,'kakashi1', 'abc123', 4, 1),
    (5,'admin', 'abc123', 5, 3);
    
    