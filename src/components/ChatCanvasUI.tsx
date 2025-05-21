'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindowClean";
import PreviewPane from "./PreviewPane";

// Ejemplos de informes dummy globales
const exampleReports = [
  {
    id: 'ventas-q1',
    name: 'Informe de Ventas Q1',
    icon: 'ventas',
    date: 'Mar 2024',
    chat: [
      { id: '1', role: 'user' as const, content: 'Hola, ¿puedes generar el informe de ventas del primer trimestre?', timestamp: new Date('2024-03-01T09:00:00') },
      { id: '2', role: 'user' as const, content: 'Adjunto archivo: ventas_q1.pdf', timestamp: new Date('2024-03-01T09:00:02') },
      { id: '3', role: 'system' as const, content: 'Archivo recibido: ventas_q1.pdf. Procesando datos...', timestamp: new Date('2024-03-01T09:00:03') },
      { id: '4', role: 'user' as const, content: 'Adjunto imagen: grafica_enero.png', timestamp: new Date('2024-03-01T09:00:05') },
      { id: '5', role: 'system' as const, content: 'Imagen recibida: grafica_enero.png. Añadiendo al informe...', timestamp: new Date('2024-03-01T09:00:06') },
      { id: '6', role: 'system' as const, content: '¡Por supuesto! Aquí tienes el resumen de ventas Q1 2024.', timestamp: new Date('2024-03-01T09:00:07') },
      { id: '7', role: 'user' as const, content: '¿Puedes agregar un gráfico de barras mensuales?', timestamp: new Date('2024-03-01T09:00:10') },
      { id: '8', role: 'system' as const, content: 'Gráfico de barras añadido al informe.', timestamp: new Date('2024-03-01T09:00:11') },
    ],
    previewHtml: `<h2 class='text-xl font-bold mb-2'>Informe de Ventas Q1</h2><p>Resumen de ventas del primer trimestre de 2024. <b>Total:</b> $120,000</p><ul><li>Enero: $40,000</li><li>Febrero: $50,000</li><li>Marzo: $30,000</li></ul>`
  },
  {
    id: 'marketing',
    name: 'Reporte Marketing',
    icon: 'marketing',
    date: 'Feb 2024',
    chat: [
      { id: '1', role: 'user' as const, content: 'Necesito un informe de marketing digital para febrero.', timestamp: new Date('2024-02-10T10:00:00') },
      { id: '2', role: 'user' as const, content: 'Adjunto archivo: campañas_feb.pdf', timestamp: new Date('2024-02-10T10:00:01') },
      { id: '3', role: 'system' as const, content: 'Archivo recibido: campañas_feb.pdf. Procesando datos...', timestamp: new Date('2024-02-10T10:00:02') },
      { id: '4', role: 'system' as const, content: 'Informe generado: campañas, alcance y engagement de febrero.', timestamp: new Date('2024-02-10T10:00:03') },
      { id: '5', role: 'user' as const, content: 'Incluye recomendaciones para mejorar el ROI.', timestamp: new Date('2024-02-10T10:00:10') },
      { id: '6', role: 'system' as const, content: 'Recomendaciones añadidas al informe.', timestamp: new Date('2024-02-10T10:00:11') },
    ],
    previewHtml: `<h2 class='text-xl font-bold mb-2'>Reporte Marketing</h2><p>Resumen de campañas de febrero. <b>Alcance:</b> 1.2M usuarios</p><ul><li>Campaña A: 500K</li><li>Campaña B: 700K</li></ul><p><b>Recomendaciones:</b> Optimizar segmentación y aumentar inversión en B.</p>`
  },
  {
    id: 'finanzas',
    name: 'Resumen Finanzas',
    icon: 'finanzas',
    date: 'Ene 2024',
    chat: [
      { id: '1', role: 'user' as const, content: 'Dame un resumen financiero de enero.', timestamp: new Date('2024-01-20T12:00:00') },
      { id: '2', role: 'user' as const, content: 'Adjunto archivo: finanzas_enero.pdf', timestamp: new Date('2024-01-20T12:00:01') },
      { id: '3', role: 'system' as const, content: 'Archivo recibido: finanzas_enero.pdf. Procesando datos...', timestamp: new Date('2024-01-20T12:00:02') },
      { id: '4', role: 'system' as const, content: 'Resumen generado: ingresos, gastos y balance de enero.', timestamp: new Date('2024-01-20T12:00:03') },
      { id: '5', role: 'user' as const, content: '¿Cuál fue el mayor gasto?', timestamp: new Date('2024-01-20T12:00:15') },
      { id: '6', role: 'system' as const, content: 'El mayor gasto fue en infraestructura: $15,000.', timestamp: new Date('2024-01-20T12:00:16') },
    ],
    previewHtml: `<h2 class='text-xl font-bold mb-2'>Resumen Finanzas Enero</h2><p>Ingresos: $80,000 | Gastos: $50,000 | <b>Balance:</b> $30,000</p><ul><li>Infraestructura: $15,000</li><li>Personal: $20,000</li><li>Otros: $15,000</li></ul>`
  },
];

export default function ChatCanvasUI() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState('ventas-q1');
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const selectedReport = exampleReports.find(r => r.id === selectedReportId) ?? exampleReports[0];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar para desktop */}
      <div className={sidebarMinimized ? "hidden md:flex flex-col w-16 min-w-[64px] border-r border-gray-700 bg-gray-800 transition-all duration-300" : "hidden md:flex flex-col w-72 min-w-[220px] border-r border-gray-700 bg-gray-800 transition-all duration-300"}>
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-semibold text-purple-300">VIZUALA</h1>
        </div>
        <Sidebar
          reports={exampleReports}
          selected={selectedReportId}
          onSelect={setSelectedReportId}
          minimized={sidebarMinimized}
          setMinimized={setSidebarMinimized}
        />
      </div>

      {/* Sidebar móvil */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-gray-800 hover:bg-purple-700 text-purple-300"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-gray-800 border-r border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-semibold text-purple-300">VIZUALA</h1>
          </div>
          <Sidebar
            reports={exampleReports}
            selected={selectedReportId}
            onSelect={setSelectedReportId}
            minimized={sidebarMinimized}
            setMinimized={setSidebarMinimized}
          />
        </SheetContent>
      </Sheet>

      {/* Área principal */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sección de Chat */}
        <div className={sidebarMinimized ? "flex-1 md:w-full flex flex-col border-r border-gray-700 transition-all duration-300" : "flex-1 md:w-auto flex flex-col border-r border-gray-700 transition-all duration-300"}>
          <div className="p-4 border-b border-gray-700 bg-gray-800 md:hidden">
            <h2 className="text-lg font-medium text-purple-300">Chat</h2>
          </div>
          <ChatWindow messages={selectedReport.chat} />
        </div>

        {/* Sección de Previsualización */}
        <div className="w-full md:w-1/2 lg:w-1/3 border-t md:border-t-0 border-gray-700">
          <div className="p-4 border-b border-gray-700 bg-gray-800">
            <h2 className="text-lg font-medium text-purple-300">Previsualización</h2>
          </div>
          <PreviewPane previewHtml={selectedReport.previewHtml} />
        </div>
      </div>
    </div>
  );
}
