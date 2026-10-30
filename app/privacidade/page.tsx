import React from "react";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata = {
  title: "Política de Privacidade e Tratamento de Dados (LGPD) | EditalFlash",
  description:
    "Tratamento de dados sensíveis de habilitação fiscal e trabalhista sob a égide da LGPD e do Art. 62 da Lei 14.133/2021.",
};

export default function PrivacidadePage() {
  return (
    <LegalLayout
      activeDoc="privacidade"
      title="Política de Privacidade e Tratamento de Dados Pessoais"
      version="1.1.0"
      lastUpdated="28 de Outubro de 2026"
    >
      {/* Seção 1 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          1. Dados Coletados e Finalidade Específica
        </h2>
        <p>
          O EditalFlash trata estrita e exclusivamente os dados necessários à condução da auditoria preventiva de habilitação, em conformidade com o <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--brand-tint)] text-[var(--ink)] border border-[var(--brand)]/20">Art. 62 da Lei Federal nº 14.133/2021</span>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 bg-[var(--bg)] border border-[var(--line)] rounded-md space-y-1.5">
            <strong className="block font-mono text-xs text-[var(--ink)] uppercase">
              Dados Corporativos
            </strong>
            <p className="text-xs text-[var(--ink-2)] leading-relaxed">
              CNPJ, razão social, atos constitutivos, balanços patrimoniais, demonstrações contábeis (DRE), acervo técnico (CAT/ART) e certidões negativas (federais, estaduais, municipais, trabalhistas e FGTS).
            </p>
          </div>

          <div className="p-3.5 bg-[var(--bg)] border border-[var(--line)] rounded-md space-y-1.5">
            <strong className="block font-mono text-xs text-[var(--ink)] uppercase">
              Dados de Contato
            </strong>
            <p className="text-xs text-[var(--ink-2)] leading-relaxed">
              Nome civil, e-mail corporativo institucional e telefone dos responsáveis pela conta, utilizados para o disparo de alertas do Calendário Unificado de Vencimentos e suporte técnico de nível 3.
            </p>
          </div>

          <div className="p-3.5 bg-[var(--bg)] border border-[var(--line)] rounded-md space-y-1.5">
            <strong className="block font-mono text-xs text-[var(--ink)] uppercase">
              Dados de Operação
            </strong>
            <p className="text-xs text-[var(--ink-2)] leading-relaxed">
              Histórico de certames auditados, resultados de semáforos, trilha de auditoria append-only, saldo de créditos consumidos e segmentação de vertical operacional.
            </p>
          </div>
        </div>
      </section>

      {/* Seção 2 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          2. Base Legal e Padrões de Segurança Criptográfica
        </h2>
        <p>
          O tratamento dos dados é fundamentado na execução regular do contrato de prestação de serviços (plano assinado) e no legítimo interesse da empresa licitante para prevenção de inabilitação sumária.
        </p>
        <p>
          Todos os documentos e metadados custodiados são submetidos a criptografia de padrão bancário em repouso (<span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]">AES-256</span>) e trânsito protegido por protocolo seguro (<span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]">TLS 1.3</span>). O acesso operacional ao Cofre de Documentos é segregado por tenant.
        </p>
      </section>

      {/* Seção 3 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          3. Retenção, Descarte e Exclusão Definitiva
        </h2>
        <p>
          Os dados de análise e pareceres são conservados pelo período de vigência da assinatura ativa acrescido de 90 dias para fins de compliance. O usuário pode realizar o expurgo imediato de qualquer certidão ou balanço diretamente pelo Cofre de Documentos, com efeito irreversível nos servidores primários.
        </p>
        <p>
          Em caso de encerramento da conta, todos os registros identificáveis são eliminados ou submetidos a anonimização irreversível no prazo peremptório de 30 dias corridos, conforme o <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]">Art. 16 da Lei nº 13.709/2018 (LGPD)</span>.
        </p>
      </section>

      {/* Seção 4 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          4. Direitos do Titular e Encarregado de Dados (DPO)
        </h2>
        <p>
          O titular dos dados pode exercer a qualquer tempo seus direitos de confirmação de tratamento, acesso, correção de dados incompletos, portabilidade e revogação de consentimento mediante solicitação formal:
        </p>
        <div className="p-4 bg-[var(--bg)] border border-[var(--line)] rounded-md font-mono text-xs space-y-1 text-[var(--ink)]">
          <div>Canal de Privacidade: <strong>privacidade@editalflash.com.br</strong></div>
          <div>Encarregado pelo Tratamento de Dados (DPO): <strong>dpo@editalflash.com.br</strong></div>
          <div className="text-[var(--ink-2)] text-[11px] pt-1">Prazo legal de resposta: até 15 dias úteis contados do protocolo formal.</div>
        </div>
      </section>

      {/* Seção 5 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          5. Transferência Internacional de Dados e Provedores de IA
        </h2>
        <p>
          Os modelos fundacionais utilizados para extração de cláusulas e OCR atuam sob Cláusulas Contratuais Padrão (Standard Contractual Clauses). Nenhum documento custodiado, certidão ou balanço da Empresa Licitante é utilizado para retreinamento público de inteligência artificial de fornecedores terceiros.
        </p>
      </section>
    </LegalLayout>
  );
}
