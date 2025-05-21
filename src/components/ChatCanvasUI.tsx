'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Eye, EyeOff, ChevronLeft, ChevronRight, LogOut, User, CreditCard } from "lucide-react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindowClean";
import PreviewPane from "./PreviewPane";
import { AppProvider, useApp } from '@/context/AppContext';
import { Report, Message } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, MessageSquare } from "lucide-react";

// Datos de ejemplo dummy globales
const exampleReports: Report[] = [
  {
    id: 'ventas-q1',
    name: 'Informe de Ventas Q1',
    icon: <FileText className="w-6 h-6 text-purple-600" />,
    date: 'Mar 2024',
    chat: [
      { id: '1', role: 'user', content: 'Hola, ¿puedes generar el informe de ventas del primer trimestre?', timestamp: new Date('2024-03-01T09:00:00') },
      { id: '2', role: 'user', content: 'Adjunto archivo: ventas_q1.pdf', timestamp: new Date('2024-03-01T09:00:02'), attachments: [{ type: 'file', name: 'ventas_q1.pdf', url: '/path/to/ventas_q1.pdf' }] },
      { id: '3', role: 'system', content: 'Archivo recibido: ventas_q1.pdf. Procesando datos...', timestamp: new Date('2024-03-01T09:00:03') },
      { id: '4', role: 'user', content: 'Adjunto imagen: grafica_enero.png', timestamp: new Date('2024-03-01T09:00:05'), attachments: [{ type: 'image', name: 'grafica_enero.png', url: '/path/to/grafica_enero.png' }] },
      { id: '5', role: 'system', content: 'Imagen recibida: grafica_enero.png. Añadiendo al informe...', timestamp: new Date('2024-03-01T09:00:06') },
      { id: '6', role: 'system', content: '¡Por supuesto! Aquí tienes el resumen de ventas Q1 2024.', timestamp: new Date('2024-03-01T09:00:07') },
      { id: '7', role: 'user', content: '¿Puedes agregar un gráfico de barras mensuales?', timestamp: new Date('2024-03-01T09:00:10') },
      { id: '8', role: 'system', content: 'Gráfico de barras añadido al informe.', timestamp: new Date('2024-03-01T09:00:11') },
    ] as Message[],
    previewItems: [
      {
        name: 'Resumen Q1',
        html: `
          <h2 class='text-2xl font-bold mb-4 text-gray-800'>Resumen de Ventas Q1 2024</h2>
          <p class='text-gray-600 mb-4'>Análisis conciso del primer trimestre.</p>
          <div class='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div class='bg-purple-50 p-4 rounded-lg shadow'><p class='text-sm font-medium text-gray-600'>Total Ventas Q1</p><p class='text-2xl font-bold text-purple-700'>$120,000</p></div>
            <div class='bg-purple-50 p-4 rounded-lg shadow'><p class='text-sm font-medium text-gray-600'>Margen</p><p class='text-2xl font-bold text-green-700'>45%</p></div>
            <div class='bg-purple-50 p-4 rounded-lg shadow'><p class='text-sm font-medium text-gray-600'>Crecimiento</p><p class='text-2xl font-bold text-blue-700'>+18%</p></div>
          </div>
          <h3 class='text-xl font-semibold mb-3 text-gray-700'>Ventas Mensuales</h3>
          <ul class='list-disc list-inside text-gray-600'><li>Enero: $40k</li><li>Febrero: $50k</li><li>Marzo: $30k</li></ul>
        `
      },
      {
        name: 'Detalle por Producto',
        html: `
          <h2 class='text-2xl font-bold mb-4 text-gray-800'>Ventas Q1 - Detalle por Producto</h2>
          <p class='text-gray-600 mb-4'>Rendimiento de los productos clave.</p>
          <table class='min-w-full bg-white border border-purple-200 rounded-lg shadow overflow-hidden mb-6'>
            <thead><tr><th class='py-2 px-4 bg-purple-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>Producto</th><th class='py-2 px-4 bg-purple-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>Ventas ($)</th><th class='py-2 px-4 bg-purple-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>Unidades Vendidas</th></tr></thead>
            <tbody>
              <tr class='border-b border-purple-100'><td>Producto A</td><td>60,000</td><td>1200</td></tr>
              <tr class='border-b border-purple-100'><td>Producto B</td><td>40,000</td><td>800</td></tr>
              <tr><td>Producto C</td><td>20,000</td><td>400</td></tr>
            </tbody>
          </table>
          <h3 class='text-xl font-semibold mb-3 text-gray-700'>Productos Destacados</h3>
          <ul class='list-disc list-inside text-gray-600'><li>Producto A: Líder en ingresos.</li><li>Producto B: Mayor crecimiento.</li></ul>
        `
      },
      {
        name: 'Gráfico de Tendencia Mensual',
        html: `
          <h2 class='text-2xl font-bold mb-4 text-gray-800'>Ventas Q1 - Tendencia Mensual</h2>
          <p class='text-gray-600 mb-4'>Visualización del rendimiento a lo largo del trimestre.</p>
          <div class='w-full h-48 bg-purple-100 rounded-lg p-4 flex flex-col justify-end mb-6'>
            <div class='flex items-end h-full gap-2'>
              <div class='flex-1 bg-purple-600 rounded-t-sm' style='height: 80%;'></div>
              <div class='flex-1 bg-purple-600 rounded-t-sm' style='height: 100%;'></div>
              <div class='flex-1 bg-purple-600 rounded-t-sm' style='height: 60%;'></div>
            </div>
            <div class='flex justify-between text-xs text-gray-700 mt-1'><span>Ene</span><span>Feb</span><span>Mar</span></div>
          </div>
          <h3 class='text-xl font-semibold mb-3 text-gray-700'>Análisis del Gráfico</h3>
          <p class='text-gray-600'>El gráfico muestra un pico de ventas en febrero, con un ligero descenso en marzo. La tendencia general del trimestre es positiva.</p>
        `
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Reporte Marketing',
    icon: <MessageSquare className="w-6 h-6 text-pink-600" />,
    date: 'Feb 2024',
    chat: [
      { id: '1', role: 'user', content: 'Necesito un informe de marketing digital para febrero.', timestamp: new Date('2024-02-10T10:00:00') },
      { id: '2', role: 'user', content: 'Adjunto archivo: campañas_feb.pdf', timestamp: new Date('2024-02-10T10:00:01'), attachments: [{ type: 'file', name: 'campañas_feb.pdf', url: '/path/to/campañas_feb.pdf' }] },
      { id: '3', role: 'system', content: 'Archivo recibido: campañas_feb.pdf. Procesando datos...', timestamp: new Date('2024-02-10T10:00:02') },
      { id: '4', role: 'system', content: 'Informe generado: campañas, alcance y engagement de febrero.', timestamp: new Date('2024-02-10T10:00:03') },
      { id: '5', role: 'user', content: 'Incluye recomendaciones para mejorar el ROI.', timestamp: new Date('2024-02-10T10:00:10') },
      { id: '6', role: 'system', content: 'Recomendaciones añadidas al informe.', timestamp: new Date('2024-02-10T10:00:11') },
    ] as Message[],
    previewHtml: `
      <h2 class='text-2xl font-bold mb-4 text-gray-800'>Reporte de Marketing Digital - Febrero 2024</h2>
      <p class='text-gray-600 mb-4'>Análisis de rendimiento de campañas digitales.</p>
      
      <h3 class='text-xl font-semibold mb-3 text-gray-700'>Métricas Clave</h3>
      <div class='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div class='bg-pink-50 p-4 rounded-lg shadow'>
          <p class='text-sm font-medium text-gray-600'>Alcance Total</p>
          <p class='text-2xl font-bold text-pink-700'>1.2M</p>
        </div>
        <div class='bg-pink-50 p-4 rounded-lg shadow'>
          <p class='text-sm font-medium text-gray-600'>Impresiones</p>
          <p class='text-2xl font-bold text-pink-700'>3.5M</p>
        </div>
        <div class='bg-pink-50 p-4 rounded-lg shadow'>
          <p class='text-sm font-medium text-gray-600'>Engagement Rate</p>
          <p class='text-2xl font-bold text-green-700'>3.1%</p>
        </div>
      </div>

      <h3 class='text-xl font-semibold mb-3 text-gray-700'>Rendimiento por Campaña</h3>
      <table class='min-w-full bg-white border border-pink-200 rounded-lg shadow overflow-hidden mb-6'>
        <thead>
          <tr>
            <th class='py-2 px-4 bg-pink-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>Campaña</th>
            <th class='py-2 px-4 bg-pink-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>Tipo</th>
            <th class='py-2 px-4 bg-pink-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>Inversión ($)</th>
            <th class='py-2 px-4 bg-pink-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>ROI (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr class='border-b border-pink-100 last:border-b-0'>
            <td class='py-2 px-4 text-gray-800'>Campaña A</td>
            <td class='py-2 px-4 text-gray-800'>Social Media</td>
            <td class='py-2 px-4 text-gray-800'>10,000</td>
            <td class='py-2 px-4 text-green-700 font-semibold'>150%</td>
          </tr>
          <tr class='border-b border-pink-100 last:border-b-0'>
            <td class='py-2 px-4 text-gray-800'>Campaña B</td>
            <td class='py-2 px-4 text-gray-800'>Google Ads</td>
            <td class='py-2 px-4 text-gray-800'>12,000</td>
            <td class='py-2 px-4 text-red-700 font-semibold'>-10%</td>
          </tr>
           <tr class='border-b border-pink-100 last:border-b-0'>
            <td class='py-2 px-4 text-gray-800'>Campaña C</td>
            <td class='py-2 px-4 text-gray-800'>Email Marketing</td>
            <td class='py-2 px-4 text-gray-800'>5,000</td>
            <td class='py-2 px-4 text-green-700 font-semibold'>80%</td>
          </tr>
        </tbody>
      </table>

      <h3 class='text-xl font-semibold mb-3 text-gray-700'>Distribución Geográfica</h3>
       <div class='w-full h-48 bg-pink-100 rounded-lg p-4 flex items-center justify-center text-gray-700 font-medium mb-6'>
        [Placeholder para Mapa de Calor]
      </div>

      <h3 class='text-xl font-semibold mb-3 text-gray-700'>Recomendaciones</h3>
      <ul class='list-disc list-inside text-gray-600 mb-4'>
        <li>Reasignar presupuesto de Campaña B a Campaña A y C.</li>
        <li>Optimizar segmentación en Campaña B y probar nuevas audiencias.</li>
        <li>Continuar con la estrategia de email marketing dado su buen ROI.</li>
        <li>Explorar oportunidades de publicidad en video corto.</li>
      </ul>
    `
  },
  {
    id: 'finanzas',
    name: 'Resumen Finanzas',
    icon: <Eye className="w-6 h-6 text-teal-600" />,
    date: 'Ene 2024',
    chat: [
      { id: '1', role: 'user', content: 'Dame un resumen financiero de enero.', timestamp: new Date('2024-01-20T12:00:00') },
      { id: '2', role: 'user', content: 'Adjunto archivo: finanzas_enero.pdf', timestamp: new Date('2024-01-20T12:00:01'), attachments: [{ type: 'file', name: 'finanzas_enero.pdf', url: '/path/to/finanzas_enero.pdf' }] },
      { id: '3', role: 'system', content: 'Archivo recibido: finanzas_enero.pdf. Procesando datos...', timestamp: new Date('2024-01-20T12:00:02') },
      { id: '4', role: 'system', content: 'Resumen generado: ingresos, gastos y balance de enero.', timestamp: new Date('2024-01-20T12:00:03') },
      { id: '5', role: 'user', content: '¿Cuál fue el mayor gasto?', timestamp: new Date('2024-01-20T12:00:15') },
      { id: '6', role: 'system', content: 'El mayor gasto fue en infraestructura: $15,000.', timestamp: new Date('2024-01-20T12:00:16') },
    ] as Message[],
    previewHtml: `
      <h2 class='text-2xl font-bold mb-4 text-gray-800'>Resumen Financiero - Enero 2024</h2>
      <p class='text-gray-600 mb-4'>Estado de ingresos, gastos y balance del mes.</p>
      
      <h3 class='text-xl font-semibold mb-3 text-gray-700'>Estado de Resultados (Enero)</h3>
      <div class='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div class='bg-teal-50 p-4 rounded-lg shadow'>
          <p class='text-sm font-medium text-gray-600'>Ingresos Totales</p>
          <p class='text-2xl font-bold text-teal-700'>$80,000</p>
        </div>
        <div class='bg-teal-50 p-4 rounded-lg shadow'>
          <p class='text-sm font-medium text-gray-600'>Costo de Ventas</p>
          <p class='text-2xl font-bold text-red-700'>$30,000</p>
        </div>
         <div class='bg-teal-50 p-4 rounded-lg shadow'>
          <p class='text-sm font-medium text-gray-600'>Utilidad Bruta</p>
          <p class='text-2xl font-bold text-green-700'>$50,000</p>
        </div>
      </div>
       <div class='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
         <div class='bg-teal-50 p-4 rounded-lg shadow'>
          <p class='text-sm font-medium text-gray-600'>Gastos Operativos Totales</p>
          <p class='text-2xl font-bold text-red-700'>$50,000</p>
        </div>
        <div class='bg-teal-50 p-4 rounded-lg shadow'>
          <p class='text-sm font-medium text-gray-600'>Beneficio Neto</p>
          <p class='text-2xl font-bold text-green-700'>$30,000</p>
        </div>
      </div>

      <h3 class='text-xl font-semibold mb-3 text-gray-700'>Detalle de Gastos Operativos</h3>
      <table class='min-w-full bg-white border border-teal-200 rounded-lg shadow overflow-hidden mb-6'>
        <thead>
          <tr>
            <th class='py-2 px-4 bg-teal-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>Categoría</th>
            <th class='py-2 px-4 bg-teal-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>Monto ($)</th>
            <th class='py-2 px-4 bg-teal-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider'>% del Total</th>
          </tr>
        </thead>
        <tbody>
          <tr class='border-b border-teal-100 last:border-b-0'>
            <td class='py-2 px-4 text-gray-800'>Infraestructura</td>
            <td class='py-2 px-4 text-gray-800'>15,000</td>
            <td class='py-2 px-4 text-gray-800'>30%</td>
          </tr>
          <tr class='border-b border-teal-100 last:border-b-0'>
            <td class='py-2 px-4 text-gray-800'>Personal</td>
            <td class='py-2 px-4 text-gray-800'>20,000</td>
            <td class='py-2 px-4 text-gray-800'>40%</td>
          </tr>
          <tr class='border-b border-teal-100 last:border-b-0'>
            <td class='py-2 px-4 text-gray-800'>Marketing</td>
            <td class='py-2 px-4 text-gray-800'>10,000</td>
            <td class='py-2 px-4 text-gray-800'>20%</td>
          </tr>
           <tr>
            <td class='py-2 px-4 text-gray-800'>Otros</td>
            <td class='py-2 px-4 text-gray-800'>5,000</td>
            <td class='py-2 px-4 text-gray-800'>10%</td>
          </tr>
        </tbody>
      </table>

      <h3 class='text-xl font-semibold mb-3 text-gray-700'>Flujo de Caja Mensual</h3>
       <div class='w-full h-48 bg-teal-100 rounded-lg p-4 flex flex-col justify-end mb-6'>
        <div class='flex items-end h-full gap-2'>
          <div class='flex-1 bg-teal-600 rounded-t-sm' style='height: 70%;'></div>
          <div class='flex-1 bg-red-600 rounded-t-sm' style='height: 50%;'></div>
          <div class='flex-1 bg-green-600 rounded-t-sm' style='height: 60%;'></div>
        </div>
         <div class='flex justify-between text-xs text-gray-700 mt-1'>
           <span>Ingresos</span>
           <span>Gastos</span>
           <span>Beneficio</span>
        </div>
      </div>

      <h3 class='text-xl font-semibold mb-3 text-gray-700'>Conclusiones</h3>
      <p class='text-gray-600'>El mes de enero muestra un balance operativo positivo. Es crucial optimizar la estructura de gastos, especialmente en infraestructura y personal, para mejorar la rentabilidad. Se recomienda revisar el costo de ventas y buscar eficiencias.</p>
    `
  },
];

interface ChatCanvasContentProps {
  reports: Report[];
}

function ChatCanvasContent({ reports }: ChatCanvasContentProps) {
  const { state, dispatch, logout } = useApp();
  const [showPreview, setShowPreview] = useState(true);
  const selectedReport = state.reports.find(r => r.id === state.selectedReportId) ?? state.reports[0];

  const handleLogout = () => {
    logout();
  };

  const handleSendMessage = async (
    content: string,
    attachment?: { type: 'image' | 'file' | 'audio'; name: string; url: string; duration?: number }
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      attachments: attachment ? [attachment] : [],
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: { reportId: state.selectedReportId, message: newMessage },
    });

    // Aquí iría la lógica para procesar el mensaje y obtener la respuesta
    // Por ahora, simulamos una respuesta después de 1 segundo
    // setTimeout(() => {
    //   const responseMessage: Message = {
    //     id: (Date.now() + 1).toString(),
    //     role: 'assistant',
    //     content: 'He procesado tu mensaje. ¿En qué más puedo ayudarte?',
    //     timestamp: new Date(),
    //   };

    //   dispatch({
    //     type: 'ADD_MESSAGE',
    //     payload: { reportId: state.selectedReportId, message: responseMessage },
    //   });
    // }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar para desktop */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: state.sidebarMinimized ? 64 : 288, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex flex-col border-r border-gray-700 bg-gray-800 flex-shrink-0 relative"
      >
        <Sidebar
          reports={state.reports} // Usar state.reports del contexto
          selected={state.selectedReportId}
          onSelect={(id) => dispatch({ type: 'SELECT_REPORT', payload: id })}
          minimized={state.sidebarMinimized}
          setMinimized={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        />
        {/* Botón flotante para controlar el sidebar */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 bg-gray-800 hover:bg-purple-700 text-purple-300 border border-purple-500/60 rounded-full w-8 h-8 shadow-lg"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          title={state.sidebarMinimized ? "Expandir sidebar" : "Minimizar sidebar"}
        >
          {state.sidebarMinimized ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </motion.div>

      {/* Sidebar móvil */}
      <Sheet open={state.isMobileSidebarOpen} onOpenChange={() => dispatch({ type: 'TOGGLE_MOBILE_SIDEBAR' })}>
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
          <Sidebar
            reports={state.reports} // Usar state.reports del contexto
            selected={state.selectedReportId}
            onSelect={(id) => {
              dispatch({ type: 'SELECT_REPORT', payload: id });
              dispatch({ type: 'TOGGLE_MOBILE_SIDEBAR' });
            }}
            minimized={state.sidebarMinimized}
            setMinimized={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          />
        </SheetContent>
      </Sheet>

      {/* Área principal de contenido - Flex container para chat y preview */}
      <div className="flex-1 flex flex-col md:flex-row min-w-0 relative h-full">
        {/* Sección de Chat */}
        <AnimatePresence mode="wait">
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col border-r border-gray-700 min-w-0 z-10 h-full relative"
          >
            <div className="py-4 px-4 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-medium text-purple-300">Chat</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatWindow
                messages={selectedReport?.chat || []} // Usar selectedReport calculado aquí
                onSendMessage={handleSendMessage}
                isLoading={state.isLoading}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Sección de Previsualización */}
        <AnimatePresence mode="wait">
          {showPreview && selectedReport && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full md:w-1/2 lg:w-1/3 border-t md:border-t-0 border-gray-700 flex-shrink-0 z-0 overflow-y-auto relative bg-white"
            >
              <PreviewPane
                 reports={selectedReport.previewItems ? selectedReport.previewItems.map(item => ({ id: selectedReport.id + '-' + item.name.replace(/\s+/g, '-').toLowerCase(), name: item.name, previewHtml: item.html })) : selectedReport.previewHtml ? [{ id: selectedReport.id, name: selectedReport.name, previewHtml: selectedReport.previewHtml }] : []}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menú de usuario (Hamburguesa) sutil en la esquina superior derecha */}
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-purple-600 text-white shadow-lg transition-all duration-300"
            aria-label="Abrir menú de usuario"
          >
            <Menu size={24} />
          </button>
        </SheetTrigger>
        <SheetContent className="bg-gray-900 text-white border-gray-700">
          <div className="flex flex-col space-y-4 p-6">
            <h2 className="text-xl font-bold text-purple-400 mb-4 border-b border-purple-700 pb-4">Menú de Usuario</h2>
            <button className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors duration-200 text-lg">
              <User size={22} />
              Mi Perfil
            </button>
            <button className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors duration-200 text-lg">
              <CreditCard size={22} />
              Mi Plan
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 text-red-400 hover:text-red-500 transition-colors duration-200 text-lg"
            >
              <LogOut size={22} />
              Cerrar Sesión
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Botón flotante para alternar la previsualización (ahora posicionado a la derecha, debajo del botón de menú) */}
      <motion.button
        className="absolute z-50 p-2 rounded-full bg-purple-600 text-white shadow-lg transition-all duration-300 top-16 right-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        onClick={() => setShowPreview(!showPreview)}
        aria-label={showPreview ? 'Cerrar previsualización' : 'Abrir previsualización'}
      >
        {showPreview ? <EyeOff size={24} /> : <Eye size={24} />}
      </motion.button>

    </div>
  );
}

export default function ChatCanvasUI() {
  // Aseguramos que initialReports se pasa
  return (
    <AppProvider initialReports={exampleReports}> 
      <ChatCanvasContent reports={exampleReports} /> 
    </AppProvider>
  );
}
