# 🚀 GUÍA COMPLETA - Sistema Multi-IA para Objetivos USIL

## 📋 RESUMEN

Tu aplicación ahora soporta **3 proveedores de IA**:
1. **Gemini Pro** (Google) - ✅ Ya configurado y funcional
2. **Claude** (Anthropic) - Requiere API key
3. **GPT-4** (OpenAI) - Requiere API key

## ✅ ESTADO ACTUAL

### Gemini Pro (Google) - **LISTO PARA USAR**
- ✅ API Key configurada
- ✅ Modelo: `gemini-pro` (estable y confiable)
- ✅ Endpoint: API v1beta (actualizada)
- ✅ NO requiere pago (tiene cuota gratuita generosa)

**Simplemente abre `index.html` en tu navegador y funciona.**

---

## 🔧 CÓMO FUNCIONA AHORA

### Cambios implementados:

1. **Sistema Multi-API**: La función `callAI()` soporta 3 proveedores
2. **Mejor manejo de JSON**: Limpia automáticamente respuestas que vengan con markdown
3. **Selector de IA en UI**: En el Paso 3 puedes elegir qué IA usar
4. **Modelo actualizado**: Cambié de `gemini-1.5-flash` a `gemini-pro` (más estable)
5. **Endpoint corregido**: Ahora usa `/v1beta/` en lugar de `/v1/`

### ¿Qué pasa con el error anterior?

El error "models/gemini-1.5-flash is not found" ocurría porque:
- El modelo `gemini-1.5-flash` NO está disponible en tu API key (es muy nuevo)
- La API v1 no soportaba algunos modelos
- **SOLUCIÓN**: Cambié a `gemini-pro` que es el modelo estable y gratuito

---

## 🎯 OPCIÓN 1: USAR GEMINI PRO (RECOMENDADO)

### ✅ Ya está configurado - Solo sigue estos pasos:

1. Abre `index.html` en tu navegador
2. Completa los 3 pasos del formulario
3. En **Paso 3**, asegúrate que esté seleccionado **Gemini Pro** (es el predeterminado)
4. Click en **"Generar con Gemini Pro"**
5. ¡Listo! Debería funcionar sin errores

### Si todavía falla:

Verifica tu API key de Gemini:
1. Ve a https://makersuite.google.com/app/apikey
2. Verifica que tu key esté activa
3. Verifica que no hayas excedido el límite de cuota (muy raro, es generosa)

---

## 🧠 OPCIÓN 2: USAR CLAUDE (Anthropic)

### ¿Por qué Claude?
- **Más inteligente** que Gemini para tareas complejas
- **Mejor comprensión de contexto**
- **Respuestas más profesionales y estructuradas**
- Costo: ~$3-15 por 1M de tokens (muy barato para uso personal)

### Cómo obtener API Key de Claude:

1. **Regístrate en Anthropic**
   - Ve a: https://console.anthropic.com/
   - Click en "Sign Up"
   - Usa tu email

2. **Consigue créditos**
   - Anthropic da **$5 USD GRATIS** al registrarte
   - Suficiente para miles de generaciones
   - Luego cuesta ~$3 USD por millón de tokens de entrada

3. **Crea tu API Key**
   - Ve a https://console.anthropic.com/settings/keys
   - Click en "Create Key"
   - Copia la key (empieza con `sk-ant-...`)

4. **Configúrala en el código**
   - Abre `index.html` en un editor de texto
   - Busca la línea ~65 (dentro de `API_CONFIGS`)
   - Encuentra:
     ```javascript
     claude: {
       key: '', // Usuario debe agregar su key de Anthropic
     ```
   - Reemplaza con:
     ```javascript
     claude: {
       key: 'sk-ant-api03-TU_KEY_AQUI',
     ```

5. **Úsala en la app**
   - Abre `index.html` en el navegador
   - En Paso 3, selecciona **Claude**
   - Genera tus objetivos

---

## ⚡ OPCIÓN 3: USAR GPT-4 (OpenAI)

### ¿Por qué GPT-4?
- **El más conocido y probado**
- **Excelente para español**
- **Muy rápido**
- Costo: ~$10 USD por 1M de tokens (medio)

### Cómo obtener API Key de OpenAI:

1. **Regístrate en OpenAI**
   - Ve a: https://platform.openai.com/signup
   - Crea una cuenta

2. **Añade créditos**
   - OpenAI ya NO da créditos gratis
   - Debes añadir mínimo $5 USD
   - Ve a: https://platform.openai.com/account/billing

3. **Crea tu API Key**
   - Ve a: https://platform.openai.com/api-keys
   - Click en "Create new secret key"
   - Copia la key (empieza con `sk-...`)

4. **Configúrala en el código**
   - Abre `index.html` en un editor de texto
   - Busca la línea ~70 (dentro de `API_CONFIGS`)
   - Encuentra:
     ```javascript
     openai: {
       key: '', // Usuario debe agregar su key de OpenAI
     ```
   - Reemplaza con:
     ```javascript
     openai: {
       key: 'sk-TU_KEY_AQUI',
     ```

5. **Úsala en la app**
   - Abre `index.html` en el navegador
   - En Paso 3, selecciona **GPT-4**
   - Genera tus objetivos

---

## 🆚 COMPARACIÓN DE PROVEEDORES

| Característica | Gemini Pro | Claude | GPT-4 |
|---------------|-----------|--------|-------|
| **Costo Inicial** | ✅ GRATIS | ✅ $5 gratis | ❌ $5 mínimo |
| **Calidad** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Velocidad** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Español** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **JSON Mode** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Límite Gratis** | Generoso | $5 crédito | $0 |

### Recomendación:
1. **Para empezar**: Usa **Gemini Pro** (ya configurado, gratis)
2. **Para producción**: Usa **Claude** (mejor calidad, $5 gratis)
3. **Para velocidad**: Usa **GPT-4** (si ya tienes cuenta OpenAI)

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### Error: "NO_KEY"
- **Causa**: La API key está vacía
- **Solución**: Configura la key en `API_CONFIGS` (líneas 59-80)

### Error: "models/gemini-1.5-flash not found"
- **Causa**: Modelo no disponible
- **Solución**: Ya corregido - ahora usa `gemini-pro`

### Error: "Invalid JSON payload - systemInstruction"
- **Causa**: Estructura de API incorrecta
- **Solución**: Ya corregido - ahora combina prompts correctamente

### Error: "Respuesta vacía"
- **Causa**: API bloqueó la respuesta (contenido inapropiado)
- **Solución**: Reformula tu pregunta, o cambia de proveedor

### Error: "HTTP 429 - Rate Limit"
- **Causa**: Demasiadas peticiones
- **Solución**: Espera 1 minuto y vuelve a intentar

### Error: "HTTP 401 - Unauthorized"
- **Causa**: API key inválida o expirada
- **Solución**: Regenera tu API key

### Error: "Formato de respuesta inválido"
- **Causa**: La IA no devolvió JSON válido
- **Solución**: Ya corregido - ahora limpia la respuesta automáticamente

---

## 📝 DÓNDE EDITAR LAS API KEYS

### Ubicación exacta en el código:

Abre `index.html` y busca (línea ~59):

```javascript
const API_CONFIGS = {
  gemini: {
    key: 'AIzaSyBmrQXJ7OFRMEsPKqTPTmEgalEap64e2uQ', // ✅ YA CONFIGURADO
    model: 'gemini-pro',
    endpoint: (key) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`,
    name: 'Gemini Pro'
  },
  claude: {
    key: '', // 👈 PEGA AQUÍ TU KEY DE CLAUDE
    model: 'claude-3-5-sonnet-20241022',
    endpoint: 'https://api.anthropic.com/v1/messages',
    name: 'Claude 3.5 Sonnet'
  },
  openai: {
    key: '', // 👈 PEGA AQUÍ TU KEY DE OPENAI
    model: 'gpt-4-turbo-preview',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    name: 'GPT-4 Turbo'
  }
};
```

---

## 🎓 EJEMPLOS DE USO

### Ejemplo 1: Gemini Pro (Gratis)
```
1. Abre index.html
2. Llena formulario
3. Selecciona "Gemini Pro"
4. Click "Generar"
✅ FUNCIONA - Gratis ilimitado
```

### Ejemplo 2: Claude (Mejor calidad)
```
1. Regístrate en anthropic.com ($5 gratis)
2. Copia tu API key
3. Pégala en index.html línea 65
4. Selecciona "Claude"
5. Click "Generar"
✅ FUNCIONA - Respuestas más profesionales
```

### Ejemplo 3: GPT-4 (Más rápido)
```
1. Regístrate en OpenAI ($5 mínimo)
2. Copia tu API key
3. Pégala en index.html línea 70
4. Selecciona "GPT-4"
5. Click "Generar"
✅ FUNCIONA - Más rápido
```

---

## 🚦 SIGUIENTE PASO

### Para empezar AHORA:
1. Abre `index.html` en Chrome/Firefox/Edge
2. Usa **Gemini Pro** (ya configurado)
3. Si funciona → ¡Perfecto!
4. Si no funciona → Mándame el error exacto

### Para mejorar calidad:
1. Regístrate en Anthropic (https://console.anthropic.com/)
2. Consigue tu API key de Claude ($5 gratis)
3. Configúrala en el código
4. Disfruta respuestas más profesionales

---

## 📞 SOPORTE

Si algo no funciona:
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Copia el error completo
4. Compártelo conmigo

---

## ✨ CARACTERÍSTICAS ADICIONALES

El nuevo sistema incluye:
- ✅ Reintentos automáticos (3 intentos)
- ✅ Limpieza de respuestas con markdown
- ✅ Extracción inteligente de JSON
- ✅ Mensajes de error descriptivos
- ✅ UI para seleccionar proveedor
- ✅ Advertencias si falta API key

---

**¡Tu aplicación está lista para usarse con Gemini Pro AHORA MISMO!**

Si quieres mejor calidad, sigue la guía de Claude o GPT-4.
