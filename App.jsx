import React, { useMemo, useState, useEffect } from 'https://esm.sh/react@18.3.1';
// URL del Apps Script WebApp para guardar en Google Sheets
const SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbydZv701e88_LK56jcse01oE_dw2zVOFL7QF8rwaYYbAhRLhSXh719vEAPM9ITiAiax7Q/exec";
// Convierte los datos del usuario y los objetivos a un array plano para Sheets
function buildSheetRow(userData, goals) {
  const base = [
    userData.fullName || "",
    userData.dni || "",
    userData.role || "",
    userData.area || "",
    userData.responsibilities || "",
    userData.businessPriorities || "",
    userData.kpis || "",
    userData.gaps || ""
  ];
  // Para cada objetivo, agrega sus campos en orden
  for (let i = 0; i < 5; i++) {
    const g = goals[i] || {};
    base.push(
      g.typeId || "",
      g.description || "",
      g.indicator || "",
      g.target || "",
      g.measurementType || "",
      g.deadline || "",
      g.justification || ""
    );
  }
  return base;
}
// Envía los datos a Google Sheets vía fetch
async function sendToSheets(userData, goals, setError, setSuccess) {
  try {
    const row = buildSheetRow(userData, goals);
    const res = await fetch(SHEETS_WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ row })
    });
    const data = await res.json();
    if (data.success) {
      setSuccess("¡Datos enviados correctamente a Google Sheets!");
      setError(null);
    } else {
      setError("Error al guardar en Sheets: " + (data.error || ""));
      setSuccess(null);
    }
  } catch (err) {
    setError("Error de red o formato: " + err.message);
    setSuccess(null);
  }
}
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import {
  Target,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  TrendingUp,
  Zap,
  ClipboardCheck,
  Rocket,
  Edit3,
  RefreshCw,
  Save,
  ListChecks,
  X,
  ShieldAlert,
  UserCheck,
} from 'https://esm.sh/lucide-react@0.542.0';

const API_KEY_STORAGE = 'ai_api_key';

const GOAL_TYPES = [
  {
    id: 'primary_kpi',
    label: 'Objetivo de resultados (KPI principal del puesto)',
    icon: Target,
    description: 'El indicador mas critico de tu exito en tu puesto actual.',
  },
  {
    id: 'secondary_kpi',
    label: 'Objetivo de resultados (KPI secundario)',
    icon: TrendingUp,
    description: 'Metrica de apoyo que depende directamente de tu gestion.',
  },
  {
    id: 'improvement',
    label: 'Objetivo de mejora (basado en brechas de desempeno)',
    icon: AlertCircle,
    description: 'Cierre de brechas de desempeno detectadas en tu ejecucion.',
  },
  {
    id: 'efficiency',
    label: 'Objetivo de eficiencia o mejora continua',
    icon: Zap,
    description: 'Optimizacion de procesos dentro de tu campo de accion.',
  },
  {
    id: 'project',
    label: 'Objetivo de proyecto, entregable o impacto (segun el rol)',
    icon: Rocket,
    description: 'Entregable estrategico que lideras este ano.',
  },
];

const CORPORATE_LOGO_SRC = './assets/usil-corporacion-logo.png';


// Detecta si la key es de Groq o Gemini
function getApiProvider(key) {
  if (!key) return 'none';
  // Groq: gsk_... o sk-... (ambos posibles)
  if (key.startsWith('gsk_') || key.startsWith('sk-')) return 'groq';
  return 'gemini';
}

function buildEndpoint(key) {
  const provider = getApiProvider(key);
  if (provider === 'groq') {
    // Si estamos en navegador, usar proxy CORS
    if (typeof window !== 'undefined') {
      return 'https://corsproxy.io/?https://api.groq.com/openai/v1/chat/completions';
    }
    return 'https://api.groq.com/openai/v1/chat/completions';
  }
  // Gemini por defecto
  const baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent';
  return `${baseUrl}?key=${encodeURIComponent(key.trim())}`;
}

const normalizeInsight = (rawText) => {
  const safeText = String(rawText || '')
    .replace(/\r\n/g, '\n')
    .trim();

  if (!safeText) {
    return [{ type: 'paragraph', content: 'No se recibio contenido para mostrar.' }];
  }

  const lines = safeText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks = [];
  let paragraphBuffer = [];
  let listBuffer = [];
  let listType = null;

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;
    blocks.push({ type: 'paragraph', content: paragraphBuffer.join(' ') });
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (!listBuffer.length) return;
    blocks.push({ type: listType, items: [...listBuffer] });
    listBuffer = [];
    listType = null;
  };

  for (const line of lines) {
    const numbered = line.match(/^\d+[.)-]?\s+(.*)$/);
    const bulleted = line.match(/^[-*]\s+(.*)$/);
    const heading = line.match(/^([A-Za-z0-9\s\-_/]{3,80}):$/);

    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', content: heading[1] });
      continue;
    }

    if (numbered) {
      flushParagraph();
      if (listType !== 'ordered') {
        flushList();
        listType = 'ordered';
      }
      listBuffer.push(numbered[1]);
      continue;
    }

    if (bulleted) {
      flushParagraph();
      if (listType !== 'unordered') {
        flushList();
        listType = 'unordered';
      }
      listBuffer.push(bulleted[1]);
      continue;
    }

    if (listType) {
      flushList();
    }

    paragraphBuffer.push(line.replace(/^\*\*(.*)\*\*$/, '$1'));
  }

  flushParagraph();
  flushList();

  return blocks.length
    ? blocks
    : [{ type: 'paragraph', content: safeText }];
};

const App = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  // Para evitar múltiples envíos automáticos
  const [autoSent, setAutoSent] = useState(false);
    // Enviar automáticamente al llegar a la vista final (step 4)
    useEffect(() => {
      if (step === 4 && goals.length > 0 && !autoSent) {
        sendToSheets(userData, goals, setError, setSuccess);
        setAutoSent(true);
      }
      if (step !== 4) {
        setAutoSent(false); // Permite reenviar si el usuario regresa y vuelve a avanzar
      }
    }, [step, goals, userData, autoSent]);
  const [userData, setUserData] = useState({
    fullName: '',
    dni: '',
    role: '',
    area: '',
    level: '',
    responsibilities: '',
    businessPriorities: '',
    strengths: '',
    gaps: '',
    kpis: '',
  });
  const [goals, setGoals] = useState([]);
  const [activeEditingIndex, setActiveEditingIndex] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [runtimeApiKey, setRuntimeApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [isApiKeySaved, setIsApiKeySaved] = useState(() => Boolean(localStorage.getItem(API_KEY_STORAGE)));

  const parsedInsight = useMemo(() => {
    if (!aiInsight?.content) return [];
    return normalizeInsight(aiInsight.content);
  }, [aiInsight]);


  // Llama a Gemini o Groq según la key
  const callAI = async (prompt, systemPrompt, responseSchema = null) => {
    let retries = 0;
    const maxRetries = 5;
    const delays = [1000, 2000, 4000, 8000, 16000];
    const provider = getApiProvider(runtimeApiKey);

    while (retries < maxRetries) {
      try {
        const endpoint = buildEndpoint(runtimeApiKey);
        if (!endpoint) throw new Error('API_KEY_MISSING');

        if (provider === 'groq') {
          // Formato OpenAI
          const payload = {
            model: 'openai/gpt-oss-120b', // Modelo Groq actualizado
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7
          };
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${runtimeApiKey}`
            },
            body: JSON.stringify(payload)
          });
          const data = await response.json();
          if (!response.ok) {
            // Mostrar mensaje de error real de Groq si existe
            const apiError = data?.error?.message || data?.error || 'API Error';
            throw new Error(apiError);
          }
          const text = data.choices?.[0]?.message?.content;
          if (!text) throw new Error('Respuesta vacia de IA');
          return text;
        } else {
          // Gemini
          const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
          };
          if (responseSchema) {
            payload.generationConfig = {
              responseMimeType: 'application/json',
              responseSchema,
            };
          }
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) throw new Error('API Error');
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) throw new Error('Respuesta vacia de IA');
          return responseSchema ? JSON.parse(text) : text;
        }
      } catch (err) {
        if (err.message === 'API_KEY_MISSING') throw err;
        if (retries === maxRetries - 1) throw err;
        await new Promise((res) => setTimeout(res, delays[retries]));
        retries += 1;
      }
    }
    throw new Error('No fue posible completar la llamada a IA');
  };

  const generateGoals = async () => {
    if (!runtimeApiKey.trim()) {
      setError('Ingresa tu API key de Gemini o Groq para generar recomendaciones personalizadas.');
      return;
    }

    setLoading(true);
    setError(null);

    const systemPrompt = `Actua como un experto en Gestion de Desempeno. Tu tarea es generar exactamente 5 objetivos SMART para el ANO actual.

REGLAS CRITICAS:
1. Prohibido incluir competencias (ej. "mejorar comunicacion"). Solo RESULTADOS.
2. Los objetivos deben ser: Especificos, Medibles, Alcanzables, Relevantes y con Tiempo definido.
3. REGLA DE ORO: Los objetivos deben depender 100% de la ejecucion del colaborador y estar dentro de su campo de accion directo. Evitar dependencias externas.
4. Usa un tono profesional y enfocado en el puesto actual.`;

    const schema = {
      type: 'OBJECT',
      properties: {
        goals: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              typeId: { type: 'STRING' },
              description: { type: 'STRING' },
              indicator: { type: 'STRING' },
              target: { type: 'STRING' },
              measurementType: { type: 'STRING' },
              deadline: { type: 'STRING' },
              justification: { type: 'STRING' },
            },
            required: [
              'typeId',
              'description',
              'indicator',
              'target',
              'measurementType',
              'deadline',
              'justification',
            ],
          },
        },
      },
      required: ['goals'],
    };

    const userPrompt = `Contexto: Puesto actual: ${userData.role}, Area: ${userData.area}, Responsabilidades directas: ${userData.responsibilities}, Prioridades del area para este ano: ${userData.businessPriorities}, Brechas de desempeno en su puesto actual: ${userData.gaps}, KPIs que gestiona directamente: ${userData.kpis}.`;

    try {
      const resultText = await callAI(userPrompt, systemPrompt, schema);
      // Si es JSON válido, lo parsea (Gemini), si es texto plano (Groq), intenta extraer objetivos
      let result = {};
      try {
        result = typeof resultText === 'string' ? JSON.parse(resultText) : resultText;
      } catch {
        // Si no es JSON, intentar parsear objetivos desde texto plano
        // (opcional: aquí puedes agregar lógica para extraer objetivos de texto si Groq responde en texto)
        result = { goals: [] };
      }
      setGoals(result.goals || []);
      setStep(4);
    } catch (err) {
      if (err.message === 'API_KEY_MISSING') {
        setError('Falta API key. Agregala y vuelve a intentar.');
      } else {
        setError('Error al conectar con la IA. Revisa tu API key o tu conexion e intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateActionPlan = async (index) => {
    if (!runtimeApiKey.trim()) {
      setError('Ingresa tu API key de Gemini o Groq para generar planes de accion.');
      return;
    }

    const goal = goals[index];
    setActionLoading(`plan-${index}`);
    setError(null);

    const systemPrompt =
      'Actua como coach de ejecucion. Genera un plan de 5 pasos, claro y ordenado. Usa secciones y lista numerada para facilitar lectura.';

    try {
      const content = await callAI(`Objetivo: ${goal.description}`, systemPrompt);
      setAiInsight({ title: 'Que acciones te ayudaran a alcanzar tu objetivo?', content, type: 'plan' });
    } catch (err) {
      setError('Error al generar el plan con IA.');
    } finally {
      setActionLoading(null);
    }
  };

  const analyzeRisks = async (index) => {
    if (!runtimeApiKey.trim()) {
      setError('Ingresa tu API key de Gemini o Groq para analizar riesgos.');
      return;
    }

    const goal = goals[index];
    setActionLoading(`risk-${index}`);
    setError(null);

    const systemPrompt =
      'Identifica 3 riesgos que impidan cumplir este objetivo y dependan de la gestion propia del colaborador. Devuelve cada riesgo con su mitigacion en formato ordenado.';

    try {
      const content = await callAI(`Objetivo: ${goal.description}`, systemPrompt);
      setAiInsight({ title: 'Que podria impedir que alcances tu objetivo?', content, type: 'risk' });
    } catch (err) {
      setError('Error al analizar riesgos con IA.');
    } finally {
      setActionLoading(null);
    }
  };

  const saveApiKey = () => {
    const cleanKey = runtimeApiKey.trim();
    if (!cleanKey) {
      localStorage.removeItem(API_KEY_STORAGE);
      setIsApiKeySaved(false);
      setError('La API key esta vacia. Ingresa una clave valida.');
      return;
    }

    localStorage.setItem(API_KEY_STORAGE, cleanKey);
    setRuntimeApiKey(cleanKey);
    setIsApiKeySaved(true);
    setError(null);
  };

  const updateGoal = (index, field, value) => {
    const newGoals = [...goals];
    newGoals[index][field] = value;
    setGoals(newGoals);
  };

  const renderInsightBlock = (block, idx) => {
    if (block.type === 'heading') {
      return (
        <h4 key={idx} className="text-sm font-extrabold text-slate-800 tracking-wide uppercase mt-4 first:mt-0">
          {block.content}
        </h4>
      );
    }

    if (block.type === 'ordered') {
      return (
        <ol key={idx} className="list-decimal pl-5 space-y-2 text-sm text-slate-700 marker:font-bold marker:text-blue-600">
          {block.items.map((item, itemIdx) => (
            <li key={`${idx}-${itemIdx}`} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ol>
      );
    }

    if (block.type === 'unordered') {
      return (
        <ul key={idx} className="list-disc pl-5 space-y-2 text-sm text-slate-700 marker:text-blue-600">
          {block.items.map((item, itemIdx) => (
            <li key={`${idx}-${itemIdx}`} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={idx} className="text-sm text-slate-700 leading-relaxed">
        {block.content}
      </p>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Target size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Objetivos USIL: Tu Ruta de Resultados</h1>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed text-lg font-medium">
              Crea metas SMART con IA para priorizar mejor y avanzar con foco en tu dia a dia
            </p>
            <button
              onClick={() => setStep(1)}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-blue-700 transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              Inicia aqui <ChevronRight size={20} />
            </button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Tu Puesto Actual</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombres y Apellidos</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Ej: Maria Fernanda Lopez Perez"
                  value={userData.fullName}
                  onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">DNI</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Ej: 12345678"
                  value={userData.dni}
                  onChange={(e) => setUserData({ ...userData, dni: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre Exacto del Puesto</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Ej: Analista Senior de Tesoreria"
                  value={userData.role}
                  onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Area</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Ej: Finanzas / Tesoreria"
                  value={userData.area}
                  onChange={(e) => setUserData({ ...userData, area: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tus Principales Funciones</label>
              <textarea
                rows="3"
                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Que procesos o entregables dependen exclusivamente de ti en tu puesto actual?"
                value={userData.responsibilities}
                onChange={(e) => setUserData({ ...userData, responsibilities: e.target.value })}
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Prioridades del Ano</h2>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Que debes lograr este ano para impulsar los objetivos del area?</label>
              <textarea
                rows="3"
                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Aterriza las metas globales a tu contribucion individual especifica..."
                value={userData.businessPriorities}
                onChange={(e) => setUserData({ ...userData, businessPriorities: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">KPIs Especificos de tu Puesto Actual</label>
              <input
                type="text"
                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Ej: Dias de mora, % de conciliacion, tiempo de cierre..."
                value={userData.kpis}
                onChange={(e) => setUserData({ ...userData, kpis: e.target.value })}
              />
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="text-gray-500 font-medium hover:text-gray-800">
                Atras
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <ClipboardCheck className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Autonomia y Mejora</h2>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <div className="flex gap-3">
                <UserCheck className="text-blue-600 shrink-0" size={20} />
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  <strong>Regla de Accion:</strong> Para que un objetivo sea valido, el resultado final debe depender de tus decisiones y esfuerzo. No incluyas metas que dependan de aprobaciones externas o de otros departamentos.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Oportunidades de Mejora en tu Gestion</label>
              <textarea
                rows="3"
                className="w-full p-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Que procesos bajo tu control directo podrias optimizar este ano?"
                value={userData.gaps}
                onChange={(e) => setUserData({ ...userData, gaps: e.target.value })}
              />
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="text-gray-500 font-medium hover:text-gray-800">
                Atras
              </button>
              <button
                onClick={generateGoals}
                disabled={loading}
                className="bg-blue-700 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
                {loading ? 'Disenando...' : 'Generar Mis 5 Objetivos del Ano'}
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" /> Plan de Desempeno {new Date().getFullYear()}
                </h2>
                <p className="text-xs text-gray-500 font-medium">Tus 5 objetivos SMART con IA, listos para revisar y personalizar</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {goals.map((goal, idx) => {
                const typeInfo = GOAL_TYPES.find((t) => t.id === goal.typeId) || GOAL_TYPES[0];
                const Icon = typeInfo.icon;
                const isEditing = activeEditingIndex === idx;

                return (
                  <div key={idx} className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                    <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="p-1 bg-white rounded-lg border border-gray-200 text-blue-600">
                          <Icon size={16} />
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{typeInfo.label}</span>
                      </div>
                      <button
                        onClick={() => setActiveEditingIndex(isEditing ? null : idx)}
                        className={`p-2 rounded-xl transition-all ${
                          isEditing ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-blue-600 hover:bg-white'
                        }`}
                      >
                        {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                      </button>
                    </div>

                    <div className="p-6">
                      {isEditing ? (
                        <div className="space-y-3">
                          <textarea
                            className="w-full p-3 border-2 border-gray-100 rounded-xl text-sm"
                            value={goal.description}
                            onChange={(e) => updateGoal(idx, 'description', e.target.value)}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-gray-400 uppercase">Indicador Directo</label>
                              <input
                                className="w-full p-2 border rounded-lg text-xs mt-1"
                                value={goal.indicator}
                                onChange={(e) => updateGoal(idx, 'indicator', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-400 uppercase">Meta del Ano</label>
                              <input
                                className="w-full p-2 border rounded-lg text-xs mt-1"
                                value={goal.target}
                                onChange={(e) => updateGoal(idx, 'target', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-400 uppercase">Como se medira</label>
                              <input
                                className="w-full p-2 border rounded-lg text-xs mt-1"
                                value={goal.measurementType || ''}
                                onChange={(e) => updateGoal(idx, 'measurementType', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-400 uppercase">Tiempo de cumplimiento</label>
                              <input
                                className="w-full p-2 border rounded-lg text-xs mt-1"
                                placeholder="Ej: Dic 2026 o 31/12/2026"
                                value={goal.deadline || ''}
                                onChange={(e) => updateGoal(idx, 'deadline', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="font-bold text-gray-800 leading-tight text-lg">{goal.description}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                              <span className="block text-[10px] text-gray-400 font-bold uppercase">KPI Personal</span>
                              <span className="text-sm font-bold text-slate-700">{goal.indicator}</span>
                            </div>
                            <div className="bg-blue-50 p-2 rounded-xl border border-blue-100">
                              <span className="block text-[10px] text-blue-400 font-bold uppercase">Meta Final</span>
                              <span className="text-sm font-bold text-blue-800">{goal.target}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                              <span className="block text-[10px] text-emerald-500 font-bold uppercase">Medible (SMART-M)</span>
                              <span className="text-sm font-bold text-emerald-800">{goal.measurementType || 'Definir metodo de medicion'}</span>
                            </div>
                            <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-100">
                              <span className="block text-[10px] text-indigo-500 font-bold uppercase">Tiempo de cumplimiento (SMART-T)</span>
                              <span className="text-sm font-bold text-indigo-800">{goal.deadline || 'Definir fecha compromiso'}</span>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row gap-2 pt-4 border-t border-gray-50">
                            <button
                              disabled={!!actionLoading}
                              onClick={() => generateActionPlan(idx)}
                              className="flex-1 py-2.5 text-[10px] uppercase font-bold bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                            >
                              {actionLoading === `plan-${idx}` ? (
                                <RefreshCw className="animate-spin" size={12} />
                              ) : (
                                <ListChecks size={14} />
                              )}
                              Que acciones te ayudaran a alcanzar tu objetivo?
                            </button>
                            <button
                              disabled={!!actionLoading}
                              onClick={() => analyzeRisks(idx)}
                              className="flex-1 py-2.5 text-[10px] uppercase font-bold bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                            >
                              {actionLoading === `risk-${idx}` ? (
                                <RefreshCw className="animate-spin" size={12} />
                              ) : (
                                <ShieldAlert size={14} />
                              )}
                              Que podria impedir que alcances tu objetivo?
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-4 pt-8 border-t">
              <div className="w-full rounded-2xl border border-sky-100 bg-sky-50/70 p-4 md:p-5">
                <h3 className="text-sm md:text-base font-extrabold text-sky-900 uppercase tracking-wide">Prototipo Final de Metodologia SMART</h3>
                <p className="text-xs text-sky-700 mt-1">Cada objetivo queda trazable con metrica de medicion y tiempo de cumplimiento comprometido.</p>
                <div className="mt-4 space-y-2">
                  {goals.map((goal, idx) => (
                    <div key={`smart-${idx}`} className="rounded-xl border border-sky-100 bg-white px-3 py-2">
                      <p className="text-xs font-bold text-slate-800">{idx + 1}. {goal.description}</p>
                      <p className="text-[11px] text-slate-600 mt-1"><span className="font-bold text-emerald-700">Medible:</span> {goal.measurementType || `${goal.indicator} contra ${goal.target}`}</p>
                      <p className="text-[11px] text-slate-600"><span className="font-bold text-indigo-700">Tiempo:</span> {goal.deadline || 'Pendiente de definir'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 w-full justify-center">
                <button
                  onClick={() => window.print()}
                  className="bg-gray-900 text-white px-12 py-4 rounded-2xl font-bold shadow-2xl hover:bg-black transition-all hover:scale-105 active:scale-95"
                >
                  Exportar PDF
                </button>
                <button
                  onClick={() => sendToSheets(userData, goals, setError, setSuccess)}
                  className="bg-green-600 text-white px-12 py-4 rounded-2xl font-bold shadow-2xl hover:bg-green-700 transition-all hover:scale-105 active:scale-95"
                >
                  Registrar en Google Sheets
                </button>
              </div>
              {success && (
                <div className="mt-4 text-green-700 text-sm font-bold text-center">{success}</div>
              )}
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center max-w-xs">
                Recuerda: Estas metas son de tu responsabilidad directa y seran evaluadas al cierre del ano.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-3 md:p-6 font-sans">
      <div className="app-shell">
        <header className="topbar-usil">
          <div className="topbar-main">
            <div>
              <h1 className="topbar-title">Objetivos USIL: Tu Ruta de Resultados</h1>
              <p className="topbar-subtitle">Crea metas SMART con IA para priorizar mejor y avanzar con foco en tu dia a dia</p>
            </div>
            <div className="topbar-logo-shell">
              <img
                src={CORPORATE_LOGO_SRC}
                alt="Corporacion USIL"
                className="topbar-logo"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1.5 bg-white/15 rounded-full border border-white/35 text-xs font-bold text-blue-50 shadow-sm">
            {step === 4 ? 'Plan Anual Listado' : `Paso ${step + 1} de 4`}
          </div>
        </header>

        <div className="content-wrap">
        <section className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/65 p-4 md:p-5 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="block text-[11px] font-bold uppercase tracking-wide text-blue-700 mb-1">
                API Key de Gemini o Groq
              </label>
              <input
                type="password"
                value={runtimeApiKey}
                onChange={(e) => {
                  setRuntimeApiKey(e.target.value);
                  setIsApiKeySaved(false);
                }}
                placeholder="Pega tu API key de Gemini o Groq para activar recomendaciones IA"
                className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              onClick={saveApiKey}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
            >
              Guardar key
            </button>
          </div>
          <p className="mt-2 text-xs text-blue-900/80">
            Estado: {isApiKeySaved ? 'key guardada localmente en este navegador' : 'key pendiente de guardar'}.
          </p>
        </section>

        <div className="flex justify-between mb-8 max-w-md mx-auto">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 mx-1 rounded-full transition-all duration-700 ${
                step >= i ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <main className="bg-white/86 rounded-[2rem] p-6 md:p-10 shadow-xl shadow-slate-300/40 min-h-[550px] border border-white/80 relative backdrop-blur-sm">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Target size={250} />
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          {renderStepContent()}
        </main>

        {aiInsight && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden border border-gray-100">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold flex items-center gap-2 text-gray-800 tracking-tight text-lg">{aiInsight.title}</h3>
                <button
                  onClick={() => setAiInsight(null)}
                  className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-100 shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 max-h-[65vh] overflow-y-auto bg-gradient-to-b from-white to-slate-50">
                <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  {parsedInsight.map((block, idx) => renderInsightBlock(block, idx))}
                </div>
              </div>

              <div className="p-6 bg-gray-50/50 border-t flex justify-center">
                <button
                  onClick={() => setAiInsight(null)}
                  className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95"
                >
                  Entendido, manos a la obra
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-10 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest flex flex-col gap-2">
          <span>Enfoque en Autonomia y Resultados Directos</span>
          <span>Desarrollado con Inteligencia Artificial Gemini 2026</span>
        </footer>
        </div>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')).render(<App />);
