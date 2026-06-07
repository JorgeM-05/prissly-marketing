#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Logger = require('./utils/logger');
const { Anthropic } = require('@anthropic-ai/sdk');

const logger = new Logger('analyze-metrics');
const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

async function analyzeMetrics() {
  logger.info('Iniciando análisis de métricas de redes sociales...');

  const screenshotDir = './pipeline/screenshots';
  if (!fs.existsSync(screenshotDir)) {
    logger.error(`Directorio no existe: ${screenshotDir}`);
    return;
  }

  const screenshots = fs.readdirSync(screenshotDir).filter(f =>
    f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')
  );

  if (screenshots.length === 0) {
    logger.warning('No hay screenshots para analizar. Coloca imágenes en ./pipeline/screenshots/');
    return;
  }

  logger.info(`Encontrados ${screenshots.length} screenshots para analizar`);

  const report = {
    timestamp: new Date().toISOString(),
    platform: 'social-media',
    screenshots: [],
    summary: {}
  };

  for (const screenshot of screenshots) {
    logger.info(`Analizando: ${screenshot}`);

    const imagePath = path.join(screenshotDir, screenshot);
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');

    try {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: base64Image
                }
              },
              {
                type: 'text',
                text: `Analiza esta métrica de red social y extrae:
                1. Plataforma detectada
                2. Reach/Impressions
                3. Engagement rate
                4. Clicks/CTR
                5. Conversiones (si visible)
                6. Tendencia (↑ ↓ →)
                7. Observaciones clave

                Formato: JSON`
              }
            ]
          }
        ]
      });

      const analysis = response.content[0].type === 'text'
        ? JSON.parse(response.content[0].text)
        : {};

      report.screenshots.push({
        filename: screenshot,
        analysis: analysis
      });

      logger.success(`${screenshot} analizado`);
    } catch (error) {
      logger.error(`Error analizando ${screenshot}: ${error.message}`);
    }
  }

  // Guardar reporte JSON
  const reportPath = './pipeline/reports/analisis-metricas-' +
    new Date().toISOString().split('T')[0] + '.json';

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Generar resumen en Markdown
  const mdReport = generateMarkdownReport(report);
  const mdPath = './pipeline/reports/METRICS-' +
    new Date().toISOString().split('T')[0] + '.md';

  fs.writeFileSync(mdPath, mdReport);

  logger.success(`Reporte guardado en: ${mdPath}`);
}

function generateMarkdownReport(report) {
  return `# Análisis de Métricas - ${new Date().toLocaleDateString('es-ES')}

${report.screenshots.map((item, i) => `
## ${i + 1}. ${item.filename}

- **Plataforma:** ${item.analysis.platform || 'N/A'}
- **Reach:** ${item.analysis.reach || 'N/A'}
- **Engagement Rate:** ${item.analysis.engagement_rate || 'N/A'}
- **CTR:** ${item.analysis.ctr || 'N/A'}
- **Tendencia:** ${item.analysis.trend || 'N/A'}

### Observaciones
${item.analysis.observations || 'Sin observaciones'}
`).join('\n')}
`;
}

analyzeMetrics().catch(error => {
  logger.error(error.message);
  process.exit(1);
});
