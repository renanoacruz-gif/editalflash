"use client";

/**
 * components/FileUpload.tsx (Atualizado com Pilar 1: Botão "Buscar no PNCP")
 */

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
  Search,
} from "lucide-react";
import { EditalAnalysisResponse } from "@/lib/types";
import { PncpModal } from "./PncpModal";
import { useAuth } from "@/lib/auth-context";

interface FileUploadProps {
  onAnalysisStart: (fileName: string) => void;
  onAnalysisSuccess: (data: EditalAnalysisResponse) => void;
  onAnalysisError: (errorMessage: string) => void;
  onUseExampleData: () => void;
  isLoading?: boolean;
  overrideVertical?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onAnalysisStart,
  onAnalysisSuccess,
  onAnalysisError,
  onUseExampleData,
  isLoading = false,
  overrideVertical,
}) => {
  const { user } = useAuth();
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPncpOpen, setIsPncpOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processAndUploadFile = async (file: File) => {
    setErrorMessage(null);

    const isPdf =
      file.name.toLowerCase().endsWith(".pdf") ||
      file.type === "application/pdf" ||
      file.type === "application/x-pdf";

    if (!isPdf) {
      const msg = "Formato de arquivo inválido. Por favor, envie exclusivamente um documento em PDF.";
      setErrorMessage(msg);
      onAnalysisError(msg);
      return;
    }

    if (file.size > 40 * 1024 * 1024) {
      const msg = "O arquivo selecionado excede o limite máximo permitido de 40MB.";
      setErrorMessage(msg);
      onAnalysisError(msg);
      return;
    }

    try {
      onAnalysisStart(file.name);

      const effectiveVertical = overrideVertical || user?.primary_vertical || "Obras Públicas e Engenharia";
      const formData = new FormData();
      formData.append("file", file);
      formData.append("vertical", effectiveVertical);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "x-user-vertical": effectiveVertical,
          ...(user?.id ? { "x-user-id": user.id } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || `Erro na análise do documento (HTTP ${response.status})`);
      }

      onAnalysisSuccess(data as EditalAnalysisResponse);
    } catch (err: any) {
      console.error("[FILE_UPLOAD] Erro:", err);
      const userFriendlyMessage =
        err?.message || "Não foi possível processar o edital. Verifique o arquivo e tente novamente.";
      setErrorMessage(userFriendlyMessage);
      onAnalysisError(userFriendlyMessage);
    }
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
      processAndUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processAndUploadFile(e.target.files[0]);
    }
  };

  const handlePncpSelect = (editalData: EditalAnalysisResponse, title: string) => {
    onAnalysisStart(title || "Edital_PNCP.pdf");
    setTimeout(() => {
      onAnalysisSuccess(editalData);
    }, 600);
  };

  return (
    <>
      {/* Modal de Busca do PNCP */}
      <PncpModal
        isOpen={isPncpOpen}
        onClose={() => setIsPncpOpen(false)}
        onSelectEdital={handlePncpSelect}
      />

      <div className="w-full max-w-3xl mx-auto relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          accept=".pdf,application/pdf"
          className="hidden"
        />

        {/* Floating Badge */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Análise média: 45 segundos</span>
          </span>
        </div>

        {/* Caixa de Upload */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`relative group cursor-pointer rounded-3xl p-10 sm:p-14 text-center transition-all duration-300 border-2 border-dashed ${
            isDragOver
              ? "border-blue-500 bg-blue-950/20 shadow-2xl shadow-blue-500/20 scale-[1.01]"
              : errorMessage
              ? "border-rose-500/80 bg-rose-950/10 shadow-lg shadow-rose-500/10"
              : "border-slate-700/80 hover:border-blue-500/60 bg-slate-900/50 hover:bg-slate-900/80"
          } backdrop-blur-xl shadow-xl`}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/15 transition-all" />

          <div className="flex flex-col items-center justify-center pt-2">
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
              Ou selecione um arquivo PDF do seu computador. Você também pode consultar diretamente o banco oficial do PNCP.
            </p>

            {/* Alerta de Erro */}
            {errorMessage && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-5 w-full max-w-md p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/60 text-rose-300 text-xs flex items-center justify-between gap-2 shadow-md animate-fadeIn"
              >
                <div className="flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="p-1 hover:bg-rose-900/60 rounded text-rose-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Grupo de Botões (Upload PDF | Buscar no PNCP | Usar Dados de Exemplo) */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                <span>{isLoading ? "Processando..." : "Selecionar Arquivo PDF"}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Pilar 1: Botão Buscar no PNCP */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPncpOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all active:scale-[0.98]"
              >
                <Search className="w-4 h-4" />
                <span>Buscar no PNCP</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUseExampleData();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 hover:border-amber-500/60 transition-all active:scale-[0.98]"
                title="Carrega visualização demonstrativa com dados simulados"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Usar Exemplo (Demonstração)</span>
              </button>
            </div>

            {/* Indicadores */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-4 text-xs text-slate-400 flex-wrap justify-center">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Segurança LGPD & Criptografia
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                Integração PNCP, Compras.gov & BEC
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
