# Organizador de Horarios - ISI UTN FRC

Aplicación web responsive para organizar horarios de las materias de 4to y 5to año de Ingeniería en Sistemas de Información.

## Características

- **Selección de cuatrimestre**: Elige entre primer o segundo cuatrimestre al inicio
- **Calendario visual**: Vista semanal de Lunes a Sábado (8:00 a 23:00)
- **Detección de conflictos**: Indica automáticamente si hay superposición horaria
- **Colores distintivos**: Cada materia se muestra con un color diferente
- **Filtros**: Filtra materias por año (4to/5to) y por comisión
- **Combinación flexible**: Combina materias de 4to y 5to año según necesites
- **Exportación**: Descarga tu horario en formato texto
- **Responsive**: Funciona en desktop, tablet y móvil

## Comisiones disponibles

- **4to Año**: 4K1, 4K2, 4K3, 4K4
- **5to Año**: 5K1, 5K2, 5K3, 5K4

## Tipos de materias

- **Anuales**: Disponibles en ambos cuatrimestres
- **Cuatrimestrales**: Solo primer o segundo cuatrimestre
- **Obligatorias**: Materias requeridas
- **Electivas**: Materias opcionales (marcadas con color naranja)

## Cómo usar

1. **Selecciona el cuatrimestre** al abrir la aplicación
2. **Explora las materias** en el panel lateral
3. **Haz clic en una materia** para ver horarios disponibles
4. **Verifica disponibilidad**: 
   - ✅ Verde = Sin conflictos, puedes agregar
   - ❌ Rojo = Conflicto horario, no se puede agregar
5. **Haz clic en una comisión** para agregarla al calendario
6. **Exporta tu horario** cuando hayas terminado

## Estructura de archivos

```
Organizador-Horarios/
├── index.html      # Estructura de la aplicación
├── styles.css      # Estilos y diseño responsive
├── data.js         # Datos de materias y horarios
├── app.js          # Lógica de la aplicación
└── README.md       # Este archivo
```

## Tecnologías utilizadas

- HTML5
- CSS3 (Grid, Flexbox, animaciones)
- JavaScript (ES6+)
- Sin dependencias externas

## Instalación

No requiere instalación. Simplemente abre `index.html` en tu navegador web favorito.

## Navegadores compatibles

- Chrome/Edge (recomendado)
- Firefox
- Safari
- Opera

## Características técnicas

- **100% offline**: No requiere conexión a internet
- **Sin backend**: Todo funciona en el navegador
- **Ligero**: Menos de 200KB en total
- **Rápido**: Carga instantánea

## Funcionalidades adicionales

- **Notificaciones**: Feedback visual de todas las acciones
- **Cambio de cuatrimestre**: Cambia entre cuatrimestres sin recargar
- **Eliminar materias**: Haz clic en la × sobre cada materia en el calendario
- **Limpiar horario**: Borra todas las materias de una vez

## Autor

Creado para estudiantes de ISI - UTN FRRO

## Licencia

Libre uso para estudiantes de la UTN FRRO
