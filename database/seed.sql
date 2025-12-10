-- Datos iniciales para la base de datos

-- Insertar carrera
INSERT INTO carreras (nombre, codigo, facultad) VALUES 
('Ingeniería en Sistemas de Información', 'ISI', 'UTN FRRO');

-- Insertar años académicos (1ro a 5to)
INSERT INTO anios_academicos (carrera_id, numero_anio, descripcion) VALUES 
(1, 1, 'Primer Año'),
(1, 2, 'Segundo Año'),
(1, 3, 'Tercer Año'),
(1, 4, 'Cuarto Año'),
(1, 5, 'Quinto Año');

-- Insertar comisiones de 4to año
INSERT INTO comisiones (anio_academico_id, codigo, turno) VALUES 
(4, '4K1', 'Mañana/Tarde'),
(4, '4K2', 'Mañana/Tarde'),
(4, '4K3', 'Mañana/Tarde'),
(4, '4K4', 'Mañana/Tarde');

-- Insertar comisiones de 5to año
INSERT INTO comisiones (anio_academico_id, codigo, turno) VALUES 
(5, '5K1', 'Mañana/Tarde'),
(5, '5K2', 'Mañana/Tarde'),
(5, '5K3', 'Mañana/Tarde'),
(5, '5K4', 'Mañana/Tarde');

-- Nota: Los datos de materias y horarios se migrarán desde data.js
-- usando el script migrate_data.js
