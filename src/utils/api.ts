interface ChatResponse {
  reply: string;
}

interface PdfResponse {
  error?: string;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Error al enviar mensaje');
  }

  return response.json();
}

export async function generatePdf(html: string): Promise<Blob> {
  const response = await fetch('/api/pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ html }),
  });

  if (!response.ok) {
    const error: PdfResponse = await response.json();
    throw new Error(error.error || 'Error al generar PDF');
  }

  return response.blob();
} 