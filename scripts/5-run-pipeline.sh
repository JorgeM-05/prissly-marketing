#!/bin/bash

echo "🚀 INICIANDO PIPELINE PRISSLY MARKETING"
echo "========================================"
echo ""

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "Inicio: $TIMESTAMP"
echo ""

# Cambiar a directorio de scripts
cd "$(dirname "$0")" || exit 1

# Step 1
echo "📊 PASO 1: Analizando métricas de redes..."
node 1-analyze-metrics.js
if [ $? -eq 0 ]; then
  echo "✅ Métricas analizadas"
else
  echo "❌ Error en análisis de métricas"
  exit 1
fi
echo ""

# Step 2
echo "🎨 PASO 2: Analizando contenido..."
node 2-analyze-content.js
if [ $? -eq 0 ]; then
  echo "✅ Contenido analizado"
else
  echo "❌ Error en análisis de contenido"
  exit 1
fi
echo ""

# Step 3
echo "💡 PASO 3: Generando ideas..."
node 3-generate-ideas.js
if [ $? -eq 0 ]; then
  echo "✅ Ideas generadas"
else
  echo "❌ Error generando ideas"
  exit 1
fi
echo ""

# Step 4
echo "📈 PASO 4: Actualizando Google Sheet..."
node 4-update-sheet.js
if [ $? -eq 0 ]; then
  echo "✅ Sheet actualizado"
else
  echo "❌ Error actualizando sheet"
  exit 1
fi
echo ""

echo "========================================"
echo "✨ PIPELINE COMPLETADO EXITOSAMENTE"
echo "Fin: $(date +"%Y-%m-%d %H:%M:%S")"
echo ""
echo "📁 Reportes generados:"
ls -lh ../pipeline/reports/
echo ""
echo "💾 Ejecutando git commit..."
cd .. || exit 1
git add pipeline/reports/
git commit -m "pipeline: reportes generados $(date +%Y-%m-%d)" || true
git push || true

echo "✅ Todo completado"
