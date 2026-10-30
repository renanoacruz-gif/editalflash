"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

interface StateHeroUploadProps {
  onFileSelect: (file: File) => void;
  onUseMockData: () => void;
  errorMessage?: string | null;
  onClearError?: () => void;
  isProcessing?: boolean;
}

export const StateHeroUpload: React.FC<StateHeroUploadProps> = ({
  onFileSelect,
  onUseMockData,
  errorMessage,
  onClearError,
  isProcessing = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProceed = (file: File) => {
    setValidationError(null);
    if (onClearError) onClearError();

    // Validação estrita: deve ser arquivo PDF
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setValidationError("Apenas arquivos no formato .PDF são suportados.");
      return;
    }

    // Validação de tamanho (máximo 40MB)
    if (file.size > 40 * 1024 * 1024) {
      setValidationError("O arquivo excede o limite máximo permitido de 40MB.");
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndProceed(droppedFile);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndProceed(selectedFile);
    }
  };

  const activeError = validationError || errorMessage;

  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-4 py-8 sm:py-16">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept=".pdf,application/pdf"
        className="hidden"
      />

      {/* Small Legal Tech Tag */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs font-medium mb-6 shadow-sm backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span>IA Especializada em Licitações Públicas</span>
        <span className="text-slate-600">|</span>
        <span className="text-blue-400 font-semibold">Lei 14.133/21</span>
      </div>

      {/* H1 Main Title */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
        Transforme{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-400">
          200 páginas
        </span>{" "}
        de burocracia em{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
          2 minutos de clareza.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
        Nossa IA jurídica lê, traduz e extrai automaticamente prazos críticos,
        multas abusivas e requisitos de habilitação de qualquer edital de licitação em PDF.
      </p>

      {/* Upload Zone Card with Floating Badge */}
      <div className="mt-12 w-full max-w-2xl relative">
        {/* Floating Badge */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Análise média: 45 segundos</span>
          </span>
        </div>

        {/* Large Drag & Drop Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-3xl p-10 sm:p-14 text-center transition-all duration-300 border-2 border-dashed ${
            isDragOver
              ? "border-blue-500 bg-blue-950/20 shadow-2xl shadow-blue-500/20 scale-[1.01]"
              : activeError
              ? "border-rose-500/80 bg-rose-950/10 shadow-lg shadow-rose-500/10"
              : "border-slate-700/80 hover:border-blue-500/60 bg-slate-900/50 hover:bg-slate-900/80"
          } backdrop-blur-xl shadow-xl`}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/15 transition-all" />

          <div className="flex flex-col items-center justify-center pt-2">
            {/* Document Icon Box */}
            <div className="relative mb-5">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:border-blue-500/50 transition-all shadow-inner">
                <UploadCloud className="w-8 h-8 transition-transform group-hover:-translate-y-0.5" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full shadow">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Arraste seu edital em PDF aqui
            </h3>
            <p className="mt-2 text-sm text-slate-400 max-w-md">
              Ou clique para selecionar um arquivo PDF do seu dispositivo. Processamento com extração de texto real e conformidade LGPD.
            </p>

            {/* Error Message Box */}
            {activeError && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-5 w-full max-w-md p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center justify-between gap-2 shadow-md animate-fadeIn"
              >
                <div className="flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{activeError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setValidationError(null);
                    if (onClearError) onClearError();
                  }}
                  className="p-1 hover:bg-rose-900/60 rounded text-rose-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Action buttons inside dropzone */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={isProcessing}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-all active:scale-[0.98]"
              >
                <FileText className="w-4 h-4" />
                <span>Selecionar Arquivo PDF</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <span className="text-xs text-slate-500 font-medium">ou</span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUseMockData();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-blue-300 border border-slate-700 hover:border-blue-500/40 transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Usar Dados de Exemplo</span>
              </button>
            </div>

            {/* Footer Trust Markers */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-4 text-xs text-slate-400 flex-wrap justify-center">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Segurança LGPD & Criptografia
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                Compatível com PNCP e Compras.gov
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
