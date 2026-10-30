"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Minus,
  CheckCircle2,
  Copy,
  AlertTriangle,
  X,
  QrCode,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import { PRICING_CONFIG } from "@/lib/pricing";

interface AddSeatCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail?: string;
  currentSeats: number;
  maxSeats: number;
  onSuccess?: () => void;
}

export const AddSeatCheckout: React.FC<AddSeatCheckoutProps> = ({
  isOpen,
  onClose,
  userId,
  userEmail = "",
  currentSeats,
  maxSeats,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeUrl: string;
    copyPaste: string;
    amountReais: string;
    expiresAt: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const maxAllowedToAdd = Math.max(0, PRICING_CONFIG.MAX_ADDITIONAL_SEATS - maxSeats);
  const unitPriceReais = (PRICING_CONFIG.ADDITIONAL_SEAT_PRICE_CENTS / 100).toFixed(2);
  const totalAmountReais = ((quantity * PRICING_CONFIG.ADDITIONAL_SEAT_PRICE_CENTS) / 100).toFixed(2);
  const creditsToAdd = quantity * PRICING_CONFIG.CREDITS_PER_ADDITIONAL_SEAT;

  const handleIncrement = () => {
    if (quantity < maxAllowedToAdd) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleGenerateCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payment/add-seat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          customerEmail: userEmail,
          quantity,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Não foi possível gerar a cobrança PIX.");
      }

      setPixData({
        qrCode: data.pix.qrCode,
        qrCodeUrl: data.pix.qrCodeUrl,
        copyPaste: data.pix.copyPaste,
        amountReais: data.amountReais,
        expiresAt: data.expiresAt,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err?.message || "Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!pixData?.copyPaste) return;
    navigator.clipboard.writeText(pixData.copyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho do Modal */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2740F0] border border-blue-200 text-xs font-mono font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Assentos Adicionais Pro</span>
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">
            Adicionar Membros à Equipe
          </h2>
          <p className="text-xs text-slate-500">
            Amplie sua capacidade de operação compartilhando o cofre e o histórico de auditorias.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!pixData ? (
          <div className="space-y-5">
            {maxAllowedToAdd <= 0 ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Limite Máximo Atingido
                </p>
                <p>
                  Sua organização já atingiu o limite de {PRICING_CONFIG.MAX_ADDITIONAL_SEATS} assentos adicionais. Para planos corporativos sob medida, consulte o suporte Enterprise.
                </p>
              </div>
            ) : (
              <>
                {/* Seletor de Quantidade */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Quantidade de Assentos Extras:</span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      Disponíveis: {maxAllowedToAdd} de {PRICING_CONFIG.MAX_ADDITIONAL_SEATS}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="w-9 h-9 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-bold font-mono text-slate-900 w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncrement}
                        disabled={quantity >= maxAllowedToAdd}
                        className="w-9 h-9 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400 block">R$ {unitPriceReais} cada</span>
                      <span className="text-xl font-extrabold font-mono text-[#2740F0]">
                        R$ {totalAmountReais}
                        <span className="text-xs font-normal text-slate-500">/mês</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benefícios Inclusos */}
                <div className="space-y-2 text-xs text-slate-600 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider font-mono">
                    O que está incluso:
                  </span>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#2740F0] shrink-0" />
                      <span>
                        <strong className="text-slate-900">+{creditsToAdd} auditorias adicionais</strong> somadas ao pool da conta.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Perfil <strong>MEMBER</strong> (audita editais e acessa o cofre da empresa).</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Zero acesso a faturamento ou exclusão de dados da organização.</span>
                    </div>
                  </div>
                </div>

                {/* Botão de Ação */}
                <button
                  type="button"
                  onClick={handleGenerateCheckout}
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl text-xs font-mono font-bold text-white bg-[#2740F0] hover:bg-blue-600 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <span>Gerando Cobrança PIX...</span>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>Gerar PIX • R$ {totalAmountReais}</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        ) : (
          /* Visualizador de Pagamento PIX */
          <div className="space-y-5 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                Escaneie o QR Code no seu banco:
              </span>

              {pixData.qrCodeUrl ? (
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pixData.qrCodeUrl}
                    alt="QR Code PIX Pagou.ai"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
              ) : null}

              <div className="text-center">
                <span className="text-2xl font-extrabold font-mono text-slate-900 block">
                  R$ {pixData.amountReais}
                </span>
                <span className="text-[11px] text-slate-500 font-mono flex items-center justify-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-amber-500" />
                  Expira em 30 minutos
                </span>
              </div>
            </div>

            {/* Código Copia e Cola */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-600 block text-left">
                Ou use o código Copia e Cola:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={pixData.copyPaste}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2740F0] hover:bg-blue-600 flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Assim que o PIX for pago, os {creditsToAdd} créditos e assentos serão liberados automaticamente pelo webhook.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
