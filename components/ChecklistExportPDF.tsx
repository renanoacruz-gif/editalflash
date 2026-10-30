import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { CompanyDocumentVaultItem } from "@/lib/types";

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
    marginBottom: 14,
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
  // Table
  table: {
    width: "100%",
    borderWidth: 0.75,
    borderColor: "#CBD5E1",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 14,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0E1626",
    color: "#FFFFFF",
    paddingVertical: 5,
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
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  tableRowEven: {
    backgroundColor: "#F8FAFC",
  },
  colTipo: { width: "20%" },
  colDoc: { width: "30%" },
  colEmissor: { width: "20%" },
  colValidade: { width: "15%" },
  colStatus: { width: "15%", alignItems: "flex-end" },
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
  statusValido: {
    backgroundColor: "#ECFDF5",
    color: "#065F46",
    borderWidth: 0.5,
    borderColor: "#A7F3D0",
  },
  statusExpirando: {
    backgroundColor: "#FFFBEB",
    color: "#92400E",
    borderWidth: 0.5,
    borderColor: "#FDE68A",
  },
  statusVencido: {
    backgroundColor: "#FEF2F2",
    color: "#991B1B",
    borderWidth: 0.5,
    borderColor: "#FECACA",
  },
  actionBox: {
    backgroundColor: "#F3F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 3,
    padding: 8,
    marginBottom: 12,
  },
  actionBoxTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0E1626",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  actionText: {
    fontSize: 7.5,
    color: "#475569",
    lineHeight: 1.3,
  },
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

interface ChecklistExportPDFProps {
  companyName: string;
  cnpj?: string;
  docs: CompanyDocumentVaultItem[];
  emitidoEm?: string;
}

export const ChecklistExportPDF: React.FC<ChecklistExportPDFProps> = ({
  companyName,
  cnpj,
  docs,
  emitidoEm,
}) => {
  const dataFormatada =
    emitidoEm ||
    new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const expiringCount = docs.filter((d) => d.status === "EXPIRANDO").length;
  const expiredCount = docs.filter((d) => d.status === "VENCIDO" || d.diasParaVencer < 0).length;

  return (
    <Document title={`Checklist_Contabil_${companyName.replace(/\s+/g, "_")}.pdf`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.institutionSubtitle}>
            CONTROLADORIA & AUDITORIA DE HABILITAÇÃO — LEI 14.133/2021
          </Text>
          <Text style={styles.title}>
            RELATÓRIO DE CONFERÊNCIA DOCUMENTAL & CHECKLIST CONTÁBIL
          </Text>
          <View style={styles.metaRow}>
            <View>
              <Text style={styles.metaText}>
                Empresa: <Text style={styles.metaHighlight}>{companyName}</Text>
                {cnpj ? ` | CNPJ: ${cnpj}` : ""}
              </Text>
              <Text style={styles.metaText}>
                Destinatário: <Text style={styles.metaHighlight}>Diretoria / Setor Contábil e Fiscal</Text>
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.metaText}>
                Emissão: <Text style={styles.metaHighlight}>{dataFormatada}</Text>
              </Text>
              <Text style={styles.metaText}>
                Status do Cofre: <Text style={styles.metaHighlight}>{docs.length} itens monitorados</Text>
              </Text>
            </View>
          </View>
        </View>

        {(expiringCount > 0 || expiredCount > 0) && (
          <View style={styles.actionBox}>
            <Text style={styles.actionBoxTitle}>Avisos de Atenção Crítica para o Departamento Fiscal</Text>
            <Text style={styles.actionText}>
              Foram detectados {expiredCount} documento(s) vencido(s) e {expiringCount} certidão(ões) com validade inferior a 30 dias.
              Recomenda-se a imediata emissão de novas guias e certidões negativas junto aos respectivos órgãos expedidores para evitar inabilitação sumária em sessões públicas iminentes.
            </Text>
          </View>
        )}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colTipo}><Text style={styles.tableHeaderText}>Tipo / Categoria</Text></View>
            <View style={styles.colDoc}><Text style={styles.tableHeaderText}>Documento / Certidão</Text></View>
            <View style={styles.colEmissor}><Text style={styles.tableHeaderText}>Órgão Emissor</Text></View>
            <View style={styles.colValidade}><Text style={styles.tableHeaderText}>Validade</Text></View>
            <View style={styles.colStatus}><Text style={styles.tableHeaderText}>Situação</Text></View>
          </View>

          {docs.map((doc, index) => {
            const isEven = index % 2 === 0;
            const isVencido = doc.status === "VENCIDO" || doc.diasParaVencer < 0;
            const isExpirando = doc.status === "EXPIRANDO";

            const badgeStyle = isVencido
              ? styles.statusVencido
              : isExpirando
              ? styles.statusExpirando
              : styles.statusValido;

            const badgeText = isVencido
              ? "VENCIDO"
              : isExpirando
              ? `EXPIRA EM ${doc.diasParaVencer}D`
              : "REGULAR";

            return (
              <View key={doc.id || index} style={[styles.tableRow, isEven ? styles.tableRowEven : {}]}>
                <View style={styles.colTipo}>
                  <Text style={styles.textRegular}>{doc.tipo}</Text>
                </View>
                <View style={styles.colDoc}>
                  <Text style={[styles.textRegular, { fontFamily: "Helvetica-Bold" }]}>{doc.nome}</Text>
                </View>
                <View style={styles.colEmissor}>
                  <Text style={styles.textRegular}>{doc.emissor}</Text>
                </View>
                <View style={styles.colValidade}>
                  <Text style={styles.textMono}>
                    {doc.diasParaVencer > 1000
                      ? "Permanente"
                      : new Date(doc.dataValidade).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
                <View style={styles.colStatus}>
                  <Text style={[styles.badgeStatus, badgeStyle]}>{badgeText}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Relatório gerado automaticamente pelo EditalFlash. Base de verificação: Art. 62 a 69 da Lei Federal nº 14.133/2021.
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
