import React from "react";
import { LegalLayout } from "@/components/LegalLayout";
import { BrandIcon } from "@/components/brand-icons";

export const metadata = {
  title: "Termos de Uso e Responsabilidade Compartilhada | EditalFlash",
  description:
    "Termo de Uso e Responsabilidade Compartilhada estabelecendo os limites operacionais e a governança técnica do EditalFlash sob a Lei 14.133/2021.",
};

export default function TermosPage() {
  return (
    <LegalLayout
      activeDoc="termos"
      title="Termo de Uso e Responsabilidade Compartilhada"
      version="1.1.0"
      lastUpdated="28 de Outubro de 2026"
    >
      {/* Cláusula 1 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          1. Natureza da Ferramenta e Delimitação do Escopo
        </h2>
        <p>
          O EditalFlash é um software de suporte à decisão administrativa em licitações públicas. Ele realiza cruzamento automatizado entre editais publicados e documentos corporativos armazenados no Cofre Digital.
        </p>
        <div className="p-3.5 rounded-md bg-[var(--brand-tint)] border border-[var(--brand)]/30 text-[var(--ink)] text-xs font-mono leading-relaxed">
          <strong>Aviso Vinculante:</strong> O EditalFlash não constitui parecer jurídico vinculante, assessoria advocatícia especializada, garantia de habilitação ou promessa de vitória em certames. A responsabilidade final pela participação, conferência formal, impugnação tempestiva e conformidade documental perante a comissão de contratação é exclusiva da Empresa Licitante.
        </div>
      </section>

      {/* Cláusula 2 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          2. Limitações Técnicas Declaradas
        </h2>
        <p>O usuário e a empresa contratante declaram ciência de que:</p>

        {/* Alerta crítico com selo eliminatória visual */}
        <div className="p-4 rounded-md bg-[var(--bad-bg)] border border-[var(--bad)]/40 text-[var(--bad-fg)] space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-xs bg-[var(--bad)] flex items-center justify-center text-white text-[10px] font-bold">
              ■
            </span>
            <strong className="font-mono text-xs uppercase tracking-wider">
              Cláusula Restritiva de Garantia Técnica
            </strong>
          </div>
          <ul className="space-y-2 text-xs leading-relaxed list-disc list-inside">
            <li>
              <strong>Revisão Humana Necessária:</strong> Análises assinaladas com o veredito &ldquo;Revisão Humana Necessária&rdquo; indicam falha de legibilidade em Optical Character Recognition (OCR) ou ambiguidade hermenêutica do instrumento convocatório. Nestes casos, a plataforma abstém-se de emitir veredito automatizado para prevenir falsos negativos.
            </li>
            <li>
              <strong>Conferência Prévia de Citações:</strong> Citações de página, linha e item do edital são extraídas por processamento algorítmico e devem ser integralmente conferidas pelo licitante antes de protocolo em peças recursais ou petições formais.
            </li>
            <li>
              <strong>Prevalência Jurídica do PDF:</strong> Em casos de divergência entre os metadados do Portal Nacional de Contratações Públicas (PNCP) e o arquivo PDF oficial do edital, o EditalFlash adota o PDF como a fonte primária e irrevogável da verdade documental.
            </li>
          </ul>
        </div>
      </section>

      {/* Cláusula 3 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          3. Propriedade Intelectual dos Resultados
        </h2>
        <p>
          Os relatórios analíticos, pareceres de conformidade e minutas de impugnação do <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]">Art. 164 da Lei 14.133/2021</span> gerados pela plataforma são de propriedade integral da Empresa Licitante.
        </p>
        <p>
          O EditalFlash retém licença limitada, não exclusiva e irrevogável para utilizar dados anonimizados e estatisticamente agregados, com a finalidade estrita de aferição de acurácia (recall), monitoramento de falhas de OCR e aprimoramento dos conjuntos autônomos de regras por vertical operacional (obras, compras, serviços, saúde e tecnologia da informação).
        </p>
      </section>

      {/* Cláusula 4 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          4. Modificações e Governança Contratual
        </h2>
        <p>
          Alterações substanciais nestes termos serão formalmente comunicadas via central de notificações do painel do cliente com antecedência mínima de 7 dias úteis. A continuidade da utilização da plataforma após o decurso do prazo configura aceitação integral das atualizações normativas.
        </p>
      </section>
    </LegalLayout>
  );
}
