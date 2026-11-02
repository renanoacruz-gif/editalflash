# Diretrizes de Design & Impeccable Context — EditalFlash

> Este documento estabelece as restrições estéticas, tokens e vocabulário de interface para o EditalFlash, servindo como guardrail para IA e desenvolvedores. Toda alteração visual deve obedecer estritamente a estas diretrizes.

---

## 1. Identidade e Propósito do Produto

- **Público:** Diretores, advogados, engenheiros e analistas de licitação de empresas que disputam certames públicos no Brasil (Lei 14.133/2021).
- **Tom de Voz da Interface:** Executivo, sóbrio, cirúrgico, de alta confiabilidade e sem distrações.
- **Princípio Central:** A informação técnica (prova de página, linha, trecho do edital, certidões e índices contábeis) é o centro da interface. Evitar cartões decorativos vazios, ilustrações abstratas ou movimentos sem propósito operacional.

---

## 2. Tokens de Cor e Contraste Estrito (WCAG AA)

Todos os componentes devem consumir ou mapear as variáveis definidas em [`app/globals.css`](file:///c:/Users/Administrador/editalflash/app/globals.css):

| Token Semântico | Valor Hex | Finalidade | Regra de Uso |
| :--- | :--- | :--- | :--- |
| `--flash` / `--brand` | `#1E3A8A` | Ação Primária / Azul Institucional | Botões principais, estados ativos, links corporativos. |
| `--paper` / `--bg-base` | `#FAFAF8` | Fundo Base (Off-white neutro) | Fundo geral da aplicação e landing page. Conforto de leitura prolongada. |
| `--bg-surface` | `#FFFFFF` | Superfície de Trabalho | Cards de documentos, tabelas, modais e containers de dados. |
| `--text-primary` | `#0F172A` | Texto Principal | Títulos, cabeçalhos de tabela e valores métricos (Contraste $\ge 12:1$). |
| `--text-secondary` | `#475569` | Texto de Apoio | Descrições, instruções de campos e metadados secundários (Contraste $\ge 4.5:1$). |
| `--text-muted` | `#64748B` | Textos Auxiliares | Datas, legendas de rodapé e números de processo (Contraste $\ge 3:1$). |
| `--line` / `--border-subtle`| `#E2E8F0` | Borda Padrão | Separação discreta de 1px entre blocos e linhas de tabela. |
| `--ok` / `--ok-bg` | `#065F46` / `#ECFDF5` | Habilitado / Aprovado | Certidões válidas, índices contábeis aprovados. |
| `--warn` / `--warn-bg` | `#854D0E` / `#FEFCE8` | Ressalva / Prazo Próximo | Certidões a vencer em < 5 dias, cláusulas ambíguas. |
| `--bad` / `--bad-bg` | `#991B1B` / `#FEF2F2` | Inabilitado / Risco Crítico | Certidão vencida, cláusula restritiva impugnável (Art. 164). |

---

## 3. Tipografia e Hierarquia

1. **Sans-serif (`font-sans`):** Utilizada em 95% da interface para títulos, botões e formulários.
2. **Monospaced (`font-mono`):** Uso estrito e restrito a:
   - Identificadores de certidões e CNPJ;
   - Artigos de lei citados (ex: `Art. 67, § 2º`);
   - Hash de integridade de arquivo e datas de expiração;
   - Número do certame (ex: `PE 42/2026`).
3. **Escala:**
   - H1: `text-2xl` a `text-3xl font-bold tracking-tight text-[#0F172A]`.
   - Rótulos de campo: `text-xs font-medium text-[#0F172A]`.
   - Textos de tabela e dados: `text-xs font-normal text-[#0F172A]`.

---

## 4. Anti-Patterns de IA Proibidos no EditalFlash ("Anti-Slop")

- ❌ **Proibido:** Gradientes roxos, lilases ou neon (ex: Tailwind `from-purple-600 to-indigo-600`).
- ❌ **Proibido:** Partículas, auroras animadas, canvas interativo 3D flutuante e botões com borda giratória brilhante.
- ❌ **Proibido:** Textos simulando digitação (*typewriter effect*) em relatórios de auditoria.
- ❌ **Proibido:** Cartões redundantes ("nested cards") sem informação nova que só aumentam o scroll vertical.
- ❌ **Proibido:** Cores de contraste insuficiente (ex: texto cinza claro `#94A3B8` sobre fundo branco).

---

## 5. Diretrizes de Movimento e Micro-interações

- Todo movimento deve durar no máximo **150ms a 250ms** e utilizar aceleração de GPU (`transform` e `opacity`).
- Nunca usar animações que atrasem a visualização de um dado essencial de edital.
- **Obrigatoriedade:** Todas as micro-interações devem respeitar `prefers-reduced-motion: reduce`.
