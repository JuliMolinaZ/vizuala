'use client';

import { Button } from "@/components/ui/button";
import { MessageSquare, Eye, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";


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
    <div
      className={
        minimized
          ? "flex flex-col h-full p-0 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-xl relative w-16 min-w-[64px] transition-all duration-300"
          : "flex flex-col h-full p-0 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl shadow-xl relative w-72 min-w-[220px] transition-all duration-300"
      }
    >
      {/* Botón minimizar/expandir tipo VS Code */}
      <button
        className="absolute top-4 right-[-18px] z-20 w-9 h-9 bg-gray-900 border-2 border-purple-400 rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-all duration-200 group"
        title={minimized ? "Expandir sidebar" : "Minimizar sidebar"}
        onClick={() => setMinimized(!minimized)}
      >
        {minimized ? (
          // Flecha hacia la derecha
          <svg className="w-5 h-5 text-purple-300 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        ) : (
          // Flecha hacia la izquierda
          <svg className="w-5 h-5 text-purple-300 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        )}
      </button>
      <div className={minimized ? "flex flex-col flex-1 gap-2 pt-6 items-center" : "flex flex-col flex-1 gap-3 pt-6 pb-8"}>
        <div className={minimized ? "mb-2 text-xs font-bold text-purple-300 tracking-widest text-center" : "mb-4 text-xs font-bold text-purple-300 tracking-widest pl-3 uppercase"}>
          {!minimized && "Informes de ejemplo"}
        </div>
        <div className={minimized ? "flex flex-col gap-2 w-full items-center" : "flex flex-col gap-3 w-full"}>
          {reports.map(report => (
            <Button
              key={report.id}
              variant={selected === report.id ? 'default' : 'ghost'}
              onClick={() => onSelect(report.id)}
              className={cn(
                minimized
                  ? "w-12 h-12 p-0 flex items-center justify-center rounded-full transition-all duration-200 border-2 m-1"
                  : "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 text-left shadow-md border-2 min-h-[64px]",
                selected === report.id
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white border-purple-400 scale-[1.03] shadow-lg"
                  : "bg-gray-900/70 text-gray-200 hover:bg-purple-700/80 hover:text-white border-transparent hover:scale-[1.01]"
              )}
              title={minimized ? report.name : undefined}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100/30">
                {report.icon}
              </div>
              {!minimized && (
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <span className="text-base font-bold leading-tight truncate">{report.name}</span>
                  <span className="text-xs text-purple-200/80 mt-0.5">{report.date}</span>
                </div>
              )}
            </Button>
          ))}
        </div>
        <div className="pt-4 border-t border-gray-700">
          <Button
            variant="default"
            onClick={() => {/* TODO: Implementar nuevo informe */}}
            className="w-full flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white rounded-2xl shadow-lg font-semibold text-base mt-8 mb-2 transition-all duration-200 focus:ring-2 focus:ring-purple-300"
          >
            <FileText className="h-6 w-6 mr-2" />
            <span>Nuevo Informe</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
