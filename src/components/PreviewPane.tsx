'use client';

import { useState } from 'react';

import { Card } from "@/components/ui/card";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface PreviewPaneProps {
  previewHtml?: string;
}

import { motion, AnimatePresence } from 'framer-motion';

export default function PreviewPane({ previewHtml }: PreviewPaneProps) {
  const [fullScreen, setFullScreen] = useState(false);

  const chartData: ChartData<'bar'> = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [
      {
        label: 'Ventas 2024',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(128, 90, 213, 0.6)',      // purple-500 / 60%
        borderColor:   'rgba(128, 90, 213, 1)',          // purple-500
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(128, 90, 213, 0.8)', // purple-500 / 80%
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#D8B4FE',    // purple-200
          font: {
            size: 14,
            weight: 500,      // ahora es número
          },
        },
      },
      title: {
        display: true,
        text: 'Ventas Mensuales',
        color: '#E9D5FF',     // purple-100
        font: {
          size: 16,
          weight: 600,        // ahora es número
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#E9D5FF',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#E9D5FF',
        },
      },
    },
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Barra superior: solo botón Ver Informe */}
      <div className="flex items-center justify-end gap-3 px-8 pt-8 pb-3">
        <button
          className="btn-primary flex items-center justify-center w-36 h-10 rounded-xl shadow-custom font-semibold text-base"
          title="Ver Informe"
          onClick={() => setFullScreen(true)}
        >
          Ver Informe
        </button>
      </div>

      {/* Modal pantalla completa animado */}
      <AnimatePresence>
        {fullScreen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 p-10 flex flex-col items-center"
              initial={{ scale: 0.92, y: 60, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            >
              <button
                className="absolute top-6 right-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow"
                title="Cerrar"
                onClick={() => setFullScreen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="w-full max-w-2xl prose prose-lg text-foreground" dangerouslySetInnerHTML={{ __html: previewHtml ?? '' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Card className="flex-1 m-6 p-8 overflow-auto bg-card rounded-3xl shadow-2xl flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-start w-full">
          {previewHtml ? (
            <div
              className="prose prose-sm max-w-none text-foreground w-full"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          ) : (
            <>
              <div className="w-full flex flex-col items-center">
                <p className="text-xl font-semibold mb-6 text-foreground text-center">Tu informe aparecerá aquí.</p>
                <div className="w-full max-w-md h-[320px] mb-8 bg-background rounded-xl flex items-center justify-center shadow-custom">
                  {/* Aquí puedes dejar el gráfico de ejemplo o un placeholder visual */}
                </div>
                <p className="text-base text-center max-w-lg text-muted-foreground mb-2">
                  Utiliza el chat para generar contenido y verás la previsualización actualizada en tiempo real.
                </p>
              </div>
            </>
          )}
        </div>

      </Card>
    </div>
  );
}
