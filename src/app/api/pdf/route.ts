import { NextResponse } from 'next/server';
import { generatePdf } from '@/lib/puppeteer';

export async function POST(request: Request) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'Se requiere el contenido HTML' },
        { status: 400 }
      );
    }

    const pdfBuffer = await generatePdf(html);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="informe.pdf"',
      },
    });
  } catch (error) {
    console.error('Error en /api/pdf:', error);
    return NextResponse.json(
      { error: 'Error al generar el PDF' },
      { status: 500 }
    );
  }
} 