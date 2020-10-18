CREATE DATABASE IF NOT EXISTS `appointment_system`;
USE `appointment_system`;

DROP TABLE IF EXISTS `employee_service`;
DROP TABLE IF EXISTS `booking`;
DROP TABLE IF EXISTS `service`;
DROP TABLE IF EXISTS `availability`;
DROP TABLE IF EXISTS `working_time`;
DROP TABLE IF EXISTS `security_user`;
DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `customer`;
DROP TABLE IF EXISTS `employee`;
DROP TABLE IF EXISTS `security_role`;


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
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;

CREATE TABLE `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `phone_no` varchar(11) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `img` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;

CREATE TABLE `employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `phone_no` varchar(11) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `img` varchar(200) DEFAULT NULL,
  `description` varchar(232) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `phone_no` varchar(11) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `img` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Table structure for table `security_user`
--

DROP TABLE IF EXISTS `security_user`;

CREATE TABLE `security_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(68) DEFAULT NULL,
  `customer_id` int(11),
  `employee_id` int(11),
  `admin_id` int(11),
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_account_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  CONSTRAINT `fk_account_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_account_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`),
  CONSTRAINT `fk_role` FOREIGN KEY (`role_id`) REFERENCES `security_role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;

CREATE TABLE `service` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `name` varchar(20) NOT NULL,
  `img` varchar(200) DEFAULT NULL,
  `description` varchar(232) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Table structure for table `employee_service`
--

DROP TABLE IF EXISTS `employee_service`;

CREATE TABLE `employee_service` (
  `employee_id` int(11), 
  `service_id` int(11),
  PRIMARY KEY (employee_id, service_id),
  CONSTRAINT `fk_employee_id_service` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_service_id_employee` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;

CREATE TABLE `booking` (
  `id` int(11) NOT NULL AUTO_INCREMENT, 
  `customer_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` varchar(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_customer_booking_id` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`),
  CONSTRAINT `fk_employee_booking_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_service_id` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Table structure for table `availability`
--

DROP TABLE IF EXISTS `availability`;

CREATE TABLE `availability` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  CONSTRAINT `fk_employee_id_availaibility` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Table structure for table `working_time`
--

DROP TABLE IF EXISTS `working_time`;

CREATE TABLE `working_time` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  CONSTRAINT `fk_employee_id_working_time` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

--
-- Data for table `customer`
--

INSERT INTO `customer` VALUES
    (1,'Leslie','Uzumaki','leslie@hotmail.com', '0410101010', '4 Poornima Road', 'https://i.imgur.com/VXnG3tg.jpg'),
    (2,'Emma','Gaumbarten','emma@gmail.com', '0423101563', '3 Buttersworth Street', 'https://i.imgur.com/t6EJkdF.jpg'),
    (3,'Hinata','Hyuga','ilovenaruto@email.com', '0432123450', 'Hopefully Narutos Heart', 'https://vignette.wikia.nocookie.net/naruto/images/7/79/Hinata_Part_II.png/revision/latest?cb=20160916060747'),
    (4,'Naruto','Uzumaki','ilovesasuke@hotmail.com', '0293847212', 'Village of the Hidden Leaf', 'https://giantbomb1.cbsistatic.com/uploads/scale_small/3/33873/1700999-naruto.png'),
    (5,'Sasuke','Uchiha','screwsakura@gmail.com', '0987654323', 'Orochimarus Den', 'https://vignette.wikia.nocookie.net/shipping/images/2/25/Sasuke_Uchiha.png/revision/latest?cb=20160422160842');
    
--
-- Data for table `employee`
--

INSERT INTO `employee` VALUES
    (4,'Yuri','Detrov','yuri@gmail.com', '0410164823', '2 Salamander Way', 'https://i.imgur.com/ZauQ8MZ.jpg', 'Hey! My name is Yuri. I love working in design and construction and have a Bachelor\'s Degree in Design and practical construction experience as a project manager. You can trust me to get your next passion project running!'),
    (5,'Joe','Cool','joemama@gmail.com', '0410663567', '4 Cool Court', 'https://i.imgur.com/RRSQ7uh.jpg', 'Hey there! My name is Joe. I love being a jack of all trades so I\'m comfortable with providing the best construction, repair and make up services. You can reach me any time through my phone number and I\'m always happy to help!');
    
--
-- Data for table `admin`
--

INSERT INTO `admin` VALUES
    (5,'Juan','Yega','juan@hotmail.com', '0410567343', '1 Digger Road', 'https://i.imgur.com/hCEQVy0.jpg');

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
    (1,'tsunade1', '$2a$10$C/8xsj.CiUBaCJIYPpjLg.25k3RZASgu37zHD6K6CltmAvb9Z2wLa', 1, null, null, 1),
    (2,'sakura1', '$2a$10$C/8xsj.CiUBaCJIYPpjLg.25k3RZASgu37zHD6K6CltmAvb9Z2wLa', 2, null, null, 1),
    (3,'hinata1', '$2a$10$C/8xsj.CiUBaCJIYPpjLg.25k3RZASgu37zHD6K6CltmAvb9Z2wLa', 3, null, null, 1),
    (4,'naruto1', '$2a$10$C/8xsj.CiUBaCJIYPpjLg.25k3RZASgu37zHD6K6CltmAvb9Z2wLa', 4, null, null, 1),
    (5,'sasuke1', '$2a$10$C/8xsj.CiUBaCJIYPpjLg.25k3RZASgu37zHD6K6CltmAvb9Z2wLa', 5, null, null, 1),
    (6,'employee1', '$2a$10$C/8xsj.CiUBaCJIYPpjLg.25k3RZASgu37zHD6K6CltmAvb9Z2wLa', null, 4, null, 2),
    (7,'employee2', '$2a$10$C/8xsj.CiUBaCJIYPpjLg.25k3RZASgu37zHD6K6CltmAvb9Z2wLa', null, 5, null, 2),
    (8,'admin', '$2a$10$C/8xsj.CiUBaCJIYPpjLg.25k3RZASgu37zHD6K6CltmAvb9Z2wLa', null, null, 5, 3);
    

--
-- Data for table `services`
--

INSERT INTO `service` VALUES
	(1, 'Design', 'https://i.imgur.com/z53yLmm.jpg', 'We specialise in graphic and web design; it\'s our jam. With over 1000+ satisfied clients and 5 star reviews, we\'ll be able to spruce up your visuals in no time! Cost can be supplied upon initial consultation.'),
    (2, 'Construction', 'https://i.imgur.com/gzi5Nmu.jpg', 'We have over 50 years of construction and architecture experience within Australia. Our highly qualified project managers, architects and builders will ensure that you receive the best quality constructions that money can buy!'),
    (3, 'Repair', 'https://i.imgur.com/NfYcrHt.jpg', 'We\'re Australia\'s top electronics repair shop and can fix all your phone, laptop and PC issues! Broken screens? Dead batteries? Water Damage? No problem! Give us a call now on 123456789 or visit us in store today for a quote.'),
    (4, 'Make Up', 'https://i.imgur.com/eD7gQ7N.jpg', 'We\'ve collaborated with Australia\'s most high-profile celebrities to deliver on the freshest makeup looks. With mentions in top fashion and beauty magazines like Vogue, GQ and InStyle, you can trust us for your next big event.');
    
INSERT INTO `employee_service` VALUES
	(4, 1),
    (4, 2),
    (5, 2),
    (5, 3),
    (5, 4);
    
--
-- Data for table `availability`
--

INSERT INTO `availability` VALUES
    
    (1, 4, '2020-10-23 00:00:00', '2020-10-23 09:00:00'),
    (2, 4, '2020-10-24 00:00:00', '2020-10-24 09:00:00'),
    (3, 4, '2020-10-25 00:00:00', '2020-10-25 09:00:00'),
    (4, 5, '2020-10-26 00:00:00', '2020-10-26 09:00:00'),
    (5, 4, '2020-10-27 00:00:00', '2020-10-27 09:00:00'),
    (6, 5, '2020-10-28 00:00:00', '2020-10-28 09:00:00'),
    (7, 5, '2020-10-29 00:00:00', '2020-10-29 09:00:00'),
    (8, 5, '2020-10-30 00:00:00', '2020-10-30 09:00:00'),
    (9, 4, '2020-11-01 00:00:00', '2020-11-01 09:00:00'),
    (10, 5, '2020-11-02 00:00:00', '2020-11-02 09:00:00'),
    (11, 5, '2020-11-03 00:00:00', '2020-11-03 09:00:00'),
    (12, 5, '2020-11-04 00:00:00', '2020-11-04 09:00:00'),
    (13, 4, '2020-11-05 00:00:00', '2020-11-05 09:00:00'),
    (14, 4, '2020-11-07 00:00:00', '2020-11-07 09:00:00'),
    (15, 5, '2020-11-08 00:00:00', '2020-11-08 09:00:00'),
    (16, 4, '2020-11-09 00:00:00', '2020-11-09 09:00:00');
    
--
-- Data for table `working_time`
--

INSERT INTO `working_time` VALUES
    
    (1, 4, '2020-10-23 01:00:00', '2020-10-23 09:00:00'),
    (2, 4, '2020-10-24 01:00:00', '2020-10-24 09:00:00'),
    (3, 4, '2020-10-25 01:00:00', '2020-10-25 09:00:00'),
    (4, 5, '2020-10-26 01:00:00', '2020-10-26 09:00:00'),
    (5, 4, '2020-10-27 01:00:00', '2020-10-27 09:00:00'),
    (6, 5, '2020-10-28 01:00:00', '2020-10-28 09:00:00'),
    (7, 5, '2020-10-29 01:00:00', '2020-10-29 09:00:00'),
    (8, 5, '2020-10-30 01:00:00', '2020-10-30 09:00:00'),
    (9, 4, '2020-11-01 01:00:00', '2020-11-01 09:00:00'),
    (10, 5, '2020-11-02 01:00:00', '2020-11-02 09:00:00'),
    (11, 5, '2020-11-03 01:00:00', '2020-11-03 09:00:00'),
    (12, 5, '2020-11-04 01:00:00', '2020-11-04 09:00:00'),
    (13, 4, '2020-11-05 01:00:00', '2020-11-05 09:00:00'),
    (14, 4, '2020-11-07 01:00:00', '2020-11-07 09:00:00'),
    (15, 5, '2020-11-08 01:00:00', '2020-11-08 09:00:00'),
    (16, 4, '2020-11-09 01:00:00', '2020-11-09 09:00:00');
    
--
-- Data for table `booking`
--

INSERT INTO `booking` VALUES
    (1, 1, 4, '2020-10-06 15:00:00', '2020-10-06 16:00:00','complete',4),
    (2, 2, 4, '2020-10-07 15:00:00', '2020-10-07 16:00:00','complete',4),
    (3, 3, 5, '2020-10-08 18:00:00', '2020-10-08 19:00:00','complete',3),
    (4, 4, 4, '2020-10-09 15:00:00', '2020-10-09 16:00:00','complete',1),
    (5, 5, 4, '2020-10-10 15:00:00', '2020-10-10 16:00:00','complete',2),
	(6, 2, 4, '2020-11-01 15:00:00', '2020-11-01 16:00:00','complete',4),
    (7, 1, 5, '2020-09-25 18:00:00', '2020-09-25 19:00:00','complete',1),
    (8, 3, 5, '2020-09-26 18:00:00', '2020-09-26 19:00:00','complete',4),
    (9, 4, 5, '2020-09-27 18:00:00', '2020-09-27 19:00:00','complete',3),
    (10, 5, 4, '2020-10-06 15:00:00', '2020-10-06 16:00:00','complete',4),
    (11, 2, 5, '2020-10-08 18:00:00', '2020-10-08 19:00:00','complete',3),
    (12, 1, 4, '2020-10-09 15:00:00', '2020-10-09 16:00:00','complete',1),
	(13, 2, 4, '2020-11-01 15:00:00', '2020-11-01 16:00:00','complete',4),
    (14, 4, 5, '2020-09-25 18:00:00', '2020-09-25 19:00:00','complete',1),
    (15, 3, 5, '2020-09-27 18:00:00', '2020-09-27 19:00:00','complete',3),
    (16, 1, 4, '2020-10-30 02:00:00', '2020-10-30 03:00:00','pending', 2),
    (17, 1, 5, '2020-11-01 02:00:00', '2020-11-01 03:00:00','pending', 3),
    (18, 1, 4, '2020-11-02 02:00:00', '2020-11-02 03:00:00','pending', 1),
    (19, 2, 4, '2020-10-30 02:00:00', '2020-10-30 03:00:00','pending', 2),
    (20, 2, 5, '2020-11-01 02:00:00', '2020-11-01 03:00:00','pending', 3),
    (21, 2, 4, '2020-11-02 02:00:00', '2020-11-02 03:00:00','pending', 1),
    (22, 3, 4, '2020-10-30 02:00:00', '2020-10-30 03:00:00','pending', 2),
    (23, 3, 5, '2020-11-01 02:00:00', '2020-11-01 03:00:00','pending', 3),
    (24, 3, 4, '2020-11-02 02:00:00', '2020-11-02 03:00:00','pending', 1),
    (25, 4, 4, '2020-10-30 02:00:00', '2020-10-30 03:00:00','pending', 2),
    (26, 4, 5, '2020-11-01 02:00:00', '2020-11-01 03:00:00','pending', 3),
    (27, 4, 4, '2020-11-02 02:00:00', '2020-11-02 03:00:00','pending', 1),
    (28, 5, 4, '2020-10-30 02:00:00', '2020-10-30 03:00:00','pending', 2),
    (29, 5, 5, '2020-11-01 02:00:00', '2020-11-01 03:00:00','pending', 3),
    (30, 5, 4, '2020-11-02 02:00:00', '2020-11-02 03:00:00','pending', 1);



