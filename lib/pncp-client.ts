// lib/pncp-client.ts
// Explicação: Esta função faz uma requisição segura à API pública do PNCP.
// Usamos 'cache: no-store' para garantir dados frescos em tempo real.

export async function searchPNCP(uf?: string, objeto?: string) {
  const baseUrl = "https://pncp.gov.br/api/consulta/v1/editais";
  
  // Constrói a URL com filtros opcionais
  const params = new URLSearchParams();
  if (uf) params.append("codigoUf", uf);
  if (objeto) params.append("objetoCompra", objeto);
  
  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: { "Accept": "application/json" },
      cache: "no-store" // Evita dados antigos salvos pelo Next.js
    });

    if (!response.ok) throw new Error(`Erro PNCP: ${response.status}`);
    
    const data = await response.json();
    // Retorna apenas os campos essenciais para economizar tokens
    if (!data || !Array.isArray(data.data)) {
      return [];
    }
    
    return data.data.map((edital: any) => ({
      id: edital.numeroControlePNCP,
      objeto: edital.objetoCompra,
      orgao: edital.orgaoEntidade?.razaoSocial || "Órgão Público",
      dataAbertura: edital.dataAberturaProposta,
      linkPdf: edital.linkProcessoEletronico || edital.linkSistemaOrigem || null
    }));
  } catch (error) {
    console.error("Falha ao buscar no PNCP:", error);
    return [];
  }
}
