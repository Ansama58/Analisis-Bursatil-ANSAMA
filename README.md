# ANSAMA ANALYTICS — Centro de Análisis Bursátil Asistido por IA

**ANSAMA ANALYTICS** es una aplicación web independiente con diseño y comportamiento de **terminal financiero profesional**, creada para supervisar, investigar, calificar y generar predicciones fundamentadas sobre renta variable estadounidense (NASDAQ, NYSE) y europea (IBEX 35, DAX, Euronext).

---

## 🏛️ Las 7 Pantallas del Terminal

1. **Panel Principal (Dashboard)**:
   - Cinta de índices mundiales en tiempo real: Nasdaq, S&P 500, Dow Jones, IBEX 35 y Euro Stoxx 50.
   - Ranking de mejores puntuaciones cuantitativas y valores en vigilancia de riesgo.
   - Alertas de oportunidades generadas por algoritmos técnicos y fundamentales.
   - Historial de últimos informes y noticias financieras filtradas por IA.

2. **Analizador de Valores**:
   - Gráfico financiero interactivo de velas japonesas y líneas, con medias móviles (SMA 20, SMA 50), volumen y bandas de Bollinger.
   - Selector de horizonte temporal (1M, 3M, 6M, 1A).
   - Tarjetas desglosadas de indicadores técnicos (RSI 14, MACD, ATR, Momentum) y ratios fundamentales (PER, Forward PER, PEG, EV/EBITDA, Crecimiento ingresos, Margen operativo, ROIC, Deuda/EBITDA, Dividend Yield).
   - Plan operativo con **Zonas de Entrada**, **Precio Objetivo Estimado** y **Stop Loss Estructural**.

3. **Resultado de la Inteligencia Artificial (Informe de Inversión)**:
   - Puntuación Global ponderada de 0 a 100 con desglose en 5 bloques: Técnico (25%), Fundamental (25%), Sentimiento (15%), Valoración (15%) y Riesgo (10%).
   - **Modelo Predictivo Cuantitativo independiente**: Probabilidad de superar al índice a 3 meses, probabilidad de rentabilidad positiva, drawdown máximo estimado y ratio riesgo/beneficio.
   - **Deliberación Multi-Agente**:
     - *Agente Técnico*
     - *Agente Fundamental*
     - *Agente de Noticias y Sentimiento*
     - *Agente de Gestión de Riesgo*
     - *Debate Dialéctico*: **Tesis Alcista (Bull)** vs. **Tesis Bajista (Bear)**
     - *Veredicto Final del Agente Coordinador* con condiciones para comprar, vender o mantener.

4. **Lista de Seguimiento (Watchlist)**:
   - Tabla interactiva con ordenación multicriterio por puntuación ANSAMA, potencial alcista, calidad técnica y fundamental.
   - Filtro rápido para activos de EE.UU., Europa o Ambos.

5. **Buscador de Oportunidades (Screener Cuantitativo)**:
   - Rastreos preconfigurados:
     - Las 20 mejores valoradas por ANSAMA
     - Empresas infravaloradas (Value)
     - Crecimiento acelerado de BPA
     - Fuerte Momentum bursátil
     - Cerca de soportes clave
     - Revisiones alcistas de analistas
     - Alerta de riesgo financiero elevado
     - Señales bajistas activas
   - Selector regional: Estados Unidos, Europa o Ambos mercados.

6. **Comparador de Empresas**:
   - Matriz comparativa cara a cara (hasta 4 empresas simultáneas) para evaluar diferencias en valoración, múltiplos, márgenes, solvencia y momentum.

7. **Histórico y Resultados (Track Record Auditable)**:
   - Registro de auditoría de todas las recomendaciones pasadas.
   - Verificación de aciertos a 1, 3, 6 y 12 meses respecto a la cotización real y al índice de referencia.
   - Estadísticas de efectividad: Tasa de acierto en dirección, objetivos cumplidos, stops ejecutados y Alfa generado.

---

## 🚦 Estado de las 4 Etapas del Proyecto

- [x] **Etapa 1 — Aplicación y Diseño**: 
  - Terminal de escritorio con estética institucional azul marino (`#070b18` y `#0b132b`).
  - Las 7 pantallas completas: Dashboard, Analizador, Informe IA con debate dialéctico, Watchlist, Screener, Comparador y Track Record auditable.
- [x] **Etapa 2 — Conexiones Financieras (Completada)**:
  - **Twelve Data API**: Cotizaciones, series históricas OHLCV, velas reales y cálculo de indicadores (RSI, MACD, Bollinger).
  - **Finnhub Financial API**: Métricas fundamentales, ratios contables (PER, PB, ROIC), noticias en tiempo real y consenso de analistas.
  - **SEC EDGAR**: Consulta de informes regulatorios oficiales de EE.UU. (10-K Anual, 10-Q Trimestral, 8-K) con enlaces directos verificados.
  - **Pasarela Europea (Euronext & BME)**: Cobertura nativa para IBEX 35, DAX y bolsas europeas.
  - **Arquitectura Desacoplada (`src/services/` & `src/context/`)**: Motor unificado conmutador con fallback resiliente para operar tanto con claves reales como en modo demostración/respaldo calibrado.
  - **Caché Inteligente (TTL)**: Protección estricta de límites de llamadas de las APIs gratuitas y máxima fluidez.
  - **Auditoría de Frescura de Datos**: Avisos automáticos si los datos superan los 15 minutos sin refresco.
  - **Centro de Conexiones & Claves**: Gestión de API keys con pruebas de latencia en vivo (Ping Test) en `SourcesModal.jsx`.
- [x] **Etapa 3 — Inteligencia Artificial (Completada)**:
  - **Motor de Puntuación Cuantitativa ([`aiScoringEngine.js`](file:///c:/Users/andre/Desktop/Analisis%20Bursatil%20ANSAMA/src/services/aiScoringEngine.js))**:
    - Evaluación algorítmica de los 6 bloques: Técnico (25%), Fundamental (25%), Sentimiento (15%), Valoración (15%), Tendencia (10%) y Riesgo (10%).
    - Identificación automática de **factores que elevan la puntuación** (boosters) y **factores que la reducen** (penalizaciones).
    - Ponderaciones configurables por el usuario persistidas en almacenamiento seguro local.
  - **Modelo Predictivo Multi-Horizonte ([`aiPredictiveModel.js`](file:///c:/Users/andre/Desktop/Analisis%20Bursatil%20ANSAMA/src/services/aiPredictiveModel.js))**:
    - Probabilidad de superar al índice de referencia a **1, 3, 6 y 12 meses**.
    - Probabilidad de rentabilidad positiva nominal.
    - Riesgo de caída máxima estimada (Drawdown al 95% de confianza) y ratio Beneficio/Riesgo.
    - Selector interactivo de horizonte temporal con recálculo dinámico.
  - **Motor de Inferencia Multi-Agente ([`aiMultiAgentEngine.js`](file:///c:/Users/andre/Desktop/Analisis%20Bursatil%20ANSAMA/src/services/aiMultiAgentEngine.js))**:
    - Generación analítica de los 4 agentes especializados (Técnico, Fundamental, Noticias/Sentimiento, Gestión de Riesgo).
    - **Debate Dialéctico**: Tesis Alcista (*Bull Thesis*) vs. Tesis Bajista (*Bear Thesis*).
    - **Veredicto del Agente Coordinador**: Recomendación formal (*Compra Fuerte*, *Compra Estructural*, *Mantener*, *Venta*), zona de entrada óptima, precio objetivo y stop loss dinámico.
  - **Centro de Configuración de Pesos y Motor IA ([`AiConfigModal.jsx`](file:///c:/Users/andre/Desktop/Analisis%20Bursatil%20ANSAMA/src/components/modals/AiConfigModal.jsx))**:
    - Sliders interactivos con auto-normalización a 100% y restablecimiento a pesos oficiales.
  - **Botón de exportación / copia del informe completo de inversión**.
- [x] **Etapa 4 — Validación y Puesta en Marcha (Completada)**:
  - **Servicio de Auditoría de Histórico ([`historyAuditService.js`](file:///c:/Users/andre/Desktop/Analisis%20Bursatil%20ANSAMA/src/services/historyAuditService.js))**:
    - Motor de seguimiento de recomendaciones con persistencia en `localStorage`.
    - Contraste automático y en vivo de predicciones pasadas frente a las cotizaciones de mercado actuales.
    - Métricas automáticas: Tasa de acierto de dirección, rentabilidad acumulada, Alfa generado vs. S&P 500 / IBEX 35, y distribución de estados (*Objetivo Cumplido*, *En Curso*, *Stop Ejecutado*).
    - Registro dinámico directo desde el Analizador de Valores y el Informe de Inversión IA.
  - **Módulo de Copias de Seguridad y Restauración ([`BackupModal.jsx`](file:///c:/Users/andre/Desktop/Analisis%20Bursatil%20ANSAMA/src/components/modals/BackupModal.jsx))**:
    - Exportación de la base de datos completa de histórico, notas y configuración en formato JSON fechado.
    - Importación con validación de esquema de datos y restauración instantánea de estado.
  - **Exportación en CSV**: Descarga en hoja de cálculo del Track Record completo para auditoría externa.
  - **Verificación de Compilación de Producción**: Build verificado con Vite (`npm run build`), optimizado sin errores de tipos o dependencias.
  - **Empaquetado Limpio para GitHub**: Script automatizado `empaquetar_proyecto.bat` y archivo `ANSAMA_ANALYTICS_GITHUB.zip` listo para clonar o distribuir sin carpetas pesadas temporales.

---

## 🔒 Utilidades y Seguridad

- **Control de Acceso**: Bloqueo de terminal con contraseña y panel para cambiarla (clave por defecto: `ansama`).
- **Registro de Fuentes & Conexiones**: Monitorización del estado y latencia de conexiones (Twelve Data, Finnhub, SEC EDGAR, Euronext, BME).
- **Copias de Seguridad**: Exportación e importación de la base de datos de históricos y seguimiento en formato JSON cifrado y fechado.

---

## 🚀 Cómo Ejecutar la Aplicación

### Opción 1: Acceso Directo (Recomendado en Windows)
Haz doble clic sobre el archivo `iniciar.bat`.

### Opción 2: Desde la Terminal
```bash
npm install
npm run dev
```
Abre tu navegador en `http://localhost:3000` (o el puerto indicado en la consola).

---

## 📦 Estructura del Código

```
Analisis Bursatil ANSAMA/
├── src/
│   ├── services/                       # Conexiones (Etapa 2) y Motores de IA (Etapa 3)
│   │   ├── apiConfig.js                # Gestor central de claves, latencias y modos
│   │   ├── twelveDataService.js        # Cotizaciones, velas OHLCV e indicadores técnicos
│   │   ├── finnhubService.js           # Fundamentales, noticias y consenso Wall Street
│   │   ├── secEdgarService.js          # Filings oficiales 10-K y 10-Q de la SEC
│   │   ├── marketDataService.js        # Motor unificado de agregación, caché y fallback
│   │   ├── aiScoringEngine.js          # Motor cuantitativo 6 bloques y explicaciones causales
│   │   ├── aiPredictiveModel.js        # Modelo estocástico predictivo multi-horizonte (1M, 3M, 6M, 12M)
│   │   ├── aiMultiAgentEngine.js       # Generador de deliberación multi-agente (4 agentes + Bull vs Bear + Coordinador)
│   │   └── historyAuditService.js      # Auditoría de histórico, contraste con precios reales y KPIs (Etapa 4)
│   ├── context/
│   │   └── MarketContext.jsx           # Proveedor global reactivo de mercado e IA
│   ├── components/
│   │   ├── screens/
│   │   │   ├── DashboardScreen.jsx     # Pantalla 1
│   │   │   ├── AnalyzerScreen.jsx      # Pantalla 2
│   │   │   ├── AiReportScreen.jsx      # Pantalla 3: Informe IA, debate y probabilidades
│   │   │   ├── WatchlistScreen.jsx     # Pantalla 4
│   │   │   ├── ScreenerScreen.jsx      # Pantalla 5
│   │   │   ├── ComparatorScreen.jsx    # Pantalla 6
│   │   │   └── HistoryScreen.jsx       # Pantalla 7
│   │   ├── modals/
│   │   │   ├── AuthModal.jsx           # Contraseña y bloqueo
│   │   │   ├── SourcesModal.jsx        # Centro de conexiones, claves y ping tests
│   │   │   ├── BackupModal.jsx         # Copias de seguridad JSON
│   │   │   └── AiConfigModal.jsx       # Configuración de pesos cuantitativos (Etapa 3)
│   │   ├── FinancialChart.jsx          # Gráfico de velas, SMAs y niveles
│   │   ├── Header.jsx                  # Búsqueda universal, estado en vivo y relojes
│   │   ├── IndicesBar.jsx              # Ticker bar de índices globales en vivo
│   │   └── Sidebar.jsx                 # Menú lateral azul oscuro
│   ├── data/
│   │   ├── marketData.js               # Datos de mercado USA / Europa
│   │   ├── screenerData.js             # Filtros y presets cuantitativos
│   │   └── historyData.js              # Track record de auditoría
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── iniciar.bat                         # Script de inicio directo
├── empaquetar_proyecto.bat             # Generación de ZIP limpio para GitHub (Etapa 4)
├── package.json
├── tailwind.config.js
└── vite.config.js
```
