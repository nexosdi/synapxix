# 🎨 Guía de Preview de Temas de Keycloak

Esta guía te ayudará a previsualizar y probar los temas de Keycloak en tiempo real antes de cargarlos al servidor.

## 📋 Componentes Creados

Se han creado dos componentes de preview:

1. **`LoginPreviewComponent`** - Preview del tema de login
2. **`RegisterPreviewComponent`** - Preview del tema de registro

## 🚀 Cómo Usar

### 1. Acceder a los Previews

Con el servidor de desarrollo corriendo (`npx nx serve admin-frontend`), navega a:

- **Login Preview**: `http://localhost:4200/login-preview`
- **Register Preview**: `http://localhost:4200/register-preview`

### 2. Probar Funcionalidades

**En Login Preview:**

- ✅ Botón del ojo para mostrar/ocultar contraseña
- ✅ Validación HTML5 de campos requeridos
- ✅ Botón de Google (placeholder)
- ✅ Mensaje de error simulado al enviar
- ✅ Link para ir al registro

**En Register Preview:**

- ✅ Botones del ojo en ambos campos de contraseña
- ✅ Validación HTML5 de todos los campos
- ✅ Validación de longitud mínima (8 caracteres)
- ✅ Mensaje de éxito simulado al enviar
- ✅ Link para volver al login

### 3. Hacer Cambios en Vivo

Los archivos de preview están en:

```
apps/admin-frontend/src/app/
├── login-preview/
│   ├── login-preview.component.ts
│   ├── login-preview.component.html  ← Edita aquí para cambios de diseño
│   └── login-preview.component.css
└── register-preview/
    ├── register-preview.component.ts
    ├── register-preview.component.html  ← Edita aquí para cambios de diseño
    └── register-preview.component.css
```

**Hot Reload**: Los cambios se reflejarán automáticamente en el navegador.

## 🔄 Workflow Recomendado

### Paso 1: Diseñar en Preview

1. Abre `http://localhost:4200/login-preview` o `register-preview`
2. Edita los archivos `.html` y `.css` de los componentes
3. Observa los cambios en tiempo real
4. Ajusta hasta que te guste el diseño

### Paso 2: Copiar a Keycloak

Una vez que el diseño esté perfecto:

1. **Para Login**: Copia el HTML de `login-preview.component.html` a `keycloak-theme/login/login.ftl`
2. **Para Register**: Copia el HTML de `register-preview.component.html` a `keycloak-theme/login/register.ftl`

**⚠️ IMPORTANTE**: Al copiar, debes convertir la sintaxis de Angular a FreeMarker:

#### Conversiones Necesarias

**Angular → FreeMarker:**

```html
<!-- Angular -->
*ngIf="message.summary" [ngClass]="message.type === 'error' ? '...' : '...'" (click)="togglePassword()" [type]="showPassword ? 'text' : 'password'"

<!-- FreeMarker -->
<#if message?has_content> class="${message.type == 'error'?then('...', '...')}" onclick="togglePassword('password', this)" type="password"
```

### Paso 3: Agregar Lógica FTL

Después de copiar el HTML, agrega:

1. **Imports y Layout**:

```ftl
<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    <#if section = "form">
    <!-- Tu HTML aquí -->
    </#if>
</@layout.registrationLayout>
```

2. **Variables de Keycloak**:

   - `${url.loginAction}` - URL del formulario
   - `${(login.username!'')}` - Valor del usuario
   - `${message.summary?no_esc}` - Mensajes de error
   - `${url.registrationUrl}` - URL de registro
   - etc.

3. **Script de Toggle Password**:

```javascript
<script>
    function togglePassword(inputId, button) {
        const input = document.getElementById(inputId);
        const eyeOpen = button.querySelector('.eye-open');
        const eyeClosed = button.querySelector('.eye-closed');

        if (input.type === 'password') {
            input.type = 'text';
            eyeOpen.classList.add('hidden');
            eyeClosed.classList.remove('hidden');
        } else {
            input.type = 'password';
            eyeOpen.classList.remove('hidden');
            eyeClosed.classList.add('hidden');
        }
    }
</script>
```

### Paso 4: Probar en Keycloak

1. Copia la carpeta `keycloak-theme` al servidor Keycloak
2. Reinicia Keycloak o limpia el caché de temas
3. Selecciona el tema en Realm Settings
4. Prueba el login/registro real

## 🎨 Personalización del Logo

Para agregar tu logo en el futuro:

1. Coloca `logo.png` en `keycloak-theme/login/resources/img/`
2. En los archivos FTL, reemplaza el SVG con:

```html
<img src="${url.resourcesPath}/img/logo.png" alt="Synapxix" class="h-8 w-8" />
```

## 📝 Notas Importantes

- Los componentes de preview son **solo para diseño visual**
- No tienen integración real con Keycloak
- Los mensajes de error/éxito son simulados
- El botón de Google es un placeholder

## 🐛 Troubleshooting

**Problema**: Los cambios no se reflejan

- **Solución**: Asegúrate de que el servidor de desarrollo esté corriendo

**Problema**: Estilos no se ven correctamente

- **Solución**: Verifica que Tailwind CSS esté configurado en `tailwind.config.js`

**Problema**: Iconos Material Symbols no aparecen

- **Solución**: Verifica que la fuente esté importada en `index.html`

## ✅ Checklist de Transferencia

Antes de copiar a Keycloak, verifica:

- [ ] El diseño se ve perfecto en el preview
- [ ] Todos los botones funcionan correctamente
- [ ] La validación de formularios funciona
- [ ] El diseño es responsive (prueba en móvil)
- [ ] Los colores y tipografía son correctos
- [ ] El logo placeholder está en su lugar

¡Listo! Ahora puedes diseñar tus temas de Keycloak con confianza y velocidad. 🚀
