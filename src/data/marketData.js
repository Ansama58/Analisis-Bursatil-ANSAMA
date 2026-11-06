// Comprehensive market data for US & European equities & global indices
export const GLOBAL_INDICES = [
  { symbol: '^IXIC', name: 'Nasdaq 100', value: 18456.20, change: 142.30, changePercent: 0.78, region: 'US' },
  { symbol: '^GSPC', name: 'S&P 500', value: 5864.67, change: 24.15, changePercent: 0.41, region: 'US' },
  { symbol: '^DJI', name: 'Dow Jones', value: 42233.05, change: -48.20, changePercent: -0.11, region: 'US' },
  { symbol: '^IBEX', name: 'IBEX 35', value: 11894.40, change: 95.80, changePercent: 0.81, region: 'Europe' },
  { symbol: '^STOXX50E', name: 'Euro Stoxx 50', value: 4982.10, change: 32.40, changePercent: 0.65, region: 'Europe' },
];

export const STOCKS_DATA = {
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    market: 'US',
    exchange: 'NASDAQ',
    currency: '$',
    sector: 'Tecnología',
    industry: 'Semiconductores & IA',
    price: 184.86,
    change: 4.32,
    changePercent: 2.39,
    high52w: 195.20,
    low52w: 75.60,
    marketCap: '4.51T',
    volume: '54.2M',
    avgVolume: '48.6M',
    ansamaScore: 88,
    bias: 'Fuerte Compra',
    biasColor: 'emerald',
    scores: {
      technical: 92,
      fundamental: 89,
      sentiment: 86,
      valuation: 74,
      trend: 94,
      risk: 82,
    },
    probabilities: {
      outperform3M: 78,
      positiveReturn: 82,
      downsideRisk: 14,
      targetReturnPotential: 26.5,
      potentialLoss: -8.5,
      confidence: 'Alta (89%)'
    },
    targets: {
      entryZoneMin: 178.50,
      entryZoneMax: 183.00,
      targetPrice: 234.00,
      stopLoss: 168.00,
      supports: [180.20, 172.50, 164.00],
      resistances: [195.00, 210.00, 235.00]
    },
    technicalMetrics: {
      rsi14: 64.2,
      macd: 'Alcista (+3.42)',
      macdSignal: 'Cruce positivo hace 4 sesiones',
      sma20: 179.40,
      sma50: 168.20,
      sma100: 152.10,
      sma200: 134.80,
      bollingerUpper: 192.40,
      bollingerLower: 169.80,
      atr14: 4.85,
      momentum: '+12.4% (10d)',
      trendSummary: 'Tendencia alcista estructural en corto, medio y largo plazo.'
    },
    fundamentalMetrics: {
      per: 45.2,
      forwardPer: 32.4,
      peg: 1.15,
      pb: 38.6,
      evEbitda: 35.8,
      eps: 3.12,
      revenueGrowthYoY: '+122.4%',
      operatingMargin: '62.1%',
      netMargin: '55.3%',
      debtEbitda: '0.24x (Deuda neta negativa)',
      fcf: '48.2B',
      roe: '68.4%',
      roic: '59.2%',
      dividendYield: '0.04%'
    },
    agentsDeliberation: {
      technicalAgent: {
        score: 92,
        opinion: 'Estructura en subida libre tras romper la consolidación en 175$. Medias 20, 50 y 200 alineadas en orden alcista. RSI en 64 sin sobrecompra extrema. Entrada óptima en pullbacks hacia 180$.'
      },
      fundamentalAgent: {
        score: 89,
        opinion: 'Liderazgo indiscutible en centros de datos y aceleradores Blackwell. Márgenes operativos excepcionales del 62%. Balance inmaculado con flujo de caja récord.'
      },
      sentimentAgent: {
        score: 86,
        opinion: 'Sentimiento fuertemente positivo. El 88% de las noticias y revisiones de consenso de analistas (42 recomendaciones de compra vs 1 venta) apoyan un rally continuado.'
      },
      riskAgent: {
        score: 82,
        opinion: 'Riesgo de concentración en grandes hyperscalers (Microsoft, Meta, Google) y tensiones en la cadena de suministro de TSMC. Riesgo regulatorio en exportaciones a China.'
      },
      bullThesis: {
        agent: 'Agente Alcista',
        summary: 'La demanda de computación de IA generativa y agentes autónomos supera la oferta hasta finales del próximo ejercicio. El ciclo de renovación Blackwell impulsará el EPS por encima de las previsiones.',
        points: ['Hipercrecimiento de ingresos >100%', 'Poder de fijación de precios inigualable', 'Márgenes de beneficio sostenidos >55%']
      },
      bearThesis: {
        agent: 'Agente Bajista',
        summary: 'Múltiplos exigentes que no perdonan ninguna desaceleración en el gasto de capital de los gigantes tecnológicos. Posible comoditización a medio plazo con chips ASIC propietarios.',
        points: ['CapEx de clientes puede ralentizarse', 'Restricciones geopolíticas con China', 'Volatilidad histórica elevada']
      },
      coordinator: {
        recommendation: 'COMPRA / ACUMULAR EN RETROCESOS',
        summary: 'Consenso generalizado entre análisis cuantitativo y cualitativo. Con un ratio beneficio/riesgo de 3.1 a 1, la probabilidad de batir al S&P 500 en los próximos 3 meses es del 78%. Mantener stop dinámico en 168$.'
      }
    },
    news: [
      { id: 1, title: 'Los grandes proveedores de la nube anuncian un aumento del 35% en gasto de centros de datos de IA', source: 'Bloomberg', time: 'Hace 2 horas', sentiment: 'positive', impact: 'Alto' },
      { id: 2, title: 'Morgan Stanley eleva el precio objetivo a 240$ citando aceleración en la entrega de Blackwell', source: 'Reuters', time: 'Hace 5 horas', sentiment: 'positive', impact: 'Medio' },
      { id: 3, title: 'Departamento de Comercio revisa normativas de chips avanzados para Asia', source: 'Financial Times', time: 'Hace 1 día', sentiment: 'neutral', impact: 'Medio' }
    ]
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    market: 'US',
    exchange: 'NASDAQ',
    currency: '$',
    sector: 'Tecnología',
    industry: 'Software & Servicios Cloud',
    price: 432.20,
    change: 2.80,
    changePercent: 0.65,
    high52w: 468.35,
    low52w: 366.50,
    marketCap: '3.21T',
    volume: '18.4M',
    avgVolume: '20.1M',
    ansamaScore: 84,
    bias: 'Sesgo Alcista',
    biasColor: 'emerald',
    scores: {
      technical: 78,
      fundamental: 93,
      sentiment: 82,
      valuation: 71,
      trend: 88,
      risk: 92,
    },
    probabilities: {
      outperform3M: 71,
      positiveReturn: 76,
      downsideRisk: 9,
      targetReturnPotential: 18.2,
      potentialLoss: -5.4,
      confidence: 'Muy Alta (92%)'
    },
    targets: {
      entryZoneMin: 424.00,
      entryZoneMax: 430.00,
      targetPrice: 510.00,
      stopLoss: 405.00,
      supports: [422.00, 410.00, 395.00],
      resistances: [445.00, 468.00, 500.00]
    },
    technicalMetrics: {
      rsi14: 56.8,
      macd: 'Neutral / Transición alcista',
      macdSignal: 'Histograma reduciendo presión vendedora',
      sma20: 428.10,
      sma50: 431.50,
      sma100: 435.00,
      sma200: 421.30,
      bollingerUpper: 442.10,
      bollingerLower: 418.50,
      atr14: 7.10,
      momentum: '+3.8% (10d)',
      trendSummary: 'Consolidación lateral sobre la media móvil de 200 sesiones con acumulación institucional.'
    },
    fundamentalMetrics: {
      per: 33.8,
      forwardPer: 29.1,
      peg: 1.85,
      pb: 11.2,
      evEbitda: 22.4,
      eps: 12.78,
      revenueGrowthYoY: '+15.2%',
      operatingMargin: '44.8%',
      netMargin: '36.1%',
      debtEbitda: '0.45x',
      fcf: '74.1B',
      roe: '38.5%',
      roic: '29.4%',
      dividendYield: '0.74%'
    },
    agentsDeliberation: {
      technicalAgent: {
        score: 78,
        opinion: 'Suelo redondeado sobre la media de 200 sesiones. Superando la directriz bajista de corto plazo en 435$ activará señal de impulso hacia máximos históricos.'
      },
      fundamentalAgent: {
        score: 93,
        opinion: 'Monopolio defensivo insuperable en software corporativo y Azure creciendo al 29%. Co-Pilot y monetización de IA empresarial acelerando ventas recurrentes.'
      },
      sentimentAgent: {
        score: 82,
        opinion: 'Consenso institucional unánime de sobreponderar. El 91% de los analistas de Wall Street recomiendan compra con precio objetivo medio de 495$.'
      },
      riskAgent: {
        score: 92,
        opinion: 'Nivel de riesgo muy bajo (puntuación defensiva 92/100). Balances AAA, generación de flujo de caja libre constante y diversificación global.'
      },
      bullThesis: {
        agent: 'Agente Alcista',
        summary: 'Azure supera las expectativas trimestrales y la integración de IA en Office 365 eleva el ARPU de clientes corporativos de forma masiva.',
        points: ['Monetización orgánica de Office 365', 'Azure ganando cuota a AWS', 'Generación de caja colosal']
      },
      bearThesis: {
        agent: 'Agente Bajista',
        summary: 'Elevado CapEx en infraestructura de centros de datos puede contraer temporalmente los márgenes operativos durante los próximos dos trimestres.',
        points: ['Intensidad de capital en servidores', 'Múltiplo PER exigente sobre 33x', 'Crecimiento de PC tradicional maduro']
      },
      coordinator: {
        recommendation: 'COMPRA CON PERFIL CONSERVADOR / CRECIMIENTO',
        summary: 'Activo de máxima calidad para cartera núcleo. Presenta un riesgo a la baja muy acotado y alta probabilidad de rentabilidad positiva (>76% a 6 meses).'
      }
    },
    news: [
      { id: 1, title: 'Azure anuncia nuevos servicios de inferencia privada para el sector bancario europeo', source: 'Wall Street Journal', time: 'Hace 3 horas', sentiment: 'positive', impact: 'Alto' },
      { id: 2, title: 'Goldman Sachs reitera compra en Microsoft con precio objetivo de 500$', source: 'CNBC', time: 'Hace 6 horas', sentiment: 'positive', impact: 'Medio' }
    ]
  },
  IBE: {
    symbol: 'IBE.MC',
    name: 'Iberdrola S.A.',
    market: 'Europe',
    exchange: 'BME (IBEX 35)',
    currency: '€',
    sector: 'Utilities / Energía',
    industry: 'Energías Renovables & Redes Eléctricas',
    price: 13.92,
    change: 0.18,
    changePercent: 1.31,
    high52w: 14.25,
    low52w: 10.45,
    marketCap: '88.5B €',
    volume: '8.2M',
    avgVolume: '7.8M',
    ansamaScore: 82,
    bias: 'Sesgo Alcista',
    biasColor: 'emerald',
    scores: {
      technical: 85,
      fundamental: 88,
      sentiment: 79,
      valuation: 76,
      trend: 84,
      risk: 80,
    },
    probabilities: {
      outperform3M: 69,
      positiveReturn: 81,
      downsideRisk: 8,
      targetReturnPotential: 14.5,
      potentialLoss: -4.2,
      confidence: 'Alta (86%)'
    },
    targets: {
      entryZoneMin: 13.40,
      entryZoneMax: 13.80,
      targetPrice: 15.90,
      stopLoss: 12.80,
      supports: [13.45, 12.90, 12.20],
      resistances: [14.30, 15.10, 16.00]
    },
    technicalMetrics: {
      rsi14: 61.4,
      macd: 'Alcista (+0.21)',
      macdSignal: 'Cruce alcista consolidado',
      sma20: 13.68,
      sma50: 13.25,
      sma100: 12.80,
      sma200: 12.15,
      bollingerUpper: 14.15,
      bollingerLower: 13.35,
      atr14: 0.18,
      momentum: '+4.2% (10d)',
      trendSummary: 'Canal alcista intachable en máximos históricos con apoyo en medias de corto y medio plazo.'
    },
    fundamentalMetrics: {
      per: 15.2,
      forwardPer: 13.8,
      peg: 1.42,
      pb: 1.58,
      evEbitda: 9.2,
      eps: 0.92,
      revenueGrowthYoY: '+9.4%',
      operatingMargin: '27.4%',
      netMargin: '12.8%',
      debtEbitda: '3.1x (Controlada, alta proporción a tipo fijo)',
      fcf: '5.8B €',
      roe: '11.8%',
      roic: '8.4%',
      dividendYield: '4.45%'
    },
    agentsDeliberation: {
      technicalAgent: {
        score: 85,
        opinion: 'Pauta alcista impecable sin señales de distribución. Soportes dinámicos respetados al tick en 13.50€. Proyección técnica hacia la cota de los 15.50€ - 16.00€.'
      },
      fundamentalAgent: {
        score: 88,
        opinion: 'Fuerte crecimiento en redes reguladas de Estados Unidos y Reino Unido. Beneficio neto récord y dividendo sostenible y creciente (>4.4% de yield).'
      },
      sentimentAgent: {
        score: 79,
        opinion: 'Flujos institucionales positivos hacia valores de calidad defensiva europea ante la bajada de tipos de interés del Banco Central Europeo.'
      },
      riskAgent: {
        score: 80,
        opinion: 'El riesgo de tipos se ha mitigado tras el inicio de los recortes del BCE. Riesgo regulatorio en España bajo control y diversificación geográfica notable.'
      },
      bullThesis: {
        agent: 'Agente Alcista',
        summary: 'La bajada de tipos de interés reduce costes financieros y eleva el atractivo del dividendo. La electrificación y la demanda eléctrica de centros de datos disparan contratos PPA.',
        points: ['Demanda eléctrica disparada por centros de datos', 'Recortes de tipos de interés del BCE', 'Dividendo defensivo >4.4%']
      },
      bearThesis: {
        agent: 'Agente Bajista',
        summary: 'Volatilidad en los precios mayoristas de la energía eléctrica y elevado volumen de inversión en capex que exige mantener niveles de deuda vigilados.',
        points: ['Caída puntual de precios pool', 'Capex elevado en redes', 'Dependencia de marcos regulatorios']
      },
      coordinator: {
        recommendation: 'COMPRA CON DIVIDENDO Y CRECIMIENTO DEFENSIVO',
        summary: 'Excelente pilar europeo para la cartera ANSAMA. Combina rentabilidad por dividendo atractiva, crecimiento en redes y viento de cola por bajadas de tipos del BCE.'
      }
    },
    news: [
      { id: 1, title: 'Iberdrola firma un acuerdo estratégico para suministrar energía 100% renovable a centros de datos en Europa', source: 'Expansión', time: 'Hace 4 horas', sentiment: 'positive', impact: 'Alto' },
      { id: 2, title: 'El BCE contempla nuevos recortes de tipos en su próxima reunión', source: 'Cinco Días', time: 'Hace 1 día', sentiment: 'positive', impact: 'Alto' }
    ]
  },
  ITX: {
    symbol: 'ITX.MC',
    name: 'Inditex S.A.',
    market: 'Europe',
    exchange: 'BME (IBEX 35)',
    currency: '€',
    sector: 'Consumo Cíclico',
    industry: 'Textil & Retail Global',
    price: 52.40,
    change: 0.95,
    changePercent: 1.85,
    high52w: 54.10,
    low52w: 36.80,
    marketCap: '163.2B €',
    volume: '2.4M',
    avgVolume: '2.8M',
    ansamaScore: 86,
    bias: 'Fuerte Compra',
    biasColor: 'emerald',
    scores: {
      technical: 88,
      fundamental: 94,
      sentiment: 81,
      valuation: 75,
      trend: 90,
      risk: 88,
    },
    probabilities: {
      outperform3M: 74,
      positiveReturn: 80,
      downsideRisk: 7,
      targetReturnPotential: 16.8,
      potentialLoss: -4.5,
      confidence: 'Alta (88%)'
    },
    targets: {
      entryZoneMin: 50.50,
      entryZoneMax: 51.80,
      targetPrice: 61.00,
      stopLoss: 48.20,
      supports: [50.80, 48.50, 45.20],
      resistances: [54.20, 58.00, 62.00]
    },
    technicalMetrics: {
      rsi14: 63.8,
      macd: 'Alcista (+1.15)',
      macdSignal: 'Tendencia acelerada',
      sma20: 51.10,
      sma50: 49.20,
      sma100: 46.80,
      sma200: 43.10,
      bollingerUpper: 53.90,
      bollingerLower: 49.10,
      atr14: 0.82,
      momentum: '+5.8% (10d)',
      trendSummary: 'Líder absoluto del mercado español con fortaleza relativa superior al Euro Stoxx 50.'
    },
    fundamentalMetrics: {
      per: 24.2,
      forwardPer: 21.5,
      peg: 1.62,
      pb: 8.4,
      evEbitda: 13.8,
      eps: 2.16,
      revenueGrowthYoY: '+10.8%',
      operatingMargin: '23.8%',
      netMargin: '18.4%',
      debtEbitda: '-1.4x (Caja neta de 12.000M €)',
      fcf: '6.4B €',
      roe: '35.2%',
      roic: '30.1%',
      dividendYield: '3.25%'
    },
    agentsDeliberation: {
      technicalAgent: {
        score: 88,
        opinion: 'Fuerza relativa descomunal. Cada recorte hacia la media móvil de 20 sesiones es comprado con voracidad institucional.'
      },
      fundamentalAgent: {
        score: 94,
        opinion: 'Modelo operativo integrado insuperable. Sin deuda financiera, caja neta superior a 12.000 millones de euros y retornos sobre capital empleado (ROIC) del 30%.'
      },
      sentimentAgent: {
        score: 81,
        opinion: 'Los inversores internacionales continúan primando la predictibilidad de su crecimiento en EE.UU. y la expansión del canal online.'
      },
      riskAgent: {
        score: 88,
        opinion: 'Riesgo financiero mínimo. Exposición a tipos de cambio cubierta y aprovisionamiento de proximidad que amortigua problemas logísticos.'
      },
      bullThesis: {
        agent: 'Agente Alcista',
        summary: 'Ganancia continuada de cuota de mercado global gracias a la optimización de espacio comercial y automatización logística en Zaragoza y Países Bajos.',
        points: ['Caja neta de 12.000M €', 'Aprovisionamiento rápido y flexible', 'Ganancia de cuota en EE.UU.']
      },
      bearThesis: {
        agent: 'Agente Bajista',
        summary: 'Valoración en la parte alta de su histórico y posible fatiga del consumo discrecional en caso de desaceleración económica europea.',
        points: ['PER exigente de 24x para retail', 'Sensibilidad al consumo en Europa', 'Presión salarial']
      },
      coordinator: {
        recommendation: 'COMPRA ESTRUCTURAL',
        summary: 'El mejor valor de calidad y momentum del mercado español. Excelente candidato para compra tanto a medio como a largo plazo.'
      }
    },
    news: [
      { id: 1, title: 'Inditex arranca la campaña de otoño-invierno con un avance de ventas del 11% en tiendas y online', source: 'Expansión', time: 'Hace 5 horas', sentiment: 'positive', impact: 'Alto' },
      { id: 2, title: 'Barclays eleva el precio objetivo a 58 euros destacando su eficiencia logística', source: 'Reuters', time: 'Hace 1 día', sentiment: 'positive', impact: 'Medio' }
    ]
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    market: 'US',
    exchange: 'NASDAQ',
    currency: '$',
    sector: 'Consumo Discrecional & Cloud',
    industry: 'Comercio Electrónico & AWS',
    price: 198.50,
    change: 3.10,
    changePercent: 1.59,
    high52w: 205.80,
    low52w: 138.20,
    marketCap: '2.08T',
    volume: '36.5M',
    avgVolume: '41.2M',
    ansamaScore: 81,
    bias: 'Sesgo Alcista',
    biasColor: 'emerald',
    scores: {
      technical: 79,
      fundamental: 86,
      sentiment: 84,
      valuation: 72,
      trend: 86,
      risk: 80,
    },
    probabilities: {
      outperform3M: 68,
      positiveReturn: 75,
      downsideRisk: 12,
      targetReturnPotential: 21.0,
      potentialLoss: -7.2,
      confidence: 'Alta (84%)'
    },
    targets: {
      entryZoneMin: 191.00,
      entryZoneMax: 196.00,
      targetPrice: 240.00,
      stopLoss: 181.00,
      supports: [192.50, 185.00, 176.00],
      resistances: [205.00, 220.00, 240.00]
    },
    technicalMetrics: {
      rsi14: 59.2,
      macd: 'Alcista (+1.85)',
      macdSignal: 'En expansión alcista',
      sma20: 193.40,
      sma50: 188.10,
      sma100: 184.20,
      sma200: 174.50,
      bollingerUpper: 202.40,
      bollingerLower: 188.10,
      atr14: 3.90,
      momentum: '+6.1% (10d)',
      trendSummary: 'Presionando la resistencia clave de los 200$ para buscar nuevos máximos anuales.'
    },
    fundamentalMetrics: {
      per: 38.4,
      forwardPer: 29.8,
      peg: 1.35,
      pb: 7.9,
      evEbitda: 18.2,
      eps: 5.17,
      revenueGrowthYoY: '+12.5%',
      operatingMargin: '10.8%',
      netMargin: '8.4%',
      debtEbitda: '0.85x',
      fcf: '52.6B',
      roe: '22.4%',
      roic: '17.1%',
      dividendYield: '0.00%'
    },
    agentsDeliberation: {
      technicalAgent: {
        score: 79,
        opinion: 'Consolidación en bandera alcista bajo el nivel psicológico de 200$. El volumen apoya la ruptura hacia 220$.'
      },
      fundamentalAgent: {
        score: 86,
        opinion: 'AWS acelerando gracias a la demanda de entrenamiento de modelos fundacionales. Expansión masiva de márgenes en publicidad retail y logística regional.'
      },
      sentimentAgent: {
        score: 84,
        opinion: 'Sentimiento fuertemente optimista ante la campaña de Navidad y el crecimiento de la suscripción Prime.'
      },
      riskAgent: {
        score: 80,
        opinion: 'Escrutinio antimonopolio por parte de la FTC en EE.UU., aunque con impacto a corto plazo diluido.'
      },
      bullThesis: {
        agent: 'Agente Alcista',
        summary: 'Los márgenes operativos en el negocio retail continúan expandiéndose por eficiencias en fulfillment regional, mientras AWS mantiene su hegemonía en la nube.',
        points: ['AWS acelerando crecimiento', 'Publicidad digital creciendo al 20%', 'Expansión de márgenes de retail']
      },
      bearThesis: {
        agent: 'Agente Bajista',
        summary: 'Competencia creciente de plataformas como Temu y Shein en retail de bajo coste, y litigios regulatorios pendientes.',
        points: ['Litigios con la FTC', 'Competencia en comercio electrónico', 'Inversión intensiva en satélites Kuiper']
      },
      coordinator: {
        recommendation: 'COMPRA CON OBJETIVO 240$',
        summary: 'Excelente balance entre crecimiento tecnológico con AWS y defensividad del comercio electrónico.'
      }
    },
    news: [
      { id: 1, title: 'Amazon Web Services lanza nuevos aceleradores Trainium 2 para reducir costes de IA', source: 'TechCrunch', time: 'Hace 6 horas', sentiment: 'positive', impact: 'Alto' }
    ]
  },
  SAN: {
    symbol: 'SAN.MC',
    name: 'Banco Santander S.A.',
    market: 'Europe',
    exchange: 'BME (IBEX 35)',
    currency: '€',
    sector: 'Financiero',
    industry: 'Banca Comercial & Global',
    price: 4.62,
    change: -0.04,
    changePercent: -0.86,
    high52w: 4.95,
    low52w: 3.42,
    marketCap: '71.4B €',
    volume: '28.1M',
    avgVolume: '31.5M',
    ansamaScore: 73,
    bias: 'Neutral / Moderado',
    biasColor: 'amber',
    scores: {
      technical: 68,
      fundamental: 81,
      sentiment: 70,
      valuation: 85,
      trend: 72,
      risk: 65,
    },
    probabilities: {
      outperform3M: 58,
      positiveReturn: 64,
      downsideRisk: 15,
      targetReturnPotential: 15.0,
      potentialLoss: -8.0,
      confidence: 'Media (72%)'
    },
    targets: {
      entryZoneMin: 4.35,
      entryZoneMax: 4.52,
      targetPrice: 5.30,
      stopLoss: 4.15,
      supports: [4.45, 4.25, 4.00],
      resistances: [4.80, 4.95, 5.30]
    },
    technicalMetrics: {
      rsi14: 49.5,
      macd: 'Neutral (-0.02)',
      macdSignal: 'Consolidación lateral',
      sma20: 4.65,
      sma50: 4.58,
      sma100: 4.45,
      sma200: 4.32,
      bollingerUpper: 4.82,
      bollingerLower: 4.48,
      atr14: 0.08,
      momentum: '-0.8% (10d)',
      trendSummary: 'Pausa lateral tras alcanzar la resistencia de los 4.80€ - 4.90€.'
    },
    fundamentalMetrics: {
      per: 6.2,
      forwardPer: 5.8,
      peg: 0.95,
      pb: 0.72,
      evEbitda: 5.1,
      eps: 0.74,
      revenueGrowthYoY: '+8.2%',
      operatingMargin: '48.2%',
      netMargin: '24.1%',
      debtEbitda: 'N/A (Banca)',
      fcf: '11.2B €',
      roe: '15.9%',
      roic: '12.4%',
      dividendYield: '4.95%'
    },
    agentsDeliberation: {
      technicalAgent: {
        score: 68,
        opinion: 'Fase de acumulación lateral. Es aconsejable esperar confirmación por encima de 4.75€ o compra en soporte de 4.45€.'
      },
      fundamentalAgent: {
        score: 81,
        opinion: 'Múltiplos de valoración extraordinariamente baratos (PER 6x y por debajo de valor en libros). ROTE superando el 16% y recompra de acciones constante.'
      },
      sentimentAgent: {
        score: 70,
        opinion: 'Sentimiento cauto por la trayectoria de recortes de tipos del BCE, aunque compensado por el negocio en Latinoamérica.'
      },
      riskAgent: {
        score: 65,
        opinion: 'Sensibilidad a la bajada de tipos de interés en Europa que estrecha el margen de intermediación a medio plazo.'
      },
      bullThesis: {
        agent: 'Agente Alcista',
        summary: 'La rentabilidad ROTE >16% y el plan agresivo de recompra de acciones elevan el BPA a doble dígito. Dividendo total >9% sumando efectivo y recompras.',
        points: ['PER muy bajo (6.2x)', 'Recompra constante de acciones', 'Diversificación en América y Europa']
      },
      bearThesis: {
        agent: 'Agente Bajista',
        summary: 'Los recortes de tipos del BCE presionarán a la baja el margen de intereses en España y Portugal en los próximos ejercicios.',
        points: ['Pico del margen de intereses', 'Riesgo divisa en Brasil y México', 'Sector cíclico']
      },
      coordinator: {
        recommendation: 'MANTENER / COMPRA EN RETROCESOS A 4.40€',
        summary: 'Valoración profunda pero momento técnico neutral. Interesante para perfil de alto dividendo y rentabilidad por valor.'
      }
    },
    news: [
      { id: 1, title: 'Santander completa el 75% de su último programa de recompra de acciones de 1.525 millones', source: 'Europa Press', time: 'Hace 7 horas', sentiment: 'positive', impact: 'Medio' }
    ]
  },
  SAP: {
    symbol: 'SAP.DE',
    name: 'SAP SE',
    market: 'Europe',
    exchange: 'XETRA (DAX 40)',
    currency: '€',
    sector: 'Tecnología',
    industry: 'Software Empresarial & Cloud ERP',
    price: 215.40,
    change: 3.20,
    changePercent: 1.51,
    high52w: 224.50,
    low52w: 138.60,
    marketCap: '252.0B €',
    volume: '1.9M',
    avgVolume: '2.1M',
    ansamaScore: 85,
    bias: 'Fuerte Compra',
    biasColor: 'emerald',
    scores: {
      technical: 87,
      fundamental: 91,
      sentiment: 83,
      valuation: 70,
      trend: 92,
      risk: 86,
    },
    probabilities: {
      outperform3M: 73,
      positiveReturn: 79,
      downsideRisk: 8,
      targetReturnPotential: 17.5,
      potentialLoss: -5.0,
      confidence: 'Alta (87%)'
    },
    targets: {
      entryZoneMin: 208.00,
      entryZoneMax: 214.00,
      targetPrice: 252.00,
      stopLoss: 196.00,
      supports: [210.00, 202.00, 192.00],
      resistances: [224.50, 240.00, 255.00]
    },
    technicalMetrics: {
      rsi14: 62.1,
      macd: 'Alcista (+2.40)',
      macdSignal: 'Impulso continuado',
      sma20: 211.20,
      sma50: 202.40,
      sma100: 191.10,
      sma200: 176.80,
      bollingerUpper: 222.00,
      bollingerLower: 204.00,
      atr14: 3.40,
      momentum: '+5.4% (10d)',
      trendSummary: 'Líder tecnológico europeo en subida libre tras la transición exitosa al Cloud ERP.'
    },
    fundamentalMetrics: {
      per: 31.5,
      forwardPer: 25.8,
      peg: 1.55,
      pb: 5.2,
      evEbitda: 19.4,
      eps: 6.84,
      revenueGrowthYoY: '+11.4%',
      operatingMargin: '26.8%',
      netMargin: '19.2%',
      debtEbitda: '0.35x',
      fcf: '7.1B €',
      roe: '18.4%',
      roic: '15.2%',
      dividendYield: '1.15%'
    },
    agentsDeliberation: {
      technicalAgent: {
        score: 87,
        opinion: 'Fuerte canal ascendente respetado durante los últimos 12 meses. Tendencia institucional indiscutible.'
      },
      fundamentalAgent: {
        score: 91,
        opinion: 'El negocio Cloud ERP crece a ritmos superiores al 27% interanual. Altísima fidelización de clientes (churn insignificante).'
      },
      sentimentAgent: {
        score: 83,
        opinion: 'Percepción excelente en los mercados globales como el bastión tecnológico más sólido del continente europeo.'
      },
      riskAgent: {
        score: 86,
        opinion: 'Balance muy sólido con mínima deuda y flujos de caja recurrentes blindados por contratos multianuales.'
      },
      bullThesis: {
        agent: 'Agente Alcista',
        summary: 'La migración obligatoria de clientes hacia S/4HANA Cloud asegura visibilidad de ingresos y expansión de márgenes hasta 2028.',
        points: ['Cloud ERP creciendo >27%', 'Ingresos recurrentes al 85%', 'Incorporación de IA generativa (Joule)']
      },
      bearThesis: {
        agent: 'Agente Bajista',
        summary: 'Costes de reestructuración laboral y múltiplos exigentes si el crecimiento en Europa se debilita.',
        points: ['Múltiplo PER >30x', 'Competencia de Salesforce y Workday', 'Costes de transición']
      },
      coordinator: {
        recommendation: 'COMPRA / VALOR TECNOLÓGICO CENTRAL EUROPEO',
        summary: 'Activo indispensable para exposición tecnológica europea con altísima visibilidad de beneficios.'
      }
    },
    news: [
      { id: 1, title: 'SAP eleva previsiones anuales de flujo de caja tras un trimestre récord en ventas Cloud', source: 'Handelsblatt', time: 'Hace 8 horas', sentiment: 'positive', impact: 'Alto' }
    ]
  }
};
