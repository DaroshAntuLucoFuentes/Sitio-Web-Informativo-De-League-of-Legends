// Buscador de Jugadores - FreeeLo
// Funcionalidad para buscar jugadores de League of Legends usando la API de Riot Games

class BuscadorJugadores {
    constructor() {
        // Usar configuración global
        this.apiKey = obtenerApiKey();
        this.regiones = CONFIG.REGIONES;
        this.limites = CONFIG.LIMITES;
        
        this.init();
    }

    // Inicializar el buscador
    init() {
        this.crearInterfaz();
        this.agregarEventListeners();
    }

    // Crear la interfaz del buscador
    crearInterfaz() {
        const contenedor = document.querySelector('.container');
        
        // Crear sección del buscador
        const seccionBuscador = document.createElement('div');
        seccionBuscador.className = 'buscador-seccion animated-border bordecontaainer mt-4';
        seccionBuscador.innerHTML = `
            <div class="container text-center">
                <h2>📊 Analizador de Estadísticas</h2>
                <p>Analiza fortalezas y debilidades de jugadores de League of Legends</p>
                
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="nombreJugador" class="text-light">Nombre del Invocador:</label>
                            <input type="text" class="form-control" id="nombreJugador" 
                                   placeholder="Ej: Faker, Doublelift...">
                        </div>
                        
                        <div class="form-group">
                            <label for="regionJugador" class="text-light">Región:</label>
                                                         <select class="form-control" id="regionJugador">
                                 <option value="EUW">Europa Occidental (EUW)</option>
                                 <option value="LAN">América Latina Norte (LAN)</option>
                                 <option value="LAS">América Latina Sur (LAS)</option>
                             </select>
                        </div>
                        
                                                 <button type="button" class="btn btn-primary" id="btnBuscar">
                             📊 Analizar Jugador
                         </button>
                         <button type="button" class="btn btn-secondary ml-2" id="btnDiagnostico" title="Diagnosticar problemas con la API">
                             🔧 Diagnóstico
                         </button>
                         <button type="button" class="btn btn-info ml-2" id="btnActualizar" title="Forzar actualización de datos" style="display: none;">
                             🔄 Actualizar
                         </button>
                    </div>
                </div>
                
                <div id="resultadosJugador" class="mt-4"></div>
                <div id="loadingJugador" class="mt-3" style="display: none;">
                    <div class="spinner-border text-light" role="status">
                        <span class="sr-only">Buscando...</span>
                    </div>
                    <p class="text-light mt-2">Buscando jugador...</p>
                </div>
                <div id="errorJugador" class="mt-3" style="display: none;">
                    <div class="alert alert-danger" role="alert">
                        <strong>Error:</strong> <span id="mensajeError"></span>
                    </div>
                </div>
            </div>
        `;
        
        // Insertar después del contenido principal
        contenedor.parentNode.insertBefore(seccionBuscador, contenedor.nextSibling);
    }

    // Agregar event listeners
    agregarEventListeners() {
        const btnBuscar = document.getElementById('btnBuscar');
        if (btnBuscar) {
            btnBuscar.addEventListener('click', () => this.buscarJugador());
        }
        
        // Botón de diagnóstico
        const btnDiagnostico = document.getElementById('btnDiagnostico');
        if (btnDiagnostico) {
            btnDiagnostico.addEventListener('click', () => this.ejecutarDiagnostico());
        }
        
        // Botón de actualizar
        const btnActualizar = document.getElementById('btnActualizar');
        if (btnActualizar) {
            btnActualizar.addEventListener('click', () => this.actualizarJugador());
        }
        
        // Permitir búsqueda con Enter
        const inputJugador = document.getElementById('nombreJugador');
        if (inputJugador) {
            inputJugador.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.buscarJugador();
                }
            });
        }
    }

    // Función principal para buscar jugador
    async buscarJugador() {
        const nombreJugador = document.getElementById('nombreJugador').value.trim();
        const region = document.getElementById('regionJugador').value;
        
        if (!nombreJugador) {
            this.mostrarError('Por favor, ingresa el nombre del jugador');
            return;
        }
        
        this.mostrarLoading(true);
        this.ocultarResultados();
        this.ocultarError();
        
        try {
            // Usar el nuevo sistema de estadísticas
            await analizarJugador(nombreJugador, region);
            
            // Mostrar botón de actualizar después de la búsqueda
            this.mostrarBotonesAdicionales();
            
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            this.mostrarError('Error al analizar jugador: ' + error.message);
        } finally {
            this.mostrarLoading(false);
        }
    }

    // Función para actualizar datos del jugador
    async actualizarJugador() {
        const nombreJugador = document.getElementById('nombreJugador').value.trim();
        const region = document.getElementById('regionJugador').value;
        
        if (!nombreJugador) {
            this.mostrarError('Por favor, ingresa el nombre del jugador');
            return;
        }
        
        this.mostrarLoading(true);
        this.ocultarError();
        
        try {
            // Forzar actualización de datos
            await actualizarDatosJugador(nombreJugador, region);
            
        } catch (error) {
            console.error('Error en la actualización:', error);
            this.mostrarError('Error al actualizar datos: ' + error.message);
        } finally {
            this.mostrarLoading(false);
        }
    }

    // Mostrar botones adicionales después de la búsqueda
    mostrarBotonesAdicionales() {
        const btnActualizar = document.getElementById('btnActualizar');
        if (btnActualizar) {
            btnActualizar.style.display = 'inline-block';
        }
    }

    // Obtener información básica del jugador usando APIs públicas
    async obtenerInfoJugador(nombre, region) {
        const configRegion = this.regiones[region];
        
        // Intentar primero con summoner-v4 (puede fallar con algunas API keys)
        try {
            const url = `https://${configRegion.platform}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(nombre)}?api_key=${obtenerApiKey()}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                return {
                    id: data.id,
                    accountId: data.accountId,
                    puuid: data.puuid,
                    name: data.name,
                    level: data.summonerLevel,
                    profileIconId: data.profileIconId
                };
            } else if (response.status === 403) {
                // Si falla summoner-v4, intentar con league-v4 (API pública)
                console.log('⚠️ Summoner-v4 no disponible, usando league-v4...');
                return await this.obtenerInfoJugadorAlternativo(nombre, region);
            } else if (response.status === 404) {
                return null; // Jugador no encontrado
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.log('⚠️ Error con summoner-v4, intentando método alternativo...');
            return await this.obtenerInfoJugadorAlternativo(nombre, region);
        }
    }

    // Método alternativo usando APIs públicas
    async obtenerInfoJugadorAlternativo(nombre, region) {
        const configRegion = this.regiones[region];
        
        try {
            // Usar league-v4 para obtener información del jugador
            const url = `https://${configRegion.platform}.api.riotgames.com/lol/league/v4/entries/by-summoner-name/${encodeURIComponent(nombre)}?api_key=${obtenerApiKey()}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    // Si encontramos datos de league, crear información básica
                    const leagueInfo = data[0];
                    return {
                        id: leagueInfo.summonerId,
                        name: leagueInfo.summonerName,
                        level: 'N/A', // No disponible en league-v4
                        profileIconId: 'N/A',
                        puuid: 'N/A', // No disponible en league-v4
                        accountId: 'N/A',
                        leagueInfo: leagueInfo // Información adicional de league
                    };
                } else {
                    return null; // Jugador no encontrado
                }
            } else if (response.status === 404) {
                return null; // Jugador no encontrado
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            throw new Error(`Error al obtener información del jugador: ${error.message}`);
        }
    }

    // Obtener historial de partidas usando APIs públicas
    async obtenerHistorialPartidas(puuid, region) {
        // Si no tenemos PUUID, no podemos obtener historial
        if (!puuid || puuid === 'N/A') {
            console.log('⚠️ PUUID no disponible, no se puede obtener historial de partidas');
            return [];
        }
        
        const configRegion = this.regiones[region];
        const url = `https://${configRegion.regional}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${this.limites.MAX_PARTIDAS}&api_key=${obtenerApiKey()}`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 403) {
                    console.log('⚠️ Match API no disponible con esta API key');
                    return [];
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('⚠️ Error al obtener historial de partidas:', error.message);
            return [];
        }
    }

    // Obtener detalles de las partidas
    async obtenerDetallesPartidas(matchIds, region) {
        const configRegion = this.regiones[region];
        const partidas = [];
        
        for (const matchId of matchIds) {
            try {
                const url = `https://${configRegion.regional}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${obtenerApiKey()}`;
                const response = await fetch(url);
                
                if (response.ok) {
                    const data = await response.json();
                    partidas.push(this.procesarPartida(data));
                }
            } catch (error) {
                console.error(`Error al obtener partida ${matchId}:`, error);
            }
        }
        
        return partidas;
    }

    // Procesar datos de una partida
    procesarPartida(matchData) {
        const info = matchData.info;
        const participantes = info.participants;
        
        return {
            gameId: info.gameId,
            gameMode: info.gameMode,
            gameType: info.gameType,
            duration: this.formatearDuracion(info.gameDuration),
            timestamp: new Date(info.gameCreation),
            participants: participantes.map(p => ({
                summonerName: p.summonerName,
                championName: p.championName,
                kills: p.kills,
                deaths: p.deaths,
                assists: p.assists,
                win: p.win,
                teamId: p.teamId,
                role: p.role,
                lane: p.lane
            }))
        };
    }

    // Formatear duración de la partida
    formatearDuracion(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segs = segundos % 60;
        return `${minutos}:${segs.toString().padStart(2, '0')}`;
    }

    // Mostrar resultados
    mostrarResultados(infoJugador, partidas) {
        const contenedor = document.getElementById('resultadosJugador');
        
        let html = `
            <div class="row">
                <div class="col-md-12">
                    <div class="card bg-dark text-light">
                        <div class="card-header">
                            <h3>📊 Información del Jugador</h3>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Nombre:</strong> ${infoJugador.name}</p>
                                    <p><strong>Nivel:</strong> ${infoJugador.level}</p>
                                    <p><strong>ID del Jugador:</strong> ${infoJugador.id}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>PUUID:</strong> ${infoJugador.puuid}</p>
                                    <p><strong>Icono de Perfil:</strong> ${infoJugador.profileIconId}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-md-12">
                    <div class="card bg-dark text-light">
                        <div class="card-header">
                            <h3>🎮 Historial de Partidas Recientes (${partidas.length} partidas)</h3>
                        </div>
                        <div class="card-body">
        `;
        
        if (partidas.length === 0) {
            html += '<p class="text-warning">No se encontraron partidas recientes.</p>';
        } else {
            partidas.forEach((partida, index) => {
                const jugador = partida.participants.find(p => p.summonerName === infoJugador.name);
                
                html += `
                    <div class="partida-item mb-3 p-3 border border-secondary rounded">
                        <div class="row">
                            <div class="col-md-3">
                                <h5>Partida ${index + 1}</h5>
                                <p><strong>Modo:</strong> ${partida.gameMode}</p>
                                <p><strong>Duración:</strong> ${partida.duration}</p>
                                <p><strong>Fecha:</strong> ${partida.timestamp.toLocaleDateString()}</p>
                            </div>
                            <div class="col-md-9">
                                ${jugador ? `
                                    <div class="jugador-info">
                                        <h6>Tu Información:</h6>
                                        <p><strong>Campeón:</strong> ${jugador.championName}</p>
                                        <p><strong>Rol:</strong> ${jugador.role} - ${jugador.lane}</p>
                                        <p><strong>KDA:</strong> ${jugador.kills}/${jugador.deaths}/${jugador.assists}</p>
                                        <p><strong>Resultado:</strong> 
                                            <span class="badge ${jugador.win ? 'badge-success' : 'badge-danger'}">
                                                ${jugador.win ? 'VICTORIA' : 'DERROTA'}
                                            </span>
                                        </p>
                                    </div>
                                ` : '<p class="text-warning">No se encontró información del jugador en esta partida.</p>'}
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        html += `
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        contenedor.innerHTML = html;
        contenedor.style.display = 'block';
    }

    // Mostrar loading
    mostrarLoading(mostrar) {
        const loading = document.getElementById('loadingJugador');
        if (loading) {
            loading.style.display = mostrar ? 'block' : 'none';
        }
    }

    // Mostrar error
    mostrarError(mensaje) {
        const error = document.getElementById('errorJugador');
        const mensajeError = document.getElementById('mensajeError');
        
        if (error && mensajeError) {
            mensajeError.textContent = mensaje;
            error.style.display = 'block';
        }
    }

    // Ocultar resultados
    ocultarResultados() {
        const resultados = document.getElementById('resultadosJugador');
        if (resultados) {
            resultados.style.display = 'none';
        }
    }

    // Ocultar error
    ocultarError() {
        const error = document.getElementById('errorJugador');
        if (error) {
            error.style.display = 'none';
        }
    }

    // Configurar API Key (método público para configuración)
    configurarApiKey(apiKey) {
        configurarApiKey(apiKey);
        this.apiKey = obtenerApiKey();
    }

    // Ejecutar diagnóstico de la API
    async ejecutarDiagnostico() {
        console.log('🔧 Ejecutando diagnóstico de la API...');
        
        // Mostrar mensaje al usuario
        this.mostrarError('Ejecutando diagnóstico... Revisa la consola del navegador (F12)');
        
        try {
            await ejecutarDiagnosticoAPI();
            
            // Limpiar mensaje después de un tiempo
            setTimeout(() => {
                this.ocultarError();
            }, 5000);
            
        } catch (error) {
            console.error('Error en diagnóstico:', error);
            this.mostrarError('Error al ejecutar diagnóstico: ' + error.message);
        }
    }
}

// Inicializar el buscador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.buscadorJugadores = new BuscadorJugadores();
    
    // Nota: Para usar la funcionalidad, necesitas configurar una API key válida
    // Ejemplo: configurarApiKey('TU_API_KEY_AQUI');
    
    console.log('🔍 Buscador de Jugadores inicializado');
    console.log('⚠️  IMPORTANTE: Configura una API key válida de Riot Games para usar la funcionalidad');
    console.log('📖 Instrucciones: Edita el archivo js/config.js y agrega tu API key');
}); 