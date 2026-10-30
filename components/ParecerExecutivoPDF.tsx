import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { EditalAnalysisResponse, HabilitacaoItem } from "@/lib/types";

// Design System Identity v1.1 Palette & Styles for A4 Print
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    color: "#0E1626",
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 36,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  headerContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#0E1626",
    paddingBottom: 10,
    marginBottom: 12,
  },
  institutionSubtitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    color: "#2740F0",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  title: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#0E1626",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 4,
  },
  metaText: {
    fontSize: 8,
    color: "#4A5568",
  },
  metaHighlight: {
    fontFamily: "Helvetica-Bold",
    color: "#0E1626",
  },
  // Executive Summary Box (4-column grid + Overall verdict)
  summaryContainer: {
    backgroundColor: "#F3F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 4,
    padding: 8,
    marginBottom: 14,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    borderBottomWidth: 0.75,
    borderBottomColor: "#CBD5E1",
    paddingBottom: 4,
  },
  summaryTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0E1626",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  verdictBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  verdictBadgePassa: {
    backgroundColor: "#059669",
  },
  verdictBadgeRessalva: {
    backgroundColor: "#D97706",
  },
  verdictBadgeEliminatoria: {
    backgroundColor: "#DC2626",
  },
  verdictBadgeRevisao: {
    backgroundColor: "#4B5563",
  },
  verdictBadgeText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 0.8,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  summaryCol: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 0.75,
    borderColor: "#E2E8F0",
    borderRadius: 3,
    padding: 6,
    alignItems: "center",
  },
  summaryColLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  summaryColValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
  },
  // Table Styling
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#0E1626",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 6,
    borderBottomWidth: 0.75,
    borderBottomColor: "#CBD5E1",
    paddingBottom: 2,
  },
  table: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 0.75,
    borderColor: "#CBD5E1",
    borderRadius: 3,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0E1626",
    color: "#FFFFFF",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  tableHeaderText: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  tableRowEven: {
    backgroundColor: "#F8FAFC",
  },
  colArtigo: { width: "16%" },
  colDoc: { width: "26%" },
  colLocal: { width: "22%" },
  colDiagnostico: { width: "24%" },
  colStatus: { width: "12%", alignItems: "flex-end" },
  textRegular: {
    fontSize: 7.5,
    color: "#334155",
  },
  textMono: {
    fontSize: 7,
    fontFamily: "Courier",
    color: "#1E293B",
  },
  badgeStatus: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 1.5,
    paddingHorizontal: 4,
    borderRadius: 2,
    textAlign: "center",
  },
  statusPassa: {
    backgroundColor: "#ECFDF5",
    color: "#065F46",
    borderWidth: 0.5,
    borderColor: "#A7F3D0",
  },
  statusRessalva: {
    backgroundColor: "#FFFBEB",
    color: "#92400E",
    borderWidth: 0.5,
    borderColor: "#FDE68A",
  },
  statusEliminatoria: {
    backgroundColor: "#FEF2F2",
    color: "#991B1B",
    borderWidth: 0.5,
    borderColor: "#FECACA",
  },
  statusRevisao: {
    backgroundColor: "#F3F4F6",
    color: "#374151",
    borderWidth: 0.5,
    borderColor: "#D1D5DB",
  },
  // Metrics Row (PL & Atestados)
  metricsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 0.75,
    borderColor: "#CBD5E1",
    borderRadius: 3,
    padding: 6,
  },
  metricCardTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#0E1626",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  metricDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    marginBottom: 1.5,
  },
  // Disclaimer Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    borderTopWidth: 0.75,
    borderTopColor: "#CBD5E1",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 6.5,
    color: "#64748B",
    maxWidth: "80%",
  },
  footerPageNum: {
    fontSize: 7,
    fontFamily: "Courier",
    color: "#64748B",
  },
});

interface ParecerExecutivoPDFProps {
  data: EditalAnalysisResponse;
  companyName: string;
  companyCnpj?: string;
  emitidoEm?: string;
}

export const ParecerExecutivoPDF: React.FC<ParecerExecutivoPDFProps> = ({
  data,
  companyName,
  companyCnpj,
  emitidoEm,
}) => {
  const semaforo = data.semaforo_habilitacao || [];
  const passaCount = semaforo.filter((i) => i.status === "PASSA").length;
  const ressalvaCount = semaforo.filter((i) => i.status === "RESSALVA").length;
  const eliminatoriaCount = semaforo.filter((i) => i.status === "ELIMINATORIA").length;
  const revisaoCount = semaforo.filter((i) => i.status === "REVISAO_HUMANA_NECESSARIA").length;

  const vereditoGeral =
    data.veredito_habilitacao ||
    (eliminatoriaCount > 0
      ? "ELIMINATORIA"
      : ressalvaCount > 0
      ? "RESSALVA"
      : revisaoCount > 0
      ? "REVISAO_HUMANA_NECESSARIA"
      : "PASSA");

  const vereditoLabel =
    vereditoGeral === "PASSA"
      ? "HABILITAÇÃO PROVÁVEL (PASSA)"
      : vereditoGeral === "RESSALVA"
      ? "RESSALVA / CORRIGÍVEL"
      : vereditoGeral === "ELIMINATORIA"
      ? "INABILITAÇÃO CRÍTICA (ELIMINATÓRIA)"
      : "REVISÃO HUMANA NECESSÁRIA";

  const getVerdictBadgeStyle = () => {
    switch (vereditoGeral) {
      case "PASSA":
        return styles.verdictBadgePassa;
      case "RESSALVA":
        return styles.verdictBadgeRessalva;
      case "ELIMINATORIA":
        return styles.verdictBadgeEliminatoria;
      default:
        return styles.verdictBadgeRevisao;
    }
  };

  const dataFormatada =
    emitidoEm ||
    new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const pl = data.calculo_patrimonio_liquido;
  const atestados = data.calculo_atestados || [];

  return (
    <Document title={`Parecer_Habilitacao_${data.dados_gerais.numero_edital || "Edital"}.pdf`}>
      <Page size="A4" style={styles.page}>
        {/* HEADER INSTITUCIONAL */}
        <View style={styles.headerContainer}>
          <Text style={styles.institutionSubtitle}>
            AUDITORIA PREVENTIVA DE HABILITAÇÃO — LEI 14.133/2021
          </Text>
          <Text style={styles.title}>
            PARECER TÉCNICO PRELIMINAR DE HABILITAÇÃO
          </Text>
          <View style={styles.metaRow}>
            <View>
              <Text style={styles.metaText}>
                Licitante: <Text style={styles.metaHighlight}>{companyName}</Text>
                {companyCnpj ? ` | CNPJ: ${companyCnpj}` : ""}
              </Text>
              <Text style={styles.metaText}>
                Órgão Convocante: <Text style={styles.metaHighlight}>{data.dados_gerais.orgao || "Não Informado"}</Text>
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.metaText}>
                Edital: <Text style={styles.metaHighlight}>{data.dados_gerais.numero_edital || "S/N"}</Text>
              </Text>
              <Text style={styles.metaText}>
                Emissão: <Text style={styles.metaHighlight}>{dataFormatada}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* EXECUTIVE SUMMARY BOX */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Síntese Executiva de Conformidade</Text>
            <View style={[styles.verdictBadge, getVerdictBadgeStyle()]}>
              <Text style={styles.verdictBadgeText}>{vereditoLabel}</Text>
            </View>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryColLabel}>Conformes</Text>
              <Text style={[styles.summaryColValue, { color: "#059669" }]}>{passaCount}</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryColLabel}>Corrigíveis</Text>
              <Text style={[styles.summaryColValue, { color: "#D97706" }]}>{ressalvaCount}</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryColLabel}>Eliminatórias</Text>
              <Text style={[styles.summaryColValue, { color: "#DC2626" }]}>{eliminatoriaCount}</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={styles.summaryColLabel}>Revisão OCR</Text>
              <Text style={[styles.summaryColValue, { color: "#4B5563" }]}>{revisaoCount}</Text>
            </View>
          </View>
        </View>

        {/* METRICS ROW (PL & Atestados) */}
        <View style={styles.metricsContainer}>
          {pl && (
            <View style={styles.metricCard}>
              <Text style={styles.metricCardTitle}>Qualificação Econômico-Financeira (Art. 69)</Text>
              <View style={styles.metricDetailRow}>
                <Text style={styles.textRegular}>PL Exigido ({pl.percentualExigido}%):</Text>
                <Text style={styles.textMono}>R$ {pl.plMinimoExigido.toLocaleString("pt-BR")}</Text>
              </View>
              <View style={styles.metricDetailRow}>
                <Text style={styles.textRegular}>PL Cadastrado:</Text>
                <Text style={styles.textMono}>R$ {pl.plEmpresaCadastrado.toLocaleString("pt-BR")}</Text>
              </View>
              {pl.indicesLiquidez && (
                <View style={styles.metricDetailRow}>
                  <Text style={styles.textRegular}>Índices (LC / LG / SG):</Text>
                  <Text style={styles.textMono}>
                    {pl.indicesLiquidez.liquidezCorrente.toFixed(2)} | {pl.indicesLiquidez.liquidezGeral.toFixed(2)} | {pl.indicesLiquidez.solvenciaGeral.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {atestados.length > 0 && (
            <View style={styles.metricCard}>
              <Text style={styles.metricCardTitle}>Capacidade Técnica (Art. 67 / Súmula 263)</Text>
              <View style={styles.metricDetailRow}>
                <Text style={styles.textRegular}>Exigência Edital (50%):</Text>
                <Text style={styles.textMono}>
                  {atestados[0].regraCinquentaPorcentoExigida.toLocaleString("pt-BR")} {atestados[0].unidade}
                </Text>
              </View>
              <View style={styles.metricDetailRow}>
                <Text style={styles.textRegular}>Maior Atestado Único:</Text>
                <Text style={styles.textMono}>
                  {atestados[0].quantidadeComprovadaEmpresa.toLocaleString("pt-BR")} {atestados[0].unidade}
                </Text>
              </View>
              {atestados[0].somatorioAtestadosAcervo && (
                <View style={styles.metricDetailRow}>
                  <Text style={styles.textRegular}>Somatório Acervo (Súmula 263):</Text>
                  <Text style={styles.textMono}>
                    {atestados[0].somatorioAtestadosAcervo.toLocaleString("pt-BR")} {atestados[0].unidade}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* STATIC AUDIT TABLE */}
        <Text style={styles.sectionTitle}>Quadro Detalhado de Verificação — Art. 62</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colArtigo}><Text style={styles.tableHeaderText}>Artigo / Categoria</Text></View>
            <View style={styles.colDoc}><Text style={styles.tableHeaderText}>Documento Exigido</Text></View>
            <View style={styles.colLocal}><Text style={styles.tableHeaderText}>Localização no Edital</Text></View>
            <View style={styles.colDiagnostico}><Text style={styles.tableHeaderText}>Diagnóstico / Apuração</Text></View>
            <View style={styles.colStatus}><Text style={styles.tableHeaderText}>Veredito</Text></View>
          </View>

          {semaforo.slice(0, 8).map((item, index) => {
            const isEven = index % 2 === 0;
            const statusStyle =
              item.status === "PASSA"
                ? styles.statusPassa
                : item.status === "RESSALVA"
                ? styles.statusRessalva
                : item.status === "ELIMINATORIA"
                ? styles.statusEliminatoria
                : styles.statusRevisao;

            return (
              <View key={item.id || index} style={[styles.tableRow, isEven ? styles.tableRowEven : {}]}>
                <View style={styles.colArtigo}>
                  <Text style={styles.textRegular}>{item.categoria.replace(/\(.*\)/, "").trim()}</Text>
                </View>
                <View style={styles.colDoc}>
                  <Text style={[styles.textRegular, { fontFamily: "Helvetica-Bold" }]}>{item.documento}</Text>
                </View>
                <View style={styles.colLocal}>
                  <Text style={styles.textMono}>{item.localEdital || "Não citada"}</Text>
                </View>
                <View style={styles.colDiagnostico}>
                  <Text style={styles.textRegular}>{item.diagnostico}</Text>
                </View>
                <View style={styles.colStatus}>
                  <Text style={[styles.badgeStatus, statusStyle]}>{item.status}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* DISCLAIMER FOOTER PERSISTENTE */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Documento de suporte à decisão emitido pelo EditalFlash. Responsabilidade jurídica permanece com a empresa licitante. Base normativa: Lei Federal nº 14.133/2021.
          </Text>
          <Text
            style={styles.footerPageNum}
            render={({ pageNumber, totalPages }) => `Pág. ${pageNumber} de ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};
