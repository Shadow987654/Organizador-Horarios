// Datos de materias y horarios
const materiasData = {
    "4K1": [
        {
            nombre: "Administración de Sistemas de Información",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "08:00", fin: "10:25" },
                { dia: "Jueves", inicio: "08:00", fin: "10:25" }
            ]
        },
        {
            nombre: "Redes de Datos",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "12:05", fin: "14:00" },
                { dia: "Martes", inicio: "08:00", fin: "09:30" }
            ]
        },
        {
            nombre: "Investigación Operativa",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "10:25", fin: "12:05" },
                { dia: "Martes", inicio: "09:40", fin: "11:10" }
            ]
        },
        {
            nombre: "Simulación",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "08:00", fin: "10:25" },
                { dia: "Jueves", inicio: "10:25", fin: "12:50" }
            ]
        },
        {
            nombre: "Gestión de la Mejora de Procesos",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Martes", inicio: "11:20", fin: "14:00" },
                { dia: "Viernes", inicio: "08:00", fin: "09:40" }
            ]
        },
        {
            nombre: "Gestión Industrial de la Producción",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Martes", inicio: "11:20", fin: "14:00" },
                { dia: "Viernes", inicio: "08:00", fin: "09:40" }
            ]
        },
        {
            nombre: "Green Software",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Miércoles", inicio: "10:25", fin: "12:50" },
                { dia: "Viernes", inicio: "10:25", fin: "14:00" }
            ]
        },
        {
            nombre: "Legislación",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "08:00", fin: "11:10" }
            ]
        },
        {
            nombre: "Tecnologías para la automatización",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "11:20", fin: "14:00" },
                { dia: "Viernes", inicio: "08:00", fin: "10:25" }
            ]
        },
        {
            nombre: "Desarrollo de Aplicaciones con Objetos",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Jueves", inicio: "10:25", fin: "12:50" },
                { dia: "Viernes", inicio: "10:25", fin: "14:00" }
            ]
        },
        {
            nombre: "Ingeniería y Calidad de Software",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Martes", inicio: "11:20", fin: "14:00" },
                { dia: "Jueves", inicio: "10:25", fin: "12:50" }
            ]
        }
    ],
    "4K2": [
        {
            nombre: "Administración de Sistemas de Información",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "15:40", fin: "18:05" },
                { dia: "Miércoles", inicio: "13:15", fin: "15:40" }
            ]
        },
        {
            nombre: "Redes de Datos",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "14:00", fin: "15:40" },
                { dia: "Martes", inicio: "14:55", fin: "16:25" }
            ]
        },
        {
            nombre: "Investigación Operativa",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "12:05", fin: "14:00" },
                { dia: "Martes", inicio: "16:35", fin: "18:05" }
            ]
        },
        {
            nombre: "Simulación",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Martes", inicio: "12:05", fin: "14:45" },
                { dia: "Viernes", inicio: "15:40", fin: "18:05" }
            ]
        },
        {
            nombre: "Gestión de la Mejora de Procesos",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Miércoles", inicio: "15:40", fin: "17:20" },
                { dia: "Jueves", inicio: "13:15", fin: "18:05" }
            ]
        },
        {
            nombre: "Green Software",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Miércoles", inicio: "15:40", fin: "17:20" },
                { dia: "Jueves", inicio: "13:15", fin: "18:05" }
            ]
        },
        {
            nombre: "Gestión Industrial de la Producción",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Jueves", inicio: "13:15", fin: "15:40" },
                { dia: "Viernes", inicio: "13:15", fin: "15:40" }
            ]
        },
        {
            nombre: "Legislación",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Jueves", inicio: "15:40", fin: "18:05" }
            ]
        },
        {
            nombre: "Tecnologías para la automatización",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "15:40", fin: "18:05" },
                { dia: "Viernes", inicio: "13:15", fin: "15:40" }
            ]
        },
        {
            nombre: "Desarrollo de Aplicaciones con Objetos",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Miércoles", inicio: "18:15", fin: "19:45" },
                { dia: "Jueves", inicio: "18:15", fin: "19:45" }
            ]
        },
        {
            nombre: "Ingeniería y Calidad de Software",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Martes", inicio: "12:05", fin: "14:45" },
                { dia: "Viernes", inicio: "15:40", fin: "18:05" }
            ]
        },
        {
            nombre: "Seguridad en el Desarrollo de Software",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Viernes", inicio: "13:15", fin: "18:05" }
            ]
        }
    ],
    "4K3": [
        {
            nombre: "Administración de Sistemas de Información",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "17:20", fin: "19:45" },
                { dia: "Jueves", inicio: "18:15", fin: "20:40" }
            ]
        },
        {
            nombre: "Redes de Datos",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "19:00", fin: "20:40" },
                { dia: "Viernes", inicio: "17:20", fin: "19:00" }
            ]
        },
        {
            nombre: "Investigación Operativa",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "17:20", fin: "19:00" },
                { dia: "Viernes", inicio: "19:00", fin: "20:40" }
            ]
        },
        {
            nombre: "Simulación",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Martes", inicio: "20:40", fin: "23:05" },
                { dia: "Viernes", inicio: "20:40", fin: "23:05" }
            ]
        },
        {
            nombre: "Gestión de la Mejora de Procesos",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Martes", inicio: "18:15", fin: "20:40" },
                { dia: "Jueves", inicio: "20:40", fin: "23:05" }
            ]
        },
        {
            nombre: "Gestión Industrial de la Producción",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Martes", inicio: "18:15", fin: "20:40" },
                { dia: "Jueves", inicio: "20:40", fin: "23:05" }
            ]
        },
        {
            nombre: "Seguridad en el Desarrollo de Software",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Martes", inicio: "18:15", fin: "20:40" },
                { dia: "Jueves", inicio: "20:40", fin: "23:05" }
            ]
        },
        {
            nombre: "Legislación",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "19:55", fin: "23:05" }
            ]
        },
        {
            nombre: "Tecnologías para la automatización",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Martes", inicio: "20:40", fin: "23:05" },
                { dia: "Jueves", inicio: "20:40", fin: "23:05" }
            ]
        },
        {
            nombre: "Desarrollo de Aplicaciones con Objetos",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Martes", inicio: "17:20", fin: "20:40" }
            ]
        },
        {
            nombre: "Ingeniería y Calidad de Software",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "20:40", fin: "23:05" },
                { dia: "Viernes", inicio: "20:40", fin: "23:05" }
            ]
        },
        {
            nombre: "Seguridad en el Desarrollo de Software",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Lunes", inicio: "20:40", fin: "23:05" },
                { dia: "Jueves", inicio: "17:20", fin: "19:45" }
            ]
        }
    ],
    "4K4": [
        {
            nombre: "Administración de Sistemas de Información",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "20:40", fin: "23:05" },
                { dia: "Miércoles", inicio: "17:20", fin: "19:45" }
            ]
        },
        {
            nombre: "Redes de Datos",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "17:20", fin: "19:00" },
                { dia: "Jueves", inicio: "17:20", fin: "19:00" }
            ]
        },
        {
            nombre: "Investigación Operativa",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "19:00", fin: "20:40" },
                { dia: "Jueves", inicio: "19:00", fin: "20:40" }
            ]
        },
        {
            nombre: "Ingeniería y Calidad de Software",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Martes", inicio: "20:40", fin: "23:05" },
                { dia: "Viernes", inicio: "18:15", fin: "20:40" }
            ]
        },
        {
            nombre: "Legislación",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "19:55", fin: "23:05" }
            ]
        },
        {
            nombre: "Tecnologías para la automatización",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Jueves", inicio: "20:40", fin: "23:05" },
                { dia: "Viernes", inicio: "20:40", fin: "23:05" }
            ]
        },
        {
            nombre: "Simulación",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Martes", inicio: "20:40", fin: "23:05" },
                { dia: "Miércoles", inicio: "19:55", fin: "22:20" }
            ]
        },
        {
            nombre: "Green Software",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Martes", inicio: "18:15", fin: "19:45" },
                { dia: "Viernes", inicio: "18:15", fin: "20:40" }
            ]
        },
        {
            nombre: "Comunicación Multimedial en el Desarrollo",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Martes", inicio: "18:15", fin: "19:45" },
                { dia: "Viernes", inicio: "18:15", fin: "20:40" }
            ]
        },
        {
            nombre: "Gestión de la Mejora de Procesos",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Jueves", inicio: "20:40", fin: "23:05" },
                { dia: "Viernes", inicio: "20:40", fin: "23:05" }
            ]
        },
        {
            nombre: "Desarrollo y Operaciones DevOps",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Jueves", inicio: "20:40", fin: "23:05" },
                { dia: "Viernes", inicio: "20:40", fin: "23:05" }
            ]
        }
    ],
    "5K1": [
        {
            nombre: "Seguridad en los Sistemas de Información",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "08:00", fin: "10:25" },
                { dia: "Viernes", inicio: "08:00", fin: "10:25" }
            ]
        },
        {
            nombre: "Proyecto Final",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Martes", inicio: "08:00", fin: "12:50" }
            ]
        },
        {
            nombre: "Gestión Gerencial",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "10:25", fin: "12:50" },
                { dia: "Miércoles", inicio: "08:00", fin: "10:25" }
            ]
        },
        {
            nombre: "Sistemas de Gestión",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "10:25", fin: "14:00" },
                { dia: "Jueves", inicio: "08:00", fin: "11:10" }
            ]
        },
        {
            nombre: "Ingeniería de Software de Fuentes Abiertas-Libre",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Sábado", inicio: "08:00", fin: "09:40" }
            ]
        },
        {
            nombre: "Decisiones en Escenarios Complejos",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Jueves", inicio: "11:20", fin: "14:00" },
                { dia: "Viernes", inicio: "10:25", fin: "12:50" }
            ]
        },
        {
            nombre: "Gerenciamiento Estratégico",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Jueves", inicio: "11:20", fin: "14:00" },
                { dia: "Viernes", inicio: "10:25", fin: "12:50" }
            ]
        },
        {
            nombre: "Inteligencia Artificial",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "08:00", fin: "10:25" },
                { dia: "Miércoles", inicio: "10:25", fin: "12:50" }
            ]
        },
        {
            nombre: "Habilidades Blandas",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Lunes", inicio: "10:25", fin: "12:50" },
                { dia: "Miércoles", inicio: "08:00", fin: "10:25" }
            ]
        },
        {
            nombre: "Creatividad y Desarrollo de Entornos Virtuales",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Jueves", inicio: "10:25", fin: "12:50" },
                { dia: "Viernes", inicio: "10:25", fin: "12:50" }
            ]
        },
        {
            nombre: "Consultoría en Negocios Digitales",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Jueves", inicio: "10:25", fin: "12:50" },
                { dia: "Viernes", inicio: "10:25", fin: "12:50" }
            ]
        },
        {
            nombre: "Ciencia de Datos",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Jueves", inicio: "08:00", fin: "10:25" },
                { dia: "Viernes", inicio: "08:00", fin: "10:25" }
            ]
        }
    ],
    "5K2": [
        {
            nombre: "Seguridad en los Sistemas de Información",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "12:05", fin: "14:45" },
                { dia: "Viernes", inicio: "13:15", fin: "15:40" }
            ]
        },
        {
            nombre: "Proyecto Final",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Martes", inicio: "13:15", fin: "18:05" }
            ]
        },
        {
            nombre: "Gestión Gerencial",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "13:15", fin: "15:40" },
                { dia: "Jueves", inicio: "15:40", fin: "18:05" }
            ]
        },
        {
            nombre: "Sistemas de Gestión",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "14:55", fin: "18:05" },
                { dia: "Jueves", inicio: "12:05", fin: "15:40" }
            ]
        },
        {
            nombre: "Creatividad y Desarrollo de Entornos Virtuales",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Miércoles", inicio: "15:40", fin: "18:05" },
                { dia: "Viernes", inicio: "15:40", fin: "18:05" }
            ]
        },
        {
            nombre: "Gerenciamiento Estratégico",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Miércoles", inicio: "15:40", fin: "18:05" },
                { dia: "Viernes", inicio: "15:40", fin: "18:05" }
            ]
        },
        {
            nombre: "Inteligencia Artificial",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "15:40", fin: "18:05" },
                { dia: "Jueves", inicio: "13:15", fin: "14:45" }
            ]
        },
        {
            nombre: "Ciencia de Datos",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "13:15", fin: "15:40" },
                { dia: "Miércoles", inicio: "15:40", fin: "18:05" }
            ]
        },
        {
            nombre: "Habilidades Blandas",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Miércoles", inicio: "15:40", fin: "18:05" },
                { dia: "Viernes", inicio: "16:35", fin: "18:05" }
            ]
        },
        {
            nombre: "Decisiones en Escenarios Complejos",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Miércoles", inicio: "13:15", fin: "15:40" },
                { dia: "Viernes", inicio: "13:15", fin: "15:40" }
            ]
        },
        {
            nombre: "Consultoría en Negocios Digitales",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Miércoles", inicio: "13:15", fin: "15:40" },
                { dia: "Viernes", inicio: "13:15", fin: "15:40" }
            ]
        }
    ],
    "5K3": [
        {
            nombre: "Proyecto Final",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Martes", inicio: "18:15", fin: "23:05" }
            ]
        },
        {
            nombre: "Gestión Gerencial",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "18:15", fin: "20:40" },
                { dia: "Jueves", inicio: "18:15", fin: "19:45" }
            ]
        },
        {
            nombre: "Seguridad en los Sistemas de Información",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "18:15", fin: "20:40" },
                { dia: "Viernes", inicio: "18:15", fin: "19:45" }
            ]
        },
        {
            nombre: "Inteligencia Artificial",
            tipo: "Cuatrimestral",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "20:40", fin: "23:05" },
                { dia: "Jueves", inicio: "20:40", fin: "23:05" }
            ]
        },
        {
            nombre: "Gerenciamiento Estratégico",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Lunes", inicio: "20:40", fin: "23:05" },
                { dia: "Viernes", inicio: "20:40", fin: "23:05" }
            ]
        },
        {
            nombre: "Ciencia de Datos",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "18:15", fin: "20:40" },
                { dia: "Viernes", inicio: "20:40", fin: "23:05" }
            ]
        },
        {
            nombre: "Testing de Software",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Lunes", inicio: "18:15", fin: "20:40" },
                { dia: "Viernes", inicio: "18:15", fin: "19:45" }
            ]
        },
        {
            nombre: "Desarrollo con Tecnologías Blockchain",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Lunes", inicio: "20:40", fin: "23:05" },
                { dia: "Jueves", inicio: "18:15", fin: "19:45" }
            ]
        },
        {
            nombre: "Emprendimientos Tecnológicos",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Lunes", inicio: "20:40", fin: "23:05" },
                { dia: "Viernes", inicio: "18:15", fin: "19:45" }
            ]
        }
    ],
    "5K4": [
        {
            nombre: "Proyecto Final",
            tipo: "Anual",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Martes", inicio: "18:15", fin: "23:05" }
            ]
        },
        {
            nombre: "Gestión Gerencial",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "17:20", fin: "19:45" },
                { dia: "Jueves", inicio: "17:20", fin: "19:45" }
            ]
        },
        {
            nombre: "Ciencia de Datos",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "18:15", fin: "20:40" },
                { dia: "Viernes", inicio: "18:15", fin: "20:40" }
            ]
        },
        {
            nombre: "Sistemas de Gestión",
            tipo: "Cuatrimestral",
            cuatrimestre: [1, 2],
            electiva: false,
            horarios: [
                { dia: "Lunes", inicio: "19:55", fin: "23:05" },
                { dia: "Jueves", inicio: "19:55", fin: "23:05" }
            ]
        },
        {
            nombre: "Emprendimientos Tecnológicos",
            tipo: "Cuatrimestral",
            cuatrimestre: [1],
            electiva: true,
            horarios: [
                { dia: "Miércoles", inicio: "20:40", fin: "23:05" },
                { dia: "Viernes", inicio: "20:40", fin: "23:05" }
            ]
        },
        {
            nombre: "Seguridad en los Sistemas de Información",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: false,
            horarios: [
                { dia: "Miércoles", inicio: "17:20", fin: "20:40" },
                { dia: "Viernes", inicio: "18:15", fin: "19:45" }
            ]
        },
        {
            nombre: "Integración de Aplicaciones en Entorno Web",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Lunes", inicio: "18:15", fin: "20:40" },
                { dia: "Jueves", inicio: "18:15", fin: "19:45" }
            ]
        },
        {
            nombre: "Creatividad y Desarrollo de Entornos Virtuales",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Lunes", inicio: "18:15", fin: "20:40" },
                { dia: "Jueves", inicio: "18:15", fin: "19:45" }
            ]
        },
        {
            nombre: "Consultoría en Negocios Digitales",
            tipo: "Cuatrimestral",
            cuatrimestre: [2],
            electiva: true,
            horarios: [
                { dia: "Lunes", inicio: "20:40", fin: "23:05" },
                { dia: "Viernes", inicio: "20:40", fin: "23:05" }
            ]
        }
    ]
};
