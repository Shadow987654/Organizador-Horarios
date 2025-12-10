# Organizador de Horarios - ISI UTN FRRO

Sistema completo para organizar horarios universitarios con base de datos SQLite y API REST.

## 📁 Estructura del Proyecto

```
Organizador-Horarios/
├── frontend/              # Aplicación web (cliente)
│   ├── index.html        # Página principal
│   ├── css/
│   │   └── styles.css    # Estilos de la aplicación
│   └── js/
│       ├── app.js        # Lógica principal (usa data.js local)
│       ├── app-api.js    # Lógica con API (usa backend)
│       └── data.js       # Datos estáticos (fallback)
│
├── backend/              # Servidor API Node.js
│   ├── server.js         # Servidor Express
│   ├── package.json      # Dependencias del backend
│   └── scripts/
│       ├── init-database.js   # Inicializar BD
│       └── migrate-data.js    # Migrar datos JS → SQL
│
├── database/             # Base de datos SQLite
│   ├── schema.sql        # Esquema de tablas
│   ├── seed.sql          # Datos iniciales
│   └── organizador_horarios.db  # BD (generada)
│
├── docs/                 # Documentación
│   └── README.md         # Este archivo
│
└── pdfs/                 # Archivos PDF de horarios
    ├── F0D_tercer2025.pdf
    ├── ED3_horarios_2do_completo.pdf
    └── 263_horarios_1ro_completo.pdf
```

## 🚀 Inicio Rápido

### Opción 1: Solo Frontend (sin base de datos)

1. Abre `frontend/index.html` en tu navegador
2. Los datos se cargan desde `frontend/js/data.js`

### Opción 2: Con Backend y Base de Datos

#### Paso 1: Instalar dependencias del backend

```powershell
cd backend
npm install
```

#### Paso 2: Inicializar la base de datos

```powershell
npm run init-db
```

#### Paso 3: Migrar datos desde data.js

```powershell
npm run migrate
```

#### Paso 4: Iniciar el servidor

```powershell
npm start
```

El servidor estará disponible en `http://localhost:3000`

#### Paso 5: Configurar el frontend

1. Edita `frontend/index.html`
2. Comenta la línea de `app.js` y descomenta `app-api.js`:

```html
<!-- <script src="js/app.js"></script> -->
<script src="js/app-api.js"></script>
```

3. Abre `frontend/index.html` en tu navegador

## 📊 Estructura de la Base de Datos

### Tablas principales:

- **carreras**: Información de las carreras (ISI, etc.)
- **anios_academicos**: Años de cada carrera (1ro a 5to)
- **comisiones**: Comisiones por año (4K1, 4K2, 5K1, etc.)
- **materias**: Materias con su tipo y cuatrimestre
- **materias_comisiones**: Relación N:N entre materias y comisiones
- **horarios**: Horarios de cada materia por comisión

## 🛠️ API Endpoints

### Datos completos (compatible con frontend)
```
GET /api/datos-completos?cuatrimestre=1
```

### Otras rutas disponibles:
```
GET /api/health                          # Estado de la API
GET /api/carreras                        # Listar carreras
GET /api/carreras/:id/anios              # Años de una carrera
GET /api/anios/:id/comisiones            # Comisiones de un año
GET /api/materias?anioId=4&cuatrimestre=1  # Filtrar materias
GET /api/materias-comisiones             # Materias con comisiones
GET /api/horarios/:materiaComisionId     # Horarios específicos
```

## 📝 Scripts Disponibles

### Backend:

```powershell
npm start       # Iniciar servidor
npm run dev     # Modo desarrollo (con nodemon)
npm run init-db # Crear base de datos
npm run migrate # Migrar datos desde data.js
```

## 🎨 Características

- ✅ Interfaz responsive (móvil, tablet, desktop)
- ✅ Detección automática de conflictos horarios
- ✅ Exportación a PNG
- ✅ Filtros por año y comisión
- ✅ Materias desaparecen al agregarlas
- ✅ Paleta de colores verde-azul moderna
- ✅ Base de datos SQLite
- ✅ API REST con Node.js/Express
- ✅ Fallback a datos locales si API no está disponible

## 🔧 Tecnologías Utilizadas

### Frontend:
- HTML5, CSS3, JavaScript (ES6+)
- html2canvas (exportación a imagen)
- Sin frameworks (vanilla JS)

### Backend:
- Node.js
- Express.js
- better-sqlite3
- CORS

## 📖 Cómo Usar la Aplicación

1. **Selecciona el cuatrimestre** (1° o 2°)
2. **Explora las materias** en el panel lateral
3. **Haz clic en una materia** para ver horarios
4. **Selecciona una comisión** en el calendario:
   - 🟢 Verde = Sin conflictos
   - 🔴 Rojo = Conflicto horario
5. **Exporta tu horario** cuando termines

## 🤝 Contribuir

Para agregar horarios de nuevos años:

1. Edita `database/seed.sql` para agregar años
2. Inserta datos en la BD directamente o
3. Actualiza `frontend/js/data.js` y ejecuta `npm run migrate`

## 📄 Licencia

Libre uso para estudiantes de la UTN FRRO

---

**Desarrollado para estudiantes de Ingeniería en Sistemas de Información - UTN FRRO**
