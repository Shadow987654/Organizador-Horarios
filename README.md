# Organizador de Horarios - ISI UTN FRC

Sistema completo para organizar horarios universitarios con base de datos SQLite y API REST.

## 🎯 Características

✅ Base de datos SQLite (no más datos hardcodeados)
✅ API REST con Node.js + Express
✅ 87 materias de 4° y 5° año
✅ 8 comisiones (4K1-4K4, 5K1-5K4)
✅ 163 horarios almacenados
✅ Interfaz web intuitiva
✅ Exportar horarios a PNG

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
│       └── data.js       # Datos estáticos (para migración)
│
├── backend/              # Servidor API Node.js
│   ├── server.js         # Servidor Express con SQLite
│   ├── init-db.js        # Script para crear la base de datos
│   └── package.json      # Dependencias del backend
│
├── database/             # Base de datos SQLite
│   ├── horarios.db       # Base de datos SQLite (generada)
│   ├── schema.sql        # Esquema de referencia
│   └── seed.sql          # Datos de ejemplo
│
├── docs/                 # Documentación
│   ├── README.md         # Documentación general
│   └── DATABASE.md       # Documentación de la base de datos
│
└── pdfs/                 # Archivos PDF de horarios originales
    ├── F0D_tercer2025.pdf
    ├── ED3_horarios_2do_completo.pdf
    └── 263_horarios_1ro_completo.pdf
```

## 🚀 Inicio Rápido

### Requisitos

- Node.js 16 o superior
- npm

### Instalación

1. **Instalar dependencias**

```powershell
cd backend
npm install
```

2. **Crear la base de datos**

```powershell
npm run init-db
```

Esto creará `database/horarios.db` con todos los datos.

3. **Iniciar el servidor**

```powershell
npm start
```

4. **Abrir en el navegador**

Visita: http://localhost:3000/frontend

## 📡 API Endpoints

- `GET /api/health` - Estado del servidor
- `GET /api/comisiones` - Lista de comisiones
- `GET /api/comisiones/:codigo/materias` - Materias de una comisión
- `GET /api/materias` - Todas las materias organizadas

## 💾 Base de Datos

La base de datos SQLite (`database/horarios.db`) contiene:

### Tablas:

- **carreras**: Carreras universitarias
- **anios_academicos**: Años académicos (4° y 5°)
- **comisiones**: Comisiones/cursos (4K1-4K4, 5K1-5K4)
- **materias**: Materias con colores asignados
- **horarios**: Horarios de cada materia

### Datos almacenados:

- 1 Carrera (TUP - Tecnicatura Universitaria en Programación)
- 2 Años académicos (4° y 5°)
- 8 Comisiones
- 87 Materias
- 163 Horarios

Ver más detalles en [`docs/DATABASE.md`](docs/DATABASE.md)

## 🔄 Actualizar los Datos

Si necesitas actualizar los horarios:

1. Modifica `frontend/js/data.js`
2. Ejecuta `npm run init-db` para recrear la base de datos
3. Reinicia el servidor

## 📝 Scripts Disponibles

```powershell
npm start       # Iniciar servidor
npm run dev     # Modo desarrollo (con nodemon)
npm run init-db # Crear/recrear base de datos
```

## 🎨 Características

- ✅ Base de datos SQLite (datos persistentes)
- ✅ API REST con Node.js/Express
- ✅ Interfaz responsive (móvil, tablet, desktop)
- ✅ Detección automática de conflictos horarios
- ✅ Exportación a PNG
- ✅ 87 materias organizadas en 8 comisiones
- ✅ Paleta de colores verde-azul moderna
- ✅ Sin compilación nativa (usa sql.js)

## 🐛 Solución de Problemas

**Error: "Base de datos no encontrada"**
```powershell
cd backend
npm run init-db
```

**El servidor no inicia**
```powershell
cd backend
npm install
npm start
```

**Puerto 3000 en uso**

Detén otros servidores o cambia el puerto en `backend/server.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

## 📚 Documentación Adicional

- [Documentación de la Base de Datos](docs/DATABASE.md)
- [README Original](docs/README.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.## 🔧 Tecnologías Utilizadas

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
