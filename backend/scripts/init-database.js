const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Ruta a la base de datos
const dbPath = path.join(__dirname, '..', '..', 'database', 'organizador_horarios.db');
const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');

console.log('🔧 Inicializando base de datos...\n');

// Crear directorio si no existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('📁 Directorio database/ creado');
}

// Eliminar DB existente si existe
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('🗑️  Base de datos anterior eliminada');
}

// Crear nueva base de datos
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

console.log('✅ Base de datos creada en:', dbPath);

// Ejecutar schema
console.log('\n📋 Ejecutando schema.sql...');
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);
console.log('✅ Schema creado exitosamente');

// Ejecutar seed
console.log('\n🌱 Ejecutando seed.sql...');
const seed = fs.readFileSync(seedPath, 'utf8');
db.exec(seed);
console.log('✅ Datos iniciales insertados');

// Verificar tablas creadas
console.log('\n📊 Tablas creadas:');
const tables = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' 
    ORDER BY name
`).all();

tables.forEach(table => {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
    console.log(`   - ${table.name}: ${count.count} registros`);
});

db.close();

console.log('\n✅ Base de datos inicializada correctamente\n');
console.log('💡 Próximo paso: ejecutar "npm run migrate" para migrar datos desde data.js\n');
