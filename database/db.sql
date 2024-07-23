CREATE DATABASE tu_base_de_datos;

USE tu_base_de_datos;

DROP TABLE IF EXISTS `chivas`;
DROP TABLE IF EXISTS `viajes`;
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `tiquetes`;
DROP TABLE IF EXISTS `chiva_has_viaje`;

CREATE TABLE `chivas` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `matricula` varchar(10) NOT NULL,
    `capacidad` int(11) NOT NULL,
    `estado` ENUM('disponible', 'no disponible') NOT NULL,
    `conductor` varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `viajes` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `fecha` date NOT NULL,
    `hora` time NOT NULL,
    `chiva` int(11) NOT NULL,
    `origen` varchar(50) NOT NULL,
    `destino` varchar(50) NOT NULL,
    `precio` float NOT NULL,
    `duracion` int(11) NOT NULL,
    `tiquetes_disponibles` int(11) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `chiva` (`chiva`), 
    CONSTRAINT `viajes_chivas` FOREIGN KEY (`chiva`) REFERENCES `chivas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `usuarios` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nombre` varchar(50) NOT NULL,
    `email` varchar(50) NOT NULL,
    `password` varchar(50) NOT NULL,
    `is_admin` BOOLEAN NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `tiquetes` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `viaje` int(11) NOT NULL,
    `usuario` int(11) NOT NULL,
    `cantidad` int(11) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `viaje` (`viaje`),
    KEY `usuario` (`usuario`),
    CONSTRAINT `tiquetes_viajes` FOREIGN KEY (`viaje`) REFERENCES `viajes` (`id`) ON DELETE CASCADE,
    CONSTRAINT `tiquetes_usuarios` FOREIGN KEY (`usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `chiva_has_viaje`(
    `chiva` int(11) NOT NULL,
    `viaje` int(11) NOT NULL,
    PRIMARY KEY (`chiva`, `viaje`),
    KEY `chiva` (`chiva`),
    KEY `viaje` (`viaje`),
    CONSTRAINT `chiva_has_viaje_chivas` FOREIGN KEY (`chiva`) REFERENCES `chivas` (`id`) ON DELETE CASCADE,
    CONSTRAINT `chiva_has_viaje_viajes` FOREIGN KEY (`viaje`) REFERENCES `viajes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `chivas` (`matricula`, `capacidad`, `estado`, `conductor`) VALUES
('ABC123', 30, 'disponible', 'Juan Pérez'),
('DEF456', 25, 'disponible', 'Pedro Gómez'),
('GHI789', 40, 'disponible', 'Carlos López');

INSERT INTO `viajes` (`fecha`, `hora`, `chiva`, `origen`, `destino`, `precio`, `duracion`, `tiquetes_disponibles`)
VALUES 
('2024-07-18', '08:30:00', 1, 'Bogotá', 'Medellín', 50000, 8, 30),
('2024-07-19', '12:00:00', 2, 'Cali', 'Cartagena', 75000, 10, 25),
('2024-07-20', '07:45:00', 3, 'Medellín', 'Bogotá', 48000, 8, 20),
('2024-07-21', '15:30:00', 1, 'Cartagena', 'Santa Marta', 30000, 4, 40),
('2024-07-22', '09:00:00', 2, 'Barranquilla', 'Medellín', 60000, 9, 35),
('2024-07-23', '11:15:00', 3, 'Santa Marta', 'Cartagena', 29000, 4, 30),
('2024-07-24', '17:00:00', 1, 'Bogotá', 'Cali', 52000, 9, 20),
('2024-07-25', '13:45:00', 2, 'Medellín', 'Barranquilla', 65000, 9, 28),
('2024-07-26', '10:00:00', 3, 'Cartagena', 'Bogotá', 80000, 12, 15),
('2024-07-27', '14:30:00', 1, 'Cali', 'Medellín', 55000, 8, 22);

INSERT INTO `chiva_has_viaje` (`chiva`, `viaje`) VALUES
(1, 1),
(2, 2),
(3, 3),
(1, 4),
(2, 5),
(3, 6),
(1, 7),
(2, 8),
(3, 9),
(1, 10);


INSERT INTO `usuarios` (`nombre`, `email`, `password`, `is_admin`) VALUES
('user', 'user@chivas.com', '12345678', 0);


