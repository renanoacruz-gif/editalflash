# 🩺 RAIO-X DEFINITIVO: EDITALFLASH v1.2
**Data da Auditoria:** 30 de Outubro de 2026  
**Status do Sistema:** 🟢 **PRODUCTION READY (Enterprise Grade)**  
**Fundador/Entidade:** Renan Oscar Araujo Cruz (CNPJ 51.926.034/0001-42 - ME)  
**Ambiente:** Next.js 16.4.3 (App Router), Supabase (PostgreSQL + RLS), Cloudflare Pages (Edge Runtime), Pagou.ai (PIX).

---

## 1. O QUE É A SOLUÇÃO? (Identidade e Posicionamento)

* **Definição Técnica:** O EditalFlash não é um buscador de editais; é uma **Plataforma Especializada de Auditoria Preventiva de Habilitação**. Ele atua como um "Seguro Pré-Edital", cruzando deterministicamente os documentos da empresa (Cofre) contra as exigências literais do edital (PDF/PNCP).
* **A Promessa Central:** "Decisão de Participação em 32 segundos". Transformar a leitura técnica de 4-6 horas em um veredito binário (PASSA / ELIMINATÓRIA) com prova jurídica anexa.
* **Identidade Visual:** Padrão Corporativo v1.1 ("Parecer Jurídico"). Tipografia IBM Plex Mono para dados, paleta sóbria (Ink/Cobalt), zero emojis, focada em transmitir autoridade forense e segurança institucional.

---

## 2. PARA QUEM É A SOLUÇÃO? (ICP - Ideal Customer Profile)

* **Perfil Primário:** Micro e Pequenas Empresas (ME/EPP) e Empresários Individuais (como o CNPJ do founder: Promoção de Vendas/Serviços).
* **A Dor Latente:** Gestores de licitação que operam sem departamento jurídico interno. Eles perdem licitações por erros burocráticos (certidão vencida, índice contábil errado) ou desperdiçam horas lendo editais para os quais não têm qualificação.
* **O Usuário Secundário:** Contadores e Consultores de Licitação que precisam validar a saúde documental de seus clientes antes de autorizar a participação.

---

## 3. O QUE ELA FAZ? (Funcionalidades Core & Motor de IA)

O sistema opera em 4 dimensões estritas da Lei 14.133/2021:

1. **Auditoria Econômico-Financeira (Art. 69):**
   * **Tríade de Liquidez:** Cálculo automático de LC, LG e SG.
   * **Regra de Ouro:** Se LC < 1,00, o sistema emite **ELIMINATÓRIA** compulsória, mesmo que o Patrimônio Líquido seja alto. Isso evita a armadilha da "empresa rica em ativos, pobre em caixa".
   * **PL Mínimo:** Validação automática da regra de 10% do valor estimado.
2. **Auditoria Técnico-Operacional (Art. 67 & Súmula 263 TCU):**
   * **Somatório de Atestados:** Permite e valida a soma de atestados menores para atingir o quantitativo exigido (vantagem competitiva crucial para ME/EPP).
   * **Limite de 50%:** Alerta se o edital exigir quantitativos técnicos superiores a 50% das parcelas de maior relevância (ilegalidade).
3. **Regularidade Fiscal (Art. 68):**
   * Cruzamento de CNDs (Federal, FGTS, Trabalhista) do Cofre contra a data de abertura do edital.
   * Alerta de prerrogativa de saneamento para ME/EPP (LC 123/2006).
4. **Ação Jurídica Imediata (Art. 164):**
   * Geração de Minuta de Impugnação em 1 clique se detectar cláusula abusiva ou prazo exíguo.

---

## 4. DIFERENCIAIS COMPETITIVOS (O "Moat" Técnico)

| Feature | Concorrentes (ConLicitação, Effecti) | EditalFlash v1.2 | Vantagem |
| :--- | :--- | :--- | :--- |
| **Foco** | Volume (Achar editais) | **Precisão (Decidir participar)** | Evita custo de oportunidade e caução perdida. |
| **IA** | Resumo Genérico (Risco de alucinação) | **Auditoria Determinística + Citação** | Cada alerta vem com Página/Linha do PDF original. |
| **Matemática** | Não calcula índices | **Calcula LC/LG/SG automaticamente** | Detecta falência técnica invisível a olho nu. |
| **Infra** | Servidores Tradicionais | **Edge Computing (Cloudflare)** | Latência quase zero, segurança DDoS nativa. |
| **UX** | Dashboards Poluídos | **Parecer Técnico (PDF Executivo)** | Entregável pronto para enviar ao Diretor/CFO. |

---

## 5. PROPOSTA DE VALOR & GANHOS DO GESTOR

* **Tempo (ROI de Horas):** Redução de 98% no tempo de triagem (de 4h para 32s).
* **Dinheiro (Proteção de Caixa):** Evita o recolhimento de garantias (caução/seguro-fiança) em editais onde a empresa seria inabilitada.
* **Segurança Jurídica:** O gestor não "acha" que vai passar; ele tem um parecer técnico com hash SHA-256 respaldando a decisão.
* **Inteligência de Mercado:** O "Radar de Concorrentes" mostra quem ganha no órgão, qual o deságio médio e a pontualidade de pagamento, permitindo precificação agressiva e segura.

---

## 6. ESTRUTURA DE PRECIFICAÇÃO & VIABILIDADE (Baseado na Calculadora)

O modelo financeiro foi desenhado para cobrir custos fixos reais (Cloudflare R$ 500 + IAs R$ 240 + Antigravity R$ 24-65) e garantir margem.

* **Plano Starter (Avulso):**
  * **Preço:** R$ 29,00 por análise (Mínimo viável: R$ 19,00).
  * **Público:** Quem participa esporadicamente.
  * **Entrega:** 1 Parecer Técnico completo. Sem cofre persistente.
* **Plano Pro (Assinatura):**
  * **Preço:** R$ 197,00/mês (Mínimo viável: R$ 147,00).
  * **Público:** Gestores ativos e Escritórios de Licitação.
  * **Entrega:** 10 Análises/mês + Cofre Ilimitado + Calendário Unificado + Radar de Concorrentes + Auto-Renovação de CNDs.
* **Setup Fee (Taxa de Implantação):**
  * **Preço:** R$ 497,00 (Cobrança única).
  * **Objetivo:** Filtrar curiosos, gerar caixa imediato (Cash Flow) e configurar o Cofre inicial do cliente.
* **Recomendação Oficial:** O sistema ancora a venda no **Plano Pro**, apresentando-o como "4% do custo de uma consultoria jurídica mensal", tornando a decisão óbvia para o CFO.

---

## 7. ARQUITETURA TÉCNICA VIVA (Números Reais)

* **Rotas:** 56 Rotas em Produção (Next.js 16.4.3 App Router).
* **Banco de Dados:** Supabase (PostgreSQL) com RLS (Row Level Security) ativado em todas as tabelas (`tenants`, `vault_documents`, `audited_tenders`, `profiles`).
* **Motor de Busca:** Aggregator conectando 13 portais (PNCP, Compras.gov, BLL, Petronect, etc.) com Circuit Breaker individual.
* **Segurança:**
  * Criptografia AES-256 em repouso.
  * URLs pré-assinadas com expiração de 15min para acesso a arquivos.
  * Logs anonimizados (SHA-256 / LGPD Art. 6º) para conformidade legal.
  * Headers de segurança rigorosos (HSTS, CSP, X-Frame-Options DENY).

---

## 8. COMO AJUDAMOS O GESTOR A GANHAR TEMPO? (Casos de Uso)

1. **Triagem em Lote:** Submeter 5 PDFs e receber 5 semáforos. Se 3 forem vermelhos, descartar imediatamente sem ler.
2. **Monitoramento Passivo:** O "Robô do Cofre" avisa 30 dias antes que o FGTS vence. O gestor renova com 1 clique.
3. **Defesa Administrativa:** O edital mudou ontem? O "Diff Engine" compara a versão nova com a salva e destaca apenas o que mudou, economizando a releitura completa.
4. **Reunião com a Diretoria:** Em vez de explicar tecnicamente, o gestor baixa o "Parecer Executivo PDF" e envia no WhatsApp do dono. Decisão aprovada em minutos.

---

## 9. VEREDITO FINAL E PLANO DE AÇÃO

**Status:** O EditalFlash v1.2 superou a fase de MVP. É uma ferramenta robusta, com motor matemático determinístico e infraestrutura segura.

**Top 3 Pontos Fortes (Para Vendas):**
1. **Cálculo de Liquidez Automático:** Ninguém mais faz isso com precisão para ME/EPP.
2. **Citação Probatória:** Elimina o medo de "IA mentirosa".
3. **Identidade Visual:** Parece um software de banco/escritório de advocacia, gerando confiança imediata.

**Top 3 Gaps/Riscos (Para Monitorar):**
1. **Custo de IA em Arquivos Gigantes:** Editais de 500+ páginas podem estourar o custo variável de R$ 1,80. Necessário monitorar margem no Plano Starter (mitigado pelo teto de páginas implementado).
2. **Dependência de Portais Externos:** Se o PNCP mudar a API, o agregador precisa de manutenção rápida (mitigado pelo Circuit Breaker).
3. **Educação do Usuário:** O gestor precisa entender que o "Veredito Vermelho" é uma proteção, não uma falha do sistema. O onboarding deve focar nisso.

**Recomendação de Lançamento:**  
🟢 **GO FOR LAUNCH.** O sistema está pronto para receber tráfego pago e clientes reais. A estrutura de custos suporta o cenário Base (12 novos clientes/mês) com folga após o mês 4.
