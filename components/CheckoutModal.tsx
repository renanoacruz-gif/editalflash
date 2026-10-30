"use client";

import React, { useState } from "react";
import { BrandIcon } from "@/components/brand-icons";
import { useAuth } from "@/lib/auth-context";
import { PaymentMethod, CheckoutResponse } from "@/lib/checkout-service";

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    type: "CREDIT_PACKAGE" | "PLAN_UPGRADE" | "SETUP_FEE";
    id: string;
    title: string;
    amount: number;
    description: string;
    creditsToAdd?: number;
    newPlan?: "Starter" | "Pro" | "Enterprise";
    billingCycle?: "monthly" | "annual";
  } | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const { user, selectPlan, addCredits } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const [loading, setLoading] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Dados cadastrais do pagador
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [cpfCnpj, setCpfCnpj] = useState(user?.cnpj || "");
  const [phone, setPhone] = useState("(11) 98765-4321");

  // Cartão de crédito
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  if (!isOpen || !item) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/checkout/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: item.type,
          itemId: item.id,
          title: item.title,
          amount: item.amount,
          creditsToAdd: item.creditsToAdd,
          newPlan: item.newPlan,
          billingCycle: item.billingCycle,
          customer: {
            name: name || user?.name || "Licitante",
            email: email || user?.email || "contato@licitante.com.br",
            cpfCnpj: cpfCnpj || "12.345.678/0001-90",
            phone,
          },
          paymentMethod,
        }),
      });

      const data: CheckoutResponse = await res.json();
      if (res.ok && data.success) {
        setCheckoutResult(data);
        if (paymentMethod === "CREDIT_CARD" && data.status === "CONFIRMED") {
          applyImmediateFulfillment();
        }
      } else {
        alert("Não foi possível gerar a transação. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o serviço de pagamentos.");
    } finally {
      setLoading(false);
    }
  };

  const applyImmediateFulfillment = () => {
    setPaymentSuccess(true);
    if (item.type === "CREDIT_PACKAGE" && item.creditsToAdd) {
      addCredits(item.creditsToAdd);
    } else if (item.type === "PLAN_UPGRADE" && item.newPlan) {
      selectPlan(item.newPlan, item.billingCycle || "monthly");
    }
  };

  const handleCopyPix = () => {
    if (checkoutResult?.pix?.copyPaste) {
      navigator.clipboard.writeText(checkoutResult.pix.copyPaste);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    }
  };

  const handleSimulateInstantPixConfirm = () => {
    // Simulação do Webhook instantâneo de aprovação do BACEN/Asaas
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      applyImmediateFulfillment();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto selection:bg-[var(--brand)] selection:text-white">
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl max-w-lg w-full p-6 sm:p-7 space-y-6 shadow-2xl relative">
        {/* Header do Checkout */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--line)]">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--brand)] font-bold block">
              Ambiente Seguro • Checkout Criptografado
            </span>
            <h2 className="text-xl font-bold font-display text-[var(--ink)]">
              {item.title}
            </h2>
            <p className="text-xs text-[var(--ink-2)]">
              {item.description}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--bg)] transition-colors"
          >
            <BrandIcon name="fechar" size="s16" accentCobalt={false} />
          </button>
        </div>

        {/* Resumo do Pedido */}
        <div className="p-4 rounded-lg bg-[var(--bg)] border border-[var(--line)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-[var(--ink-2)] block">Total a pagar:</span>
            <strong className="text-2xl font-mono font-bold text-[var(--ink)]">
              R$ {item.amount.toLocaleString("pt-BR")},00
            </strong>
          </div>
          <div className="text-right text-[11px] font-mono text-[var(--ok-fg)] bg-[var(--ok-bg)] px-2.5 py-1 rounded border border-[var(--ok)]/30 font-semibold">
            Liberação Automática
          </div>
        </div>

        {paymentSuccess ? (
          /* TELA DE SUCESSO / CONFIRMAÇÃO */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[var(--ok-bg)] border border-[var(--ok)] text-[var(--ok-fg)] flex items-center justify-center mx-auto">
              <BrandIcon name="check" size="s24" accentCobalt={false} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[var(--ink)] font-display">
                Pagamento Aprovado com Sucesso.
              </h3>
              <p className="text-xs text-[var(--ink-2)] max-w-sm mx-auto">
                {item.type === "CREDIT_PACKAGE"
                  ? `Foram adicionados ${item.creditsToAdd} créditos à sua conta. Você já pode emitir novos pareceres.`
                  : `Seu plano foi atualizado para ${item.newPlan}. Todos os novos recursos já estão liberados.`}
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  window.location.reload();
                }}
                className="w-full py-2.5 rounded bg-[var(--brand)] text-white text-xs font-bold hover:brightness-110 shadow-xs transition-all"
              >
                Continuar para o Dashboard
              </button>
            </div>
          </div>
        ) : checkoutResult?.pix ? (
          /* TELA DE PIX DINÂMICO GERADO */
          <div className="space-y-4 text-center">
            <div className="p-3 bg-white rounded-lg inline-block border border-[var(--line)] shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={checkoutResult.pix.qrCodeImage}
                alt="QR Code PIX Dinâmico"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-[var(--ink-2)] block">
                Abra o app do seu banco e aponte a câmera para o QR Code acima.
              </span>

              <div className="flex items-center gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  readOnly
                  value={checkoutResult.pix.copyPaste}
                  className="w-full py-1.5 px-2.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[11px] font-mono text-[var(--ink-2)] select-all truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="px-3 py-1.5 rounded bg-[var(--brand)] text-white font-mono text-xs font-semibold shrink-0 hover:brightness-110 transition-all"
                >
                  {copiedPix ? "Copiado." : "Copiar"}
                </button>
              </div>
            </div>

            {/* Simulação de Confirmação Instantânea (Bacen Webhook) */}
            <div className="pt-4 border-t border-[var(--line)]">
              <button
                type="button"
                disabled={loading}
                onClick={handleSimulateInstantPixConfirm}
                className="w-full py-2.5 rounded bg-[var(--ok-bg)] text-[var(--ok-fg)] border border-[var(--ok)]/40 hover:brightness-95 text-xs font-mono font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <BrandIcon name="check" size="s16" accentCobalt={false} />
                <span>{loading ? "Confirmando Compensação BACEN..." : "Simular Pagamento Concluído (PIX Aprovado)"}</span>
              </button>
            </div>
          </div>
        ) : checkoutResult?.boleto ? (
          /* TELA DE BOLETO BANCÁRIO REGISTRADO */
          <div className="space-y-4">
            <div className="p-4 rounded bg-[var(--bg)] border border-[var(--line)] space-y-2 font-mono text-xs">
              <div className="flex justify-between text-[var(--ink-2)]">
                <span>Vencimento:</span>
                <strong className="text-[var(--ink)]">{checkoutResult.boleto.dueDate}</strong>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-[var(--ink-2)]">Linha Digitável:</span>
                <div className="p-2 bg-[var(--surface)] rounded border border-[var(--line)] text-[11px] break-all select-all">
                  {checkoutResult.boleto.digitableLine}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(checkoutResult.boleto!.digitableLine);
                  alert("Código de barras copiado.");
                }}
                className="flex-1 py-2 rounded bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink)] hover:bg-[var(--line)]/40"
              >
                Copiar Linha Digitável
              </button>
              <button
                type="button"
                onClick={applyImmediateFulfillment}
                className="flex-1 py-2 rounded bg-[var(--brand)] text-white text-xs font-mono font-bold hover:brightness-110"
              >
                Simular Compensação
              </button>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO DE SELEÇÃO E DADOS */
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            {/* Seletor de Método de Pagamento */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("PIX")}
                className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold transition-all flex flex-col items-center gap-1 ${
                  paymentMethod === "PIX"
                    ? "bg-[var(--brand-tint)]/40 border-[var(--brand)] text-[var(--brand)] shadow-xs"
                    : "bg-[var(--bg)] border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--ink)]"
                }`}
              >
                <span>PIX</span>
                <span className="text-[9px] font-normal text-[var(--ok-fg)] font-mono">Imediato</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("BOLETO")}
                className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold transition-all flex flex-col items-center gap-1 ${
                  paymentMethod === "BOLETO"
                    ? "bg-[var(--brand-tint)]/40 border-[var(--brand)] text-[var(--brand)] shadow-xs"
                    : "bg-[var(--bg)] border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--ink)]"
                }`}
              >
                <span>Boleto</span>
                <span className="text-[9px] font-normal text-[var(--ink-2)] font-mono">Até 1 dia útil</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("CREDIT_CARD")}
                className={`py-2 px-3 rounded-lg border text-xs font-mono font-bold transition-all flex flex-col items-center gap-1 ${
                  paymentMethod === "CREDIT_CARD"
                    ? "bg-[var(--brand-tint)]/40 border-[var(--brand)] text-[var(--brand)] shadow-xs"
                    : "bg-[var(--bg)] border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--ink)]"
                }`}
              >
                <span>Cartão</span>
                <span className="text-[9px] font-normal text-[var(--brand)] font-mono">Até 12x</span>
              </button>
            </div>

            {/* Dados de Faturamento */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-mono text-[var(--ink-2)] block mb-1">
                  Nome / Razão Social:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Construtora e Comércio Ltda"
                  className="w-full py-2 px-3 rounded bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--ink)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-mono text-[var(--ink-2)] block mb-1">
                    CNPJ / CPF:
                  </label>
                  <input
                    type="text"
                    required
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full py-2 px-3 rounded bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--ink)] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[var(--ink-2)] block mb-1">
                    E-mail para Recibo:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="financeiro@empresa.com.br"
                    className="w-full py-2 px-3 rounded bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--ink)]"
                  />
                </div>
              </div>

              {paymentMethod === "CREDIT_CARD" && (
                <div className="space-y-2 pt-2 border-t border-[var(--line)]">
                  <div>
                    <label className="text-[11px] font-mono text-[var(--ink-2)] block mb-1">
                      Número do Cartão:
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 0000 0000 0000"
                      className="w-full py-2 px-3 rounded bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--ink)] font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-mono text-[var(--ink-2)] block mb-1">
                        Validade (MM/AA):
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full py-2 px-3 rounded bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--ink)] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-[var(--ink-2)] block mb-1">
                        CVV:
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full py-2 px-3 rounded bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--ink)] font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded bg-[var(--brand)] text-white text-xs font-bold hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <BrandIcon name="garantia" size="s16" accentCobalt={false} />
                <span>
                  {loading
                    ? "Processando Transação..."
                    : paymentMethod === "PIX"
                    ? "Gerar QR Code PIX Imediato"
                    : paymentMethod === "BOLETO"
                    ? "Emitir Boleto Bancário"
                    : "Confirmar Pagamento com Cartão"}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
