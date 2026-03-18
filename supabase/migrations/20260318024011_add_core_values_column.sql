/*
  # Agregar columna Core Values a la tabla teams
  
  1. Cambios
    - Se agrega columna `core_values` a la tabla `teams`
    - Esta columna almacenará la evaluación de Core Values (1-4)
    - Valores posibles: 1=Básico, 2=En desarrollo, 3=Cumplido, 4=Superado
    - No afecta el ranking general, solo se almacena para referencia
  
  2. Notas
    - La columna es opcional (nullable) ya que puede no estar completada aún
    - Se guarda como integer para facilitar consultas y ordenamiento
*/

-- Agregar columna core_values a la tabla teams si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teams' AND column_name = 'core_values'
  ) THEN
    ALTER TABLE teams ADD COLUMN core_values integer;
  END IF;
END $$;