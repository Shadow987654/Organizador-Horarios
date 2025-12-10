// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Estado de la aplicación
let cuatrimestreSeleccionado = null;
let horarioActual = [];
let materiaSeleccionada = null;
let previewActual = null;
let colorIndex = 0;
let materiasData = {}; // Se cargará desde la API

// Horarios del día (de 8:00 a 23:00)
const horariosDelDia = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", 
    "20:00", "21:00", "22:00", "23:00"
];

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// =========================
// FUNCIONES DE API
// =========================

async function cargarDatosDesdeAPI(cuatrimestre) {
    try {
        mostrarNotificacion('Cargando datos...', 'info');
        
        const response = await fetch(`${API_URL}/datos-completos?cuatrimestre=${cuatrimestre}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        materiasData = await response.json();
        console.log('✅ Datos cargados desde API:', Object.keys(materiasData).length, 'comisiones');
        
        return materiasData;
    } catch (error) {
        console.error('❌ Error al cargar datos desde API:', error);
        mostrarNotificacion('Error al cargar datos. Usando datos locales como respaldo.', 'warning');
        
        // Fallback: usar data.js si existe
        if (typeof window.materiasDataLocal !== 'undefined') {
            materiasData = window.materiasDataLocal;
            return materiasData;
        }
        
        throw error;
    }
}

// Verificar estado de la API
async function verificarAPI() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        console.log('🚀 API Status:', data.message);
        return true;
    } catch (error) {
        console.warn('⚠️  API no disponible. La aplicación funcionará con datos locales.');
        return false;
    }
}

// =========================
// INICIALIZACIÓN
// =========================

window.addEventListener('DOMContentLoaded', async () => {
    // Verificar API
    await verificarAPI();
    
    mostrarModalCuatrimestre();
});

// Selección de cuatrimestre
async function seleccionarCuatrimestre(cuatrimestre) {
    cuatrimestreSeleccionado = cuatrimestre;
    document.getElementById('cuatrimestreModal').style.display = 'none';
    document.getElementById('cuatrimestreActual').textContent = 
        cuatrimestre === 1 ? 'Primer Cuatrimestre' : 'Segundo Cuatrimestre';
    
    // Cargar datos desde API
    await cargarDatosDesdeAPI(cuatrimestre);
    
    inicializarCalendario();
    cargarMaterias();
}

function cambiarCuatrimestre() {
    if (horarioActual.length > 0) {
        if (!confirm('¿Estás seguro? Se perderá tu horario actual.')) {
            return;
        }
    }
    limpiarHorario();
    mostrarModalCuatrimestre();
}

function mostrarModalCuatrimestre() {
    document.getElementById('cuatrimestreModal').style.display = 'flex';
}

// Inicializar calendario
function inicializarCalendario() {
    const calendario = document.getElementById('calendario');
    calendario.innerHTML = '';
    
    // Header vacío para la columna de horas
    const emptyHeader = document.createElement('div');
    emptyHeader.className = 'calendar-header-cell';
    emptyHeader.textContent = 'Hora';
    calendario.appendChild(emptyHeader);
    
    // Headers de días
    diasSemana.forEach(dia => {
        const header = document.createElement('div');
        header.className = 'calendar-header-cell';
        header.textContent = dia;
        calendario.appendChild(header);
    });
    
    // Crear celdas por cada hora
    horariosDelDia.forEach(hora => {
        // Label de tiempo
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        timeLabel.textContent = hora;
        calendario.appendChild(timeLabel);
        
        // Celdas para cada día
        diasSemana.forEach(dia => {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            cell.dataset.dia = dia;
            cell.dataset.hora = hora;
            calendario.appendChild(cell);
        });
    });
}

// Cargar lista de materias
function cargarMaterias() {
    const listaMaterias = document.getElementById('listaMaterias');
    listaMaterias.innerHTML = '';
    
    const todasLasMaterias = [];
    
    // Recopilar todas las materias disponibles para el cuatrimestre seleccionado
    Object.keys(materiasData).forEach(comision => {
        materiasData[comision].forEach(materia => {
            if (materia.cuatrimestre.includes(cuatrimestreSeleccionado)) {
                todasLasMaterias.push({
                    ...materia,
                    comision: comision,
                    anio: comision.charAt(0)
                });
            }
        });
    });
    
    // Agrupar por nombre de materia (eliminar duplicados)
    const materiasUnicas = {};
    todasLasMaterias.forEach(materia => {
        const key = materia.nombre;
        if (!materiasUnicas[key]) {
            materiasUnicas[key] = {
                nombre: materia.nombre,
                electiva: materia.electiva,
                tipo: materia.tipo,
                comisiones: []
            };
        }
        materiasUnicas[key].comisiones.push(materia.comision);
    });
    
    // Filtrar materias que ya están en el horario
    const materiasEnHorario = horarioActual.map(item => item.nombre);
    Object.keys(materiasUnicas).forEach(key => {
        if (materiasEnHorario.includes(key)) {
            delete materiasUnicas[key];
        }
    });
    
    // Ordenar y mostrar
    Object.values(materiasUnicas)
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .forEach(materia => {
            const materiaElement = crearElementoMateria(materia);
            listaMaterias.appendChild(materiaElement);
        });
}

function crearElementoMateria(materia) {
    const div = document.createElement('div');
    div.className = 'materia-item' + (materia.electiva ? ' electiva' : '');
    
    const comisionesText = materia.comisiones.join(', ');
    
    div.innerHTML = `
        <h3>${materia.nombre}</h3>
        <p>${materia.tipo} - ${comisionesText}</p>
        <span class="materia-badge ${materia.electiva ? 'electiva' : ''}">
            ${materia.electiva ? 'Electiva' : 'Obligatoria'}
        </span>
    `;
    
    div.addEventListener('click', () => mostrarHorariosDisponibles(materia.nombre));
    
    return div;
}

// Filtrar materias
function filtrarMaterias() {
    const filtroAnio = document.getElementById('filtroAnio').value;
    const filtroComision = document.getElementById('filtroComision').value;
    
    const items = document.querySelectorAll('.materia-item');
    
    items.forEach(item => {
        const texto = item.textContent.toLowerCase();
        let mostrar = true;
        
        if (filtroAnio && !texto.includes(filtroAnio.toLowerCase())) {
            mostrar = false;
        }
        
        if (filtroComision && !texto.includes(filtroComision.toLowerCase())) {
            mostrar = false;
        }
        
        item.style.display = mostrar ? 'block' : 'none';
    });
}

// Mostrar horarios disponibles de una materia
function mostrarHorariosDisponibles(nombreMateria) {
    materiaSeleccionada = nombreMateria;
    
    // Limpiar preview anterior
    limpiarPreview();
    
    // Mostrar preview en el calendario para todas las comisiones
    const previews = [];
    
    Object.keys(materiasData).forEach(comision => {
        const materia = materiasData[comision].find(m => 
            m.nombre === nombreMateria && 
            m.cuatrimestre.includes(cuatrimestreSeleccionado)
        );
        
        if (materia) {
            const hayConflicto = verificarConflicto(materia.horarios);
            previews.push({
                materia: materia,
                comision: comision,
                conflicto: hayConflicto
            });
        }
    });
    
    // Guardar previews actuales
    previewActual = previews;
    
    // Renderizar previews en el calendario
    previews.forEach(preview => {
        renderizarPreview(preview.materia, preview.comision, preview.conflicto);
    });
    
    // Mostrar mensaje informativo
    mostrarNotificacion(
        `Selecciona una comisión en el calendario. Verde = disponible, Rojo = conflicto`,
        'info'
    );
}

function renderizarPreview(materia, comision, hayConflicto) {
    materia.horarios.forEach(horario => {
        const evento = crearEventoPreview(materia, comision, horario, hayConflicto);
        const cell = encontrarCelda(horario.dia, horario.inicio);
        
        if (cell) {
            cell.appendChild(evento);
        }
    });
}

function crearEventoPreview(materia, comision, horario, hayConflicto) {
    const div = document.createElement('div');
    div.className = `calendar-event preview ${hayConflicto ? 'conflicto' : 'disponible'}`;
    div.dataset.preview = 'true';
    div.dataset.comision = comision;
    
    const inicio = convertirHoraAMinutos(horario.inicio);
    const fin = convertirHoraAMinutos(horario.fin);
    const duracion = fin - inicio;
    
    // Calcular posición dentro de la celda de 1 hora
    const horaInicio = parseInt(horario.inicio.split(':')[0]);
    const minutosInicio = parseInt(horario.inicio.split(':')[1]);
    const offsetDentroDeHora = (minutosInicio / 60) * 60;
    
    const height = (duracion / 60) * 60 - 4;
    
    div.style.top = `${offsetDentroDeHora}px`;
    div.style.height = `${height}px`;
    
    div.innerHTML = `
        <div class="event-name">${materia.nombre}</div>
        <div class="event-time">${horario.inicio} - ${horario.fin}</div>
        <div class="event-commission">${comision}</div>
        <div class="status-badge ${hayConflicto ? 'conflicto' : 'disponible'}">
            ${hayConflicto ? '❌ Conflicto' : '✓ Disponible'}
        </div>
    `;
    
    div.title = `${materia.nombre}\n${comision}\n${horario.dia} ${horario.inicio}-${horario.fin}\n${hayConflicto ? 'CONFLICTO - No disponible' : 'Click para agregar'}`;
    
    // Solo permitir click si no hay conflicto
    if (!hayConflicto) {
        div.addEventListener('click', (e) => {
            e.stopPropagation();
            agregarAlHorarioDesdePreview(materia, comision);
        });
    }
    
    return div;
}

function limpiarPreview() {
    document.querySelectorAll('.calendar-event.preview').forEach(e => e.remove());
    previewActual = null;
}

function agregarAlHorarioDesdePreview(materia, comision) {
    limpiarPreview();
    
    const color = `event-color-${(colorIndex % 8) + 1}`;
    colorIndex++;
    
    const item = {
        ...materia,
        comision: comision,
        color: color,
        id: Date.now()
    };
    
    horarioActual.push(item);
    renderizarHorario();
    cargarMaterias();
    
    mostrarNotificacion(`✓ ${materia.nombre} (${comision}) agregada al horario`, 'success');
}

// Verificar conflicto horario
function verificarConflicto(nuevosHorarios) {
    return nuevosHorarios.some(nuevoHorario => {
        return horarioActual.some(horarioExistente => {
            return horarioExistente.horarios.some(existente => {
                if (existente.dia !== nuevoHorario.dia) return false;
                
                const nuevoInicio = convertirHoraAMinutos(nuevoHorario.inicio);
                const nuevoFin = convertirHoraAMinutos(nuevoHorario.fin);
                const existenteInicio = convertirHoraAMinutos(existente.inicio);
                const existenteFin = convertirHoraAMinutos(existente.fin);
                
                return (nuevoInicio < existenteFin && nuevoFin > existenteInicio);
            });
        });
    });
}

function convertirHoraAMinutos(hora) {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
}

// Renderizar horario en el calendario
function renderizarHorario() {
    document.querySelectorAll('.calendar-event:not(.preview)').forEach(e => e.remove());
    
    horarioActual.forEach(item => {
        item.horarios.forEach(horario => {
            const evento = crearEventoCalendario(item, horario);
            const cell = encontrarCelda(horario.dia, horario.inicio);
            
            if (cell) {
                cell.appendChild(evento);
            }
        });
    });
}

function crearEventoCalendario(item, horario) {
    const div = document.createElement('div');
    div.className = `calendar-event ${item.color}`;
    
    const inicio = convertirHoraAMinutos(horario.inicio);
    const fin = convertirHoraAMinutos(horario.fin);
    const duracion = fin - inicio;
    
    const horaInicio = parseInt(horario.inicio.split(':')[0]);
    const minutosInicio = parseInt(horario.inicio.split(':')[1]);
    const offsetDentroDeHora = (minutosInicio / 60) * 60;
    
    const height = (duracion / 60) * 60 - 4;
    
    div.style.top = `${offsetDentroDeHora}px`;
    div.style.height = `${height}px`;
    
    div.innerHTML = `
        <div class="event-name">${item.nombre}</div>
        <div class="event-time">${horario.inicio} - ${horario.fin}</div>
        <div class="event-commission">${item.comision}</div>
        <button class="btn-remove" onclick="eliminarDelHorario(${item.id}); event.stopPropagation();">×</button>
    `;
    
    div.title = `${item.nombre}\n${item.comision}\n${horario.dia} ${horario.inicio}-${horario.fin}`;
    
    return div;
}

function encontrarCelda(dia, hora) {
    const horaBase = hora.split(':')[0] + ':00';
    return document.querySelector(`[data-dia="${dia}"][data-hora="${horaBase}"]`);
}

// Eliminar materia del horario
function eliminarDelHorario(id) {
    const index = horarioActual.findIndex(item => item.id === id);
    if (index !== -1) {
        const materia = horarioActual[index];
        horarioActual.splice(index, 1);
        renderizarHorario();
        cargarMaterias();
        mostrarNotificacion(`✗ ${materia.nombre} (${materia.comision}) eliminada del horario`, 'danger');
    }
}

// Limpiar horario completo
function limpiarHorario() {
    if (horarioActual.length === 0) {
        mostrarNotificacion('El horario ya está vacío', 'warning');
        return;
    }
    
    if (confirm('¿Estás seguro de que deseas limpiar todo el horario?')) {
        horarioActual = [];
        colorIndex = 0;
        limpiarPreview();
        renderizarHorario();
        cargarMaterias();
        mostrarNotificacion('Horario limpiado correctamente', 'success');
    }
}

// Cerrar panel de horarios
function cerrarPanelHorarios() {
    limpiarPreview();
    document.getElementById('panelHorarios').style.display = 'none';
    materiaSeleccionada = null;
}

// Exportar horario
async function exportarHorario() {
    if (horarioActual.length === 0) {
        mostrarNotificacion('No hay materias en el horario para exportar', 'warning');
        return;
    }
    
    try {
        limpiarPreview();
        
        const captureContainer = document.createElement('div');
        captureContainer.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            background: white;
            padding: 30px;
            border-radius: 12px;
        `;
        
        const calendario = document.getElementById('calendario').cloneNode(true);
        
        const captureContent = document.createElement('div');
        captureContent.style.cssText = `
            background: white;
            padding: 20px;
            min-width: 1200px;
        `;
        
        const titulo = document.createElement('div');
        titulo.style.cssText = `
            text-align: center;
            margin-bottom: 20px;
            padding: 20px;
            background: #184e77;
            color: white;
            border-radius: 8px;
        `;
        titulo.innerHTML = `
            <h1 style="margin: 0 0 10px 0; font-size: 2rem;">Mi Horario</h1>
            <p style="margin: 0; font-size: 1.2rem;">${cuatrimestreSeleccionado === 1 ? 'Primer Cuatrimestre' : 'Segundo Cuatrimestre'}</p>
            <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.9;">Ingeniería en Sistemas de Información - UTN FRRO</p>
            <p style="margin: 5px 0 0 0; font-size: 0.85rem; opacity: 0.8;">Generado el: ${new Date().toLocaleDateString('es-AR')}</p>
        `;
        
        captureContent.appendChild(titulo);
        captureContent.appendChild(calendario);
        captureContainer.appendChild(captureContent);
        document.body.appendChild(captureContainer);
        
        mostrarNotificacion('Generando imagen...', 'info');
        
        const canvas = await html2canvas(captureContent, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
            width: captureContent.scrollWidth,
            height: captureContent.scrollHeight
        });
        
        document.body.removeChild(captureContainer);
        
        canvas.toBlob((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `horario_${cuatrimestreSeleccionado}C_${new Date().toLocaleDateString('es-AR').replace(/\//g, '-')}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            mostrarNotificacion('✓ Horario exportado como imagen', 'success');
        });
        
    } catch (error) {
        console.error('Error al exportar:', error);
        mostrarNotificacion('Error al exportar el horario', 'danger');
    }
}

// Sistema de notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    let container = document.getElementById('notificaciones');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificaciones';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }
    
    const notif = document.createElement('div');
    notif.style.cssText = `
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    const colores = {
        success: '#52b69a',
        danger: '#e74c3c',
        warning: '#f39c12',
        info: '#34a0a4'
    };
    
    notif.style.background = colores[tipo] || colores.info;
    notif.textContent = mensaje;
    
    container.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Agregar animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

