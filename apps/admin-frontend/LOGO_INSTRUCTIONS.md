# Instrucciones para agregar el logo de Synapsis

## Ubicación del logo

Para que el logo aparezca correctamente en la pantalla de login, debes colocar tu archivo de logo en:

```
apps/admin-frontend/src/assets/logo.png
```

## Formatos soportados

Puedes usar cualquiera de estos formatos:

- `logo.png` (recomendado para transparencia)
- `logo.svg` (ideal para escalabilidad)
- `logo.jpg` / `logo.jpeg`
- `logo.webp`

## Tamaños recomendados

- **Tamaño ideal**: 500x500 píxeles
- **Formato cuadrado** funciona mejor
- **Fondo transparente** (PNG o SVG) para mejor apariencia

## Si usas otro nombre de archivo

Si tu logo tiene un nombre diferente (por ejemplo `synapsis-logo.png`), actualiza la línea 31 en `login.component.ts`:

```typescript
<img src="assets/synapsis-logo.png" alt="Synapsis Logo" class="logo">
```

## Fallback

Si no colocas ningún logo, se mostrará automáticamente un placeholder colorido con la letra "S" de Synapsis.
