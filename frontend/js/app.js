// Estado de la aplicación
let cuatrimestreSeleccionado = null;
let horarioActual = [];
let materiaSeleccionada = null;
let previewActual = null;
let colorIndex = 0;
let todasLasMaterias = {};

// Horarios del día (de 8:00 a 23:00)
const horariosDelDia = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", 
    "20:00", "21:00", "22:00", "23:00"
];

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
    cargarDatosIniciales();
    mostrarModalCuatrimestre();
});

// Cargar datos desde la API o desde data.js local
async function cargarDatosIniciales() {
    try {
        // Intentar cargar desde la API
        const response = await fetch('http://localhost:3000/api/materias');
        if (response.ok) {
            todasLasMaterias = await response.json();
            console.log('✅ Datos cargados desde la API');
        } else {
            throw new Error('API no disponible');
        }
    } catch (error) {
        console.log('⚠️ API no disponible, usando datos locales');
        // Combinar data.js y data-1a3.js si están disponibles
        todasLasMaterias = typeof materiasData !== 'undefined' ? materiasData : {};
        if (typeof materiasData1a3 !== 'undefined') {
            todasLasMaterias = { ...materiasData1a3, ...todasLasMaterias };
        }
    }
}

// Selección de cuatrimestre
function seleccionarCuatrimestre(cuatrimestre) {
    cuatrimestreSeleccionado = cuatrimestre;
    document.getElementById('cuatrimestreModal').style.display = 'none';
    document.getElementById('cuatrimestreActual').textContent = 
        cuatrimestre === 1 ? 'Primer Cuatrimestre' : 'Segundo Cuatrimestre';
    
    inicializarCalendario();
    cargarSelectComisiones();
    cargarMaterias();
}

// Cargar select de comisiones dinámicamente con todas las comisiones disponibles
function cargarSelectComisiones() {
    const select = document.getElementById('filtroComision');
    select.innerHTML = '<option value="">Todas las comisiones</option>';
    
    // Obtener todas las comisiones disponibles en los datos
    const comisiones = Object.keys(todasLasMaterias).sort();
    
    comisiones.forEach(codigo => {
        const option = document.createElement('option');
        option.value = codigo;
        option.textContent = codigo;
        select.appendChild(option);
    });
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
    
    const materiasDelAnio = [];
    
    // Recopilar todas las materias de todos los años para el cuatrimestre seleccionado
    Object.keys(todasLasMaterias).forEach(comision => {
        if (todasLasMaterias[comision]) {
            const anio = parseInt(comision.charAt(0)); // Extraer año de la comisión
            todasLasMaterias[comision].forEach(materia => {
                // Solo incluir materias del cuatrimestre seleccionado
                const perteneceAlCuatrimestre = materia.horarios.some(h => 
                    h.cuatrimestre === cuatrimestreSeleccionado
                );
                
                if (perteneceAlCuatrimestre) {
                    materiasDelAnio.push({
                        ...materia,
                        comision: comision,
                        anio: anio
                    });
                }
            });
        }
    });
    
    // Agrupar por nombre de materia (eliminar duplicados)
    const materiasUnicas = {};
    materiasDelAnio.forEach(materia => {
        const key = materia.nombre;
        if (!materiasUnicas[key]) {
            materiasUnicas[key] = {
                nombre: materia.nombre,
                comisiones: [],
                horariosPorComision: {},
                anio: materia.anio // Guardar el año para ordenar
            };
        }
        materiasUnicas[key].comisiones.push(materia.comision);
        materiasUnicas[key].horariosPorComision[materia.comision] = materia.horarios;
    });
    
    // Filtrar materias que ya están en el horario
    const materiasEnHorario = horarioActual.map(item => item.nombre);
    Object.keys(materiasUnicas).forEach(key => {
        if (materiasEnHorario.includes(key)) {
            delete materiasUnicas[key];
        }
    });
    
    // Ordenar por año y luego por nombre
    Object.values(materiasUnicas)
        .sort((a, b) => {
            if (a.anio !== b.anio) return a.anio - b.anio;
            return a.nombre.localeCompare(b.nombre);
        })
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
        <p>${materia.tipo || 'Materia'} - ${comisionesText}</p>
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
        const texto = item.textContent;
        let mostrar = true;
        
        // Filtrar por año (buscar "Nº Año" en el texto)
        if (filtroAnio) {
            const anioPattern = new RegExp(`${filtroAnio}[°º]\\s*Año`, 'i');
            if (!anioPattern.test(texto)) {
                mostrar = false;
            }
        }
        
        // Filtrar por comisión
        if (filtroComision && !texto.includes(filtroComision)) {
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
    
    // Mostrar opciones disponibles en el panel lateral
    const panelHorarios = document.getElementById('panelHorarios');
    const nombreMateriaSeleccionada = document.getElementById('nombreMateriaSeleccionada');
    const horariosDisponibles = document.getElementById('horariosDisponibles');
    
    nombreMateriaSeleccionada.textContent = nombreMateria;
    horariosDisponibles.innerHTML = '';
    
    // Recopilar todas las comisiones que tienen esta materia
    const comisionesConMateria = [];
    
    Object.keys(todasLasMaterias).forEach(comision => {
        if (todasLasMaterias[comision]) {
            const materia = todasLasMaterias[comision].find(m => m.nombre === nombreMateria);
            
            if (materia) {
                // Filtrar horarios por cuatrimestre seleccionado
                const horariosDelCuatrimestre = materia.horarios.filter(h => 
                    h.cuatrimestre === cuatrimestreSeleccionado
                );
                
                if (horariosDelCuatrimestre.length > 0) {
                    comisionesConMateria.push({
                        comision: comision,
                        materia: materia,
                        horarios: horariosDelCuatrimestre
                    });
                }
            }
        }
    });
    
    // Crear botones para cada comisión
    comisionesConMateria.forEach(({ comision, materia, horarios }) => {
        const hayConflicto = verificarConflicto(horarios);
        
        const div = document.createElement('div');
        div.className = 'horario-opcion' + (hayConflicto ? ' conflicto' : '');
        
        const detallesHorarios = horarios.map(h => 
            `${h.dia}: ${h.horaInicio}-${h.horaFin}${h.tipo ? ' (' + h.tipo + ')' : ''}`
        ).join('<br>');
        
        div.innerHTML = `
            <h4>Comisión ${comision}</h4>
            <p>${detallesHorarios}</p>
            ${hayConflicto ? '<span class="badge-conflicto">⚠️ Conflicto de horarios</span>' : ''}
        `;
        
        if (!hayConflicto) {
            div.onclick = () => agregarMateria(comision);
        } else {
            div.style.cursor = 'not-allowed';
            div.style.opacity = '0.6';
        }
        
        horariosDisponibles.appendChild(div);
    });
    
    panelHorarios.style.display = 'block';
}

// Agregar materia al horario desde el panel
function agregarMateria(comision) {
    if (!materiaSeleccionada) return;
    
    limpiarPreview();
    
    // Buscar la materia en todasLasMaterias para obtener sus horarios
    const materiaCompleta = todasLasMaterias[comision]?.find(m => m.nombre === materiaSeleccionada);
    
    if (!materiaCompleta) {
        mostrarNotificacion(`❌ No se encontró la materia en ${comision}`, 'error');
        return;
    }
    
    // Filtrar horarios por cuatrimestre seleccionado
    const horariosDelCuatrimestre = materiaCompleta.horarios.filter(h => 
        h.cuatrimestre === cuatrimestreSeleccionado
    );
    
    // Verificar conflictos
    if (verificarConflicto(horariosDelCuatrimestre)) {
        mostrarNotificacion(`❌ Hay conflicto de horarios con ${comision}`, 'error');
        return;
    }
    
    const color = `event-color-${(colorIndex % 10) + 1}`;
    colorIndex++;
    
    const item = {
        ...materiaCompleta,
        horarios: horariosDelCuatrimestre,
        comision: comision,
        color: color,
        id: Date.now()
    };
    
    horarioActual.push(item);
    renderizarHorario();
    cerrarPanelHorarios();
    cargarMaterias(); // Actualizar lista de materias
    
    mostrarNotificacion(`✓ ${materiaCompleta.nombre} (${comision}) agregada al horario`, 'success');
}

function cerrarPanelHorarios() {
    document.getElementById('panelHorarios').style.display = 'none';
    limpiarPreview();
}

function limpiarPreview() {
    document.querySelectorAll('.calendar-event.preview').forEach(e => e.remove());
    previewActual = null;
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
        cargarMaterias(); // Actualizar lista de materias para volver a mostrar la eliminada
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
        cargarMaterias(); // Actualizar lista de materias para volver a mostrarlas todas
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
        // Limpiar cualquier preview antes de capturar
        limpiarPreview();
        
        // Crear un contenedor temporal para la captura
        const captureContainer = document.createElement('div');
        captureContainer.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            background: white;
            padding: 30px;
            border-radius: 12px;
        `;
        
        // Clonar el calendario y el header
        const calendarHeader = document.querySelector('.calendar-header').cloneNode(true);
        const calendario = document.getElementById('calendario').cloneNode(true);
        
        // Eliminar botones del header clonado
        const actions = calendarHeader.querySelector('.calendar-actions');
        if (actions) actions.remove();
        
        // Crear estructura de captura
        const captureContent = document.createElement('div');
        captureContent.style.cssText = `
            background: white;
            padding: 20px;
            min-width: 1200px;
        `;
        
        // Agregar título mejorado
        const titulo = document.createElement('div');
        titulo.style.cssText = `
            text-align: center;
            margin-bottom: 20px;
            padding: 20px;
            background: #2c3e50;
            color: white;
            border-radius: 8px;
        `;
        titulo.innerHTML = `
            <h1 style="margin: 0 0 10px 0; font-size: 2rem;">Mi Horario</h1>
            <p style="margin: 0; font-size: 1.2rem;">${cuatrimestreSeleccionado === 1 ? 'Primer Cuatrimestre' : 'Segundo Cuatrimestre'}</p>
            <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.9;">Ingeniería en Sistemas de Información - UTN FRC</p>
            <p style="margin: 5px 0 0 0; font-size: 0.85rem; opacity: 0.8;">Generado el: ${new Date().toLocaleDateString('es-AR')}</p>
        `;
        
        captureContent.appendChild(titulo);
        captureContent.appendChild(calendario);
        captureContainer.appendChild(captureContent);
        document.body.appendChild(captureContainer);
        
        // Usar html2canvas para capturar
        mostrarNotificacion('Generando imagen...', 'info');
        
        const canvas = await html2canvas(captureContent, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
            width: captureContent.scrollWidth,
            height: captureContent.scrollHeight
        });
        
        // Eliminar contenedor temporal
        document.body.removeChild(captureContainer);
        
        // Convertir canvas a blob y descargar
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
