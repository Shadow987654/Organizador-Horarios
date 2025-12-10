// Datos de materias y horarios - 1er a 3er Año
// NOTA: Estos son datos de EJEMPLO. Debes completarlos con la información real de los PDFs.

const materiasData1a3 = {
    // ============================================
    // PRIMER AÑO
    // ============================================
    "1K1": [
        {
            nombre: "Algoritmos y Estructuras de Datos",
            horarios: [
                { dia: "Lunes", inicio: "08:00", fin: "12:00" },
                { dia: "Miércoles", inicio: "08:00", fin: "12:00" }
            ]
        },
        {
            nombre: "Arquitectura de Computadoras",
            horarios: [
                { dia: "Martes", inicio: "08:00", fin: "10:00" },
                { dia: "Jueves", inicio: "08:00", fin: "10:00" }
            ]
        },
        {
            nombre: "Matemática Discreta",
            horarios: [
                { dia: "Martes", inicio: "10:00", fin: "12:00" },
                { dia: "Viernes", inicio: "08:00", fin: "10:00" }
            ]
        },
        {
            nombre: "Sistemas y Organizaciones",
            horarios: [
                { dia: "Lunes", inicio: "14:00", fin: "16:00" },
                { dia: "Miércoles", inicio: "14:00", fin: "16:00" }
            ]
        },
        {
            nombre: "Inglés I",
            horarios: [
                { dia: "Viernes", inicio: "14:00", fin: "16:00" }
            ]
        }
        // TODO: Agregar más materias de 1er año según el PDF
    ],

    "1K2": [
        // TODO: Completar con datos del PDF 263_horarios_1ro_completo.pdf
    ],

    "1K3": [
        // TODO: Completar con datos del PDF 263_horarios_1ro_completo.pdf
    ],

    "1K4": [
        // TODO: Completar con datos del PDF 263_horarios_1ro_completo.pdf
    ],

    // ============================================
    // SEGUNDO AÑO
    // ============================================
    "2K1": [
        {
            nombre: "Paradigmas de Programación",
            horarios: [
                { dia: "Lunes", inicio: "08:00", fin: "12:00" },
                { dia: "Miércoles", inicio: "08:00", fin: "10:00" }
            ]
        },
        {
            nombre: "Sistemas Operativos",
            horarios: [
                { dia: "Martes", inicio: "08:00", fin: "12:00" }
            ]
        },
        {
            nombre: "Estadística",
            horarios: [
                { dia: "Jueves", inicio: "08:00", fin: "10:00" },
                { dia: "Viernes", inicio: "08:00", fin: "10:00" }
            ]
        },
        {
            nombre: "Inglés II",
            horarios: [
                { dia: "Miércoles", inicio: "14:00", fin: "16:00" }
            ]
        }
        // TODO: Agregar más materias de 2do año según el PDF
    ],

    "2K2": [
        // TODO: Completar con datos del PDF ED3_horarios_2do_completo.pdf
    ],

    "2K3": [
        // TODO: Completar con datos del PDF ED3_horarios_2do_completo.pdf
    ],

    "2K4": [
        // TODO: Completar con datos del PDF ED3_horarios_2do_completo.pdf
    ],

    // ============================================
    // TERCER AÑO
    // ============================================
    "3K1": [
        {
            nombre: "Diseño de Sistemas",
            horarios: [
                { dia: "Lunes", inicio: "08:00", fin: "10:00" },
                { dia: "Miércoles", inicio: "08:00", fin: "10:00" }
            ]
        },
        {
            nombre: "Gestión de Datos",
            horarios: [
                { dia: "Martes", inicio: "08:00", fin: "12:00" }
            ]
        },
        {
            nombre: "Legislación",
            horarios: [
                { dia: "Jueves", inicio: "08:00", fin: "10:00" }
            ]
        },
        {
            nombre: "Redes y Comunicaciones",
            horarios: [
                { dia: "Viernes", inicio: "08:00", fin: "12:00" }
            ]
        }
        // TODO: Agregar más materias de 3er año según el PDF
    ],

    "3K2": [
        // TODO: Completar con datos del PDF F0D_tercer2025.pdf
    ],

    "3K3": [
        // TODO: Completar con datos del PDF F0D_tercer2025.pdf
    ],

    "3K4": [
        // TODO: Completar con datos del PDF F0D_tercer2025.pdf
    ]
};

// Exportar para que pueda ser usado en el script de inicialización
if (typeof module !== 'undefined' && module.exports) {
    module.exports = materiasData1a3;
}
