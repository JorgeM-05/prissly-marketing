#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Logger = require('./utils/logger');
const { Anthropic } = require('@anthropic-ai/sdk');
const { content, reports, ensureDir } = require('./utils/paths');

const logger = new Logger('analyze-content');
const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

async function analyzeContent() {
  logger.info('Iniciando análisis de contenido de Canva...');

  const contentDir = content();
  const subdirs = ['videos', 'images', 'posts', 'designs'];
  ensureDir(reports());

  const analysis = {
    timestamp: new Date().toISOString(),
    content: []
  };

  for (const subdir of subdirs) {
    const fullPath = path.join(contentDir, subdir);
    if (!fs.existsSync(fullPath)) {
      logger.warning(`Directorio no existe: ${fullPath}`);
      continue;
    }

    const files = fs.readdirSync(fullPath);
    logger.info(`Encontrados ${files.length} archivos en ${subdir}`);

    for (const file of files) {
      if (!file.match(/\.(png|jpg|jpeg|mp4|webm)$/)) continue;

      logger.info(`Analizando: ${file}`);

      const filePath = path.join(fullPath, file);
      const fileData = fs.readFileSync(filePath);
      const base64Data = fileData.toString('base64');

      const mediaType = file.match(/\.(mp4|webm)$/) ? 'video/mp4' : 'image/jpeg';

      try {
        const response = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1500,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: mediaType,
                    data: base64Data
                  }
                },
                {
                  type: 'text',
                  text: `Analiza este contenido de Prissly y proporciona:

                  1. **Tema Principal:** ¿De qué trata?
                  2. **Tono:** ¿Formal, casual, humorístico?
                  3. **Target Audience:** ¿A quién va dirigido?
                  4. **Platform Ideal:** ¿Dónde debería publicarse? (Instagram/TikTok/LinkedIn)
                  5. **Efectividad Estimada:** Puntuación 1-10
                  6. **Hooks Detectados:** ¿Qué engancha al viewer?
                  7. **CTR Estimado:** % esperado
                  8. **Sugerencias de Mejora:** ¿Cómo hacerlo mejor?

                  Formato: Markdown estructurado`
                }
              ]
            }
          ]
        });

        const contentAnalysis = response.content[0].text;

        analysis.content.push({
          filename: file,
          type: subdir,
          analysis: contentAnalysis
        });

        logger.success(`${file} analizado`);
      } catch (error) {
        logger.error(`Error analizando ${file}: ${error.message}`);
      }
    }
  }

  // Guardar reporte
  const mdPath = path.join(reports(), 'CONTENT-ANALYSIS-' +
    new Date().toISOString().split('T')[0] + '.md');

  const mdContent = generateContentReport(analysis);
  fs.writeFileSync(mdPath, mdContent);

  logger.success(`Análisis de contenido guardado en: ${mdPath}`);
}

function generateContentReport(data) {
  return `# Análisis de Contenido - ${new Date().toLocaleDateString('es-ES')}

${data.content.map((item, i) => `
## ${i + 1}. ${item.filename} (${item.type})

${item.analysis}
`).join('\n---\n')}
`;
}

analyzeContent().catch(error => {
  logger.error(error.message);
  process.exit(1);
});
