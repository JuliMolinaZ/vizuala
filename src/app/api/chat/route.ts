import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // TODO: Implementar lógica real de IA o procesamiento
    const reply = `Respuesta dummy para: "${message}". Aquí irá la lógica de IA o atención manual.`;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error en /api/chat:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 