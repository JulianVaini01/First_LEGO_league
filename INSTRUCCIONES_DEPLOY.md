# 📋 Instrucciones para Desplegar a GitHub Pages

## ✅ La Base de Datos Funcionará Perfectamente

Tu aplicación usa **Supabase** que está en la nube, por lo que funcionará desde cualquier dominio:
- ✅ GitHub Pages (https://julianvaini01.github.io/First_LEGO_league/)
- ✅ Localhost (http://localhost:5173)
- ✅ Cualquier otro hosting

Las credenciales de Supabase están en tu archivo `.env` y se incluyen en el build.

---

## 🚀 Opción 1: Usar el Script Automático (Recomendado)

En tu terminal, en la carpeta del proyecto, ejecuta:

```bash
chmod +x deploy.sh
./deploy.sh
```

Este script hará TODO automáticamente:
1. Construir el proyecto
2. Limpiar la carpeta docs
3. Copiar los archivos
4. Hacer commit
5. Subir a GitHub

---

## 🔧 Opción 2: Comandos Manuales

Si prefieres hacerlo paso por paso:

```bash
# 1. Construir el proyecto
npm run build

# 2. Limpiar y copiar
rm -rf docs/*
cp -r dist/* docs/

# 3. Subir a GitHub
git add .
git commit -m "Actualizar build para GitHub Pages"
git push
```

---

## 🌐 Verificar el Despliegue

1. Ve a tu repositorio en GitHub: https://github.com/julianvaini01/First_LEGO_league
2. Ve a **Settings** → **Pages**
3. Verifica que esté configurado para usar la carpeta `docs` de la rama `main`
4. Tu sitio estará en: https://julianvaini01.github.io/First_LEGO_league/

---

## 📝 Cambios Incluidos en Esta Actualización

### ✅ Pantalla de Puntuación Mejorada
- Muestra todos los equipos en una tabla ordenada
- Calcula automáticamente el total sumando las **mejores 3 rondas** de cada equipo
- Cada equipo aparece en **una sola fila** con su total acumulado
- Actualización automática cada 3 segundos
- Medallas para los primeros 3 lugares
- Muestra: posición, código, nombre, rondas jugadas, mejor ronda y total

### ✅ Conexión con Supabase
- La aplicación se conecta a la base de datos de Supabase
- Funciona desde cualquier dominio (GitHub Pages, localhost, etc.)
- Datos en tiempo real para todos los usuarios

---

## ⚠️ Importante

- NO necesitas configurar nada adicional en GitHub
- La base de datos Supabase funcionará automáticamente
- Los datos se mantendrán sincronizados en tiempo real
- Todos los usuarios verán la misma información actualizada

---

## 🆘 Solución de Problemas

### Si no funciona la base de datos:
1. Verifica que el archivo `.env` esté en la carpeta del proyecto
2. Asegúrate de que contenga las variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Si GitHub Pages no se actualiza:
1. Espera 1-2 minutos (GitHub tarda en procesar los cambios)
2. Limpia el caché de tu navegador (Ctrl + F5)
3. Verifica que los archivos estén en la carpeta `docs` del repositorio
