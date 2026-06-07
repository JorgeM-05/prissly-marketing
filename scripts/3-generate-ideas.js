#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Logger = require('./utils/logger');
const { Anthropic } = require('@anthropic-ai/sdk');

const logger = new Logger('generate-ideas');
const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

async function generateIdeas() {
  logger.info('Generando nuevas ideas basadas en análisis...');

  const reportsDir = './pipeline/reports';
  const metricsReport = fs.readdirSync(reportsDir)
    .filter(f => f.startsWith('METRICS-'))
    .sort()
    .pop();

  const contentReport = fs.readdirSync(reportsDir)
    .filter(f => f.startsWith('CONTENT-ANALYSIS-'))
    .sort()
    .pop();

  let context = '';
  if (metricsReport) {
    context += fs.readFileSync(path.join(reportsDir, metricsReport), 'utf8');
  }
  if (contentReport) {
    context += '\n\n' + fs.readFileSync(path.join(reportsDir, contentReport), 'utf8');
  }

  if (!context) {
    logger.error('No hay reportes previos para analizar');
    return;
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Eres un experto en marketing para Prissly SaaS de restaurantes.

          Basándote en estos análisis de redes y contenido, genera 5 IDEAS NUEVAS super argumentadas.

          Para cada idea proporciona:
          1. **Nombre de la Idea**
          2. **Descripción** (2-3 líneas)
          3. **Por qué funciona** (evidencia de los análisis)
          4. **Target Audience** (específico)
          5. **Plataforma Principal** (Instagram/TikTok/LinkedIn)
          6. **Formato** (Reel/Story/Carousel/Video)
          7. **Viabilidad** (Alto/Medio/Bajo)
          8. **Impacto Estimado** (Reach, Engagement, Conversiones)
          9. **Próximos Pasos**

          CONTEXTO DE LOS ANÁLISIS:
          ${context}

          Formato: Markdown super claro`
        }
      ]
    });

    const ideas = response.content[0].text;

    // Guardar ideas
    const ideasPath = './pipeline/ideas/IDEAS-' +
      new Date().toISOString().split('T')[0] + '.md';

    fs.writeFileSync(ideasPath, ideas);
    logger.success(`Ideas generadas y guardadas en: ${ideasPath}`);

    // Crear tarjeta en GitHub Project (simulado por ahora)
    logger.info('Próximo paso: Revisar ideas en GitHub Project');

  } catch (error) {
    logger.error(`Error generando ideas: ${error.message}`);
  }
}

generateIdeas().catch(error => {
  logger.error(error.message);
  process.exit(1);
});
