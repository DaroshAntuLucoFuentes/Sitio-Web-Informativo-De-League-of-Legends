// Diagnóstico para la API de Riot Games
// Este archivo ayuda a identificar problemas con la API key y las peticiones

class DiagnosticoAPI {
    constructor() {
        this.apiKey = obtenerApiKey();
        this.regiones = CONFIG.REGIONES;
    }

    // Función principal de diagnóstico
    async ejecutarDiagnostico() {
        console.log('🔍 Iniciando diagnóstico de la API de Riot Games...');
        
        // Paso 1: Verificar API key
        this.verificarApiKey();
        
        // Paso 2: Probar conexión básica
        await this.probarConexionBasica();
        
        // Paso 3: Probar endpoint de summoner
        await this.probarEndpointSummoner();
        
        console.log('✅ Diagnóstico completado. Revisa los resultados arriba.');
    }

    // Verificar formato de la API key
    verificarApiKey() {
        console.log('📋 Verificando API Key...');
        
        if (!this.apiKey) {
            console.error('❌ ERROR: No hay API key configurada');
            return false;
        }
        
        if (!this.apiKey.startsWith('RGAPI-')) {
            console.error('❌ ERROR: API key no tiene el formato correcto. Debe empezar con "RGAPI-"');
            return false;
        }
        
        if (this.apiKey.length < 20) {
            console.error('❌ ERROR: API key parece ser muy corta');
            return false;
        }
        
        console.log('✅ API Key tiene formato correcto');
        console.log('🔑 API Key:', this.apiKey.substring(0, 10) + '...');
        console.log('📏 Longitud de la API key:', this.apiKey.length);
        return true;
    }

    // Probar conexión básica a la API
    async probarConexionBasica() {
        console.log('🌐 Probando conexión básica...');
        
        try {
            // Probar con múltiples regiones
            const regiones = ['EUW', 'LAN', 'LAS'];
            
            for (const region of regiones) {
                console.log(`🌍 Probando región: ${region}`);
                const configRegion = this.regiones[region];
                const url = `https://${configRegion.platform}.api.riotgames.com/lol/status/v4/platform-data?api_key=${this.apiKey}`;
                
                console.log('📡 URL de prueba:', url.replace(this.apiKey, 'API_KEY_OCULTA'));
                
                const response = await fetch(url);
                
                console.log(`📊 Código de respuesta para ${region}:`, response.status);
                
                if (response.ok) {
                    console.log(`✅ Conexión exitosa para ${region}`);
                } else {
                    console.log(`❌ Error en ${region}:`, response.status, response.statusText);
                    
                    if (response.status === 403) {
                        console.error('🚫 Error 403: API key inválida, expirada o sin permisos');
                        console.error('💡 Soluciones:');
                        console.error('   1. Verifica que la API key sea correcta');
                        console.error('   2. La API key puede haber expirado (Development keys expiran en 24h)');
                        console.error('   3. Solicita una nueva API key en: https://developer.riotgames.com/');
                    } else if (response.status === 429) {
                        console.error('⏰ Error 429: Rate limit excedido');
                        console.error('💡 Espera unos minutos antes de intentar de nuevo');
                    }
                }
            }
            
            console.log('✅ Prueba de conexión básica completada');
            return true;
        } catch (error) {
            console.error('❌ Error de red:', error.message);
            return false;
        }
    }

    // Probar endpoint específico de summoner
    async probarEndpointSummoner() {
        console.log('👤 Probando endpoint de summoner...');
        
        try {
            const region = 'EUW';
            const configRegion = this.regiones[region];
            const summonerName = 'Faker'; // Jugador conocido que existe
            const url = `https://${configRegion.platform}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}?api_key=${this.apiKey}`;
            
            console.log('📡 URL de summoner:', url.replace(this.apiKey, 'API_KEY_OCULTA'));
            
            const response = await fetch(url);
            
            console.log('📊 Código de respuesta summoner:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Endpoint de summoner funciona correctamente');
                console.log('📊 Datos del summoner:', {
                    name: data.name,
                    level: data.summonerLevel,
                    id: data.id ? 'Presente' : 'Ausente'
                });
                return true;
            } else {
                console.error('❌ Error en endpoint summoner:', response.status, response.statusText);
                
                if (response.status === 403) {
                    console.error('🚫 Error 403 en summoner: API key no tiene permisos para este endpoint');
                } else if (response.status === 404) {
                    console.error('🔍 Error 404: Jugador no encontrado (esto es normal para pruebas)');
                }
                
                return false;
            }
        } catch (error) {
            console.error('❌ Error en endpoint summoner:', error.message);
            return false;
        }
    }

    // Función para obtener nueva API key
    obtenerNuevaApiKey() {
        console.log('🆕 Para obtener una nueva API key:');
        console.log('   1. Ve a: https://developer.riotgames.com/');
        console.log('   2. Inicia sesión o crea una cuenta');
        console.log('   3. Ve a "Development API Key"');
        console.log('   4. Copia la nueva API key');
        console.log('   5. Reemplaza en js/config.js');
        console.log('   ⚠️  IMPORTANTE: Las Development keys expiran en 24 horas');
    }

    // Función para probar con una API key específica
    async probarConNuevaApiKey(nuevaApiKey) {
        console.log('🧪 Probando con nueva API key...');
        
        const apiKeyOriginal = this.apiKey;
        this.apiKey = nuevaApiKey;
        
        const resultado = await this.probarConexionBasica();
        
        this.apiKey = apiKeyOriginal;
        
        return resultado;
    }

    // Nueva función: Verificar estado actual de la API key
    verificarEstadoApiKey() {
        console.log('🔍 Verificando estado actual de la API key...');
        console.log('📋 API Key configurada:', apiKeyConfigurada());
        console.log('🔑 API Key actual:', obtenerApiKey());
        console.log('📏 Longitud:', obtenerApiKey().length);
        console.log('✅ Formato correcto:', obtenerApiKey().startsWith('RGAPI-'));
        
        // Verificar si la key parece válida
        if (obtenerApiKey().length > 20 && obtenerApiKey().startsWith('RGAPI-')) {
            console.log('✅ La API key parece tener formato válido');
        } else {
            console.error('❌ La API key no tiene formato válido');
        }
    }
}

// Función global para ejecutar diagnóstico
function ejecutarDiagnosticoAPI() {
    const diagnostico = new DiagnosticoAPI();
    return diagnostico.ejecutarDiagnostico();
}

// Función para obtener nueva API key
function obtenerNuevaApiKey() {
    const diagnostico = new DiagnosticoAPI();
    diagnostico.obtenerNuevaApiKey();
}

// Nueva función: Verificar estado de la API key
function verificarEstadoApiKey() {
    const diagnostico = new DiagnosticoAPI();
    diagnostico.verificarEstadoApiKey();
}

// Exportar para uso global
window.ejecutarDiagnosticoAPI = ejecutarDiagnosticoAPI;
window.obtenerNuevaApiKey = obtenerNuevaApiKey;
window.verificarEstadoApiKey = verificarEstadoApiKey;
window.DiagnosticoAPI = DiagnosticoAPI; 