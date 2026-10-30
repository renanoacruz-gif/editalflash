import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "1.1.0",
    effectiveDate: "2026-10-28",
    documents: {
      terms: {
        id: "termos-de-uso",
        title: "Termo de Uso e Responsabilidade Compartilhada",
        version: "1.1.0",
        lastUpdated: "2026-10-28",
      },
      privacy: {
        id: "politica-privacidade",
        title: "Política de Privacidade e Tratamento de Dados Pessoais (LGPD)",
        version: "1.1.0",
        lastUpdated: "2026-10-28",
      },
      security: {
        id: "seguranca-informacao",
        title: "Declaração de Segurança da Informação e Governança",
        version: "1.1.0",
        lastUpdated: "2026-10-28",
      },
    },
    dpoContact: "dpo@editalflash.com.br",
    privacyContact: "privacidade@editalflash.com.br",
  });
}
