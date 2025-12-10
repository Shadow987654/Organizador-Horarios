# 🚀 Guía de Inicio Rápido

## ✅ El servidor ya está corriendo!

**URL**: http://localhost:3000
**Comisiones**: 8
**Materias**: 87

## 📡 Probar la API

Abre tu navegador y visita:

```
http://localhost:3000/api/health
```

O prueba estos endpoints:

```
http://localhost:3000/api/datos-completos?cuatrimestre=1
http://localhost:3000/api/comisiones
http://localhost:3000/api/materias/buscar?nombre=redes
```

## 🌐 Usar con el Frontend

1. **Opción A - Abrir directamente:**
   - Ve a `frontend/index.html`
   - Haz clic derecho → Abrir con → Chrome/Firefox/Edge
   - Los datos se cargarán desde `data.js` (sin API)

2. **Opción B - Usar con la API:**
   
   Edita `frontend/index.html` y cambia estas líneas:

   ```html
   <!-- Comenta app.js -->
   <!-- <script src="js/app.js"></script> -->
   
   <!-- Descomenta app-api.js -->
   <script src="js/app-api.js"></script>
   ```

   Luego abre `frontend/index.html` en el navegador.

## 🛑 Detener el Servidor

Presiona `Ctrl + C` en la terminal donde está corriendo.

## 🔄 Reiniciar el Servidor

```powershell
cd backend
node server-simple.js
```

## 📝 Notas Importantes

- **Sin Base de Datos**: Esta versión usa directamente `data.js` para evitar problemas de compilación
- **Solo en Memoria**: Los cambios no se guardan permanentemente
- **Perfecto para Desarrollo**: Funciona sin instalación de Visual Studio Build Tools

## 🎯 Siguientes Pasos

1. Abre `frontend/index.html` en tu navegador
2. Selecciona un cuatrimestre
3. Arma tu horario
4. Exporta como PNG

¡Disfruta organizando tus horarios! 📚✨
