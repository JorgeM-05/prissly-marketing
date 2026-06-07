# Pipeline de Marketing Prissly

Este pipeline automatiza el flujo completo de generación de contenido para Prissly: **analizar métricas → analizar contenido → generar ideas → actualizar Google Sheets**.

---

## 🚀 Inicio Rápido

### 1. Configuración (primera vez)

```bash
# Copiar template de variables de entorno
cp .env.example .env

# Editar .env y agregar tu CLAUDE_API_KEY
nano .env
```

### 2. Preparar datos

```bash
# Crear carpeta para screenshots de métricas
mkdir -p pipeline/screenshots

# Copiar screenshots de redes sociales aquí
# (Instagram, TikTok, LinkedIn, Facebook, Google Ads)
cp ~/ruta/a/screenshots/*.png pipeline/screenshots/
```

### 3. Ejecutar pipeline

```bash
# Opción 1: Ejecutar todo de una vez
bash scripts/5-run-pipeline.sh

# Opción 2: Desde npm (equivalente)
cd scripts && npm run pipeline
```

---

## 📋 Comandos Disponibles

### **Opción A: Ejecutar Script Individual**

```bash
cd scripts
node 1-analyze-metrics.js      # Analizar métricas
node 2-analyze-content.js      # Analizar contenido
node 3-generate-ideas.js       # Generar ideas
node 4-update-sheet.js         # Actualizar Google Sheet
```

### **Opción B: Usar npm scripts**

```bash
cd scripts
npm run analyze-metrics        # Analizar métricas
npm run analyze-content        # Analizar contenido
npm run generate-ideas         # Generar ideas
npm run update-sheet           # Actualizar Google Sheet
npm run pipeline               # Ejecutar todo
```

### **Opción C: Ejecutar Pipeline Completo**

```bash
bash scripts/5-run-pipeline.sh
```

---

## 🔍 Para Qué Sirve Cada Script

### **1️⃣ `1-analyze-metrics.js`**

**¿Para qué?**
Analiza screenshots de métricas de redes sociales y extrae datos clave.

**Qué hace:**
- Lee imágenes de `pipeline/screenshots/`
- Usa Claude Haiku para extraer:
  - Plataforma (Instagram, TikTok, LinkedIn, etc.)
  - Reach/Impressions
  - Engagement rate
  - CTR (Click-Through Rate)
  - Conversiones
  - Tendencias (↑ ↓ →)
- Genera reporte JSON y Markdown

**Output:**
```
pipeline/reports/
├── analisis-metricas-2026-06-06.json  (datos raw)
└── METRICS-2026-06-06.md              (resumen formateado)
```

**Entrada requerida:**
- Screenshots en `pipeline/screenshots/` (PNG o JPG)

**Ejemplo de uso:**
```bash
node 1-analyze-metrics.js
# ✓ Métrica 1 analizada
# ✓ Métrica 2 analizada
# ✓ Reporte guardado en: pipeline/reports/METRICS-2026-06-06.md
```

---

### **2️⃣ `2-analyze-content.js`**

**¿Para qué?**
Analiza contenido creado en Canva (videos, imágenes, posts, designs) y evalúa su efectividad.

**Qué hace:**
- Lee archivos de `content/` (videos, images, posts, designs)
- Analiza para cada pieza:
  - Tema principal
  - Tono (formal, casual, humorístico)
  - Target audience
  - Plataforma ideal para publicar
  - Puntuación de efectividad (1-10)
  - Hooks detectados (qué engancha)
  - CTR estimado
  - Sugerencias de mejora
- Genera reporte Markdown detallado

**Output:**
```
pipeline/reports/CONTENT-ANALYSIS-2026-06-06.md
```

**Entrada requerida:**
- Archivos en `content/videos/`, `content/images/`, `content/posts/`, `content/designs/`

**Ejemplo de uso:**
```bash
node 2-analyze-content.js
# ✓ post-1.png analizado
# ✓ video-1.mp4 analizado
# ✓ Análisis de contenido guardado en: pipeline/reports/CONTENT-ANALYSIS-2026-06-06.md
```

---

### **3️⃣ `3-generate-ideas.js`**

**¿Para qué?**
Genera 5 ideas de contenido nuevas basadas en análisis previos (métricas + contenido actual).

**Qué hace:**
- Lee los reportes generados por scripts 1 y 2
- Usa Claude para generar ideas argumentadas
- Para cada idea proporciona:
  - Nombre y descripción
  - Por qué funciona (basado en análisis reales)
  - Target audience específico
  - Plataforma principal recomendada
  - Formato (Reel, Story, Carousel, Video)
  - Viabilidad (Alto/Medio/Bajo)
  - Impacto estimado
  - Próximos pasos

**Output:**
```
pipeline/ideas/IDEAS-2026-06-06.md
```

**Entrada requerida:**
- Reportes previos de scripts 1 y 2 en `pipeline/reports/`

**Ejemplo de uso:**
```bash
node 3-generate-ideas.js
# ✓ Ideas generadas y guardadas en: pipeline/ideas/IDEAS-2026-06-06.md
# ✓ Próximo paso: Revisar ideas en GitHub Project
```

---

### **4️⃣ `4-update-sheet.js`**

**¿Para qué?**
Actualiza tu Google Sheet con los datos generados por el pipeline.

**Qué hace:**
- Lee el último reporte de métricas
- Prepara datos para Google Sheets
- Actualiza la pestaña "Pipeline Logs" automáticamente

**Output:**
- Datos en Google Sheet: `https://docs.google.com/spreadsheets/d/1ZMQ4mecZi4gaCnwoAEF96LnwsdrBzBkVckv-CzxMnZM`

**Entrada requerida:**
- Reportes previos en `pipeline/reports/`
- GOOGLE_SHEET_ID en `.env`

**Ejemplo de uso:**
```bash
node 4-update-sheet.js
# ✓ Sheet actualizado correctamente
# ✓ Pestaña "Pipeline Logs" actualizada
```

---

### **5️⃣ `5-run-pipeline.sh` (Orquestador)**

**¿Para qué?**
Ejecuta los 4 scripts anteriores en orden automáticamente.

**Qué hace:**
1. Ejecuta Script 1 (analizar métricas)
2. Ejecuta Script 2 (analizar contenido)
3. Ejecuta Script 3 (generar ideas)
4. Ejecuta Script 4 (actualizar sheet)
5. Si todo es exitoso:
   - Hace commit de los reportes generados
   - Empuja a GitHub automáticamente

**Output:**
```
📊 PASO 1: Analizando métricas de redes...
✅ Métricas analizadas

🎨 PASO 2: Analizando contenido...
✅ Contenido analizado

💡 PASO 3: Generando ideas...
✅ Ideas generadas

📈 PASO 4: Actualizando Google Sheet...
✅ Sheet actualizado

✨ PIPELINE COMPLETADO EXITOSAMENTE
```

**Ejemplo de uso:**
```bash
bash scripts/5-run-pipeline.sh
# Ejecuta los 4 pasos automáticamente
# Hace commit: "pipeline: reportes generados 2026-06-06"
# Empuja a GitHub
```

---

## 📂 Estructura de Archivos

### Entrada (datos que provides tú)
```
pipeline/
└── screenshots/          ← Coloca aquí screenshots de métricas

content/
├── videos/              ← Videos de Canva
├── images/              ← Imágenes
├── posts/               ← Posts
└── designs/             ← Diseños

.env                     ← Tu configuración (no commitear)
```

### Salida (generados por el pipeline)
```
pipeline/
├── reports/
│   ├── METRICS-2026-06-06.md           ← Análisis de métricas
│   ├── analisis-metricas-2026-06-06.json
│   ├── CONTENT-ANALYSIS-2026-06-06.md  ← Análisis de contenido
│   └── analyze-metrics-2026-06-06.log  ← Logs detallados
│
└── ideas/
    └── IDEAS-2026-06-06.md             ← Ideas generadas
```

---

## ⚙️ Configuración

### `.env` (necesario)
```bash
CLAUDE_API_KEY=sk-ant-...tu-clave-de-claude...
GOOGLE_SHEET_ID=1ZMQ4mecZi4gaCnwoAEF96LnwsdrBzBkVckv-CzxMnZM
```

### `scripts/config.json` (opcional personalizar)
```json
{
  "googleSheetId": "1ZMQ4mecZi4gaCnwoAEF96LnwsdrBzBkVckv-CzxMnZM",
  "paths": {
    "screenshots": "./pipeline/screenshots",
    "reports": "./pipeline/reports",
    "ideas": "./pipeline/ideas"
  }
}
```

---

## 🔧 Solución de Problemas

### Error: "pipeline/screenshots no existe"
```bash
mkdir -p pipeline/screenshots
```

### Error: "No hay reportes previos para analizar"
Ejecuta los scripts 1 y 2 primero antes del 3.

### Error: "CLAUDE_API_KEY not found"
Verifica que `.env` existe y tiene tu clave:
```bash
cat .env | grep CLAUDE_API_KEY
```

### Los reportes no se generan
Verifica que `pipeline/reports/` existe:
```bash
ls -la pipeline/reports/
```

---

## 📊 Flujo del Pipeline

```
┌─────────────────────────┐
│  Screenshots de Redes   │
│   (Instagram, TikTok)   │
└────────────┬────────────┘
             │
             ▼
     ┌──────────────────────────────┐
     │ 1. Analyze Metrics           │
     │    (Lee screenshots)          │
     │    (Extrae: reach, CTR, etc) │
     └──────────────┬───────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     │
    ┌──────────────────┐       │
    │ Content (Canva)  │       │
    │ Vídeos/Imágenes  │       │
    └────────┬─────────┘       │
             │                 │
             ▼                 │
     ┌──────────────────────────────┐
     │ 2. Analyze Content           │
     │    (Evalúa efectividad)      │
     │    (Tema, tono, hooks)       │
     └──────────────┬───────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
    ┌──────────────────────────────┐
    │ 3. Generate Ideas (Claude)   │
    │    (Lee 2 reportes previos)  │
    │    (Genera 5 ideas nuevas)   │
    └──────────────┬───────────────┘
                   │
                   ▼
         ┌──────────────────────────────┐
         │ 4. Update Google Sheet       │
         │    (Envía datos a sheet)     │
         └──────────────┬───────────────┘
                        │
                        ▼
              ┌──────────────────────────┐
              │ 5. Git commit + push     │
              │    (Versiona reportes)   │
              └──────────────────────────┘
```

---

## 🎯 Flujo de Trabajo Recomendado

**Diariamente:**
```bash
# 1. Captura screenshots de tus métricas de redes
# 2. Coloca en pipeline/screenshots/

# 3. Ejecuta pipeline
bash scripts/5-run-pipeline.sh

# 4. Revisa reportes
less pipeline/reports/METRICS-*.md
less pipeline/reports/CONTENT-ANALYSIS-*.md

# 5. Revisa ideas generadas
less pipeline/ideas/IDEAS-*.md

# 6. GitHub Project se actualiza automáticamente
```

---

## 📞 Próximas Features

- [ ] Webhook para disparar desde mobile
- [ ] Cron job para ejecución automática diaria (09:00)
- [ ] Integración GitHub API para crear tarjetas automáticamente
- [ ] Dashboard de métricas en tiempo real
- [ ] Notificaciones por Slack
- [ ] Analytics de cuáles ideas funcionan mejor

---

## 📝 Logs

Todos los scripts generan logs detallados en `pipeline/reports/`:

```bash
# Ver logs en tiempo real
tail -f pipeline/reports/analyze-metrics-$(date +%Y-%m-%d).log

# Listar todos los logs
ls -la pipeline/reports/*.log
```

---

¡Listo! El pipeline está completamente documentado y listo para usar. 🚀
