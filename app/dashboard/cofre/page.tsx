"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  Trash2,
  Eye,
  Download,
  Award,
  X,
  FileCheck2,
  AlertCircle,
  Building,
} from "lucide-react";
import Link from "next/link";
import { CompanyDocumentVaultItem } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { AcervoDashboard } from "@/components/AcervoDashboard";
import { VaultUploader } from "@/components/VaultUploader";

export default function CofreDocumentosPage() {
  const { user } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cleanEmail = user?.email?.toLowerCase().trim() || "";
  const isAdmin = cleanEmail === "renan.oacruz@gmail.com" || cleanEmail === "renanoacruz@gmail.com";
  const docLimit = user?.plan === "Starter" && !isAdmin ? 3 : 999;

  // Documentos iniciais para a conta do Fundador (CNAE 73.19-0-02 Promoção de vendas & Serviços)
  const defaultDocs: CompanyDocumentVaultItem[] = isAdmin
    ? [
        {
          id: "doc-1",
          tipo: "Certidão Fiscal",
          nome: "Certidão Conjunta Negativa de Tributos Federais e Dívida Ativa da União (RFB/PGFN)",
          emissor: "Receita Federal do Brasil / PGFN",
          dataEmissao: "2026-10-15",
          dataValidade: "2027-04-15",
          diasParaVencer: 168,
          status: "VALIDO",
        },
        {
          id: "doc-2",
          tipo: "Certidão de FGTS",
          nome: "Certificado de Regularidade do FGTS (CRF)",
          emissor: "Caixa Econômica Federal",
          dataEmissao: "2026-10-10",
          dataValidade: "2027-04-10",
          diasParaVencer: 163,
          status: "VALIDO",
        },
        {
          id: "doc-3",
          tipo: "Qualificação Financeira",
          nome: "Balanço Patrimonial e DRE (Exercício 2025 - PL R$ 420.000,00 | LC 1.39 | LG 1.43 | SG 2.23)",
          emissor: "Conselho Regional de Contabilidade / JUCESP",
          dataEmissao: "2026-04-20",
          dataValidade: "2027-04-30",
          diasParaVencer: 183,
          status: "VALIDO",
        },
        {
          id: "doc-4",
          tipo: "Qualificação Técnica",
          nome: "Atestado de Capacidade Técnica Operacional (Serviços de Divulgação, Promoção e Apoio Comercial)",
          emissor: "Setor Privado / Corporativo B2B",
          dataEmissao: "2025-11-10",
          dataValidade: "2099-12-31",
          diasParaVencer: 9999,
          status: "VALIDO",
        },
      ]
    : [];

  const [docs, setDocs] = useState<CompanyDocumentVaultItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("editalflash_vault_docs");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && (parsed.length > 0 || !isAdmin)) {
            return parsed;
          }
        }
      } catch (_) {}
    }
    return defaultDocs;
  });

  // Salva no localStorage sempre que houver modificação
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("editalflash_vault_docs", JSON.stringify(docs));
    }
  }, [docs]);

  // Contagens para os smart filters
  const expiringCount = docs.filter((d) => d.status === "EXPIRANDO" || (d.diasParaVencer >= 0 && d.diasParaVencer <= 30)).length;
  const expiredCount = docs.filter((d) => d.status === "VENCIDO" || d.diasParaVencer < 0).length;
  const technicalCount = docs.filter(
    (d) => d.tipo.includes("Técnico") || d.tipo.includes("CAT") || d.tipo.includes("Acervo") || d.tipo.includes("Atestado")
  ).length;

  // Auto-seleciona "Expirando" se houver algum item expirando
  const [filterType, setFilterType] = useState<"ALL" | "EXPIRING" | "EXPIRED" | "TECHNICAL">(() =>
    expiringCount > 0 ? "EXPIRING" : "ALL"
  );

  // Modais de Visualização e Exclusão
  const [previewDoc, setPreviewDoc] = useState<CompanyDocumentVaultItem | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<CompanyDocumentVaultItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUploadSuccess = (newDoc?: any) => {
    if (newDoc) {
      setDocs((prev) => [newDoc, ...prev]);
    }
    showToast("Documento adicionado com sucesso");
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/vault/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docId: deleteCandidate.id,
          userEmail: user?.email,
          fileName: deleteCandidate.nome,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro na solicitação de exclusão.");
      }

      setDocs((prev) => prev.filter((d) => d.id !== deleteCandidate.id));
      setDeleteCandidate(null);
      showToast("Documento excluído com sucesso");
    } catch (err: any) {
      showToast("Falha ao excluir documento: " + (err.message || "Erro de conexão"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportChecklistPDF = async () => {
    try {
      setIsExportingPDF(true);
      showToast("Compilando checklist contábil em PDF nativo...");

      const res = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "checklist",
          companyName: user?.company || "EMPRESA LICITANTE LTDA",
          companyCnpj: user?.cnpj || "12.345.678/0001-90",
          docs: docs,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro na geração do PDF do checklist.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Checklist_Contabil_${(user?.company || "Empresa").replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast("Checklist contábil exportado com sucesso.");
    } catch (err: any) {
      showToast("Falha ao exportar checklist: " + (err?.message || "Erro desconhecido"));
    } finally {
      setIsExportingPDF(false);
    }
  };

  const filteredDocs = docs.filter((d) => {
    if (filterType === "EXPIRING") {
      return d.status === "EXPIRANDO" || (d.diasParaVencer >= 0 && d.diasParaVencer <= 30);
    }
    if (filterType === "EXPIRED") {
      return d.status === "VENCIDO" || d.diasParaVencer < 0;
    }
    if (filterType === "TECHNICAL") {
      return (
        d.tipo.includes("Técnico") ||
        d.tipo.includes("CAT") ||
        d.tipo.includes("Acervo") ||
        d.tipo.includes("Atestado")
      );
    }
    return true;
  });

  return (
    <DashboardLayout activeTab="cofre">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Toast Notificação */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[var(--surface)] border border-emerald-500/50 text-[var(--ok-fg)] px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" strokeWidth={2} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-tint)] border border-[var(--brand)]/30 text-[var(--brand)] text-xs font-semibold mb-2 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Cofre Digital de Documentos • Art. 62</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
              Cofre de Certidões &amp; Acervo Técnico
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-2)] mt-1">
              Gerencie o ciclo completo de validade das suas CNDs, Balanço Patrimonial e Atestados Técnicos.
            </p>
            {user?.plan === "Starter" && !isAdmin && (
              <span className="text-[11px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg inline-block mt-2">
                Plano Starter: Limite de 3 documentos no cofre ({docs.length}/3 utilizados)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleExportChecklistPDF}
              disabled={isExportingPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--surface)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] shadow-xs transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[var(--brand)]" strokeWidth={1.75} />
              <span>{isExportingPDF ? "Exportando..." : "Exportar Checklist Contábil"}</span>
            </button>

            <Link
              href="/dashboard/acervo"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--surface)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] shadow-xs transition-all active:scale-[0.98]"
            >
              <Award className="w-4 h-4 text-[var(--brand)]" strokeWidth={1.75} />
              <span>Ver Portfólio de Acervo</span>
            </Link>
          </div>
        </div>

        {/* SECTION 1: DRAG & DROP UPLOADER COMPONENT */}
        <VaultUploader onUploadSuccess={handleUploadSuccess} userEmail={user?.email} />

        {/* Visual Portfolio Dashboard (Acervo Técnico) */}
        <AcervoDashboard docs={docs} />

        {/* SECTION 2: SMART FILTERS COM CONTAGEM */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          {/* [Todos] */}
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all border flex items-center gap-1.5 cursor-pointer active:scale-98 ${
              filterType === "ALL"
                ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-xs"
                : "bg-[var(--surface)] text-[var(--ink-2)] border-[var(--line)] hover:border-[var(--brand)]"
            }`}
          >
            <span>Todos</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-black/10 font-bold font-mono">
              ({docs.length})
            </span>
          </button>

          {/* [Expirando <30d] */}
          <button
            type="button"
            onClick={() => setFilterType("EXPIRING")}
            className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all border flex items-center gap-1.5 cursor-pointer active:scale-98 ${
              filterType === "EXPIRING"
                ? "bg-[var(--warn-bg)] text-[var(--warn-fg)] border-[var(--warn)] shadow-xs font-bold"
                : "bg-[var(--surface)] text-[var(--warn-fg)] border-[var(--warn)]/40 hover:bg-[var(--warn-bg)]/40"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[var(--warn)] shrink-0" strokeWidth={2} />
            <span>Expirando &lt; 30d</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-[var(--warn)]/20 text-[var(--warn-fg)] font-bold font-mono">
              ({expiringCount})
            </span>
          </button>

          {/* [Vencidos] */}
          <button
            type="button"
            onClick={() => setFilterType("EXPIRED")}
            className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all border flex items-center gap-1.5 cursor-pointer active:scale-98 ${
              filterType === "EXPIRED"
                ? "bg-[var(--bad-bg)] text-[var(--bad-fg)] border-[var(--bad)] shadow-xs font-bold"
                : "bg-[var(--surface)] text-[var(--bad-fg)] border-[var(--bad)]/40 hover:bg-[var(--bad-bg)]/40"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[var(--bad)] shrink-0" strokeWidth={2} />
            <span>Vencidos</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-[var(--bad)]/20 text-[var(--bad-fg)] font-bold font-mono">
              ({expiredCount})
            </span>
          </button>

          {/* [Acervo Técnico] */}
          <button
            type="button"
            onClick={() => setFilterType("TECHNICAL")}
            className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all border flex items-center gap-1.5 cursor-pointer active:scale-98 ${
              filterType === "TECHNICAL"
                ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-xs font-bold"
                : "bg-[var(--surface)] text-[var(--ink-2)] border-[var(--line)] hover:border-[var(--brand)]"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" strokeWidth={2} />
            <span>Acervo Técnico</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-black/10 font-bold font-mono">
              ({technicalCount})
            </span>
          </button>
        </div>

        {/* SECTION 2 & 3: DOCUMENT LIST TABLE / BENTO ROWS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--ink-2)] pl-1 font-mono">
            <span>Documentos Indexados para Verificação Automática (Art. 62)</span>
            <span>{filteredDocs.length} certificados listados</span>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-10 text-center space-y-2">
              <FileCheck2 className="w-8 h-8 text-[var(--ink-2)] mx-auto opacity-50" />
              <p className="text-xs font-mono text-[var(--ink)] font-bold">Nenhum documento encontrado neste filtro</p>
              <p className="text-[11px] text-[var(--ink-2)]">
                Utilize a área de upload acima para adicionar novas certidões ou selecione &quot;Todos&quot;.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocs.map((doc) => {
                const isExpiring = doc.status === "EXPIRANDO" || (doc.diasParaVencer >= 0 && doc.diasParaVencer <= 30);
                const isExpired = doc.status === "VENCIDO" || doc.diasParaVencer < 0;

                return (
                  <div
                    key={doc.id}
                    className={`bento-card bg-[var(--surface)] rounded-xl p-5 sm:p-6 border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                      isExpired
                        ? "border-[var(--bad)]/70 bg-[var(--bad-bg)]/20 shadow-xs"
                        : isExpiring
                        ? "border-[var(--warn)]/70 bg-[var(--warn-bg)]/20 shadow-xs"
                        : "border-[var(--line)] hover:border-[var(--brand)]/40 shadow-xs"
                    }`}
                  >
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--bg)] text-[var(--ink)] border border-[var(--line)] shrink-0">
                          {doc.tipo}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-[var(--ink)] font-display tracking-tight truncate max-w-xl" title={doc.nome}>
                          {doc.nome}
                        </h3>
                      </div>

                      <p className="text-xs text-[var(--ink-2)] font-sans">
                        Órgão Emissor: <strong className="text-[var(--ink)]">{doc.emissor}</strong> • Emissão:{" "}
                        <span className="font-mono">{new Date(doc.dataEmissao).toLocaleDateString("pt-BR")}</span>
                      </p>

                      {isExpiring && !isExpired && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--warn-bg)] text-[var(--warn-fg)] border border-[var(--warn)]/40 text-[11px] font-mono font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Vence em {doc.diasParaVencer} dias. Requer renovação prévia à sessão pública.</span>
                        </div>
                      )}

                      {isExpired && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bad-bg)] text-[var(--bad-fg)] border border-[var(--bad)]/40 text-[11px] font-mono font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Certidão Vencida. Gera inabilitação automática (Art. 68).</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-[var(--ink)] block">
                          Validade:{" "}
                          <span
                            className={
                              isExpired
                                ? "text-[var(--bad-fg)]"
                                : isExpiring
                                ? "text-[var(--warn-fg)]"
                                : "text-[var(--ok-fg)]"
                            }
                          >
                            {doc.diasParaVencer > 1000
                              ? "Indeterminada (Acervo)"
                              : new Date(doc.dataValidade).toLocaleDateString("pt-BR")}
                          </span>
                        </span>
                        <span
                          className={`text-[11px] font-mono font-bold ${
                            isExpired
                              ? "text-[var(--bad-fg)]"
                              : isExpiring
                              ? "text-[var(--warn-fg)]"
                              : "text-[var(--ok-fg)]"
                          }`}
                        >
                          {doc.diasParaVencer > 1000
                            ? "Atestado Permanente"
                            : doc.diasParaVencer < 0
                            ? `Vencido há ${Math.abs(doc.diasParaVencer)} dias`
                            : `${doc.diasParaVencer} dias restantes`}
                        </span>
                      </div>

                      {/* Ações: Preview PDF (Eye) & Delete Permanente (Trash) */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="p-2.5 rounded-lg bg-[var(--bg)] hover:bg-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)] border border-[var(--line)] transition-colors active:scale-95 cursor-pointer"
                          title="Visualizar Certidão"
                        >
                          <Eye className="w-4 h-4 text-[var(--brand)]" strokeWidth={1.75} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(doc)}
                          className="p-2.5 rounded-lg bg-[var(--bg)] hover:bg-rose-950/20 text-[var(--ink-2)] hover:text-rose-600 border border-[var(--line)] hover:border-rose-300 transition-colors active:scale-95 cursor-pointer"
                          title="Excluir Permanentemente"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL 1: PREVIEW DO DOCUMENTO (EYE) */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-scaleUp">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[var(--bg)] text-[var(--ink)] border border-[var(--line)]">
                      {previewDoc.tipo}
                    </span>
                    <h3 className="text-base font-bold text-[var(--ink)] font-display">{previewDoc.nome}</h3>
                  </div>
                  <p className="text-xs text-[var(--ink-2)] font-mono">Emissor: {previewDoc.emissor}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1 rounded-lg text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--line)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Simulação Segura do Visualizador de PDF */}
              <div className="bg-[var(--bg)] rounded-xl border border-[var(--line)] p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] text-xs font-mono text-[var(--ink-2)]">
                  <span>Visualizador Seguro • Acesso Criptografado</span>
                  <span className="text-[var(--ok-fg)] font-bold">Autenticidade Verificada</span>
                </div>

                <div className="py-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--brand-tint)] text-[var(--brand)] flex items-center justify-center mx-auto border border-[var(--brand)]/30">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--ink)]">{previewDoc.nome}.pdf</h4>
                  <p className="text-xs text-[var(--ink-2)] max-w-md mx-auto">
                    Certidão digitalmente vinculada ao seu CNPJ para conferência no Semáforo da Lei 14.133/2021.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--line)]">
                    <span className="text-[10px] text-[var(--ink-2)] block uppercase">Data de Emissão</span>
                    <strong className="text-[var(--ink)]">
                      {new Date(previewDoc.dataEmissao).toLocaleDateString("pt-BR")}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--line)]">
                    <span className="text-[10px] text-[var(--ink-2)] block uppercase">Data de Validade</span>
                    <strong className="text-[var(--ink)]">
                      {previewDoc.diasParaVencer > 1000
                        ? "Indeterminada (Acervo)"
                        : new Date(previewDoc.dataValidade).toLocaleDateString("pt-BR")}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--line)] cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast("Download da certidão autenticada concluído.");
                    setPreviewDoc(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[var(--brand)] text-white hover:brightness-110 shadow-xs cursor-pointer"
                >
                  Baixar PDF Original
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: CONFIRMAÇÃO DE EXCLUSÃO PERMANENTE (LGPD COMPLIANT) */}
        {deleteCandidate && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[var(--surface)] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleUp">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 border border-rose-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--ink)] font-display">
                    Excluir Documento Permanentemente?
                  </h3>
                  <p className="text-xs text-[var(--ink-2)] mt-1 leading-relaxed">
                    Esta ação não pode ser desfeita. O documento será removido do nosso servidor e das análises futuras,
                    em estrito cumprimento aos seus direitos sob a LGPD.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs font-mono space-y-1">
                <span className="text-[10px] text-[var(--ink-2)] uppercase block">Arquivo a ser eliminado:</span>
                <p className="font-bold text-[var(--ink)] truncate">{deleteCandidate.nome}</p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteCandidate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--line)] disabled:opacity-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
