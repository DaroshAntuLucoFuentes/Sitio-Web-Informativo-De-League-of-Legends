# 📊 Analizador de Estadísticas - FreeeLo

## Descripción
Funcionalidad agregada al proyecto FreeeLo para analizar fortalezas y debilidades de jugadores de League of Legends usando las APIs públicas de Riot Games.

## 🚀 Características

- **Análisis de jugadores**: Analiza fortalezas y debilidades de jugadores
- **Múltiples regiones**: Soporte para EUW, LAN y LAS
- **APIs públicas**: Utiliza endpoints que no requieren permisos especiales
- **Sistema de diagnóstico**: Herramientas para verificar el estado de la API
- **Modo demo**: Funciona incluso si las APIs fallan
- **Diseño integrado**: Respeta el diseño actual del proyecto
- **Responsive**: Funciona en dispositivos móviles y desktop

## 📋 Requisitos

1. **API Key de Riot Games**: Necesitas una API key válida (opcional para algunas funciones)
2. **Navegador moderno**: Soporte para ES6+ y fetch API
3. **Conexión a internet**: Para las llamadas a la API

## 🔧 Configuración

### Paso 1: Obtener API Key (Opcional)
1. Ve a [Riot Games Developer Portal](https://developer.riotgames.com/)
2. Crea una cuenta o inicia sesión
3. Solicita una API key (Development Key es gratuita)
4. Copia tu API key

### Paso 2: Configurar la API Key
1. Abre el archivo `js/config.js`
2. Encuentra la línea: `RIOT_API_KEY: '',`
3. Reemplaza las comillas vacías con tu API key:
   ```javascript
   RIOT_API_KEY: 'RGAPI-tu-api-key-aqui',
   ```

### Paso 3: Verificar la configuración
1. Abre `index.html` en tu navegador
2. Abre la consola del navegador (F12)
3. Haz clic en el botón "🔧 Diagnóstico" para verificar el estado

## 🎮 Cómo usar

1. **Abrir la página**: Ve a `index.html`
2. **Analizar jugador**: 
   - Ingresa el nombre del invocador
   - Selecciona la región (EUW, LAN o LAS)
   - Haz clic en "📊 Analizar Jugador"
3. **Ver resultados**: 
   - Información básica del jugador
   - Estadísticas de ranking
   - Maestría de campeones
   - Análisis de fortalezas y debilidades
   - Recomendaciones personalizadas
   - **Indicador de estado de datos** (En vivo/Demo)
   - **Fecha de última actualización**
4. **Actualizar datos**: 
   - Después del análisis, aparece el botón "🔄 Actualizar"
   - Haz clic para forzar una nueva actualización de datos
   - Útil cuando los datos parecen desactualizados

## 📊 Información mostrada

### Datos del jugador:
- Nombre del invocador
- Nivel de cuenta (si está disponible)
- ID único del jugador
- PUUID (identificador global)

### Análisis de estadísticas:
- **Ranking actual**: Liga, división, puntos
- **Win rate**: Porcentaje de victorias
- **Maestría de campeones**: Top campeones más jugados
- **Fortalezas identificadas**: Aspectos positivos del jugador
- **Debilidades identificadas**: Áreas de mejora
- **Recomendaciones**: Consejos personalizados
- **Estado de datos**: Indicador si los datos son en vivo o de demostración
- **Última actualización**: Fecha y hora de la última actualización de datos

## 🛠️ Estructura de archivos

```
PROYECTO LOL/
├── index.html              # Página principal (actualizada)
├── css/
│   └── estilos.css         # Estilos CSS (actualizado)
├── js/
│   ├── config.js           # Configuración de la API
│   ├── buscador.js         # Interfaz del analizador
│   ├── estadisticas.js     # Lógica de análisis
│   ├── diagnostico.js      # Herramientas de diagnóstico
│   └── cookies.js          # Archivo existente
└── README_BUSCADOR.md      # Este archivo
```

## 🔌 API Endpoints utilizados

### APIs Públicas (no requieren permisos especiales):
- **League API**: `/lol/league/v4/entries/by-summoner-name/{summonerName}`
- **Champion Mastery API**: `/lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}`

### APIs que pueden requerir permisos:
- **Summoner API**: `/lol/summoner/v4/summoners/by-name/{summonerName}`

## 🌍 Regiones soportadas

- **EUW**: Europa Occidental (euw1)
- **LAN**: América Latina Norte (la1)
- **LAS**: América Latina Sur (la2)

### Agregar más regiones:
Edita `js/config.js` y agrega nuevas regiones en el objeto `REGIONES`:

```javascript
'NA': {
    name: 'América del Norte',
    platform: 'na1',
    regional: 'americas'
}
```

## ⚠️ Limitaciones de la API

- **Rate Limits**: La API tiene límites de peticiones por minuto
- **Development Key**: Limitada a 100 peticiones por día
- **APIs públicas**: Algunas APIs pueden tener restricciones
- **Modo demo**: Si las APIs fallan, se muestran datos de ejemplo

## 🐛 Solución de problemas

### Error: "API Key no configurada"
- El sistema funciona sin API key usando modo demo
- Para funcionalidad completa, configura una API key válida

### Error: "Jugador no encontrado"
- Verifica el nombre del jugador (sensible a mayúsculas/minúsculas)
- Confirma que el jugador existe en la región seleccionada
- Algunos jugadores pueden no tener datos de ranking

### Error: "Error al analizar jugador"
- Verifica tu conexión a internet
- Revisa que la API key sea válida y no haya expirado
- Consulta la consola del navegador para más detalles
- Usa el botón "🔧 Diagnóstico" para verificar el estado

## 🔧 Herramientas de diagnóstico

### Comandos disponibles en la consola:
```javascript
// Verificar estado de la API key
mostrarInfoApiKey()

// Actualizar API key desde consola
actualizarApiKey('TU_NUEVA_API_KEY')

// Ejecutar diagnóstico completo
ejecutarDiagnosticoAPI()

// Analizar jugador específico
analizarJugador('NombreDelJugador', 'EUW')

// Forzar actualización de datos
actualizarDatosJugador('NombreDelJugador', 'EUW')
```

## 🔒 Seguridad

- **APIs públicas**: La mayoría de funcionalidades usan APIs públicas
- **API Key opcional**: El sistema funciona sin API key
- **Nunca compartas tu API key** en repositorios públicos
- **Usa variables de entorno** en producción

## 📝 Notas técnicas

- **CORS**: Las llamadas a la API de Riot Games no tienen problemas de CORS
- **Async/Await**: El código usa async/await para manejar las peticiones
- **Error Handling**: Manejo robusto de errores incluido
- **Modo Demo**: Sistema de fallback con datos de ejemplo
- **Responsive Design**: Diseño adaptativo para móviles

## 🎯 Funcionalidades actuales

- ✅ Análisis de fortalezas y debilidades
- ✅ Estadísticas de ranking
- ✅ Maestría de campeones
- ✅ Recomendaciones personalizadas
- ✅ Soporte para 3 regiones (EUW, LAN, LAS)
- ✅ Sistema de diagnóstico
- ✅ Modo demo como fallback
- ✅ Interfaz integrada con el diseño existente
- ✅ Indicadores de estado de datos (En vivo/Demo)
- ✅ Fecha de última actualización
- ✅ Botón de actualización forzada
- ✅ Timestamps en todos los datos

## 🎯 Próximas mejoras

- [ ] Agregar más regiones (NA, EUNE, etc.)
- [ ] Mostrar iconos de campeones
- [ ] Estadísticas más detalladas
- [ ] Historial de partidas (si las APIs lo permiten)
- [ ] Comparación entre jugadores
- [ ] Gráficos de progreso
- [ ] Exportar análisis a PDF

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la consola del navegador (F12)
2. Usa el botón "🔧 Diagnóstico" en la interfaz
3. Verifica la configuración de la API key
4. Consulta la documentación de Riot Games API

---

**Desarrollado para FreeeLo** - Encuentra tu rol en League of Legends 