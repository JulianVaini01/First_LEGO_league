# 🏆 First LEGO League - Sistema de Puntuación

Sistema de puntuación en tiempo real para competencias de First LEGO League.

## 🌐 Sitio en Vivo

**URL:** https://julianvaini01.github.io/First_LEGO_league/

## ✨ Características

- 📊 Sistema de puntuación en tiempo real
- 🏅 Clasificación automática de equipos
- 📱 Diseño responsive y moderno
- ⚡ Actualización automática cada 3 segundos
- 🔒 Base de datos segura con Supabase
- 🎯 Suma las mejores 3 rondas de cada equipo

## 🚀 Desplegar Cambios

### Opción 1: Script Automático
```bash
chmod +x deploy.sh
./deploy.sh
```

### Opción 2: Comandos Manuales
```bash
npm run build
rm -rf docs/*
cp -r dist/* docs/
git add .
git commit -m "Actualizar build"
git push
```

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📦 Tecnologías

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (Base de datos)
- Lucide React (Iconos)

## 📝 Configuración

Las credenciales de Supabase están en el archivo `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📖 Documentación Completa

Ver [INSTRUCCIONES_DEPLOY.md](./INSTRUCCIONES_DEPLOY.md) para información detallada sobre el despliegue.
