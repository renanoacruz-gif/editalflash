# PLANO DE AÇÃO DETALHADO: REFINAMENTO VISUAL E UX PREMIUM (GETLAYERS / CURATED / 60FPS)

> **Classificação:** Planejamento de Frontend & Design System (EditalFlash v1.2)  
> **Responsável:** Lead Product Designer  
> **Objetivo:** Elevar a interface do EditalFlash para padrão Enterprise SaaS (nível Linear, Stripe, Ramp), aplicando princípios do **GetLayers** (layout clean, grids bento, hierarquia), **Curated** (tipografia institucional, espaço em branco intencional) e **60fps** (micro-interações fluidas a 60fps reais), preservando 100% da lógica e regras de negócio.  
> **Status:** **AGUARDANDO APROVAÇÃO EXPLÍCITA ("APROVADO") DO USUÁRIO**.

---

## 1. PRINCÍPIOS DE DESIGN & INSPIRAÇÕES ESPECÍFICAS

1. **GetLayers & Bento Grids:**  
   Substituir containers cinzas e cartões genéricos por *Bento Grids* com bordas sutis (`border-slate-200` no light, `border-[#26324A]` no dark), preenchimentos equilibrados (`p-6` a `p-8`) e cantos arredondados modernos (`rounded-2xl` a `rounded-3xl`).
2. **Curated & Tipografia Institucional:**  
   Respeitar rigorosamente a Tríade Tipográfica v1.1:
   - **Títulos e Chamadas:** Bricolage Grotesque (`font-display`).
   - **Textos Corridos e Labels:** IBM Plex Sans (`font-sans`).
   - **Dados Numéricos, Prazos, Artigos e Valores:** IBM Plex Mono (`font-mono`).
3. **60fps (Micro-interações e Estados Fluidos):**  
   - Transições de hover em 150-200ms com `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like).
   - Efeitos de luz sutil no cursor/hover sem repaints custosos (`transform: translate3d`, `opacity`, `backdrop-filter`).
   - *Skeleton screens* polidos substituindo spinners genéricos para evitar Cumulative Layout Shift (CLS).

---

## 2. MAPEAMENTO COMPONENTE POR COMPONENTE

### GRUPO A: LANDING PAGE & INSTITUCIONAL (Conversão & Autoridade)

| Componente / Tela | Arquivo a ser Tocado | Inspiração Específica | Refinamentos Planejados (Somente CSS/JSX) |
| :--- | :--- | :--- | :--- |
| **Hero Section & Scanner** | `components/InteractiveHeroScanner.tsx`<br>`components/HeroSection.tsx` | **60fps** (efeito laser suave e tabs com transição fluida) | • Suavizar a linha laser do scanner para usar gradiente radial com opacidade controlada (`mix-blend-screen`).<br>• Transição de abas (Leitura -> Atestados -> Certidões) com animação suave de barra de progresso em 60fps.<br>• Contraste aprimorado do código e badges de status. |
| **Split Diff Auditor** | `components/SplitDiffViewer.tsx` | **Linear / GetLayers** (divisor de precisão e tipografia técnica) | • Alça central do slider com visual metálico minimalista e sombra com glow sutil.<br>• Comparação antes/depois com tipografia monoespaçada tabular de alta legibilidade.<br>• Feedback tátil visual ao arrastar o divisor. |
| **Tabela de Preços** | `components/PricingSection.tsx`<br>`app/pricing/page.tsx` | **Stripe** (destaque elegante do plano Pro com borda luminosa e elevação) | • Card do Plano Pro com sutil anel de destaque cobalto (`ring-1 ring-[#2740F0]/50`) e sombra profunda.<br>• Badges de economia anual refinados.<br>• Tabela de comparação com linhas zebradas ultrafinas (`border-slate-100`). |
| **Navbar & Header** | `components/Navbar.tsx` | **Curated** (menu flutuante com blur vítreo e espaçamento refinado) | • Efeito de vidro refinado (`backdrop-blur-md bg-white/80` com borda sutil `border-slate-200/80`).<br>• Botão de CTA "Auditar Edital" com micro-efeito de profundidade e transição de escala suave (`active:scale-95`). |

---

### GRUPO B: DASHBOARD DO LICITANTE (Operação Diária & Velocidade)

| Componente / Tela | Arquivo a ser Tocado | Inspiração Específica | Refinamentos Planejados (Somente CSS/JSX) |
| :--- | :--- | :--- | :--- |
| **Badges de Veredito** | `components/VerdictBadge.tsx` | **GetLayers / Linear** (badges de alta densidade sem poluição visual) | • Ícones geométricos (círculo, triângulo, quadrado) com traço de precisão (1.75px) e fundo com saturação controlada.<br>• Pulso estático suave ou brilho sutil para veredito `PASSA` e `RESSALVA`.<br>• Tipografia monoespaçada compacta e legível. |
| **Cofre Documental** | `app/dashboard/cofre/page.tsx`<br>`components/VaultUploader.tsx` | **GetLayers Bento Grids** (organização modular por tipo de certidão) | • Transformar os blocos de certidões em Bento Grid com indicador visual de validade (verde > 30 dias, âmbar < 30 dias, vermelho vencido).<br>• Hover states com elevação suave (`translate-y-[-2px]`) e sombra direcional.<br>• Zona de upload (drag & drop) com borda tracejada animada ao passar arquivo. |
| **Tabela de Histórico** | `components/AuditHistoryTable.tsx` | **Linear Data Tables** (densidade de dados profissional e leitura rápida) | • Linhas de tabela compactas com altura consistente (48px).<br>• Alinhamento numérico à direita com `font-mono` para valores e datas.<br>• Tooltips informativos discretos ao passar o mouse sobre justificativas de ressalva. |
| **Painel de Equipe / Seats** | `app/dashboard/equipe/page.tsx` | **Ramp** (estatísticas executivas em cards numéricos limpos) | • Cards de métricas de assentos e créditos com números em destaque de alta densidade.<br>• Linhas de membros ativos com indicador de perfil (ADMIN / MEMBER) estilizado em pílulas discretas. |
| **Sidebar & Layout** | `components/DashboardLayout.tsx` | **60fps / Linear** (recolhimento e expansão ultra-suaves) | • Animação fluida da largura da sidebar (64px <-> 256px) com `transition-all duration-200 ease-out`.<br>• Destaque do item ativo com borda lateral cobalto (`#2740F0`) de 2px e fundo sutilmente destacado. |

---

### GRUPO C: COMPONENTES GLOBAIS E FEEDBACK VISUAL

| Componente | Arquivo a ser Tocado | Inspiração | Refinamentos Planejados |
| :--- | :--- | :--- | :--- |
| **Modais & Drawers** | `components/ImpugnationModal.tsx`<br>`components/PncpModal.tsx` | **60fps** (Spring entrance e backdrop blur escuro) | • Entrada suave em escala (0.98 -> 1.0) e opacidade com backdrop blur elegante.<br>• Botão de fechar com hover suave e foco acessível. |
| **Loading & Skeletons** | `components/ScanningLoader.tsx`<br>`components/StateScanning.tsx` | **Linear Skeleton Screens** | • Animação de shimmer linear contínua substituindo blocos cinzas estáticos durante o processamento do PDF. |

---

## 3. LISTA COMPLETA DE ARQUIVOS QUE SERÃO TOCADOS

1. `components/InteractiveHeroScanner.tsx`
2. `components/HeroSection.tsx`
3. `components/SplitDiffViewer.tsx`
4. `components/PricingSection.tsx`
5. `components/Navbar.tsx`
6. `components/VerdictBadge.tsx`
7. `components/AuditHistoryTable.tsx`
8. `components/DashboardLayout.tsx`
9. `components/ImpugnationModal.tsx`
10. `app/dashboard/cofre/page.tsx`
11. `app/dashboard/equipe/page.tsx`
12. `app/pricing/page.tsx`

---

## 4. GARANTIAS TÉCNICAS E SEGURANÇA
- **Zero Alteração Lógica:** Nenhuma rota, handler de API, chamada ao Supabase ou cálculo matemático do Art. 69 será modificado.
- **Zero Dependências Novas:** Utilizaremos exclusivamente Tailwind CSS nativo, Framer Motion (já instalado v14.7.1) e Lucide React (já instalado v1.62.0).
- **Zero Regressão de Performance:** Animações baseadas estritamente em propriedades aceleradas por GPU (`transform`, `opacity`, `backdrop-filter`).
- **Compatibilidade Responsiva:** Cada componente será testado mentalmente e estruturado para 375px (mobile) até 1440px+ (desktop).

---

> ⚠️ **TRAVA DE SEGURANÇA:** Nenhum arquivo de código foi alterado ainda. Aguardando sua aprovação explícita digitando **"APROVADO"** para iniciarmos a execução faseada.
