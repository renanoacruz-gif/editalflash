import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { sanitizeFilename } from "@/lib/validations";

interface VaultUploaderProps {
  onUploadSuccess: (newDoc?: any) => void;
  userEmail?: string;
}

export function VaultUploader({ onUploadSuccess, userEmail }: VaultUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);

    // Validações no cliente
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Formato inválido. Apenas arquivos PDF são aceitos no Cofre.");
      return;
    }

    const MAX_SIZE = 15 * 1024 * 1024; // 15MB
    if (file.size > MAX_SIZE) {
      setErrorMessage("Arquivo muito grande. O limite máximo permitido é de 15MB.");
      return;
    }

    if (file.size === 0) {
      setErrorMessage("Arquivo corrompido ou vazio.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    try {
      const sanitizedName = sanitizeFilename(file.name);
      const formData = new FormData();
      formData.append("file", file, sanitizedName);
      if (userEmail) {
        formData.append("userEmail", userEmail);
      }

      // Simulação visual de progresso suave antes do retorno do backend
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 150);

      const res = await fetch("/api/vault/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressTimer);
      setUploadProgress(100);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Falha ao processar e salvar documento.");
      }

      // Sucesso
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onUploadSuccess(data.doc);
      }, 400);
    } catch (err: any) {
      setIsUploading(false);
      setUploadProgress(0);
      setErrorMessage(err.message || "Erro inesperado durante o upload.");
    }
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer select-none ${
          isDragging
            ? "border-[var(--brand)] bg-[var(--brand-tint)]/30 scale-[1.005]"
            : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--brand)]/80 hover:bg-[var(--surface)]/90"
        } ${isUploading ? "pointer-events-none opacity-85" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              isDragging
                ? "bg-[var(--brand)] text-white shadow-md shadow-[var(--brand)]/30"
                : "bg-[var(--bg)] text-[var(--brand)] border border-[var(--line)]"
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-[var(--brand)]" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--ink)]">
              {isUploading ? "Processando e Indexando Certidão..." : "Arraste e solte o PDF da sua certidão ou clique aqui"}
            </h4>
            <p className="text-xs text-[var(--ink-2)]">
              PDF nativo ou digitalizado até 15MB • CND Federal, FGTS, Balanço Patrimonial, Atestados e CATs
            </p>
          </div>

          {/* Barra de Progresso Real */}
          {isUploading && (
            <div className="w-full max-w-xs space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-mono font-semibold text-[var(--ink-2)]">
                <span>Enviando para o Cofre Seguro...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--line)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--brand)] transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alerta de Erro */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-[var(--bad-bg)] border border-[var(--bad)]/40 text-[var(--bad-fg)] text-xs font-semibold flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[var(--bad)]" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:text-[var(--ink)] text-[var(--bad-fg)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
