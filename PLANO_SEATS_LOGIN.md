# PLANO DE AÇÃO: CHECKOUT DE SEATS PRO + RECONSTRUÇÃO DO LOGIN

> **Classificação:** Engenharia Full-Stack & UI/UX Enterprise (EditalFlash v1.2)  
> **Diretrizes:** Identidade Visual v1.1 (Verdict-First, zero emojis, paleta Ink/Paper/Cobalt/Emerald/Rose, IBM Plex Mono para métricas, Bricolage Grotesque para títulos, 60fps micro-interações).  
> **Status:** **AGUARDANDO APROVAÇÃO EXPLÍCITA ("APROVADO") DO USUÁRIO**.

---

## PARTE 1: FLUXO DE CHECKOUT DE SEATS ADICIONAIS (PRODUÇÃO & PAGOU.AI)

### 1. Constantes e Lógica de Negócio (`lib/pricing.ts`)
- Criar/centralizar arquivo `lib/pricing.ts` com as constantes comerciais oficiais:
  ```typescript
  export const ADDITIONAL_SEAT_PRICE_CENTS = 2900; // R$ 29,00/mês por seat adicional (validado no cálculo do CFO)
  export const MAX_ADDITIONAL_SEATS = 5; // Trava máxima de 5 seats por organização
  export const PRO_PLAN_PRICE_CENTS = 19700; // R$ 197,00/mês
  export const CREDITS_PER_SEAT = 5; // Cada seat adiciona +5 créditos ao pool compartilhado
  ```

### 2. Novo Endpoint de Adição Direta de Seat (`app/api/payment/add-seat/route.ts`)
- **Objetivo:** Permitir ao titular (ADMIN) de uma conta Pro comprar assentos adicionais a qualquer momento direto do painel (sem precisar refazer o onboarding ou cancelar a assinatura).
- **Validações no Servidor:**
  1. Rate limiting por IP/sessão.
  2. Valida se o usuário autenticado existe e possui plano **Pro** ou **Enterprise** ativo.
  3. Valida se `current_seats + quantity <= MAX_ADDITIONAL_SEATS (5)`. Retorna erro 400/403 se exceder.
  4. Cálculo do valor: `amountCents = quantity * ADDITIONAL_SEAT_PRICE_CENTS`.
  5. Chamada à API Pagou.ai (geração de cobrança PIX com QR Code dinâmico + copia e cola).
  6. Registro na tabela `payments` com status `'pending'` e metadados:
     ```json
     {
       "paymentType": "seat_addon",
       "seatQuantity": quantity,
       "userId": userId,
       "creditsToAdd": quantity * 5
     }
     ```
  7. Retorno do payload com QR Code e instrução para pagamento imediato.

### 3. Atualização do Webhook (`app/api/payment/webhook/route.ts`)
- Tratar eventos onde `paymentType === "seat_addon"`:
  - Idempotência: confere se a transação já foi processada.
  - Ao aprovar pagamento:
    1. Atualiza `payments.status = 'paid'`.
    2. Atualiza `profiles`:
       - `max_seats = max_seats + seatQuantity`
       - `credits = credits + (seatQuantity * 5)`
       - `analyses_limit = analyses_limit + (seatQuantity * 5)`
  - Retorna `200 OK`.

### 4. Componente Visual de Checkout: `components/AddSeatCheckout.tsx`
- Modal interativo integrado na tela `/dashboard/equipe` (e acessível via `/dashboard/settings`):
  - Seletor de quantidade de assentos: `[ - ] 1 [ + ]` (bloqueado para não ultrapassar a trava de 5).
  - Cálculo em tempo real: `1 assento = R$ 29,00/mês (+5 análises inclusas)`.
  - Resumo dos benefícios do perfil Member (acesso ao cofre e histórico, consumo do pool compartilhado, sem acesso a faturamento).
  - Botão de ação: "Gerar Pagamento PIX" (com loading state suave a 60fps).
  - Exibição do QR Code PIX com botão de copiar chave copia-e-cola e pooling/confirmação automática na tela.

---

## PARTE 2: RECONSTRUÇÃO DA TELA DE LOGIN (ENTERPRISE SPLIT-SCREEN)

### 1. Novo Layout Split-Screen 50/50 (`app/login/page.tsx`)
- **Lado Esquerdo (Branding & Autoridade Jurídica - Desktop):**
  - Fundo nobre `Ink (#0E1626)` profundo com grid sutil de linhas de segurança.
  - Scanner de documento estilizado com linha de varredura lenta a 60fps (sem repaints pesados).
  - Tipografia de impacto em Bricolage Grotesque: *"Auditoria Preventiva de Habilitação. Lei 14.133/2021."*
  - Badge de segurança criptográfica no rodapé: *"Sessão Criptografada AES-256 • Supabase PostgreSQL RLS"*.
- **Lado Direito (Ação e Formulário Limpo):**
  - Fundo `Paper (#FFFFFF)` límpido e de alto contraste.
  - Header com logo oficial do EditalFlash e subtítulo institucional.
  - Campos de entrada:
    - E-mail corporativo.
    - Senha com link discreto para recuperação.
  - Estados de foco e micro-interações:
    - Borda sutil que transiciona para `Cobalt (#2740F0)` com anel de foco suave em 150ms.
    - Animação sutil de shake caso haja erro de credenciais (sem quebrar layout).
    - Botão primário: 48px de altura, fundo `#2740F0`, hover com leve elevação e spinner minimalista integrado durante o submit.
- **Responsividade Mobile (< 768px):**
  - O painel esquerdo é colapsado em uma barra superior compacta e minimalista; o formulário assume 100% da viewport vertical para conforto tátil.

### 2. Preservação Absoluta da Lógica:
- A chamada `await login(email, password)` via `useAuth()` e o redirecionamento automático pós-login (`/dashboard`) são preservados integralmente sem qualquer alteração de rotas ou de cookies de sessão.

---

## LISTA DE ARQUIVOS QUE SERÃO CRIADOS/MODIFICADOS:
1. `lib/pricing.ts` (Criação de constantes comerciais unificadas)
2. `app/api/payment/add-seat/route.ts` (Criação do endpoint de checkout do seat)
3. `app/api/payment/webhook/route.ts` (Modificação para provisionar `seat_addon`)
4. `components/AddSeatCheckout.tsx` (Criação do modal de compra PIX de assentos)
5. `app/dashboard/equipe/page.tsx` (Integração do botão de compra rápida de seats com o modal)
6. `app/login/page.tsx` (Reconstrução completa da UI/UX no padrão Split-Screen 60fps)

---

> ⚠️ **TRAVA DE SEGURANÇA:** Nenhum arquivo foi alterado ainda. Aguardando sua aprovação explícita digitando **"APROVADO"** para iniciarmos a codificação.
