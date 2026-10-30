# DOSSIÊ DE EVIDÊNCIAS TÉCNICAS FACTUAIS: EDITALFLASH (v1.2)
**Classificação:** Auditoria Técnica Independente / Due Diligence de Engenharia  
**Data da Inspeção:** 30 de Outubro de 2026  
**Repositório Inspecionado:** `C:\Users\Administrador\editalflash`  
**Método de Avaliação:** Inspeção estrita de código-fonte, configurações, dependências e artefatos existentes. Sem execução de testes de rede, sem chamadas de API externas, sem alteração de arquivos e sem exposição de segredos.

---

## 1. VISÃO TÉCNICA DO PROJETO

### 1.1 Stack de Tecnologia
- **Framework Principal:** Next.js 16.4.3 (App Router, Turbopack habilitado). [IMPLEMENTADO - prova: `package.json:20`]
- **Linguagem:** TypeScript 5.x. [IMPLEMENTADO - prova: `package.json:39`]
- **Interface e Estilização:** React 19.3.0, Tailwind CSS 4.x, Lucide React 1.62.0, Framer Motion 14.7.1. [IMPLEMENTADO - prova: `package.json:18-25`]
- **Manipulação e Extração de Documentos:** `pdf-parse` 2.4.5, `@react-pdf/renderer` 4.9.0. [IMPLEMENTADO - prova: `package.json:14,22`]
- **Banco de Dados & Autenticação:** Supabase Client (`@supabase/supabase-js` 2.118.0) e PostgreSQL com Row Level Security (RLS). [IMPLEMENTADO - prova: `package.json:15`, `lib/supabase.ts`]
- **Validação de Schemas:** Zod 4.6.7. [IMPLEMENTADO - prova: `package.json:26`]
- **SDKs de IA Instalados no `package.json`:**
  - `@anthropic-ai/sdk` 1.3.0 [IMPLEMENTADO - prova: `package.json:12`]
  - `@google/genai` 2.31.0 [IMPLEMENTADO - prova: `package.json:13`]
  - `openai` 7.45.1 [IMPLEMENTADO - prova: `package.json:21`]
- **Target de Deploy Configurado:** Cloudflare Pages via `@cloudflare/next-on-pages` 1.13.16. [IMPLEMENTADO - prova: `package.json:29`]

### 1.2 Como Rodar Localmente
Conforme verificado em `package.json` e `README.md`:
1. Instalação de dependências: `npm install`
2. Configuração de variáveis de ambiente: cópia de `.env.example` para `.env.local`
3. Execução em desenvolvimento: `npm run dev` (inicia servidor Next.js em `http://localhost:3000`)
4. Build de produção: `npm run build` (executa `next build` com Turbopack)
5. Execução em produção: `npm run start`

### 1.3 Fluxo Ponta a Ponta de uma Análise (Upload até Saída)
1. **Upload:** O cliente submete um arquivo PDF via formulário multipart na rota `POST /api/analyze`. [IMPLEMENTADO - prova: `app/api/analyze/route.ts:48-63`]
2. **Rate Limiting:** A requisição passa por limitador em memória de 3 req/min por IP/sessão. [IMPLEMENTADO - prova: `app/api/analyze/route.ts:20-45`, `lib/rate-limit.ts`]
3. **Checagem de Saldo/Cota:** Se conectado ao Supabase e o usuário for autenticado, verifica `analyses_limit` e `analyses_used` no tenant/profile do titular da organização. [IMPLEMENTADO - prova: `app/api/analyze/route.ts:65-129`]
4. **Validação de Arquivo:** Validação de magic bytes (`%PDF-`), MIME type e tamanho máximo de 15MB. [IMPLEMENTADO - prova: `app/api/analyze/route.ts:131-141`, `lib/validations.ts:5-40`]
5. **Extração Textual:** Extração com `pdf-parse`. Caso falhe, há fallback via regex em buffer latin1. Se o texto extraído tiver menos de 25 caracteres, retorna erro 422. [IMPLEMENTADO - prova: `app/api/analyze/route.ts:143-170`]
6. **Classificação e Injeção de Regras:** O texto extraído é encaminhado para `analyzeEdital` em `lib/ai-manager.ts`. [IMPLEMENTADO - prova: `app/api/analyze/route.ts:186`]
7. **Persistência do Histórico:** O resultado é gravado na tabela `audited_tenders` do Supabase via `supabaseAdmin`. [IMPLEMENTADO - prova: `app/api/analyze/route.ts:188-218`]
8. **Retorno:** Retorna JSON estruturado (`EditalAnalysisResponse`) para o frontend renderizar o dashboard e permitir download de PDF em `/api/pdf/generate`. [IMPLEMENTADO - prova: `app/api/analyze/route.ts:220-243`]

### 1.4 O que é Determinístico vs. Chamada de LLM
* **Classificação de Categoria do Edital:** **Determinística.** Executada por contagem de palavras-chave e pontuação em regex (`classifyTender` em `lib/classifier.ts`). Não usa LLM. [IMPLEMENTADO - prova: `lib/classifier.ts:1-120`]
* **Cálculo da Tríade de Liquidez e Patrimônio Líquido:** **Determinístico.** Fórmulas matemáticas em TypeScript puro (`calcularIndicesLiquidez` em `lib/liquidez-calculator.ts`). Não usa LLM. [IMPLEMENTADO - prova: `lib/liquidez-calculator.ts:23-46`]
* **Sanitização de Citações e Páginas:** **Determinística.** Busca por `indexOf` e regex de marcadores de página (`verifyAndLocateCitation` em `lib/citation-sanitizer.ts`). Não usa LLM. [IMPLEMENTADO - prova: `lib/citation-sanitizer.ts:23-66`]
* **Geração da Análise de Habilitação:** **Determinística baseada em RuleSets locais.**  
  *Divergência Crítica identificada em relação ao material comercial:*  
  O arquivo `lib/ai-manager.ts` importa os SDKs de `Anthropic`, `OpenAI` e `GoogleGenAI` nas linhas 19-21, mas **não instancia nenhum cliente LLM (`new Anthropic(...)`, `new OpenAI(...)`) no fluxo de análise**. A função `analyzeEdital` chama `buildAdaptiveAnalysis`, que injeta regras estruturadas dos arquivos `lib/rules-*.ts` e sanitiza as citações contra o texto do edital. O código para chamada de LLM externa em tempo de execução está **[PLANEJADO/NÃO IMPLEMENTADO NO FLUXO ATIVO]**; a análise opera atualmente via motor determinístico de regras de catálogo.

---

## 2. MOTOR DETERMINÍSTICO E REGRAS CODIFICADAS

### 2.1 Lista de Regras Estruturadas por Catálogo
O sistema possui 5 catálogos verticais estritos codificados em TypeScript:

1. **Obras Públicas e Engenharia:**
   - *Certidão de Acervo Técnico (CAT) com ART*: Art. 67, I e II da Lei 14.133/21. [IMPLEMENTADO - prova: `lib/rules-obras.ts:18-29`]
   - *Vedação ao Somatório de Atestados / Limite de 50%*: Súmula 263 do TCU e Art. 67, § 2º. [IMPLEMENTADO - prova: `lib/rules-obras.ts:30-41`]
   - *Vistoria Técnica Facultativa*: Art. 63, § 2º da Lei 14.133/21. [IMPLEMENTADO - prova: `lib/rules-obras.ts:42-53`]
   - *Patrimônio Líquido Mínimo $\le 10\%$*: Art. 69, § 4º da Lei 14.133/21. [IMPLEMENTADO - prova: `lib/rules-obras.ts:54-65`]
2. **Saúde e Medicamentos:**
   - *Autorização de Funcionamento (AFE) e Registro ANVISA*: Lei nº 6.360/76 e Art. 66 da Lei 14.133/21. [IMPLEMENTADO - prova: `lib/rules-saude.ts:15-28`]
   - *Certidão de Regularidade Técnica (CRF)*: Lei nº 3.820/60. [IMPLEMENTADO - prova: `lib/rules-saude.ts:29-41`]
   - *Controle de Lote e Validade Mínima de 12 meses*: RDC ANVISA e Art. 67 da Lei 14.133/21. [IMPLEMENTADO - prova: `lib/rules-saude.ts:42-54`]
3. **Tecnologia da Informação (TIC):**
   - *Certificação de Segurança / Conformidade LGPD (ISO 27001)*: Art. 67 da Lei 14.133/21 c/c Lei 13.709/18. [IMPLEMENTADO - prova: `lib/rules-ti.ts:15-28`]
   - *Declaração de Parceria / Fabricante*: Art. 67 da Lei 14.133/21. [IMPLEMENTADO - prova: `lib/rules-ti.ts:29-41`]
   - *Comprovação de Nível de Serviço (SLA)*: Art. 67 da Lei 14.133/21. [IMPLEMENTADO - prova: `lib/rules-ti.ts:42-54`]
4. **Compras e Fornecimentos:**
   - *Catálogo Técnico e Conformidade Inmetro/ABNT*: Art. 41 c/c Art. 67 da Lei 14.133/21. [IMPLEMENTADO - prova: `lib/rules-compras.ts:15-28`]
   - *Atestado de Fornecimento Prévio (Mínimo 50%)*: Art. 67, § 1º e § 2º. [IMPLEMENTADO - prova: `lib/rules-compras.ts:29-41`]
5. **Serviços Contínuos (Limpeza, Vigilância, Apoio Administrativo):**
   - *Planilha de Custos e Formação de Preços (CCT Vigente)*: Art. 69, § 5º da Lei 14.133/21. [IMPLEMENTADO - prova: `lib/rules-servicos.ts:25-45`]
   - *Regularidade Trabalhista e Previdenciária (CNDT + FGTS)*: Art. 68, III e IV. [IMPLEMENTADO - prova: `lib/rules-servicos.ts:46-65`]

### 2.2 Fórmulas dos Índices de Liquidez (Art. 69)
Codificadas em `lib/liquidez-calculator.ts:27-46` [IMPLEMENTADO - prova: `lib/liquidez-calculator.ts`]:
- **Liquidez Corrente ($LC$):**
  $$\text{LC} = \frac{\text{Ativo Circulante}}{\text{Passivo Circulante}}$$
- **Liquidez Geral ($LG$):**
  $$\text{LG} = \frac{\text{Ativo Circulante} + \text{Realizável a Longo Prazo}}{\text{Passivo Circulante} + \text{Exigível a Longo Prazo}}$$
- **Solvência Geral ($SG$):**
  $$\text{SG} = \frac{\text{Ativo Total}}{\text{Passivo Total}}$$
- **Critério de Aprovação:** `lc >= exigenciaMinima && lg >= exigenciaMinima && sg >= exigenciaMinima` (exigência padrão: $1,00$). Se qualquer índice for menor, retorna `status: "INSUFICIENTE"`.
- **Patrimônio Líquido:** `plMinimo = valorEstimado * 0.10`. Compara com `plEmpresaCadastrado`. Retorna `"SUFICIENTE"` ou `"INSUFICIENTE"`.

### 2.3 Validações Determinísticas vs. Dependentes de LLM
- Todas as validações ativas no repositório operam de forma **determinística**:
  - Classificação de vertical (`lib/classifier.ts`).
  - Verificação de termos proibidos entre verticais (`validateVerticalIntegrity` em `lib/ai-manager.ts:77-133`).
  - Verificação de citações textuais e páginas no corpo do PDF (`lib/citation-sanitizer.ts`).
  - Cálculo de índices contábeis (`lib/liquidez-calculator.ts`).
- Não há validações dependentes de chamadas externas de LLM em execução ativa no código atual.

---

## 3. EVIDÊNCIA DE EXECUÇÃO

* **Busca por artefatos de análises já rodadas:**
  - Diretórios inspecionados: `/public`, `/storage`, `/uploads`, `/data`, diretório raiz e tabelas de logs.
  - **Resultado:** Não localizado nos arquivos inspecionados nenhum arquivo de log histórico, JSON de saída de análise prévia ou PDF gerado persistido em disco.
* **Tabela `audited_tenders` (Supabase):**
  - O código para persistir análises está implementado (`app/api/analyze/route.ts:195-218`), mas como este teste é estritamente estático (sem chamadas de rede ao banco), os registros remotos não foram consultados.
* **Veredito:** `[NÃO LOCALIZADO NOS ARQUIVOS INSPECIONADOS]`. Nenhuma análise prévia salva em disco para citação factual.

---

## 4. MEDIÇÃO DE DESEMPENHO

### 4.1 Origem das Afirmações "32 segundos" e "89% de economia"
* **Inspeção no Código:**
  - Varredura de strings por `32s`, `32 segundos` e `89%` no código-fonte (`app/`, `lib/`, `components/`).
  - **Resultado:** Não existe nenhum registro de benchmark, script de cronometragem, arquivo de profiling ou telemetria no código que fundamente factualmente "32 segundos" ou "89%".
* **Conclusão:** As menções a "32 segundos" e "89% de economia" presentes no material de apoio constituem **estimativas teóricas informais de vendas/marketing**, sem respaldo empírico mensurado nos arquivos locais.

### 4.2 Proposta de Protocolo de Teste de Desempenho (NÃO EXECUTADO)
Para produzir evidência factual de tempo e consumo, propõe-se o seguinte protocolo para decisão do usuário:
1. **Amostra de Teste:**
   - Edital A (Pequeno - Termo de Dispensa/Aviso): ~15 a 30 páginas (ex: PNCP nº 00.394.460/0001-41-1-000001/2026).
   - Edital B (Médio - Pregão Eletrônico Padrão): ~80 a 120 páginas (ex: Pregão de Compras/Serviços).
   - Edital C (Grande - Concorrência de Obras com Anexos): ~250 a 400 páginas.
2. **Métricas a Registrar:**
   - Tempo de upload e parsing do buffer (`pdf-parse`).
   - Tempo de classificação (`classifyTender`).
   - Tempo de sanitização de citações (`sanitizeAnalysisCitations`).
   - Latência total fim a fim (ms) em 3 execuções consecutivas para cada edital.
3. **Custo Estimado da Execução:**
   - **R$ 0,00 (Zero)**, pois o pipeline atual processa o texto localmente sem invocar endpoints pagos de IA.

---

## 5. CUSTOS E CONSUMO DE APIs

### 5.1 Chamadas a APIs Externas no Código Atual
* **Durante a rota de análise (`/api/analyze`):**
  - Chamadas de LLM (Anthropic / OpenAI / Google AI): **0 chamadas**. Os SDKs estão importados, mas a execução ativa usa rule-sets locais.
  - Chamadas ao Supabase: 1 consulta de saldo (`tenants`) + 1 inserção de log (`audited_tenders`).
* **Durante a rota de busca (`/api/pncp/search`):**
  - Chamada à API pública do Governo Federal (`https://pncp.gov.br/api/consulta/v1/editais`). Gratuita.
* **Durante a rota de pagamento (`/api/payment/create-checkout`):**
  - Chamada à API da Pagou.ai (`https://api.pagou.ai/v1/charges`) se a chave estiver configurada; caso contrário, executa fallback sandbox local.
* **Registro de Consumo Real:**
  - Não localizado nos arquivos inspecionados nenhum log de faturamento ou relatório de consumo de tokens.

### 5.2 Projeção de Custo Mensal (Estimativa Teórica)

#### Cenário Atual (Motor Local em Produção):
| Volume de Análises | Chamadas de IA | Custo de Tokens de IA | Custo Supabase / Edge | Custo Total Estimado |
| :---: | :---: | :---: | :---: | :---: |
| **15 análises / mês** | 0 | R$ 0,00 | Incluso no plano Free/Pro | **R$ 0,00** |
| **50 análises / mês** | 0 | R$ 0,00 | Incluso no plano Free/Pro | **R$ 0,00** |
| **150 análises / mês**| 0 | R$ 0,00 | Incluso no plano Free/Pro | **R$ 0,00** |

#### Cenário Futuro (Se ativada a chamada a Claude 3.5 Sonnet / GPT-4o por edital):
*Premissa teórica:* ~30.000 tokens de entrada (edital truncado) e ~2.000 tokens de saída por análise. Custo médio ponderado de ~US$ 0,15 (R$ 0,85) por edital.
- **15 análises / mês:** ~US$ 2,25 (~R$ 13,00 / mês)
- **50 análises / mês:** ~US$ 7,50 (~R$ 43,00 / mês)
- **150 análises / mês:** ~US$ 22,50 (~R$ 130,00 / mês)

---

## 6. SEGURANÇA E DADOS

### 6.1 Onde os Dados Ficam e o que Sai da Máquina
- **Texto do Edital:** O arquivo PDF é enviado no corpo da requisição HTTP para a rota `/api/analyze`. O texto é extraído em memória (Buffer) no servidor Next.js.
- **Saída de Dados para Terceiros:** No fluxo atual de análise, **nenhum dado sai para OpenAI, Anthropic ou Google**, pois não há chamada externa instanciada. Os dados permanecem entre a instância da aplicação e o banco Supabase.
- **Cofre Documental:** Documentos salvos no Cofre são gerenciados na tabela `vault_documents` do Supabase e arquivos no Cloudflare R2 / Storage. [IMPLEMENTADO - prova: `app/api/vault/upload/route.ts`]

### 6.2 Autenticação e Gestão de Sessão
- Autenticação de clientes via Supabase Auth. [IMPLEMENTADO - prova: `lib/auth-context.tsx`]
- Autenticação administrativa separada via cookie `editalflash_admin_session` com validação de payload em `lib/security.ts`. [IMPLEMENTADO - prova: `lib/security.ts:25-50`]
- **Status de Teste:** [IMPLEMENTADO, SEM TESTE AUTOMATIZADO REGISTRADO].

### 6.3 Isolamento Entre Usuários (Row Level Security - RLS)
- As regras de RLS estão codificadas em scripts SQL:
  - `supabase/007_critical_rls_hardening.sql`: ativa `FORCE ROW LEVEL SECURITY` nas tabelas `profiles`, `audited_tenders`, `vault_documents` e `payments`.
  - `supabase/009_organization_seats.sql`: restringe visualização a membros com mesmo `organization_id` e isola faturamento para `ADMIN`.
- **Status de Auditoria:** [IMPLEMENTADO EM SCRIPT SQL, NÃO VERIFICADO EM AMBIENTE DE BANCO ATIVO]. A existência do arquivo SQL não comprova que os comandos foram aplicados e estão ativos na instância remota do Supabase.

### 6.4 Uso de SHA-256
- **Auditoria de Código:** A inspeção de código por `SHA-256`, `sha256` ou `crypto.createHash('sha256')` em `app/` e `lib/` revelou:
  - O termo "Carimbo SHA-256" presente no material comercial **não possui implementação criptográfica correspondente no código de geração de PDF (`/api/pdf/generate`)**.
  - O hash SHA-256 citado no material comercial é **[PLANEJADO/NÃO IMPLEMENTADO NO CÓDIGO]**.

---

## 7. QUALIDADE E TESTES AUTOMATIZADOS

### 7.1 Testes Automatizados Encontrados
- Arquivo localizado: `tests/multi-user-seats.test.js`. [IMPLEMENTADO - prova: `tests/multi-user-seats.test.js`]
  - Escopo do teste: validação unitária pura das fórmulas de cálculo de seats adicionais, trava máxima de 5 assentos, cálculo da margem de contribuição (R$ 18,98 / 65,4%) e isolamento do plano Starter.
  - Execução: Script Node.js independente que usa `assert`.
- **Demais Testes:**
  - Não foram localizados testes unitários ou de integração para `/api/analyze`, `pdf-parse`, `liquidez-calculator.ts` ou conectores de busca.
  - O comando `npm test` não está configurado no `package.json` (`npm error Missing script: "test"`).
- **Veredito:** `[PARCIAL - 1 TESTE UNITÁRIO LOCALIZADO]`.

### 7.2 Checklist Manual de Conferência em Edital Público
Para verificar manualmente a precisão do motor sem escrever código:
1. **Baixar Edital Público no PNCP:** Selecionar um edital público com Termo de Referência claro (ex: Pregão de Serviços de Engenharia ou Limpeza).
2. **Submeter em `/dashboard/nova-analise`:** Fazer upload do arquivo PDF.
3. **Conferir Categoria Detectada:**
   - [ ] A vertical identificada no topo do laudo bate com o objeto do edital? (Ex: Se for asfalto/reforma, classificou como "Obras"? Se for limpeza predial, classificou como "Serviços Contínuos"?).
4. **Conferir Exigências do Semáforo:**
   - [ ] O que achou: Verificar se as cláusulas listadas (ex: CAT, Registro de Conselho, Atestado de 50%) existem de fato no edital.
   - [ ] Localização de Página: Abrir o PDF original no Adobe Reader / navegador e ir até o número da página indicado no laudo. O trecho está exatamente lá?
   - [ ] Marcação de Revisão Humana: Se a página não tiver numeração textual legível, o sistema marcou `REVISAO_HUMANA_NECESSARIA` ou chutou uma página arbitrária?
5. **Conferir Tríade de Liquidez:**
   - [ ] Os índices $LC$, $LG$ e $SG$ foram calculados com base no balanço cadastrado?
   - [ ] Se o edital exigiu $PL \ge 10\%$, o valor estimado e o percentual calculado batem com o edital?
6. **Conferir Minuta de Impugnação:**
   - [ ] Ao clicar no modal de impugnação, o texto transcreve a cláusula exata do edital ou traz texto genérico?

---

## 8. O QUE NÃO ESTÁ PRONTO (GAP ANALYSIS FACTUAL)

Lista explícita de itens incompletos, não testados ou apenas planejados no estado atual do repositório:

1. **Chamadas de LLM em Tempo Real (`lib/ai-manager.ts`):** Os SDKs estão instalados, mas o motor executa via regras de catálogo locais. Não há pipeline ativo enviando o texto do edital para prompts remotos de OpenAI ou Anthropic. `[PLANEJADO/NÃO IMPLEMENTADO NO FLUXO ATIVO]`.
2. **Carimbo Criptográfico SHA-256 no PDF:** Não há geração de hash SHA-256 no renderizador `@react-pdf/renderer` em `app/api/pdf/generate/route.ts`. `[NÃO IMPLEMENTADO NO CÓDIGO]`.
3. **Assinatura Criptográfica HMAC em URLs do Cofre:** A rota `app/api/vault/signed-url/route.ts` codifica tokens em `base64url` sem assinatura simétrica HMAC com chave secreta do servidor. `[PARCIAL]`.
4. **Extração OCR de Balanços Físicos:** O sistema não possui extrator que leia balanços patrimoniais digitalizados em imagem para preencher Ativo e Passivo automaticamente; opera com base nos valores informados pelo usuário. `[NÃO IMPLEMENTADO]`.
5. **Suíte Completa de Testes Automatizados:** Não há testes de regressão automatizados para rotas de API, conectores multi-fontes ou interface. `npm test` ausente no `package.json`. `[NÃO IMPLEMENTADO]`.
6. **Validação em Produção dos Scripts SQL:** Quatro migrações SQL críticas (`006`, `007`, `008` e `009`) existem como arquivos no repositório, mas dependem de execução manual no console do Supabase para terem efeito real no banco em nuvem. `[NÃO TESTADO EM BANCO REMOTO]`.
7. **Integração Real com Gateway de Pagamento:** Chaves de produção do Pagou.ai não estão configuradas; o código opera via simulação de checkout e sandbox local. `[NÃO TESTADO EM PRODUÇÃO]`.

---

## 9. LISTA DE ARTEFATOS CITADOS PARA EXPORTAÇÃO (CAMINHOS)

Os arquivos abaixo constituem a base documental e técnica inspecionada neste dossiê:
1. `C:\Users\Administrador\editalflash\package.json` (Dependências e scripts)
2. `C:\Users\Administrador\editalflash\app\api\analyze\route.ts` (Pipeline de análise e upload)
3. `C:\Users\Administrador\editalflash\lib\ai-manager.ts` (Orquestrador de auditoria e regras)
4. `C:\Users\Administrador\editalflash\lib\citation-sanitizer.ts` (Sanitizador determinístico de citações)
5. `C:\Users\Administrador\editalflash\lib\liquidez-calculator.ts` (Fórmulas matemáticas de liquidez e PL)
6. `C:\Users\Administrador\editalflash\lib\classifier.ts` (Classificador de verticais de editais)
7. `C:\Users\Administrador\editalflash\lib\sources\aggregator.ts` (Orquestrador multi-fontes de busca)
8. `C:\Users\Administrador\editalflash\lib\sources\pncp.ts` (Conector oficial do PNCP com circuit breaker)
9. `C:\Users\Administrador\editalflash\app\api\payment\webhook\route.ts` (Webhook com verificação de idempotência)
10. `C:\Users\Administrador\editalflash\app\api\vault\signed-url\route.ts` (Geração de URL de documento)
11. `C:\Users\Administrador\editalflash\components\ImpugnationModal.tsx` (Template da minuta de impugnação)
12. `C:\Users\Administrador\editalflash\tests\multi-user-seats.test.js` (Teste unitário de seats e regras de negócio)
13. `C:\Users\Administrador\editalflash\supabase\007_critical_rls_hardening.sql` (Script de RLS do banco de dados)
14. `C:\Users\Administrador\editalflash\supabase\009_organization_seats.sql` (Script de RLS multi-user)
