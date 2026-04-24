# 🚀 GUÍA COMPLETA - API KEY DE GROQ (100% GRATIS)

## ✅ **TU APP USA SOLO GROQ (GRATIS PARA SIEMPRE)**

Tu aplicación ahora está **simplificada**:
- ✅ Solo usa **Groq** (IA ultra rápida)
- ✅ **100% GRATIS** - Sin tarjeta de crédito
- ✅ **Sin límites** de costo
- ✅ **Sin selección de modelos** - El usuario final no ve nada técnico

---

## 📝 **PASO 1: OBTENER TU API KEY DE GROQ**

### 🔗 **1.1 Ir a Groq Console**

Ve a: **https://console.groq.com**

### 👤 **1.2 Crear cuenta (GRATIS - Sin tarjeta)**

1. Click en **"Sign Up"** (Registrarse)
2. Opciones:
   - **Con Google**: Click en "Continue with Google"
   - **Con Email**: Ingresa tu email y contraseña

3. **NO necesitas tarjeta de crédito** ✅
4. Confirma tu email si es necesario

### 🔑 **1.3 Crear API Key**

1. Una vez dentro, ve a: **https://console.groq.com/keys**
2. O navega: Menú lateral → **"API Keys"**

3. Click en **"Create API Key"**

4. Te aparecerá:
   ```
   Name: (opcional)
   [Create API Key]
   ```

5. Click **"Create API Key"**

6. **COPIA LA KEY** (empieza con `gsk_...`)
   ```
   gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

7. ⚠️ **IMPORTANTE**: Guárdala, solo se muestra una vez

---

## 🔧 **PASO 2: CONFIGURAR EN TU APLICACIÓN**

### 📂 **2.1 Abrir el archivo**

1. Ve a tu carpeta:
   ```
   C:\Users\jlopezp\OneDrive - Universidad San Ignacio de Loyola (1)\Desktop\ARCHI
   ```

2. **Botón derecho** en `index.html`

3. **"Abrir con"** → Elige:
   - **Bloc de notas** (Windows)
   - **Notepad++** (si lo tienes)
   - **Visual Studio Code** (si lo tienes)
   - Cualquier editor de texto

### 📝 **2.2 Encontrar la línea correcta**

1. Presiona **Ctrl + F** (Buscar)

2. Busca: `GROQ_API_KEY`

3. Encontrarás (línea ~60):
   ```javascript
   // API KEY DE GROQ (100% GRATIS - Obtén en console.groq.com)
   const GROQ_API_KEY = ''; // 👈 PEGA AQUÍ TU API KEY DE GROQ
   ```

### ✏️ **2.3 Pegar tu API Key**

Cambia de:
```javascript
const GROQ_API_KEY = ''; // Vacío
```

A:
```javascript
const GROQ_API_KEY = 'gsk_TU_KEY_COMPLETA_AQUI';
```

**Ejemplo real:**
```javascript
const GROQ_API_KEY = 'gsk_ABC123xyz789EJEMPLO';
```

### 💾 **2.4 Guardar**

1. Presiona **Ctrl + S** (Guardar)
2. Cierra el editor

---

## 🎯 **PASO 3: PROBAR TU APLICACIÓN**

### 🌐 **3.1 Abrir en el navegador**

1. **Doble click** en `index.html`
2. Se abrirá en tu navegador predeterminado

### 📋 **3.2 Completar el formulario**

**PASO 1: Tu Puesto Actual**
```
Nombre del Puesto: Ej. "Analista de Datos"
Área o Unidad: Ej. "Business Intelligence"
Responsabilidades: Ej. "Creo dashboards en Power BI, analizo KPIs de ventas"
[Siguiente →]
```

**PASO 2: Prioridades del Año**
```
¿Qué espera el área de ti este año?: Ej. "Reducir tiempo de reportes en 50%"
KPIs que gestionas: Ej. "Tiempo de entrega, precisión de datos"
[Siguiente →]
```

**PASO 3: Autonomía y Mejora**
```
Brechas u oportunidades: Ej. "No tengo automatizados los reportes mensuales"
[⚡ Generar 5 Objetivos con IA]
```

### ⏱️ **3.3 Esperar generación (10-15 segundos)**

- Verás: "Generando con IA..." 🔄
- Groq es **MUY rápido** (el más rápido del mercado)
- Espera que aparezcan tus 5 objetivos

### ✅ **3.4 Resultado**

Verás algo como:
```
✓ Objetivo 1 (KPI Principal)
  Reducir el tiempo promedio de entrega de reportes ejecutivos...
  
  KPI Personal: Tiempo promedio de entrega
  Meta Final: 1.5 días
  
  [Plan Individual ✦] [Riesgos ✦]

✓ Objetivo 2 (KPI Secundario)
  ...

(3 objetivos más)
```

---

## 🛠️ **SOLUCIÓN DE PROBLEMAS**

### ❌ **Error: "FALTA_API_KEY"**

**Causa:** No configuraste la API key

**Solución:**
1. Abre `index.html` en un editor de texto
2. Busca `GROQ_API_KEY`
3. Pega tu key entre las comillas: `'gsk_...'`
4. Guarda (Ctrl + S)
5. Recarga la página en el navegador (F5)

---

### ❌ **Error: "HTTP 401" o "Unauthorized"**

**Causa:** API key inválida o mal copiada

**Solución:**
1. Verifica que copiaste la key **completa**
2. Debe empezar con `gsk_`
3. No debe tener espacios al inicio o final
4. Si ya no la tienes, crea una nueva en console.groq.com/keys

**Ejemplo CORRECTO:**
```javascript
const GROQ_API_KEY = 'gsk_ABC123xyz789';
```

**Ejemplo INCORRECTO:**
```javascript
const GROQ_API_KEY = ' gsk_ABC123xyz789 '; // ❌ Espacios
const GROQ_API_KEY = 'gsk_ABC123xyz789"';   // ❌ Comilla extra
const GROQ_API_KEY = 'gsk_ABC';              // ❌ Key incompleta
```

---

### ❌ **Error: "HTTP 429" o "Rate limit exceeded"**

**Causa:** Demasiadas peticiones (muy raro con Groq)

**Solución:**
1. Espera **30 segundos**
2. Intenta de nuevo
3. Groq tiene límites muy generosos (no debería pasar)

---

### ❌ **No aparece nada al generar**

**Causa:** Error de JavaScript

**Solución:**
1. Presiona **F12** en el navegador
2. Ve a la pestaña **"Console"**
3. Busca mensajes de error en **rojo**
4. Copia TODO el error
5. Compártelo conmigo

---

### ❌ **Los objetivos no son buenos**

**Causa:** Falta de contexto en el formulario

**Solución:**
1. Llena el formulario con **MÁS detalle**
2. Sé **específico** en responsabilidades
3. Menciona **números** y **métricas** concretas
4. Lista **procesos** específicos que haces

**Ejemplo BUENO:**
```
Responsabilidades: 
"Ejecuto el proceso de conciliación bancaria diaria de 15 cuentas. 
Gestiono el flujo de caja semanal proyectando ingresos y egresos. 
Coordino pagos a proveedores por $2M mensuales."
```

**Ejemplo MALO:**
```
Responsabilidades: "Hago cosas de finanzas"
```

---

## 💡 **CARACTERÍSTICAS DE GROQ**

### ✅ **Ventajas**

| Característica | Groq |
|---------------|------|
| **Costo** | ✅ 100% GRATIS |
| **Velocidad** | ⚡ Ultra rápido (el más rápido) |
| **Calidad** | ⭐⭐⭐⭐ Muy buena |
| **Límites** | 🎁 Generosos |
| **Tarjeta** | ❌ NO necesita |
| **Modelo** | 🦙 Llama 3.3 70B |

### 📊 **Límites gratuitos (muy generosos)**

- **30 requests por minuto**
- **14,400 tokens por minuto**
- Suficiente para **cientos de generaciones diarias**

Para tu uso (analizar y dar recomendaciones), **NUNCA llegarás al límite**.

---

## 🎓 **EJEMPLO COMPLETO DE USO**

### **Entrada del formulario:**

```
PASO 1:
- Puesto: Coordinador de Marketing Digital
- Área: Marketing
- Responsabilidades: Gestiono redes sociales, creo contenido, 
  coordino campañas paid ads con presupuesto de S/ 8,000 mensual

PASO 2:
- Prioridades: Aumentar leads calificados 40%, mejorar engagement 25%
- KPIs: Engagement rate, CTR, costo por lead, conversión

PASO 3:
- Brechas: No tengo calendario de contenidos estructurado, 
  no mido sentiment analysis, campañas A/B sin proceso documentado
```

### **Resultado generado por Groq:**

```
✅ Objetivo 1 (KPI Principal)
Aumentar la tasa de conversión de landing pages a formulario en 25% 
(de 8% a 10%) para Q3 mediante optimización de copy, CTA y diseño.

KPI Personal: Conversion rate landing → form
Meta Final: 10%

✅ Objetivo 2 (KPI Secundario)
Reducir el costo por lead de S/ 45 a S/ 32 mediante implementación 
de A/B testing documentado y optimización de audiencias.

KPI Personal: Cost per lead
Meta Final: S/ 32

... (3 objetivos más)
```

---

## 📞 **¿NECESITAS AYUDA?**

### 🆘 **Si algo no funciona:**

1. **Revisa esta guía** paso por paso
2. **Verifica tu API key**:
   - Está en `index.html` línea ~60
   - Empieza con `gsk_`
   - Está entre comillas `'...'`
   - No tiene espacios extra

3. **Abre la consola** (F12):
   - Busca errores en rojo
   - Copia TODO el mensaje
   - Compártelo conmigo

4. **Toma capturas**:
   - Del error
   - De tu código (línea de la API key, OCULTA los últimos caracteres)
   - De la consola

---

## 🚀 **RESUMEN RÁPIDO**

```
1. Ve a console.groq.com
2. Regístrate GRATIS (sin tarjeta)
3. Crea API Key en /keys
4. Copia la key (gsk_...)
5. Abre index.html en editor
6. Busca GROQ_API_KEY
7. Pega tu key: const GROQ_API_KEY = 'gsk_...'
8. Guarda (Ctrl + S)
9. Abre index.html en navegador
10. Llena formulario
11. Click "Generar 5 Objetivos con IA"
12. ✅ Listo!
```

---

## 🎯 **LO QUE CAMBIÓ**

### ❌ **ANTES:**
- Múltiples opciones de IA
- Selector visible al usuario
- Algunas APIs de pago
- Configuración compleja

### ✅ **AHORA:**
- Solo Groq (100% gratis)
- Sin selector (oculto al usuario)
- Todo gratis
- Configuración simple (1 línea)

---

## 🌟 **POR QUÉ GROQ ES PERFECTO PARA TI**

1. **100% Gratis** → No pagas nada nunca
2. **Sin tarjeta** → Solo email para registrarte
3. **Ultra rápido** → Respuestas en 2-3 segundos
4. **Buena calidad** → Usa Llama 3.3 (modelo excelente)
5. **Límites generosos** → Nunca los alcanzarás con tu uso
6. **Simple** → Una sola API key, una sola configuración

---

## ✅ **TU PRÓXIMO PASO**

### **AHORA MISMO:**

1. Ve a **https://console.groq.com**
2. Regístrate (**1 minuto**)
3. Crea API Key (**30 segundos**)
4. Configúrala en `index.html` (**30 segundos**)
5. **¡Prueba tu app!**

**Total: 2 minutos para tener tu app funcionando** ⚡

---

**Tu aplicación está lista. Solo necesitas la API key de Groq (100% gratis).**

**¡Empieza ahora!** 🚀
