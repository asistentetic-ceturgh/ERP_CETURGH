-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-06-2026 a las 22:24:57
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `erp`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `areas_costos`
--

CREATE TABLE `areas_costos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `presupuesto` decimal(10,2) DEFAULT 0.00,
  `ejecutado` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `areas_costos`
--

INSERT INTO `areas_costos` (`id`, `nombre`, `empresa_id`, `sede_id`, `presupuesto`, `ejecutado`) VALUES
(1, 'Administración y Recursos Humanos', 2, NULL, 0.00, 0.00),
(2, 'Coordinación Académica - Instituto', 2, NULL, 0.00, 0.00),
(3, 'Marketing', 2, NULL, 0.00, 0.00),
(4, 'Logistica y Almacén', 2, NULL, 0.00, 0.00),
(5, 'Mantenimiento y vigilancia', 2, NULL, 0.00, 0.00),
(6, 'Bienestar Estudiantil y Empleabilidad', 2, NULL, 0.00, 0.00),
(7, 'TIC', 2, NULL, 0.00, 0.00),
(8, 'Ventas', 2, NULL, 0.00, 0.00),
(9, 'Administración y Recursos Humanos', 1, NULL, 0.00, 0.00),
(10, 'Coordinación Académica Cetpro Piura', 1, NULL, 0.00, 0.00),
(11, 'Coordinación Académica Cetpro Sullana', 1, NULL, 0.00, 0.00),
(12, 'Marketing', 1, NULL, 0.00, 0.00),
(13, 'Logistica y Almacén', 1, NULL, 0.00, 0.00),
(14, 'Mantenimiento y Vigilancia', 1, NULL, 0.00, 0.00),
(15, 'Bienestar Estudiantil y Empleabilidad', 1, NULL, 0.00, 0.00),
(16, 'TIC', 1, NULL, 20.00, 0.00),
(17, 'Centro de Idiomas', 1, NULL, 0.00, 0.00),
(18, 'Ventas', 1, NULL, 0.00, 0.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `area_departamento`
--

CREATE TABLE `area_departamento` (
  `id` int(11) NOT NULL,
  `area_id` int(11) DEFAULT NULL,
  `departamento_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `area_departamento`
--

INSERT INTO `area_departamento` (`id`, `area_id`, `departamento_id`) VALUES
(6, 9, 22),
(7, 1, 22);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulos`
--

CREATE TABLE `articulos` (
  `id` int(11) NOT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `subcategoria` varchar(50) DEFAULT NULL,
  `unidad` varchar(20) DEFAULT NULL,
  `stock_actual` int(11) DEFAULT NULL,
  `stock_min` int(11) DEFAULT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `responsable` varchar(100) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cajas_chicas`
--

CREATE TABLE `cajas_chicas` (
  `id` int(11) NOT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `centro_costo_id` int(11) DEFAULT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `monto_base` decimal(10,2) DEFAULT NULL,
  `saldo_actual` decimal(10,2) DEFAULT NULL,
  `estado` enum('ACTIVA','AGOTADA','PENDIENTE_APERTURA','CERRADA') DEFAULT 'PENDIENTE_APERTURA',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `cajas_chicas`
--

INSERT INTO `cajas_chicas` (`id`, `empresa_id`, `sede_id`, `centro_costo_id`, `codigo`, `monto_base`, `saldo_actual`, `estado`, `created_at`) VALUES
(1, 1, 1, 158, 'TESORERIA_INSTITUTO', 1000.00, 787.00, 'ACTIVA', '2026-05-29 15:34:02'),
(2, 1, 1, 158, 'TESORERIA_CETPRO_PIURA', 1000.00, 1000.00, 'ACTIVA', '2026-05-30 17:24:22'),
(3, 2, 3, 98, 'ALMACEN_INSTITUTO', 500.00, 1000.00, 'ACTIVA', '2026-05-30 17:49:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carreras`
--

CREATE TABLE `carreras` (
  `id` int(11) NOT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `carreras`
--

INSERT INTO `carreras` (`id`, `empresa_id`, `sede_id`, `nombre`, `estado`, `created_at`) VALUES
(1, 2, 3, 'Administración de Servicios de Hostelería y Restaurantes', 'ACTIVO', '2026-05-12 16:19:16'),
(2, 2, 3, 'Gastronomía', 'ACTIVO', '2026-05-12 16:19:16'),
(3, 1, 1, 'BAR Y COCTELERIA', 'ACTIVO', '2026-05-12 16:19:16'),
(4, 1, 1, 'AVIACION COMERCIAL', 'ACTIVO', '2026-05-12 16:19:16'),
(5, 1, 1, 'PANADERÍA Y PASTELERÍA', 'ACTIVO', '2026-05-12 16:19:16'),
(6, 1, 2, 'BAR Y COCTELERIA', 'ACTIVO', '2026-05-12 16:19:16'),
(7, 1, 2, 'AVIACION COMERCIAL', 'ACTIVO', '2026-05-12 16:19:16'),
(8, 1, 2, 'PANADERÍA Y PASTELERÍA', 'ACTIVO', '2026-05-12 16:19:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `centros_costos`
--

CREATE TABLE `centros_costos` (
  `id` int(11) NOT NULL,
  `codigo` varchar(20) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `presupuesto` decimal(10,2) DEFAULT 0.00,
  `gastado` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `centros_costos`
--

INSERT INTO `centros_costos` (`id`, `codigo`, `nombre`, `parent_id`, `empresa_id`, `sede_id`, `presupuesto`, `gastado`) VALUES
(1, '1', 'GASTO ADMINISTRATIVO', NULL, 2, 3, 7000.00, 20.00),
(2, '1.1', 'PLANILLAS', 1, 2, 3, 0.00, 0.00),
(3, '1.2', 'IMPUESTOS LABORALES', 1, 2, 3, 0.00, 0.00),
(4, '1.3', 'SERVICIOS VARIOS', 1, 2, 3, 0.00, 0.00),
(5, '1.4', 'OTROS GASTOS ADMINISTRATIVOS', 1, 2, 3, 0.00, 0.00),
(6, '1.5', 'UNIFORMES', 1, 2, 3, 0.00, 0.00),
(7, '1.1.1', 'PLANILLA ADMINISTRATIVA', 2, 2, 3, 0.00, 0.00),
(8, '1.1.2', 'PLANILLA DOCENTE', 2, 2, 3, 0.00, 0.00),
(9, '1.1.3', 'PLANILLA RH', 2, 2, 3, 0.00, 0.00),
(10, '1.1.4', 'GRATIFICACIONES', 2, 2, 3, 0.00, 0.00),
(11, '1.1.5', 'CTS', 2, 2, 3, 0.00, 0.00),
(12, '1.1.6', 'BONOS (ALOJAMIENTO, ALIMENTACIÓN, ETC)', 2, 2, 3, 0.00, 2.00),
(13, '1.1.7', 'VACACIONES ADELANTAS', 2, 2, 3, 0.00, 0.00),
(14, '1.1.8', 'LIQUIDACIONES', 2, 2, 3, 0.00, 0.00),
(15, '1.1.9', 'MOVILIDAD', 2, 2, 3, 0.00, 0.00),
(16, '1.1.10', 'CANASTAS PARA FIN DE AÑO', 2, 2, 3, 0.00, 0.00),
(17, '1.1.11', 'TORTA DE CUMPLEAÑOS Y BEBIDAS', 2, 2, 3, 0.00, 0.00),
(18, '1.2.1', 'ESSALUD', 3, 2, 3, 0.00, 0.00),
(19, '1.2.2', 'ONP', 3, 2, 3, 0.00, 0.00),
(20, '1.2.3', 'IGV', 3, 2, 3, 0.00, 0.00),
(21, '1.2.4', 'RENTA', 3, 2, 3, 0.00, 0.00),
(22, '1.2.5', 'AFP', 3, 2, 3, 0.00, 0.00),
(23, '1.2.6', 'ITAN', 3, 2, 3, 0.00, 0.00),
(24, '1.2.7', 'SEGURO VIDA LEY', 3, 2, 3, 0.00, 0.00),
(25, '1.3.1', 'ASESORIA CONTABLE', 4, 2, 3, 0.00, 0.00),
(26, '1.3.2', 'ASESORIA LEGAL', 4, 2, 3, 0.00, 0.00),
(27, '1.3.3', 'SERVICIO LIMPIEZA', 4, 2, 3, 0.00, 0.00),
(28, '1.3.4', 'OTRAS ASESORIAS', 4, 2, 3, 0.00, 0.00),
(29, '1.4.1', 'CAJA CHICA', 5, 2, 3, 10000.00, 10.00),
(30, '1.4.2', 'UTILES DE ESCRITORIO', 5, 2, 3, 0.00, 0.00),
(31, '1.4.3', 'AGUA EN BIDON', 5, 2, 3, 0.00, 0.00),
(32, '1.4.4', 'GASTOS NOTARIALES / LEGALES', 5, 2, 3, 0.00, 0.00),
(33, '1.4.5', 'VIATICOS', 5, 2, 3, 0.00, 0.00),
(34, '1.4.6', 'ALQUILER CAMIONETA', 5, 2, 3, 0.00, 0.00),
(35, '1.4.7', 'ALQUILER DEPÓSITO', 5, 2, 3, 0.00, 0.00),
(36, '1.4.8', 'OTROS GASTOS', 5, 2, 3, 0.00, 0.00),
(37, '1.4.9', 'LINEAS CORPORATIVAS', 5, 2, 3, 0.00, 0.00),
(38, '1.4.10', 'OTROS GASTOS DE GERENCIA', 5, 2, 3, 0.00, 0.00),
(39, '1.5.1', 'CAMISAS - VIGILANCIA', 6, 2, 3, 0.00, 0.00),
(40, '1.5.2', 'CORBATAS - VIGILANCIA', 6, 2, 3, 0.00, 0.00),
(41, '1.5.3', 'PANTALONES - VIGILANCIA', 6, 2, 3, 0.00, 0.00),
(42, '1.5.4', 'POLOS - MANTENIMIENTO', 6, 2, 3, 0.00, 0.00),
(43, '1.5.5', 'PANTALONES - MANTENIMIENTO', 6, 2, 3, 0.00, 0.00),
(44, '1.5.6', 'CALZADO DE SEGURIDAD - MANTENIMIENTO', 6, 2, 3, 0.00, 0.00),
(45, '1.5.7', 'BANDERAS PARA LA FACHADA', 6, 2, 3, 0.00, 0.00),
(46, '1.5.8', 'BANDERAS GRANDES', 6, 2, 3, 0.00, 0.00),
(47, '1.5.9', 'BANDERAS PEQUEÑAS', 6, 2, 3, 0.00, 0.00),
(48, '2', 'COSTO OPERATIVO', NULL, 2, 3, 0.00, 0.00),
(49, '2.1', 'ALQUILER LOCAL', 48, 2, 3, 0.00, 0.00),
(50, '2.2', 'SERVICIOS VARIOS', 48, 2, 3, 0.00, 0.00),
(51, '2.3', 'IMPUESTO PREDIAL Y ARBITRIOS', 48, 2, 3, 0.00, 0.00),
(52, '2.4', 'SEGURO ESTUDIANTIL CONTRA ACCIDENTES', 48, 2, 3, 0.00, 0.00),
(53, '3', 'MARKETING Y VENTAS', NULL, 2, 3, 0.00, 0.00),
(54, '3.1', 'PAUTEO EN REDES', 53, 2, 3, 0.00, 0.00),
(55, '3.2', 'ASESORIA MKT Y VENTAS', 53, 2, 3, 0.00, 0.00),
(56, '3.3', 'MERCHANDISING', 53, 2, 3, 0.00, 0.00),
(57, '3.4', 'PUBLICIDAD', 53, 2, 3, 0.00, 0.00),
(58, '3.5', 'IMPRENTA (TRIPTICOS, VOLANTES,ETC)', 53, 2, 3, 0.00, 0.00),
(59, '3.6', 'INFLUENCER', 53, 2, 3, 0.00, 0.00),
(60, '3.7', 'PAGOS PLATAFORMAS', 53, 2, 3, 0.00, 0.00),
(61, '3.8', 'AUSPICIOS EN EVENTOS', 53, 2, 3, 0.00, 0.00),
(62, '3.9', 'OTROS GASTOS', 53, 2, 3, 0.00, 0.00),
(63, '3.4.1', 'ALQUILER DE PANELES', 57, 2, 3, 0.00, 0.00),
(64, '3.4.2', 'TOTEM PUBLICITARIO', 57, 2, 3, 0.00, 0.00),
(65, '3.7.1', 'CLIENTIFY', 60, 2, 3, 0.00, 0.00),
(66, '3.7.2', 'CAPCUT', 60, 2, 3, 0.00, 0.00),
(67, '3.7.3', 'ADOBE', 60, 2, 3, 0.00, 0.00),
(68, '3.7.4', 'SOLUCIONES MKT', 60, 2, 3, 0.00, 0.00),
(69, '3.7.5', 'ALMACENAMIENTO IPHONE', 60, 2, 3, 0.00, 0.00),
(70, '3.7.6', 'LICENCIAS DE MICROSOFT Y BIBLIOTECA VIRTUAL', 60, 2, 3, 0.00, 0.00),
(71, '3.7.7', 'HOSTING Y SERVICIO DE MENSAJERIA MASIVO', 60, 2, 3, 0.00, 0.00),
(72, '3.8.1', 'AUSPICIO A EVENTOS', 61, 2, 3, 0.00, 0.00),
(73, '3.8.2', 'VIATICOS INTERIOR (COMPRA DE PASAJES, ALIMENTACION, ALOJAMIENTO, MOVILIDAD)', 61, 2, 3, 0.00, 0.00),
(74, '3.8.3', 'VIATICOS EXTERIOR (COMPRA DE PASAJES, ALIMENTACION, ALOJAMIENTO, MOVILIDAD)', 61, 2, 3, 0.00, 0.00),
(75, '3.8.4', 'INSUMOS', 61, 2, 3, 0.00, 0.00),
(76, '3.8.5', 'COBERTURA DE PRENSA', 61, 2, 3, 0.00, 0.00),
(77, '3.8.6', 'EFEMERIDES (REQUERIMIENTO DE EVENTOS)', 61, 2, 3, 0.00, 0.00),
(78, '3.9.1', 'CAJA CHICA MKT', 62, 2, 3, 0.00, 0.00),
(79, '3.9.2', 'OTROS', 62, 2, 3, 0.00, 0.00),
(80, '3.9.3', 'COMISIONES VENDEDORAS', 62, 2, 3, 0.00, 0.00),
(81, '3.9.4', 'DISPOSITIVOS', 62, 2, 3, 0.00, 0.00),
(82, '3.9.5', 'MATERIALES', 62, 2, 3, 0.00, 0.00),
(83, '4', 'COSTO LOGISTICA', NULL, 2, 3, 0.00, 0.00),
(84, '4.1', 'INSUMOS', 83, 2, 3, 0.00, 0.00),
(85, '4.2', 'MANTENIMIENTOS VARIOS', 83, 2, 3, 0.00, 0.00),
(86, '4.3', 'SERVICIOS A TERCEROS', 83, 2, 3, 0.00, 0.00),
(87, '4.4', 'COMPRA ACTIVO FIJO', 83, 2, 3, 0.00, 0.00),
(88, '4.5', 'OTRAS COMPRAS', 83, 2, 3, 0.00, 0.00),
(89, '4.1.1', 'GASTRONOMIA', 84, 2, 3, 0.00, 0.00),
(90, '4.1.2', 'ASHR', 84, 2, 3, 0.00, 0.00),
(91, '4.1.3', 'CURSOS CORTOS', 84, 2, 3, 0.00, 0.00),
(92, '4.1.4', 'EXPERIENCIA GASTRONOMICA', 84, 2, 3, 0.00, 0.00),
(93, '4.1.5', 'BECA INCLUSIÓN', 84, 2, 3, 0.00, 0.00),
(94, '4.1.6', 'BECA TEC', 84, 2, 3, 0.00, 0.00),
(95, '4.2.1', 'MANTENIMIENTO ASCENSOR', 85, 2, 3, 0.00, 0.00),
(96, '4.2.2', 'MANTENIMIENTO COCINAS, AULAS, ETC', 85, 2, 3, 0.00, 0.00),
(97, '4.2.3', 'OTROS MANTENIMIENTOS', 85, 2, 3, 0.00, 0.00),
(98, '4.5.1', 'CAJA CHICA ALMACÉN', 88, 2, 3, 0.00, 0.00),
(99, '4.5.2', 'OTRAS COMPRAS', 88, 2, 3, 0.00, 0.00),
(100, '4.5.3', 'ÚTILES DE LIMPIEZA', 88, 2, 3, 0.00, 0.00),
(101, '4.5.4', 'COMPRA BATERIA MENOR', 88, 2, 3, 0.00, 0.00),
(102, '4.5.5', 'STOP COMPONENTES TIC', 88, 2, 3, 0.00, 0.00),
(103, '5', 'CAMPUS CETURGH', NULL, 2, 3, 0.00, 0.00),
(104, '5.1', 'CISTERNA DE AGUA', 103, 2, 3, 0.00, 0.00),
(105, '5.2', 'SERVICIO VIGILANCIA', 103, 2, 3, 0.00, 0.00),
(106, '5.3', 'MANTENIMIENTO', 103, 2, 3, 0.00, 0.00),
(107, '5.4', 'SERVICIOS', 103, 2, 3, 0.00, 0.00),
(108, '6', 'FINANCIAMIENTO', NULL, 2, 3, 0.00, 0.00),
(109, '6.1', 'PRÉSTAMOS BANCOS', 108, 2, 3, 0.00, 0.00),
(110, '6.2', 'COMISIONES BANCARIAS', 108, 2, 3, 0.00, 0.00),
(111, '6.3', 'PRÉSTAMOS ACCIONISTA', 108, 2, 3, 0.00, 0.00),
(112, '6.4', 'OTROS GASTOS FINANCIEROS', 108, 2, 3, 0.00, 0.00),
(113, '6.1.1', 'BCP', 109, 2, 3, 0.00, 0.00),
(114, '6.1.2', 'BBVA', 109, 2, 3, 0.00, 0.00),
(115, '2.1.1', 'ALQUILER AV. SANCHEZ CERRO 228 - 234', 49, 2, 3, 0.00, 0.00),
(116, '2.1.2', 'ALQUILER AV. SANCHEZ CERRO 242', 49, 2, 3, 0.00, 0.00),
(117, '2.1.3', 'ALQUILER AV. SANCHEZ CERRO 260', 49, 2, 3, 0.00, 0.00),
(118, '2.1.4', 'ALQUILER CALLE CORDOVA 146 (SULLANA)', 49, 2, 3, 0.00, 0.00),
(119, '2.2.1', 'PLATAFORMA Q10', 50, 2, 3, 0.00, 0.00),
(120, '2.2.2', 'LUZ', 50, 2, 3, 0.00, 0.00),
(121, '2.2.3', 'AGUA', 50, 2, 3, 0.00, 0.00),
(122, '2.2.4', 'INTERNET', 50, 2, 3, 0.00, 0.00),
(123, '2.2.5', 'GAS', 50, 2, 3, 0.00, 0.00),
(124, '2.2.6', 'CÁMARA DE COMERCIO', 50, 2, 3, 0.00, 0.00),
(125, '2.2.7', 'WORLD CHEF', 50, 2, 3, 0.00, 0.00),
(126, '2.2.8', 'BIBLIOTECA VIRTUAL', 50, 2, 3, 0.00, 0.00),
(127, '2.2.9', 'CANATUR', 50, 2, 3, 0.00, 0.00),
(128, '2.2.10', 'OTROS SERVICIOS', 50, 2, 3, 0.00, 0.00),
(129, '2.3.1', 'IMPUESTO PREDIAL ', 51, 2, 3, 0.00, 0.00),
(130, '2.3.2', 'ARBITRIOS', 51, 2, 3, 0.00, 0.00),
(131, '1', 'GASTO ADMINISTRATIVO', NULL, 1, 1, 0.00, 302.00),
(132, '1.1', 'PLANILLAS', 131, 1, 1, 0.00, 48.00),
(133, '1.1.1', 'PLANILLA ADMINISTRATIVA', 132, 1, 1, 0.00, 0.00),
(134, '1.1.2', 'PLANILLA DOCENTE', 132, 1, 1, 0.00, 0.00),
(135, '1.1.3', 'PLANILLA RH', 132, 1, 1, 0.00, 0.00),
(136, '1.1.4', 'GRATIFICACIONES', 132, 1, 1, 0.00, 0.00),
(137, '1.1.5', 'CTS', 132, 1, 1, 0.00, 0.00),
(138, '1.1.6', 'BONOS (ALOJAMIENTO, ALIMENTACIÓN, ETC)', 132, 1, 1, 0.00, 0.00),
(139, '1.1.7', 'VACACIONES ADELANTAS', 132, 1, 1, 0.00, 0.00),
(140, '1.1.8', 'LIQUIDACIONES', 132, 1, 1, 0.00, 0.00),
(141, '1.1.9', 'MOVILIDAD', 132, 1, 1, 0.00, 0.00),
(142, '1.1.10', 'CANASTAS PARA FIN DE AÑO', 132, 1, 1, 0.00, 0.00),
(143, '1.1.11', 'TORTA DE CUMPLEAÑOS Y BEBIDAS ', 132, 1, 1, 0.00, 0.00),
(144, '1.2', 'IMPUESTOS LABORALES ', 131, 1, 1, 0.00, 0.00),
(145, '1.2.1', 'ESSALUD', 144, 1, 1, 0.00, 0.00),
(146, '1.2.2', 'ONP ', 144, 1, 1, 0.00, 0.00),
(147, '1.2.3', 'IGV', 144, 1, 1, 0.00, 0.00),
(148, '1.2.4', 'RENTA', 144, 1, 1, 0.00, 0.00),
(149, '1.2.5', 'AFP', 144, 1, 1, 0.00, 0.00),
(150, '1.2.6', 'ITAN', 144, 1, 1, 0.00, 0.00),
(151, '1.2.7', 'SEGURO VIDA LEY', 144, 1, 1, 0.00, 0.00),
(152, '1.3', 'SERVICIOS VARIOS', 131, 1, 1, 0.00, 0.00),
(153, '1.3.1', 'ASESORIA CONTABLE', 152, 1, 1, 0.00, 0.00),
(154, '1.3.2', 'ASESORIA LEGAL', 152, 1, 1, 0.00, 0.00),
(155, '1.3.3', 'SERVICIO LIMPIEZA', 152, 1, 1, 0.00, 0.00),
(156, '1.3.4', 'OTRAS ASESORIAS', 152, 1, 1, 0.00, 0.00),
(157, '1.4', 'OTROS GASTOS ADMINISTRATIVOS', 131, 1, 1, 0.00, 0.00),
(158, '1.4.1', 'CAJA CHICA', 157, 1, 1, 10000.00, 50.00),
(159, '1.4.2', 'UTILES DE ESCRITORIO', 157, 1, 1, 0.00, 0.00),
(160, '1.4.3', 'AGUA EN BIDON', 157, 1, 1, 0.00, 0.00),
(161, '1.4.4', 'GASTOS NOTARIALES / LEGALES', 157, 1, 1, 0.00, 0.00),
(162, '1.4.5', 'VIATICOS', 157, 1, 1, 0.00, 0.00),
(163, '1.4.6', 'ALQUILER CAMIONETA', 157, 1, 1, 0.00, 0.00),
(164, '1.4.7', 'ALQUILER DEPÓSITO', 157, 1, 1, 0.00, 0.00),
(165, '1.4.8', 'OTROS GASTOS ', 157, 1, 1, 0.00, 0.00),
(166, '1.4.9', 'LINEAS CORPORATIVAS', 157, 1, 1, 0.00, 0.00),
(167, '1.4.10', 'OTROS GASTOS DE GERENCIA', 157, 1, 1, 0.00, 0.00),
(168, '1.5', 'UNIFORMES', 131, 1, 1, 0.00, 0.00),
(169, '1.5.1', 'CAMISAS - VIGILANCIA', 168, 1, 1, 0.00, 0.00),
(170, '1.5.2', 'CORBATAS - VIGILANCIA', 168, 1, 1, 0.00, 0.00),
(171, '1.5.3', 'PANTALONES - VIGILANCIA', 168, 1, 1, 0.00, 0.00),
(172, '1.5.4', 'POLOS - MANTENIMIENTO', 168, 1, 1, 0.00, 0.00),
(173, '1.5.5', 'PANTALONES - MANTENIMIENTO', 168, 1, 1, 0.00, 0.00),
(174, '1.5.6', 'CALZADO DE DE SEGURIDAD - MANTENIMIENTO', 168, 1, 1, 0.00, 0.00),
(175, '1.5.7', 'BANDERAS PARA LA FACHADA', 168, 1, 1, 0.00, 0.00),
(176, '1.5.8', 'BANDERAS GRANDES', 168, 1, 1, 0.00, 0.00),
(177, '1.5.9', 'BANDERAS PEQUEÑAS', 168, 1, 1, 0.00, 0.00),
(178, '2', 'COSTO OPERATIVO', NULL, 1, 1, 2000.00, 265.00),
(179, '2.1', 'ALQUILER LOCAL ', 178, 1, 1, 0.00, 0.00),
(180, '2.1.1', 'ALQUILER COLEGIO SALESIANO ', 179, 1, 1, 0.00, 0.00),
(181, '2.1.2', 'ALQUILER CALLE CORDOVA 146 (SULLANA)', 179, 1, 1, 0.00, 0.00),
(182, '2.1.3', 'ALQUILER CAMIONETA', 179, 1, 1, 0.00, 0.00),
(183, '2.1.4', 'OTROS', 179, 1, 1, 0.00, 0.00),
(184, '2.2', 'SERVICIOS VARIOS', 178, 1, 1, 0.00, 0.00),
(185, '2.2.1', 'PLATAFORMA Q10', 184, 1, 1, 0.00, 0.00),
(186, '2.2.2', 'LUZ', 184, 1, 1, 0.00, 0.00),
(187, '2.2.3', 'AGUA ', 184, 1, 1, 0.00, 0.00),
(188, '2.2.4', 'INTERNET', 184, 1, 1, 0.00, 0.00),
(189, '2.2.5', 'GAS', 184, 1, 1, 0.00, 0.00),
(190, '2.2.6', 'CÁMARA DE COMERCIO', 184, 1, 1, 0.00, 0.00),
(191, '2.2.7', 'WORLD CHEF', 184, 1, 1, 0.00, 0.00),
(192, '2.2.8', 'BIBLIOTECA VIRTUAL', 184, 1, 1, 0.00, 0.00),
(193, '2.2.9', 'CANATUR', 184, 1, 1, 0.00, 0.00),
(194, '2.2.10', 'OTROS SERVICIOS', 184, 1, 1, 0.00, 0.00),
(195, '2.3', 'IMPUESTO PREDIAL Y ARBITRIOS', 178, 1, 1, 0.00, 0.00),
(196, '2.3.1', 'IMPUESTO PREDIAL ', 195, 1, 1, 0.00, 0.00),
(197, '2.3.2', 'ARBITRIOS', 195, 1, 1, 0.00, 0.00),
(198, '2.4', 'SEGURO ESTUDIANTIL CONTRA ACCIDENTES', 178, 1, 1, 0.00, 0.00),
(199, '3', 'MARKETING Y VENTAS', NULL, 1, 1, 0.00, 0.00),
(200, '3.1', 'PAUTEO EN REDES', 199, 1, 1, 0.00, 0.00),
(201, '3.2', 'ASESORIA MKT Y VENTAS', 199, 1, 1, 0.00, 0.00),
(202, '3.3', 'MERCHANDISING', 199, 1, 1, 0.00, 0.00),
(203, '3.4', 'PUBLICIDAD', 199, 1, 1, 0.00, 0.00),
(204, '3.4.1', 'ALQUILER DE PANELES', 203, 1, 1, 0.00, 0.00),
(205, '3.4.2', 'TOTEM PUBLICITARIO', 203, 1, 1, 0.00, 0.00),
(206, '3.5', 'IMPRENTA (TRIPTICOS, VOLANTES,ETC)', 199, 1, 1, 0.00, 0.00),
(207, '3.6', 'INFLUENCER', 199, 1, 1, 0.00, 0.00),
(208, '3.7', 'PAGOS PLATAFORMAS', 199, 1, 1, 0.00, 0.00),
(209, '3.7.1', 'CLIENTIFY', 208, 1, 1, 0.00, 0.00),
(210, '3.7.2', 'CAPCUT', 208, 1, 1, 0.00, 0.00),
(211, '3.7.3', 'ADOBE', 208, 1, 1, 0.00, 0.00),
(212, '3.7.4', 'SOLUCIONES MKT', 208, 1, 1, 0.00, 0.00),
(213, '3.7.5', 'ALMACENAMIENTO IPHONE', 208, 1, 1, 0.00, 0.00),
(214, '3.7.6', 'LICENCIAS DE MICROSOFT Y BIBLIOTECA VIRTUAL', 208, 1, 1, 0.00, 0.00),
(215, '3.7.7', 'HOSTING Y SERVICIO DE MENSAJERIA MASIVO', 208, 1, 1, 0.00, 0.00),
(216, '3.8', 'AUSPICIOS EN EVENTOS', 199, 1, 1, 0.00, 0.00),
(217, '3.8.1', 'AUSPICIO A EVENTOS', 216, 1, 1, 0.00, 0.00),
(218, '3.8.2', 'VIATICOS INTERIOR (COMPRA DE PASAJES, ALIMENTACION, ALOJAMIENTO, MOVILIDAD)', 216, 1, 1, 0.00, 0.00),
(219, '3.8.3', 'VIATICOS EXTERIOR (COMPRA DE PASAJES, ALIMENTACION, ALOJAMIENTO, MOVILIDAD)', 216, 1, 1, 0.00, 0.00),
(220, '3.8.4', 'INSUMOS', 216, 1, 1, 0.00, 0.00),
(221, '3.8.5', 'COBERTURA DE PRENSA', 216, 1, 1, 0.00, 0.00),
(222, '3.8.6', 'EFEMERIDES (REQUERIMIENTO DE EVENTOS)', 216, 1, 1, 0.00, 0.00),
(223, '3.9', 'OTROS GASTOS', 199, 1, 1, 0.00, 0.00),
(224, '3.9.1', 'CAJA CHICA MKT', 223, 1, 1, 0.00, 0.00),
(225, '3.9.2', 'OTROS', 223, 1, 1, 0.00, 0.00),
(226, '3.9.3', 'COMISIONES VENDEDORAS', 223, 1, 1, 0.00, 0.00),
(227, '3.9.4', 'DISPOSITIVOS', 223, 1, 1, 0.00, 0.00),
(228, '3.9.5', 'MATERIALES', 223, 1, 1, 0.00, 0.00),
(229, '4', 'COSTO LOGISTICA', NULL, 1, 1, 0.00, 0.00),
(230, '4.1', 'INSUMOS', 229, 1, 1, 0.00, 0.00),
(231, '4.1.1', 'COCINA', 230, 1, 1, 0.00, 0.00),
(232, '4.1.2', 'PANADERIA Y PASTELERIA', 230, 1, 1, 0.00, 0.00),
(233, '4.1.3', 'BAR Y COCTELERIA', 230, 1, 1, 0.00, 0.00),
(234, '4.1.4', 'AVIACIÓN COMERCIAL', 230, 1, 1, 0.00, 0.00),
(235, '4.1.5', 'CURSOS CORTOS / MASTER CLASS', 230, 1, 1, 0.00, 0.00),
(236, '4.1.6', 'VENTAS CORPORATIVAS', 230, 1, 1, 0.00, 0.00),
(237, '4.2', 'MANTENIMIENTOS VARIOS', 229, 1, 1, 0.00, 0.00),
(238, '4.2.1', 'MANTENIMIENTO ASCENSOR', 237, 1, 1, 0.00, 0.00),
(239, '4.2.2', 'MANTENIMIENTO COCINAS, AULAS, ETC', 237, 1, 1, 0.00, 0.00),
(240, '4.2.3', 'OTROS MANTENIMIENTOS', 237, 1, 1, 0.00, 0.00),
(241, '4.3', 'SERVICIOS A TERCEROS', 229, 1, 1, 0.00, 0.00),
(242, '4.4', 'COMPRA ACTIVO FIJO', 229, 1, 1, 0.00, 0.00),
(243, '4.5', 'OTRAS COMPRAS', 229, 1, 1, 0.00, 0.00),
(244, '4.5.1', 'CAJA CHICA ALMACÉN', 243, 1, 1, 0.00, 0.00),
(245, '4.5.2', 'OTRAS COMPRAS', 243, 1, 1, 0.00, 0.00),
(246, '4.5.3', 'ÚTILES DE LIMPIEZA', 243, 1, 1, 0.00, 0.00),
(247, '4.5.4', 'COMPRA BATERIA MENOR', 243, 1, 1, 0.00, 0.00),
(248, '4.5.5', 'STOP COMPONENTES TIC', 243, 1, 1, 0.00, 0.00),
(249, '5', 'CAMPUS CETURGH', NULL, 1, 1, 0.00, 0.00),
(250, '5.1', 'CISTERNA DE AGUA', 249, 1, 1, 0.00, 0.00),
(251, '5.2', 'SERVICIO VIGILANCIA', 249, 1, 1, 0.00, 0.00),
(252, '5.3', 'MANTENIMIENTO ', 249, 1, 1, 0.00, 0.00),
(253, '5.4', 'SERVICIOS', 249, 1, 1, 0.00, 0.00),
(254, '6', 'FINANCIAMIENTO', NULL, 1, 1, 0.00, 0.00),
(255, '6.1', 'PRÉSTAMOS BANCOS', 254, 1, 1, 0.00, 0.00),
(256, '6.1.1', 'BCP ', 255, 1, 1, 0.00, 0.00),
(257, '6.1.2', 'BBVA', 255, 1, 1, 0.00, 0.00),
(258, '6.2', 'COMISIONES BANCARIAS', 254, 1, 1, 0.00, 0.00),
(259, '6.3', 'PRÉSTAMOS ACCIONISTA', 254, 1, 1, 0.00, 0.00),
(260, '6.4', 'OTROS GASTOS FINANCIEROS', 254, 1, 1, 0.00, 0.00),
(261, '1', 'GASTO ADMINISTRATIVO', NULL, 1, 2, 0.00, 2.00),
(262, '1.1', 'PLANILLAS', 261, 1, 2, 0.00, 0.00),
(263, '1.1.1', 'PLANILLA ADMINISTRATIVA', 262, 1, 2, 0.00, 0.00),
(264, '1.1.2', 'PLANILLA DOCENTE', 262, 1, 2, 0.00, 0.00),
(265, '1.1.3', 'PLANILLA RH', 262, 1, 2, 0.00, 0.00),
(266, '1.1.4', 'GRATIFICACIONES', 262, 1, 2, 0.00, 0.00),
(267, '1.1.5', 'CTS', 262, 1, 2, 0.00, 0.00),
(268, '1.1.6', 'BONOS (ALOJAMIENTO, ALIMENTACIÓN, ETC)', 262, 1, 2, 0.00, 0.00),
(269, '1.1.7', 'VACACIONES ADELANTAS', 262, 1, 2, 0.00, 0.00),
(270, '1.1.8', 'LIQUIDACIONES', 262, 1, 2, 0.00, 0.00),
(271, '1.1.9', 'MOVILIDAD', 262, 1, 2, 0.00, 0.00),
(272, '1.1.10', 'CANASTAS PARA FIN DE AÑO', 262, 1, 2, 0.00, 0.00),
(273, '1.1.11', 'TORTA DE CUMPLEAÑOS Y BEBIDAS ', 262, 1, 2, 0.00, 0.00),
(274, '1.2', 'IMPUESTOS LABORALES ', 261, 1, 2, 0.00, 0.00),
(275, '1.2.1', 'ESSALUD', 274, 1, 2, 0.00, 0.00),
(276, '1.2.2', 'ONP ', 274, 1, 2, 0.00, 0.00),
(277, '1.2.3', 'IGV', 274, 1, 2, 0.00, 0.00),
(278, '1.2.4', 'RENTA', 274, 1, 2, 0.00, 0.00),
(279, '1.2.5', 'AFP', 274, 1, 2, 0.00, 0.00),
(280, '1.2.6', 'ITAN', 274, 1, 2, 0.00, 0.00),
(281, '1.2.7', 'SEGURO VIDA LEY', 274, 1, 2, 0.00, 0.00),
(282, '1.3', 'SERVICIOS VARIOS', 261, 1, 2, 0.00, 0.00),
(283, '1.3.1', 'ASESORIA CONTABLE', 282, 1, 2, 0.00, 0.00),
(284, '1.3.2', 'ASESORIA LEGAL', 282, 1, 2, 0.00, 0.00),
(285, '1.3.3', 'SERVICIO LIMPIEZA', 282, 1, 2, 0.00, 0.00),
(286, '1.3.4', 'OTRAS ASESORIAS', 282, 1, 2, 0.00, 0.00),
(287, '1.4', 'OTROS GASTOS ADMINISTRATIVOS', 261, 1, 2, 0.00, 0.00),
(288, '1.4.1', 'CAJA CHICA', 287, 1, 2, 10000.00, 2.00),
(289, '1.4.2', 'UTILES DE ESCRITORIO', 287, 1, 2, 0.00, 0.00),
(290, '1.4.3', 'AGUA EN BIDON', 287, 1, 2, 0.00, 0.00),
(291, '1.4.4', 'GASTOS NOTARIALES / LEGALES', 287, 1, 2, 0.00, 0.00),
(292, '1.4.5', 'VIATICOS', 287, 1, 2, 0.00, 0.00),
(293, '1.4.6', 'ALQUILER CAMIONETA', 287, 1, 2, 0.00, 0.00),
(294, '1.4.7', 'ALQUILER DEPÓSITO', 287, 1, 2, 0.00, 0.00),
(295, '1.4.8', 'OTROS GASTOS ', 287, 1, 2, 0.00, 0.00),
(296, '1.4.9', 'LINEAS CORPORATIVAS', 287, 1, 2, 0.00, 0.00),
(297, '1.4.10', 'OTROS GASTOS DE GERENCIA', 287, 1, 2, 0.00, 0.00),
(298, '1.5', 'UNIFORMES', 261, 1, 2, 0.00, 0.00),
(299, '1.5.1', 'CAMISAS - VIGILANCIA', 298, 1, 2, 0.00, 0.00),
(300, '1.5.2', 'CORBATAS - VIGILANCIA', 298, 1, 2, 0.00, 0.00),
(301, '1.5.3', 'PANTALONES - VIGILANCIA', 298, 1, 2, 0.00, 0.00),
(302, '1.5.4', 'POLOS - MANTENIMIENTO', 298, 1, 2, 0.00, 0.00),
(303, '1.5.5', 'PANTALONES - MANTENIMIENTO', 298, 1, 2, 0.00, 0.00),
(304, '1.5.6', 'CALZADO DE  DE SEGURIDAD - MANTENIMIENTO', 298, 1, 2, 0.00, 0.00),
(305, '1.5.7', 'BANDERAS PARA LA FACHADA', 298, 1, 2, 0.00, 0.00),
(306, '1.5.8', 'BANDERAS GRANDES', 298, 1, 2, 0.00, 0.00),
(307, '1.5.9', 'BANDERAS PEQUEÑAS', 298, 1, 2, 0.00, 0.00),
(308, '2', 'COSTO OPERATIVO', NULL, 1, 2, 0.00, 0.00),
(309, '2.1', 'ALQUILER LOCAL ', 308, 1, 2, 0.00, 0.00),
(310, '2.1.1', 'ALQUILER COLEGIO SALESIANO ', 309, 1, 2, 0.00, 0.00),
(311, '2.1.2', 'ALQUILER CALLE CORDOVA 146 (SULLANA)', 309, 1, 2, 0.00, 0.00),
(312, '2.1.3', 'ALQUILER CAMIONETA', 309, 1, 2, 0.00, 0.00),
(313, '2.1.4', 'OTROS', 309, 1, 2, 0.00, 0.00),
(314, '2.2', 'SERVICIOS VARIOS', 308, 1, 2, 0.00, 0.00),
(315, '2.2.1', 'PLATAFORMA Q10', 314, 1, 2, 0.00, 0.00),
(316, '2.2.2', 'LUZ', 314, 1, 2, 0.00, 0.00),
(317, '2.2.3', 'AGUA ', 314, 1, 2, 0.00, 0.00),
(318, '2.2.4', 'INTERNET', 314, 1, 2, 0.00, 0.00),
(319, '2.2.5', 'GAS', 314, 1, 2, 0.00, 0.00),
(320, '2.2.6', 'CÁMARA DE COMERCIO', 314, 1, 2, 0.00, 0.00),
(321, '2.2.7', 'WORLD CHEF', 314, 1, 2, 0.00, 0.00),
(322, '2.2.8', 'BIBLIOTECA VIRTUAL', 314, 1, 2, 0.00, 0.00),
(323, '2.2.9', 'CANATUR', 314, 1, 2, 0.00, 0.00),
(324, '2.2.10', 'OTROS SERVICIOS', 314, 1, 2, 0.00, 0.00),
(325, '2.3', 'IMPUESTO PREDIAL Y ARBITRIOS', 308, 1, 2, 0.00, 0.00),
(326, '2.3.1', 'IMPUESTO PREDIAL ', 325, 1, 2, 0.00, 0.00),
(327, '2.3.2', 'ARBITRIOS', 325, 1, 2, 0.00, 0.00),
(328, '2.4', 'SEGURO ESTUDIANTIL CONTRA ACCIDENTES', 308, 1, 2, 0.00, 0.00),
(329, '3', 'MARKETING Y VENTAS', NULL, 1, 2, 4000.00, 474.00),
(330, '3.1', 'PAUTEO EN REDES', 329, 1, 2, 0.00, 0.00),
(331, '3.2', 'ASESORIA MKT Y VENTAS', 329, 1, 2, 0.00, 0.00),
(332, '3.3', 'MERCHANDISING', 329, 1, 2, 0.00, 0.00),
(333, '3.4', 'PUBLICIDAD', 329, 1, 2, 0.00, 0.00),
(334, '3.4.1', 'ALQUILER DE PANELES', 333, 1, 2, 0.00, 0.00),
(335, '3.4.2', 'TOTEM PUBLICITARIO', 333, 1, 2, 0.00, 0.00),
(336, '3.5', 'IMPRENTA (TRIPTICOS, VOLANTES,ETC)', 329, 1, 2, 0.00, 0.00),
(337, '3.6', 'INFLUENCER', 329, 1, 2, 0.00, 0.00),
(338, '3.7', 'PAGOS PLATAFORMAS', 329, 1, 2, 0.00, 0.00),
(339, '3.7.1', 'CLIENTIFY', 338, 1, 2, 0.00, 0.00),
(340, '3.7.2', 'CAPCUT', 338, 1, 2, 0.00, 0.00),
(341, '3.7.3', 'ADOBE', 338, 1, 2, 0.00, 0.00),
(342, '3.7.4', 'SOLUCIONES MKT', 338, 1, 2, 0.00, 0.00),
(343, '3.7.5', 'ALMACENAMIENTO IPHONE', 338, 1, 2, 0.00, 0.00),
(344, '3.7.6', 'LICENCIAS DE MICROSOFT Y BIBLIOTECA VIRTUAL', 338, 1, 2, 0.00, 0.00),
(345, '3.7.7', 'HOSTING Y SERVICIO DE MENSAJERIA MASIVO', 338, 1, 2, 0.00, 0.00),
(346, '3.8', 'AUSPICIOS EN EVENTOS', 329, 1, 2, 0.00, 0.00),
(347, '3.8.1', 'AUSPICIO A EVENTOS', 346, 1, 2, 0.00, 0.00),
(348, '3.8.2', 'VIATICOS INTERIOR (COMPRA DE PASAJES, ALIMENTACION, ALOJAMIENTO, MOVILIDAD)', 346, 1, 2, 0.00, 0.00),
(349, '3.8.3', 'VIATICOS EXTERIOR (COMPRA DE PASAJES, ALIMENTACION, ALOJAMIENTO, MOVILIDAD)', 346, 1, 2, 0.00, 0.00),
(350, '3.8.4', 'INSUMOS', 346, 1, 2, 0.00, 0.00),
(351, '3.8.5', 'COBERTURA DE PRENSA', 346, 1, 2, 0.00, 0.00),
(352, '3.8.6', 'EFEMERIDES (REQUERIMIENTO DE EVENTOS)', 346, 1, 2, 0.00, 0.00),
(353, '3.9', 'OTROS GASTOS', 329, 1, 2, 0.00, 0.00),
(354, '3.9.1', 'CAJA CHICA MKT', 353, 1, 2, 0.00, 0.00),
(355, '3.9.2', 'OTROS', 353, 1, 2, 0.00, 0.00),
(356, '3.9.3', 'COMISIONES VENDEDORAS', 353, 1, 2, 0.00, 0.00),
(357, '3.9.4', 'DISPOSITIVOS', 353, 1, 2, 0.00, 0.00),
(358, '3.9.5', 'MATERIALES', 353, 1, 2, 0.00, 0.00),
(359, '4', 'COSTO LOGISTICA', NULL, 1, 2, 0.00, 0.00),
(360, '4.1', 'INSUMOS', 359, 1, 2, 0.00, 0.00),
(361, '4.1.1', 'COCINA', 360, 1, 2, 0.00, 0.00),
(362, '4.1.2', 'PANADERIA Y PASTELERIA', 360, 1, 2, 0.00, 0.00),
(363, '4.1.3', 'BAR Y COCTELERIA', 360, 1, 2, 0.00, 0.00),
(364, '4.1.4', 'AVIACIÓN COMERCIAL', 360, 1, 2, 0.00, 0.00),
(365, '4.1.5', 'CURSOS CORTOS / MASTER CLASS', 360, 1, 2, 0.00, 0.00),
(366, '4.1.6', 'VENTAS CORPORATIVAS', 360, 1, 2, 0.00, 0.00),
(367, '4.2', 'MANTENIMIENTOS VARIOS', 359, 1, 2, 0.00, 0.00),
(368, '4.2.1', 'MANTENIMIENTO ASCENSOR', 367, 1, 2, 0.00, 0.00),
(369, '4.2.2', 'MANTENIMIENTO COCINAS, AULAS, ETC', 367, 1, 2, 0.00, 0.00),
(370, '4.2.3', 'OTROS MANTENIMIENTOS', 367, 1, 2, 0.00, 0.00),
(371, '4.3', 'SERVICIOS A TERCEROS', 359, 1, 2, 0.00, 0.00),
(372, '4.4', 'COMPRA ACTIVO FIJO', 359, 1, 2, 0.00, 0.00),
(373, '4.5', 'OTRAS COMPRAS', 359, 1, 2, 0.00, 0.00),
(374, '4.5.1', 'CAJA CHICA ALMACÉN', 373, 1, 2, 0.00, 0.00),
(375, '4.5.2', 'OTRAS COMPRAS', 373, 1, 2, 0.00, 0.00),
(376, '4.5.3', 'ÚTILES DE LIMPIEZA', 373, 1, 2, 0.00, 0.00),
(377, '4.5.4', 'COMPRA BATERIA MENOR', 373, 1, 2, 0.00, 0.00),
(378, '4.5.5', 'STOP COMPONENTES TIC', 373, 1, 2, 0.00, 0.00),
(379, '5', 'CAMPUS CETURGH', NULL, 1, 2, 0.00, 0.00),
(380, '5.1', 'CISTERNA DE AGUA', 379, 1, 2, 0.00, 0.00),
(381, '5.2', 'SERVICIO VIGILANCIA', 379, 1, 2, 0.00, 0.00),
(382, '5.3', 'MANTENIMIENTO ', 379, 1, 2, 0.00, 0.00),
(383, '5.4', 'SERVICIOS', 379, 1, 2, 0.00, 0.00),
(384, '6', 'FINANCIAMIENTO', NULL, 1, 2, 0.00, 0.00),
(385, '6.1', 'PRÉSTAMOS BANCOS', 384, 1, 2, 0.00, 0.00),
(386, '6.1.1', 'BCP ', 385, 1, 2, 0.00, 0.00),
(387, '6.1.2', 'BBVA', 385, 1, 2, 0.00, 0.00),
(388, '6.2', 'COMISIONES BANCARIAS', 384, 1, 2, 0.00, 0.00),
(389, '6.3', 'PRÉSTAMOS ACCIONISTA', 384, 1, 2, 0.00, 0.00),
(390, '6.4', 'OTROS GASTOS FINANCIEROS', 384, 1, 2, 0.00, 0.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cola_correos`
--

CREATE TABLE `cola_correos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `destinatario` varchar(255) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `asunto` varchar(255) NOT NULL,
  `mensaje` longtext NOT NULL,
  `enviado` tinyint(1) DEFAULT 0,
  `error_envio` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `enviado_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `cola_correos`
--

INSERT INTO `cola_correos` (`id`, `usuario_id`, `destinatario`, `nombre`, `asunto`, `mensaje`, `enviado`, `error_envio`, `created_at`, `enviado_at`) VALUES
(23, 8, 'admin@c.com', 'Perfil Prueba', 'Pendiente aprobación - REQ-145', '<div style=\"font-family:Arial;padding:20px;\"><h2 style=\"color:#800000;\">Pendiente de aprobación</h2><p>Existe un item pendiente en administración.</p><table style=\"border-collapse:collapse;width:100%;margin-top:15px;\"><tr><td style=\"padding:8px;border:1px solid #ddd;\"><b>Requerimiento</b></td><td style=\"padding:8px;border:1px solid #ddd;\">REQ-145</td></tr><tr><td style=\"padding:8px;border:1px solid #ddd;\"><b>Item</b></td><td style=\"padding:8px;border:1px solid #ddd;\">JABON LIQUIDO</td></tr><tr><td style=\"padding:8px;border:1px solid #ddd;\"><b>Solicitante</b></td><td style=\"padding:8px;border:1px solid #ddd;\">Pablo Castro Timana</td></tr></table></div>', 1, NULL, '2026-05-15 17:40:04', '2026-05-15 20:02:46'),
(24, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Estado actualizado - REQ-145', '<div style=\"font-family:Arial;padding:20px;\"><h2 style=\"color:#800000;\">Estado actualizado</h2><p>Su requerimiento fue actualizado.</p><table style=\"border-collapse:collapse;width:100%;margin-top:15px;\"><tr><td style=\"padding:8px;border:1px solid #ddd;\"><b>Requerimiento</b></td><td style=\"padding:8px;border:1px solid #ddd;\">REQ-145</td></tr><tr><td style=\"padding:8px;border:1px solid #ddd;\"><b>Item</b></td><td style=\"padding:8px;border:1px solid #ddd;\">JABON LIQUIDO</td></tr><tr><td style=\"padding:8px;border:1px solid #ddd;\"><b>Estado</b></td><td style=\"padding:8px;border:1px solid #ddd;color:#800000;font-weight:bold;\">APROBADO</td></tr></table></div>', 1, NULL, '2026-05-15 17:40:25', '2026-05-15 20:02:48'),
(25, 12, 'lisseth.maza@ceturghperu.edu.pe', 'LISSETH MADELEINE BRICEÑO MAZA', 'Pago pendiente - REQ-145', '<div style=\"font-family:Arial;padding:20px;\"><h2 style=\"color:#800000;\">Pago pendiente</h2><p>Existe un item pendiente de pago.</p><table style=\"border-collapse:collapse;width:100%;margin-top:15px;\"><tr><td style=\"padding:8px;border:1px solid #ddd;\"><b>Requerimiento</b></td><td style=\"padding:8px;border:1px solid #ddd;\">REQ-145</td></tr><tr><td style=\"padding:8px;border:1px solid #ddd;\"><b>Item</b></td><td style=\"padding:8px;border:1px solid #ddd;\">JABON LIQUIDO</td></tr></table></div>', 1, NULL, '2026-05-15 17:40:25', '2026-05-15 20:02:51'),
(26, 8, 'admin@c.com', 'Perfil Prueba', 'Pendiente aprobación ADMINISTRATIVA', '\r\n<div style=\"font-family:Arial,sans-serif;\r\n            padding:20px;\r\n            color:#333;\">\r\n\r\n    <h2 style=\"color:#7B1E1E;\">\r\n        Nuevo requerimiento pendiente\r\n    </h2>\r\n\r\n    <p>\r\n        Estimado equipo de Administración:\r\n    </p>\r\n\r\n    <p>\r\n        Se ha generado un nuevo requerimiento que requiere atención en el flujo administrativo.\r\n    </p>\r\n\r\n    <table style=\"\r\n        border-collapse:collapse;\r\n        width:100%;\r\n        margin-top:15px;\r\n    \">\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Requerimiento</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                REQ-146\r\n            </td>\r\n        </tr>\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Item</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                LAPIZ\r\n            </td>\r\n        </tr>\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Cantidad</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                1\r\n            </td>\r\n        </tr>\r\n\r\n    </table>\r\n\r\n    <p style=\"margin-top:20px;\">\r\n        Por favor, ingresar al sistema para continuar con el proceso correspondiente.\r\n    </p>\r\n\r\n    <p>\r\n        Atentamente,<br>\r\n        <b>Sistema CETURGH</b>\r\n    </p>\r\n\r\n</div>\r\n', 1, NULL, '2026-05-15 19:16:31', '2026-05-15 20:02:54'),
(27, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Estado actualizado', '<h2>Estado actualizado</h2><p>Su item fue APROBADO</p>', 1, NULL, '2026-05-15 19:16:55', '2026-05-15 19:17:48'),
(28, 12, 'lisseth.maza@ceturghperu.edu.pe', 'LISSETH MADELEINE BRICEÑO MAZA', 'Pago pendiente', '\r\n<div style=\"font-family:Arial,sans-serif;\r\n            padding:20px;\r\n            color:#333;\">\r\n\r\n    <h2 style=\"color:#7B1E1E;\">\r\n        Nuevo requerimiento pendiente\r\n    </h2>\r\n\r\n    <p>\r\n        Estimado equipo de Tesorería:\r\n    </p>\r\n\r\n    <p>\r\n        Se ha generado un nuevo requerimiento que requiere atención en el flujo Tesorero.\r\n    </p>\r\n\r\n    <table style=\"\r\n        border-collapse:collapse;\r\n        width:100%;\r\n        margin-top:15px;\r\n    \">\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Requerimiento</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                REQ-146\r\n            </td>\r\n        </tr>\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Item</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                LAPIZ\r\n            </td>\r\n        </tr>\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Cantidad</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                1\r\n            </td>\r\n        </tr>\r\n\r\n    </table>\r\n\r\n    <p style=\"margin-top:20px;\">\r\n        Por favor, ingresar al sistema para continuar con el proceso correspondiente.\r\n    </p>\r\n\r\n    <p>\r\n        Atentamente,<br>\r\n        <b>Sistema CETURGH</b>\r\n    </p>\r\n\r\n</div>\r\n', 1, NULL, '2026-05-15 19:16:55', '2026-05-15 20:02:57'),
(29, 8, 'admin@c.com', 'Perfil Prueba', 'Pendiente aprobación ADMINISTRATIVA', '\r\n<div style=\"font-family:Arial,sans-serif;\r\n            padding:20px;\r\n            color:#333;\">\r\n\r\n    <h2 style=\"color:#7B1E1E;\">\r\n        Nuevo requerimiento pendiente\r\n    </h2>\r\n\r\n    <p>\r\n        Estimado equipo de Administración:\r\n    </p>\r\n\r\n    <p>\r\n        Se ha generado un nuevo requerimiento que requiere atención en el flujo administrativo.\r\n    </p>\r\n\r\n    <table style=\"\r\n        border-collapse:collapse;\r\n        width:100%;\r\n        margin-top:15px;\r\n    \">\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Requerimiento</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                REQ-147\r\n            </td>\r\n        </tr>\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Item</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                ARCHIVADOR\r\n            </td>\r\n        </tr>\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Cantidad</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                1\r\n            </td>\r\n        </tr>\r\n\r\n    </table>\r\n\r\n    <p style=\"margin-top:20px;\">\r\n        Por favor, ingresar al sistema para continuar con el proceso correspondiente.\r\n    </p>\r\n\r\n    <p>\r\n        Atentamente,<br>\r\n        <b>Sistema CETURGH</b>\r\n    </p>\r\n\r\n</div>\r\n', 1, NULL, '2026-05-15 19:20:15', '2026-05-15 20:02:59'),
(30, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Estado actualizado', '<h2>Estado actualizado</h2><p>Su item fue APROBADO</p>', 1, NULL, '2026-05-15 19:20:23', '2026-05-15 20:03:02'),
(31, 12, 'lisseth.maza@ceturghperu.edu.pe', 'LISSETH MADELEINE BRICEÑO MAZA', 'Pago pendiente', '\r\n<div style=\"font-family:Arial,sans-serif;\r\n            padding:20px;\r\n            color:#333;\">\r\n\r\n    <h2 style=\"color:#7B1E1E;\">\r\n        Nuevo requerimiento pendiente\r\n    </h2>\r\n\r\n    <p>\r\n        Estimado equipo de Tesorería:\r\n    </p>\r\n\r\n    <p>\r\n        Se ha generado un nuevo requerimiento que requiere atención en el flujo Tesorero.\r\n    </p>\r\n\r\n    <table style=\"\r\n        border-collapse:collapse;\r\n        width:100%;\r\n        margin-top:15px;\r\n    \">\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Requerimiento</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                REQ-147\r\n            </td>\r\n        </tr>\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Item</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                ARCHIVADOR\r\n            </td>\r\n        </tr>\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Cantidad</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                1\r\n            </td>\r\n        </tr>\r\n\r\n    </table>\r\n\r\n    <p style=\"margin-top:20px;\">\r\n        Por favor, ingresar al sistema para continuar con el proceso correspondiente.\r\n    </p>\r\n\r\n    <p>\r\n        Atentamente,<br>\r\n        <b>Sistema CETURGH</b>\r\n    </p>\r\n\r\n</div>\r\n', 1, NULL, '2026-05-15 19:20:23', '2026-05-15 20:03:05'),
(32, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Estado actualizado', '<h2>Estado actualizado</h2><p>Su item fue APROBADO</p>', 1, NULL, '2026-05-15 19:37:20', '2026-05-15 20:03:08'),
(33, 12, 'lisseth.maza@ceturghperu.edu.pe', 'LISSETH MADELEINE BRICEÑO MAZA', 'Pago pendiente', '\r\n            <h2>Pago pendiente</h2>\r\n            <p>Existe un pago pendiente.</p>\r\n            ', 1, NULL, '2026-05-15 19:37:20', '2026-05-15 20:03:10'),
(34, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento pagado', '\r\n            <h2>Pago realizado</h2>\r\n            <p>Su requerimiento fue pagado.</p>\r\n            ', 1, NULL, '2026-05-15 19:37:39', '2026-05-15 20:03:13'),
(35, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento pagado', '\r\n            <h2>Pago realizado</h2>\r\n            <p>Su requerimiento fue pagado.</p>\r\n            ', 1, NULL, '2026-05-15 19:37:42', '2026-05-15 20:03:16'),
(36, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento pagado', '\r\n            <h2>Pago realizado</h2>\r\n            <p>Su requerimiento fue pagado.</p>\r\n            ', 1, NULL, '2026-05-15 19:37:44', '2026-05-15 20:03:19'),
(37, 8, 'admin@c.com', 'Perfil Prueba', 'Pendiente aprobación', '\r\n            <h2>Pendiente aprobación</h2>\r\n            <p>Existe un item pendiente en administración.</p>\r\n            ', 1, NULL, '2026-05-15 19:55:48', '2026-05-15 20:03:21'),
(38, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Estado actualizado', '<h2>Estado actualizado</h2><p>Su item fue APROBADO</p>', 1, NULL, '2026-05-15 19:55:56', '2026-05-15 20:03:24'),
(39, 12, 'lisseth.maza@ceturghperu.edu.pe', 'LISSETH MADELEINE BRICEÑO MAZA', 'Pago pendiente', '\r\n            <h2>Pago pendiente</h2>\r\n            <p>Existe un pago pendiente.</p>\r\n            ', 1, NULL, '2026-05-15 19:55:56', '2026-05-15 20:03:27'),
(40, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento pagado', '\r\n            <h2>Pago realizado</h2>\r\n            <p>Su requerimiento fue pagado.</p>\r\n            ', 1, NULL, '2026-05-15 19:56:09', '2026-05-15 20:03:30'),
(41, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento pagado', '\r\n            <h2>Pago realizado</h2>\r\n            <p>Su requerimiento fue pagado.</p>\r\n            ', 1, NULL, '2026-05-15 20:00:16', '2026-05-15 20:03:32'),
(42, 8, 'admin@c.com', 'Perfil Prueba', 'Pendiente aprobación', '\r\n<div style=\"font-family:Arial,sans-serif;\r\n            padding:20px;\r\n            color:#333;\">\r\n\r\n    <h2 style=\"color:#7B1E1E;\">\r\n        Nuevo requerimiento pendiente\r\n    </h2>\r\n\r\n    <p>\r\n        Estimado equipo de Logística:\r\n    </p>\r\n\r\n    <p>\r\n        Se ha generado un nuevo requerimiento que requiere atención en el flujo logístico.\r\n    </p>\r\n\r\n    <table style=\"\r\n        border-collapse:collapse;\r\n        width:100%;\r\n        margin-top:15px;\r\n    \">\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Requerimiento</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                REQ-151\r\n            </td>\r\n        </tr>\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Item</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                JABON LIQUIDO\r\n            </td>\r\n        </tr>\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Cantidad</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                1\r\n            </td>\r\n        </tr>\r\n\r\n    </table>\r\n\r\n    <p style=\"margin-top:20px;\">\r\n        Por favor, ingresar al sistema para continuar con el proceso correspondiente.\r\n    </p>\r\n\r\n    <p>\r\n        Atentamente,<br>\r\n        <b>Sistema CETURGH</b>\r\n    </p>\r\n\r\n</div>\r\n', 1, NULL, '2026-05-15 20:20:52', '2026-05-15 20:20:57'),
(43, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Estado actualizado', '<h2>Estado actualizado</h2><p>Su item fue APROBADO</p>', 1, NULL, '2026-05-15 20:21:19', '2026-05-15 20:21:22'),
(44, 12, 'lisseth.maza@ceturghperu.edu.pe', 'LISSETH MADELEINE BRICEÑO MAZA', 'Pago pendiente', '\r\n            <h2>Pago pendiente</h2>\r\n            <p>Existe un pago pendiente.</p>\r\n            ', 1, NULL, '2026-05-15 20:21:19', '2026-05-15 20:21:26'),
(45, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento pagado', '\r\n            <h2>Pago realizado</h2>\r\n            <p>Su requerimiento fue pagado.</p>\r\n            ', 1, NULL, '2026-05-15 20:21:59', '2026-05-15 20:22:03'),
(46, 8, 'admin@c.com', 'Perfil Prueba', 'Pendiente aprobación', '\r\n<div style=\"font-family:Arial,sans-serif;\r\n            padding:20px;\r\n            color:#333;\">\r\n\r\n    <h2 style=\"color:#7B1E1E;\">\r\n        Nuevo requerimiento pendiente\r\n    </h2>\r\n\r\n    <p>\r\n        Estimado equipo de Logística:\r\n    </p>\r\n\r\n    <p>\r\n        Se ha generado un nuevo requerimiento que requiere atención en el flujo logístico.\r\n    </p>\r\n\r\n    <table style=\"\r\n        border-collapse:collapse;\r\n        width:100%;\r\n        margin-top:15px;\r\n    \">\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Requerimiento</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                REQ-154\r\n            </td>\r\n        </tr>\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Item</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                JABON LIQUIDO\r\n            </td>\r\n        </tr>\r\n\r\n        <tr>\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                <b>Cantidad</b>\r\n            </td>\r\n\r\n            <td style=\"border:1px solid #ddd;padding:8px;\">\r\n                1\r\n            </td>\r\n        </tr>\r\n\r\n    </table>\r\n\r\n    <p style=\"margin-top:20px;\">\r\n        Por favor, ingresar al sistema para continuar con el proceso correspondiente.\r\n    </p>\r\n\r\n    <p>\r\n        Atentamente,<br>\r\n        <b>Sistema CETURGH</b>\r\n    </p>\r\n\r\n</div>\r\n', 1, NULL, '2026-05-15 20:39:33', '2026-05-15 20:39:36'),
(47, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Estado actualizado', '<h2>Estado actualizado</h2><p>Su item fue APROBADO</p>', 1, NULL, '2026-05-15 20:39:49', '2026-05-15 20:39:52'),
(48, 12, '', 'LISSETH MADELEINE BRICEÑO MAZA', 'Pago pendiente', '\r\n            <h2>Pago pendiente</h2>\r\n            <p>Existe un pago pendiente.</p>\r\n            ', 0, 'Correo vacío', '2026-05-15 20:39:49', NULL),
(49, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento pagado', '\r\n            <h2>Pago realizado</h2>\r\n            <p>Su requerimiento fue pagado.</p>\r\n            ', 1, NULL, '2026-05-15 20:39:53', '2026-05-15 20:39:56'),
(50, 8, 'admin@c.com', 'Perfil Prueba', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-155</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">SOBRE MANILA A4</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 1, NULL, '2026-05-15 20:46:48', '2026-05-15 20:46:51'),
(51, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-155</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">SOBRE MANILA A4</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 1, NULL, '2026-05-15 20:46:54', '2026-05-15 20:46:57'),
(52, 12, '', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-155</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">SOBRE MANILA A4</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'Correo vacío', '2026-05-15 20:46:54', NULL),
(53, 8, 'admin@c.com', 'Perfil Prueba', 'Movilidad Pendiente - MOV-00033', '<div style=\"font-family:Segoe UI,Arial,sans-serif;background:#f4f4f4;padding:30px;\"><div style=\"max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:6px solid #800000;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#ffffff;\">Solicitud de Movilidad</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Administración</strong>,</p><p>Existe una movilidad pendiente de validación.</p><table style=\"width:100%;border-collapse:collapse;margin-top:20px;\"><tr><td style=\"padding:10px;font-weight:bold;\">Código</td><td style=\"padding:10px;\">MOV-00033</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Solicitante</td><td style=\"padding:10px;\">Pablo Castro Timana</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Departamento</td><td style=\"padding:10px;\">TIC</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Origen</td><td style=\"padding:10px;\">Piura</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Destino</td><td style=\"padding:10px;\">Sullana</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Motivo</td><td style=\"padding:10px;\">Praticas</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Fecha</td><td style=\"padding:10px;\">16/05/2026</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Monto</td><td style=\"padding:10px;\">S/ 12.00</td></tr></table></div><div style=\"background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;\">Sistema CETURGH - Mensaje automático</div></div></div>', 1, NULL, '2026-05-16 02:28:47', '2026-05-16 02:28:52'),
(54, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Pago Pendiente de Movilidad - MOV-00033', '<div style=\"font-family:Segoe UI,Arial,sans-serif;padding:30px;background:#f4f4f4;\"><div style=\"max-width:650px;margin:auto;background:#fff;border-top:6px solid #800000;border-radius:10px;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#fff;\">Movilidad Aprobada</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Tesorería</strong>,</p><p>Existe una movilidad pendiente de desembolso.</p><p><strong>Código:</strong> MOV-00033</p><p><strong>Solicitante:</strong> Pablo Castro Timana</p><p><strong>Monto:</strong> S/ 12.00</p></div></div></div>', 1, NULL, '2026-05-16 02:29:20', '2026-05-16 02:29:24'),
(55, 8, 'admin@c.com', 'Perfil Prueba', 'Movilidad Pendiente - MOV-00034', '<div style=\"font-family:Segoe UI,Arial,sans-serif;background:#f4f4f4;padding:30px;\"><div style=\"max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:6px solid #800000;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#ffffff;\">Solicitud de Movilidad</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Administración</strong>,</p><p>Existe una movilidad pendiente de validación.</p><table style=\"width:100%;border-collapse:collapse;margin-top:20px;\"><tr><td style=\"padding:10px;font-weight:bold;\">Código</td><td style=\"padding:10px;\">MOV-00034</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Solicitante</td><td style=\"padding:10px;\">Perfil Prueba</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Departamento</td><td style=\"padding:10px;\">ADMINISTRACION</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Origen</td><td style=\"padding:10px;\">Piura</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Destino</td><td style=\"padding:10px;\">Sullana</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Motivo</td><td style=\"padding:10px;\">Planilla de Movilidad</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Fecha</td><td style=\"padding:10px;\">16/05/2026</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Monto</td><td style=\"padding:10px;\">S/ 10.00</td></tr></table></div><div style=\"background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;\">Sistema CETURGH - Mensaje automático</div></div></div>', 1, NULL, '2026-05-16 02:44:48', '2026-05-16 02:44:53'),
(56, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Pago Pendiente de Movilidad - MOV-00034', '<div style=\"font-family:Segoe UI,Arial,sans-serif;padding:30px;background:#f4f4f4;\"><div style=\"max-width:650px;margin:auto;background:#fff;border-top:6px solid #800000;border-radius:10px;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#fff;\">Movilidad Aprobada</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Tesorería</strong>,</p><p>Existe una movilidad pendiente de desembolso.</p><p><strong>Código:</strong> MOV-00034</p><p><strong>Solicitante:</strong> Perfil Prueba</p><p><strong>Monto:</strong> S/ 10.00</p></div></div></div>', 1, NULL, '2026-05-16 02:44:52', '2026-05-16 02:45:20'),
(57, 8, 'admin@c.com', 'Perfil Prueba', 'Movilidad Pendiente - MOV-00035', '<div style=\"font-family:Segoe UI,Arial,sans-serif;background:#f4f4f4;padding:30px;\"><div style=\"max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:6px solid #800000;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#ffffff;\">Solicitud de Movilidad</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Administración</strong>,</p><p>Existe una movilidad pendiente de validación.</p><table style=\"width:100%;border-collapse:collapse;margin-top:20px;\"><tr><td style=\"padding:10px;font-weight:bold;\">Código</td><td style=\"padding:10px;\">MOV-00035</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Solicitante</td><td style=\"padding:10px;\">LISSETH MADELEINE BRICEÑO MAZA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Departamento</td><td style=\"padding:10px;\">TESORERIA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Origen</td><td style=\"padding:10px;\">Piura</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Destino</td><td style=\"padding:10px;\">Sullana</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Motivo</td><td style=\"padding:10px;\">Praticas</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Fecha</td><td style=\"padding:10px;\">16/05/2026</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Monto</td><td style=\"padding:10px;\">S/ 12.00</td></tr></table></div><div style=\"background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;\">Sistema CETURGH - Mensaje automático</div></div></div>', 1, NULL, '2026-05-16 03:09:15', '2026-05-16 03:09:19'),
(58, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Pago Pendiente de Movilidad - MOV-00035', '<div style=\"font-family:Segoe UI,Arial,sans-serif;padding:30px;background:#f4f4f4;\"><div style=\"max-width:650px;margin:auto;background:#fff;border-top:6px solid #800000;border-radius:10px;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#fff;\">Movilidad Aprobada</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Tesorería</strong>,</p><p>Existe una movilidad pendiente de desembolso.</p><p><strong>Código:</strong> MOV-00035</p><p><strong>Solicitante:</strong> LISSETH MADELEINE BRICEÑO MAZA</p><p><strong>Monto:</strong> S/ 12.00</p></div></div></div>', 1, NULL, '2026-05-16 03:09:40', '2026-05-16 03:09:44'),
(59, 8, 'admin@c.com', 'Perfil Prueba', 'Movilidad Pendiente - MOV-00036', '<div style=\"font-family:Segoe UI,Arial,sans-serif;background:#f4f4f4;padding:30px;\"><div style=\"max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:6px solid #800000;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#ffffff;\">Solicitud de Movilidad</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Administración</strong>,</p><p>Existe una movilidad pendiente de validación.</p><table style=\"width:100%;border-collapse:collapse;margin-top:20px;\"><tr><td style=\"padding:10px;font-weight:bold;\">Código</td><td style=\"padding:10px;\">MOV-00036</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Solicitante</td><td style=\"padding:10px;\">Perfil Prueba</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Departamento</td><td style=\"padding:10px;\">ADMINISTRACION</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Origen</td><td style=\"padding:10px;\">Piura</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Destino</td><td style=\"padding:10px;\">Sullana</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Motivo</td><td style=\"padding:10px;\">Planilla de Movilidad</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Fecha</td><td style=\"padding:10px;\">16/05/2026</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Monto</td><td style=\"padding:10px;\">S/ 12.00</td></tr></table></div><div style=\"background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;\">Sistema CETURGH - Mensaje automático</div></div></div>', 1, NULL, '2026-05-16 03:16:00', '2026-05-16 03:16:04'),
(60, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Pago Pendiente de Movilidad - MOV-00036', '<div style=\"font-family:Segoe UI,Arial,sans-serif;padding:30px;background:#f4f4f4;\"><div style=\"max-width:650px;margin:auto;background:#fff;border-top:6px solid #800000;border-radius:10px;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#fff;\">Movilidad Aprobada</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Tesorería</strong>,</p><p>Existe una movilidad pendiente de desembolso.</p><p><strong>Código:</strong> MOV-00036</p><p><strong>Solicitante:</strong> Perfil Prueba</p><p><strong>Monto:</strong> S/ 12.00</p></div></div></div>', 1, NULL, '2026-05-16 03:16:04', '2026-05-16 03:16:33'),
(61, 8, 'admin@c.com', 'Perfil Prueba', 'Movilidad Pendiente - MOV-00037', '<div style=\"font-family:Segoe UI,Arial,sans-serif;background:#f4f4f4;padding:30px;\"><div style=\"max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:6px solid #800000;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#ffffff;\">Solicitud de Movilidad</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Administración</strong>,</p><p>Existe una movilidad pendiente de validación.</p><table style=\"width:100%;border-collapse:collapse;margin-top:20px;\"><tr><td style=\"padding:10px;font-weight:bold;\">Código</td><td style=\"padding:10px;\">MOV-00037</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Solicitante</td><td style=\"padding:10px;\">LISSETH MADELEINE BRICEÑO MAZA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Departamento</td><td style=\"padding:10px;\">TESORERIA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Origen</td><td style=\"padding:10px;\">Piura</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Destino</td><td style=\"padding:10px;\">Sullana</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Motivo</td><td style=\"padding:10px;\">Praticas</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Fecha</td><td style=\"padding:10px;\">16/05/2026</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Monto</td><td style=\"padding:10px;\">S/ 12.00</td></tr></table></div><div style=\"background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;\">Sistema CETURGH - Mensaje automático</div></div></div>', 1, NULL, '2026-05-16 03:19:28', '2026-05-16 03:19:32'),
(62, 8, 'admin@c.com', 'Perfil Prueba', 'Movilidad Pendiente - MOV-00038', '<div style=\"font-family:Segoe UI,Arial,sans-serif;background:#f4f4f4;padding:30px;\"><div style=\"max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:6px solid #800000;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#ffffff;\">Solicitud de Movilidad</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Administración</strong>,</p><p>Existe una movilidad pendiente de validación.</p><table style=\"width:100%;border-collapse:collapse;margin-top:20px;\"><tr><td style=\"padding:10px;font-weight:bold;\">Código</td><td style=\"padding:10px;\">MOV-00038</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Solicitante</td><td style=\"padding:10px;\">LISSETH MADELEINE BRICEÑO MAZA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Departamento</td><td style=\"padding:10px;\">TESORERIA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Origen</td><td style=\"padding:10px;\">SULLANA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Destino</td><td style=\"padding:10px;\">Sullana</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Motivo</td><td style=\"padding:10px;\">Praticas</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Fecha</td><td style=\"padding:10px;\">16/05/2026</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Monto</td><td style=\"padding:10px;\">S/ 12.00</td></tr></table></div><div style=\"background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;\">Sistema CETURGH - Mensaje automático</div></div></div>', 1, NULL, '2026-05-16 03:22:01', '2026-05-16 03:22:05'),
(63, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Movilidad Pendiente - MOV-00039', '<div style=\"font-family:Segoe UI,Arial,sans-serif;background:#f4f4f4;padding:30px;\"><div style=\"max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:6px solid #800000;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#ffffff;\">Solicitud de Movilidad</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Administración</strong>,</p><p>Existe una movilidad pendiente de validación.</p><table style=\"width:100%;border-collapse:collapse;margin-top:20px;\"><tr><td style=\"padding:10px;font-weight:bold;\">Código</td><td style=\"padding:10px;\">MOV-00039</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Solicitante</td><td style=\"padding:10px;\">Perfil Prueba</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Departamento</td><td style=\"padding:10px;\">TESORERIA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Origen</td><td style=\"padding:10px;\">SULLANA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Destino</td><td style=\"padding:10px;\">PIURA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Motivo</td><td style=\"padding:10px;\">VISITA PIURA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Fecha</td><td style=\"padding:10px;\">18/05/2026</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Monto</td><td style=\"padding:10px;\">S/ 35.00</td></tr></table></div><div style=\"background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;\">Sistema CETURGH - Mensaje automático</div></div></div>', 1, NULL, '2026-05-18 14:46:22', '2026-05-18 14:46:27'),
(64, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Confirmación de Pago - Requerimiento', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Comprobación de Desembolso</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Nos complace informarle que el proceso de pago asociado a su requerimiento ha sido **ejecutado con éxito** por Tesorería.</p>      <div style=\"background-color: #f2fbf4; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #155724; font-weight: bold;\">          Estado del Proceso: LIQUIDADO / PAGADO        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-155</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">SOBRE MANILA A4</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Agradecemos su paciencia durante las etapas del flujo logístico.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 1, NULL, '2026-05-18 14:51:37', '2026-05-18 14:51:43'),
(65, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-158</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">JABON LIQUIDO</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">4</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 13:25:24', NULL),
(66, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-158</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">JABON LIQUIDO</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 13:25:32', NULL);
INSERT INTO `cola_correos` (`id`, `usuario_id`, `destinatario`, `nombre`, `asunto`, `mensaje`, `enviado`, `error_envio`, `created_at`, `enviado_at`) VALUES
(67, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-157</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">CARGADOR DE CELULAR</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 14:56:54', NULL),
(68, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-157</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">PILAS AAA</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">2</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 14:56:54', NULL),
(69, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-156</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">HARINA</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 14:56:54', NULL),
(70, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-156</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">HARINA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 14:57:06', NULL),
(71, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-156</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">HARINA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 14:57:06', NULL),
(72, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-157</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">CARGADOR DE CELULAR</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 14:57:08', NULL),
(73, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-157</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">CARGADOR DE CELULAR</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 14:57:08', NULL),
(74, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-157</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">PILAS AAA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 14:57:08', NULL),
(75, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-157</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">PILAS AAA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 14:57:08', NULL),
(76, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-153</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">HARINA</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 15:07:36', NULL),
(77, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-150</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">LAPICEROS</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 15:07:36', NULL),
(78, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-142</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">JABON LIQUIDO</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 15:07:36', NULL),
(79, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-150</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">LAPICEROS</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 15:07:43', NULL),
(80, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-150</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">LAPICEROS</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 15:07:43', NULL),
(81, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-153</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">HARINA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 15:07:45', NULL),
(82, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-153</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">HARINA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, 'SMTP Error: Could not authenticate. | SMTP Error: Could not authenticate.', '2026-05-19 15:07:45', NULL),
(83, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-142</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">JABON LIQUIDO</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-19 15:07:47', NULL),
(84, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-142</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">JABON LIQUIDO</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-19 15:07:47', NULL);
INSERT INTO `cola_correos` (`id`, `usuario_id`, `destinatario`, `nombre`, `asunto`, `mensaje`, `enviado`, `error_envio`, `created_at`, `enviado_at`) VALUES
(85, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Movilidad Pendiente - MOV-00040', '<div style=\"font-family:Segoe UI,Arial,sans-serif;background:#f4f4f4;padding:30px;\"><div style=\"max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:6px solid #800000;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#ffffff;\">Solicitud de Movilidad</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Administración</strong>,</p><p>Existe una movilidad pendiente de validación.</p><table style=\"width:100%;border-collapse:collapse;margin-top:20px;\"><tr><td style=\"padding:10px;font-weight:bold;\">Código</td><td style=\"padding:10px;\">MOV-00040</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Solicitante</td><td style=\"padding:10px;\">Perfil Prueba</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Departamento</td><td style=\"padding:10px;\">TIC</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Origen</td><td style=\"padding:10px;\">Piura</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Destino</td><td style=\"padding:10px;\">Sullana</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Motivo</td><td style=\"padding:10px;\">Planilla de Movilidad</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Fecha</td><td style=\"padding:10px;\">20/05/2026</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Monto</td><td style=\"padding:10px;\">S/ -1.00</td></tr></table></div><div style=\"background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;\">Sistema CETURGH - Mensaje automático</div></div></div>', 0, NULL, '2026-05-20 10:38:36', NULL),
(86, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-160</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">JABON LIQUIDO</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1.2000000476837158</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-20 20:03:21', NULL),
(87, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-160</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">JABON LIQUIDO</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-20 20:03:34', NULL),
(88, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-160</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">JABON LIQUIDO</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-20 20:03:34', NULL),
(89, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-161</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">LIMPIA TODO</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1.3229999542236328</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 06:06:17', NULL),
(90, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-161</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">LIMPIA TODO</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 06:06:44', NULL),
(91, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-161</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">LIMPIA TODO</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 06:06:44', NULL),
(92, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-162</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">sdasd</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 07:00:36', NULL),
(93, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-162</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">sdasd</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 07:00:50', NULL),
(94, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-162</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">sdasd</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 07:00:50', NULL),
(95, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Confirmación de Pago - Requerimiento', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Comprobación de Desembolso</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Nos complace informarle que el proceso de pago asociado a su requerimiento ha sido **ejecutado con éxito** por Tesorería.</p>      <div style=\"background-color: #f2fbf4; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #155724; font-weight: bold;\">          Estado del Proceso: LIQUIDADO / PAGADO        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-162</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">sdasd</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Agradecemos su paciencia durante las etapas del flujo logístico.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 07:46:58', NULL),
(96, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-163</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dasdasd</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 09:08:15', NULL),
(97, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-163</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dasdasd</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 09:08:29', NULL),
(98, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-163</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dasdasd</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 09:08:29', NULL),
(99, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-159</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">JABON LIQUIDO</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:24:32', NULL),
(100, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-149</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">LAPICEROS</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:25:13', NULL),
(101, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-164</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">FOLDER MANILA</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:26:07', NULL),
(102, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-165</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">aasa</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:44:00', NULL);
INSERT INTO `cola_correos` (`id`, `usuario_id`, `destinatario`, `nombre`, `asunto`, `mensaje`, `enviado`, `error_envio`, `created_at`, `enviado_at`) VALUES
(103, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-165</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">fsdfds</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:44:03', NULL),
(104, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-165</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">aasa</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:44:36', NULL),
(105, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-165</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">aasa</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:44:36', NULL),
(106, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-165</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">fsdfds</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:44:37', NULL),
(107, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-165</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">fsdfds</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:44:37', NULL),
(108, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-166</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">MICAS A4</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:54:17', NULL),
(109, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-166</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">LAPIZ</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:54:22', NULL),
(110, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-166</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">MICAS A4</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:54:34', NULL),
(111, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-166</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">MICAS A4</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:54:34', NULL),
(112, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-166</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">LAPIZ</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:54:34', NULL),
(113, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-166</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">LAPIZ</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 16:54:34', NULL),
(114, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-167</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">sigv</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 17:01:21', NULL),
(115, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-167</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">cigv</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 17:01:31', NULL),
(116, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-167</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">sigv</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 17:01:47', NULL),
(117, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-167</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">sigv</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 17:01:47', NULL),
(118, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-167</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">cigv</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 17:01:48', NULL),
(119, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-167</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">cigv</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 17:01:48', NULL),
(120, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-164</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">FOLDER MANILA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 18:27:16', NULL),
(121, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-164</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">FOLDER MANILA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-21 18:27:16', NULL);
INSERT INTO `cola_correos` (`id`, `usuario_id`, `destinatario`, `nombre`, `asunto`, `mensaje`, `enviado`, `error_envio`, `created_at`, `enviado_at`) VALUES
(122, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-174</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">asdsa</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:11:54', NULL),
(123, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-177</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">GRAPAS</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:15:57', NULL),
(124, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-176</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">cascsa</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:23:35', NULL),
(125, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-177</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">GRAPAS</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:36:57', NULL),
(126, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-175</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dsadsad</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">10</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:38:18', NULL),
(127, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-173</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dsadsa</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:47:36', NULL),
(128, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Pago Pendiente de Movilidad - MOV-00037', '<div style=\"font-family:Segoe UI,Arial,sans-serif;padding:30px;background:#f4f4f4;\"><div style=\"max-width:650px;margin:auto;background:#fff;border-top:6px solid #800000;border-radius:10px;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#fff;\">Movilidad Aprobada</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Tesorería</strong>,</p><p>Existe una movilidad pendiente de desembolso.</p><p><strong>Código:</strong> MOV-00037</p><p><strong>Solicitante:</strong> LISSETH MADELEINE BRICEÑO MAZA</p><p><strong>Monto:</strong> S/ 12.00</p></div></div></div>', 0, NULL, '2026-05-28 08:52:55', NULL),
(129, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Movilidad Pendiente - MOV-00041', '<div style=\"font-family:Segoe UI,Arial,sans-serif;background:#f4f4f4;padding:30px;\"><div style=\"max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:6px solid #800000;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#ffffff;\">Solicitud de Movilidad</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Administración</strong>,</p><p>Existe una movilidad pendiente de validación.</p><table style=\"width:100%;border-collapse:collapse;margin-top:20px;\"><tr><td style=\"padding:10px;font-weight:bold;\">Código</td><td style=\"padding:10px;\">MOV-00041</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Solicitante</td><td style=\"padding:10px;\">Perfil Prueba</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Departamento</td><td style=\"padding:10px;\">TESORERIA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Origen</td><td style=\"padding:10px;\">SAD</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Destino</td><td style=\"padding:10px;\">DASDSA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Motivo</td><td style=\"padding:10px;\">Praticas</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Fecha</td><td style=\"padding:10px;\">28/05/2026</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Monto</td><td style=\"padding:10px;\">S/ 12.00</td></tr></table></div><div style=\"background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;\">Sistema CETURGH - Mensaje automático</div></div></div>', 0, NULL, '2026-05-28 08:53:59', NULL),
(130, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-178</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">HARINA</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:56:59', NULL),
(131, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-178</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">HARINA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:57:52', NULL),
(132, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-178</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">HARINA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:57:52', NULL),
(133, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-175</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dsadsad</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:57:54', NULL),
(134, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-175</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dsadsad</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:57:54', NULL),
(135, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-177</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">GRAPAS</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:57:55', NULL),
(136, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-177</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">GRAPAS</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:57:55', NULL),
(137, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-173</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dsadsa</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:57:59', NULL),
(138, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-173</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dsadsa</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 08:57:59', NULL),
(139, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-180</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">asdasds</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 09:04:23', NULL),
(140, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-180</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">asdasds</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 09:04:58', NULL);
INSERT INTO `cola_correos` (`id`, `usuario_id`, `destinatario`, `nombre`, `asunto`, `mensaje`, `enviado`, `error_envio`, `created_at`, `enviado_at`) VALUES
(141, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-180</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">asdasds</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 09:04:58', NULL),
(142, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Confirmación de Pago - Requerimiento', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Comprobación de Desembolso</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Nos complace informarle que el proceso de pago asociado a su requerimiento ha sido **ejecutado con éxito** por Tesorería.</p>      <div style=\"background-color: #f2fbf4; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #155724; font-weight: bold;\">          Estado del Proceso: LIQUIDADO / PAGADO        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-180</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">asdasds</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Agradecemos su paciencia durante las etapas del flujo logístico.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 09:05:12', NULL),
(143, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-181</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dsadas</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 14:10:09', NULL),
(144, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-179</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">DASD</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 14:10:20', NULL),
(145, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-179</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">DASD</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 14:13:50', NULL),
(146, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-179</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">DASD</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 14:13:50', NULL),
(147, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-181</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dsadas</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 14:13:52', NULL),
(148, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-181</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dsadas</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 14:13:52', NULL),
(149, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-176</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">cascsa</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:28:06', NULL),
(150, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-176</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">cascsa</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:31:14', NULL),
(151, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-176</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">cascsa</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:31:29', NULL),
(152, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-176</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">cascsa</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:31:29', NULL),
(153, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-171</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">FRANELA</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:32:53', NULL),
(154, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-176</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">cascsa</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:35:47', NULL),
(155, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-176</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">cascsa</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:36:08', NULL),
(156, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-176</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">cascsa</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:36:08', NULL),
(157, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-174</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">asdsa</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:47:45', NULL),
(158, 8, 'admin@c.com', 'Perfil Prueba', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-174</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">asdsa</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:48:33', NULL);
INSERT INTO `cola_correos` (`id`, `usuario_id`, `destinatario`, `nombre`, `asunto`, `mensaje`, `enviado`, `error_envio`, `created_at`, `enviado_at`) VALUES
(159, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-174</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">asdsa</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:48:33', NULL),
(160, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-171</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">FRANELA</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:51:19', NULL),
(161, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-171</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">FRANELA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:51:34', NULL),
(162, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-171</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">FRANELA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:51:34', NULL),
(163, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-172</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dasdsa</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 15:59:31', NULL),
(164, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-171</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">FRANELA</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">12</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 16:00:01', NULL),
(165, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-170</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">AZUCAR BLANCA</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 16:00:36', NULL),
(166, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-170</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">AZUCAR BLANCA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 16:00:58', NULL),
(167, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-170</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">AZUCAR BLANCA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 16:00:58', NULL),
(168, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Actualización de Estado: APROBADO', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Actualización de Requerimiento</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>      <div style=\"background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 15px; color: #333333;\">          <strong>Nuevo Estado:</strong>           <span style=\"color: #800020; font-weight: bold; text-transform: uppercase;\">APROBADO</span>        </p>      </div>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-172</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dasdsa</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 16:00:59', NULL),
(169, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-172</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">dasdsa</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 16:00:59', NULL),
(170, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Solicitud pendiente de aprobación - FND-00008', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Solicitud</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">La solicitud ha sido firmada por el jefe de departamento y se encuentra pendiente de su aprobación.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00008</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Departamento</td>            <td style=\"padding: 12px; color: #333333;\">ADMINISTRACION</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">ANTICIPO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 12.00</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para aprobar o rechazar la solicitud.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 19:03:33', NULL),
(171, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Solicitud aprobada - Pago pendiente - FND-00008', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Pago Pendiente - Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">La solicitud ha sido aprobada y requiere el desembolso correspondiente.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00008</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">ANTICIPO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto a Pagar</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 12.00</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Concepto</td>            <td style=\"padding: 12px; color: #333333;\">dsadsadsa</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, proceda con el pago y suba el comprobante al sistema.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 19:03:35', NULL),
(172, 8, 'admin@c.com', 'Perfil Prueba', 'Solicitud cerrada - FND-00007', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #6c757d;\">    <div style=\"background-color: #6c757d; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Proceso Finalizado</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que su solicitud de <strong>ANTICIPO</strong> ha sido <strong>CERRADA EXITOSAMENTE</strong>.</p>      <div style=\"background-color: #e9ecef; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 14px; color: #383d41;\">          <strong>Total rendido:</strong> S/ 24.00<br>          <strong>Diferencia:</strong> S/ -11.00        </p>      </div>      <p style=\"color: #555555;\">Agradecemos su gestión y cumplimiento de los procedimientos establecidos.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 19:03:51', NULL),
(173, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Pago registrado - Rendición pendiente - FND-00008', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #28a745;\">    <div style=\"background-color: #28a745; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Pago Registrado</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Se ha registrado el pago correspondiente a su solicitud de <strong>ANTICIPO</strong>.</p>      <div style=\"background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 14px; color: #155724;\">          <strong>Monto entregado:</strong> S/ 12.00        </p>      </div>      <p style=\"color: #555555; margin-top: 15px;\"><strong>IMPORTANTE:</strong> Debe presentar la rendición documentaria de los gastos realizados dentro del plazo establecido.</p>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Ingrese al sistema para subir sus comprobantes de gasto.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-05-28 19:04:00', NULL),
(174, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Nueva solicitud de fondos - FND-00009', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Gestión de Fondos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) <strong>Jefe de Departamento</strong>,</p>      <p style=\"color: #555555;\">Se ha creado una nueva solicitud de fondos que requiere su firma para continuar con el flujo.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00009</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">ANTICIPO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Concepto</td>            <td style=\"padding: 12px; color: #333333;\">csfcsdcdscdsdcs</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto Solicitado</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 12.00</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Empresa / Sede</td>            <td style=\"padding: 12px; color: #333333;\">EDUTUR E.I.R.L. - PIURA</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para firmar o rechazar la solicitud.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-04 14:09:06', NULL),
(175, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Solicitud pendiente de aprobación - FND-00011', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Solicitud</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">La solicitud ha sido firmada por el jefe de departamento y se encuentra pendiente de su aprobación.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00011</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Departamento</td>            <td style=\"padding: 12px; color: #333333;\">TIC</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">REEMBOLSO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 12.00</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para aprobar o rechazar la solicitud.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 14:53:09', NULL),
(176, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Solicitud pendiente de aprobación - FND-00010', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Solicitud</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">La solicitud ha sido firmada por el jefe de departamento y se encuentra pendiente de su aprobación.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00010</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Departamento</td>            <td style=\"padding: 12px; color: #333333;\">TIC</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">ANTICIPO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 12.00</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para aprobar o rechazar la solicitud.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 15:44:20', NULL);
INSERT INTO `cola_correos` (`id`, `usuario_id`, `destinatario`, `nombre`, `asunto`, `mensaje`, `enviado`, `error_envio`, `created_at`, `enviado_at`) VALUES
(177, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Solicitud aprobada - Pago pendiente - FND-00010', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Pago Pendiente - Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">La solicitud ha sido aprobada y requiere el desembolso correspondiente.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00010</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">ANTICIPO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto a Pagar</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 12.00</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Concepto</td>            <td style=\"padding: 12px; color: #333333;\">dsadsadasas</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, proceda con el pago y suba el comprobante al sistema.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 15:44:24', NULL),
(178, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Solicitud pendiente de aprobación - FND-00009', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Solicitud</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">La solicitud ha sido firmada por el jefe de departamento y se encuentra pendiente de su aprobación.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00009</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Departamento</td>            <td style=\"padding: 12px; color: #333333;\">ADMINISTRACION</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">ANTICIPO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 12.00</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para aprobar o rechazar la solicitud.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 15:44:30', NULL),
(179, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Solicitud aprobada - Pago pendiente - FND-00009', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Pago Pendiente - Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">La solicitud ha sido aprobada y requiere el desembolso correspondiente.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00009</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">ANTICIPO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto a Pagar</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 12.00</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Concepto</td>            <td style=\"padding: 12px; color: #333333;\">csfcsdcdscdsdcs</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, proceda con el pago y suba el comprobante al sistema.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 15:44:32', NULL),
(180, 8, 'admin@c.com', 'Perfil Prueba', 'Solicitud cerrada - FND-00011', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #6c757d;\">    <div style=\"background-color: #6c757d; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Proceso Finalizado</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que su solicitud de <strong>REEMBOLSO</strong> ha sido <strong>CERRADA EXITOSAMENTE</strong>.</p>      <div style=\"background-color: #e9ecef; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 14px; color: #383d41;\">          <strong>Total rendido:</strong> S/ 12.00<br>          <strong>Diferencia:</strong> S/ 0.00        </p>      </div>      <p style=\"color: #555555;\">Agradecemos su gestión y cumplimiento de los procedimientos establecidos.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 15:44:55', NULL),
(181, 8, 'admin@c.com', 'Perfil Prueba', 'Nueva solicitud de fondos - FND-00012', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Gestión de Fondos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) <strong>Jefe de Departamento</strong>,</p>      <p style=\"color: #555555;\">Se ha creado una nueva solicitud de fondos que requiere su firma para continuar con el flujo.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00012</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">REEMBOLSO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Concepto</td>            <td style=\"padding: 12px; color: #333333;\">csacascascas</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto Solicitado</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 11.00</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Empresa / Sede</td>            <td style=\"padding: 12px; color: #333333;\">EDUTUR E.I.R.L. - PIURA</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para firmar o rechazar la solicitud.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 15:47:54', NULL),
(182, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Solicitud pendiente de aprobación - FND-00012', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Solicitud</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">La solicitud ha sido firmada por el jefe de departamento y se encuentra pendiente de su aprobación.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00012</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Departamento</td>            <td style=\"padding: 12px; color: #333333;\">ACADEMICO CETPRO PIURA</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">REEMBOLSO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 11.00</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para aprobar o rechazar la solicitud.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 15:47:57', NULL),
(183, 8, 'admin@c.com', 'Perfil Prueba', 'Solicitud cerrada - FND-00012', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #6c757d;\">    <div style=\"background-color: #6c757d; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Proceso Finalizado</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que su solicitud de <strong>REEMBOLSO</strong> ha sido <strong>CERRADA EXITOSAMENTE</strong>.</p>      <div style=\"background-color: #e9ecef; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 14px; color: #383d41;\">          <strong>Total rendido:</strong> S/ 12.00<br>          <strong>Diferencia:</strong> S/ -1.00        </p>      </div>      <p style=\"color: #555555;\">Agradecemos su gestión y cumplimiento de los procedimientos establecidos.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 15:49:14', NULL),
(184, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Nueva solicitud de fondos - FND-00013', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Gestión de Fondos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) <strong>Jefe de Departamento</strong>,</p>      <p style=\"color: #555555;\">Se ha creado una nueva solicitud de fondos que requiere su firma para continuar con el flujo.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00013</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">ANTICIPO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Concepto</td>            <td style=\"padding: 12px; color: #333333;\">ccascas</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto Solicitado</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 11.00</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Empresa / Sede</td>            <td style=\"padding: 12px; color: #333333;\">EDUTUR E.I.R.L. - PIURA</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para firmar o rechazar la solicitud.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 15:49:53', NULL),
(185, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Solicitud pendiente de aprobación - FND-00013', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Solicitud</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">La solicitud ha sido firmada por el jefe de departamento y se encuentra pendiente de su aprobación.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00013</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Departamento</td>            <td style=\"padding: 12px; color: #333333;\">ADMINISTRACION</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">ANTICIPO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 11.00</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para aprobar o rechazar la solicitud.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 15:49:59', NULL),
(186, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Solicitud aprobada - Pago pendiente - FND-00013', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Pago Pendiente - Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">La solicitud ha sido aprobada y requiere el desembolso correspondiente.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00013</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">ANTICIPO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto a Pagar</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 11.00</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Concepto</td>            <td style=\"padding: 12px; color: #333333;\">ccascas</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, proceda con el pago y suba el comprobante al sistema.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 15:50:02', NULL),
(187, 8, 'admin@c.com', 'Perfil Prueba', 'Pago registrado - Rendición pendiente - FND-00013', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #28a745;\">    <div style=\"background-color: #28a745; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Pago Registrado</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Se ha registrado el pago correspondiente a su solicitud de <strong>ANTICIPO</strong>.</p>      <div style=\"background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 14px; color: #155724;\">          <strong>Monto entregado:</strong> S/ 11.00        </p>      </div>      <p style=\"color: #555555; margin-top: 15px;\"><strong>IMPORTANTE:</strong> Debe presentar la rendición documentaria de los gastos realizados dentro del plazo establecido.</p>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Ingrese al sistema para subir sus comprobantes de gasto.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 15:50:20', NULL),
(188, 8, 'admin@c.com', 'Perfil Prueba', 'Solicitud cerrada - FND-00013', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #6c757d;\">    <div style=\"background-color: #6c757d; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Proceso Finalizado</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que su solicitud de <strong>ANTICIPO</strong> ha sido <strong>CERRADA EXITOSAMENTE</strong>.</p>      <div style=\"background-color: #e9ecef; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 14px; color: #383d41;\">          <strong>Total rendido:</strong> S/ 11.00<br>          <strong>Diferencia:</strong> S/ 0.00        </p>      </div>      <p style=\"color: #555555;\">Agradecemos su gestión y cumplimiento de los procedimientos establecidos.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 15:50:43', NULL),
(189, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Movilidad Pendiente - MOV-00042', '<div style=\"font-family:Segoe UI,Arial,sans-serif;background:#f4f4f4;padding:30px;\"><div style=\"max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:6px solid #800000;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#ffffff;\">Solicitud de Movilidad</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Administración</strong>,</p><p>Existe una movilidad pendiente de validación.</p><table style=\"width:100%;border-collapse:collapse;margin-top:20px;\"><tr><td style=\"padding:10px;font-weight:bold;\">Código</td><td style=\"padding:10px;\">MOV-00042</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Solicitante</td><td style=\"padding:10px;\">Perfil Prueba</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Departamento</td><td style=\"padding:10px;\">TIC TAC</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Origen</td><td style=\"padding:10px;\">SULLANA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Destino</td><td style=\"padding:10px;\">paita</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Motivo</td><td style=\"padding:10px;\">dadasdas</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Fecha</td><td style=\"padding:10px;\">05/06/2026</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Monto</td><td style=\"padding:10px;\">S/ 12.00</td></tr></table></div><div style=\"background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;\">Sistema CETURGH - Mensaje automático</div></div></div>', 0, NULL, '2026-06-05 16:09:05', NULL),
(190, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Pago Pendiente de Movilidad - MOV-00042', '<div style=\"font-family:Segoe UI,Arial,sans-serif;padding:30px;background:#f4f4f4;\"><div style=\"max-width:650px;margin:auto;background:#fff;border-top:6px solid #800000;border-radius:10px;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#fff;\">Movilidad Aprobada</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Tesorería</strong>,</p><p>Existe una movilidad pendiente de desembolso.</p><p><strong>Código:</strong> MOV-00042</p><p><strong>Solicitante:</strong> Perfil Prueba</p><p><strong>Monto:</strong> S/ 12.00</p></div></div></div>', 0, NULL, '2026-06-05 16:09:20', NULL),
(191, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Solicitud pendiente de aprobación - FND-00014', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Solicitud</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">La solicitud ha sido firmada por el jefe de departamento y se encuentra pendiente de su aprobación.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Campo</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>           </td>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Solicitud</td>            <td style=\"padding: 12px; color: #333333;\">FND-00014</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Departamento</td>            <td style=\"padding: 12px; color: #333333;\">TIC TAC</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Tipo</td>            <td style=\"padding: 12px; color: #333333;\">REEMBOLSO</td>           </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Monto</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">S/ 12.00</td>           </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para aprobar o rechazar la solicitud.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 16:29:38', NULL),
(192, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Requerimiento Pendiente de Aprobación', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Aprobación de Requerimientos</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Administración</strong>,</p>      <p style=\"color: #555555;\">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-185</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">FRANELA</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Cantidad Solicitada</td>            <td style=\"padding: 12px; color: #333333; font-weight: bold;\">1</td>          </tr>        </tbody>      </table>      <div style=\"text-align: center; margin-top: 30px;\">        <p style=\"font-size: 14px; color: #777777; margin-bottom: 15px;\">Por favor, ingrese al sistema para validar o emitir observaciones.</p>      </div>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 16:31:00', NULL),
(193, 12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', 'Comprobante de Pago Pendiente', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;\">    <div style=\"background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Área de Tesorería</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado equipo de <strong>Tesorería</strong>,</p>      <p style=\"color: #555555;\">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>      <table style=\"width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;\">        <thead>          <tr style=\"background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;\">            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Concepto</th>            <th style=\"padding: 12px; text-align: left; color: #800020; font-weight: bold;\">Detalle</th>          </tr>        </thead>        <tbody>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555; width: 35%;\">Código Requerimiento</td>            <td style=\"padding: 12px; color: #333333;\">REQ-185</td>          </tr>          <tr style=\"border-bottom: 1px solid #eeeeee;\">            <td style=\"padding: 12px; font-weight: bold; color: #555555;\">Descripción Item</td>            <td style=\"padding: 12px; color: #333333;\">FRANELA</td>          </tr>        </tbody>      </table>      <p style=\"font-size: 14px; color: #777777; text-align: center; margin-top: 25px;\">Por favor, proceda según los protocolos financieros del sistema.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 16:31:12', NULL),
(194, 8, 'admin@c.com', 'Perfil Prueba', 'Solicitud cerrada - FND-00014', '<div style=\"font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;\">  <div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #6c757d;\">    <div style=\"background-color: #6c757d; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;\">      <h2 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;\">Proceso Finalizado</h2>    </div>    <div style=\"padding: 30px;\">      <p style=\"margin-top: 0; font-size: 16px;\">Estimado(a) colaborador(a),</p>      <p style=\"color: #555555;\">Le informamos que su solicitud de <strong>REEMBOLSO</strong> ha sido <strong>CERRADA EXITOSAMENTE</strong>.</p>      <div style=\"background-color: #e9ecef; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0; border-radius: 4px;\">        <p style=\"margin: 0; font-size: 14px; color: #383d41;\">          <strong>Total rendido:</strong> S/ 12.00<br>          <strong>Diferencia:</strong> S/ 0.00        </p>      </div>      <p style=\"color: #555555;\">Agradecemos su gestión y cumplimiento de los procedimientos establecidos.</p>    </div>    <div style=\"background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;\">      <p style=\"margin: 0; font-weight: bold; color: #800020;\">Sistema de Gestión CETURGH</p>      <p style=\"margin: 5px 0 0 0;\">Este es un mensaje automático, por favor no responder a este correo.</p>    </div>  </div></div>', 0, NULL, '2026-06-05 16:32:00', NULL),
(195, 4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', 'Movilidad Pendiente - MOV-00046', '<div style=\"font-family:Segoe UI,Arial,sans-serif;background:#f4f4f4;padding:30px;\"><div style=\"max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:6px solid #800000;\"><div style=\"background:#800000;padding:25px;text-align:center;\"><h2 style=\"margin:0;color:#ffffff;\">Solicitud de Movilidad</h2></div><div style=\"padding:30px;\"><p>Estimado equipo de <strong>Administración</strong>,</p><p>Existe una movilidad pendiente de validación.</p><table style=\"width:100%;border-collapse:collapse;margin-top:20px;\"><tr><td style=\"padding:10px;font-weight:bold;\">Código</td><td style=\"padding:10px;\">MOV-00046</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Solicitante</td><td style=\"padding:10px;\">Perfil Prueba</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Departamento</td><td style=\"padding:10px;\">TIC</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Origen</td><td style=\"padding:10px;\">CETURGH PIURA</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Destino</td><td style=\"padding:10px;\">coelgios</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Motivo</td><td style=\"padding:10px;\">Praticas</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Fecha</td><td style=\"padding:10px;\">05/06/2026</td></tr><tr><td style=\"padding:10px;font-weight:bold;\">Monto</td><td style=\"padding:10px;\">S/ 25.00</td></tr></table></div><div style=\"background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;\">Sistema CETURGH - Mensaje automático</div></div></div>', 0, NULL, '2026-06-05 19:06:52', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `correlativos`
--

CREATE TABLE `correlativos` (
  `tipo` enum('OC','OS','RQ','REND','FND') NOT NULL,
  `anio` int(11) NOT NULL,
  `numero_actual` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `correlativos`
--

INSERT INTO `correlativos` (`tipo`, `anio`, `numero_actual`) VALUES
('OC', 2026, 52),
('OS', 2026, 1),
('RQ', 2026, 17),
('REND', 2026, 12),
('FND', 2026, 14);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamentos`
--

CREATE TABLE `departamentos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `presupuesto` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `departamentos`
--

INSERT INTO `departamentos` (`id`, `nombre`, `empresa_id`, `sede_id`, `parent_id`, `presupuesto`) VALUES
(3, 'TIC', 1, 1, NULL, 998.00),
(5, 'LOGISTICA', 1, 1, NULL, 0.00),
(6, 'RECURSOS HUMANOS', 1, 1, NULL, 1110.00),
(7, 'BIENESTAR ESTUDIANTIL', 1, 1, NULL, 0.00),
(8, 'TESORERIA', 1, 1, 22, 9838.00),
(9, 'VENTAS', 1, 1, NULL, 0.00),
(10, 'ADMINISTRACION', 1, 1, 22, 9833.00),
(11, 'ACADEMICO CETPRO PIURA', 1, 1, NULL, 0.00),
(12, 'ACADEMICO CETPRO SULLANA', 1, 1, NULL, 0.00),
(13, 'ACADEMICO INSTITUTO', 1, 1, NULL, 0.00),
(14, 'MARKETING', 1, 1, NULL, 0.00),
(15, 'BIBLIOTECA', 1, 1, NULL, 0.00),
(16, 'SEGURIDAD', 1, 1, NULL, 0.00),
(17, 'ALMACEN', 1, 1, 21, 0.00),
(18, 'TIC SULLANA', 1, 1, 3, 0.00),
(19, 'TIC TAC', 1, 1, 3, 0.00),
(21, 'LOGÍSTICA Y ALMACÉN', 1, 1, NULL, 5047.00),
(22, 'ADMINISTRACIÓN Y RECURSOS HUMANOS', 1, 1, NULL, 32041.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamentos_backup_20260605`
--

CREATE TABLE `departamentos_backup_20260605` (
  `id` int(11) NOT NULL DEFAULT 0,
  `nombre` varchar(100) NOT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `presupuesto` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `departamentos_backup_20260605`
--

INSERT INTO `departamentos_backup_20260605` (`id`, `nombre`, `empresa_id`, `sede_id`, `parent_id`, `presupuesto`) VALUES
(3, 'TIC', 1, 1, NULL, 1020.00),
(5, 'LOGISTICA', 1, 1, NULL, 0.00),
(6, 'RECURSOS HUMANOS', 1, 1, NULL, 1110.00),
(7, 'BIENESTAR ESTUDIANTIL', 1, 1, NULL, 0.00),
(8, 'TESORERIA', 1, 1, NULL, 9838.00),
(9, 'VENTAS', 1, 1, NULL, 0.00),
(10, 'ADMINISTRACION', 1, 1, NULL, 9833.00),
(11, 'ACADEMICO CETPRO PIURA', 1, 1, NULL, 0.00),
(12, 'ACADEMICO CETPRO SULLANA', 1, 1, NULL, 0.00),
(13, 'ACADEMICO INSTITUTO', 1, 1, NULL, 0.00),
(14, 'MARKETING', 1, 1, NULL, 0.00),
(15, 'BIBLIOTECA', 1, 1, NULL, 0.00),
(16, 'SEGURIDAD', 1, 1, NULL, 0.00),
(17, 'ALMACEN', 1, 1, NULL, 0.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas`
--

CREATE TABLE `empresas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `ruc` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `web` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `empresas`
--

INSERT INTO `empresas` (`id`, `nombre`, `ruc`, `direccion`, `web`) VALUES
(1, 'EDUTUR E.I.R.L.', '20600652312', 'Av. Sanchez Cerro Nro. 234 Cent. Piura (Frente de Caja Paita)', 'http://ceturghperu.edu.pe/'),
(2, 'KEVSTUR E.I.R.L.', '20600599951', 'Av. Sanchez Cerro Nro. 234 Cent. Piura (al Costado de Estudio Huancas Ronceros)', 'http://ceturghperu.edu.pe/');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupos_tesoreria`
--

CREATE TABLE `grupos_tesoreria` (
  `id` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `guia_url` varchar(255) DEFAULT NULL,
  `comprobante_url` varchar(255) DEFAULT NULL,
  `incluye_igv` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `grupos_tesoreria`
--

INSERT INTO `grupos_tesoreria` (`id`, `fecha`, `guia_url`, `comprobante_url`, `incluye_igv`) VALUES
(28, '2026-05-13 19:00:08', 'uploads/guias/1778716808_1778659002_Planilla_Movilidad_32.pdf', NULL, 0),
(29, '2026-05-14 11:00:56', 'uploads/guias/1778774456_Planilla_Movilidad_28__1_.pdf', NULL, 0),
(30, '2026-05-14 13:34:08', NULL, NULL, 0),
(31, '2026-05-14 15:08:10', NULL, NULL, 0),
(32, '2026-05-14 15:18:34', NULL, NULL, 0),
(33, '2026-05-15 09:51:37', NULL, NULL, 0),
(34, '2026-05-15 10:45:05', NULL, NULL, 0),
(40, '2026-05-15 11:55:19', NULL, NULL, 0),
(43, '2026-05-15 12:05:49', NULL, NULL, 0),
(44, '2026-05-15 12:08:22', NULL, NULL, 0),
(45, '2026-05-15 12:15:08', NULL, NULL, 0),
(46, '2026-05-15 12:20:23', NULL, NULL, 0),
(47, '2026-05-15 12:27:56', NULL, NULL, 0),
(48, '2026-05-15 12:40:04', NULL, NULL, 0),
(49, '2026-05-15 14:16:31', NULL, NULL, 0),
(50, '2026-05-15 14:20:15', NULL, NULL, 0),
(51, '2026-05-15 14:55:48', NULL, NULL, 0),
(52, '2026-05-15 15:20:52', NULL, NULL, 0),
(53, '2026-05-15 15:31:38', NULL, NULL, 0),
(54, '2026-05-15 15:39:33', NULL, NULL, 0),
(55, '2026-05-15 15:46:48', NULL, 'uploads/comprobantes/1779115837_Planilla_Movilidad_39.pdf', 0),
(56, '2026-05-19 08:25:24', NULL, NULL, 0),
(57, '2026-05-19 09:56:54', NULL, NULL, 0),
(58, '2026-05-19 10:07:36', 'uploads/guias/1779290970_Planilla_Movilidad_40.pdf', 'uploads/comprobantes/1779290979_OC-2026-000040 (1).pdf', 0),
(59, '2026-05-20 15:03:21', NULL, NULL, 0),
(60, '2026-05-21 01:06:17', 'uploads/guias/1779354107_Planilla_Movilidad_40.pdf,uploads/guias/1779354168_OC_2026_000041.pdf', 'uploads/comprobantes/1779354173_OC_2026_000041.pdf', 0),
(61, '2026-05-21 02:00:36', NULL, NULL, 0),
(62, '2026-05-21 04:08:15', NULL, 'uploads/comprobantes/1779371119_OC_2026_000042.pdf,uploads/comprobantes/1779371124_OC_2026_000041.pdf', 0),
(63, '2026-05-21 11:24:32', NULL, NULL, 0),
(64, '2026-05-21 11:25:13', NULL, NULL, 0),
(65, '2026-05-21 11:26:07', NULL, NULL, 0),
(66, '2026-05-21 11:44:00', NULL, NULL, 0),
(67, '2026-05-21 11:44:03', NULL, NULL, 1),
(68, '2026-05-21 11:54:17', NULL, NULL, 0),
(69, '2026-05-21 11:54:22', NULL, 'uploads/comprobantes/1779958778_Planilla_Movilidad_37.pdf', 1),
(70, '2026-05-21 12:01:21', NULL, NULL, 0),
(71, '2026-05-21 12:01:31', NULL, 'uploads/comprobantes/1779958727_Planilla_Movilidad_37.pdf', 1),
(72, '2026-05-28 03:11:54', NULL, NULL, 0),
(73, '2026-05-28 03:15:57', NULL, NULL, 0),
(74, '2026-05-28 03:23:35', NULL, NULL, 1),
(75, '2026-05-28 03:36:57', 'uploads/guias/1779958706_SOLICITUD_DE_ANTICIPO_FND_20260527191741__4_.pdf,uploads/guias/1779958718_SOLICITUD_DE_ANTICIPO_FND_20260527191741__4_.pdf', 'uploads/comprobantes/1779958697_SOLICITUD_DE_ANTICIPO_FND_20260527191741__4_.pdf,uploads/comprobantes/1779958697_SOLICITUD_DE_ANTICIPO_FND_20260527194020__10_.pdf,uploads/comprobantes/1779958697_SOLICITUD_DE_ANTICIPO_FND_20260527191741__3_.pdf', 0),
(76, '2026-05-28 03:38:18', NULL, 'uploads/comprobantes/1779958737_SOLICITUD_DE_ANTICIPO_FND_20260527194020__10_.pdf', 0),
(77, '2026-05-28 03:47:36', 'uploads/guias/1779958749_SOLICITUD_DE_ANTICIPO_FND_20260527191741__2_.pdf', 'uploads/comprobantes/1779958744_SOLICITUD_DE_ANTICIPO_FND_20260527194020__10_.pdf', 0),
(78, '2026-05-28 03:56:59', 'uploads/guias/1779958771_SOLICITUD_DE_ANTICIPO_FND_20260527191741__3_.pdf', 'uploads/comprobantes/1779958755_SOLICITUD_DE_ANTICIPO_FND_20260527191741__4_.pdf,uploads/comprobantes/1779958767_Planilla_Movilidad_40__1_.pdf', 0),
(79, '2026-05-28 04:04:23', 'uploads/guias/1779959110_SOLICITUD_DE_ANTICIPO_FND_20260527191741__4_.pdf', 'uploads/comprobantes/1779959106_Planilla_Movilidad_40__1_.pdf', 0),
(80, '2026-05-28 09:10:09', NULL, NULL, 0),
(81, '2026-05-28 09:10:20', NULL, NULL, 1),
(87, '2026-05-28 10:28:06', NULL, NULL, 0),
(88, '2026-05-28 10:31:14', NULL, NULL, 0),
(89, '2026-05-28 10:32:53', NULL, NULL, 1),
(90, '2026-05-28 10:35:47', NULL, NULL, 1),
(91, '2026-05-28 10:47:45', NULL, NULL, 0),
(92, '2026-05-28 10:51:19', NULL, NULL, 1),
(93, '2026-05-28 10:59:31', NULL, NULL, 0),
(94, '2026-05-28 11:00:01', NULL, NULL, 1),
(95, '2026-05-28 11:00:36', NULL, NULL, 1),
(96, '2026-06-05 11:31:00', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `tipo` enum('INSUMO','MENAJE','HERRAMIENTA','MOVIL','OFICINA','LOGISTICA','DATA_CENTER') DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `responsable` varchar(100) DEFAULT NULL,
  `stock_actual` decimal(10,2) DEFAULT 0.00,
  `estado` varchar(50) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `stock_min` int(11) DEFAULT 0,
  `marca` varchar(100) DEFAULT NULL,
  `unidad` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_data_center`
--

CREATE TABLE `inventario_data_center` (
  `inventario_id` int(11) DEFAULT NULL,
  `tipo_equipo` varchar(50) DEFAULT NULL,
  `marca_modelo` varchar(150) DEFAULT NULL,
  `serie` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'DISPONIBLE',
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `inventario_data_center`
--

INSERT INTO `inventario_data_center` (`inventario_id`, `tipo_equipo`, `marca_modelo`, `serie`, `estado`, `observaciones`) VALUES
(10, 'ADAPTADOR', 'LAPICEROS', 'N/A', 'DISPONIBLE', 'Ingreso automático desde requerimiento');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_herramientas`
--

CREATE TABLE `inventario_herramientas` (
  `inventario_id` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `inventario_herramientas`
--

INSERT INTO `inventario_herramientas` (`inventario_id`, `cantidad`) VALUES
(2, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_insumos`
--

CREATE TABLE `inventario_insumos` (
  `inventario_id` int(11) DEFAULT NULL,
  `proveedor` varchar(100) DEFAULT NULL,
  `dias_alerta` int(11) DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `unidad` varchar(20) DEFAULT NULL,
  `stock_min` int(11) DEFAULT 0,
  `ubicacion` varchar(150) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `stock_actual` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `inventario_insumos`
--

INSERT INTO `inventario_insumos` (`inventario_id`, `proveedor`, `dias_alerta`, `marca`, `categoria`, `unidad`, `stock_min`, `ubicacion`, `nombre`, `tipo`, `stock_actual`) VALUES
(4, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0),
(5, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0),
(6, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_lotes`
--

CREATE TABLE `inventario_lotes` (
  `id` int(11) NOT NULL,
  `inventario_id` int(11) DEFAULT NULL,
  `lote` varchar(50) DEFAULT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  `vencimiento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_menaje`
--

CREATE TABLE `inventario_menaje` (
  `inventario_id` int(11) DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL,
  `estado_conservacion` varchar(50) DEFAULT NULL,
  `ultimo_inventario` date DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `ubicacion` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `inventario_menaje`
--

INSERT INTO `inventario_menaje` (`inventario_id`, `material`, `estado_conservacion`, `ultimo_inventario`, `categoria`, `ubicacion`) VALUES
(3, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_moviles`
--

CREATE TABLE `inventario_moviles` (
  `inventario_id` int(11) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `modelo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `inventario_moviles`
--

INSERT INTO `inventario_moviles` (`inventario_id`, `numero`, `modelo`) VALUES
(1, NULL, 'LAPICEROS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_oficina`
--

CREATE TABLE `inventario_oficina` (
  `inventario_id` int(11) DEFAULT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `modelo` varchar(50) DEFAULT NULL,
  `serie` varchar(100) DEFAULT NULL,
  `sistema_operativo` varchar(100) DEFAULT NULL,
  `observacion` text DEFAULT NULL,
  `equipo` varchar(50) DEFAULT NULL,
  `office` varchar(100) DEFAULT NULL,
  `responsable` varchar(100) DEFAULT NULL,
  `fecha_registro` date DEFAULT NULL,
  `anio_adquisicion` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `inventario_oficina`
--

INSERT INTO `inventario_oficina` (`inventario_id`, `marca`, `modelo`, `serie`, `sistema_operativo`, `observacion`, `equipo`, `office`, `responsable`, `fecha_registro`, `anio_adquisicion`) VALUES
(7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `requerimiento_id` int(11) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `cantidad` float DEFAULT NULL,
  `unidad` varchar(50) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `requiere_cotizacion` tinyint(4) DEFAULT 0,
  `centro_costo_id` int(11) DEFAULT NULL,
  `area_costo_id` int(11) DEFAULT NULL,
  `carrera_id` int(11) DEFAULT NULL,
  `proveedor` varchar(255) DEFAULT NULL,
  `proveedor_id` int(11) DEFAULT NULL,
  `estado_pago` enum('Pendiente','Pagado') DEFAULT 'Pendiente',
  `es_insumo` tinyint(1) DEFAULT 0,
  `estado_insumo` varchar(20) DEFAULT 'Pendiente',
  `tipo` varchar(20) DEFAULT 'Producto',
  `motivo_insumo` text DEFAULT NULL,
  `grupo_id` int(11) DEFAULT NULL,
  `comentario_estado` text DEFAULT NULL,
  `comentario_solicitante` text DEFAULT NULL,
  `archivo_adjunto` varchar(500) DEFAULT NULL,
  `tipo_inventario` enum('MENAJE','INSUMO','MOVIL','OFICINA','HERRAMIENTA','LOGISTICA','DATA_CENTER') DEFAULT NULL,
  `estado_inventario` enum('PENDIENTE','INGRESADO') DEFAULT 'PENDIENTE',
  `flujo_estado` enum('LOGISTICA','ADMINISTRACION','TESORERIA','FINALIZADO') DEFAULT 'LOGISTICA',
  `estado_logistica` enum('PENDIENTE','ENVIADO') DEFAULT 'PENDIENTE',
  `estado_administracion` enum('PENDIENTE','APROBADO','OBSERVADO','DENEGADO') DEFAULT 'PENDIENTE',
  `estado_tesoreria` enum('PENDIENTE','PAGADO') DEFAULT 'PENDIENTE',
  `tipo_destino` enum('GENERAL','CARRERA','CURSO_CORTO') DEFAULT 'GENERAL',
  `curso_corto` varchar(255) DEFAULT NULL,
  `incluye_igv` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `items`
--

INSERT INTO `items` (`id`, `requerimiento_id`, `descripcion`, `cantidad`, `unidad`, `precio_unitario`, `total`, `requiere_cotizacion`, `centro_costo_id`, `area_costo_id`, `carrera_id`, `proveedor`, `proveedor_id`, `estado_pago`, `es_insumo`, `estado_insumo`, `tipo`, `motivo_insumo`, `grupo_id`, `comentario_estado`, `comentario_solicitante`, `archivo_adjunto`, `tipo_inventario`, `estado_inventario`, `flujo_estado`, `estado_logistica`, `estado_administracion`, `estado_tesoreria`, `tipo_destino`, `curso_corto`, `incluye_igv`) VALUES
(146, 132, 'LAPICEROS', 1, 'Unidad', 10.00, 10.00, 0, 131, NULL, NULL, 'Constructores y Consultores la Guadalupana S.R.L.', 37, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 28, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(147, 133, 'HARINA', 5, 'KG', 7.00, 35.00, 0, 132, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 29, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(148, 133, 'LAPICEROS', 4, 'Unidad', 10.00, 40.00, 0, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 29, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(149, 133, 'LIMPIA TODO', 3, 'Unidad', 20.00, 60.00, 0, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 30, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(150, 134, 'FRANELA', 1, 'Unidad', 10.00, 10.00, 0, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 31, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(151, 135, 'JABON LIQUIDO', 1, 'Unidad', 2.00, 2.00, 0, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 32, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(152, 136, 'LAPIZ', 1, 'Unidad', 0.00, 0.00, 0, NULL, NULL, NULL, '', NULL, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 33, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(153, 137, 'LAPIZ', 1, 'Unidad', 10.00, 10.00, 0, 132, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 34, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(154, 138, 'LAPIZ', 1, 'Unidad', 0.00, 0.00, 0, NULL, NULL, NULL, '', NULL, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 40, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(155, 139, 'LAPICEROS', 1, 'Unidad', 0.00, 0.00, 0, NULL, NULL, NULL, NULL, NULL, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 43, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(156, 140, 'PAPEL DINA A4', 1, 'Unidad', 0.00, 0.00, 0, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 44, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(157, 141, 'JABON LIQUIDO', 1, 'Unidad', 10.00, 10.00, 0, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 45, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(158, 142, 'JABON LIQUIDO', 1, 'Unidad', 30.00, 30.00, 1, 131, NULL, NULL, 'Tintos & Hielos SCRL', 4, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 58, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(159, 143, 'CORRECTOR', 1, 'Unidad', 10.00, 10.00, 1, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 46, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(160, 144, 'LIMPIA TODO', 1, 'Unidad', 0.00, 0.00, 0, NULL, NULL, NULL, '', NULL, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 47, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(161, 145, 'JABON LIQUIDO', 1, 'Unidad', 10.00, 10.00, 1, 261, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 48, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(162, 146, 'LAPIZ', 1, 'Unidad', 10.00, 10.00, 1, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 49, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(163, 147, 'ARCHIVADOR', 1, 'Unidad', 2.00, 2.00, 0, 12, NULL, NULL, 'Tintos & Hielos SCRL', 4, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 50, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(164, 148, 'CINTA SCOTCH', 1, 'Unidad', 2.00, 2.00, 0, 261, NULL, NULL, 'Carnicos C&S', 3, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 51, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(165, 149, 'LAPICEROS', 1, 'Unidad', 130.00, 130.00, 1, 1, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 64, '', NULL, NULL, NULL, 'PENDIENTE', 'ADMINISTRACION', 'ENVIADO', 'DENEGADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(166, 150, 'LAPICEROS', 1, 'Unidad', 20.00, 20.00, 1, 131, NULL, NULL, 'Tintos & Hielos SCRL', 4, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 58, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(167, 151, 'JABON LIQUIDO', 1, 'Unidad', 3.00, 3.00, 0, 132, NULL, NULL, 'Carnicos C&S', 3, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 52, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(168, 152, 'RESALTADOR', 1, 'Unidad', 10.00, 10.00, 1, 132, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 53, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(169, 153, 'HARINA', 1, 'Unidad', 10.00, 10.00, 1, 131, NULL, NULL, 'Tintos & Hielos SCRL', 4, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 58, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(170, 154, 'JABON LIQUIDO', 1, 'Unidad', 10.00, 10.00, 0, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 54, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(171, 155, 'SOBRE MANILA A4', 1, 'Unidad', 10.00, 10.00, 0, 1, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 55, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(172, 156, 'HARINA', 1, 'Unidad', 10.00, 10.00, 1, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 57, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(173, 157, 'PILAS AAA', 2, 'Paquetes', 10.00, 20.00, 1, 261, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 57, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(174, 157, 'CARGADOR DE CELULAR', 1, 'Unidad', 10.00, 10.00, 1, 261, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 57, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(175, 158, 'JABON LIQUIDO', 4, 'Unidad', 10.00, 40.00, 1, 1, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 56, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(176, 159, 'JABON LIQUIDO', 1, 'Unidad', 0.00, 0.00, 1, NULL, NULL, NULL, '', NULL, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 63, NULL, NULL, NULL, NULL, 'PENDIENTE', 'ADMINISTRACION', 'ENVIADO', 'PENDIENTE', 'PENDIENTE', 'GENERAL', NULL, 0),
(177, 160, 'JABON LIQUIDO', 1.2, 'Unidad', 10.00, 12.00, 1, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 59, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(178, 161, 'LIMPIA TODO', 1.323, 'Unidad', 3.00, 3.97, 1, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 60, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(179, 162, 'sdasd', 1, 'Unidad', 150.00, 150.00, 0, 131, NULL, NULL, 'Sanchez Flores Eleuterio', 22, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 61, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(180, 163, 'dasdasd', 1, 'Unidad', 10.00, 10.00, 1, 261, NULL, NULL, 'Red Hardward Tecnology S.R.L', 32, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 62, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(181, 164, 'FOLDER MANILA', 1, 'Unidad', 20.00, 20.00, 1, 133, NULL, NULL, 'Olympus Industrias S.R.L', 14, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 65, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(182, 165, 'fsdfds', 1, 'Unidad', 10.00, 10.00, 1, 131, NULL, NULL, 'MARIA NELIDA CHIROQUE MACALUPU', 10, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 67, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(183, 165, 'aasa', 1, 'Unidad', 10.00, 10.00, 1, 131, NULL, NULL, 'Palacios Alburqueque Jani Daniel', 5, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 66, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(184, 166, 'LAPIZ', 1, 'Unidad', 30.00, 30.00, 1, 131, NULL, NULL, 'Wilmer Timana Carmen', 7, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 69, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(185, 166, 'MICAS A4', 1, 'Unidad', 30.00, 30.00, 1, 131, NULL, NULL, 'Palacios Alburqueque Jani Daniel', 5, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 68, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(186, 167, 'cigv', 1, 'Unidad', 40.00, 40.00, 1, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 71, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(187, 167, 'sigv', 1, 'Unidad', 40.00, 40.00, 1, 131, NULL, NULL, 'Olympus Industrias S.R.L', 14, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 70, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(188, 168, 'JABON LIQUIDO', 1, 'Unidad', 0.00, 0.00, 1, NULL, NULL, NULL, '', NULL, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, NULL, NULL, NULL, NULL, NULL, 'PENDIENTE', 'LOGISTICA', 'PENDIENTE', 'PENDIENTE', 'PENDIENTE', 'GENERAL', NULL, 0),
(189, 169, 'FRANELA', 1, 'Unidad', 0.00, 0.00, 1, NULL, NULL, NULL, '', NULL, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, NULL, NULL, NULL, NULL, NULL, 'PENDIENTE', 'LOGISTICA', 'PENDIENTE', 'PENDIENTE', 'PENDIENTE', 'GENERAL', NULL, 0),
(190, 170, 'AZUCAR BLANCA', 1, 'KG', 10.00, 10.00, 1, 131, NULL, NULL, 'Jose Chavez Varona', 15, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 95, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 1),
(191, 171, 'FRANELA', 12, 'Unidad', 0.00, 0.00, 1, NULL, NULL, NULL, '', 3, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 94, NULL, NULL, NULL, NULL, 'PENDIENTE', 'ADMINISTRACION', 'ENVIADO', 'PENDIENTE', 'PENDIENTE', 'GENERAL', NULL, 1),
(192, 172, 'dasdsa', 1, 'Unidad', 10.00, 10.00, 1, 1, NULL, NULL, 'Olympus Industrias S.R.L', 14, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 93, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(193, 173, 'dsadsa', 1, 'Unidad', 11.00, 11.00, 1, 139, NULL, NULL, 'Carniceria Giron SCRL', 6, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 77, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(194, 174, 'asdsa', 1, 'Unidad', 10.00, 10.00, 1, 131, NULL, NULL, 'MIKESCORT E.I.R.L', 1, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 91, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(195, 175, 'dsadsad', 10, 'Unidad', 12.00, 120.00, 1, 131, NULL, NULL, 'MB SAC', 9, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 76, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(196, 176, 'cascsa', 1, 'Unidad', 30.00, 30.00, 1, 132, NULL, NULL, 'Miguel Angel Alcas Chorres', 24, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 90, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 1),
(197, 171, 'FRANELA', 1, 'Unidad', 10.00, 10.00, 1, 132, NULL, NULL, 'OTOYA LIVIAPOMA ', 8, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 92, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 1),
(198, 177, 'GRAPAS', 1, 'Unidad', 20.00, 20.00, 1, 132, NULL, NULL, 'OTOYA LIVIAPOMA LUIS ENRIQUE', 8, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 75, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(199, 178, 'HARINA', 1, 'Unidad', 10.00, 10.00, 1, 133, NULL, NULL, 'Ferreteria Burgos', 36, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 78, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(200, 179, 'DASD', 1, 'Unidad', 10.00, 10.00, 1, 131, NULL, NULL, 'Unión ychicawa s.a', 18, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 81, NULL, NULL, NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(201, 180, 'asdasds', 1, 'Unidad', 10.00, 10.00, 0, 131, NULL, NULL, 'Unión ychicawa s.a', 18, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 79, NULL, 'dsdsad', 'uploads/items/6a18046222984_201_1779958882.pdf', NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0),
(202, 181, 'dsadas', 1, 'Unidad', 10.00, 10.00, 1, 131, NULL, NULL, 'OTOYA LIVIAPOMA LUIS ENRIQUE', 8, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, 80, NULL, 'marca', NULL, NULL, 'PENDIENTE', 'TESORERIA', 'ENVIADO', 'APROBADO', 'PENDIENTE', 'GENERAL', NULL, 0),
(203, 182, 'dasdsa', 1, 'Unidad', 0.00, 0.00, 1, NULL, NULL, NULL, '', NULL, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, NULL, NULL, 'dasdasdsa', 'uploads/items/6a18962227a26_203_1779996194.pdf', NULL, 'PENDIENTE', 'LOGISTICA', 'PENDIENTE', 'PENDIENTE', 'PENDIENTE', 'GENERAL', NULL, 0),
(204, 183, 'FRANELA', 13, 'Unidad', 0.00, 0.00, 1, NULL, NULL, NULL, '', NULL, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, NULL, NULL, 'franela de color blanco', 'uploads/items/6a199e5df30e9_204_1780063837.pdf', NULL, 'PENDIENTE', 'LOGISTICA', 'PENDIENTE', 'PENDIENTE', 'PENDIENTE', 'GENERAL', NULL, 0),
(205, 184, 'PAPEL DINA A4', 0.65, 'GR', 0.00, 0.00, 1, NULL, NULL, NULL, '', NULL, 'Pendiente', 0, 'Pendiente', 'Producto', NULL, NULL, NULL, NULL, NULL, NULL, 'PENDIENTE', 'LOGISTICA', 'PENDIENTE', 'PENDIENTE', 'PENDIENTE', 'GENERAL', NULL, 0),
(206, 185, 'FRANELA', 1, 'Unidad', 10.00, 10.00, 1, 1, NULL, NULL, 'Constructores y Consultores la Guadalupana S.R.L.', 37, 'Pagado', 0, 'Pendiente', 'Producto', NULL, 96, NULL, NULL, NULL, NULL, 'PENDIENTE', 'FINALIZADO', 'ENVIADO', 'APROBADO', 'PAGADO', 'GENERAL', NULL, 0);

--
-- Disparadores `items`
--
DELIMITER $$
CREATE TRIGGER `trg_items_insert_notificaciones` AFTER INSERT ON `items` FOR EACH ROW BEGIN

    IF (
        NEW.flujo_estado = 'LOGISTICA'
        AND NEW.estado_logistica = 'PENDIENTE'
    ) THEN

        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            item_id,
            requerimiento_id
        )

        SELECT
            u.id,
            'Nuevo requerimiento',
            'Hay un item pendiente en logística',
            'LOGISTICA',
            NEW.id,
            NEW.requerimiento_id

        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id

        WHERE d.nombre = 'LOGISTICA';

    END IF;

END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_items_notificaciones` AFTER UPDATE ON `items` FOR EACH ROW BEGIN

    DECLARE depto_solicitante VARCHAR(100);

    -- =========================================
    -- OBTENER DEPARTAMENTO SOLICITANTE
    -- =========================================

    SELECT d.nombre
    INTO depto_solicitante
    FROM requerimientos r
    INNER JOIN departamentos d
        ON d.id = r.departamento_id
    WHERE r.id = NEW.requerimiento_id
    LIMIT 1;

    -- =========================================
    -- LOGISTICA
    -- =========================================

    IF (
        NEW.flujo_estado = 'LOGISTICA'
        AND NEW.estado_logistica = 'PENDIENTE'
        AND (
            OLD.flujo_estado <> NEW.flujo_estado
            OR OLD.estado_logistica <> NEW.estado_logistica
        )
    ) THEN

        -- NOTIFICACIONES

        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            item_id,
            requerimiento_id,
            referencia_estado
        )
        SELECT
            u.id,
            'Nuevo requerimiento',
            'Hay un item pendiente en logística',
            'LOGISTICA',
            NEW.id,
            NEW.requerimiento_id,
            CONCAT('LOGISTICA_', NEW.id)
        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id
        WHERE d.nombre = 'LOGISTICA';

        -- COLA CORREOS

        INSERT INTO cola_correos
        (
            usuario_id,
            destinatario,
            nombre,
            asunto,
            mensaje
        )
        SELECT
            u.id,
            u.usuario,
            u.nombre,
            'Nuevo requerimiento - Logística',
            CONCAT(
                '<div style="font-family: ''Segoe UI'', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;">',
                '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;">',
                '    <div style="background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;">',
                '      <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Gestión de Requerimientos</h2>',
                '    </div>',
                '    <div style="padding: 30px;">',
                '      <p style="margin-top: 0; font-size: 16px;">Estimado equipo de <strong>Logística</strong>,</p>',
                '      <p style="color: #555555;">Se ha asignado un nuevo ítem a su bandeja que requiere atención y procesamiento inmediato.</p>',
                '      <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;">',
                '        <thead>',
                '          <tr style="background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;">',
                '            <th style="padding: 12px; text-align: left; color: #800020; font-weight: bold;">Concepto</th>',
                '            <th style="padding: 12px; text-align: left; color: #800020; font-weight: bold;">Detalle</th>',
                '          </tr>',
                '        </thead>',
                '        <tbody>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555; width: 35%;">Código Requerimiento</td>',
                '            <td style="padding: 12px; color: #333333;">REQ-', NEW.requerimiento_id, '</td>',
                '          </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Descripción Item</td>',
                '            <td style="padding: 12px; color: #333333;">', COALESCE(NEW.descripcion, 'Sin descripción'), '</td>',
                '          </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Cantidad Solicitada</td>',
                '            <td style="padding: 12px; color: #333333; font-weight: bold;">', COALESCE(NEW.cantidad, 0), '</td>',
                '          </tr>',
                '        </tbody>',
                '      </table>',
                '      <div style="text-align: center; margin-top: 30px;">',
                '        <p style="font-size: 14px; color: #777777; margin-bottom: 15px;">Por favor, ingrese a la plataforma institucional para continuar con el flujo.</p>',
                '      </div>',
                '    </div>',
                '    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;">',
                '      <p style="margin: 0; font-weight: bold; color: #800020;">Sistema de Gestión CETURGH</p>',
                '      <p style="margin: 5px 0 0 0;">Este es un mensaje automático, por favor no responder a este correo.</p>',
                '    </div>',
                '  </div>',
                '</div>'
            )
        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id
        WHERE d.nombre = 'LOGISTICA';

    END IF;

    -- =========================================
    -- ADMINISTRACION PENDIENTE
    -- =========================================

    IF (
        NEW.flujo_estado = 'ADMINISTRACION'
        AND NEW.estado_administracion = 'PENDIENTE'
        AND (
            OLD.flujo_estado <> NEW.flujo_estado
            OR OLD.estado_administracion <> NEW.estado_administracion
        )
    ) THEN

        -- NOTIFICACIONES

        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            item_id,
            requerimiento_id,
            referencia_estado
        )
        SELECT
            u.id,
            'Pendiente aprobación',
            'Existe un item pendiente en administración',
            'ADMINISTRACION',
            NEW.id,
            NEW.requerimiento_id,
            CONCAT('ADMIN_', NEW.id)
        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id
        WHERE d.nombre = 'ADMINISTRACION';

        -- COLA CORREOS

        INSERT INTO cola_correos
        (
            usuario_id,
            destinatario,
            nombre,
            asunto,
            mensaje
        )
        SELECT
            u.id,
            u.usuario,
            u.nombre,
            'Requerimiento Pendiente de Aprobación',
            CONCAT(
                '<div style="font-family: ''Segoe UI'', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;">',
                '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;">',
                '    <div style="background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;">',
                '      <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Aprobación de Requerimientos</h2>',
                '    </div>',
                '    <div style="padding: 30px;">',
                '      <p style="margin-top: 0; font-size: 16px;">Estimado equipo de <strong>Administración</strong>,</p>',
                '      <p style="color: #555555;">Se encuentra disponible un nuevo requerimiento que requiere su respectiva evaluación técnica y aprobación financiera.</p>',
                '      <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;">',
                '        <thead>',
                '          <tr style="background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;">',
                '            <th style="padding: 12px; text-align: left; color: #800020; font-weight: bold;">Concepto</th>',
                '            <th style="padding: 12px; text-align: left; color: #800020; font-weight: bold;">Detalle</th>',
                '          </tr>',
                '        </thead>',
                '        <tbody>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555; width: 35%;">Código Requerimiento</td>',
                '            <td style="padding: 12px; color: #333333;">REQ-', NEW.requerimiento_id, '</td>',
                '          </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Descripción Item</td>',
                '            <td style="padding: 12px; color: #333333;">', COALESCE(NEW.descripcion, 'Sin descripción'), '</td>',
                '          </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Cantidad Solicitada</td>',
                '            <td style="padding: 12px; color: #333333; font-weight: bold;">', COALESCE(NEW.cantidad, 0), '</td>',
                '          </tr>',
                '        </tbody>',
                '      </table>',
                '      <div style="text-align: center; margin-top: 30px;">',
                '        <p style="font-size: 14px; color: #777777; margin-bottom: 15px;">Por favor, ingrese al sistema para validar o emitir observaciones.</p>',
                '      </div>',
                '    </div>',
                '    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;">',
                '      <p style="margin: 0; font-weight: bold; color: #800020;">Sistema de Gestión CETURGH</p>',
                '      <p style="margin: 5px 0 0 0;">Este es un mensaje automático, por favor no responder a este correo.</p>',
                '    </div>',
                '  </div>',
                '</div>'
            )
        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id
        WHERE d.nombre = 'ADMINISTRACION';

    END IF;

    -- =========================================
    -- APROBADO / OBSERVADO / DENEGADO
    -- =========================================

    IF (
        NEW.estado_administracion IN ('APROBADO','OBSERVADO','DENEGADO')
        AND OLD.estado_administracion <> NEW.estado_administracion
    ) THEN

        -- NOTIFICACIONES

        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            item_id,
            requerimiento_id,
            referencia_estado
        )
        SELECT
            u.id,
            'Estado actualizado',
            CONCAT(
                'Su item fue ',
                NEW.estado_administracion
            ),
            'ADMINISTRACION',
            NEW.id,
            NEW.requerimiento_id,
            CONCAT(
                'ADMIN_ESTADO_',
                NEW.estado_administracion,
                '_',
                NEW.id
            )
        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id
        WHERE d.nombre = depto_solicitante;

        -- COLA CORREOS

        INSERT INTO cola_correos
        (
            usuario_id,
            destinatario,
            nombre,
            asunto,
            mensaje
        )
        SELECT
            u.id,
            u.usuario,
            u.nombre,
            CONCAT('Actualización de Estado: ', NEW.estado_administracion),
            CONCAT(
                '<div style="font-family: ''Segoe UI'', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;">',
                '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;">',
                '    <div style="background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;">',
                '      <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Actualización de Requerimiento</h2>',
                '    </div>',
                '    <div style="padding: 30px;">',
                '      <p style="margin-top: 0; font-size: 16px;">Estimado(a) colaborador(a),</p>',
                '      <p style="color: #555555;">Le informamos que la evaluación de su ítem solicitado ha cambiado de estado en el sistema.</p>',
                '      <div style="background-color: #fdfaf2; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;">',
                '        <p style="margin: 0; font-size: 15px; color: #333333;">',
                '          <strong>Nuevo Estado:</strong> ',
                '          <span style="color: #800020; font-weight: bold; text-transform: uppercase;">', NEW.estado_administracion, '</span>',
                '        </p>',
                '      </div>',
                '      <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;">',
                '        <tbody>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555; width: 35%;">Código Requerimiento</td>',
                '            <td style="padding: 12px; color: #333333;">REQ-', NEW.requerimiento_id, '</td>',
                '          </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Descripción Item</td>',
                '            <td style="padding: 12px; color: #333333;">', COALESCE(NEW.descripcion, 'Sin descripción'), '</td>',
                '          </tr>',
                '        </tbody>',
                '      </table>',
                '      <p style="font-size: 14px; color: #777777; text-align: center; margin-top: 25px;">Para mayor información o seguimiento, por favor ingrese a su panel de usuario.</p>',
                '    </div>',
                '    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;">',
                '      <p style="margin: 0; font-weight: bold; color: #800020;">Sistema de Gestión CETURGH</p>',
                '      <p style="margin: 5px 0 0 0;">Este es un mensaje automático, por favor no responder a este correo.</p>',
                '    </div>',
                '  </div>',
                '</div>'
            )
        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id
        WHERE d.nombre = depto_solicitante;

    END IF;

    -- =========================================
    -- TESORERIA PENDIENTE
    -- =========================================

    IF (
        NEW.flujo_estado = 'TESORERIA'
        AND NEW.estado_tesoreria = 'PENDIENTE'
        AND (
            OLD.flujo_estado <> NEW.flujo_estado
            OR OLD.estado_tesoreria <> NEW.estado_tesoreria
        )
    ) THEN

        -- NOTIFICACIONES

        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            item_id,
            requerimiento_id,
            referencia_estado
        )
        SELECT
            u.id,
            'Pago pendiente',
            'Existe un item pendiente de pago',
            'TESORERIA',
            NEW.id,
            NEW.requerimiento_id,
            CONCAT('TESORERIA_', NEW.id)
        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id
        WHERE d.nombre = 'TESORERIA';

        -- COLA CORREOS

        INSERT INTO cola_correos
        (
            usuario_id,
            destinatario,
            nombre,
            asunto,
            mensaje
        )
        SELECT
            u.id,
            u.usuario,
            u.nombre,
            'Comprobante de Pago Pendiente',
            CONCAT(
                '<div style="font-family: ''Segoe UI'', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;">',
                '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;">',
                '    <div style="background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;">',
                '      <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Área de Tesorería</h2>',
                '    </div>',
                '    <div style="padding: 30px;">',
                '      <p style="margin-top: 0; font-size: 16px;">Estimado equipo de <strong>Tesorería</strong>,</p>',
                '      <p style="color: #555555;">Se ha remitido un requerimiento aprobado para la ejecución de su respectivo pago/desembolso.</p>',
                '      <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;">',
                '        <thead>',
                '          <tr style="background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;">',
                '            <th style="padding: 12px; text-align: left; color: #800020; font-weight: bold;">Concepto</th>',
                '            <th style="padding: 12px; text-align: left; color: #800020; font-weight: bold;">Detalle</th>',
                '          </tr>',
                '        </thead>',
                '        <tbody>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555; width: 35%;">Código Requerimiento</td>',
                '            <td style="padding: 12px; color: #333333;">REQ-', NEW.requerimiento_id, '</td>',
                '          </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Descripción Item</td>',
                '            <td style="padding: 12px; color: #333333;">', COALESCE(NEW.descripcion, 'Sin descripción'), '</td>',
                '          </tr>',
                '        </tbody>',
                '      </table>',
                '      <p style="font-size: 14px; color: #777777; text-align: center; margin-top: 25px;">Por favor, proceda según los protocolos financieros del sistema.</p>',
                '    </div>',
                '    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;">',
                '      <p style="margin: 0; font-weight: bold; color: #800020;">Sistema de Gestión CETURGH</p>',
                '      <p style="margin: 5px 0 0 0;">Este es un mensaje automático, por favor no responder a este correo.</p>',
                '    </div>',
                '  </div>',
                '</div>'
            )
        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id
        WHERE d.nombre = 'TESORERIA';

    END IF;

    -- =========================================
    -- PAGADO
    -- =========================================

    IF (
        NEW.estado_tesoreria = 'PAGADO'
        AND OLD.estado_tesoreria <> NEW.estado_tesoreria
    ) THEN

        -- NOTIFICACIONES

        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            item_id,
            requerimiento_id,
            referencia_estado
        )
        SELECT
            u.id,
            'Requerimiento pagado',
            'Su requerimiento fue pagado',
            'TESORERIA',
            NEW.id,
            NEW.requerimiento_id,
            CONCAT('PAGADO_', NEW.id)
        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id
        WHERE d.nombre = depto_solicitante;

        -- COLA CORREOS

        INSERT INTO cola_correos
        (
            usuario_id,
            destinatario,
            nombre,
            asunto,
            mensaje
        )
        SELECT
            u.id,
            u.usuario,
            u.nombre,
            'Confirmación de Pago - Requerimiento',
            CONCAT(
                '<div style="font-family: ''Segoe UI'', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;">',
                '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;">',
                '    <div style="background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;">',
                '      <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Comprobación de Desembolso</h2>',
                '    </div>',
                '    <div style="padding: 30px;">',
                '      <p style="margin-top: 0; font-size: 16px;">Estimado(a) colaborador(a),</p>',
                '      <p style="color: #555555;">Nos complace informarle que el proceso de pago asociado a su requerimiento ha sido **ejecutado con éxito** por Tesorería.</p>',
                '      <div style="background-color: #f2fbf4; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;">',
                '        <p style="margin: 0; font-size: 15px; color: #155724; font-weight: bold;">',
                '          Estado del Proceso: LIQUIDADO / PAGADO',
                '        </p>',
                '      </div>',
                '      <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;">',
                '        <tbody>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555; width: 35%;">Código Requerimiento</td>',
                '            <td style="padding: 12px; color: #333333;">REQ-', NEW.requerimiento_id, '</td>',
                '          </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Descripción Item</td>',
                '            <td style="padding: 12px; color: #333333;">', COALESCE(NEW.descripcion, 'Sin descripción'), '</td>',
                '          </tr>',
                '        </tbody>',
                '      </table>',
                '      <p style="font-size: 14px; color: #777777; text-align: center; margin-top: 25px;">Agradecemos su paciencia durante las etapas del flujo logístico.</p>',
                '    </div>',
                '    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;">',
                '      <p style="margin: 0; font-weight: bold; color: #800020;">Sistema de Gestión CETURGH</p>',
                '      <p style="margin: 5px 0 0 0;">Este es un mensaje automático, por favor no responder a este correo.</p>',
                '    </div>',
                '  </div>',
                '</div>'
            )
        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id
        WHERE d.nombre = depto_solicitante;

    END IF;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `accion` text DEFAULT NULL,
  `referencia_id` int(11) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_caja`
--

CREATE TABLE `movimientos_caja` (
  `id` int(11) NOT NULL,
  `caja_id` int(11) DEFAULT NULL,
  `tipo` enum('APERTURA','RECARGA','GASTO','RENDICION','AJUSTE') DEFAULT NULL,
  `referencia_id` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `ingreso` decimal(10,2) DEFAULT 0.00,
  `salida` decimal(10,2) DEFAULT 0.00,
  `saldo_resultante` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `movimientos_caja`
--

INSERT INTO `movimientos_caja` (`id`, `caja_id`, `tipo`, `referencia_id`, `descripcion`, `ingreso`, `salida`, `saldo_resultante`, `created_at`) VALUES
(1, 1, 'APERTURA', NULL, 'Apertura por solicitud', 1000.00, 0.00, 1000.00, '2026-05-29 15:34:02'),
(2, 1, 'RECARGA', NULL, 'Recarga por solicitud', 10.00, 0.00, 1010.00, '2026-05-29 16:11:58'),
(3, 1, 'RENDICION', 2, 'Rendición aprobada', 0.00, 280.00, 730.00, '2026-05-29 17:18:56'),
(4, 1, 'RENDICION', 3, 'Rendición aprobada', 0.00, 21.00, 709.00, '2026-05-30 16:41:40'),
(5, 2, 'APERTURA', NULL, 'Apertura por solicitud', 1000.00, 0.00, 1000.00, '2026-05-30 17:24:22'),
(6, 3, 'APERTURA', NULL, 'Apertura por solicitud', 500.00, 0.00, 500.00, '2026-05-30 17:49:12'),
(7, 1, 'RECARGA', NULL, 'Recarga por solicitud', 100.00, 0.00, 809.00, '2026-05-30 17:50:08'),
(8, 1, 'RENDICION', 5, 'Rendición aprobada', 0.00, 22.00, 787.00, '2026-05-30 17:54:35'),
(9, 3, 'RENDICION', 6, 'Rendición aprobada', 0.00, 530.00, 0.00, '2026-06-03 13:04:57'),
(10, 3, 'RECARGA', NULL, 'Recarga por solicitud', 1000.00, 0.00, 1000.00, '2026-06-03 13:09:02'),
(11, 3, 'RENDICION', 8, 'Rendición aprobada', 0.00, 4434.00, 0.00, '2026-06-04 13:24:43'),
(12, 3, 'RECARGA', NULL, 'Recarga por solicitud', 1000.00, 0.00, 1000.00, '2026-06-04 13:25:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_stock`
--

CREATE TABLE `movimientos_stock` (
  `id` int(11) NOT NULL,
  `articulo_id` int(11) DEFAULT NULL,
  `tipo` enum('ENTRADA','SALIDA') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `leido` tinyint(1) DEFAULT 0,
  `item_id` int(11) DEFAULT NULL,
  `requerimiento_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `referencia_estado` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `usuario_id`, `titulo`, `mensaje`, `tipo`, `leido`, `item_id`, `requerimiento_id`, `created_at`, `referencia_estado`) VALUES
(1, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 150, 134, '2026-05-14 20:08:10', 'ADMIN_150'),
(2, 8, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 150, 134, '2026-05-14 20:08:10', 'ADMIN_150'),
(4, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 150, 134, '2026-05-14 20:15:13', 'TESORERIA_150'),
(5, 8, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 151, 135, '2026-05-14 20:18:34', 'ADMIN_151'),
(6, 8, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 151, 135, '2026-05-14 20:18:50', 'ADMIN_ESTADO_APROBADO_151'),
(7, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 151, 135, '2026-05-14 20:18:50', 'TESORERIA_151'),
(8, 8, 'Requerimiento pagado', 'Su requerimiento fue pagado', 'TESORERIA', 1, 151, 135, '2026-05-14 20:18:58', 'PAGADO_151'),
(9, 8, 'Requerimiento pagado', 'Su requerimiento fue pagado', 'TESORERIA', 1, 149, 133, '2026-05-14 20:20:26', 'PAGADO_149'),
(10, 8, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 152, 136, '2026-05-15 14:51:37', 'ADMIN_152'),
(11, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 152, 136, '2026-05-15 14:52:04', 'ADMIN_ESTADO_APROBADO_152'),
(12, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 152, 136, '2026-05-15 14:52:04', 'TESORERIA_152'),
(13, 8, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 153, 137, '2026-05-15 15:45:05', 'ADMIN_153'),
(14, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 153, 137, '2026-05-15 15:45:18', 'ADMIN_ESTADO_APROBADO_153'),
(15, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 153, 137, '2026-05-15 15:45:18', 'TESORERIA_153'),
(16, 4, 'Requerimiento pagado', 'Su requerimiento fue pagado', 'TESORERIA', 1, 153, 137, '2026-05-15 15:51:16', 'PAGADO_153'),
(17, 8, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 154, 138, '2026-05-15 16:55:19', 'ADMIN_154'),
(18, 8, 'Pendiente aprobación', 'El requerimiento REQ-139 requiere aprobación', 'ADMINISTRACION', 1, 155, 139, '2026-05-15 17:05:49', 'ADMIN_155'),
(19, 4, 'Estado actualizado', 'El item LAPICEROS fue APROBADO', 'ADMINISTRACION', 1, 155, 139, '2026-05-15 17:06:12', 'ADMIN_ESTADO_APROBADO_155'),
(20, 12, 'Pago pendiente', 'El requerimiento REQ-139 tiene un pago pendiente', 'TESORERIA', 1, 155, 139, '2026-05-15 17:06:12', 'TESORERIA_155'),
(21, 4, 'Requerimiento pagado', 'El requerimiento REQ-139 fue pagado', 'TESORERIA', 1, 155, 139, '2026-05-15 17:06:46', 'PAGADO_155'),
(22, 8, 'Pendiente aprobación', 'El requerimiento REQ-140 requiere aprobación', 'ADMINISTRACION', 1, 156, 140, '2026-05-15 17:08:22', 'ADMIN_156'),
(23, 4, 'Estado actualizado', 'El item PAPEL DINA A4 fue APROBADO', 'ADMINISTRACION', 1, 156, 140, '2026-05-15 17:08:56', 'ADMIN_ESTADO_APROBADO_156'),
(24, 12, 'Pago pendiente', 'El requerimiento REQ-140 tiene un pago pendiente', 'TESORERIA', 1, 156, 140, '2026-05-15 17:08:56', 'TESORERIA_156'),
(25, 4, 'Requerimiento pagado', 'El requerimiento REQ-140 fue pagado', 'TESORERIA', 1, 156, 140, '2026-05-15 17:09:04', 'PAGADO_156'),
(26, 8, 'Requerimiento pagado', 'El requerimiento REQ-133 fue pagado', 'TESORERIA', 1, 147, 133, '2026-05-15 17:09:06', 'PAGADO_147'),
(27, 8, 'Requerimiento pagado', 'El requerimiento REQ-133 fue pagado', 'TESORERIA', 1, 148, 133, '2026-05-15 17:09:06', 'PAGADO_148'),
(28, 8, 'Pendiente aprobación', 'El requerimiento REQ-141 requiere aprobación', 'ADMINISTRACION', 1, 157, 141, '2026-05-15 17:15:08', 'ADMIN_157'),
(29, 4, 'Estado actualizado', 'El item JABON LIQUIDO fue APROBADO', 'ADMINISTRACION', 1, 157, 141, '2026-05-15 17:15:31', 'ADMIN_ESTADO_APROBADO_157'),
(30, 12, 'Pago pendiente', 'El requerimiento REQ-141 tiene un pago pendiente', 'TESORERIA', 1, 157, 141, '2026-05-15 17:15:31', 'TESORERIA_157'),
(31, 4, 'Requerimiento pagado', 'El requerimiento REQ-141 fue pagado', 'TESORERIA', 1, 157, 141, '2026-05-15 17:16:41', 'PAGADO_157'),
(32, 8, 'Pendiente aprobación', 'El requerimiento REQ-143 requiere aprobación', 'ADMINISTRACION', 1, 159, 143, '2026-05-15 17:20:23', 'ADMIN_159'),
(33, 4, 'Estado actualizado', 'El item CORRECTOR fue APROBADO', 'ADMINISTRACION', 1, 159, 143, '2026-05-15 17:21:05', 'ADMIN_ESTADO_APROBADO_159'),
(34, 12, 'Pago pendiente', 'El requerimiento REQ-143 tiene un pago pendiente', 'TESORERIA', 1, 159, 143, '2026-05-15 17:21:05', 'TESORERIA_159'),
(35, 8, 'Pendiente aprobación', 'El requerimiento REQ-144 requiere aprobación', 'ADMINISTRACION', 1, 160, 144, '2026-05-15 17:27:56', 'ADMIN_160'),
(36, 4, 'Estado actualizado', 'El item LIMPIA TODO fue APROBADO', 'ADMINISTRACION', 1, 160, 144, '2026-05-15 17:28:13', 'ADMIN_ESTADO_APROBADO_160'),
(37, 12, 'Pago pendiente', 'El requerimiento REQ-144 tiene un pago pendiente', 'TESORERIA', 1, 160, 144, '2026-05-15 17:28:13', 'TESORERIA_160'),
(38, 8, 'Pendiente aprobación', 'El requerimiento REQ-145 requiere aprobación', 'ADMINISTRACION', 1, 161, 145, '2026-05-15 17:40:04', 'ADMIN_161'),
(39, 4, 'Estado actualizado', 'El item JABON LIQUIDO fue APROBADO', 'ADMINISTRACION', 1, 161, 145, '2026-05-15 17:40:25', 'ADMIN_ESTADO_APROBADO_161'),
(40, 12, 'Pago pendiente', 'El requerimiento REQ-145 tiene un pago pendiente', 'TESORERIA', 1, 161, 145, '2026-05-15 17:40:25', 'TESORERIA_161'),
(41, 8, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 162, 146, '2026-05-15 19:16:31', 'ADMIN_162'),
(42, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 162, 146, '2026-05-15 19:16:55', 'ADMIN_ESTADO_APROBADO_162'),
(43, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 162, 146, '2026-05-15 19:16:55', 'TESORERIA_162'),
(44, 8, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 163, 147, '2026-05-15 19:20:15', 'ADMIN_163'),
(45, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 163, 147, '2026-05-15 19:20:23', 'ADMIN_ESTADO_APROBADO_163'),
(46, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 163, 147, '2026-05-15 19:20:23', 'TESORERIA_163'),
(47, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 154, 138, '2026-05-15 19:37:20', 'ADMIN_ESTADO_APROBADO_154'),
(48, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 154, 138, '2026-05-15 19:37:20', 'TESORERIA_154'),
(49, 4, 'Requerimiento pagado', 'Su requerimiento fue pagado', 'TESORERIA', 1, 160, 144, '2026-05-15 19:37:39', 'PAGADO_160'),
(50, 4, 'Requerimiento pagado', 'Su requerimiento fue pagado', 'TESORERIA', 1, 152, 136, '2026-05-15 19:37:42', 'PAGADO_152'),
(51, 4, 'Requerimiento pagado', 'Su requerimiento fue pagado', 'TESORERIA', 1, 154, 138, '2026-05-15 19:37:44', 'PAGADO_154'),
(52, 8, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 164, 148, '2026-05-15 19:55:48', 'ADMIN_164'),
(53, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 164, 148, '2026-05-15 19:55:56', 'ADMIN_ESTADO_APROBADO_164'),
(54, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 164, 148, '2026-05-15 19:55:56', 'TESORERIA_164'),
(55, 4, 'Requerimiento pagado', 'Su requerimiento fue pagado', 'TESORERIA', 1, 164, 148, '2026-05-15 19:56:09', 'PAGADO_164'),
(56, 4, 'Requerimiento pagado', 'Su requerimiento fue pagado', 'TESORERIA', 1, 163, 147, '2026-05-15 20:00:16', 'PAGADO_163'),
(57, 8, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 167, 151, '2026-05-15 20:20:52', 'ADMIN_167'),
(58, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 167, 151, '2026-05-15 20:21:19', 'ADMIN_ESTADO_APROBADO_167'),
(59, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 167, 151, '2026-05-15 20:21:19', 'TESORERIA_167'),
(60, 4, 'Requerimiento pagado', 'Su requerimiento fue pagado', 'TESORERIA', 1, 167, 151, '2026-05-15 20:21:59', 'PAGADO_167'),
(61, 8, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 170, 154, '2026-05-15 20:39:33', 'ADMIN_170'),
(62, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 170, 154, '2026-05-15 20:39:49', 'ADMIN_ESTADO_APROBADO_170'),
(63, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 170, 154, '2026-05-15 20:39:49', 'TESORERIA_170'),
(64, 4, 'Requerimiento pagado', 'Su requerimiento fue pagado', 'TESORERIA', 1, 170, 154, '2026-05-15 20:39:53', 'PAGADO_170'),
(65, 8, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 171, 155, '2026-05-15 20:46:48', 'ADMIN_171'),
(66, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 171, 155, '2026-05-15 20:46:54', 'ADMIN_ESTADO_APROBADO_171'),
(67, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 171, 155, '2026-05-15 20:46:54', 'TESORERIA_171'),
(68, 8, 'Movilidad pendiente', 'Existe una movilidad pendiente del área TIC', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 02:28:47', 'MOV_PEND_33'),
(69, 12, 'Movilidad aprobada', 'Existe una movilidad pendiente de pago del área TIC', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 02:29:20', 'MOV_APROB_33'),
(70, 4, 'Movilidad aprobada', 'Su movilidad MOV-00033 fue aprobada', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 02:29:20', 'MOV_USER_APROB_33'),
(71, 4, 'Movilidad pagada', 'La movilidad MOV-00033 fue pagada correctamente', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 02:29:47', 'MOV_PAGADO_33'),
(72, 8, 'Movilidad pendiente', 'Existe una movilidad pendiente del área ADMINISTRACION', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 02:44:48', 'MOV_PEND_34'),
(73, 12, 'Movilidad aprobada', 'Existe una movilidad pendiente de pago del área ADMINISTRACION', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 02:44:52', 'MOV_APROB_34'),
(74, 8, 'Movilidad aprobada', 'Su movilidad MOV-00034 fue aprobada', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 02:44:52', 'MOV_USER_APROB_34'),
(75, 8, 'Movilidad pendiente', 'Existe una movilidad pendiente del área TESORERIA', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 03:09:15', 'MOV_PEND_35'),
(76, 12, 'Movilidad aprobada', 'Existe una movilidad pendiente de pago del área TESORERIA', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 03:09:40', 'MOV_APROB_35'),
(77, 12, 'Movilidad aprobada', 'Su movilidad MOV-00035 fue aprobada', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 03:09:40', 'MOV_USER_APROB_35'),
(78, 12, 'Movilidad pagada', 'La movilidad MOV-00035 fue pagada correctamente', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 03:13:29', 'MOV_PAGADO_35'),
(79, 8, 'Movilidad pendiente', 'Existe una movilidad pendiente del área ADMINISTRACION', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 03:16:00', 'MOV_PEND_36'),
(80, 12, 'Movilidad aprobada', 'Existe una movilidad pendiente de pago del área ADMINISTRACION', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 03:16:04', 'MOV_APROB_36'),
(81, 8, 'Movilidad aprobada', 'Su movilidad MOV-00036 fue aprobada', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 03:16:04', 'MOV_USER_APROB_36'),
(82, 8, 'Movilidad pagada', 'La movilidad MOV-00036 fue pagada correctamente', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 03:16:29', 'MOV_PAGADO_36'),
(83, 8, 'Movilidad pendiente', 'Existe una movilidad pendiente del área TESORERIA', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 03:19:28', 'MOV_PEND_37'),
(84, 8, 'Movilidad pendiente', 'Existe una movilidad pendiente del área TESORERIA', 'MOVILIDAD', 1, NULL, NULL, '2026-05-16 03:22:01', 'MOV_PEND_38'),
(85, 12, 'Movilidad pendiente', 'Existe una movilidad pendiente del área TESORERIA', 'MOVILIDAD', 1, NULL, NULL, '2026-05-18 14:46:22', 'MOV_PEND_39'),
(86, 4, 'Requerimiento pagado', 'Su requerimiento fue pagado', 'TESORERIA', 1, 171, 155, '2026-05-18 14:51:37', 'PAGADO_171'),
(87, 8, 'Movilidad aprobada', 'Su movilidad MOV-00039 fue aprobada', 'MOVILIDAD', 1, NULL, NULL, '2026-05-18 15:02:55', 'MOV_USER_APROB_39'),
(88, 8, 'Movilidad pagada', 'La movilidad MOV-00039 fue pagada correctamente', 'MOVILIDAD', 1, NULL, NULL, '2026-05-18 15:03:39', 'MOV_PAGADO_39'),
(89, 12, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 175, 158, '2026-05-19 13:25:24', 'ADMIN_175'),
(90, 12, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 175, 158, '2026-05-19 13:25:32', 'ADMIN_ESTADO_APROBADO_175'),
(91, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 174, 157, '2026-05-19 14:56:54', 'ADMIN_174'),
(92, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 173, 157, '2026-05-19 14:56:54', 'ADMIN_173'),
(93, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 172, 156, '2026-05-19 14:56:54', 'ADMIN_172'),
(94, 12, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 172, 156, '2026-05-19 14:57:06', 'ADMIN_ESTADO_APROBADO_172'),
(95, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 172, 156, '2026-05-19 14:57:06', 'TESORERIA_172'),
(96, 12, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 174, 157, '2026-05-19 14:57:08', 'ADMIN_ESTADO_APROBADO_174'),
(97, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 174, 157, '2026-05-19 14:57:08', 'TESORERIA_174'),
(98, 12, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 173, 157, '2026-05-19 14:57:08', 'ADMIN_ESTADO_APROBADO_173'),
(99, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 173, 157, '2026-05-19 14:57:08', 'TESORERIA_173'),
(100, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 169, 153, '2026-05-19 15:07:36', 'ADMIN_169'),
(101, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 166, 150, '2026-05-19 15:07:36', 'ADMIN_166'),
(102, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 158, 142, '2026-05-19 15:07:36', 'ADMIN_158'),
(103, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 166, 150, '2026-05-19 15:07:43', 'ADMIN_ESTADO_APROBADO_166'),
(104, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 166, 150, '2026-05-19 15:07:43', 'TESORERIA_166'),
(105, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 169, 153, '2026-05-19 15:07:45', 'ADMIN_ESTADO_APROBADO_169'),
(106, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 169, 153, '2026-05-19 15:07:45', 'TESORERIA_169'),
(107, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 158, 142, '2026-05-19 15:07:47', 'ADMIN_ESTADO_APROBADO_158'),
(108, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 158, 142, '2026-05-19 15:07:47', 'TESORERIA_158'),
(109, 4, 'Movilidad pendiente', 'Existe una movilidad pendiente del área TIC', 'MOVILIDAD', 1, NULL, NULL, '2026-05-20 10:38:36', 'MOV_PEND_40'),
(110, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 177, 160, '2026-05-20 20:03:21', 'ADMIN_177'),
(111, 12, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 177, 160, '2026-05-20 20:03:34', 'ADMIN_ESTADO_APROBADO_177'),
(112, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 177, 160, '2026-05-20 20:03:34', 'TESORERIA_177'),
(113, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 178, 161, '2026-05-21 06:06:17', 'ADMIN_178'),
(114, 12, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 178, 161, '2026-05-21 06:06:44', 'ADMIN_ESTADO_APROBADO_178'),
(115, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 178, 161, '2026-05-21 06:06:44', 'TESORERIA_178'),
(116, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 179, 162, '2026-05-21 07:00:36', 'ADMIN_179'),
(117, 12, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 179, 162, '2026-05-21 07:00:50', 'ADMIN_ESTADO_APROBADO_179'),
(118, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 179, 162, '2026-05-21 07:00:50', 'TESORERIA_179'),
(119, 12, 'Requerimiento pagado', 'Su requerimiento fue pagado', 'TESORERIA', 1, 179, 162, '2026-05-21 07:46:58', 'PAGADO_179'),
(120, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 180, 163, '2026-05-21 09:08:15', 'ADMIN_180'),
(121, 12, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 180, 163, '2026-05-21 09:08:29', 'ADMIN_ESTADO_APROBADO_180'),
(122, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 180, 163, '2026-05-21 09:08:29', 'TESORERIA_180'),
(123, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 176, 159, '2026-05-21 16:24:32', 'ADMIN_176'),
(124, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 165, 149, '2026-05-21 16:25:13', 'ADMIN_165'),
(125, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 181, 164, '2026-05-21 16:26:07', 'ADMIN_181'),
(126, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 183, 165, '2026-05-21 16:44:00', 'ADMIN_183'),
(127, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 182, 165, '2026-05-21 16:44:03', 'ADMIN_182'),
(128, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 183, 165, '2026-05-21 16:44:36', 'ADMIN_ESTADO_APROBADO_183'),
(129, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 183, 165, '2026-05-21 16:44:36', 'TESORERIA_183'),
(130, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 182, 165, '2026-05-21 16:44:37', 'ADMIN_ESTADO_APROBADO_182'),
(131, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 182, 165, '2026-05-21 16:44:37', 'TESORERIA_182'),
(132, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 185, 166, '2026-05-21 16:54:17', 'ADMIN_185'),
(133, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 184, 166, '2026-05-21 16:54:22', 'ADMIN_184'),
(134, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 185, 166, '2026-05-21 16:54:34', 'ADMIN_ESTADO_APROBADO_185'),
(135, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 185, 166, '2026-05-21 16:54:34', 'TESORERIA_185'),
(136, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 184, 166, '2026-05-21 16:54:34', 'ADMIN_ESTADO_APROBADO_184'),
(137, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 184, 166, '2026-05-21 16:54:34', 'TESORERIA_184'),
(138, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 187, 167, '2026-05-21 17:01:21', 'ADMIN_187'),
(139, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 186, 167, '2026-05-21 17:01:31', 'ADMIN_186'),
(140, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 187, 167, '2026-05-21 17:01:47', 'ADMIN_ESTADO_APROBADO_187'),
(141, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 187, 167, '2026-05-21 17:01:47', 'TESORERIA_187'),
(142, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 186, 167, '2026-05-21 17:01:48', 'ADMIN_ESTADO_APROBADO_186'),
(143, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 186, 167, '2026-05-21 17:01:48', 'TESORERIA_186'),
(144, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 181, 164, '2026-05-21 18:27:16', 'ADMIN_ESTADO_APROBADO_181'),
(145, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 181, 164, '2026-05-21 18:27:16', 'TESORERIA_181'),
(146, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 194, 174, '2026-05-28 08:11:54', 'ADMIN_194'),
(147, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 198, 177, '2026-05-28 08:15:57', 'ADMIN_198'),
(148, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 196, 176, '2026-05-28 08:23:35', 'ADMIN_196'),
(149, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 198, 177, '2026-05-28 08:36:57', 'ADMIN_198'),
(150, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 195, 175, '2026-05-28 08:38:18', 'ADMIN_195'),
(151, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 193, 173, '2026-05-28 08:47:36', 'ADMIN_193'),
(152, 12, 'Movilidad aprobada', 'Existe una movilidad pendiente de pago del área TESORERIA', 'MOVILIDAD', 1, NULL, NULL, '2026-05-28 08:52:55', 'MOV_APROB_37'),
(153, 12, 'Movilidad aprobada', 'Su movilidad MOV-00037 fue aprobada', 'MOVILIDAD', 1, NULL, NULL, '2026-05-28 08:52:55', 'MOV_USER_APROB_37'),
(154, 12, 'Movilidad pagada', 'La movilidad MOV-00037 fue pagada correctamente', 'MOVILIDAD', 1, NULL, NULL, '2026-05-28 08:53:21', 'MOV_PAGADO_37'),
(155, 8, 'Movilidad pagada', 'La movilidad MOV-00034 fue pagada correctamente', 'MOVILIDAD', 1, NULL, NULL, '2026-05-28 08:53:37', 'MOV_PAGADO_34'),
(156, 4, 'Movilidad pendiente', 'Existe una movilidad pendiente del área TESORERIA', 'MOVILIDAD', 1, NULL, NULL, '2026-05-28 08:53:59', 'MOV_PEND_41'),
(157, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 199, 178, '2026-05-28 08:56:59', 'ADMIN_199'),
(158, 12, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 199, 178, '2026-05-28 08:57:52', 'ADMIN_ESTADO_APROBADO_199'),
(159, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 199, 178, '2026-05-28 08:57:52', 'TESORERIA_199'),
(160, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 195, 175, '2026-05-28 08:57:54', 'ADMIN_ESTADO_APROBADO_195'),
(161, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 195, 175, '2026-05-28 08:57:54', 'TESORERIA_195'),
(162, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 198, 177, '2026-05-28 08:57:55', 'ADMIN_ESTADO_APROBADO_198'),
(163, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 198, 177, '2026-05-28 08:57:55', 'TESORERIA_198'),
(164, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 193, 173, '2026-05-28 08:57:59', 'ADMIN_ESTADO_APROBADO_193'),
(165, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 193, 173, '2026-05-28 08:57:59', 'TESORERIA_193'),
(166, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 201, 180, '2026-05-28 09:04:23', 'ADMIN_201'),
(167, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 201, 180, '2026-05-28 09:04:58', 'ADMIN_ESTADO_APROBADO_201'),
(168, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 201, 180, '2026-05-28 09:04:58', 'TESORERIA_201'),
(169, 4, 'Requerimiento pagado', 'Su requerimiento fue pagado', 'TESORERIA', 1, 201, 180, '2026-05-28 09:05:12', 'PAGADO_201'),
(170, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 202, 181, '2026-05-28 14:10:09', 'ADMIN_202'),
(171, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 200, 179, '2026-05-28 14:10:20', 'ADMIN_200'),
(172, 12, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 200, 179, '2026-05-28 14:13:50', 'ADMIN_ESTADO_APROBADO_200'),
(173, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 200, 179, '2026-05-28 14:13:50', 'TESORERIA_200'),
(174, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 202, 181, '2026-05-28 14:13:52', 'ADMIN_ESTADO_APROBADO_202'),
(175, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 202, 181, '2026-05-28 14:13:52', 'TESORERIA_202'),
(176, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 196, 176, '2026-05-28 15:28:06', 'ADMIN_196'),
(177, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 196, 176, '2026-05-28 15:31:14', 'ADMIN_196'),
(178, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 196, 176, '2026-05-28 15:31:29', 'ADMIN_ESTADO_APROBADO_196'),
(179, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 196, 176, '2026-05-28 15:31:29', 'TESORERIA_196'),
(180, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 197, 171, '2026-05-28 15:32:53', 'ADMIN_197'),
(181, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 196, 176, '2026-05-28 15:35:47', 'ADMIN_196'),
(182, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 196, 176, '2026-05-28 15:36:08', 'ADMIN_ESTADO_APROBADO_196'),
(183, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 196, 176, '2026-05-28 15:36:08', 'TESORERIA_196'),
(184, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 194, 174, '2026-05-28 15:47:45', 'ADMIN_194'),
(185, 8, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 194, 174, '2026-05-28 15:48:33', 'ADMIN_ESTADO_APROBADO_194'),
(186, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 194, 174, '2026-05-28 15:48:33', 'TESORERIA_194'),
(187, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 197, 171, '2026-05-28 15:51:19', 'ADMIN_197'),
(188, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 197, 171, '2026-05-28 15:51:34', 'ADMIN_ESTADO_APROBADO_197'),
(189, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 197, 171, '2026-05-28 15:51:34', 'TESORERIA_197'),
(190, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 192, 172, '2026-05-28 15:59:31', 'ADMIN_192'),
(191, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 191, 171, '2026-05-28 16:00:01', 'ADMIN_191'),
(192, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 1, 190, 170, '2026-05-28 16:00:36', 'ADMIN_190'),
(193, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 190, 170, '2026-05-28 16:00:58', 'ADMIN_ESTADO_APROBADO_190'),
(194, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 190, 170, '2026-05-28 16:00:58', 'TESORERIA_190'),
(195, 4, 'Estado actualizado', 'Su item fue APROBADO', 'ADMINISTRACION', 1, 192, 172, '2026-05-28 16:00:59', 'ADMIN_ESTADO_APROBADO_192'),
(196, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 1, 192, 172, '2026-05-28 16:00:59', 'TESORERIA_192'),
(197, 4, 'Solicitud firmada', 'La solicitud FND-00008 está pendiente de aprobación', 'FONDOS_APROBAR', 1, NULL, 81, '2026-05-28 19:03:33', 'APROBAR_81'),
(198, 12, 'Solicitud aprobada - Pendiente de pago', 'La solicitud FND-00008 está aprobada y espera pago de tesorería', 'FONDOS_PAGAR', 1, NULL, 81, '2026-05-28 19:03:35', 'PAGAR_81'),
(199, 8, 'Proceso finalizado', 'La solicitud FND-00007 ha sido cerrada exitosamente.', 'FONDOS_CERRADO', 1, NULL, 78, '2026-05-28 19:03:51', 'CERRADO_78'),
(200, 4, 'Pago registrado - Pendiente de rendición', 'El pago de su solicitud FND-00008 ha sido registrado. Debe presentar la rendición de gastos.', 'FONDOS_RENDIR', 1, NULL, 81, '2026-05-28 19:04:00', 'RENDIR_81'),
(201, 4, 'Nueva solicitud de fondos', 'La solicitud FND-00009 - csfcsdcdscdsdcs requiere su firma', 'FONDOS_FIRMA', 0, NULL, 82, '2026-06-04 14:09:06', 'FIRMA_82'),
(202, 4, 'Solicitud firmada', 'La solicitud FND-00011 está pendiente de aprobación', 'FONDOS_APROBAR', 0, NULL, 84, '2026-06-05 14:53:09', 'APROBAR_84'),
(203, 4, 'Solicitud firmada', 'La solicitud FND-00010 está pendiente de aprobación', 'FONDOS_APROBAR', 0, NULL, 83, '2026-06-05 15:44:20', 'APROBAR_83'),
(204, 12, 'Solicitud aprobada - Pendiente de pago', 'La solicitud FND-00010 está aprobada y espera pago de tesorería', 'FONDOS_PAGAR', 0, NULL, 83, '2026-06-05 15:44:24', 'PAGAR_83'),
(205, 4, 'Solicitud firmada', 'La solicitud FND-00009 está pendiente de aprobación', 'FONDOS_APROBAR', 0, NULL, 82, '2026-06-05 15:44:30', 'APROBAR_82'),
(206, 12, 'Solicitud aprobada - Pendiente de pago', 'La solicitud FND-00009 está aprobada y espera pago de tesorería', 'FONDOS_PAGAR', 0, NULL, 82, '2026-06-05 15:44:32', 'PAGAR_82'),
(207, 8, 'Proceso finalizado', 'La solicitud FND-00011 ha sido cerrada exitosamente.', 'FONDOS_CERRADO', 1, NULL, 84, '2026-06-05 15:44:55', 'CERRADO_84'),
(208, 8, 'Nueva solicitud de fondos', 'La solicitud FND-00012 - csacascascas requiere su firma', 'FONDOS_FIRMA', 1, NULL, 85, '2026-06-05 15:47:54', 'FIRMA_85'),
(209, 4, 'Solicitud firmada', 'La solicitud FND-00012 está pendiente de aprobación', 'FONDOS_APROBAR', 0, NULL, 85, '2026-06-05 15:47:57', 'APROBAR_85'),
(210, 8, 'Proceso finalizado', 'La solicitud FND-00012 ha sido cerrada exitosamente.', 'FONDOS_CERRADO', 1, NULL, 85, '2026-06-05 15:49:14', 'CERRADO_85'),
(211, 4, 'Nueva solicitud de fondos', 'La solicitud FND-00013 - ccascas requiere su firma', 'FONDOS_FIRMA', 0, NULL, 86, '2026-06-05 15:49:53', 'FIRMA_86'),
(212, 4, 'Solicitud firmada', 'La solicitud FND-00013 está pendiente de aprobación', 'FONDOS_APROBAR', 0, NULL, 86, '2026-06-05 15:49:59', 'APROBAR_86'),
(213, 12, 'Solicitud aprobada - Pendiente de pago', 'La solicitud FND-00013 está aprobada y espera pago de tesorería', 'FONDOS_PAGAR', 0, NULL, 86, '2026-06-05 15:50:02', 'PAGAR_86'),
(214, 8, 'Pago registrado - Pendiente de rendición', 'El pago de su solicitud FND-00013 ha sido registrado. Debe presentar la rendición de gastos.', 'FONDOS_RENDIR', 1, NULL, 86, '2026-06-05 15:50:20', 'RENDIR_86'),
(215, 8, 'Proceso finalizado', 'La solicitud FND-00013 ha sido cerrada exitosamente.', 'FONDOS_CERRADO', 1, NULL, 86, '2026-06-05 15:50:43', 'CERRADO_86'),
(216, 4, 'Movilidad pendiente', 'Existe una movilidad pendiente del área TIC TAC', 'MOVILIDAD', 0, NULL, NULL, '2026-06-05 16:09:05', 'MOV_PEND_42'),
(217, 12, 'Movilidad aprobada', 'Existe una movilidad pendiente de pago del área TIC TAC', 'MOVILIDAD', 0, NULL, NULL, '2026-06-05 16:09:20', 'MOV_APROB_42'),
(218, 8, 'Movilidad aprobada', 'Su movilidad MOV-00042 fue aprobada', 'MOVILIDAD', 1, NULL, NULL, '2026-06-05 16:09:20', 'MOV_USER_APROB_42'),
(222, 4, 'Solicitud firmada', 'La solicitud FND-00014 está pendiente de aprobación', 'FONDOS_APROBAR', 0, NULL, 87, '2026-06-05 16:29:38', 'APROBAR_87'),
(223, 4, 'Pendiente aprobación', 'Existe un item pendiente en administración', 'ADMINISTRACION', 0, 206, 185, '2026-06-05 16:31:00', 'ADMIN_206'),
(224, 12, 'Pago pendiente', 'Existe un item pendiente de pago', 'TESORERIA', 0, 206, 185, '2026-06-05 16:31:12', 'TESORERIA_206'),
(225, 8, 'Proceso finalizado', 'La solicitud FND-00014 ha sido cerrada exitosamente.', 'FONDOS_CERRADO', 1, NULL, 87, '2026-06-05 16:32:00', 'CERRADO_87'),
(226, 8, 'Movilidad pagada', 'La movilidad MOV-00042 fue pagada correctamente', 'MOVILIDAD', 1, NULL, NULL, '2026-06-05 16:44:02', 'MOV_PAGADO_42'),
(227, 4, 'Movilidad pendiente', 'Existe una movilidad pendiente del área TIC', 'MOVILIDAD', 0, NULL, NULL, '2026-06-05 19:06:52', 'MOV_PEND_46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes_compra`
--

CREATE TABLE `ordenes_compra` (
  `id` int(11) NOT NULL,
  `numero` varchar(50) DEFAULT NULL,
  `proveedor_id` int(11) DEFAULT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT 0.00,
  `igv` decimal(10,2) DEFAULT 0.00,
  `modo_igv` enum('incluido','agregado') DEFAULT 'incluido',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `condiciones` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `grupo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `ordenes_compra`
--

INSERT INTO `ordenes_compra` (`id`, `numero`, `proveedor_id`, `empresa_id`, `sede_id`, `fecha`, `total`, `subtotal`, `igv`, `modo_igv`, `created_at`, `condiciones`, `observaciones`, `grupo_id`) VALUES
(121, 'OC-2026-000025', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 14:29:58', NULL, NULL, NULL),
(122, 'OC-2026-000026', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 14:31:54', NULL, NULL, NULL),
(123, 'OC-2026-000027', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 14:34:45', NULL, NULL, NULL),
(124, 'OC-2026-000028', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 14:35:23', NULL, NULL, NULL),
(125, 'OC-2026-000029', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 14:35:32', NULL, NULL, NULL),
(126, 'OC-2026-000030', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 14:39:20', NULL, NULL, NULL),
(127, 'OC-2026-000031', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 14:40:06', NULL, NULL, NULL),
(128, 'OC-2026-000032', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 14:42:41', '', '', NULL),
(129, 'OC-2026-000033', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 14:47:38', '', '', NULL),
(130, 'OC-2026-000034', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 14:47:46', '', '', NULL),
(131, 'OC-2026-000035', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 14:48:07', '', '', NULL),
(132, 'OC-2026-000036', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 14:48:14', '', '', NULL),
(133, 'OC-2026-000037', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 14:48:25', NULL, NULL, NULL),
(134, 'OC-2026-000038', 1, 1, 1, '2026-05-19', 10.00, 0.00, 0.00, 'incluido', '2026-05-19 14:59:37', NULL, NULL, 57),
(135, 'OC-2026-000039', 1, 2, 3, '2026-05-19', 40.00, 0.00, 0.00, 'incluido', '2026-05-19 15:00:05', '', '', 56),
(136, 'OC-2026-000040', 4, 1, 1, '2026-05-19', 0.00, 0.00, 0.00, 'incluido', '2026-05-19 15:44:08', '', '', 58),
(137, 'OC-2026-000041', 1, 1, 1, '2026-05-20', 12.00, 0.00, 0.00, 'incluido', '2026-05-20 20:04:09', NULL, NULL, 59),
(138, 'OC-2026-000042', 1, 1, 1, '2026-05-21', 0.00, 0.00, 0.00, 'incluido', '2026-05-21 06:06:49', 'nnuj', '', 60),
(139, 'OS-2026-000001', 22, 1, 1, '2026-05-21', 177.00, 150.00, 27.00, 'agregado', '2026-05-21 07:01:09', '', '', 61),
(140, 'OC-2026-000043', 32, 1, 2, '2026-05-21', 10.00, 8.47, 1.53, 'incluido', '2026-05-21 09:08:36', '', '', 62),
(141, 'OC-2026-000044', 1, 1, 1, '2026-05-21', 40.00, 33.90, 6.10, 'incluido', '2026-05-21 17:02:56', NULL, NULL, 71),
(142, 'OC-2026-000045', 10, 1, 1, '2026-05-21', 10.00, 8.47, 1.53, 'incluido', '2026-05-21 18:24:54', NULL, NULL, 67),
(143, 'OC-2026-000046', 1, 2, 3, '2026-05-21', 10.00, 8.47, 1.53, 'incluido', '2026-05-21 18:25:25', NULL, NULL, 55),
(144, 'OC-2026-000047', 5, 1, 1, '2026-05-21', 30.00, 25.42, 4.58, 'incluido', '2026-05-21 18:25:29', NULL, NULL, 68),
(145, 'OC-2026-000048', 8, 1, 1, '2026-05-28', 10.00, 8.47, 1.53, 'incluido', '2026-05-28 14:35:16', NULL, NULL, 80),
(146, 'OC-2026-000049', 18, 1, 1, '2026-05-28', 10.00, 8.47, 1.53, 'incluido', '2026-05-28 14:35:31', NULL, NULL, 81),
(147, 'OC-2026-000050', 24, 1, 1, '2026-05-28', 30.00, 25.42, 4.58, 'incluido', '2026-05-28 15:36:18', NULL, NULL, 90),
(148, 'OC-2026-000051', 1, 1, 1, '2026-05-28', 11.80, 10.00, 1.80, 'incluido', '2026-05-28 15:48:45', NULL, NULL, 91),
(149, 'OC-2026-000052', 37, 2, 3, '2026-06-05', 11.80, 10.00, 1.80, 'incluido', '2026-06-05 16:31:21', NULL, NULL, 96);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_compra_items`
--

CREATE TABLE `orden_compra_items` (
  `id` int(11) NOT NULL,
  `orden_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `cantidad` decimal(12,4) NOT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `tipo` enum('Producto','Servicio') DEFAULT 'Producto',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `centro_costo_id` int(11) DEFAULT NULL,
  `area_costo_id` int(11) DEFAULT NULL,
  `centro_costo_nombre` varchar(150) DEFAULT NULL,
  `area_costo_nombre` varchar(150) DEFAULT NULL,
  `departamento_nombre` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `orden_compra_items`
--

INSERT INTO `orden_compra_items` (`id`, `orden_id`, `item_id`, `descripcion`, `cantidad`, `precio`, `total`, `tipo`, `created_at`, `centro_costo_id`, `area_costo_id`, `centro_costo_nombre`, `area_costo_nombre`, `departamento_nombre`) VALUES
(101, 96, 149, 'LIMPIA TODO', 3.0000, 60.00, 60.00, 'Producto', '2026-05-14 18:49:36', NULL, NULL, '131', '', ''),
(102, 97, 164, 'CINTA SCOTCH', 1.0000, 2.00, 2.00, 'Producto', '2026-05-18 14:52:04', NULL, NULL, '261', '', ''),
(103, 98, NULL, 'Desarrollo Artistico - TECNICO EN COCINA (A)', 20.0000, 25.00, 490.00, 'Producto', '2026-05-18 14:57:07', NULL, NULL, NULL, NULL, NULL),
(104, 99, 168, 'RESALTADOR', 1.0000, 10.00, 10.00, 'Producto', '2026-05-19 13:24:08', NULL, NULL, '132', '', ''),
(105, 100, 175, 'JABON LIQUIDO', 4.0000, 40.00, 40.00, 'Producto', '2026-05-19 13:25:38', NULL, NULL, '1', '', ''),
(106, 101, 175, 'JABON LIQUIDO', 4.0000, 40.00, 40.00, 'Producto', '2026-05-19 13:36:31', NULL, NULL, '1', '', ''),
(107, 102, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 13:47:17', NULL, NULL, '1', '', ''),
(108, 103, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 13:53:26', NULL, NULL, '1', '', ''),
(109, 104, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 13:54:51', NULL, NULL, '1', '', ''),
(110, 105, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:01:05', NULL, NULL, '1', '', ''),
(111, 106, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:04:41', NULL, NULL, '1', '', ''),
(112, 107, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:05:34', NULL, NULL, '1', '', ''),
(113, 108, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:12:29', NULL, NULL, '1', '', ''),
(114, 109, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:13:00', NULL, NULL, '1', '', ''),
(115, 110, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:13:04', NULL, NULL, '1', '', ''),
(116, 111, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:16:28', NULL, NULL, '1', '', ''),
(117, 112, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:18:21', NULL, NULL, '1', '', ''),
(118, 113, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:18:31', NULL, NULL, '1', '', ''),
(119, 114, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:19:06', NULL, NULL, '1', '', ''),
(120, 115, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:20:34', NULL, NULL, '1', '', ''),
(121, 116, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:22:58', NULL, NULL, '1', '', ''),
(122, 117, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:25:50', NULL, NULL, '1', '', ''),
(123, 118, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:26:00', NULL, NULL, '1', '', ''),
(124, 119, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:26:48', NULL, NULL, '1', '', ''),
(125, 120, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:29:51', NULL, NULL, '1', '', ''),
(126, 121, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:29:58', NULL, NULL, '1', '', ''),
(127, 122, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:31:54', NULL, NULL, '1', '', ''),
(128, 123, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:34:45', NULL, NULL, '1', '', ''),
(129, 124, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:35:23', NULL, NULL, '1', '', ''),
(130, 125, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:35:32', NULL, NULL, '1', '', ''),
(131, 126, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:39:20', NULL, NULL, '1', '', ''),
(132, 127, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:40:06', NULL, NULL, '1', '', ''),
(134, 128, 133, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:47:34', NULL, NULL, NULL, NULL, NULL),
(136, 129, 135, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:47:42', NULL, NULL, NULL, NULL, NULL),
(138, 130, 137, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:47:50', NULL, NULL, NULL, NULL, NULL),
(140, 131, 139, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:48:10', NULL, NULL, NULL, NULL, NULL),
(142, 132, 141, 'JABON LIQUIDO jh', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:48:22', NULL, NULL, NULL, NULL, NULL),
(143, 133, 175, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 14:48:25', NULL, NULL, '1', '', ''),
(144, 134, 172, 'HARINA', 1.0000, 10.00, 10.00, 'Producto', '2026-05-19 14:59:37', NULL, NULL, '131', '', ''),
(146, 135, 145, 'JABON LIQUIDO', 4.0000, 10.00, 40.00, 'Producto', '2026-05-19 15:00:22', NULL, NULL, NULL, NULL, NULL),
(189, 136, 186, 'LAPICEROS', 1.0000, 20.00, 20.00, 'Producto', '2026-05-19 20:28:53', NULL, NULL, NULL, NULL, NULL),
(190, 136, 187, 'HARINA', 1.0000, 10.00, 10.00, 'Producto', '2026-05-19 20:28:53', NULL, NULL, NULL, NULL, NULL),
(191, 136, 188, 'JABON LIQUIDO', 1.0000, 30.00, 30.00, 'Producto', '2026-05-19 20:28:53', NULL, NULL, NULL, NULL, NULL),
(192, 137, 177, 'JABON LIQUIDO', 1.2000, 10.00, 12.00, 'Producto', '2026-05-20 20:04:09', NULL, NULL, '131', '', ''),
(199, 138, 198, 'LIMPIA TODO', 1.3230, 3.00, 3.97, 'Producto', '2026-05-21 06:59:18', NULL, NULL, NULL, NULL, NULL),
(204, 139, 203, 'sdasd', 1.0000, 150.00, 150.00, 'Producto', '2026-05-21 07:45:54', NULL, NULL, NULL, NULL, NULL),
(206, 140, 205, 'dasdasd', 1.0000, 10.00, 10.00, 'Producto', '2026-05-21 13:41:12', NULL, NULL, NULL, NULL, NULL),
(207, 141, 186, 'cigv', 1.0000, 40.00, 40.00, 'Producto', '2026-05-21 17:02:56', NULL, NULL, '131', '', ''),
(208, 142, 182, 'fsdfds', 1.0000, 10.00, 10.00, 'Producto', '2026-05-21 18:24:54', NULL, NULL, '131', '', ''),
(209, 143, 171, 'SOBRE MANILA A4', 1.0000, 10.00, 10.00, 'Producto', '2026-05-21 18:25:25', NULL, NULL, '1', '', ''),
(210, 144, 185, 'MICAS A4', 1.0000, 30.00, 30.00, 'Producto', '2026-05-21 18:25:29', NULL, NULL, '131', '', ''),
(211, 145, 202, 'dsadas', 1.0000, 10.00, 10.00, 'Producto', '2026-05-28 14:35:16', NULL, NULL, '131', '', ''),
(212, 146, 200, 'DASD', 1.0000, 10.00, 10.00, 'Producto', '2026-05-28 14:35:31', NULL, NULL, '131', '', ''),
(213, 147, 196, 'cascsa', 1.0000, 30.00, 30.00, 'Producto', '2026-05-28 15:36:18', NULL, NULL, '132', '', ''),
(214, 148, 194, 'asdsa', 1.0000, 11.80, 11.80, 'Producto', '2026-05-28 15:48:45', NULL, NULL, '131', '', ''),
(215, 149, 206, 'FRANELA', 1.0000, 11.80, 11.80, 'Producto', '2026-06-05 16:31:21', NULL, NULL, '1', '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` int(11) NOT NULL,
  `sueldoBase` decimal(10,2) DEFAULT NULL,
  `bonos` decimal(10,2) DEFAULT 0.00,
  `descuentosLey` decimal(10,2) DEFAULT 0.00,
  `otrosDescuentos` decimal(10,2) DEFAULT 0.00,
  `neto` decimal(10,2) DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'Pendiente',
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `metodo` varchar(50) DEFAULT NULL,
  `trabajador_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id`, `sueldoBase`, `bonos`, `descuentosLey`, `otrosDescuentos`, `neto`, `estado`, `fecha`, `metodo`, `trabajador_id`) VALUES
(10, 800.00, 50.00, 104.00, 25.00, 721.00, 'Pagado', '2026-05-18 14:55:39', 'Transferencia BCP', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planilla_docente`
--

CREATE TABLE `planilla_docente` (
  `id` int(11) NOT NULL,
  `trabajador_id` int(11) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `unidad` varchar(100) DEFAULT NULL,
  `curso` varchar(150) DEFAULT NULL,
  `grupo` varchar(50) DEFAULT NULL,
  `semestre` varchar(50) DEFAULT NULL,
  `horas` decimal(5,2) DEFAULT NULL,
  `costo` decimal(10,2) DEFAULT NULL,
  `descuento` decimal(10,2) DEFAULT 0.00,
  `observacion` text DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `programa_id` int(11) DEFAULT NULL,
  `tipo_personal` enum('DOCENTE','CHEF') DEFAULT 'DOCENTE'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `planilla_docente`
--

INSERT INTO `planilla_docente` (`id`, `trabajador_id`, `nombre`, `unidad`, `curso`, `grupo`, `semestre`, `horas`, `costo`, `descuento`, `observacion`, `total`, `fecha`, `empresa_id`, `sede_id`, `programa_id`, `tipo_personal`) VALUES
(10, 10, NULL, 'TECNICO EN COCINA', 'Desarrollo Artistico', 'A', 'B', 20.00, 25.00, 10.00, '', 490.00, '2026-05-18 14:57:00', 1, 2, 6, 'DOCENTE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planilla_movilidad`
--

CREATE TABLE `planilla_movilidad` (
  `id` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `departamento_id` int(11) DEFAULT NULL,
  `creador_id` int(11) DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `origen` varchar(150) DEFAULT NULL,
  `destino` varchar(150) DEFAULT NULL,
  `monto_total` decimal(10,2) DEFAULT NULL,
  `estado` enum('Sin firmar','Pendiente','Aprobado','Denegado','Observado','Pagado') DEFAULT NULL,
  `firmado_por` varchar(100) DEFAULT NULL,
  `fecha_firma` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `aprobado_por` int(11) DEFAULT NULL,
  `fecha_aprobacion` datetime DEFAULT NULL,
  `comprobante_pago` varchar(255) DEFAULT NULL,
  `comprobante_tipo` enum('imagen','pdf') DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `pagado_por` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `planilla_movilidad`
--

INSERT INTO `planilla_movilidad` (`id`, `fecha`, `empresa_id`, `sede_id`, `departamento_id`, `creador_id`, `motivo`, `origen`, `destino`, `monto_total`, `estado`, `firmado_por`, `fecha_firma`, `created_at`, `aprobado_por`, `fecha_aprobacion`, `comprobante_pago`, `comprobante_tipo`, `fecha_pago`, `pagado_por`) VALUES
(29, '2026-05-15', 1, 1, 3, 4, 'VISITA PIURA', 'Piura', 'Sullana', 12.00, 'Aprobado', '4', '2026-05-15 15:47:31', '2026-05-15 20:47:28', 8, '2026-05-15 15:47:56', NULL, NULL, NULL, NULL),
(30, '2026-05-16', 1, 1, 3, 4, 'Praticas', 'Piura', 'Sullana', 11.00, 'Pagado', '4', '2026-05-15 21:12:27', '2026-05-16 02:12:23', 8, '2026-05-15 21:12:45', NULL, NULL, NULL, NULL),
(31, '2026-05-16', 1, 1, 3, 4, 'Praticas', 'Piura', 'PIURA', 11.00, 'Observado', '4', '2026-05-15 21:13:05', '2026-05-16 02:13:02', NULL, NULL, NULL, NULL, NULL, NULL),
(32, '2026-05-16', 1, 1, 10, 8, 'Planilla de Movilidad', 'Piura', 'Sullana', 10.00, 'Aprobado', '8', '2026-05-15 21:19:21', '2026-05-16 02:19:18', 8, '2026-05-15 21:19:34', NULL, NULL, NULL, NULL),
(33, '2026-05-16', 1, 1, 3, 4, 'Praticas', 'Piura', 'Sullana', 12.00, 'Pagado', '4', '2026-05-15 21:28:47', '2026-05-16 02:28:45', 8, '2026-05-15 21:29:20', NULL, NULL, NULL, NULL),
(34, '2026-05-16', 1, 1, 10, 8, 'Planilla de Movilidad', 'Piura', 'Sullana', 10.00, 'Pagado', '8', '2026-05-15 21:44:48', '2026-05-16 02:44:45', 8, '2026-05-15 21:44:52', 'uploads/comprobantes_movilidad/movilidad_1779958417_7844.png', 'imagen', '2026-05-28 03:53:37', 8),
(35, '2026-05-16', 1, 1, 8, 12, 'Praticas', 'Piura', 'Sullana', 12.00, 'Pagado', '12', '2026-05-15 22:09:15', '2026-05-16 03:09:12', 8, '2026-05-15 22:09:40', 'uploads/comprobantes_movilidad/movilidad_1778901209_8878.png', 'imagen', '2026-05-15 22:13:29', 12),
(36, '2026-05-16', 1, 1, 10, 8, 'Planilla de Movilidad', 'Piura', 'Sullana', 12.00, 'Pagado', '8', '2026-05-15 22:16:00', '2026-05-16 03:15:58', 8, '2026-05-15 22:16:04', 'uploads/comprobantes_movilidad/movilidad_1778901389_6676.png', 'imagen', '2026-05-15 22:16:29', 12),
(37, '2026-05-16', 1, 1, 8, 12, 'Praticas', 'Piura', 'Sullana', 12.00, 'Pagado', '12', '2026-05-15 22:19:28', '2026-05-16 03:19:25', 4, '2026-05-28 03:52:55', 'uploads/comprobantes_movilidad/movilidad_1779958401_2249.pdf', 'pdf', '2026-05-28 03:53:21', 8),
(38, '2026-05-16', 1, 1, 8, 12, 'Praticas', 'SULLANA', 'Sullana', 12.00, 'Pendiente', '12', '2026-05-15 22:22:01', '2026-05-16 03:21:57', NULL, NULL, NULL, NULL, NULL, NULL),
(39, '2026-05-18', 1, 2, 8, 8, 'VISITA PIURA', 'SULLANA', 'PIURA', 35.00, 'Pagado', '8', '2026-05-18 09:46:22', '2026-05-18 14:45:46', 8, '2026-05-18 10:02:55', 'uploads/comprobantes_movilidad/movilidad_1779116619_2861.pdf', 'pdf', '2026-05-18 10:03:39', 8),
(40, '2026-05-20', 1, 1, 3, 8, 'Planilla de Movilidad', 'Piura', 'Sullana', -1.00, 'Pendiente', '8', '2026-05-20 05:38:36', '2026-05-20 10:38:30', NULL, NULL, NULL, NULL, NULL, NULL),
(41, '2026-05-28', 1, 1, 8, 8, 'Praticas', 'SAD', 'DASDSA', 12.00, 'Pendiente', '8', '2026-05-28 03:53:59', '2026-05-28 08:53:56', NULL, NULL, NULL, NULL, NULL, NULL),
(42, '2026-06-05', 1, 1, 19, 8, 'dadasdas', 'SULLANA', 'paita', 12.00, 'Pagado', '8', '2026-06-05 11:09:05', '2026-06-05 16:09:00', 8, '2026-06-05 11:09:20', 'uploads/comprobantes_movilidad/movilidad_1780677842_5518.png', 'imagen', '2026-06-05 11:44:02', 8),
(46, '2026-06-05', 1, 1, 3, 8, 'Praticas', 'CETURGH PIURA', 'coelgios', 25.00, 'Pendiente', '8', '2026-06-05 14:06:52', '2026-06-05 19:06:40', NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Disparadores `planilla_movilidad`
--
DELIMITER $$
CREATE TRIGGER `trg_movilidad_notificaciones` AFTER UPDATE ON `planilla_movilidad` FOR EACH ROW BEGIN

    DECLARE depto_solicitante VARCHAR(100);

    DECLARE v_codigo VARCHAR(50);
    DECLARE v_solicitante VARCHAR(255);
    DECLARE v_destino VARCHAR(255);
    DECLARE v_origen VARCHAR(255);
    DECLARE v_motivo TEXT;
    DECLARE v_fecha VARCHAR(50);
    DECLARE v_monto VARCHAR(50);

    -- =========================================
    -- DATOS MOVILIDAD
    -- =========================================

    SET v_codigo = CONCAT('MOV-', LPAD(NEW.id, 5, '0'));

    SET v_destino = COALESCE(NEW.destino, 'No especificado');

    SET v_origen = COALESCE(NEW.origen, 'No especificado');

    SET v_motivo = COALESCE(NEW.motivo, 'Sin detalle');

    SET v_fecha = COALESCE(
        DATE_FORMAT(NEW.fecha, '%d/%m/%Y'),
        'No definida'
    );

    SET v_monto = COALESCE(
        FORMAT(NEW.monto_total, 2),
        '0.00'
    );

    -- =========================================
    -- SOLICITANTE
    -- =========================================

    SELECT nombre
    INTO v_solicitante
    FROM usuarios
    WHERE id = NEW.creador_id
    LIMIT 1;

    -- =========================================
    -- DEPARTAMENTO SOLICITANTE
    -- =========================================

    SELECT nombre
    INTO depto_solicitante
    FROM departamentos
    WHERE id = NEW.departamento_id
    LIMIT 1;

    -- =========================================
    -- PENDIENTE -> ADMINISTRACION
    -- =========================================

    IF (
        NEW.estado = 'Pendiente'
        AND OLD.estado <> NEW.estado
    ) THEN

        -- =========================================
        -- NOTIFICACIONES
        -- =========================================

        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            referencia_estado
        )

        SELECT
            u.id,
            'Movilidad pendiente',
            CONCAT(
                'Existe una movilidad pendiente del área ',
                depto_solicitante
            ),
            'MOVILIDAD',
            CONCAT('MOV_PEND_', NEW.id)

        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id

        WHERE d.nombre = 'ADMINISTRACION';

        -- =========================================
        -- CORREOS
        -- =========================================

        INSERT INTO cola_correos
        (
            usuario_id,
            destinatario,
            nombre,
            asunto,
            mensaje
        )

        SELECT
            u.id,
            u.usuario,
            u.nombre,

            CONCAT(
                'Movilidad Pendiente - ',
                v_codigo
            ),

            CONCAT(

                '<div style="font-family:Segoe UI,Arial,sans-serif;background:#f4f4f4;padding:30px;">',

                    '<div style="max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border-top:6px solid #800000;">',

                        '<div style="background:#800000;padding:25px;text-align:center;">',
                            '<h2 style="margin:0;color:#ffffff;">Solicitud de Movilidad</h2>',
                        '</div>',

                        '<div style="padding:30px;">',

                            '<p>Estimado equipo de <strong>Administración</strong>,</p>',

                            '<p>Existe una movilidad pendiente de validación.</p>',

                            '<table style="width:100%;border-collapse:collapse;margin-top:20px;">',

                                '<tr>',
                                    '<td style="padding:10px;font-weight:bold;">Código</td>',
                                    '<td style="padding:10px;">', v_codigo, '</td>',
                                '</tr>',

                                '<tr>',
                                    '<td style="padding:10px;font-weight:bold;">Solicitante</td>',
                                    '<td style="padding:10px;">', v_solicitante, '</td>',
                                '</tr>',

                                '<tr>',
                                    '<td style="padding:10px;font-weight:bold;">Departamento</td>',
                                    '<td style="padding:10px;">', depto_solicitante, '</td>',
                                '</tr>',

                                '<tr>',
                                    '<td style="padding:10px;font-weight:bold;">Origen</td>',
                                    '<td style="padding:10px;">', v_origen, '</td>',
                                '</tr>',

                                '<tr>',
                                    '<td style="padding:10px;font-weight:bold;">Destino</td>',
                                    '<td style="padding:10px;">', v_destino, '</td>',
                                '</tr>',

                                '<tr>',
                                    '<td style="padding:10px;font-weight:bold;">Motivo</td>',
                                    '<td style="padding:10px;">', v_motivo, '</td>',
                                '</tr>',

                                '<tr>',
                                    '<td style="padding:10px;font-weight:bold;">Fecha</td>',
                                    '<td style="padding:10px;">', v_fecha, '</td>',
                                '</tr>',

                                '<tr>',
                                    '<td style="padding:10px;font-weight:bold;">Monto</td>',
                                    '<td style="padding:10px;">S/ ', v_monto, '</td>',
                                '</tr>',

                            '</table>',

                        '</div>',

                        '<div style="background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#777;">',
                            'Sistema CETURGH - Mensaje automático',
                        '</div>',

                    '</div>',

                '</div>'
            )

        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id

        WHERE d.nombre = 'ADMINISTRACION';

    END IF;

    -- =========================================
    -- APROBADO -> TESORERIA + SOLICITANTE
    -- =========================================

    IF (
        NEW.estado = 'Aprobado'
        AND OLD.estado <> NEW.estado
    ) THEN

        -- =========================================
        -- TESORERIA
        -- =========================================

        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            referencia_estado
        )

        SELECT
            u.id,
            'Movilidad aprobada',
            CONCAT(
                'Existe una movilidad pendiente de pago del área ',
                depto_solicitante
            ),
            'MOVILIDAD',
            CONCAT('MOV_APROB_', NEW.id)

        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id

        WHERE d.nombre = 'TESORERIA';

        -- =========================================
        -- SOLICITANTE
        -- =========================================

        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            referencia_estado
        )

        SELECT
            u.id,
            'Movilidad aprobada',
            CONCAT(
                'Su movilidad ',
                v_codigo,
                ' fue aprobada'
            ),
            'MOVILIDAD',
            CONCAT('MOV_USER_APROB_', NEW.id)

        FROM usuarios u

        WHERE u.id = NEW.creador_id;

        -- =========================================
        -- CORREO TESORERIA
        -- =========================================

        INSERT INTO cola_correos
        (
            usuario_id,
            destinatario,
            nombre,
            asunto,
            mensaje
        )

        SELECT
            u.id,
            u.usuario,
            u.nombre,

            CONCAT(
                'Pago Pendiente de Movilidad - ',
                v_codigo
            ),

            CONCAT(
                '<div style="font-family:Segoe UI,Arial,sans-serif;padding:30px;background:#f4f4f4;">',

                    '<div style="max-width:650px;margin:auto;background:#fff;border-top:6px solid #800000;border-radius:10px;">',

                        '<div style="background:#800000;padding:25px;text-align:center;">',
                            '<h2 style="margin:0;color:#fff;">Movilidad Aprobada</h2>',
                        '</div>',

                        '<div style="padding:30px;">',

                            '<p>Estimado equipo de <strong>Tesorería</strong>,</p>',

                            '<p>Existe una movilidad pendiente de desembolso.</p>',

                            '<p><strong>Código:</strong> ', v_codigo, '</p>',
                            '<p><strong>Solicitante:</strong> ', v_solicitante, '</p>',
                            '<p><strong>Monto:</strong> S/ ', v_monto, '</p>',

                        '</div>',

                    '</div>',

                '</div>'
            )

        FROM usuarios u
        INNER JOIN departamentos d
            ON d.id = u.departamento_id

        WHERE d.nombre = 'TESORERIA';

    END IF;

    -- =========================================
    -- DENEGADO
    -- =========================================

    IF (
        NEW.estado = 'Denegado'
        AND OLD.estado <> NEW.estado
    ) THEN

        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            referencia_estado
        )

        SELECT
            u.id,
            'Movilidad rechazada',
            CONCAT(
                'La movilidad ',
                v_codigo,
                ' fue rechazada'
            ),
            'MOVILIDAD',
            CONCAT('MOV_DENEG_', NEW.id)

        FROM usuarios u

        WHERE u.id = NEW.creador_id;

    END IF;

    -- =========================================
    -- PAGADO
    -- =========================================

    IF (
        NEW.estado = 'Pagado'
        AND OLD.estado <> NEW.estado
    ) THEN

        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            referencia_estado
        )

        SELECT
            u.id,
            'Movilidad pagada',
            CONCAT(
                'La movilidad ',
                v_codigo,
                ' fue pagada correctamente'
            ),
            'MOVILIDAD',
            CONCAT('MOV_PAGADO_', NEW.id)

        FROM usuarios u

        WHERE u.id = NEW.creador_id;

    END IF;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planilla_movilidad_backup_20260605`
--

CREATE TABLE `planilla_movilidad_backup_20260605` (
  `id` int(11) NOT NULL DEFAULT 0,
  `fecha` date DEFAULT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `departamento_id` int(11) DEFAULT NULL,
  `creador_id` int(11) DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `origen` varchar(150) DEFAULT NULL,
  `destino` varchar(150) DEFAULT NULL,
  `monto_total` decimal(10,2) DEFAULT NULL,
  `estado` enum('Sin firmar','Pendiente','Aprobado','Denegado','Observado','Pagado') DEFAULT NULL,
  `firmado_por` varchar(100) DEFAULT NULL,
  `fecha_firma` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `aprobado_por` int(11) DEFAULT NULL,
  `fecha_aprobacion` datetime DEFAULT NULL,
  `comprobante_pago` varchar(255) DEFAULT NULL,
  `comprobante_tipo` enum('imagen','pdf') DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `pagado_por` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `planilla_movilidad_backup_20260605`
--

INSERT INTO `planilla_movilidad_backup_20260605` (`id`, `fecha`, `empresa_id`, `sede_id`, `departamento_id`, `creador_id`, `motivo`, `origen`, `destino`, `monto_total`, `estado`, `firmado_por`, `fecha_firma`, `created_at`, `aprobado_por`, `fecha_aprobacion`, `comprobante_pago`, `comprobante_tipo`, `fecha_pago`, `pagado_por`) VALUES
(29, '2026-05-15', 1, 1, 3, 4, 'VISITA PIURA', 'Piura', 'Sullana', 12.00, 'Aprobado', '4', '2026-05-15 15:47:31', '2026-05-15 20:47:28', 8, '2026-05-15 15:47:56', NULL, NULL, NULL, NULL),
(30, '2026-05-16', 1, 1, 3, 4, 'Praticas', 'Piura', 'Sullana', 11.00, 'Pagado', '4', '2026-05-15 21:12:27', '2026-05-16 02:12:23', 8, '2026-05-15 21:12:45', NULL, NULL, NULL, NULL),
(31, '2026-05-16', 1, 1, 3, 4, 'Praticas', 'Piura', 'PIURA', 11.00, 'Observado', '4', '2026-05-15 21:13:05', '2026-05-16 02:13:02', NULL, NULL, NULL, NULL, NULL, NULL),
(32, '2026-05-16', 1, 1, 10, 8, 'Planilla de Movilidad', 'Piura', 'Sullana', 10.00, 'Aprobado', '8', '2026-05-15 21:19:21', '2026-05-16 02:19:18', 8, '2026-05-15 21:19:34', NULL, NULL, NULL, NULL),
(33, '2026-05-16', 1, 1, 3, 4, 'Praticas', 'Piura', 'Sullana', 12.00, 'Pagado', '4', '2026-05-15 21:28:47', '2026-05-16 02:28:45', 8, '2026-05-15 21:29:20', NULL, NULL, NULL, NULL),
(34, '2026-05-16', 1, 1, 10, 8, 'Planilla de Movilidad', 'Piura', 'Sullana', 10.00, 'Pagado', '8', '2026-05-15 21:44:48', '2026-05-16 02:44:45', 8, '2026-05-15 21:44:52', 'uploads/comprobantes_movilidad/movilidad_1779958417_7844.png', 'imagen', '2026-05-28 03:53:37', 8),
(35, '2026-05-16', 1, 1, 8, 12, 'Praticas', 'Piura', 'Sullana', 12.00, 'Pagado', '12', '2026-05-15 22:09:15', '2026-05-16 03:09:12', 8, '2026-05-15 22:09:40', 'uploads/comprobantes_movilidad/movilidad_1778901209_8878.png', 'imagen', '2026-05-15 22:13:29', 12),
(36, '2026-05-16', 1, 1, 10, 8, 'Planilla de Movilidad', 'Piura', 'Sullana', 12.00, 'Pagado', '8', '2026-05-15 22:16:00', '2026-05-16 03:15:58', 8, '2026-05-15 22:16:04', 'uploads/comprobantes_movilidad/movilidad_1778901389_6676.png', 'imagen', '2026-05-15 22:16:29', 12),
(37, '2026-05-16', 1, 1, 8, 12, 'Praticas', 'Piura', 'Sullana', 12.00, 'Pagado', '12', '2026-05-15 22:19:28', '2026-05-16 03:19:25', 4, '2026-05-28 03:52:55', 'uploads/comprobantes_movilidad/movilidad_1779958401_2249.pdf', 'pdf', '2026-05-28 03:53:21', 8),
(38, '2026-05-16', 1, 1, 8, 12, 'Praticas', 'SULLANA', 'Sullana', 12.00, 'Pendiente', '12', '2026-05-15 22:22:01', '2026-05-16 03:21:57', NULL, NULL, NULL, NULL, NULL, NULL),
(39, '2026-05-18', 1, 2, 8, 8, 'VISITA PIURA', 'SULLANA', 'PIURA', 35.00, 'Pagado', '8', '2026-05-18 09:46:22', '2026-05-18 14:45:46', 8, '2026-05-18 10:02:55', 'uploads/comprobantes_movilidad/movilidad_1779116619_2861.pdf', 'pdf', '2026-05-18 10:03:39', 8),
(40, '2026-05-20', 1, 1, 3, 8, 'Planilla de Movilidad', 'Piura', 'Sullana', -1.00, 'Pendiente', '8', '2026-05-20 05:38:36', '2026-05-20 10:38:30', NULL, NULL, NULL, NULL, NULL, NULL),
(41, '2026-05-28', 1, 1, 8, 8, 'Praticas', 'SAD', 'DASDSA', 12.00, 'Pendiente', '8', '2026-05-28 03:53:59', '2026-05-28 08:53:56', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planilla_movilidad_detalle`
--

CREATE TABLE `planilla_movilidad_detalle` (
  `id` int(11) NOT NULL,
  `planilla_id` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `origen` varchar(150) DEFAULT NULL,
  `destino` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `planilla_movilidad_detalle`
--

INSERT INTO `planilla_movilidad_detalle` (`id`, `planilla_id`, `fecha`, `monto`, `origen`, `destino`) VALUES
(20, 29, '2026-05-15', 12.00, NULL, NULL),
(21, 30, '2026-05-14', 11.00, NULL, NULL),
(22, 31, '2026-05-15', 11.00, NULL, NULL),
(23, 32, '2026-05-15', 10.00, NULL, NULL),
(24, 33, '2026-05-15', 12.00, NULL, NULL),
(25, 34, '2026-05-15', 10.00, NULL, NULL),
(26, 35, '2026-05-15', 12.00, NULL, NULL),
(27, 36, '2026-05-15', 12.00, NULL, NULL),
(28, 37, '2026-05-15', 12.00, NULL, NULL),
(29, 38, '2026-05-15', 12.00, NULL, NULL),
(32, 39, '2026-05-18', 15.00, NULL, NULL),
(33, 39, '2026-05-19', 20.00, NULL, NULL),
(34, 40, '2026-05-20', -1.00, NULL, NULL),
(35, 41, '2026-05-15', 12.00, NULL, NULL),
(36, 42, '2026-06-05', 12.00, NULL, NULL),
(37, 46, '2026-06-05', 12.00, 'Piura', 'Talara'),
(38, 46, '2026-06-06', 13.00, 'Piura', 'Sullana');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `presupuestos_carreras`
--

CREATE TABLE `presupuestos_carreras` (
  `id` int(11) NOT NULL,
  `carrera_id` int(11) NOT NULL,
  `empresa_id` int(11) NOT NULL,
  `sede_id` int(11) NOT NULL,
  `presupuesto` decimal(12,2) DEFAULT 0.00,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `presupuestos_historicos`
--

CREATE TABLE `presupuestos_historicos` (
  `id` int(11) NOT NULL,
  `departamento_id` int(11) NOT NULL,
  `mes` int(2) NOT NULL,
  `anio` int(4) NOT NULL,
  `presupuesto_asignado` decimal(10,2) DEFAULT 0.00,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `registrado_por` int(11) DEFAULT NULL,
  `nota` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `presupuestos_historicos`
--

INSERT INTO `presupuestos_historicos` (`id`, `departamento_id`, `mes`, `anio`, `presupuesto_asignado`, `fecha_registro`, `registrado_por`, `nota`) VALUES
(1, 3, 6, 2026, 1050.00, '2026-06-05 09:09:08', 1, 'Presupuesto asignado manualmente para Junio 2026'),
(2, 6, 6, 2026, 1110.00, '2026-06-05 08:55:55', 1, 'Presupuesto inicial migrado desde tabla departamentos'),
(3, 8, 6, 2026, 9838.00, '2026-06-05 08:55:55', 1, 'Presupuesto inicial migrado desde tabla departamentos'),
(4, 10, 6, 2026, 9833.00, '2026-06-05 08:55:55', 1, 'Presupuesto inicial migrado desde tabla departamentos'),
(8, 3, 5, 2026, 1020.00, '2026-06-05 08:56:09', 1, 'Presupuesto histórico basado en gastos de requerimientos'),
(9, 8, 5, 2026, 9838.00, '2026-06-05 08:56:09', 1, 'Presupuesto histórico basado en gastos de requerimientos'),
(10, 10, 5, 2026, 9833.00, '2026-06-05 08:56:09', 1, 'Presupuesto histórico basado en gastos de requerimientos'),
(11, 11, 5, 2026, 0.00, '2026-06-05 08:56:09', 1, 'Presupuesto histórico basado en gastos de requerimientos'),
(15, 3, 7, 2026, 1080.00, '2026-06-05 09:10:04', 1, 'Presupuesto asignado manualmente para Julio 2026'),
(16, 5, 6, 2026, 1200.00, '2026-06-05 09:31:06', 1, 'Presupuesto asignado manualmente para Junio 2026'),
(17, 5, 8, 2026, 1500.00, '2026-06-05 09:31:24', 1, 'Presupuesto asignado manualmente para Agosto 2026'),
(18, 21, 6, 2026, 5047.00, '2026-06-05 12:36:14', 1, NULL),
(19, 22, 6, 2026, 32041.00, '2026-06-05 12:38:41', 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_select`
--

CREATE TABLE `productos_select` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `estado` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `productos_select`
--

INSERT INTO `productos_select` (`id`, `nombre`, `estado`, `created_at`) VALUES
(1, 'PAPEL DINA A4', 1, '2026-05-04 07:03:37'),
(2, 'LAPICEROS', 1, '2026-05-04 07:03:37'),
(3, 'LAPIZ', 1, '2026-05-04 07:03:37'),
(4, 'MICAS A4', 1, '2026-05-04 07:03:37'),
(5, 'SOBRE MANILA A4', 1, '2026-05-04 07:03:37'),
(6, 'SOBRE MANILA OFICIO', 1, '2026-05-04 07:03:37'),
(7, 'CLIP', 1, '2026-05-04 07:03:37'),
(8, 'VINIFAN GRANDE', 1, '2026-05-04 07:03:37'),
(9, 'ARCHIVADOR', 1, '2026-05-04 07:03:37'),
(10, 'CORRECTOR', 1, '2026-05-04 07:03:37'),
(11, 'RESALTADOR', 1, '2026-05-04 07:03:37'),
(12, 'CINTA SCOTCH', 1, '2026-05-04 07:03:37'),
(13, 'TIJERA', 1, '2026-05-04 07:03:37'),
(14, 'SILICONA GRANDE', 1, '2026-05-04 07:03:37'),
(15, 'POST IT', 1, '2026-05-04 07:03:37'),
(16, 'FRANELA', 1, '2026-05-04 07:03:37'),
(17, 'PLUMONES', 1, '2026-05-04 07:03:37'),
(18, 'LIMPIA TODO', 1, '2026-05-04 07:03:37'),
(19, 'PAPEL ADHESIVO', 1, '2026-05-04 07:03:37'),
(20, 'CINTA DE EMBALAJE', 1, '2026-05-04 07:03:37'),
(21, 'GRAPAS', 1, '2026-05-04 07:03:37'),
(22, 'PILAS AA', 1, '2026-05-04 07:03:37'),
(23, 'PILAS AAA', 1, '2026-05-04 07:03:37'),
(24, 'REGLA DE 30CM', 1, '2026-05-04 07:03:37'),
(25, 'PORTA DOCUMENTOS', 1, '2026-05-04 07:03:37'),
(26, 'FOLDER MANILA', 1, '2026-05-04 07:03:37'),
(27, 'WINCHA', 1, '2026-05-04 07:03:37'),
(28, 'ARROZ', 1, '2026-05-04 07:03:37'),
(29, 'AZUCAR BLANCA', 1, '2026-05-04 07:03:37'),
(30, 'ACEITE', 1, '2026-05-04 07:03:37'),
(31, 'HARINA', 1, '2026-05-04 07:03:37'),
(32, 'SAL', 1, '2026-05-04 07:03:37'),
(33, 'PAPEL HIGIENICO', 1, '2026-05-04 07:03:37'),
(34, 'PAPEL TOALLA', 1, '2026-05-04 07:03:37'),
(35, 'JABON LIQUIDO', 1, '2026-05-04 07:03:37'),
(36, 'ALCOHOL', 1, '2026-05-04 07:03:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programas`
--

CREATE TABLE `programas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `programas`
--

INSERT INTO `programas` (`id`, `nombre`, `empresa_id`, `sede_id`) VALUES
(1, 'CURSOS CORTOS PIURA', 1, 1),
(2, 'CENTRO DE IDIOMAS PIURA', 1, 1),
(3, 'CETPRO PIURA', 1, 1),
(4, 'CURSOS CORTOS SULLANA', 1, 2),
(5, 'CENTRO DE IDIOMAS SULLANA', 1, 2),
(6, 'CETPRO SULLANA', 1, 2),
(7, 'INSTITUTO PIURA', 2, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propuestas`
--

CREATE TABLE `propuestas` (
  `id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `proveedor` varchar(255) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `pdf_url` varchar(255) DEFAULT NULL,
  `seleccionada` tinyint(4) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `dias_credito` int(11) DEFAULT 0,
  `costo_delivery` decimal(10,2) DEFAULT 0.00,
  `tiempo_entrega` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `ruc` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `medio_pago` varchar(50) DEFAULT NULL,
  `detalle_pago` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `especialidad` varchar(150) DEFAULT NULL,
  `sede` varchar(50) DEFAULT NULL,
  `credito` varchar(50) DEFAULT NULL,
  `vigencia` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id`, `nombre`, `ruc`, `direccion`, `telefono`, `email`, `medio_pago`, `detalle_pago`, `created_at`, `especialidad`, `sede`, `credito`, `vigencia`) VALUES
(1, 'MIKESCORT E.I.R.L', '20613305859', '', '987310876', '', 'Transferencia', '475-03598471-0-76', '2026-04-22 01:52:33', 'Insumos', 'Piura', '15 días', NULL),
(2, 'Representaciones Lucy EIRL', '20609010160', '', '947689418', '', 'Transferencia', '475-9863573-0-27', '2026-04-22 01:52:33', 'Insumos', 'Piura', '7 días', NULL),
(3, 'Carnicos C&S', '10801728125', '', '971454310', '', 'Transferencia', '475-94832001-0-57', '2026-04-22 01:52:33', 'Insumos', 'Piura', '15 días', NULL),
(4, 'Tintos & Hielos SCRL', '20529938064', '', '974043162', '', 'Transferencia', '475-2071892-0-79', '2026-04-22 01:52:33', 'Insumos', 'Piura', '15 días', NULL),
(5, 'Palacios Alburqueque Jani Daniel', '10035763746', '', '948606815', '', 'Transferencia', '535-06792422-0-51', '2026-04-22 01:52:33', 'Insumos', 'Sullana', '15 días', NULL),
(6, 'Carniceria Giron SCRL', '20525938248', '', '968460126', '', 'Transferencia', '535-2379259-0-57', '2026-04-22 01:52:33', 'Insumos', 'Sullana', '15 días', NULL),
(7, 'Wilmer Timana Carmen', '0-2813327', '', '938480867', '', 'Transferencia', '475-06788913-0-45', '2026-04-22 01:52:33', 'Insumos', 'Sullana', '15 días', NULL),
(8, 'OTOYA LIVIAPOMA LUIS ENRIQUE', '10035079659', '', '928674072', '', 'Transferencia', '475-98839710-0-47', '2026-04-22 01:52:33', 'Insumos', 'Piura', '15 días', NULL),
(9, 'MB SAC', '20615624641', '', '910382386', '', 'Transferencia', '475-7361752-0-08', '2026-04-22 01:52:33', 'Insumos', 'Piura', '15 días', NULL),
(10, 'MARIA NELIDA CHIROQUE MACALUPU', '10028697011', '', '959499541', '', 'Transferencia', '475-12227894-0-65', '2026-04-22 01:52:33', 'Insumos', 'Piura', '15 días', NULL),
(11, 'Libreria JAIR', '10719616416', '', '986758660', '', 'Transferencia', '475-95976167-0-79', '2026-04-22 01:52:33', 'Libreria', 'Piura', '15 días', NULL),
(12, 'MB SAC', '20615624641', '', '910382386', '', 'Transferencia', '475-7361752-0-08', '2026-04-22 01:52:33', 'Libreria', 'Piura', '7 días', NULL),
(13, 'EDMARAL SAC', '', '', '', '', 'Transferencia', '003-720013334143293-07', '2026-04-22 01:52:33', 'Libreria', 'Piura', '', NULL),
(14, 'Olympus Industrias S.R.L', '20600525272', '', '964910823', '', 'Transferencia', '475-2263220-0-86', '2026-04-22 01:52:33', 'Utiles de Limpieza', 'Piura', '7 días', NULL),
(15, 'Jose Chavez Varona', '10027752468', '', '969491973', '', 'Transferencia', '475-94774585-0-60', '2026-04-22 01:52:33', 'Utiles de Limpieza', 'Piura', '7 días', NULL),
(16, 'MP institucional', '20509411671', '', '981053790', '', 'Transferencia', '194-1467251-0-16', '2026-04-22 01:52:33', 'Utiles de Limpieza', 'Piura', '30 días', NULL),
(17, 'MB SAC', '20615624641', '', '910382386', '', 'Transferencia', '475-7361752-0-08', '2026-04-22 01:52:33', 'Utiles de Limpieza', 'Piura', '15 días', NULL),
(18, 'Unión ychicawa s.a', '20100047137', '', '981185548', '', 'Transferencia', '191-0881723-0-91', '2026-04-22 01:52:33', 'Bar, Cristal y Menaje', 'Piura', '', NULL),
(19, 'Shaking SAC', '20601938201', '', '997955256', '', 'Transferencia', '194-9867401-0-76', '2026-04-22 01:52:33', 'Bar, Cristal y Menaje', 'Piura', '', NULL),
(20, 'Librería Castro', '20610373608', '', '989508135', '', 'Transferencia', '193-75598556-0-75', '2026-04-22 01:52:33', 'Bar, Cristal y Menaje', 'Piura', '', NULL),
(21, 'Integrasat Soluciones S.R.L', '20455256357', '', '999033365', '', 'Transferencia', '194-2622084-0-96', '2026-04-22 01:52:33', 'Bar, Cristal y Menaje', 'Piura', '', NULL),
(22, 'Sanchez Flores Eleuterio', '15205450111', '', '969628766', '', 'Transferencia', '475-01988999-0-46', '2026-04-22 01:52:33', 'Servicios Generales - Albañil', 'Piura', '7 días', NULL),
(23, 'Mario Gomez Almanza', '10033857182', '', '968072902', '', 'Transferencia', '475-76343071-0-70', '2026-04-22 01:52:33', 'Servicios Generales - Vidrieria y drywall', 'Piura', '7 días', NULL),
(24, 'Miguel Angel Alcas Chorres', '10036578896', '', '969674642', '', 'Transferencia', '475-91885502-0-95', '2026-04-22 01:52:33', 'Servicios Generales - Vidrieria', 'Piura', '7 días', NULL),
(25, 'Renteria Navarro Carlos Alberto', '10028130967', '', '988276134', '', 'Transferencia', '475-76404639-0-60', '2026-04-22 01:52:33', 'Servicios Generales - Gasfiteria', 'Piura y Sullana', '7 días', NULL),
(26, 'Medaly Rivera Padilla', '10773332741', '', '938575543', '', 'Transferencia', '475-77014999-0-85', '2026-04-22 01:52:33', 'Servicios Generales - Ferretería', 'Piura', '7 días', NULL),
(27, 'Juan Yamunaque Cruz', '0-2842882', '', '968823008', '', 'Transferencia', '475-03588913-0-22', '2026-04-22 01:52:33', 'Servicios Generales - Agua/Cisterna', 'Piura', 'X', NULL),
(28, 'Mimaya E.I.R.L', '20602321330', '', '987549396', '', 'Transferencia', '475-4213519-0-75', '2026-04-22 01:52:33', 'Servicios Generales - Agua Bidón', 'Piura', '15 días', NULL),
(29, 'Ronald Castro Mogollon', '10420359581', '', '957950921', '', 'Transferencia', '191-05879778-0-67', '2026-04-22 01:52:33', 'Servicios Generales - Agua/Cisterna', 'Piura', 'X', NULL),
(30, 'Jorge Coba', '', '', '978083918', '', 'Transferencia', '', '2026-04-22 01:52:33', 'Servicios Generales - Agua potable', 'Piura', 'x', NULL),
(31, 'Emiratos Computer', '20612039039', '', '977164346', '', 'Transferencia', '475-2190986-0-48', '2026-04-22 01:52:33', 'Servicios y Productos TIC', 'Piura', '30 días', NULL),
(32, 'Red Hardward Tecnology S.R.L', '20613188275', '', '943126114', '', 'Transferencia', '475-7069917-0-79', '2026-04-22 01:52:33', 'Servicios y Productos TIC', 'Piura', '15 días', NULL),
(33, 'Mario Deyber Salas Burgos', '10462147282', '', '935585501', '', 'Transferencia', '475-94498608096', '2026-04-22 01:52:33', 'Mantenimiento - Hornos', 'Piura', '7 días', NULL),
(34, 'Antonio Venta Camaras Elera', '', '', '985732543', '', 'Transferencia', '', '2026-04-22 01:52:33', 'Mantenimiento - Servicios Generales', 'Piura', '0', NULL),
(35, 'Clavijo Cementerio', '', '', '969696257', '', 'Transferencia', '', '2026-04-22 01:52:33', 'Mantenimiento - Servicios Generales', 'Piura', '0', NULL),
(36, 'Ferreteria Burgos', '', '', '995324594', '', 'Transferencia', '', '2026-04-22 01:52:33', 'Mantenimiento - Servicios Generales', 'Piura', '0', NULL),
(37, 'Constructores y Consultores la Guadalupana S.R.L.', '20612327077', 'Cal. Callao Nro. 719 Cercado de Castilla', '939427488', 'pablocesar.castrotimana@gmail.com', 'Transferencia', '89898978987978685858', '2026-04-07 23:02:47', 'Construccion Edificios Completos', 'Piura', '+60 días', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rendiciones_caja`
--

CREATE TABLE `rendiciones_caja` (
  `id` int(11) NOT NULL,
  `caja_id` int(11) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `fecha_rendicion` date DEFAULT NULL,
  `saldo_inicial` decimal(10,2) DEFAULT NULL,
  `total_rendido` decimal(10,2) DEFAULT NULL,
  `saldo_final` decimal(10,2) DEFAULT NULL,
  `estado` enum('BORRADOR','ENVIADO','OBSERVADO','APROBADO') DEFAULT 'BORRADOR',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `rendiciones_caja`
--

INSERT INTO `rendiciones_caja` (`id`, `caja_id`, `numero`, `fecha_rendicion`, `saldo_inicial`, `total_rendido`, `saldo_final`, `estado`, `created_by`, `created_at`) VALUES
(1, 1, 'REND-2026-00004', '2026-05-29', 1000.00, 290.00, 710.00, 'BORRADOR', 8, '2026-05-29 15:35:37'),
(2, 1, 'REND-2026-00006', '2026-05-29', 1010.00, 280.00, 730.00, 'APROBADO', 12, '2026-05-29 16:58:12'),
(3, 1, 'REND-2026-00007', '2026-05-30', 730.00, 21.00, 709.00, 'APROBADO', 12, '2026-05-30 16:41:07'),
(4, 2, 'REND-2026-00008', '2026-05-30', 1000.00, 45.00, 955.00, 'OBSERVADO', 12, '2026-05-30 17:25:12'),
(5, 1, 'REND-2026-00009', '2026-05-30', 809.00, 22.00, 787.00, 'APROBADO', 12, '2026-05-30 17:53:56'),
(6, 3, 'REND-2026-00010', '2026-06-03', 500.00, 530.00, 0.00, 'APROBADO', 8, '2026-06-03 13:04:44'),
(7, 3, 'REND-2026-00011', '2026-06-04', 1000.00, 344.00, 656.00, 'BORRADOR', 8, '2026-06-04 13:24:01'),
(8, 3, 'REND-2026-00012', '2026-06-04', 1000.00, 4434.00, 0.00, 'APROBADO', 8, '2026-06-04 13:24:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rendicion_items`
--

CREATE TABLE `rendicion_items` (
  `id` int(11) NOT NULL,
  `rendicion_id` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `proveedor` varchar(255) DEFAULT NULL,
  `ruc_dni` varchar(20) DEFAULT NULL,
  `tipo_documento` enum('FACTURA','BOLETA','RXH','MOVILIDAD','OTROS') DEFAULT NULL,
  `numero_documento` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `adjunto` varchar(255) DEFAULT NULL,
  `archivo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `rendicion_items`
--

INSERT INTO `rendicion_items` (`id`, `rendicion_id`, `fecha`, `proveedor`, `ruc_dni`, `tipo_documento`, `numero_documento`, `descripcion`, `monto`, `adjunto`, `archivo`) VALUES
(1, 1, '2026-05-29', 'UYUU', '34334324', 'FACTURA', '2323', 'RECEVCVR', 124.00, NULL, NULL),
(2, 1, '2026-05-29', 'DDEDE', '23232', 'FACTURA', '3', 'DEWDE', 12.00, NULL, NULL),
(3, 1, '2026-05-30', 'CARAMELO', '23234', 'FACTURA', '3434', 'CCDC', 154.00, NULL, NULL),
(4, 2, '2026-05-29', 'dcsdvsd', '12324324', 'FACTURA', '2', 'vcsdvvsdv', 124.00, 'uploads/adjuntos_rendicion/6a19c58453ac1_ab3eb89a297e51e0.pdf', NULL),
(5, 2, '2026-05-29', 'sdsdvsd', '12566', 'BOLETA', '3', 'efcsvcdsvsdv', 156.00, 'uploads/adjuntos_rendicion/6a19c5a1ece22_af53124290e5fe9c.pdf', NULL),
(6, 3, '2026-05-30', 'vvdfdfv', '23243243', 'FACTURA', '12', 'sdfsdfsd', 21.00, NULL, NULL),
(7, 4, '2026-05-30', 'CSACSDCDS', '12345678909876543212', 'FACTURA', '2', 'FDSFDSFDSF', 21.00, NULL, NULL),
(8, 4, '2026-05-31', 'DASDASDAS', '', 'FACTURA', '21', 'FSFSDFSDFDS', 24.00, NULL, NULL),
(9, 5, '2026-05-23', 'GSFSDF', '21332432423', 'FACTURA', '21', 'SDCSDCSDCSDCDSCDS', 22.00, NULL, NULL),
(10, 6, '2026-06-03', 'pipo', '233456789', 'FACTURA', '1', 'prueba', 530.00, NULL, NULL),
(11, 7, '2026-06-04', '4343', '2123123', 'FACTURA', '3432', 'e23e23e2', 344.00, NULL, NULL),
(12, 8, '2026-06-04', 'csdcsdcsdcsd', '131432432', 'FACTURA', '23123', 'dcds', 4434.00, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `requerimientos`
--

CREATE TABLE `requerimientos` (
  `id` int(11) NOT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `departamento_id` int(11) DEFAULT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `prioridad` enum('Baja','Media','Alta','Urgente') DEFAULT NULL,
  `estado` enum('Sin firmar','Pendiente','Evaluando','Cotizado','Aprobado','Denegado','Pagado','Observado') DEFAULT NULL,
  `comentarios` text DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `total` decimal(10,2) DEFAULT 0.00,
  `firmado_por` varchar(100) DEFAULT NULL,
  `fecha_firma` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo` enum('Producto','Servicio') DEFAULT 'Producto',
  `creador_id` int(11) DEFAULT NULL,
  `tipo_destino` enum('GENERAL','CARRERA','CURSO_CORTO') DEFAULT 'GENERAL',
  `carrera_id` int(11) DEFAULT NULL,
  `curso_corto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `requerimientos`
--

INSERT INTO `requerimientos` (`id`, `codigo`, `departamento_id`, `empresa_id`, `sede_id`, `prioridad`, `estado`, `comentarios`, `fecha`, `total`, `firmado_por`, `fecha_firma`, `created_at`, `tipo`, `creador_id`, `tipo_destino`, `carrera_id`, `curso_corto`) VALUES
(132, 'RQ-2026-0730', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-14', 0.00, NULL, NULL, '2026-05-13 23:59:10', 'Producto', 8, 'GENERAL', NULL, NULL),
(133, 'RQ-2026-5017', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-14', 0.00, NULL, NULL, '2026-05-14 16:00:05', 'Producto', 8, 'GENERAL', NULL, NULL),
(134, 'RQ-2026-8392', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-14', 0.00, NULL, NULL, '2026-05-14 19:12:08', 'Producto', 4, 'CURSO_CORTO', NULL, 'Preparación de Pizzas'),
(135, 'RQ-2026-2630', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-14', 0.00, NULL, NULL, '2026-05-14 20:18:12', 'Producto', 4, 'GENERAL', NULL, NULL),
(136, 'RQ-2026-7123', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 14:50:37', 'Producto', 4, 'GENERAL', NULL, NULL),
(137, 'RQ-2026-1582', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 15:44:41', 'Producto', 4, 'GENERAL', NULL, NULL),
(138, 'RQ-2026-2103', 3, 1, 2, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 16:52:32', 'Producto', 4, 'GENERAL', NULL, NULL),
(139, 'RQ-2026-3584', 3, 2, 3, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:01:53', 'Producto', 4, 'GENERAL', NULL, NULL),
(140, 'RQ-2026-2168', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:07:32', 'Producto', 4, 'GENERAL', NULL, NULL),
(141, 'RQ-2026-6956', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:14:17', 'Producto', 4, 'GENERAL', NULL, NULL),
(142, 'RQ-2026-1946', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:19:42', 'Producto', 8, 'GENERAL', NULL, NULL),
(143, 'RQ-2026-6888', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:20:06', 'Producto', 4, 'GENERAL', NULL, NULL),
(144, 'RQ-2026-2157', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:27:02', 'Producto', 4, 'GENERAL', NULL, NULL),
(145, 'RQ-2026-1094', 3, 1, 2, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:39:21', 'Producto', 4, 'GENERAL', NULL, NULL),
(146, 'RQ-2026-7572', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 19:15:37', 'Producto', 4, 'GENERAL', NULL, NULL),
(147, 'RQ-2026-7609', 3, 2, 3, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 19:19:17', 'Producto', 4, 'GENERAL', NULL, NULL),
(148, 'RQ-2026-5703', 3, 1, 2, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 19:55:15', 'Producto', 4, 'GENERAL', NULL, NULL),
(149, 'RQ-2026-1193', 3, 2, 3, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:00:01', 'Producto', 4, 'GENERAL', NULL, NULL),
(150, 'RQ-2026-9317', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:19:59', 'Producto', 8, 'GENERAL', NULL, NULL),
(151, 'RQ-2026-7586', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:20:37', 'Producto', 4, 'GENERAL', NULL, NULL),
(152, 'RQ-2026-4727', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:31:14', 'Producto', 4, 'GENERAL', NULL, NULL),
(153, 'RQ-2026-6158', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:38:56', 'Producto', 8, 'GENERAL', NULL, NULL),
(154, 'RQ-2026-1196', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:39:11', 'Producto', 4, 'GENERAL', NULL, NULL),
(155, 'RQ-2026-5248', 3, 2, 3, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:45:55', 'Producto', 4, 'GENERAL', NULL, NULL),
(156, 'RQ-2026-2273', 8, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-16', 0.00, NULL, NULL, '2026-05-16 16:39:12', 'Producto', 8, 'GENERAL', NULL, NULL),
(157, 'RQ-2026-6337', 8, 1, 2, 'Media', 'Pendiente', NULL, '2026-05-18', 0.00, NULL, NULL, '2026-05-18 14:42:46', 'Producto', 8, 'GENERAL', NULL, NULL),
(158, 'RQ-2026-4189', 10, 2, 3, 'Media', 'Pendiente', NULL, '2026-05-19', 0.00, NULL, NULL, '2026-05-19 13:24:54', 'Producto', 8, 'GENERAL', NULL, NULL),
(159, 'RQ-2026-2887', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-20', 0.00, NULL, NULL, '2026-05-20 10:38:12', 'Producto', 8, 'GENERAL', NULL, NULL),
(160, 'RQ-2026-8707', 8, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-20', 0.00, NULL, NULL, '2026-05-20 20:02:38', 'Producto', 8, 'GENERAL', NULL, NULL),
(161, 'RQ-2026-1780', 8, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 06:05:41', 'Producto', 8, 'GENERAL', NULL, NULL),
(162, 'RQ-2026-7620', 8, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 07:00:07', 'Servicio', 8, 'GENERAL', NULL, NULL),
(163, 'RQ-2026-4834', 8, 1, 2, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 09:07:54', 'Producto', 8, 'GENERAL', NULL, NULL),
(164, 'RQ-2026-4023', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 16:25:44', 'Producto', 8, 'GENERAL', NULL, NULL),
(165, 'RQ-2026-4427', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 16:43:24', 'Producto', 8, 'GENERAL', NULL, NULL),
(166, 'RQ-2026-5468', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 16:53:45', 'Producto', 8, 'GENERAL', NULL, NULL),
(167, 'RQ-2026-1777', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 16:59:11', 'Producto', 8, 'GENERAL', NULL, NULL),
(168, 'RQ-2026-1869', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-22', 0.00, NULL, NULL, '2026-05-22 03:17:51', 'Producto', 8, 'GENERAL', NULL, NULL),
(169, 'RQ-2026-0001', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-25', 0.00, NULL, NULL, '2026-05-25 13:35:23', 'Producto', 8, 'GENERAL', NULL, NULL),
(170, 'RQ-2026-0002', 10, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 19:28:26', 'Producto', 4, 'GENERAL', NULL, NULL),
(171, 'RQ-2026-0003', 10, 1, 1, 'Media', 'Sin firmar', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 19:30:50', 'Producto', 4, 'GENERAL', NULL, NULL),
(172, 'RQ-2026-0004', 10, 2, 3, 'Media', 'Cotizado', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 19:36:07', 'Producto', 4, 'GENERAL', NULL, NULL),
(173, 'RQ-2026-0005', 10, 1, 1, 'Media', 'Sin firmar', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 19:40:40', 'Producto', 4, 'GENERAL', NULL, NULL),
(174, 'RQ-2026-0006', 11, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 19:59:32', 'Producto', 8, 'GENERAL', NULL, NULL),
(175, 'RQ-2026-0007', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 20:01:19', 'Producto', 4, 'GENERAL', NULL, NULL),
(176, 'RQ-2026-0008', 10, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 20:05:59', 'Producto', 4, 'GENERAL', NULL, NULL),
(177, 'RQ-2026-0009', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 20:16:30', 'Producto', 4, 'GENERAL', NULL, NULL),
(178, 'RQ-2026-0010', 8, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-28', 0.00, NULL, NULL, '2026-05-28 08:55:15', 'Producto', 8, 'GENERAL', NULL, NULL),
(179, 'RQ-2026-0011', 8, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-28', 0.00, NULL, NULL, '2026-05-28 08:55:43', 'Producto', 8, 'GENERAL', NULL, NULL),
(180, 'RQ-2026-0012', 10, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-28', 0.00, NULL, NULL, '2026-05-28 09:01:12', 'Producto', 8, 'GENERAL', NULL, NULL),
(181, 'RQ-2026-0013', 10, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-28', 0.00, NULL, NULL, '2026-05-28 14:02:45', 'Producto', 8, 'GENERAL', NULL, NULL),
(182, 'RQ-2026-0014', 8, 1, 1, 'Media', 'Sin firmar', NULL, '2026-05-28', 0.00, NULL, NULL, '2026-05-28 19:23:14', 'Producto', 8, 'GENERAL', NULL, NULL),
(183, 'RQ-2026-0015', 8, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-29', 0.00, NULL, NULL, '2026-05-29 14:10:37', 'Producto', 8, 'GENERAL', NULL, NULL),
(184, 'RQ-2026-0016', 3, 1, 1, 'Media', 'Sin firmar', NULL, '2026-06-04', 0.00, NULL, NULL, '2026-06-04 16:28:21', 'Producto', 8, 'GENERAL', NULL, NULL),
(185, 'RQ-2026-0017', 19, 2, 3, 'Media', 'Cotizado', NULL, '2026-06-05', 0.00, NULL, NULL, '2026-06-05 16:29:06', 'Producto', 8, 'GENERAL', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `requerimientos_backup_20260605`
--

CREATE TABLE `requerimientos_backup_20260605` (
  `id` int(11) NOT NULL DEFAULT 0,
  `codigo` varchar(50) DEFAULT NULL,
  `departamento_id` int(11) DEFAULT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `prioridad` enum('Baja','Media','Alta','Urgente') DEFAULT NULL,
  `estado` enum('Sin firmar','Pendiente','Evaluando','Cotizado','Aprobado','Denegado','Pagado','Observado') DEFAULT NULL,
  `comentarios` text DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `total` decimal(10,2) DEFAULT 0.00,
  `firmado_por` varchar(100) DEFAULT NULL,
  `fecha_firma` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo` enum('Producto','Servicio') DEFAULT 'Producto',
  `creador_id` int(11) DEFAULT NULL,
  `tipo_destino` enum('GENERAL','CARRERA','CURSO_CORTO') DEFAULT 'GENERAL',
  `carrera_id` int(11) DEFAULT NULL,
  `curso_corto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `requerimientos_backup_20260605`
--

INSERT INTO `requerimientos_backup_20260605` (`id`, `codigo`, `departamento_id`, `empresa_id`, `sede_id`, `prioridad`, `estado`, `comentarios`, `fecha`, `total`, `firmado_por`, `fecha_firma`, `created_at`, `tipo`, `creador_id`, `tipo_destino`, `carrera_id`, `curso_corto`) VALUES
(132, 'RQ-2026-0730', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-14', 0.00, NULL, NULL, '2026-05-13 23:59:10', 'Producto', 8, 'GENERAL', NULL, NULL),
(133, 'RQ-2026-5017', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-14', 0.00, NULL, NULL, '2026-05-14 16:00:05', 'Producto', 8, 'GENERAL', NULL, NULL),
(134, 'RQ-2026-8392', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-14', 0.00, NULL, NULL, '2026-05-14 19:12:08', 'Producto', 4, 'CURSO_CORTO', NULL, 'Preparación de Pizzas'),
(135, 'RQ-2026-2630', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-14', 0.00, NULL, NULL, '2026-05-14 20:18:12', 'Producto', 4, 'GENERAL', NULL, NULL),
(136, 'RQ-2026-7123', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 14:50:37', 'Producto', 4, 'GENERAL', NULL, NULL),
(137, 'RQ-2026-1582', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 15:44:41', 'Producto', 4, 'GENERAL', NULL, NULL),
(138, 'RQ-2026-2103', 3, 1, 2, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 16:52:32', 'Producto', 4, 'GENERAL', NULL, NULL),
(139, 'RQ-2026-3584', 3, 2, 3, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:01:53', 'Producto', 4, 'GENERAL', NULL, NULL),
(140, 'RQ-2026-2168', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:07:32', 'Producto', 4, 'GENERAL', NULL, NULL),
(141, 'RQ-2026-6956', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:14:17', 'Producto', 4, 'GENERAL', NULL, NULL),
(142, 'RQ-2026-1946', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:19:42', 'Producto', 8, 'GENERAL', NULL, NULL),
(143, 'RQ-2026-6888', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:20:06', 'Producto', 4, 'GENERAL', NULL, NULL),
(144, 'RQ-2026-2157', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:27:02', 'Producto', 4, 'GENERAL', NULL, NULL),
(145, 'RQ-2026-1094', 3, 1, 2, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 17:39:21', 'Producto', 4, 'GENERAL', NULL, NULL),
(146, 'RQ-2026-7572', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 19:15:37', 'Producto', 4, 'GENERAL', NULL, NULL),
(147, 'RQ-2026-7609', 3, 2, 3, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 19:19:17', 'Producto', 4, 'GENERAL', NULL, NULL),
(148, 'RQ-2026-5703', 3, 1, 2, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 19:55:15', 'Producto', 4, 'GENERAL', NULL, NULL),
(149, 'RQ-2026-1193', 3, 2, 3, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:00:01', 'Producto', 4, 'GENERAL', NULL, NULL),
(150, 'RQ-2026-9317', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:19:59', 'Producto', 8, 'GENERAL', NULL, NULL),
(151, 'RQ-2026-7586', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:20:37', 'Producto', 4, 'GENERAL', NULL, NULL),
(152, 'RQ-2026-4727', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:31:14', 'Producto', 4, 'GENERAL', NULL, NULL),
(153, 'RQ-2026-6158', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:38:56', 'Producto', 8, 'GENERAL', NULL, NULL),
(154, 'RQ-2026-1196', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:39:11', 'Producto', 4, 'GENERAL', NULL, NULL),
(155, 'RQ-2026-5248', 3, 2, 3, 'Media', 'Pendiente', NULL, '2026-05-15', 0.00, NULL, NULL, '2026-05-15 20:45:55', 'Producto', 4, 'GENERAL', NULL, NULL),
(156, 'RQ-2026-2273', 8, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-16', 0.00, NULL, NULL, '2026-05-16 16:39:12', 'Producto', 8, 'GENERAL', NULL, NULL),
(157, 'RQ-2026-6337', 8, 1, 2, 'Media', 'Pendiente', NULL, '2026-05-18', 0.00, NULL, NULL, '2026-05-18 14:42:46', 'Producto', 8, 'GENERAL', NULL, NULL),
(158, 'RQ-2026-4189', 10, 2, 3, 'Media', 'Pendiente', NULL, '2026-05-19', 0.00, NULL, NULL, '2026-05-19 13:24:54', 'Producto', 8, 'GENERAL', NULL, NULL),
(159, 'RQ-2026-2887', 3, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-20', 0.00, NULL, NULL, '2026-05-20 10:38:12', 'Producto', 8, 'GENERAL', NULL, NULL),
(160, 'RQ-2026-8707', 8, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-20', 0.00, NULL, NULL, '2026-05-20 20:02:38', 'Producto', 8, 'GENERAL', NULL, NULL),
(161, 'RQ-2026-1780', 8, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 06:05:41', 'Producto', 8, 'GENERAL', NULL, NULL),
(162, 'RQ-2026-7620', 8, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 07:00:07', 'Servicio', 8, 'GENERAL', NULL, NULL),
(163, 'RQ-2026-4834', 8, 1, 2, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 09:07:54', 'Producto', 8, 'GENERAL', NULL, NULL),
(164, 'RQ-2026-4023', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 16:25:44', 'Producto', 8, 'GENERAL', NULL, NULL),
(165, 'RQ-2026-4427', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 16:43:24', 'Producto', 8, 'GENERAL', NULL, NULL),
(166, 'RQ-2026-5468', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 16:53:45', 'Producto', 8, 'GENERAL', NULL, NULL),
(167, 'RQ-2026-1777', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-21', 0.00, NULL, NULL, '2026-05-21 16:59:11', 'Producto', 8, 'GENERAL', NULL, NULL),
(168, 'RQ-2026-1869', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-22', 0.00, NULL, NULL, '2026-05-22 03:17:51', 'Producto', 8, 'GENERAL', NULL, NULL),
(169, 'RQ-2026-0001', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-25', 0.00, NULL, NULL, '2026-05-25 13:35:23', 'Producto', 8, 'GENERAL', NULL, NULL),
(170, 'RQ-2026-0002', 10, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 19:28:26', 'Producto', 4, 'GENERAL', NULL, NULL),
(171, 'RQ-2026-0003', 10, 1, 1, 'Media', 'Sin firmar', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 19:30:50', 'Producto', 4, 'GENERAL', NULL, NULL),
(172, 'RQ-2026-0004', 10, 2, 3, 'Media', 'Cotizado', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 19:36:07', 'Producto', 4, 'GENERAL', NULL, NULL),
(173, 'RQ-2026-0005', 10, 1, 1, 'Media', 'Sin firmar', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 19:40:40', 'Producto', 4, 'GENERAL', NULL, NULL),
(174, 'RQ-2026-0006', 11, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 19:59:32', 'Producto', 8, 'GENERAL', NULL, NULL),
(175, 'RQ-2026-0007', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 20:01:19', 'Producto', 4, 'GENERAL', NULL, NULL),
(176, 'RQ-2026-0008', 10, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 20:05:59', 'Producto', 4, 'GENERAL', NULL, NULL),
(177, 'RQ-2026-0009', 10, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-27', 0.00, NULL, NULL, '2026-05-27 20:16:30', 'Producto', 4, 'GENERAL', NULL, NULL),
(178, 'RQ-2026-0010', 8, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-28', 0.00, NULL, NULL, '2026-05-28 08:55:15', 'Producto', 8, 'GENERAL', NULL, NULL),
(179, 'RQ-2026-0011', 8, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-28', 0.00, NULL, NULL, '2026-05-28 08:55:43', 'Producto', 8, 'GENERAL', NULL, NULL),
(180, 'RQ-2026-0012', 10, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-28', 0.00, NULL, NULL, '2026-05-28 09:01:12', 'Producto', 8, 'GENERAL', NULL, NULL),
(181, 'RQ-2026-0013', 10, 1, 1, 'Media', 'Cotizado', NULL, '2026-05-28', 0.00, NULL, NULL, '2026-05-28 14:02:45', 'Producto', 8, 'GENERAL', NULL, NULL),
(182, 'RQ-2026-0014', 8, 1, 1, 'Media', 'Sin firmar', NULL, '2026-05-28', 0.00, NULL, NULL, '2026-05-28 19:23:14', 'Producto', 8, 'GENERAL', NULL, NULL),
(183, 'RQ-2026-0015', 8, 1, 1, 'Media', 'Pendiente', NULL, '2026-05-29', 0.00, NULL, NULL, '2026-05-29 14:10:37', 'Producto', 8, 'GENERAL', NULL, NULL),
(184, 'RQ-2026-0016', 3, 1, 1, 'Media', 'Sin firmar', NULL, '2026-06-04', 0.00, NULL, NULL, '2026-06-04 16:28:21', 'Producto', 8, 'GENERAL', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sedes`
--

CREATE TABLE `sedes` (
  `id` int(11) NOT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `sedes`
--

INSERT INTO `sedes` (`id`, `empresa_id`, `nombre`) VALUES
(1, 1, 'PIURA'),
(2, 1, 'SULLANA'),
(3, 2, 'PIURA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_caja`
--

CREATE TABLE `solicitudes_caja` (
  `id` int(11) NOT NULL,
  `caja_id` int(11) DEFAULT NULL,
  `tipo` enum('APERTURA','RECARGA','CIERRE') DEFAULT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `centro_costo_id` int(11) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `motivo` text DEFAULT NULL,
  `codigo_solicitado` varchar(100) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `estado` enum('PENDIENTE_ADMIN','APROBADO_ADMIN','RECHAZADO_ADMIN','PENDIENTE_TESORERIA','PAGADO','ANULADO') DEFAULT 'PENDIENTE_ADMIN',
  `aprobado_admin_por` int(11) DEFAULT NULL,
  `fecha_aprobacion_admin` datetime DEFAULT NULL,
  `pagado_por` int(11) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `voucher_pago` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `solicitudes_caja`
--

INSERT INTO `solicitudes_caja` (`id`, `caja_id`, `tipo`, `empresa_id`, `sede_id`, `centro_costo_id`, `monto`, `motivo`, `codigo_solicitado`, `created_by`, `estado`, `aprobado_admin_por`, `fecha_aprobacion_admin`, `pagado_por`, `fecha_pago`, `voucher_pago`, `created_at`) VALUES
(7, 3, 'RECARGA', NULL, NULL, NULL, 1000.00, '2241eewfwefwe', NULL, 8, 'PAGADO', 8, '2026-06-03 08:08:50', 8, '2026-06-03 08:09:02', 'uploads/vouchers/6a20276e9fc11_c66128f2e5420e23.pdf', '2026-06-03 13:08:33'),
(8, 3, 'RECARGA', NULL, NULL, NULL, 1000.00, 'vdsvsdvsdhbrjtykyjt', NULL, 8, 'PAGADO', 8, '2026-06-04 08:25:24', 8, '2026-06-04 08:25:35', 'uploads/vouchers/6a217ccf45229_a395da9e09058819.png', '2026-06-04 13:25:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_fondo`
--

CREATE TABLE `solicitudes_fondo` (
  `id` int(11) NOT NULL,
  `codigo` varchar(20) DEFAULT NULL,
  `solicitante_id` int(11) NOT NULL,
  `departamento_solicitante` varchar(100) DEFAULT NULL,
  `departamento_id` int(11) NOT NULL,
  `empresa` varchar(120) DEFAULT NULL,
  `sede` varchar(120) DEFAULT NULL,
  `tipo` enum('ADELANTO','REEMBOLSO','VIATICOS') NOT NULL DEFAULT 'ADELANTO',
  `modo_pago` enum('ANTICIPADO','REEMBOLSO') DEFAULT 'ANTICIPADO',
  `categoria` varchar(100) DEFAULT NULL,
  `concepto` text DEFAULT NULL,
  `monto_solicitado` decimal(10,2) DEFAULT NULL,
  `monto_rendido` decimal(10,2) DEFAULT 0.00,
  `diferencia` decimal(10,2) DEFAULT 0.00,
  `estado` enum('SIN_FIRMAR','PENDIENTE','APROBADO','RECHAZADO','PAGADO','EN_RENDICION','POR_DEVOLVER','POR_REEMBOLSAR','CERRADO') DEFAULT 'SIN_FIRMAR',
  `firma_digital` longtext DEFAULT NULL,
  `firmado_por` int(11) DEFAULT NULL,
  `fecha_firma` datetime DEFAULT NULL,
  `aprobado_por` int(11) DEFAULT NULL,
  `fecha_aprobacion` datetime DEFAULT NULL,
  `pagado_por` int(11) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `solicitudes_fondo`
--

INSERT INTO `solicitudes_fondo` (`id`, `codigo`, `solicitante_id`, `departamento_solicitante`, `departamento_id`, `empresa`, `sede`, `tipo`, `modo_pago`, `categoria`, `concepto`, `monto_solicitado`, `monto_rendido`, `diferencia`, `estado`, `firma_digital`, `firmado_por`, `fecha_firma`, `aprobado_por`, `fecha_aprobacion`, `pagado_por`, `fecha_pago`, `observaciones`, `created_at`) VALUES
(82, 'FND-00009', 8, NULL, 10, 'EDUTUR E.I.R.L.', 'PIURA', 'ADELANTO', 'ANTICIPADO', 'Imprevisto', 'csfcsdcdscdsdcs', 12.00, 0.00, 0.00, 'APROBADO', NULL, 8, '2026-06-05 10:44:30', 8, '2026-06-05 10:44:32', NULL, NULL, NULL, '2026-06-04 14:09:06'),
(83, 'FND-00010', 8, NULL, 3, 'EDUTUR E.I.R.L.', 'PIURA', 'ADELANTO', 'ANTICIPADO', 'Viáticos', 'dsadsadasas', 12.00, 0.00, 0.00, 'APROBADO', NULL, 8, '2026-06-05 10:44:20', 8, '2026-06-05 10:44:24', NULL, NULL, NULL, '2026-06-04 14:16:38'),
(84, 'FND-00011', 8, NULL, 3, 'EDUTUR E.I.R.L.', 'PIURA', 'REEMBOLSO', 'ANTICIPADO', 'Imprevisto', 'dasdasdasdasdsa', 12.00, 12.00, 0.00, 'CERRADO', NULL, 8, '2026-06-05 09:53:09', 8, '2026-06-05 10:11:14', 8, '2026-06-05 10:44:55', NULL, '2026-06-05 14:53:02'),
(85, 'FND-00012', 8, NULL, 11, 'EDUTUR E.I.R.L.', 'PIURA', 'REEMBOLSO', 'ANTICIPADO', 'Transporte', 'csacascascas', 11.00, 12.00, -1.00, 'CERRADO', NULL, 8, '2026-06-05 10:47:57', 8, '2026-06-05 10:48:38', 8, '2026-06-05 10:49:14', NULL, '2026-06-05 15:47:54'),
(86, 'FND-00013', 8, NULL, 10, 'EDUTUR E.I.R.L.', 'PIURA', 'ADELANTO', 'ANTICIPADO', 'Imprevisto', 'ccascas', 11.00, 11.00, 0.00, 'CERRADO', NULL, 8, '2026-06-05 10:49:59', 8, '2026-06-05 10:50:02', 8, '2026-06-05 10:50:20', NULL, '2026-06-05 15:49:53'),
(87, 'FND-00014', 8, NULL, 19, 'EDUTUR E.I.R.L.', 'PIURA', 'REEMBOLSO', 'ANTICIPADO', 'Imprevisto', 'vavavsdvsdvs', 12.00, 12.00, 0.00, 'CERRADO', NULL, 8, '2026-06-05 11:29:38', 8, '2026-06-05 11:30:20', 8, '2026-06-05 11:32:00', NULL, '2026-06-05 16:29:34');

--
-- Disparadores `solicitudes_fondo`
--
DELIMITER $$
CREATE TRIGGER `trg_solicitudes_fondo_insert_notificaciones` AFTER INSERT ON `solicitudes_fondo` FOR EACH ROW BEGIN

    IF NEW.estado = 'SIN_FIRMAR' THEN
        
        -- NOTIFICACIONES para el JEFE del departamento
        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            requerimiento_id,
            referencia_estado
        )
        SELECT
            u.id,
            'Nueva solicitud de fondos',
            CONCAT('La solicitud ', NEW.codigo, ' - ', LEFT(NEW.concepto, 50), ' requiere su firma'),
            'FONDOS_FIRMA',
            NEW.id,
            CONCAT('FIRMA_', NEW.id)
        FROM usuarios u
        WHERE u.departamento_id = NEW.departamento_id
        AND u.tipo = 'jefe';
        
        -- COLA CORREOS (sin cambios)
        INSERT INTO cola_correos
        (
            usuario_id,
            destinatario,
            nombre,
            asunto,
            mensaje
        )
        SELECT
            u.id,
            u.usuario,
            u.nombre,
            CONCAT('Nueva solicitud de fondos - ', NEW.codigo),
            CONCAT(
                '<div style="font-family: ''Segoe UI'', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;">',
                '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;">',
                '    <div style="background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;">',
                '      <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Gestión de Fondos</h2>',
                '    </div>',
                '    <div style="padding: 30px;">',
                '      <p style="margin-top: 0; font-size: 16px;">Estimado(a) <strong>Jefe de Departamento</strong>,</p>',
                '      <p style="color: #555555;">Se ha creado una nueva solicitud de fondos que requiere su firma para continuar con el flujo.</p>',
                '      <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;">',
                '        <thead>',
                '          <tr style="background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;">',
                '            <th style="padding: 12px; text-align: left; color: #800020; font-weight: bold;">Campo</th>',
                '            <th style="padding: 12px; text-align: left; color: #800020; font-weight: bold;">Detalle</th>',
                '           </td>',
                '        </thead>',
                '        <tbody>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555; width: 35%;">Código Solicitud</td>',
                '            <td style="padding: 12px; color: #333333;">', NEW.codigo, '</td>',
                '           </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Tipo</td>',
                '            <td style="padding: 12px; color: #333333;">', 
                    CASE NEW.tipo 
                        WHEN 'ADELANTO' THEN 'ANTICIPO'
                        WHEN 'REEMBOLSO' THEN 'REEMBOLSO'
                        WHEN 'VIATICOS' THEN 'VIÁTICOS'
                        ELSE NEW.tipo 
                    END, 
                '</td>',
                '           </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Concepto</td>',
                '            <td style="padding: 12px; color: #333333;">', COALESCE(NEW.concepto, 'Sin concepto'), '</td>',
                '           </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Monto Solicitado</td>',
                '            <td style="padding: 12px; color: #333333; font-weight: bold;">S/ ', FORMAT(NEW.monto_solicitado, 2), '</td>',
                '           </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Empresa / Sede</td>',
                '            <td style="padding: 12px; color: #333333;">', COALESCE(NEW.empresa, '-'), ' - ', COALESCE(NEW.sede, '-'), '</td>',
                '           </tr>',
                '        </tbody>',
                '      </table>',
                '      <div style="text-align: center; margin-top: 30px;">',
                '        <p style="font-size: 14px; color: #777777; margin-bottom: 15px;">Por favor, ingrese al sistema para firmar o rechazar la solicitud.</p>',
                '      </div>',
                '    </div>',
                '    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;">',
                '      <p style="margin: 0; font-weight: bold; color: #800020;">Sistema de Gestión CETURGH</p>',
                '      <p style="margin: 5px 0 0 0;">Este es un mensaje automático, por favor no responder a este correo.</p>',
                '    </div>',
                '  </div>',
                '</div>'
            )
        FROM usuarios u
        WHERE u.departamento_id = NEW.departamento_id
        AND u.tipo = 'jefe';
        
    END IF;

END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_solicitudes_fondo_update_notificaciones` AFTER UPDATE ON `solicitudes_fondo` FOR EACH ROW BEGIN

    DECLARE depto_nombre VARCHAR(100);
    DECLARE tipo_fondo VARCHAR(20);
    
    -- Obtener nombre del departamento solicitante
    SELECT d.nombre INTO depto_nombre
    FROM departamentos d
    WHERE d.id = NEW.departamento_id;
    
    SET tipo_fondo = CASE NEW.tipo 
        WHEN 'ADELANTO' THEN 'ANTICIPO'
        WHEN 'REEMBOLSO' THEN 'REEMBOLSO'
        WHEN 'VIATICOS' THEN 'VIÁTICOS'
        ELSE NEW.tipo 
    END;

    -- =========================================
    -- FIRMADO (cambia de SIN_FIRMAR a PENDIENTE)
    -- =========================================
    
    IF NEW.estado = 'PENDIENTE' AND OLD.estado = 'SIN_FIRMAR' THEN
        
        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            requerimiento_id,
            referencia_estado
        )
        SELECT
            u.id,
            'Solicitud firmada',
            CONCAT('La solicitud ', NEW.codigo, ' está pendiente de aprobación'),
            'FONDOS_APROBAR',
            NEW.id,
            CONCAT('APROBAR_', NEW.id)
        FROM usuarios u
        INNER JOIN departamentos d ON d.id = u.departamento_id
        WHERE d.nombre IN ('ADMINISTRACION', 'ADMINISTRACIÓN');
        
        INSERT INTO cola_correos
        (
            usuario_id,
            destinatario,
            nombre,
            asunto,
            mensaje
        )
        SELECT
            u.id,
            u.usuario,
            u.nombre,
            CONCAT('Solicitud pendiente de aprobación - ', NEW.codigo),
            CONCAT(
                '<div style="font-family: ''Segoe UI'', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;">',
                '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;">',
                '    <div style="background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;">',
                '      <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Aprobación de Solicitud</h2>',
                '    </div>',
                '    <div style="padding: 30px;">',
                '      <p style="margin-top: 0; font-size: 16px;">Estimado equipo de <strong>Administración</strong>,</p>',
                '      <p style="color: #555555;">La solicitud ha sido firmada por el jefe de departamento y se encuentra pendiente de su aprobación.</p>',
                '      <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;">',
                '        <thead>',
                '          <tr style="background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;">',
                '            <th style="padding: 12px; text-align: left; color: #800020; font-weight: bold;">Campo</th>',
                '            <th style="padding: 12px; text-align: left; color: #800020; font-weight: bold;">Detalle</th>',
                '           </td>',
                '        </thead>',
                '        <tbody>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555; width: 35%;">Código Solicitud</td>',
                '            <td style="padding: 12px; color: #333333;">', NEW.codigo, '</td>',
                '           </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Departamento</td>',
                '            <td style="padding: 12px; color: #333333;">', COALESCE(depto_nombre, '-'), '</td>',
                '           </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Tipo</td>',
                '            <td style="padding: 12px; color: #333333;">', tipo_fondo, '</td>',
                '           </tr>',
                '          <tr style="border-bottom: 1px solid #eeeeee;">',
                '            <td style="padding: 12px; font-weight: bold; color: #555555;">Monto</td>',
                '            <td style="padding: 12px; color: #333333; font-weight: bold;">S/ ', FORMAT(NEW.monto_solicitado, 2), '</td>',
                '           </tr>',
                '        </tbody>',
                '      </table>',
                '      <div style="text-align: center; margin-top: 30px;">',
                '        <p style="font-size: 14px; color: #777777; margin-bottom: 15px;">Por favor, ingrese al sistema para aprobar o rechazar la solicitud.</p>',
                '      </div>',
                '    </div>',
                '    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;">',
                '      <p style="margin: 0; font-weight: bold; color: #800020;">Sistema de Gestión CETURGH</p>',
                '      <p style="margin: 5px 0 0 0;">Este es un mensaje automático, por favor no responder a este correo.</p>',
                '    </div>',
                '  </div>',
                '</div>'
            )
        FROM usuarios u
        INNER JOIN departamentos d ON d.id = u.departamento_id
        WHERE d.nombre IN ('ADMINISTRACION', 'ADMINISTRACIÓN');
        
    END IF;

    -- =========================================
    -- APROBADO
    -- =========================================
    
    IF NEW.estado = 'APROBADO' AND OLD.estado = 'PENDIENTE' THEN
        
        IF NEW.tipo IN ('ADELANTO', 'VIATICOS') THEN
            
            INSERT INTO notificaciones
            (
                usuario_id,
                titulo,
                mensaje,
                tipo,
                requerimiento_id,
                referencia_estado
            )
            SELECT
                u.id,
                'Solicitud aprobada - Pendiente de pago',
                CONCAT('La solicitud ', NEW.codigo, ' está aprobada y espera pago de tesorería'),
                'FONDOS_PAGAR',
                NEW.id,
                CONCAT('PAGAR_', NEW.id)
            FROM usuarios u
            INNER JOIN departamentos d ON d.id = u.departamento_id
            WHERE d.nombre IN ('TESORERIA', 'TESORERÍA');
            
            INSERT INTO cola_correos
            (
                usuario_id,
                destinatario,
                nombre,
                asunto,
                mensaje
            )
            SELECT
                u.id,
                u.usuario,
                u.nombre,
                CONCAT('Solicitud aprobada - Pago pendiente - ', NEW.codigo),
                CONCAT(
                    '<div style="font-family: ''Segoe UI'', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;">',
                    '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;">',
                    '    <div style="background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;">',
                    '      <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Pago Pendiente - Tesorería</h2>',
                    '    </div>',
                    '    <div style="padding: 30px;">',
                    '      <p style="margin-top: 0; font-size: 16px;">Estimado equipo de <strong>Tesorería</strong>,</p>',
                    '      <p style="color: #555555;">La solicitud ha sido aprobada y requiere el desembolso correspondiente.</p>',
                    '      <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;">',
                    '        <thead>',
                    '          <tr style="background-color: #f5f5f5; border-bottom: 2px solid #D4AF37;">',
                    '            <th style="padding: 12px; text-align: left; color: #800020; font-weight: bold;">Campo</th>',
                    '            <th style="padding: 12px; text-align: left; color: #800020; font-weight: bold;">Detalle</th>',
                    '           </td>',
                    '        </thead>',
                    '        <tbody>',
                    '          <tr style="border-bottom: 1px solid #eeeeee;">',
                    '            <td style="padding: 12px; font-weight: bold; color: #555555; width: 35%;">Código Solicitud</td>',
                    '            <td style="padding: 12px; color: #333333;">', NEW.codigo, '</td>',
                    '           </tr>',
                    '          <tr style="border-bottom: 1px solid #eeeeee;">',
                    '            <td style="padding: 12px; font-weight: bold; color: #555555;">Tipo</td>',
                    '            <td style="padding: 12px; color: #333333;">', tipo_fondo, '</td>',
                    '           </tr>',
                    '          <tr style="border-bottom: 1px solid #eeeeee;">',
                    '            <td style="padding: 12px; font-weight: bold; color: #555555;">Monto a Pagar</td>',
                    '            <td style="padding: 12px; color: #333333; font-weight: bold;">S/ ', FORMAT(NEW.monto_solicitado, 2), '</td>',
                    '           </tr>',
                    '          <tr style="border-bottom: 1px solid #eeeeee;">',
                    '            <td style="padding: 12px; font-weight: bold; color: #555555;">Concepto</td>',
                    '            <td style="padding: 12px; color: #333333;">', COALESCE(NEW.concepto, '-'), '</td>',
                    '           </tr>',
                    '        </tbody>',
                    '      </table>',
                    '      <div style="text-align: center; margin-top: 30px;">',
                    '        <p style="font-size: 14px; color: #777777; margin-bottom: 15px;">Por favor, proceda con el pago y suba el comprobante al sistema.</p>',
                    '      </div>',
                    '    </div>',
                    '    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;">',
                    '      <p style="margin: 0; font-weight: bold; color: #800020;">Sistema de Gestión CETURGH</p>',
                    '      <p style="margin: 5px 0 0 0;">Este es un mensaje automático, por favor no responder a este correo.</p>',
                    '    </div>',
                    '  </div>',
                    '</div>'
                )
            FROM usuarios u
            INNER JOIN departamentos d ON d.id = u.departamento_id
            WHERE d.nombre IN ('TESORERIA', 'TESORERÍA');
            
        END IF;
        
        IF NEW.tipo = 'REEMBOLSO' THEN
            
            INSERT INTO notificaciones
            (
                usuario_id,
                titulo,
                mensaje,
                tipo,
                requerimiento_id,
                referencia_estado
            )
            VALUES
            (
                NEW.solicitante_id,
                'Solicitud aprobada',
                CONCAT('Su solicitud ', NEW.codigo, ' ha sido aprobada. Puede proceder a registrar sus gastos.'),
                'FONDOS_GASTOS',
                NEW.id,
                CONCAT('GASTOS_', NEW.id)
            );
            
            INSERT INTO cola_correos
            (
                usuario_id,
                destinatario,
                nombre,
                asunto,
                mensaje
            )
            SELECT
                u.id,
                u.usuario,
                u.nombre,
                CONCAT('Solicitud aprobada - Registre sus gastos - ', NEW.codigo),
                CONCAT(
                    '<div style="font-family: ''Segoe UI'', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;">',
                    '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #800020;">',
                    '    <div style="background-color: #800020; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;">',
                    '      <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Solicitud Aprobada - Reembolso</h2>',
                    '    </div>',
                    '    <div style="padding: 30px;">',
                    '      <p style="margin-top: 0; font-size: 16px;">Estimado(a) colaborador(a),</p>',
                    '      <p style="color: #555555;">Su solicitud de reembolso ha sido <strong>APROBADA</strong>. Por favor, proceda a registrar los gastos realizados.</p>',
                    '      <p style="color: #555555; margin-top: 15px;">Una vez registrados los gastos, tesorería realizará el reembolso correspondiente.</p>',
                    '      <div style="text-align: center; margin-top: 30px;">',
                    '        <p style="font-size: 14px; color: #777777; margin-bottom: 15px;">Ingrese al sistema para registrar sus comprobantes de gasto.</p>',
                    '      </div>',
                    '    </div>',
                    '    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;">',
                    '      <p style="margin: 0; font-weight: bold; color: #800020;">Sistema de Gestión CETURGH</p>',
                    '      <p style="margin: 5px 0 0 0;">Este es un mensaje automático, por favor no responder a este correo.</p>',
                    '    </div>',
                    '  </div>',
                    '</div>'
                )
            FROM usuarios u
            WHERE u.id = NEW.solicitante_id;
            
        END IF;
        
    END IF;

    -- =========================================
    -- RECHAZADO
    -- =========================================
    
    IF NEW.estado = 'RECHAZADO' AND OLD.estado != 'RECHAZADO' THEN
        
        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            requerimiento_id,
            referencia_estado
        )
        VALUES
        (
            NEW.solicitante_id,
            'Solicitud rechazada',
            CONCAT('Su solicitud ', NEW.codigo, ' ha sido rechazada. Motivo: ', COALESCE(NEW.observaciones, 'No especificado')),
            'FONDOS_RECHAZO',
            NEW.id,
            CONCAT('RECHAZO_', NEW.id)
        );
        
        INSERT INTO cola_correos
        (
            usuario_id,
            destinatario,
            nombre,
            asunto,
            mensaje
        )
        SELECT
            u.id,
            u.usuario,
            u.nombre,
            CONCAT('Solicitud rechazada - ', NEW.codigo),
            CONCAT(
                '<div style="font-family: ''Segoe UI'', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;">',
                '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #dc3545;">',
                '    <div style="background-color: #dc3545; padding: 25px; text-align: center; border-bottom: 3px solid #ffc107;">',
                '      <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Solicitud Rechazada</h2>',
                '    </div>',
                '    <div style="padding: 30px;">',
                '      <p style="margin-top: 0; font-size: 16px;">Estimado(a) colaborador(a),</p>',
                '      <p style="color: #555555;">Lamentamos informarle que su solicitud ha sido <strong>RECHAZADA</strong>.</p>',
                '      <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; border-radius: 4px;">',
                '        <p style="margin: 0; font-size: 14px; color: #721c24;">',
                '          <strong>Motivo del rechazo:</strong><br>',
                '          ', COALESCE(NEW.observaciones, 'No se especificó un motivo'), '',
                '        </p>',
                '      </div>',
                '      <div style="text-align: center; margin-top: 30px;">',
                '        <p style="font-size: 14px; color: #777777; margin-bottom: 15px;">Puede crear una nueva solicitud corrigiendo las observaciones indicadas.</p>',
                '      </div>',
                '    </div>',
                '    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;">',
                '      <p style="margin: 0; font-weight: bold; color: #800020;">Sistema de Gestión CETURGH</p>',
                '      <p style="margin: 5px 0 0 0;">Este es un mensaje automático, por favor no responder a este correo.</p>',
                '    </div>',
                '  </div>',
                '</div>'
            )
        FROM usuarios u
        WHERE u.id = NEW.solicitante_id;
        
    END IF;

    -- =========================================
    -- PAGADO
    -- =========================================
    
    IF NEW.estado = 'PAGADO' AND OLD.estado = 'APROBADO' AND NEW.tipo IN ('ADELANTO', 'VIATICOS') THEN
        
        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            requerimiento_id,
            referencia_estado
        )
        VALUES
        (
            NEW.solicitante_id,
            'Pago registrado - Pendiente de rendición',
            CONCAT('El pago de su solicitud ', NEW.codigo, ' ha sido registrado. Debe presentar la rendición de gastos.'),
            'FONDOS_RENDIR',
            NEW.id,
            CONCAT('RENDIR_', NEW.id)
        );
        
        INSERT INTO cola_correos
        (
            usuario_id,
            destinatario,
            nombre,
            asunto,
            mensaje
        )
        SELECT
            u.id,
            u.usuario,
            u.nombre,
            CONCAT('Pago registrado - Rendición pendiente - ', NEW.codigo),
            CONCAT(
                '<div style="font-family: ''Segoe UI'', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;">',
                '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #28a745;">',
                '    <div style="background-color: #28a745; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;">',
                '      <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Pago Registrado</h2>',
                '    </div>',
                '    <div style="padding: 30px;">',
                '      <p style="margin-top: 0; font-size: 16px;">Estimado(a) colaborador(a),</p>',
                '      <p style="color: #555555;">Se ha registrado el pago correspondiente a su solicitud de <strong>', tipo_fondo, '</strong>.</p>',
                '      <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;">',
                '        <p style="margin: 0; font-size: 14px; color: #155724;">',
                '          <strong>Monto entregado:</strong> S/ ', FORMAT(NEW.monto_solicitado, 2),
                '        </p>',
                '      </div>',
                '      <p style="color: #555555; margin-top: 15px;"><strong>IMPORTANTE:</strong> Debe presentar la rendición documentaria de los gastos realizados dentro del plazo establecido.</p>',
                '      <div style="text-align: center; margin-top: 30px;">',
                '        <p style="font-size: 14px; color: #777777; margin-bottom: 15px;">Ingrese al sistema para subir sus comprobantes de gasto.</p>',
                '      </div>',
                '    </div>',
                '    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;">',
                '      <p style="margin: 0; font-weight: bold; color: #800020;">Sistema de Gestión CETURGH</p>',
                '      <p style="margin: 5px 0 0 0;">Este es un mensaje automático, por favor no responder a este correo.</p>',
                '    </div>',
                '  </div>',
                '</div>'
            )
        FROM usuarios u
        WHERE u.id = NEW.solicitante_id;
        
    END IF;

    -- =========================================
    -- CERRADO
    -- =========================================
    
    IF NEW.estado = 'CERRADO' AND OLD.estado != 'CERRADO' THEN
        
        INSERT INTO notificaciones
        (
            usuario_id,
            titulo,
            mensaje,
            tipo,
            requerimiento_id,
            referencia_estado
        )
        VALUES
        (
            NEW.solicitante_id,
            'Proceso finalizado',
            CONCAT('La solicitud ', NEW.codigo, ' ha sido cerrada exitosamente.'),
            'FONDOS_CERRADO',
            NEW.id,
            CONCAT('CERRADO_', NEW.id)
        );
        
        INSERT INTO cola_correos
        (
            usuario_id,
            destinatario,
            nombre,
            asunto,
            mensaje
        )
        SELECT
            u.id,
            u.usuario,
            u.nombre,
            CONCAT('Solicitud cerrada - ', NEW.codigo),
            CONCAT(
                '<div style="font-family: ''Segoe UI'', Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333333; line-height: 1.6;">',
                '  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 5px solid #6c757d;">',
                '    <div style="background-color: #6c757d; padding: 25px; text-align: center; border-bottom: 3px solid #D4AF37;">',
                '      <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Proceso Finalizado</h2>',
                '    </div>',
                '    <div style="padding: 30px;">',
                '      <p style="margin-top: 0; font-size: 16px;">Estimado(a) colaborador(a),</p>',
                '      <p style="color: #555555;">Le informamos que su solicitud de <strong>', tipo_fondo, '</strong> ha sido <strong>CERRADA EXITOSAMENTE</strong>.</p>',
                '      <div style="background-color: #e9ecef; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0; border-radius: 4px;">',
                '        <p style="margin: 0; font-size: 14px; color: #383d41;">',
                '          <strong>Total rendido:</strong> S/ ', FORMAT(COALESCE(NEW.monto_rendido, 0), 2), '<br>',
                '          <strong>Diferencia:</strong> S/ ', FORMAT(COALESCE(NEW.diferencia, 0), 2),
                '        </p>',
                '      </div>',
                '      <p style="color: #555555;">Agradecemos su gestión y cumplimiento de los procedimientos establecidos.</p>',
                '    </div>',
                '    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;">',
                '      <p style="margin: 0; font-weight: bold; color: #800020;">Sistema de Gestión CETURGH</p>',
                '      <p style="margin: 5px 0 0 0;">Este es un mensaje automático, por favor no responder a este correo.</p>',
                '    </div>',
                '  </div>',
                '</div>'
            )
        FROM usuarios u
        WHERE u.id = NEW.solicitante_id;
        
    END IF;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_archivos`
--

CREATE TABLE `solicitud_archivos` (
  `id` int(11) NOT NULL,
  `solicitud_id` int(11) NOT NULL,
  `gasto_id` int(11) DEFAULT NULL,
  `tipo` enum('SOLICITUD','PAGO_TESORERIA','RENDICION','DEVOLUCION','REEMBOLSO') DEFAULT NULL,
  `nombre_original` varchar(255) DEFAULT NULL,
  `nombre_guardado` varchar(255) DEFAULT NULL,
  `ruta` varchar(255) DEFAULT NULL,
  `subido_por` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `solicitud_archivos`
--

INSERT INTO `solicitud_archivos` (`id`, `solicitud_id`, `gasto_id`, `tipo`, `nombre_original`, `nombre_guardado`, `ruta`, `subido_por`, `created_at`) VALUES
(155, 84, NULL, 'PAGO_TESORERIA', 'transacción_10721-LACCEI2026-1611.pdf', '6a22eef7b0c4e_1780674295.pdf', 'uploads/pagos/6a22eef7b0c4e_1780674295.pdf', 8, '2026-06-05 15:44:55'),
(156, 85, NULL, 'PAGO_TESORERIA', 'Plataforma STEAM con IA (1).pdf', '6a22effa822ab_1780674554.pdf', 'uploads/pagos/6a22effa822ab_1780674554.pdf', 8, '2026-06-05 15:49:14'),
(157, 86, NULL, 'PAGO_TESORERIA', 'Planilla_Rendicion_REND-2026-00004.pdf', '6a22f03c29ae6_1780674620.pdf', 'uploads/pagos/6a22f03c29ae6_1780674620.pdf', 8, '2026-06-05 15:50:20'),
(158, 86, 38, 'RENDICION', 'DNI_CASTRO_PABLO.pdf', '6a22f04f317a2_1780674639.pdf', 'uploads/gastos/6a22f04f317a2_1780674639.pdf', 8, '2026-06-05 15:50:39'),
(159, 87, 39, 'RENDICION', '02-Reglamento-institucional-2025-a-2030-2.pdf', '6a22f98313e64_1780676995.pdf', 'uploads/gastos/6a22f98313e64_1780676995.pdf', 8, '2026-06-05 16:29:55'),
(160, 87, NULL, 'PAGO_TESORERIA', 'Plataforma STEAM con IA (1).pdf', '6a22fa0071e19_1780677120.pdf', 'uploads/pagos/6a22fa0071e19_1780677120.pdf', 8, '2026-06-05 16:32:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_gastos`
--

CREATE TABLE `solicitud_gastos` (
  `id` int(11) NOT NULL,
  `solicitud_id` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `proveedor` varchar(200) DEFAULT NULL,
  `documento_proveedor` varchar(20) DEFAULT NULL,
  `tipo_proveedor` enum('EMPRESA','PERSONA','OTROS') DEFAULT 'EMPRESA',
  `tipo_comprobante` varchar(50) DEFAULT NULL,
  `numero_comprobante` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `solicitud_gastos`
--

INSERT INTO `solicitud_gastos` (`id`, `solicitud_id`, `fecha`, `proveedor`, `documento_proveedor`, `tipo_proveedor`, `tipo_comprobante`, `numero_comprobante`, `descripcion`, `monto`) VALUES
(36, 84, '2026-06-05', '312312', '', 'OTROS', 'Ticket', 'c221', 'csdcsdcsd', 12.00),
(37, 85, '2026-06-05', 'cdscsdc', '', 'OTROS', 'Factura', 'c1212', 'csdcsdcsd', 12.00),
(38, 86, '2026-06-05', 'dwdd', '', 'OTROS', 'Boleta', '23', 'dadasd', 11.00),
(39, 87, '2026-06-05', 'dqwdqwdwq', '', 'OTROS', 'Factura', '213', 'cccqeeqfeq', 12.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitud_historial`
--

CREATE TABLE `solicitud_historial` (
  `id` int(11) NOT NULL,
  `solicitud_id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `accion` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `solicitud_historial`
--

INSERT INTO `solicitud_historial` (`id`, `solicitud_id`, `usuario_id`, `accion`, `descripcion`, `created_at`) VALUES
(308, 82, 8, 'CREAR', 'Solicitud creada con código: FND-00009', '2026-06-04 14:09:06'),
(309, 83, 8, 'CREAR', 'Solicitud creada con código: FND-00010', '2026-06-04 14:16:38'),
(310, 84, 8, 'CREAR', 'Solicitud creada con código: FND-00011', '2026-06-05 14:53:02'),
(311, 84, 8, 'FIRMAR', 'Solicitud firmada por el jefe de departamento', '2026-06-05 14:53:09'),
(312, 84, 8, 'ENVIAR_RENDICION', 'Rendición enviada a tesorería con 1 gastos registrados. Total rendido: S/ 12.00. Rendición cuadrada correctamente.', '2026-06-05 15:10:55'),
(313, 84, 8, 'APROBAR', 'Solicitud aprobada por administración', '2026-06-05 15:11:14'),
(314, 83, 8, 'FIRMAR', 'Solicitud firmada por el jefe de departamento', '2026-06-05 15:44:20'),
(315, 83, 8, 'APROBAR', 'Solicitud aprobada por administración', '2026-06-05 15:44:24'),
(316, 82, 8, 'FIRMAR', 'Solicitud firmada por el jefe de departamento', '2026-06-05 15:44:30'),
(317, 82, 8, 'APROBAR', 'Solicitud aprobada por administración', '2026-06-05 15:44:32'),
(318, 84, 8, 'PAGAR', 'Reembolso realizado por S/ 12.00. Proceso cerrado.', '2026-06-05 15:44:55'),
(319, 85, 8, 'CREAR', 'Solicitud creada con código: FND-00012', '2026-06-05 15:47:54'),
(320, 85, 8, 'FIRMAR', 'Solicitud firmada por el jefe de departamento', '2026-06-05 15:47:57'),
(321, 85, 8, 'ENVIAR_RENDICION', 'Rendición enviada a tesorería con 1 gastos registrados. Total rendido: S/ 12.00. Diferencia de S/ 1.00 a favor del solicitante (tesorería debe reembolsar).', '2026-06-05 15:48:18'),
(322, 85, 8, 'APROBAR', 'Solicitud aprobada por administración', '2026-06-05 15:48:38'),
(323, 85, 8, 'PAGAR', 'Reembolso realizado por S/ 12.00. Proceso cerrado.', '2026-06-05 15:49:14'),
(324, 86, 8, 'CREAR', 'Solicitud creada con código: FND-00013', '2026-06-05 15:49:53'),
(325, 86, 8, 'FIRMAR', 'Solicitud firmada por el jefe de departamento', '2026-06-05 15:49:59'),
(326, 86, 8, 'APROBAR', 'Solicitud aprobada por administración', '2026-06-05 15:50:02'),
(327, 86, 8, 'PAGAR', 'Desembolso realizado por S/ 11.00. Pendiente de rendición.', '2026-06-05 15:50:20'),
(328, 86, 8, 'ENVIAR_RENDICION', 'Rendición enviada a tesorería con 1 gastos registrados. Total rendido: S/ 11.00. Rendición cuadrada correctamente.', '2026-06-05 15:50:43'),
(329, 87, 8, 'CREAR', 'Solicitud creada con código: FND-00014', '2026-06-05 16:29:34'),
(330, 87, 8, 'FIRMAR', 'Solicitud firmada por el jefe de departamento', '2026-06-05 16:29:38'),
(331, 87, 8, 'ENVIAR_RENDICION', 'Rendición enviada a tesorería con 1 gastos registrados. Total rendido: S/ 12.00. Rendición cuadrada correctamente.', '2026-06-05 16:30:00'),
(332, 87, 8, 'APROBAR', 'Solicitud aprobada por administración', '2026-06-05 16:30:20'),
(333, 87, 8, 'PAGAR', 'Reembolso realizado por S/ 12.00. Proceso cerrado.', '2026-06-05 16:32:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trabajadores`
--

CREATE TABLE `trabajadores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `cargo` varchar(150) DEFAULT NULL,
  `tipoContrato` enum('Planilla','Recibo x Honorarios','Servicios Externos') DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'Activo',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `empresa_id` int(11) DEFAULT NULL,
  `sede_id` int(11) DEFAULT NULL,
  `tipo_personal` enum('DOCENTE','CHEF','ADMIN') DEFAULT 'ADMIN',
  `numero_cuenta` varchar(50) DEFAULT NULL,
  `cci` varchar(50) DEFAULT NULL,
  `tipo_documento` varchar(20) DEFAULT 'DNI',
  `numero_documento` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `trabajadores`
--

INSERT INTO `trabajadores` (`id`, `nombre`, `cargo`, `tipoContrato`, `estado`, `fecha_registro`, `empresa_id`, `sede_id`, `tipo_personal`, `numero_cuenta`, `cci`, `tipo_documento`, `numero_documento`) VALUES
(10, 'Pablo Cesar Castro Timaná', 'ASISTENTE TIC', 'Planilla', 'Activo', '2026-05-18 14:54:44', 1, 2, 'ADMIN', '25259280525052050505', '', 'DNI', '77777777');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(100) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `documento` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `tipo_documento` enum('DNI','CE') DEFAULT 'DNI',
  `password` varchar(255) DEFAULT NULL,
  `tipo` enum('admin','jefe','asistente','logistica','tesoreria') DEFAULT 'asistente',
  `departamento_id` int(11) DEFAULT NULL,
  `firma` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `nombre`, `documento`, `telefono`, `tipo_documento`, `password`, `tipo`, `departamento_id`, `firma`) VALUES
(4, 'asistente.tic@ceturghperu.edu.pe', 'Pablo Castro Timana', '75307827', '939427488', 'DNI', '$2y$10$oj14EIUQ4vb8FHPQq4HcS.houY4ZrczNVhvxzn3KUthfbo77OGBWG', 'jefe', 10, 'firmas/firma_6a0c6b9e71a99.jpeg'),
(8, 'admin@c.com', 'Perfil Prueba', '76567566', '939427488', 'DNI', '$2y$10$wSCKxZBC8QwbN9PfROtG9.FkvrAiZThSjrAFacTTcZdd7cbTFG9S6', 'jefe', 11, 'firmas/firma_6a0f4e5eeee6e.jpeg'),
(12, 'juegapablo28@gmail.com', 'LISSETH MADELEINE BRICEÑO MAZA', '71103989', '939427488', 'DNI', '$2y$10$hDJUjGC9bEcc3auRYp71MOzeAgcpHonPSYGMZSPc04fOJfiFQ4NSG', 'jefe', 8, 'firmas/firma_6a0c6b8f87815.jpeg'),
(13, 'oliver.holguin@ceturghperu.edu.pe', 'OLIVER HOLGUIN LLACSAHUANGA', '70367686', NULL, 'DNI', '$2y$10$5AqHnzrIzxTdLV2QiovsreO9JGng5EHCX2CvSAUVZ0kw28vWr9rXe', 'jefe', 9, NULL),
(14, 'eliana.takury9@gmail.com', 'ELIANA TAKURY BARRANTES', '73180322', NULL, 'DNI', '$2y$10$9o.QgrHcmIG8AxYf0m869ephCzhJ2RZfBCRWTkGFUjYZlDQmb1E/W', 'asistente', 7, NULL),
(15, 'paola.barahona@ceturghperu.edu.pe', 'PAOLA MERCEDES BARAHONA CHAU', '73180322', NULL, 'DNI', '$2y$10$Vl9mye3JUVlIx1BrFTVLDepfSG0QQm5uJpKxJM9QxEpwtd05uQdmS', 'jefe', 7, NULL),
(16, 'auxiliar.academico@ceturghperu.edu.pe', 'KEIKO YAJAIRA CRUZ FLORES', '72104731', NULL, 'DNI', '$2y$10$YnsWz9AZPbjDL2pyRwnVjenyit0XNbOD6joswXPGZJeMDldMCbGnG', 'asistente', 15, NULL),
(17, 'manuel.marcelo@ceturghperu.edu.pe', 'MANUEL ERNESTO MONTERO MARCELO', '42064694', NULL, 'DNI', '$2y$10$j5jlT4aMv81ttyJRISLeDOnM5SpHSfEHNNYQv94rfnOksySxq2kSe', 'jefe', 15, NULL),
(18, 'ejecutiva.comercial.piura@ceturghperu.edu.pe', 'LUCIA DEL CARMEN SEMINARIO GUERRERO', '75134345', NULL, 'DNI', '$2y$10$yd8cy3DIg1XMcNt33ColcOQIA8A.GJNISTl/d8Lf8HTrR2bpJUoKq', 'asistente', 9, NULL),
(19, 'juana.mena@ceturghperu.edu.pe', 'JUANA MENA BENITES', '47577954', NULL, 'DNI', '$2y$10$UoNwoohYZPxqrTavWlNl0uoQ/FnxkemJvqHI9bH9gWYR4ErxqKiAq', 'jefe', 14, NULL),
(20, 'asistente.marketing@ceturghperu.edu.pe', 'SUSANA QUIROZ MARQUEZ', '72531482', NULL, 'DNI', '$2y$10$ZwcZoEjoLIvXHUSFs/j6Cumy.x3afnW8KAHfW2pI/I/GgPuiXgP5.', 'asistente', 14, NULL),
(21, 'davie.moscoso@ceturghperu.edu.pe', 'DAVIE MOSCOSO DIAZ', '40285401', NULL, 'DNI', '$2y$10$1NT5rilw2g3rwtseBI0qx.V8Z01e3zTFBGn1g5fDHAmQycr9VN8sO', 'jefe', 13, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_departamentos`
--

CREATE TABLE `usuarios_departamentos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `departamento_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuarios_departamentos`
--

INSERT INTO `usuarios_departamentos` (`id`, `usuario_id`, `departamento_id`) VALUES
(27, 12, 8),
(28, 4, 10),
(111, 8, 11),
(112, 8, 12),
(113, 8, 13),
(114, 8, 10),
(115, 8, 17),
(116, 8, 15),
(117, 8, 7),
(118, 8, 5),
(119, 8, 14),
(120, 8, 6),
(121, 8, 16),
(122, 8, 8),
(123, 8, 3),
(124, 8, 18),
(125, 8, 19),
(126, 8, 9);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_resumen_mensual`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_resumen_mensual` (
`departamento_id` int(11)
,`departamento_nombre` varchar(100)
,`mes` int(2)
,`anio` int(4)
,`presupuesto_asignado` decimal(10,2)
,`gastado_items` decimal(32,2)
,`gastado_movilidad` decimal(32,2)
,`saldo` decimal(34,2)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_resumen_mensual`
--
DROP TABLE IF EXISTS `vista_resumen_mensual`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_resumen_mensual`  AS SELECT `d`.`id` AS `departamento_id`, `d`.`nombre` AS `departamento_nombre`, `ph`.`mes` AS `mes`, `ph`.`anio` AS `anio`, `ph`.`presupuesto_asignado` AS `presupuesto_asignado`, coalesce((select sum(`i`.`total`) from (`items` `i` join `requerimientos` `r` on(`r`.`id` = `i`.`requerimiento_id`)) where `r`.`departamento_id` = `d`.`id` and `i`.`estado_pago` = 'Pagado' and month(`r`.`fecha`) = `ph`.`mes` and year(`r`.`fecha`) = `ph`.`anio`),0) AS `gastado_items`, coalesce((select sum(`pm`.`monto_total`) from `planilla_movilidad` `pm` where `pm`.`departamento_id` = `d`.`id` and `pm`.`estado` = 'Pagado' and month(`pm`.`fecha`) = `ph`.`mes` and year(`pm`.`fecha`) = `ph`.`anio`),0) AS `gastado_movilidad`, `ph`.`presupuesto_asignado`- (coalesce((select sum(`i`.`total`) from (`items` `i` join `requerimientos` `r` on(`r`.`id` = `i`.`requerimiento_id`)) where `r`.`departamento_id` = `d`.`id` and `i`.`estado_pago` = 'Pagado' and month(`r`.`fecha`) = `ph`.`mes` and year(`r`.`fecha`) = `ph`.`anio`),0) + coalesce((select sum(`pm`.`monto_total`) from `planilla_movilidad` `pm` where `pm`.`departamento_id` = `d`.`id` and `pm`.`estado` = 'Pagado' and month(`pm`.`fecha`) = `ph`.`mes` and year(`pm`.`fecha`) = `ph`.`anio`),0)) AS `saldo` FROM (`departamentos` `d` join `presupuestos_historicos` `ph`) WHERE `ph`.`departamento_id` = `d`.`id` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `areas_costos`
--
ALTER TABLE `areas_costos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `empresa_id` (`empresa_id`),
  ADD KEY `sede_id` (`sede_id`);

--
-- Indices de la tabla `area_departamento`
--
ALTER TABLE `area_departamento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `area_id` (`area_id`),
  ADD KEY `departamento_id` (`departamento_id`);

--
-- Indices de la tabla `articulos`
--
ALTER TABLE `articulos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cajas_chicas`
--
ALTER TABLE `cajas_chicas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `carreras`
--
ALTER TABLE `carreras`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `centros_costos`
--
ALTER TABLE `centros_costos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `empresa_id` (`empresa_id`),
  ADD KEY `sede_id` (`sede_id`);

--
-- Indices de la tabla `cola_correos`
--
ALTER TABLE `cola_correos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `correlativos`
--
ALTER TABLE `correlativos`
  ADD PRIMARY KEY (`tipo`,`anio`);

--
-- Indices de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `empresa_id` (`empresa_id`),
  ADD KEY `sede_id` (`sede_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indices de la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `grupos_tesoreria`
--
ALTER TABLE `grupos_tesoreria`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inventario_herramientas`
--
ALTER TABLE `inventario_herramientas`
  ADD KEY `inventario_id` (`inventario_id`);

--
-- Indices de la tabla `inventario_insumos`
--
ALTER TABLE `inventario_insumos`
  ADD KEY `inventario_id` (`inventario_id`);

--
-- Indices de la tabla `inventario_lotes`
--
ALTER TABLE `inventario_lotes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventario_id` (`inventario_id`);

--
-- Indices de la tabla `inventario_menaje`
--
ALTER TABLE `inventario_menaje`
  ADD KEY `inventario_id` (`inventario_id`);

--
-- Indices de la tabla `inventario_moviles`
--
ALTER TABLE `inventario_moviles`
  ADD KEY `inventario_id` (`inventario_id`);

--
-- Indices de la tabla `inventario_oficina`
--
ALTER TABLE `inventario_oficina`
  ADD KEY `inventario_id` (`inventario_id`);

--
-- Indices de la tabla `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `requerimiento_id` (`requerimiento_id`),
  ADD KEY `centro_costo_id` (`centro_costo_id`),
  ADD KEY `area_costo_id` (`area_costo_id`);

--
-- Indices de la tabla `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movimientos_caja`
--
ALTER TABLE `movimientos_caja`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movimientos_stock`
--
ALTER TABLE `movimientos_stock`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ordenes_compra`
--
ALTER TABLE `ordenes_compra`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `orden_compra_items`
--
ALTER TABLE `orden_compra_items`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pagos_trabajador` (`trabajador_id`);

--
-- Indices de la tabla `planilla_docente`
--
ALTER TABLE `planilla_docente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trabajador_id` (`trabajador_id`),
  ADD KEY `fk_programa` (`programa_id`);

--
-- Indices de la tabla `planilla_movilidad`
--
ALTER TABLE `planilla_movilidad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `empresa_id` (`empresa_id`),
  ADD KEY `sede_id` (`sede_id`),
  ADD KEY `departamento_id` (`departamento_id`);

--
-- Indices de la tabla `planilla_movilidad_detalle`
--
ALTER TABLE `planilla_movilidad_detalle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `planilla_id` (`planilla_id`);

--
-- Indices de la tabla `presupuestos_carreras`
--
ALTER TABLE `presupuestos_carreras`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `presupuestos_historicos`
--
ALTER TABLE `presupuestos_historicos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_periodo` (`departamento_id`,`mes`,`anio`),
  ADD KEY `idx_departamento` (`departamento_id`),
  ADD KEY `idx_fecha` (`anio`,`mes`);

--
-- Indices de la tabla `productos_select`
--
ALTER TABLE `productos_select`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `programas`
--
ALTER TABLE `programas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `propuestas`
--
ALTER TABLE `propuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `rendiciones_caja`
--
ALTER TABLE `rendiciones_caja`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `rendicion_items`
--
ALTER TABLE `rendicion_items`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `requerimientos`
--
ALTER TABLE `requerimientos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `departamento_id` (`departamento_id`),
  ADD KEY `empresa_id` (`empresa_id`),
  ADD KEY `sede_id` (`sede_id`),
  ADD KEY `fk_requerimientos_usuario` (`creador_id`);

--
-- Indices de la tabla `sedes`
--
ALTER TABLE `sedes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `empresa_id` (`empresa_id`);

--
-- Indices de la tabla `solicitudes_caja`
--
ALTER TABLE `solicitudes_caja`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `solicitudes_fondo`
--
ALTER TABLE `solicitudes_fondo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `firmado_por` (`firmado_por`);

--
-- Indices de la tabla `solicitud_archivos`
--
ALTER TABLE `solicitud_archivos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `solicitud_id` (`solicitud_id`),
  ADD KEY `gasto_id` (`gasto_id`);

--
-- Indices de la tabla `solicitud_gastos`
--
ALTER TABLE `solicitud_gastos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `solicitud_id` (`solicitud_id`);

--
-- Indices de la tabla `solicitud_historial`
--
ALTER TABLE `solicitud_historial`
  ADD PRIMARY KEY (`id`),
  ADD KEY `solicitud_id` (`solicitud_id`);

--
-- Indices de la tabla `trabajadores`
--
ALTER TABLE `trabajadores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `departamento_id` (`departamento_id`);

--
-- Indices de la tabla `usuarios_departamentos`
--
ALTER TABLE `usuarios_departamentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `departamento_id` (`departamento_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `areas_costos`
--
ALTER TABLE `areas_costos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `area_departamento`
--
ALTER TABLE `area_departamento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `articulos`
--
ALTER TABLE `articulos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `cajas_chicas`
--
ALTER TABLE `cajas_chicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `carreras`
--
ALTER TABLE `carreras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `centros_costos`
--
ALTER TABLE `centros_costos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=391;

--
-- AUTO_INCREMENT de la tabla `cola_correos`
--
ALTER TABLE `cola_correos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=196;

--
-- AUTO_INCREMENT de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `empresas`
--
ALTER TABLE `empresas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `grupos_tesoreria`
--
ALTER TABLE `grupos_tesoreria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `inventario_lotes`
--
ALTER TABLE `inventario_lotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=207;

--
-- AUTO_INCREMENT de la tabla `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimientos_caja`
--
ALTER TABLE `movimientos_caja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `movimientos_stock`
--
ALTER TABLE `movimientos_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=228;

--
-- AUTO_INCREMENT de la tabla `ordenes_compra`
--
ALTER TABLE `ordenes_compra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=150;

--
-- AUTO_INCREMENT de la tabla `orden_compra_items`
--
ALTER TABLE `orden_compra_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=216;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `planilla_docente`
--
ALTER TABLE `planilla_docente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `planilla_movilidad`
--
ALTER TABLE `planilla_movilidad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `planilla_movilidad_detalle`
--
ALTER TABLE `planilla_movilidad_detalle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `presupuestos_carreras`
--
ALTER TABLE `presupuestos_carreras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `presupuestos_historicos`
--
ALTER TABLE `presupuestos_historicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `productos_select`
--
ALTER TABLE `productos_select`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `programas`
--
ALTER TABLE `programas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `propuestas`
--
ALTER TABLE `propuestas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `rendiciones_caja`
--
ALTER TABLE `rendiciones_caja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `rendicion_items`
--
ALTER TABLE `rendicion_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `requerimientos`
--
ALTER TABLE `requerimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=186;

--
-- AUTO_INCREMENT de la tabla `sedes`
--
ALTER TABLE `sedes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `solicitudes_caja`
--
ALTER TABLE `solicitudes_caja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `solicitudes_fondo`
--
ALTER TABLE `solicitudes_fondo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT de la tabla `solicitud_archivos`
--
ALTER TABLE `solicitud_archivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT de la tabla `solicitud_gastos`
--
ALTER TABLE `solicitud_gastos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `solicitud_historial`
--
ALTER TABLE `solicitud_historial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=334;

--
-- AUTO_INCREMENT de la tabla `trabajadores`
--
ALTER TABLE `trabajadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `usuarios_departamentos`
--
ALTER TABLE `usuarios_departamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `areas_costos`
--
ALTER TABLE `areas_costos`
  ADD CONSTRAINT `areas_costos_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
  ADD CONSTRAINT `areas_costos_ibfk_2` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`);

--
-- Filtros para la tabla `area_departamento`
--
ALTER TABLE `area_departamento`
  ADD CONSTRAINT `area_departamento_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `areas_costos` (`id`),
  ADD CONSTRAINT `area_departamento_ibfk_2` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`);

--
-- Filtros para la tabla `centros_costos`
--
ALTER TABLE `centros_costos`
  ADD CONSTRAINT `centros_costos_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `centros_costos` (`id`),
  ADD CONSTRAINT `centros_costos_ibfk_2` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
  ADD CONSTRAINT `centros_costos_ibfk_3` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`);

--
-- Filtros para la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD CONSTRAINT `departamentos_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
  ADD CONSTRAINT `departamentos_ibfk_2` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`),
  ADD CONSTRAINT `departamentos_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `departamentos` (`id`);

--
-- Filtros para la tabla `inventario_herramientas`
--
ALTER TABLE `inventario_herramientas`
  ADD CONSTRAINT `inventario_herramientas_ibfk_1` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`);

--
-- Filtros para la tabla `inventario_insumos`
--
ALTER TABLE `inventario_insumos`
  ADD CONSTRAINT `inventario_insumos_ibfk_1` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`);

--
-- Filtros para la tabla `inventario_lotes`
--
ALTER TABLE `inventario_lotes`
  ADD CONSTRAINT `inventario_lotes_ibfk_1` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`);

--
-- Filtros para la tabla `inventario_menaje`
--
ALTER TABLE `inventario_menaje`
  ADD CONSTRAINT `inventario_menaje_ibfk_1` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`);

--
-- Filtros para la tabla `inventario_moviles`
--
ALTER TABLE `inventario_moviles`
  ADD CONSTRAINT `inventario_moviles_ibfk_1` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`);

--
-- Filtros para la tabla `inventario_oficina`
--
ALTER TABLE `inventario_oficina`
  ADD CONSTRAINT `inventario_oficina_ibfk_1` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`);

--
-- Filtros para la tabla `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`requerimiento_id`) REFERENCES `requerimientos` (`id`),
  ADD CONSTRAINT `items_ibfk_2` FOREIGN KEY (`centro_costo_id`) REFERENCES `centros_costos` (`id`),
  ADD CONSTRAINT `items_ibfk_3` FOREIGN KEY (`area_costo_id`) REFERENCES `areas_costos` (`id`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `fk_pagos_trabajador` FOREIGN KEY (`trabajador_id`) REFERENCES `trabajadores` (`id`);

--
-- Filtros para la tabla `planilla_docente`
--
ALTER TABLE `planilla_docente`
  ADD CONSTRAINT `fk_programa` FOREIGN KEY (`programa_id`) REFERENCES `programas` (`id`),
  ADD CONSTRAINT `planilla_docente_ibfk_1` FOREIGN KEY (`trabajador_id`) REFERENCES `trabajadores` (`id`);

--
-- Filtros para la tabla `planilla_movilidad`
--
ALTER TABLE `planilla_movilidad`
  ADD CONSTRAINT `planilla_movilidad_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
  ADD CONSTRAINT `planilla_movilidad_ibfk_2` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`),
  ADD CONSTRAINT `planilla_movilidad_ibfk_3` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`);

--
-- Filtros para la tabla `planilla_movilidad_detalle`
--
ALTER TABLE `planilla_movilidad_detalle`
  ADD CONSTRAINT `planilla_movilidad_detalle_ibfk_1` FOREIGN KEY (`planilla_id`) REFERENCES `planilla_movilidad` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `presupuestos_historicos`
--
ALTER TABLE `presupuestos_historicos`
  ADD CONSTRAINT `presupuestos_historicos_ibfk_1` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `propuestas`
--
ALTER TABLE `propuestas`
  ADD CONSTRAINT `propuestas_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);

--
-- Filtros para la tabla `requerimientos`
--
ALTER TABLE `requerimientos`
  ADD CONSTRAINT `fk_requerimientos_usuario` FOREIGN KEY (`creador_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `requerimientos_ibfk_1` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`),
  ADD CONSTRAINT `requerimientos_ibfk_2` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
  ADD CONSTRAINT `requerimientos_ibfk_3` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`);

--
-- Filtros para la tabla `sedes`
--
ALTER TABLE `sedes`
  ADD CONSTRAINT `sedes_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`);

--
-- Filtros para la tabla `solicitudes_fondo`
--
ALTER TABLE `solicitudes_fondo`
  ADD CONSTRAINT `solicitudes_fondo_ibfk_1` FOREIGN KEY (`firmado_por`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `solicitud_archivos`
--
ALTER TABLE `solicitud_archivos`
  ADD CONSTRAINT `solicitud_archivos_ibfk_1` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes_fondo` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `solicitud_archivos_ibfk_2` FOREIGN KEY (`gasto_id`) REFERENCES `solicitud_gastos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `solicitud_gastos`
--
ALTER TABLE `solicitud_gastos`
  ADD CONSTRAINT `solicitud_gastos_ibfk_1` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes_fondo` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `solicitud_historial`
--
ALTER TABLE `solicitud_historial`
  ADD CONSTRAINT `solicitud_historial_ibfk_1` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes_fondo` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`);

--
-- Filtros para la tabla `usuarios_departamentos`
--
ALTER TABLE `usuarios_departamentos`
  ADD CONSTRAINT `usuarios_departamentos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `usuarios_departamentos_ibfk_2` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
