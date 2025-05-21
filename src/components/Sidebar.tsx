'use client';

import { Button } from "@/components/ui/button";
import { FileText, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  reports: Array<{
    id: string;
    name: string;
    icon: React.ReactNode;
    date: string;
  }>;
  selected: string;
  onSelect: (id: string) => void;
  minimized: boolean;
  setMinimized: (minimized: boolean) => void;
}

export default function Sidebar({ reports, selected, onSelect, minimized, setMinimized }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-gradient-to-b from-[#2d0036]/90 via-[#1a0033]/80 to-[#0e001a]/90 shadow-2xl relative transition-all duration-300 border-r border-purple-900/40 backdrop-blur-xl overflow-y-auto",
        minimized ? "w-16 min-w-[64px] items-center" : "w-72 min-w-[220px]",
        "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-purple-900/60 [&::-webkit-scrollbar-thumb]:bg-purple-500 [&::-webkit-scrollbar-thumb:hover]:bg-purple-400"
      )}
      style={{ boxShadow: minimized ? '0 0 24px 0 #a21caf44' : '0 4px 32px 0 #a21caf55' }}
    >
      {/* Encabezado */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-4 border-b border-purple-900/30",
        minimized ? "justify-center" : "justify-start"
      )}>
        {/* Contenedor del logo y texto */}
        <div className={cn("flex items-center gap-2", minimized && "justify-center w-full flex-col gap-1")}>
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!minimized && (
              <motion.span
                key="VIZUALA"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-extrabold tracking-tight text-purple-100 drop-shadow-lg select-none overflow-hidden"
              >
                VIZUALA
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sección de informes */}
      <div className={cn(
        minimized ? "flex flex-col flex-1 gap-2 pt-6 items-center overflow-y-auto scrollbar-thin" : "flex flex-col flex-1 gap-3 pt-6 pb-8 overflow-y-auto scrollbar-thin",
        "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-purple-900/30 [&::-webkit-scrollbar-thumb]:bg-purple-600 [&::-webkit-scrollbar-thumb:hover]:bg-purple-700"
      )}>
        <div className={cn(
          minimized ? "mb-2 text-xs font-bold text-purple-300 tracking-widest text-center" : "mb-4 text-xs font-bold text-purple-300 tracking-widest pl-3 uppercase flex items-center gap-2"
        )}>
          <span className="inline-flex items-center gap-1">
            <FileText className="w-4 h-4 text-purple-400" />
            {!minimized && "Informes de ejemplo"}
          </span>
        </div>
        <nav className={cn(minimized ? "flex flex-col gap-2 w-full items-center" : "flex flex-col gap-3 w-full", "flex-1")}>
          {reports.map(report => (
            <Button
              key={report.id}
              variant={selected === report.id ? 'default' : 'ghost'}
              onClick={() => onSelect(report.id)}
              className={cn(
                minimized
                  ? "w-12 h-12 p-0 flex items-center justify-center rounded-full transition-all duration-200 border-2 m-1 relative group"
                  : "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 text-left shadow-md border-2 min-h-[64px] card-hover relative",
                selected === report.id
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white border-purple-400 scale-[1.05] shadow-2xl z-10"
                  : "bg-gray-900/70 text-gray-200 hover:bg-purple-700/80 hover:text-white border-transparent hover:scale-[1.01]"
              )}
              title={report.name}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100/30 shadow-inner">
                {report.icon}
              </div>
              {!minimized && (
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <span className="text-base font-bold leading-tight truncate drop-shadow-sm">{report.name}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-purple-200/80 mt-0.5 font-mono">
                    <span className="bg-purple-900/40 px-2 py-0.5 rounded-full shadow text-purple-200/90 font-semibold tracking-wide">{report.date}</span>
                  </span>
                </div>
              )}
              {/* Tooltip para modo minimizado */}
              {minimized && (
                <span className="tooltip absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-xs text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {report.name}
                </span>
              )}
            </Button>
          ))}
        </nav>
      </div>
      {/* Botón nuevo informe - Fuera de la sección de informes para pegarlo abajo */}
      <div className={cn(
        minimized ? "pt-2 w-full flex flex-col items-center" : "pt-4 border-t border-purple-900/30 w-full"
      )}>
        <Button
          variant="default"
          onClick={() => {/* TODO: Implementar nuevo informe */}}
          className={cn(
            minimized
              ? "w-12 h-12 p-0 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500 shadow-lg hover:from-pink-400 hover:to-purple-400 border-2 border-pink-400 mb-2"
              : "w-full flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white rounded-2xl shadow-lg font-semibold text-base mb-2 transition-all duration-200 focus:ring-2 focus:ring-purple-300"
          )}
          title="Nuevo Informe"
        >
          <FileText className={minimized ? "h-6 w-6" : "h-6 w-6 mr-2"} />
          {!minimized && <span>Nuevo Informe</span>}
           {/* Tooltip para modo minimizado */}
          {minimized && (
            <span className="tooltip absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-xs text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              Nuevo Informe
            </span>
          )}
        </Button>
      </div>
    </aside>
  );
}
