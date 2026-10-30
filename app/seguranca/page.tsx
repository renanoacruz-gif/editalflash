import React from "react";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata = {
  title: "Declaração de Segurança da Informação e Governança | EditalFlash",
  description:
    "Arquitetura de isolamento lógico de tenants (RLS), trilha de auditoria append-only e conformidade com a Lei 14.133/2021.",
};

export default function SegurancaPage() {
  return (
    <LegalLayout
      activeDoc="seguranca"
      title="Declaração de Segurança da Informação e Governança Técnica"
      version="1.1.0"
      lastUpdated="28 de Outubro de 2026"
    >
      {/* Seção 1 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          1. Arquitetura de Isolamento de Tenants (Row-Level Security)
        </h2>
        <p>
          Cada Empresa Licitante cadastrada na plataforma opera sob isolamento lógico estrito via políticas de Row-Level Security (RLS) aplicadas na camada de persistência. Nenhum usuário ou tenant pode visualizar, consultar ou indexar documentos pertencentes a terceiros.
        </p>
        <p>
          O SuperAdmin institucional possui credenciais restritas exclusivamente para governança da plataforma, suporte técnico especializado de nível 3 e monitoramento das métricas macroeconômicas do SaaS (MRR, churn e taxa de recall). O acesso a arquivos custodiados sem autorização expressa é terminantemente vedado pela arquitetura.
        </p>
      </section>

      {/* Seção 2 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          2. Trilha de Auditoria Imutável (Append-Only)
        </h2>
        <p>
          Todas as ações sensíveis realizadas na plataforma são registradas em estrutura append-only na tabela interna <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]">audit_events</span>. Os registros incluem:
        </p>
        <ul className="space-y-1.5 text-xs text-[var(--ink-2)] list-disc list-inside font-mono">
          <li>Identificação unívoca do ator e credencial utilizada</li>
          <li>Carimbo temporal com fuso horário oficial (America/Sao_Paulo)</li>
          <li>Endereço IP e identificador de sessão</li>
          <li>Ação executada e tenant afetado</li>
          <li>Payload de alteração criptografado com chave assimétrica</li>
        </ul>
        <p>
          Os registros de auditoria são mantidos por no mínimo 2 anos para fins de perícia forense e não podem ser sobrescritos ou excluídos pela interface administrativa.
        </p>
      </section>

      {/* Seção 3 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          3. Controle de Acesso Administrativo e Sessões de Suporte
        </h2>
        <p>
          O acesso ao cockpit administrativo (<span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]">/admin</span>) é protegido por middleware de borda com encerramento forçado de sessão após 30 minutos de inatividade.
        </p>
        <p>
          Sessões de suporte em modo &ldquo;Impersonation&rdquo; ativam obrigatoriamente um banner institucional persistente no topo do painel do cliente (<span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--warn-bg)] text-[var(--warn-fg)] border border-[var(--warn)]/30">MODO SUPORTE ATIVO</span>) e registram compulsoriamente a justificativa técnica na trilha de auditoria para fins de compliance e prestação de contas perante a LGPD.
        </p>
      </section>

      {/* Seção 4 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          4. Gestão Contínua de Vulnerabilidades e Incidentes
        </h2>
        <p>
          A infraestrutura do EditalFlash passa por rotinas automatizadas de varredura de dependências e testes de estresse em APIs. Conforme o <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]">Art. 48 da Lei nº 13.709/2018</span>, qualquer incidente de segurança relevante que possa acarretar risco aos titulares será formalmente comunicado à Autoridade Nacional de Proteção de Dados (ANPD) e às empresas afetadas em até 72 horas.
        </p>
      </section>

      {/* Seção 5 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold font-display text-[var(--ink)] tracking-tight">
          5. Princípio da Segurança Jurídica e Não-Armazenamento de Senhas
        </h2>
        <p>
          O EditalFlash não é robô de lances e não solicita, armazena ou trafega certificados digitais e-CNPJ com chave privada ou senhas de acesso aos portais de compras públicas (Compras.gov.br, Licitanet, BBMNet, etc.). A integridade das credenciais de disputa permanece sob guarda exclusiva do licitante.
        </p>
      </section>
    </LegalLayout>
  );
}
