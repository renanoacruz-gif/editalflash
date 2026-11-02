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
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#1E3A8A] text-white shadow-xs border border-[#1E3A8A]/30 font-sans">
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
          className={`relative group cursor-pointer rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 border-2 border-dashed ${
            isDragOver
              ? "border-[#1E3A8A] bg-[#EFF6FF] scale-[1.005]"
              : errorMessage
              ? "border-[#991B1B]/40 bg-[#FEF2F2]"
              : "border-[#CBD5E1] hover:border-[#1E3A8A]/60 bg-white hover:bg-[#F8FAFC]"
          } shadow-xs`}
        >
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#1E3A8A] group-hover:border-[#1E3A8A]/40 transition-colors shadow-xs">
                <UploadCloud className="w-7 h-7 transition-transform group-hover:-translate-y-0.5" />
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight font-display">
              Arraste seu edital em PDF aqui
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-[#475569] max-w-md font-sans">
              Ou selecione um arquivo PDF do seu computador. Você também pode consultar diretamente o banco oficial do PNCP.
            </p>

            {/* Alerta de Erro */}
            {errorMessage && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-4 w-full max-w-md p-3 rounded-lg bg-[#FEF2F2] border border-[#991B1B]/30 text-[#991B1B] text-xs flex items-center justify-between gap-2 shadow-xs"
              >
                <div className="flex items-center gap-2 text-left font-medium">
                  <AlertCircle className="w-4 h-4 text-[#991B1B] shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="p-1 hover:bg-[#FEE2E2] rounded text-[#991B1B] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Grupo de Botões (Upload PDF | Buscar no PNCP | Usar Dados de Exemplo) */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-[#1E3A8A] hover:bg-[#1E40AF] text-white shadow-xs transition-colors active:scale-[0.98] disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                <span>{isLoading ? "Processando..." : "Selecionar Arquivo PDF"}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Pilar 1: Botão Buscar no PNCP */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPncpOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] shadow-xs transition-colors active:scale-[0.98]"
              >
                <Search className="w-4 h-4 text-[#1E3A8A]" />
                <span>Buscar no PNCP</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUseExampleData();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-medium bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] transition-colors active:scale-[0.98]"
                title="Carrega visualização demonstrativa com dados simulados"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>Usar Exemplo</span>
              </button>
            </div>

            {/* Indicadores */}
            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center gap-4 text-xs text-[#64748B] flex-wrap justify-center font-sans">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#065F46]" />
                Segurança LGPD &amp; Criptografia
              </span>
              <span className="text-[#CBD5E1]">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#1E3A8A]" />
                Integração PNCP, Compras.gov &amp; BEC
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
