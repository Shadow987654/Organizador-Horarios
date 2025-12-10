const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(express.static(path.join(__dirname, '..')));

// Cargar datos desde data.js como fallback
let materiasData = {};

// Intentar cargar data.js
try {
    const dataPath = path.join(__dirname, '..', 'frontend', 'js', 'data.js');
    const dataContent = fs.readFileSync(dataPath, 'utf8');
    const materiasDataMatch = dataContent.match(/const materiasData = ({[\s\S]*?});/);
    
    if (materiasDataMatch) {
        materiasData = eval('(' + materiasDataMatch[1] + ')');
        console.log('✅ Datos cargados desde data.js');
    }
} catch (error) {
    console.error('⚠️  Error al cargar data.js:', error.message);
}

// =========================
// RUTAS DE LA API
// =========================

// Ruta raíz - redirigir al frontend
app.get('/', (req, res) => {
    res.redirect('/frontend/index.html');
});

// GET: Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API funcionando correctamente',
        comisiones: Object.keys(materiasData).length,
        timestamp: new Date().toISOString()
    });
});

// GET: Obtener datos completos (formato compatible con frontend)
app.get('/api/datos-completos', (req, res) => {
    try {
        const { cuatrimestre } = req.query;
        
        if (!cuatrimestre) {
            return res.json(materiasData);
        }
        
        // Filtrar por cuatrimestre
        const datosFiltrados = {};
        
        Object.keys(materiasData).forEach(comision => {
            const materiasFiltradas = materiasData[comision].filter(materia => 
                materia.cuatrimestre.includes(parseInt(cuatrimestre))
            );
            
            if (materiasFiltradas.length > 0) {
                datosFiltrados[comision] = materiasFiltradas;
            }
        });
        
        res.json(datosFiltrados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Obtener lista de comisiones
app.get('/api/comisiones', (req, res) => {
    try {
        const comisiones = Object.keys(materiasData).map(codigo => {
            const anio = parseInt(codigo.charAt(0));
            return {
                codigo: codigo,
                anio: anio,
                materias: materiasData[codigo].length
            };
        });
        
        res.json(comisiones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Obtener materias de una comisión
app.get('/api/comisiones/:codigo', (req, res) => {
    try {
        const { codigo } = req.params;
        const { cuatrimestre } = req.query;
        
        let materias = materiasData[codigo] || [];
        
        if (cuatrimestre) {
            materias = materias.filter(m => 
                m.cuatrimestre.includes(parseInt(cuatrimestre))
            );
        }
        
        res.json(materias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Buscar materias por nombre
app.get('/api/materias/buscar', (req, res) => {
    try {
        const { nombre, cuatrimestre } = req.query;
        const resultados = [];
        
        Object.keys(materiasData).forEach(comision => {
            materiasData[comision].forEach(materia => {
                const coincideNombre = !nombre || 
                    materia.nombre.toLowerCase().includes(nombre.toLowerCase());
                
                const coincideCuatrimestre = !cuatrimestre || 
                    materia.cuatrimestre.includes(parseInt(cuatrimestre));
                
                if (coincideNombre && coincideCuatrimestre) {
                    resultados.push({
                        ...materia,
                        comision: comision
                    });
                }
            });
        });
        
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Agregar nueva materia (solo en memoria, para testing)
app.post('/api/materias', (req, res) => {
    try {
        const { comision, materia } = req.body;
        
        if (!comision || !materia) {
            return res.status(400).json({ 
                error: 'Se requiere comision y materia' 
            });
        }
        
        if (!materiasData[comision]) {
            materiasData[comision] = [];
        }
        
        materiasData[comision].push(materia);
        
        res.status(201).json({ 
            message: 'Materia agregada exitosamente',
            materia: materia
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 Servidor API iniciado correctamente');
    console.log('='.repeat(50));
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📊 Comisiones cargadas: ${Object.keys(materiasData).length}`);
    console.log(`📚 Total de materias: ${Object.values(materiasData).flat().length}`);
    console.log('='.repeat(50));
    console.log('\n💡 Endpoints disponibles:');
    console.log(`   GET  /api/health`);
    console.log(`   GET  /api/datos-completos?cuatrimestre=1`);
    console.log(`   GET  /api/comisiones`);
    console.log(`   GET  /api/comisiones/:codigo?cuatrimestre=1`);
    console.log(`   GET  /api/materias/buscar?nombre=X&cuatrimestre=1`);
    console.log(`   POST /api/materias`);
    console.log('\n✅ Presiona Ctrl+C para detener el servidor\n');
});

module.exports = app;
