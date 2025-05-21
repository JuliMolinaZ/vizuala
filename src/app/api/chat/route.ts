import { NextResponse } from "next/server";

/**
 * Endpoint que conecta con un modelo de IA externo (OpenAI) para obtener una
 * respuesta basada en el mensaje recibido.
 */
export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta la clave OPENAI_API_KEY" },
        { status: 500 },
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Error al llamar a OpenAI:", text);
      return NextResponse.json(
        { error: "Error al obtener respuesta de IA" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 },
    );
  }
}
