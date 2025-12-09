// Estado de la aplicación
let cuatrimestreSeleccionado = null;
let horarioActual = [];
let materiaSeleccionada = null;
let previewActual = null;
let colorIndex = 0;

// Horarios del día (de 8:00 a 23:00)
const horariosDelDia = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", 
    "20:00", "21:00", "22:00", "23:00"
];

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
    mostrarModalCuatrimestre();
});

// Selección de cuatrimestre
function seleccionarCuatrimestre(cuatrimestre) {
    cuatrimestreSeleccionado = cuatrimestre;
    document.getElementById('cuatrimestreModal').style.display = 'none';
    document.getElementById('cuatrimestreActual').textContent = 
        cuatrimestre === 1 ? 'Primer Cuatrimestre' : 'Segundo Cuatrimestre';
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
        const comisiones = item.querySelector('p').textContent;
        let mostrar = true;
        
        if (filtroAnio && !comisiones.includes(filtroAnio + 'K')) {
            mostrar = false;
        }
        
        if (filtroComision && !comisiones.includes(filtroComision)) {
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
    const offsetDentroDeHora = (minutosInicio / 60) * 60; // pixels dentro de la hora
    
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

// Agregar materia al horario
function agregarAlHorario(materia, comision) {
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
    cerrarPanelHorarios();
    
    // Mostrar mensaje de éxito
    mostrarNotificacion(`✓ ${materia.nombre} (${comision}) agregada al horario`, 'success');
}

// Renderizar horario en el calendario
function renderizarHorario() {
    // Limpiar solo eventos confirmados (no previews)
    document.querySelectorAll('.calendar-event:not(.preview)').forEach(e => e.remove());
    
    // Renderizar cada materia
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
    
    // Calcular posición dentro de la celda de 1 hora
    const horaInicio = parseInt(horario.inicio.split(':')[0]);
    const minutosInicio = parseInt(horario.inicio.split(':')[1]);
    const offsetDentroDeHora = (minutosInicio / 60) * 60; // pixels dentro de la hora
    
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
function exportarHorario() {
    if (horarioActual.length === 0) {
        mostrarNotificacion('No hay materias en el horario para exportar', 'warning');
        return;
    }
    
    let texto = `HORARIO - ${cuatrimestreSeleccionado === 1 ? 'PRIMER' : 'SEGUNDO'} CUATRIMESTRE\n`;
    texto += `Ingeniería en Sistemas de Información - UTN FRRO\n`;
    texto += `Generado el: ${new Date().toLocaleDateString()}\n\n`;
    texto += '='.repeat(60) + '\n\n';
    
    // Agrupar por día
    const porDia = {};
    diasSemana.forEach(dia => porDia[dia] = []);
    
    horarioActual.forEach(item => {
        item.horarios.forEach(horario => {
            porDia[horario.dia].push({
                nombre: item.nombre,
                comision: item.comision,
                inicio: horario.inicio,
                fin: horario.fin
            });
        });
    });
    
    // Generar texto por día
    diasSemana.forEach(dia => {
        if (porDia[dia].length > 0) {
            texto += `${dia.toUpperCase()}\n`;
            texto += '-'.repeat(60) + '\n';
            
            porDia[dia]
                .sort((a, b) => convertirHoraAMinutos(a.inicio) - convertirHoraAMinutos(b.inicio))
                .forEach(clase => {
                    texto += `  ${clase.inicio} - ${clase.fin}: ${clase.nombre} (${clase.comision})\n`;
                });
            
            texto += '\n';
        }
    });
    
    texto += '='.repeat(60) + '\n';
    texto += `\nTotal de materias: ${horarioActual.length}\n`;
    
    // Descargar archivo
    const blob = new Blob([texto], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `horario_${cuatrimestreSeleccionado}C_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    mostrarNotificacion('✓ Horario exportado correctamente', 'success');
}

// Sistema de notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear contenedor si no existe
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
        success: '#27ae60',
        danger: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
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
