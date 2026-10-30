# ⚡ EditalFlash - AI-Powered Public Tender Analyzer

> **Transforme 200 páginas de burocracia em 2 minutos de clareza.**
> Plataforma SaaS B2B de alta conversão para leitura, tradução e auditoria de editais de licitação da Administração Pública brasileira (Lei 14.133/2021).

---

## 🔒 AVISO CRÍTICO DE SEGURANÇA (.env.local)

> [!CAUTION]
> **NUNCA compartilhe, comite no Git ou exponha publicamente suas chaves de API.**
> O arquivo `.env.local` contém credenciais de acesso faturáveis da Anthropic, Google Gemini e OpenAI. Certifique-se de que o `.env.local` esteja sempre listado no seu `.gitignore`.

---

## 🚀 Guia Passo a Passo para Execução (Step-by-Step)

### 1. Extrair os Arquivos
Extraia o conteúdo do arquivo ZIP para a pasta desejada em seu computador.

### 2. Abrir o Terminal ou PowerShell
Navegue até a pasta raiz do projeto extraído:
```powershell
cd caminho/para/editalflash
```

### 3. Instalar as Dependências
Execute o comando abaixo para instalar todos os pacotes necessários:
```powershell
npm install
```

### 4. Configurar as Chaves no `.env.local`
Abra o arquivo `.env.local` em seu editor de código e insira suas chaves de API reais:
```env
# Obtenha em: https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-usr-...

# Obtenha em: https://aistudio.google.com
GOOGLE_AI_API_KEY=AIzaSy...

# Obtenha em: https://platform.openai.com
OPENAI_API_KEY=sk-proj-...
```

### 5. Iniciar o Servidor de Desenvolvimento
Inicie a aplicação local:
```powershell
npm run dev
```

### 6. Acessar a Aplicação
Abra seu navegador em:
👉 **[http://localhost:3000](http://localhost:3000)**

Para acessar no mesmo Wi-Fi a partir do celular ou outro computador:
👉 **http://192.168.1.6:3000**

---

## 🧠 Arquitetura do Sistema Multi-IA (`lib/ai-manager.ts`)

A aplicação utiliza um sistema inteligente de contingência (*Failover Cascade*):
1. **Anthropic Claude (Claude 3.7 Sonnet):** Provedor primário de máxima acurácia jurídica.
2. **Google Gemini (Gemini 2.5 Flash):** Fallback 1 automático caso o Claude atinja limites de taxa ou falhe.
3. **OpenAI (GPT-4o):** Fallback 2 automático garantindo 99.9% de disponibilidade com saída estrita em JSON.

### Limite de Caracteres
O texto extraído do PDF é truncado com segurança em **45.000 caracteres**, garantindo baixo custo, respostas em menos de 15 segundos e prevenção de erros de context window.

---

## 📐 Estrutura de Componentes

- **`components/FileUpload.tsx`**: Drag-and-drop zone com validação de PDFs, envio via FormData e tratamento visual de erros.
- **`components/ScanningLoader.tsx`**: Efeito de scanner com laser azul infinito e mensagens dinâmicas orquestradas por Framer Motion.
- **`components/ReportCard.tsx`**: Dashboard executivo em 3 colunas:
  - **Summary (Esquerda):** Objeto e metadados estruturados.
  - **Deep Dive (Centro):** Cláusulas restritivas com bordas vermelhas e botão de copiar trecho original.
  - **Checklist & Risco (Direita):** Nível de risco semafórico e checklist com barra circular.
- **`components/PricingSection.tsx`**: Modelo de precificação com Setup Único (R$ 497) e Assinatura Pro (R$ 297/mês), acompanhado de tabela comparativa completa.
- **`app/api/analyze/route.ts`**: Rota App Router que processa PDFs reais via `pdf-parse` e invoca `analyzeWithAI()`.

---

## 💻 Tecnologias Empregadas
- **Next.js 14+ (App Router)**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**
- **pdf-parse**
- **Anthropic SDK / Google GenAI SDK / OpenAI SDK**
- **Canvas-Confetti**
