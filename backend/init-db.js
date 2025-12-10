const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

// Paleta de colores para las materias
const colores = [
  '#d9ed92', '#b5e48c', '#99d98c', '#76c893', '#52b69a',
  '#34a0a4', '#168aad', '#1a759f', '#1e6091', '#184e77'
];

async function createDatabase() {
  console.log('Inicializando base de datos...');
  
  // Cargar los datos de 4° y 5° año
  const dataPath = path.join(__dirname, '..', 'frontend', 'js', 'data.js');
  const dataContent = fs.readFileSync(dataPath, 'utf8');
  const func = new Function(dataContent + '; return materiasData;');
  const materiasData = func();
  
  // Cargar los datos de 1° a 3° año (si existe)
  const data1a3Path = path.join(__dirname, '..', 'frontend', 'js', 'data-1a3.js');
  let materiasData1a3 = {};
  
  if (fs.existsSync(data1a3Path)) {
    console.log('Cargando datos de 1° a 3° año...');
    const data1a3Content = fs.readFileSync(data1a3Path, 'utf8');
    const func1a3 = new Function(data1a3Content + '; return materiasData1a3;');
    materiasData1a3 = func1a3();
  } else {
    console.log('⚠️  Archivo data-1a3.js no encontrado. Solo se cargarán 4° y 5° año.');
  }
  
  // Combinar todos los datos
  const todosLosDatos = { ...materiasData1a3, ...materiasData };
  
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  // Crear tablas
  db.run(`
    CREATE TABLE carreras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      codigo TEXT UNIQUE NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE anios_academicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      carrera_id INTEGER NOT NULL,
      anio INTEGER NOT NULL,
      FOREIGN KEY (carrera_id) REFERENCES carreras(id)
    );
  `);

  db.run(`
    CREATE TABLE comisiones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      anio_academico_id INTEGER NOT NULL,
      codigo TEXT NOT NULL,
      descripcion TEXT,
      FOREIGN KEY (anio_academico_id) REFERENCES anios_academicos(id)
    );
  `);

  db.run(`
    CREATE TABLE materias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      color TEXT NOT NULL,
      comision_id INTEGER NOT NULL,
      FOREIGN KEY (comision_id) REFERENCES comisiones(id)
    );
  `);

  db.run(`
    CREATE TABLE horarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      materia_id INTEGER NOT NULL,
      dia TEXT NOT NULL,
      hora_inicio TEXT NOT NULL,
      hora_fin TEXT NOT NULL,
      FOREIGN KEY (materia_id) REFERENCES materias(id)
    );
  `);

  // Insertar carrera
  db.run("INSERT INTO carreras (nombre, codigo) VALUES ('Tecnicatura Universitaria en Programación', 'TUP')");
  const carreraId = db.exec("SELECT last_insert_rowid()")[0].values[0][0];

  // Procesar comisiones y materias
  const comisionesMap = {
    // Primer año
    '1K1': { anio: 1, nombre: '1° Año - Comisión K1' },
    '1K2': { anio: 1, nombre: '1° Año - Comisión K2' },
    '1K3': { anio: 1, nombre: '1° Año - Comisión K3' },
    '1K4': { anio: 1, nombre: '1° Año - Comisión K4' },
    // Segundo año
    '2K1': { anio: 2, nombre: '2° Año - Comisión K1' },
    '2K2': { anio: 2, nombre: '2° Año - Comisión K2' },
    '2K3': { anio: 2, nombre: '2° Año - Comisión K3' },
    '2K4': { anio: 2, nombre: '2° Año - Comisión K4' },
    // Tercer año
    '3K1': { anio: 3, nombre: '3° Año - Comisión K1' },
    '3K2': { anio: 3, nombre: '3° Año - Comisión K2' },
    '3K3': { anio: 3, nombre: '3° Año - Comisión K3' },
    '3K4': { anio: 3, nombre: '3° Año - Comisión K4' },
    // Cuarto año
    '4K1': { anio: 4, nombre: '4° Año - Comisión K1' },
    '4K2': { anio: 4, nombre: '4° Año - Comisión K2' },
    '4K3': { anio: 4, nombre: '4° Año - Comisión K3' },
    '4K4': { anio: 4, nombre: '4° Año - Comisión K4' },
    // Quinto año
    '5K1': { anio: 5, nombre: '5° Año - Comisión K1' },
    '5K2': { anio: 5, nombre: '5° Año - Comisión K2' },
    '5K3': { anio: 5, nombre: '5° Año - Comisión K3' },
    '5K4': { anio: 5, nombre: '5° Año - Comisión K4' }
  };

  const aniosMap = {};
  const comisionesDbMap = {};

  for (const [codigo, info] of Object.entries(comisionesMap)) {
    // Crear año académico si no existe
    if (!aniosMap[info.anio]) {
      db.run("INSERT INTO anios_academicos (carrera_id, anio) VALUES (?, ?)", [carreraId, info.anio]);
      aniosMap[info.anio] = db.exec("SELECT last_insert_rowid()")[0].values[0][0];
    }

    // Crear comisión
    db.run("INSERT INTO comisiones (anio_academico_id, codigo, descripcion) VALUES (?, ?, ?)", 
      [aniosMap[info.anio], codigo, info.nombre]);
    comisionesDbMap[codigo] = db.exec("SELECT last_insert_rowid()")[0].values[0][0];
  }

  // Insertar materias y horarios
  let totalMaterias = 0;
  let totalHorarios = 0;
  let colorIndex = 0;

  for (const [comisionCodigo, materias] of Object.entries(todosLosDatos)) {
    const comisionId = comisionesDbMap[comisionCodigo];
    
    // Si la comisión no existe en el mapa, saltarla (puede ser una comisión que no configuramos)
    if (!comisionId) {
      console.log(`⚠️  Comisión ${comisionCodigo} no encontrada en comisionesMap, se omite.`);
      continue;
    }
    
    for (const materia of materias) {
      // Asignar color cíclicamente
      const color = colores[colorIndex % colores.length];
      colorIndex++;
      
      db.run("INSERT INTO materias (nombre, color, comision_id) VALUES (?, ?, ?)",
        [materia.nombre, color, comisionId]);
      const materiaId = db.exec("SELECT last_insert_rowid()")[0].values[0][0];
      totalMaterias++;

      for (const horario of materia.horarios) {
        db.run("INSERT INTO horarios (materia_id, dia, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)",
          [materiaId, horario.dia, horario.inicio, horario.fin]);
        totalHorarios++;
      }
    }
  }

  // Guardar base de datos
  const data = db.export();
  const buffer = Buffer.from(data);
  const dbPath = path.join(__dirname, '..', 'database', 'horarios.db');
  fs.writeFileSync(dbPath, buffer);

  console.log('✅ Base de datos creada exitosamente!');
  console.log(`   - Carreras: 1`);
  console.log(`   - Años académicos: ${Object.keys(aniosMap).length}`);
  console.log(`   - Comisiones: ${Object.keys(comisionesDbMap).length}`);
  console.log(`   - Materias: ${totalMaterias}`);
  console.log(`   - Horarios: ${totalHorarios}`);
  console.log(`   - Archivo: ${dbPath}`);

  db.close();
}

createDatabase().catch(console.error);
