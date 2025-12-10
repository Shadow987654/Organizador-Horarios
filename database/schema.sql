-- Schema de base de datos para Organizador de Horarios
-- Base de datos: organizador_horarios.db

-- Tabla de carreras
CREATE TABLE IF NOT EXISTS carreras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    codigo VARCHAR(50) UNIQUE,
    facultad VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de años académicos
CREATE TABLE IF NOT EXISTS anios_academicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carrera_id INTEGER NOT NULL,
    numero_anio INTEGER NOT NULL CHECK(numero_anio >= 1 AND numero_anio <= 6),
    descripcion VARCHAR(100),
    FOREIGN KEY (carrera_id) REFERENCES carreras(id) ON DELETE CASCADE,
    UNIQUE(carrera_id, numero_anio)
);

-- Tabla de comisiones
CREATE TABLE IF NOT EXISTS comisiones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    anio_academico_id INTEGER NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    turno VARCHAR(50),
    FOREIGN KEY (anio_academico_id) REFERENCES anios_academicos(id) ON DELETE CASCADE,
    UNIQUE(anio_academico_id, codigo)
);

-- Tabla de materias
CREATE TABLE IF NOT EXISTS materias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    anio_academico_id INTEGER NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK(tipo IN ('Anual', 'Cuatrimestral')),
    es_electiva BOOLEAN DEFAULT 0,
    cuatrimestre VARCHAR(10) CHECK(cuatrimestre IN ('1', '2', '1,2') OR cuatrimestre IS NULL),
    codigo_materia VARCHAR(50),
    creditos INTEGER,
    FOREIGN KEY (anio_academico_id) REFERENCES anios_academicos(id) ON DELETE CASCADE
);

-- Tabla intermedia: materias por comisión
CREATE TABLE IF NOT EXISTS materias_comisiones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    materia_id INTEGER NOT NULL,
    comision_id INTEGER NOT NULL,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    FOREIGN KEY (comision_id) REFERENCES comisiones(id) ON DELETE CASCADE,
    UNIQUE(materia_id, comision_id)
);

-- Tabla de horarios
CREATE TABLE IF NOT EXISTS horarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    materia_comision_id INTEGER NOT NULL,
    dia_semana VARCHAR(20) NOT NULL CHECK(dia_semana IN ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')),
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    aula VARCHAR(50),
    tipo_clase VARCHAR(50) CHECK(tipo_clase IN ('Teórica', 'Práctica', 'Laboratorio', 'Taller') OR tipo_clase IS NULL),
    FOREIGN KEY (materia_comision_id) REFERENCES materias_comisiones(id) ON DELETE CASCADE,
    CHECK(hora_inicio < hora_fin)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_materias_anio ON materias(anio_academico_id);
CREATE INDEX IF NOT EXISTS idx_comisiones_anio ON comisiones(anio_academico_id);
CREATE INDEX IF NOT EXISTS idx_horarios_materia_comision ON horarios(materia_comision_id);
CREATE INDEX IF NOT EXISTS idx_horarios_dia ON horarios(dia_semana);

-- Vista para consultar horarios completos
CREATE VIEW IF NOT EXISTS vista_horarios_completos AS
SELECT 
    c.nombre AS carrera,
    a.numero_anio,
    com.codigo AS comision,
    m.nombre AS materia,
    m.tipo,
    m.es_electiva,
    m.cuatrimestre,
    h.dia_semana,
    h.hora_inicio,
    h.hora_fin,
    h.aula,
    h.tipo_clase
FROM horarios h
INNER JOIN materias_comisiones mc ON h.materia_comision_id = mc.id
INNER JOIN materias m ON mc.materia_id = m.id
INNER JOIN comisiones com ON mc.comision_id = com.id
INNER JOIN anios_academicos a ON m.anio_academico_id = a.id
INNER JOIN carreras c ON a.carrera_id = c.id
ORDER BY c.nombre, a.numero_anio, com.codigo, m.nombre, h.dia_semana, h.hora_inicio;
