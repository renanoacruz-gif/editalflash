# 📐 EDITALFLASH DESIGN SYSTEM (ENTERPRISE JURÍDICO)

## 1. Filosofia e Identidade
O EditalFlash é uma plataforma pericial de auditoria de editais de licitação (Lei 14.133/2021). A interface segue rigor corporativo nos moldes de Linear, Stripe e Mercury:
- **Zero Vibe Coding:** Proibido uso de ícones 3D, efeitos neon, bordas fluorescentes ou "vidro líquido".
- **Sem Cards Fechados em Excesso:** Informações são agrupadas com **linhas divisórias sutis (`border-b border-[#253745]`)**, listas contínuas e espaçamento amplo (`gap-6` a `gap-8`), evitando o aspecto "quadradinho/robótico".
- **Legibilidade Imediata:** Se o fundo é escuro, a fonte é clara (`#CCD0CF` ou `#FFFFFF`). Se o fundo é claro, a fonte é escura (`#06141B`). Contraste WCAG AAA.

---

## 2. Paleta Institucional Profunda (Tokens Semânticos)

```css
:root {
  /* Dark Mode Padrão (Foco Pericial Enterprise) */
  --bg-base: #06141B;        /* Fundo principal profundo */
  --bg-surface: #11212D;     /* Superfícies elevadas e painéis */
  --bg-subtle: #162a39;      /* Destaque sutil de linha/hover */
  --border-default: #253745; /* Linhas divisórias sutis de 1px */
  --border-muted: #1c2b36;   /* Separadores secundários */

  --text-primary: #CCD0CF;   /* Leitura principal e títulos */
  --text-bright: #FFFFFF;    /* Números de métricas e ênfase */
  --text-secondary: #9BA8AB; /* Metadados, subtítulos e labels */
  --text-muted: #4A5C6A;     /* Placeholders, timestamps, rodapés */

  --brand-primary: #11212D;  /* Ações primárias */
  --brand-border: #253745;   /* Borda de ação */
  --brand-hover: #253745;    /* Hover de botões */

  /* Semáforo Tripartite Jurídico Suavizado (Pills com 10% fundo) */
  --status-pass-text: #10B981;
  --status-pass-bg: rgba(16, 185, 129, 0.12);
  --status-pass-border: rgba(16, 185, 129, 0.25);

  --status-warning-text: #F59E0B;
  --status-warning-bg: rgba(245, 158, 11, 0.12);
  --status-warning-border: rgba(245, 158, 11, 0.25);

  --status-danger-text: #EF4444;
  --status-danger-bg: rgba(239, 68, 68, 0.12);
  --status-danger-border: rgba(239, 68, 68, 0.25);
}
```

---

## 3. Tipografia e Uso
- **UI & Leitura:** `Inter` ou `IBM Plex Sans` (pesos 400, 500, 600).
- **Dados Técnicos & Métricas:** `IBM Plex Mono` / `font-mono` (exclusivo para valores monetários, índices de liquidez LC/LG/SG, números de artigos de lei, páginas e hashes SHA-256).

---

## 4. Diretrizes de Componentes
1. **Listas e Métricas:** Dispor valores com labels pequenos `text-xs uppercase tracking-wider text-[#9BA8AB]` e métricas grandes `font-mono text-3xl font-semibold text-white`.
2. **Divisores:** Usar `<div className="border-b border-[#253745] my-4" />` em vez de criar novas caixas/cards.
3. **Barras de Progresso:** Altura fina `h-1.5 rounded-full bg-[#253745]`, preenchimento suave com semáforo correspondente.
4. **Tabelas:** Células com respiro vertical `py-4`, texto legível sem truncamentos agressivos.
