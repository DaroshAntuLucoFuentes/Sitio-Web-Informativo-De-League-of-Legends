// Configuración para la API de Riot Games
// IMPORTANTE: Para usar el buscador de jugadores, necesitas una API key válida de Riot Games

const CONFIG = {
    // API Key de Riot Games - Obtén una en: https://developer.riotgames.com/
    RIOT_API_KEY: 'RGAPI-14040adb-7749-4591-9fe2-6fd6838d88e1', // Coloca tu API key aquí - Las Development keys expiran en 24h
    
    // Configuración de regiones disponibles
    REGIONES: {
        'EUW': {
            name: 'Europa Occidental',
            platform: 'euw1',
            regional: 'europe'
        },
        'LAN': {
            name: 'América Latina Norte',
            platform: 'la1',
            regional: 'americas'
        },
        'LAS': {
            name: 'América Latina Sur',
            platform: 'la2',
            regional: 'americas'
        }
    },
    
    // Límites de la API
    LIMITES: {
        MAX_PARTIDAS: 5, // Número máximo de partidas a obtener
        TIMEOUT: 10000   // Timeout en milisegundos para las peticiones
    }
};

// Función para configurar la API key
function configurarApiKey(apiKey) {
    if (apiKey && apiKey.trim() !== '') {
        CONFIG.RIOT_API_KEY = apiKey.trim();
        console.log('✅ API Key configurada correctamente');
        return true;
    } else {
        console.error('❌ API Key inválida');
        return false;
    }
}

// Función para verificar si la API key está configurada
function apiKeyConfigurada() {
    return CONFIG.RIOT_API_KEY !== '' && CONFIG.RIOT_API_KEY !== null;
}

// Función para obtener la API key
function obtenerApiKey() {
    return CONFIG.RIOT_API_KEY;
}

// Nueva función: Actualizar API key desde consola
function actualizarApiKey(nuevaApiKey) {
    console.log('🔄 Actualizando API key...');
    
    if (configurarApiKey(nuevaApiKey)) {
        console.log('✅ API Key actualizada exitosamente');
        console.log('🔑 Nueva API Key:', nuevaApiKey.substring(0, 10) + '...');
        
        // Si el buscador ya está inicializado, actualizar su API key
        if (window.buscadorJugadores) {
            window.buscadorJugadores.apiKey = nuevaApiKey;
            console.log('✅ Buscador actualizado con nueva API key');
        }
        
        return true;
    } else {
        console.error('❌ Error al actualizar API key');
        return false;
    }
}

// Función para mostrar información de la API key actual
function mostrarInfoApiKey() {
    console.log('📋 Información de la API Key actual:');
    console.log('🔑 API Key:', obtenerApiKey());
    console.log('📏 Longitud:', obtenerApiKey().length);
    console.log('✅ Configurada:', apiKeyConfigurada());
    console.log('✅ Formato válido:', obtenerApiKey().startsWith('RGAPI-'));
}

// Función para probar la API key actual
async function probarApiKey() {
    console.log('🧪 Probando API key actual...');
    
    if (!apiKeyConfigurada()) {
        console.error('❌ No hay API key configurada');
        return false;
    }
    
    try {
        // Probar con un summoner conocido en EUW
        const summonerName = 'Faker'; // Un jugador conocido
        const region = 'EUW';
        const configRegion = CONFIG.REGIONES[region];
        
        console.log(`🔍 Probando con summoner: ${summonerName} en ${region}`);
        
        // URL para obtener información del summoner
        const url = `https://${configRegion.platform}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}?api_key=${obtenerApiKey()}`;
        
        console.log('📡 URL de prueba:', url.replace(obtenerApiKey(), 'API_KEY_OCULTA'));
        
        const response = await fetch(url);
        console.log('📊 Código de respuesta:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API key funciona correctamente!');
            console.log('📋 Datos obtenidos:', {
                name: data.name,
                level: data.summonerLevel,
                id: data.id
            });
            return true;
        } else if (response.status === 403) {
            console.error('❌ Error 403: API key sin permisos para este endpoint');
            return false;
        } else if (response.status === 429) {
            console.error('❌ Error 429: Límite de requests excedido');
            return false;
        } else {
            console.error(`❌ Error ${response.status}: ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.error('❌ Error de red:', error.message);
        return false;
    }
}

// Función para probar datos reales completos
async function probarDatosReales() {
    console.log('🎯 Probando obtención de datos reales completos...');
    
    if (!apiKeyConfigurada()) {
        console.error('❌ No hay API key configurada');
        return false;
    }
    
    try {
        // Probar con un jugador conocido
        const summonerName = 'Faker';
        const region = 'EUW';
        const configRegion = CONFIG.REGIONES[region];
        
        console.log(`🔍 Probando análisis completo para: ${summonerName} en ${region}`);
        
        // 1. Obtener información del summoner
        const summonerUrl = `https://${configRegion.platform}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}?api_key=${obtenerApiKey()}`;
        console.log('📡 URL Summoner:', summonerUrl.replace(obtenerApiKey(), 'API_KEY_OCULTA'));
        
        const summonerResponse = await fetch(summonerUrl);
        console.log('📊 Código de respuesta Summoner:', summonerResponse.status);
        
        if (!summonerResponse.ok) {
            console.error('❌ Error obteniendo información del summoner:', summonerResponse.status);
            return false;
        }
        
        const summonerData = await summonerResponse.json();
        console.log('✅ Información del summoner obtenida:', {
            name: summonerData.name,
            level: summonerData.summonerLevel,
            id: summonerData.id
        });
        
        // 2. Obtener estadísticas de ranking
        const rankingUrl = `https://${configRegion.platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${obtenerApiKey()}`;
        console.log('📡 URL Ranking:', rankingUrl.replace(obtenerApiKey(), 'API_KEY_OCULTA'));
        
        const rankingResponse = await fetch(rankingUrl);
        console.log('📊 Código de respuesta Ranking:', rankingResponse.status);
        
        if (rankingResponse.ok) {
            const rankingData = await rankingResponse.json();
            console.log('✅ Estadísticas de ranking obtenidas:', rankingData.length, 'entradas');
        } else {
            console.error('❌ Error obteniendo ranking:', rankingResponse.status);
        }
        
        // 3. Obtener maestría de campeones
        const masteryUrl = `https://${configRegion.platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerData.id}?api_key=${obtenerApiKey()}`;
        console.log('📡 URL Maestría:', masteryUrl.replace(obtenerApiKey(), 'API_KEY_OCULTA'));
        
        const masteryResponse = await fetch(masteryUrl);
        console.log('📊 Código de respuesta Maestría:', masteryResponse.status);
        
        if (masteryResponse.ok) {
            const masteryData = await masteryResponse.json();
            console.log('✅ Maestría de campeones obtenida:', masteryData.length, 'campeones');
        } else {
            console.error('❌ Error obteniendo maestría:', masteryResponse.status);
        }
        
        console.log('🎉 Prueba de datos reales completada!');
        return true;
        
    } catch (error) {
        console.error('❌ Error en prueba de datos reales:', error.message);
        return false;
    }
}

// Función para probar qué APIs están disponibles
async function probarApisDisponibles() {
    console.log('🔍 Probando qué APIs están disponibles con tu API key...');
    
    if (!apiKeyConfigurada()) {
        console.error('❌ No hay API key configurada');
        return false;
    }
    
    const region = 'EUW';
    const configRegion = CONFIG.REGIONES[region];
    const resultados = {};
    
    try {
        // 1. Probar Status API (siempre funciona)
        console.log('📡 Probando Status API...');
        const statusUrl = `https://${configRegion.platform}.api.riotgames.com/lol/status/v4/platform-data?api_key=${obtenerApiKey()}`;
        const statusResponse = await fetch(statusUrl);
        resultados.status = statusResponse.status;
        console.log(`✅ Status API: ${statusResponse.status === 200 ? '✅ Funciona' : '❌ No funciona'}`);
        
        // 2. Probar Summoner API
        console.log('📡 Probando Summoner API...');
        const summonerUrl = `https://${configRegion.platform}.api.riotgames.com/lol/summoner/v4/summoners/by-name/Faker?api_key=${obtenerApiKey()}`;
        const summonerResponse = await fetch(summonerUrl);
        resultados.summoner = summonerResponse.status;
        console.log(`✅ Summoner API: ${summonerResponse.status === 200 ? '✅ Funciona' : '❌ No funciona (${summonerResponse.status})'}`);
        
        // 3. Probar League API (si summoner funciona)
        if (summonerResponse.ok) {
            console.log('📡 Probando League API...');
            const summonerData = await summonerResponse.json();
            const leagueUrl = `https://${configRegion.platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${obtenerApiKey()}`;
            const leagueResponse = await fetch(leagueUrl);
            resultados.league = leagueResponse.status;
            console.log(`✅ League API: ${leagueResponse.status === 200 ? '✅ Funciona' : '❌ No funciona (${leagueResponse.status})'}`);
        } else {
            console.log('⚠️ League API: No se puede probar (Summoner API no funciona)');
            resultados.league = 'N/A';
        }
        
        // 4. Probar Champion Mastery API (si summoner funciona)
        if (summonerResponse.ok) {
            console.log('📡 Probando Champion Mastery API...');
            const summonerData = await summonerResponse.json();
            const masteryUrl = `https://${configRegion.platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerData.id}?api_key=${obtenerApiKey()}`;
            const masteryResponse = await fetch(masteryUrl);
            resultados.mastery = masteryResponse.status;
            console.log(`✅ Champion Mastery API: ${masteryResponse.status === 200 ? '✅ Funciona' : '❌ No funciona (${masteryResponse.status})'}`);
        } else {
            console.log('⚠️ Champion Mastery API: No se puede probar (Summoner API no funciona)');
            resultados.mastery = 'N/A';
        }
        
        // Resumen
        console.log('📊 RESUMEN DE APIs DISPONIBLES:');
        console.log('✅ Status API:', resultados.status === 200 ? 'DISPONIBLE' : 'NO DISPONIBLE');
        console.log('✅ Summoner API:', resultados.summoner === 200 ? 'DISPONIBLE' : 'NO DISPONIBLE');
        console.log('✅ League API:', resultados.league === 200 ? 'DISPONIBLE' : 'NO DISPONIBLE');
        console.log('✅ Champion Mastery API:', resultados.mastery === 200 ? 'DISPONIBLE' : 'NO DISPONIBLE');
        
        return resultados;
        
    } catch (error) {
        console.error('❌ Error probando APIs:', error.message);
        return false;
    }
}

// Exportar configuración para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, configurarApiKey, apiKeyConfigurada, obtenerApiKey, actualizarApiKey, mostrarInfoApiKey, probarApiKey, probarDatosReales, probarApisDisponibles };
} else {
    // Para uso en navegador
    window.CONFIG = CONFIG;
    window.configurarApiKey = configurarApiKey;
    window.apiKeyConfigurada = apiKeyConfigurada;
    window.obtenerApiKey = obtenerApiKey;
    window.actualizarApiKey = actualizarApiKey;
    window.mostrarInfoApiKey = mostrarInfoApiKey;
    window.probarApiKey = probarApiKey;
    window.probarDatosReales = probarDatosReales;
    window.probarApisDisponibles = probarApisDisponibles;
} 