#!/usr/bin/env node

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const fs = require('fs');
const path = require('path');
const Logger = require('./utils/logger');
const { Anthropic } = require('@anthropic-ai/sdk');
const pathUtils = require('./utils/paths');

const logger = new Logger('analyze-metrics');
const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

async function analyzeMetrics() {
  logger.info('Iniciando análisis de métricas de redes sociales...');

  const platforms = pathUtils.allScreenshotPlatforms();

  if (platforms.length === 0) {
    logger.warning('No hay carpetas de plataforma. Crea carpetas en pipeline/screenshots/');
    logger.warning('Ejemplo: pipeline/screenshots/facebook, pipeline/screenshots/instagram, etc');
    return;
  }

  logger.info(`Encontradas ${platforms.length} plataformas: ${platforms.join(', ')}`);

  const globalReport = {
    timestamp: new Date().toISOString(),
    platforms: {},
    totalScreenshots: 0
  };

  for (const platform of platforms) {
    logger.info(`📱 Analizando plataforma: ${platform}`);

    const platformDir = pathUtils.screenshotsByPlatform(platform);
    const screenshotFiles = fs.readdirSync(platformDir).filter(f =>
      f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')
    );

    if (screenshotFiles.length === 0) {
      logger.warning(`  No hay screenshots en ${platform}`);
      continue;
    }

    logger.info(`  Encontrados ${screenshotFiles.length} screenshots`);

    const platformReport = {
      platform,
      timestamp: new Date().toISOString(),
      screenshots: [],
      summary: {}
    };

    for (const screenshot of screenshotFiles) {
      logger.info(`  Analizando: ${screenshot}`);

      const imagePath = path.join(platformDir, screenshot);
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
                  text: `Analiza esta métrica de ${platform} y extrae:
                  1. Reach/Impressions
                  2. Engagement rate
                  3. Clicks/CTR
                  4. Conversiones (si visible)
                  5. Tendencia (↑ ↓ →)
                  6. Observaciones clave

                  Formato: JSON`
                }
              ]
            }
          ]
        });

        let analysis = {};
        if (response.content[0].type === 'text') {
          let jsonText = response.content[0].text;
          // Extraer JSON si está dentro de bloques de código markdown
          const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonText = jsonMatch[1];
          }
          try {
            analysis = JSON.parse(jsonText);
          } catch (e) {
            analysis = { raw_response: jsonText };
          }
        }

        platformReport.screenshots.push({
          filename: screenshot,
          analysis: analysis
        });

        logger.success(`  ✓ ${screenshot} analizado`);
      } catch (error) {
        logger.error(`  ✗ Error en ${screenshot}: ${error.message}`);
      }
    }

    globalReport.platforms[platform] = platformReport;
    globalReport.totalScreenshots += platformReport.screenshots.length;

    // Guardar reporte por plataforma (JSON)
    const platformReportDir = pathUtils.reportsByPlatform(platform);
    const reportPath = path.join(platformReportDir, `metrics-${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(platformReport, null, 2));

    // Guardar reporte por plataforma (Markdown)
    const mdReport = generatePlatformReport(platformReport);
    const mdPath = path.join(platformReportDir, `METRICS-${new Date().toISOString().split('T')[0]}.md`);
    fs.writeFileSync(mdPath, mdReport);

    logger.success(`✓ Reporte ${platform}: ${mdPath}`);
  }

  // Guardar reporte global consolidado
  const globalReportPath = path.join(pathUtils.reports(), `METRICS-GLOBAL-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(globalReportPath, JSON.stringify(globalReport, null, 2));

  const globalMdReport = generateGlobalReport(globalReport);
  const globalMdPath = path.join(pathUtils.reports(), `METRICS-GLOBAL-${new Date().toISOString().split('T')[0]}.md`);
  fs.writeFileSync(globalMdPath, globalMdReport);

  logger.success(`✓ Reporte global guardado en: ${globalMdPath}`);
}

function generatePlatformReport(report) {
  return `# Análisis de Métricas - ${report.platform}
**Fecha:** ${new Date().toLocaleDateString('es-ES')} | **Total screenshots:** ${report.screenshots.length}

${report.screenshots.length === 0 ? 'No hay screenshots analizados.' : report.screenshots.map((item, i) => `
## ${i + 1}. ${item.filename}

- **Reach:** ${item.analysis.reach || 'N/A'}
- **Engagement Rate:** ${item.analysis.engagement_rate || 'N/A'}
- **CTR:** ${item.analysis.ctr || 'N/A'}
- **Conversiones:** ${item.analysis.conversions || 'N/A'}
- **Tendencia:** ${item.analysis.trend || 'N/A'}

### Observaciones
${item.analysis.observations || 'Sin observaciones'}
`).join('\n')}
`;
}

function generateGlobalReport(globalReport) {
  const platformSummary = Object.entries(globalReport.platforms)
    .map(([platform, data]) => `
### ${platform.toUpperCase()}
- **Screenshots analizados:** ${data.screenshots.length}
- **Última actualización:** ${new Date(data.timestamp).toLocaleString('es-ES')}
${data.screenshots.length > 0 ? `- **Engagement promedio:** ${(data.screenshots.reduce((sum, s) => sum + (parseFloat(s.analysis.engagement_rate) || 0), 0) / data.screenshots.length).toFixed(2)}%` : ''}
`)
    .join('\n');

  return `# Análisis de Métricas Global
**Fecha:** ${new Date().toLocaleDateString('es-ES')}
**Total plataformas:** ${Object.keys(globalReport.platforms).length}
**Total screenshots:** ${globalReport.totalScreenshots}

## Resumen por Plataforma
${platformSummary}

## Detalles Completos
Para más detalles, consulta los reportes individuales en:
- \`pipeline/reports/facebook/\`
- \`pipeline/reports/instagram/\`
- \`pipeline/reports/tiktok/\`
- \`pipeline/reports/linkedin/\`
- \`pipeline/reports/google-ads/\`
`;
}

analyzeMetrics().catch(error => {
  logger.error(error.message);
  process.exit(1);
});
