#!/bin/bash

# Script para desplegar a GitHub Pages
echo "🚀 Desplegando a GitHub Pages..."

# 1. Construir el proyecto
echo "📦 Construyendo el proyecto..."
npm run build

# 2. Limpiar la carpeta docs
echo "🧹 Limpiando carpeta docs..."
rm -rf docs/*

# 3. Copiar el nuevo build
echo "📂 Copiando archivos..."
cp -r dist/* docs/

# 4. Agregar cambios a git
echo "✨ Agregando cambios a git..."
git add .

# 5. Confirmar cambios
echo "💾 Confirmando cambios..."
git commit -m "Actualizar build para GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"

# 6. Subir a GitHub
echo "⬆️  Subiendo a GitHub..."
git push

echo "✅ ¡Despliegue completado!"
echo "🌐 Tu sitio estará disponible en: https://julianvaini01.github.io/First_LEGO_league/"
