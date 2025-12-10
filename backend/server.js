const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar base de datos
const db = new Database(path.join(__dirname, '..', 'database', 'organizador_horarios.db'));

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// =========================
// RUTAS DE LA API
// =========================

// GET: Obtener todas las carreras
app.get('/api/carreras', (req, res) => {
    try {
        const carreras = db.prepare('SELECT * FROM carreras').all();
        res.json(carreras);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Obtener años académicos de una carrera
app.get('/api/carreras/:carreraId/anios', (req, res) => {
    try {
        const { carreraId } = req.params;
        const anios = db.prepare(`
            SELECT * FROM anios_academicos 
            WHERE carrera_id = ? 
            ORDER BY numero_anio
        `).all(carreraId);
        res.json(anios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Obtener comisiones de un año
app.get('/api/anios/:anioId/comisiones', (req, res) => {
    try {
        const { anioId } = req.params;
        const comisiones = db.prepare(`
            SELECT * FROM comisiones 
            WHERE anio_academico_id = ? 
            ORDER BY codigo
        `).all(anioId);
        res.json(comisiones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Obtener materias por año y cuatrimestre
app.get('/api/materias', (req, res) => {
    try {
        const { anioId, cuatrimestre } = req.query;
        
        let query = `
            SELECT DISTINCT m.* 
            FROM materias m
            WHERE 1=1
        `;
        const params = [];
        
        if (anioId) {
            query += ' AND m.anio_academico_id = ?';
            params.push(anioId);
        }
        
        if (cuatrimestre) {
            query += ` AND (m.cuatrimestre LIKE '%${cuatrimestre}%')`;
        }
        
        query += ' ORDER BY m.nombre';
        
        const materias = db.prepare(query).all(...params);
        res.json(materias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Obtener materias con sus comisiones para un cuatrimestre específico
app.get('/api/materias-comisiones', (req, res) => {
    try {
        const { anioId, cuatrimestre } = req.query;
        
        let query = `
            SELECT 
                m.id as materia_id,
                m.nombre,
                m.tipo,
                m.es_electiva,
                m.cuatrimestre,
                c.id as comision_id,
                c.codigo as comision,
                mc.id as materia_comision_id
            FROM materias m
            INNER JOIN materias_comisiones mc ON m.id = mc.materia_id
            INNER JOIN comisiones c ON mc.comision_id = c.id
            WHERE 1=1
        `;
        const params = [];
        
        if (anioId) {
            query += ' AND m.anio_academico_id = ?';
            params.push(anioId);
        }
        
        if (cuatrimestre) {
            query += ` AND (m.cuatrimestre LIKE '%${cuatrimestre}%')`;
        }
        
        query += ' ORDER BY m.nombre, c.codigo';
        
        const data = db.prepare(query).all(...params);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Obtener horarios de una materia-comisión
app.get('/api/horarios/:materiaComisionId', (req, res) => {
    try {
        const { materiaComisionId } = req.params;
        const horarios = db.prepare(`
            SELECT * FROM horarios 
            WHERE materia_comision_id = ? 
            ORDER BY 
                CASE dia_semana
                    WHEN 'Lunes' THEN 1
                    WHEN 'Martes' THEN 2
                    WHEN 'Miércoles' THEN 3
                    WHEN 'Jueves' THEN 4
                    WHEN 'Viernes' THEN 5
                    WHEN 'Sábado' THEN 6
                    WHEN 'Domingo' THEN 7
                END,
                hora_inicio
        `).all(materiaComisionId);
        res.json(horarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Obtener datos completos para el frontend (formato compatible)
app.get('/api/datos-completos', (req, res) => {
    try {
        const { cuatrimestre } = req.query;
        
        // Consulta que agrupa por comisión
        let query = `
            SELECT 
                c.codigo as comision,
                m.nombre,
                m.tipo,
                m.es_electiva,
                m.cuatrimestre,
                h.dia_semana as dia,
                h.hora_inicio as inicio,
                h.hora_fin as fin,
                h.aula
            FROM horarios h
            INNER JOIN materias_comisiones mc ON h.materia_comision_id = mc.id
            INNER JOIN materias m ON mc.materia_id = m.id
            INNER JOIN comisiones c ON mc.comision_id = c.id
            WHERE 1=1
        `;
        
        if (cuatrimestre) {
            query += ` AND (m.cuatrimestre LIKE '%${cuatrimestre}%')`;
        }
        
        query += ' ORDER BY c.codigo, m.nombre, h.dia_semana, h.hora_inicio';
        
        const rows = db.prepare(query).all();
        
        // Transformar a formato del frontend (similar a data.js)
        const materiasData = {};
        
        rows.forEach(row => {
            if (!materiasData[row.comision]) {
                materiasData[row.comision] = [];
            }
            
            // Buscar si ya existe la materia en esta comisión
            let materia = materiasData[row.comision].find(m => m.nombre === row.nombre);
            
            if (!materia) {
                materia = {
                    nombre: row.nombre,
                    tipo: row.tipo,
                    electiva: Boolean(row.es_electiva),
                    cuatrimestre: row.cuatrimestre.split(',').map(Number),
                    horarios: []
                };
                materiasData[row.comision].push(materia);
            }
            
            // Agregar horario
            materia.horarios.push({
                dia: row.dia,
                inicio: row.inicio,
                fin: row.fin,
                aula: row.aula
            });
        });
        
        res.json(materiasData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Base de datos: ${path.join(__dirname, '..', 'database', 'organizador_horarios.db')}`);
});

// Cerrar DB al terminar
process.on('SIGINT', () => {
    db.close();
    console.log('\n👋 Base de datos cerrada');
    process.exit(0);
});

module.exports = app;
