'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Maximize2, Download, Settings } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// Importar html2pdf solo en el cliente
let html2pdf: any = null;

interface ReportPreviewItem {
  id: string;
  name: string;
  previewHtml: string;
}

interface PreviewPaneProps {
  reports: ReportPreviewItem[];
}

interface PDFOptions {
  pageSize: 'one_long_page' | 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'letter' | 'legal';
  pageOrientation: 'portrait' | 'landscape' | 'auto';
  viewportWidth: number;
  pageMargin: string;
  usePrintMedia: boolean;
  delay: number;
  hideCookieBanners: boolean;
  headerFooter: boolean;
  geoLocation?: 'US' | 'EU';
  language?: string;
}

const defaultPDFOptions: PDFOptions = {
  pageSize: 'one_long_page',
  pageOrientation: 'auto',
  viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1440,
  pageMargin: '10mm',
  usePrintMedia: false,
  delay: 0,
  hideCookieBanners: false,
  headerFooter: false,
};

export default function PreviewPane({ reports }: PreviewPaneProps) {
  const [pdfOptions, setPdfOptions] = useState<PDFOptions>(defaultPDFOptions);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      import('html2pdf.js').then((module) => {
        html2pdf = module.default;
        console.log('html2pdf cargado correctamente');
      }).catch(error => {
        console.error('Error al cargar html2pdf:', error);
      });
    }
  }, []);

  const handleDownloadPDF = async (html: string, reportName: string) => {
    if (!isClient || !html2pdf) {
      console.error('No se puede generar PDF en este momento');
      return;
    }
    
    setIsGeneratingPDF(true);
    let element: HTMLDivElement | null = null;

    try {
      console.log('Iniciando generación de PDF...');
      
      // Crear elemento temporal
      element = document.createElement('div');
      element.innerHTML = html;
      element.style.width = `${pdfOptions.viewportWidth}px`;
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '0';
      document.body.appendChild(element);

      // Configurar opciones básicas
      const marginValue = parseInt(pdfOptions.pageMargin);
      if (isNaN(marginValue)) {
        throw new Error('El valor del margen no es válido');
      }
      const marginUnit = pdfOptions.pageMargin.replace(/[0-9]/g, '') || 'mm';
      const margin = [marginValue, marginValue, marginValue, marginValue];

      const opt = {
        margin: margin,
        filename: `${reportName}.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98,
          imageTimeout: 0
        },
        html2canvas: { 
          scale: 2,
          width: pdfOptions.viewportWidth,
          height: pdfOptions.viewportWidth * 1.414,
          useCORS: true,
          logging: true,
          allowTaint: true,
          foreignObjectRendering: true,
          removeContainer: true,
          windowWidth: pdfOptions.viewportWidth,
          windowHeight: pdfOptions.viewportWidth * 1.414,
          onclone: (clonedDoc: Document) => {
            if (pdfOptions.usePrintMedia) {
              const style = clonedDoc.createElement('style');
              style.textContent = `
                @media print {
                  body { 
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                  }
                }
              `;
              clonedDoc.head.appendChild(style);
            }

            if (pdfOptions.hideCookieBanners) {
              const cookieBanners = clonedDoc.querySelectorAll('[class*="cookie"], [class*="Cookie"], [id*="cookie"], [id*="Cookie"]');
              cookieBanners.forEach(banner => {
                (banner as HTMLElement).style.display = 'none';
              });
            }
          }
        },
        jsPDF: { 
          unit: marginUnit,
          format: pdfOptions.pageSize === 'one_long_page' ? 'a4' : pdfOptions.pageSize,
          orientation: pdfOptions.pageOrientation === 'auto' ? 'portrait' : pdfOptions.pageOrientation,
          compress: true,
          hotfixes: ['px_scaling']
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: ['img', 'table', 'div']
        }
      };

      // Generar PDF
      const worker = html2pdf().set(opt).from(element);
      await worker.save();
      console.log('PDF generado exitosamente');

    } catch (error) {
      console.error('Error al generar PDF:', error);
      if (error instanceof Error) {
        console.error('Mensaje de error:', error.message);
        console.error('Stack trace:', error.stack);
      }
    } finally {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-purple-50/50 [&::-webkit-scrollbar-thumb]:bg-purple-200 [&::-webkit-scrollbar-thumb:hover]:bg-purple-300">
      {/* Barra de herramientas */}
      <div className="py-4 px-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-white flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Vista Previa de Informes</h3>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-600">
              <Settings className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Configuración de PDF</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="pageSize">Tamaño de página</Label>
                <Select
                  value={pdfOptions.pageSize}
                  onValueChange={(value: PDFOptions['pageSize']) => 
                    setPdfOptions(prev => ({ ...prev, pageSize: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_long_page">Una página larga</SelectItem>
                    <SelectItem value="a0">A0</SelectItem>
                    <SelectItem value="a1">A1</SelectItem>
                    <SelectItem value="a2">A2</SelectItem>
                    <SelectItem value="a3">A3</SelectItem>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="a5">A5</SelectItem>
                    <SelectItem value="a6">A6</SelectItem>
                    <SelectItem value="letter">Carta</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pageOrientation">Orientación</Label>
                <Select
                  value={pdfOptions.pageOrientation}
                  onValueChange={(value: PDFOptions['pageOrientation']) => 
                    setPdfOptions(prev => ({ ...prev, pageOrientation: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar orientación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automática</SelectItem>
                    <SelectItem value="portrait">Vertical</SelectItem>
                    <SelectItem value="landscape">Horizontal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="viewportWidth">Ancho de vista (px)</Label>
                <Input
                  id="viewportWidth"
                  type="number"
                  min="320"
                  max="3840"
                  value={pdfOptions.viewportWidth}
                  onChange={(e) => 
                    setPdfOptions(prev => ({ ...prev, viewportWidth: parseInt(e.target.value) || 1440 }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pageMargin">Margen</Label>
                <Input
                  id="pageMargin"
                  value={pdfOptions.pageMargin}
                  onChange={(e) => 
                    setPdfOptions(prev => ({ ...prev, pageMargin: e.target.value }))
                  }
                  placeholder="Ej: 10mm, 0.5in, 20px"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="delay">Retraso (segundos)</Label>
                <Input
                  id="delay"
                  type="number"
                  min="0"
                  max="5"
                  step="0.5"
                  value={pdfOptions.delay}
                  onChange={(e) => 
                    setPdfOptions(prev => ({ ...prev, delay: parseFloat(e.target.value) || 0 }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="usePrintMedia">Usar estilos @media print</Label>
                <Switch
                  id="usePrintMedia"
                  checked={pdfOptions.usePrintMedia}
                  onCheckedChange={(checked: boolean) => 
                    setPdfOptions(prev => ({ ...prev, usePrintMedia: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="hideCookieBanners">Ocultar avisos de cookies</Label>
                <Switch
                  id="hideCookieBanners"
                  checked={pdfOptions.hideCookieBanners}
                  onCheckedChange={(checked: boolean) => 
                    setPdfOptions(prev => ({ ...prev, hideCookieBanners: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="headerFooter">Incluir encabezado/pie</Label>
                <Switch
                  id="headerFooter"
                  checked={pdfOptions.headerFooter}
                  onCheckedChange={(checked: boolean) => 
                    setPdfOptions(prev => ({ ...prev, headerFooter: checked }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="geoLocation">Ubicación geográfica</Label>
                <Select
                  value={pdfOptions.geoLocation}
                  onValueChange={(value: 'US' | 'EU') => 
                    setPdfOptions(prev => ({ ...prev, geoLocation: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">Estados Unidos</SelectItem>
                    <SelectItem value="EU">Unión Europea</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="language">Idioma</Label>
                <Input
                  id="language"
                  value={pdfOptions.language || ''}
                  onChange={(e) => 
                    setPdfOptions(prev => ({ ...prev, language: e.target.value }))
                  }
                  placeholder="Ej: es, en, fr"
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Contenido de informes */}
      <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-purple-50/50 to-white flex flex-col items-center gap-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-purple-50/50 [&::-webkit-scrollbar-thumb]:bg-purple-200 [&::-webkit-scrollbar-thumb:hover]:bg-purple-300">
        {reports.map(report => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-auto max-w-sm"
          >
            <Card className="bg-white border border-purple-100 shadow-lg p-6 text-center flex flex-col items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-md mb-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{report.name}</h3>
                <p className="text-sm text-gray-600">Haz clic para ver detalles.</p>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2 w-full justify-center"
                    >
                      <Maximize2 className="h-4 w-4" />
                      Ver Informe Completo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl h-[80vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-purple-50/50 [&::-webkit-scrollbar-thumb]:bg-purple-200 [&::-webkit-scrollbar-thumb:hover]:bg-purple-300">
                    <DialogHeader>
                      <DialogTitle>{report.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col h-full">
                      <div className="flex justify-end mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPDF(report.previewHtml, report.name)}
                          disabled={isGeneratingPDF || !isClient}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          {isGeneratingPDF ? 'Generando PDF...' : 'Descargar PDF'}
                        </Button>
                      </div>
                      <div 
                        className="flex-1 overflow-auto p-4 bg-white rounded-lg border border-gray-200 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-purple-50/50 [&::-webkit-scrollbar-thumb]:bg-purple-200 [&::-webkit-scrollbar-thumb:hover]:bg-purple-300"
                        dangerouslySetInnerHTML={{ __html: report.previewHtml }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
