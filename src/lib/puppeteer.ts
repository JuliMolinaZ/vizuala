/**
 * Genera un PDF a partir de una cadena HTML utilizando Puppeteer.
 *
 * Se realiza una importación dinámica de la librería para evitar que
 * Next.js intente resolverla en tiempo de compilación cuando la dependencia
 * no esté instalada. Se asume que el entorno de ejecución dispone de
 * `puppeteer`.
 */
export async function generatePdf(html: string): Promise<Buffer> {
  const puppeteer = await import("puppeteer");

  let browser: import("puppeteer").Browser | null = null;

  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });
    return pdfBuffer;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
