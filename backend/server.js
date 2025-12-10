const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(express.static(path.join(__dirname, '..')));

// Variables globales para la base de datos
let db = null;

// Inicializar sql.js y cargar base de datos
async function initDatabase() {
    const SQL = await initSqlJs();
    
    const dbPath = path.join(__dirname, '..', 'database', 'horarios.db');
    
    if (!fs.existsSync(dbPath)) {
        throw new Error('Base de datos no encontrada. Ejecuta: npm run init-db');
    }
    
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
    console.log('✅ Base de datos cargada correctamente');
}

// =========================
// RUTAS DE LA API
// =========================

// Ruta principal - redirigir al frontend
app.get('/', (req, res) => {
    res.redirect('/frontend/index.html');
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        database: db ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Obtener todas las comisiones con sus materias
app.get('/api/comisiones', (req, res) => {
    try {
        const query = `
            SELECT 
                c.id,
                c.codigo,
                c.descripcion,
                a.anio
            FROM comisiones c
            JOIN anios_academicos a ON c.anio_academico_id = a.id
            ORDER BY a.anio, c.codigo
        `;
        
        const result = db.exec(query);
        if (result.length === 0) {
            return res.json([]);
        }
        
        const comisiones = result[0].values.map(row => ({
            id: row[0],
            codigo: row[1],
            descripcion: row[2],
            anio: row[3]
        }));
        
        res.json(comisiones);
    } catch (error) {
        console.error('Error al obtener comisiones:', error);
        res.status(500).json({ error: error.message });
    }
});

// Obtener materias de una comisión
app.get('/api/comisiones/:codigo/materias', (req, res) => {
    try {
        const { codigo } = req.params;
        
        const query = `
            SELECT 
                m.id,
                m.nombre,
                m.color
            FROM materias m
            JOIN comisiones c ON m.comision_id = c.id
            WHERE c.codigo = ?
            ORDER BY m.nombre
        `;
        
        const result = db.exec(query, [codigo]);
        if (result.length === 0) {
            return res.json([]);
        }
        
        const materias = result[0].values.map(row => ({
            id: row[0],
            nombre: row[1],
            color: row[2],
            horarios: []
        }));
        
        // Obtener horarios para cada materia
        for (const materia of materias) {
            const horariosQuery = `
                SELECT dia, hora_inicio, hora_fin
                FROM horarios
                WHERE materia_id = ?
                ORDER BY 
                    CASE dia
                        WHEN 'Lunes' THEN 1
                        WHEN 'Martes' THEN 2
                        WHEN 'Miércoles' THEN 3
                        WHEN 'Jueves' THEN 4
                        WHEN 'Viernes' THEN 5
                        WHEN 'Sábado' THEN 6
                    END,
                    hora_inicio
            `;
            
            const horariosResult = db.exec(horariosQuery, [materia.id]);
            if (horariosResult.length > 0) {
                materia.horarios = horariosResult[0].values.map(row => ({
                    dia: row[0],
                    inicio: row[1],
                    fin: row[2]
                }));
            }
        }
        
        res.json(materias);
    } catch (error) {
        console.error('Error al obtener materias:', error);
        res.status(500).json({ error: error.message });
    }
});

// Obtener todas las materias con sus horarios (formato compatible)
app.get('/api/materias', (req, res) => {
    try {
        const query = `
            SELECT 
                c.codigo as comision,
                m.id,
                m.nombre,
                m.color
            FROM materias m
            JOIN comisiones c ON m.comision_id = c.id
            ORDER BY c.codigo, m.nombre
        `;
        
        const result = db.exec(query);
        if (result.length === 0) {
            return res.json({});
        }
        
        const materiasData = {};
        
        for (const row of result[0].values) {
            const comision = row[0];
            const materiaId = row[1];
            const nombre = row[2];
            const color = row[3];
            
            if (!materiasData[comision]) {
                materiasData[comision] = [];
            }
            
            // Obtener horarios
            const horariosQuery = `
                SELECT dia, hora_inicio, hora_fin
                FROM horarios
                WHERE materia_id = ?
                ORDER BY 
                    CASE dia
                        WHEN 'Lunes' THEN 1
                        WHEN 'Martes' THEN 2
                        WHEN 'Miércoles' THEN 3
                        WHEN 'Jueves' THEN 4
                        WHEN 'Viernes' THEN 5
                        WHEN 'Sábado' THEN 6
                    END,
                    hora_inicio
            `;
            
            const horariosResult = db.exec(horariosQuery, [materiaId]);
            const horarios = horariosResult.length > 0 
                ? horariosResult[0].values.map(h => ({
                    dia: h[0],
                    inicio: h[1],
                    fin: h[2]
                }))
                : [];
            
            materiasData[comision].push({
                nombre,
                color,
                horarios
            });
        }
        
        res.json(materiasData);
    } catch (error) {
        console.error('Error al obtener materias:', error);
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📊 API disponible en http://localhost:${PORT}/api`);
            console.log(`🎨 Frontend disponible en http://localhost:${PORT}/frontend`);
        });
    })
    .catch(error => {
        console.error('❌ Error al inicializar la base de datos:', error.message);
        console.log('💡 Ejecuta: npm run init-db');
        process.exit(1);
    });

// Guardar cambios en la BD al cerrar
process.on('SIGINT', () => {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        const dbPath = path.join(__dirname, '..', 'database', 'horarios.db');
        fs.writeFileSync(dbPath, buffer);
        console.log('\n💾 Base de datos guardada');
    }
    process.exit(0);
});
