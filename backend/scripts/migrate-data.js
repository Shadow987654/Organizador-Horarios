const Database = require('better-sqlite3');
const path = require('path');

// Importar datos desde data.js
const dataPath = path.join(__dirname, '..', '..', 'data.js');
const dataContent = require('fs').readFileSync(dataPath, 'utf8');

// Extraer materiasData del archivo
const materiasDataMatch = dataContent.match(/const materiasData = ({[\s\S]*?});/);
if (!materiasDataMatch) {
    console.error('❌ No se pudo extraer materiasData de data.js');
    process.exit(1);
}

const materiasData = eval('(' + materiasDataMatch[1] + ')');

// Conectar a la base de datos
const dbPath = path.join(__dirname, '..', '..', 'database', 'organizador_horarios.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

console.log('📦 Iniciando migración de datos...\n');

// Función para determinar el año según el código de comisión
function getAnioFromComision(codigo) {
    const primerCaracter = codigo.charAt(0);
    return parseInt(primerCaracter);
}

// Preparar statements
const insertMateria = db.prepare(`
    INSERT INTO materias (anio_academico_id, nombre, tipo, es_electiva, cuatrimestre)
    VALUES (?, ?, ?, ?, ?)
`);

const insertMateriaComision = db.prepare(`
    INSERT INTO materias_comisiones (materia_id, comision_id)
    VALUES (?, ?)
`);

const insertHorario = db.prepare(`
    INSERT INTO horarios (materia_comision_id, dia_semana, hora_inicio, hora_fin)
    VALUES (?, ?, ?, ?)
`);

const findComision = db.prepare(`
    SELECT c.id, c.anio_academico_id 
    FROM comisiones c 
    WHERE c.codigo = ?
`);

const findMateria = db.prepare(`
    SELECT id FROM materias 
    WHERE nombre = ? AND anio_academico_id = ?
`);

// Crear comisiones que no existan
const insertComision = db.prepare(`
    INSERT OR IGNORE INTO comisiones (anio_academico_id, codigo, turno)
    VALUES (?, ?, ?)
`);

// Estadísticas
let stats = {
    comisiones: 0,
    materias: 0,
    materiasComisiones: 0,
    horarios: 0,
    errores: 0
};

try {
    // Iniciar transacción
    db.prepare('BEGIN').run();
    
    // Procesar cada comisión
    for (const [codigoComision, materias] of Object.entries(materiasData)) {
        console.log(`\n📚 Procesando comisión: ${codigoComision}`);
        
        // Determinar año académico
        const numeroAnio = getAnioFromComision(codigoComision);
        
        // Verificar si la comisión existe
        let comision = findComision.get(codigoComision);
        
        if (!comision) {
            // Crear comisión
            const anioAcademico = db.prepare('SELECT id FROM anios_academicos WHERE numero_anio = ?').get(numeroAnio);
            
            if (!anioAcademico) {
                console.error(`   ❌ Año académico ${numeroAnio} no encontrado`);
                continue;
            }
            
            insertComision.run(anioAcademico.id, codigoComision, 'Mañana/Tarde');
            comision = findComision.get(codigoComision);
            stats.comisiones++;
            console.log(`   ✅ Comisión ${codigoComision} creada`);
        }
        
        // Procesar materias de esta comisión
        for (const materia of materias) {
            try {
                // Convertir array de cuatrimestres a string
                const cuatrimestreStr = materia.cuatrimestre.join(',');
                
                // Buscar si la materia ya existe
                let materiaRow = findMateria.get(materia.nombre, comision.anio_academico_id);
                
                if (!materiaRow) {
                    // Insertar materia
                    const result = insertMateria.run(
                        comision.anio_academico_id,
                        materia.nombre,
                        materia.tipo,
                        materia.electiva ? 1 : 0,
                        cuatrimestreStr
                    );
                    materiaRow = { id: result.lastInsertRowid };
                    stats.materias++;
                    console.log(`   ✅ Materia: ${materia.nombre}`);
                }
                
                // Relacionar materia con comisión
                const mcResult = insertMateriaComision.run(materiaRow.id, comision.id);
                const materiaComisionId = mcResult.lastInsertRowid;
                stats.materiasComisiones++;
                
                // Insertar horarios
                for (const horario of materia.horarios) {
                    insertHorario.run(
                        materiaComisionId,
                        horario.dia,
                        horario.inicio,
                        horario.fin
                    );
                    stats.horarios++;
                }
                
            } catch (error) {
                console.error(`   ❌ Error en materia ${materia.nombre}:`, error.message);
                stats.errores++;
            }
        }
    }
    
    // Confirmar transacción
    db.prepare('COMMIT').run();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ MIGRACIÓN COMPLETADA\n');
    console.log('📊 Estadísticas:');
    console.log(`   - Comisiones creadas: ${stats.comisiones}`);
    console.log(`   - Materias insertadas: ${stats.materias}`);
    console.log(`   - Relaciones materia-comisión: ${stats.materiasComisiones}`);
    console.log(`   - Horarios insertados: ${stats.horarios}`);
    
    if (stats.errores > 0) {
        console.log(`   ⚠️  Errores encontrados: ${stats.errores}`);
    }
    
    console.log('='.repeat(50) + '\n');
    
    // Mostrar resumen de datos
    console.log('📋 Resumen de la base de datos:');
    const resumen = db.prepare(`
        SELECT 
            (SELECT COUNT(*) FROM carreras) as carreras,
            (SELECT COUNT(*) FROM anios_academicos) as anios,
            (SELECT COUNT(*) FROM comisiones) as comisiones,
            (SELECT COUNT(*) FROM materias) as materias,
            (SELECT COUNT(*) FROM materias_comisiones) as materias_comisiones,
            (SELECT COUNT(*) FROM horarios) as horarios
    `).get();
    
    for (const [key, value] of Object.entries(resumen)) {
        console.log(`   - ${key}: ${value}`);
    }
    
    console.log('\n✅ Datos migrados exitosamente\n');
    
} catch (error) {
    db.prepare('ROLLBACK').run();
    console.error('\n❌ Error durante la migración:', error);
    process.exit(1);
} finally {
    db.close();
}
