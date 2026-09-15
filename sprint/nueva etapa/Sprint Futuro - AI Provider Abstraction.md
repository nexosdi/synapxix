# Synapxix · Sprint Futuro (Post-Piloto)

## "AI Provider Abstraction — Multi-Model Support"

**Objetivo:** Abstraer la capa de AI para soportar múltiples proveedores (Gemini, Claude, OpenAI, Grok) sin cambiar la lógica de negocio.

**Justificación:** El `AiProvider` actual está 100% acoplado a `@google/generative-ai` (Gemini 2.5 Flash). Si Google cambia precios, si la cuota se agota, o si un modelo distinto rinde mejor para cierto tipo de análisis, hay que reescribir el provider entero. Una abstracción permite cambiar de modelo con una env var.

**Prerrequisitos:** Sprint 12 completado (piloto estable).

---

### Tareas propuestas

#### TF.1 · Definir interfaz `AiModelAdapter`

**Estimación:** 4-6h

Crear una interfaz TypeScript que todos los providers implementen:

```typescript
interface AiModelAdapter {
  generateContent(prompt: string | ContentPart[]): Promise<AiResponse>;
  generateContentStream(prompt: string | ContentPart[], signal?: AbortSignal): AsyncGenerator<string>;
  supportsMultimodal(): boolean;
}

interface AiResponse {
  text(): string;
}

type ContentPart = TextPart | InlineDataPart;
```

**Archivos:**
- `[NEW] libs/ai-adapter/src/ai-model-adapter.interface.ts`
- `[NEW] libs/ai-adapter/src/types.ts`

---

#### TF.2 · Implementar adapters por proveedor

**Estimación:** 12-15h (4 adapters)

| Adapter | SDK | Streaming | Multimodal |
|---|---|---|---|
| `GeminiAdapter` | `@google/generative-ai` | ✅ | ✅ |
| `ClaudeAdapter` | `@anthropic-ai/sdk` | ✅ | ✅ |
| `OpenAiAdapter` | `openai` | ✅ | ✅ |
| `GrokAdapter` | `openai` (compatible) | ✅ | ❓ |

**Archivos:**
- `[NEW] libs/ai-adapter/src/adapters/gemini.adapter.ts`
- `[NEW] libs/ai-adapter/src/adapters/claude.adapter.ts`
- `[NEW] libs/ai-adapter/src/adapters/openai.adapter.ts`
- `[NEW] libs/ai-adapter/src/adapters/grok.adapter.ts`

---

#### TF.3 · Factory + configuración por env

**Estimación:** 4-6h

```env
AI_PROVIDER=gemini        # gemini | claude | openai | grok
AI_MODEL_NAME=gemini-2.5-flash
GOOGLE_GEN_AI_KEY=...
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GROK_API_KEY=...
```

Factory que resuelve el adapter correcto según `AI_PROVIDER`:

**Archivos:**
- `[NEW] libs/ai-adapter/src/ai-adapter.factory.ts`
- `[MODIFY] server/src/app/modules/research/research.module.ts` — inyectar via factory

---

#### TF.4 · Refactor de `AiProvider` a consumir el adapter

**Estimación:** 6-8h

El `AiProvider` actual pasa a ser un **orquestador** que usa `AiModelAdapter` internamente. La API pública (`analyzePedagogicalAction`, `streamPedagogicalAction`, etc.) no cambia — los consumers (`ResearchService`, `EvaluativeService`) no se tocan.

**Archivos:**
- `[MODIFY] server/src/app/modules/research/providers/ai.provider.ts`
- `[MODIFY] server/src/app/modules/research/providers/retry.util.ts` — generalizar para cualquier SDK

---

#### TF.5 · Tests por adapter + test de integración

**Estimación:** 8-10h

- Unit test por cada adapter con SDK mockeado
- Integration test: factory crea el adapter correcto según env
- Smoke test: el endpoint `/research/process` funciona igual con el refactor

---

### Estimación total: 34-45h

### Patrón de diseño: Strategy Pattern

```
ResearchService → AiProvider (orquestador)
                       ↓
              AiModelAdapter (interfaz)
              ↙     ↓      ↓       ↘
         Gemini  Claude  OpenAI   Grok
```

### Riesgos

- Cada SDK maneja streaming distinto (Gemini usa `generateContentStream`, Claude usa `stream: true`, OpenAI usa `stream: true` con chunks SSE). La interfaz debe abstraer esas diferencias.
- Multimodal (audio) no está disponible en todos los providers con la misma API.
- El retry/backoff actual está pensado para errores de Gemini — cada provider tiene sus propios códigos de error transientes.

### Notas

- Este refactor NO está en los sprints 1-12 del plan actual.
- Creado como deuda técnica identificada durante el Sprint 2.
- Depende de que el piloto (Sprint 12) esté estable antes de meter este cambio.
