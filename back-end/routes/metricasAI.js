// routes/metricasAI.js
import express from 'express';
import OpenAI from 'openai';


const router = express.Router();

// Asegurate de definir GITHUB_TOKEN en tu .env (o en el entorno del servidor)
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.warn('Warning: GITHUB_TOKEN no está definido. Define process.env.GITHUB_TOKEN');
}

const client = new OpenAI({
  baseURL: 'https://models.github.ai/inference',
  apiKey: token
});

// Utility para generar el prompt a partir de las métricas
function buildPrompt({ gananciaProductos, pedidosEstado, ventasProducto, clientesTop, gananciasMes, totalesGenerales, egresosProveedor, ingresosProducto }) {
  return `
Eres un analista de métricas para un emprendimiento. Recibirás datos JSON con arrays de métricas (nombre/campo/valor).
Genera **solo el contenido HTML interno**, sin etiquetas <html>, <body> ni bloques de código (no incluyas \`\`\`html ni \`\`\`).

1) Resumen ejecutivo (2-3 frases).
2) Secciones separadas para cada dataset:
   - Porcentaje de ganancia por producto: ordena por % (mayor a menor), muestra top 5, calcula media y desviación si es posible, sugiere 2 recomendaciones (precios, promociones).
   - Stock por categoría: muestra % del stock total por categoría, identifica categorías críticas (stock bajo <10% del total) y sugiere acción.
   - Pedidos por estado: muestra distribución porcentual (p.ej. Pendiente, Enviado, Entregado, Cancelado) y alerta si hay backlog > X%.
   - Ventas por producto: muestra top 5 por ventas totales y menciona productos con ventas inusualmente bajas.
   - Clientes top: lista top 5 clientes con más pedidos y su aporte porcentual a ventas.
   - Ganancias por mes: resumen de tendencia (creciente/decreciente/estable) en los últimos meses, % cambio mes a mes.
3) Añade una pequeña "action list" con 3 acciones priorizadas (corto plazo/medio plazo).
4) Incluye tablas HTML simples para cada sección y algunos badges/estilos inline para que se vea "lindo" (usa clases Bootstrap como .table, .badge, .mt-3).
5) Devuelve únicamente el HTML (sin etiquetas <html> <body>) — será insertado en el modal.

Datos de entrada (JSON): ${JSON.stringify({
    gananciaProductos,
    pedidosEstado,
    ventasProducto,
    clientesTop,
    gananciasMes,
    totalesGenerales,
    egresosProveedor,
    ingresosProducto
  }).slice(0, 1000)}  -- (nota: los datos reales vendrán en el body)
`;
}

router.post('/generar-analisis', async (req, res) => {
  try {
    // Esperamos que el frontend mande en el body las propiedades:
    const {
      gananciaProductos = [],
      stockCategoria = [],
      pedidosEstado = [],
      ventasProducto = [],
      clientesTop = [],
      gananciasMes = [],
      totalesGenerales = [],
      egresosProveedor = [],
      ingresosProducto = []
    } = req.body || {};

    const prompt = buildPrompt({
      gananciaProductos,
      stockCategoria,
      pedidosEstado,
      ventasProducto,
      clientesTop,
      gananciasMes,
      totalesGenerales,
      egresosProveedor,
      ingresosProducto
    });

    const response = await client.chat.completions.create({
      messages: [
        { role: 'system', content: 'Eres un asistente que genera reportes de métricas en HTML usando Bootstrap.' },
        { role: 'user', content: prompt }
      ],
      model: 'openai/gpt-4o',
      temperature: 0.2,
      max_tokens: 4096,
      top_p: 1
    });
// Obtener el contenido de la respuesta
const contentRaw = response.choices?.[0]?.message?.content ?? '';

// 🧹 LIMPIEZA: eliminar etiquetas o bloques de formato innecesarios
const content = contentRaw
  .replace(/```html/g, '')  // elimina los delimitadores de bloque
  .replace(/```/g, '')      // elimina los delimitadores restantes
  .replace(/<\/?html>/gi, '')  // elimina etiquetas <html> y </html>
  .replace(/<\/?body>/gi, '')  // elimina etiquetas <body> y </body>
  .trim();

// Devolver HTML limpio
return res.json({ html: content });
  } catch (err) {
    console.error('Error generando análisis:', err);
    return res.status(500).json({ error: 'Error generando análisis' });
  }
});

export default router;
