import { CalculoPatrimonioLiquido } from "./types";

export interface BalancoExtracao {
  ativoCirculante: number;
  realizavelLongoPrazo: number;
  passivoCirculante: number;
  exigivelLongoPrazo: number;
  ativoTotal: number;
  passivoTotal: number;
  patrimonioLiquido: number;
}

export const BALANCO_PADRAO_EMPRESA: BalancoExtracao = {
  ativoCirculante: 680000,
  realizavelLongoPrazo: 120000,
  passivoCirculante: 490000,
  exigivelLongoPrazo: 70000,
  ativoTotal: 1250000,
  passivoTotal: 560000,
  patrimonioLiquido: 420000,
};

export function calcularIndicesLiquidez(
  balanco: BalancoExtracao = BALANCO_PADRAO_EMPRESA,
  exigenciaMinima: number = 1.0
) {
  // LC = Ativo Circulante / Passivo Circulante
  const lc = balanco.passivoCirculante > 0 ? balanco.ativoCirculante / balanco.passivoCirculante : 0;

  // LG = (Ativo Circulante + Realizável a Longo Prazo) / (Passivo Circulante + Exigível a Longo Prazo)
  const denominadorg = balanco.passivoCirculante + balanco.exigivelLongoPrazo;
  const lg = denominadorg > 0 ? (balanco.ativoCirculante + balanco.realizavelLongoPrazo) / denominadorg : 0;

  // SG = Ativo Total / Passivo Total
  const sg = balanco.passivoTotal > 0 ? balanco.ativoTotal / balanco.passivoTotal : 0;

  const atendeTodos = lc >= exigenciaMinima && lg >= exigenciaMinima && sg >= exigenciaMinima;

  return {
    liquidezCorrente: Number(lc.toFixed(2)),
    liquidezGeral: Number(lg.toFixed(2)),
    solvenciaGeral: Number(sg.toFixed(2)),
    exigenciaEdital: exigenciaMinima,
    status: (atendeTodos ? "ATENDE" : "INSUFICIENTE") as "ATENDE" | "INSUFICIENTE",
  };
}

export function gerarCalculoPLComLiquidez(
  valorEstimado: number,
  localEditalTexto: string = "Exigência de Qualificação Econômico-Financeira (Art. 69 da Lei 14.133)"
): CalculoPatrimonioLiquido {
  const plMinimo = valorEstimado * 0.10;
  const plCadastrado = BALANCO_PADRAO_EMPRESA.patrimonioLiquido;
  const plStatus = plCadastrado >= plMinimo ? "SUFICIENTE" : "INSUFICIENTE";
  const indices = calcularIndicesLiquidez(BALANCO_PADRAO_EMPRESA, 1.0);

  return {
    valorEstimadoEdital: valorEstimado,
    percentualExigido: 10,
    plMinimoExigido: plMinimo,
    plEmpresaCadastrado: plCadastrado,
    status: plStatus,
    localEdital: localEditalTexto,
    indicesLiquidez: indices,
  };
}
