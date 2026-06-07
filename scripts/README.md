# Prissly Marketing Pipeline Scripts

## Instalación

```bash
cd scripts
npm install
```

## Configuración

1. Copia `.env.example` a `.env` en la raíz del proyecto
2. Rellena tus API keys:
   - `CLAUDE_API_KEY`: Tu clave de API de Anthropic Claude
   - `GOOGLE_SHEET_ID`: ID de tu Google Sheet
   - `GOOGLE_API_KEY`: Clave API de Google
   - `CANVA_API_KEY`: Clave API de Canva (opcional)
3. Actualiza `config.json` con tu Google Sheet ID y rutas específicas

## Uso

### Ejecutar pipeline completo:
```bash
bash 5-run-pipeline.sh
```

### Ejecutar scripts individuales:
```bash
npm run analyze-metrics        # Analiza screenshots de redes sociales
npm run analyze-content        # Analiza videos/imágenes de Canva
npm run generate-ideas         # Genera ideas basadas en análisis
npm run update-sheet           # Actualiza Google Sheet
```

O directamente con node:
```bash
node 1-analyze-metrics.js
node 2-analyze-content.js
node 3-generate-ideas.js
node 4-update-sheet.js
```

## Estructura de Directorios

```
scripts/
├── 1-analyze-metrics.js        # Analiza screenshots de métricas
├── 2-analyze-content.js        # Analiza contenido (videos, imágenes)
├── 3-generate-ideas.js         # Genera ideas con IA
├── 4-update-sheet.js           # Actualiza Google Sheets
├── 5-run-pipeline.sh           # Orquestador principal
├── config.json                 # Configuración del pipeline
├── package.json                # Dependencias npm
├── README.md                   # Este archivo
└── utils/
    ├── logger.js               # Sistema de logging
    └── googleSheets.js         # Helper para Google Sheets (stub)
```

## Salida y Reportes

- **Reportes JSON**: `pipeline/reports/analisis-metricas-YYYY-MM-DD.json`
- **Reportes Markdown**: `pipeline/reports/METRICS-YYYY-MM-DD.md`
- **Análisis de Contenido**: `pipeline/reports/CONTENT-ANALYSIS-YYYY-MM-DD.md`
- **Ideas Generadas**: `pipeline/ideas/IDEAS-YYYY-MM-DD.md`
- **Logs**: `pipeline/reports/*-YYYY-MM-DD.log`

## Cómo Funciona

### 1. **Analyze Metrics** (1-analyze-metrics.js)
- Lee screenshots en `pipeline/screenshots/`
- Usa Claude Haiku para extraer: reach, engagement, CTR, tendencias
- Genera reporte JSON y Markdown

### 2. **Analyze Content** (2-analyze-content.js)
- Lee contenido en `content/` (videos, imágenes, posts, designs)
- Analiza tema, tono, target audience, plataforma ideal
- Proporciona puntuación de efectividad y sugerencias

### 3. **Generate Ideas** (3-generate-ideas.js)
- Lee reportes de pasos anteriores
- Usa Claude para generar 5 ideas argumentadas
- Basadas en evidencia de análisis reales

### 4. **Update Sheet** (4-update-sheet.js)
- Lee datos del último reporte
- Prepara datos para Google Sheets
- (Actualmente en stub — lista para integración completa)

### 5. **Run Pipeline** (5-run-pipeline.sh)
- Ejecuta los 4 pasos en orden
- Maneja errores con parada en cascada
- Hace commit automático de reportes
- Empuja cambios a GitHub

## Dependencias

```
@anthropic-ai/sdk     - API de Claude para IA
dotenv                - Gestión de variables de entorno
axios                 - Cliente HTTP
google-spreadsheet    - Cliente de Google Sheets
chalk                 - Colorización de logs
jimp                  - Procesamiento de imágenes
tesseract.js          - OCR opcional
```

## Próximas Features

- [ ] Integración Google Sheets API completa (actualmente stub)
- [ ] Webhook para disparar desde mobile
- [ ] Cron job para ejecución automática diaria
- [ ] Integración GitHub API para crear tarjetas automáticamente
- [ ] Dashboard de métricas en tiempo real
- [ ] Notificaciones por Slack cuando ideas se generan

## Solución de Problemas

**Error: "CLAUDE_API_KEY not found"**
- Verifica que `.env` existe y contiene `CLAUDE_API_KEY=...`

**Error: "pipeline/screenshots no existe"**
- Crea la carpeta: `mkdir -p pipeline/screenshots`
- Coloca screenshots de redes sociales allí

**Error: "No hay reportes previos"**
- Ejecuta `1-analyze-metrics.js` o `2-analyze-content.js` primero

**Logs no se generan**
- Verifica que `pipeline/reports/` existe
- Archivos .log deberían aparecer allí

## Desarrollo

Cada script es independiente y puede ejecutarse por separado. Los logs están disponibles en `pipeline/reports/`.

Para ver logs en tiempo real mientras se ejecuta el pipeline:
```bash
tail -f pipeline/reports/analyze-metrics-$(date +%Y-%m-%d).log
```
