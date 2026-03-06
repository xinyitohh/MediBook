import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#374151",
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    backgroundColor: "#ffffff",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#0F6FFF",
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: "#0F6FFF",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: "#fff", fontSize: 16, fontFamily: "Helvetica-Bold" },
  brandName: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#1A1D26", marginTop: 2 },
  headerRight: { alignItems: "flex-end" },
  reportTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#0F6FFF" },
  reportMeta: { fontSize: 8, color: "#9ca3af", marginTop: 3 },

  // Patient info
  infoRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  infoBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  infoLabel: { fontSize: 7, color: "#9ca3af", fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 },
  infoValue: { fontSize: 10, color: "#111827", fontFamily: "Helvetica-Bold" },

  // Section
  section: { marginBottom: 16 },
  sectionHeader: {
    backgroundColor: "#EFF6FF",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#0F6FFF", textTransform: "uppercase", letterSpacing: 0.8 },
  sectionBody: { paddingHorizontal: 2, lineHeight: 1.6 },
  bodyText: { fontSize: 10, color: "#374151" },

  // Medications table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0F6FFF",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 4,
  },
  tableHeaderCell: { flex: 1, fontSize: 8, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tableRowAlt: { backgroundColor: "#F9FAFB" },
  tableCell: { flex: 1, fontSize: 9, color: "#374151" },

  // Follow-up
  followUp: {
    marginTop: 4,
    padding: 10,
    backgroundColor: "#ECFDF5",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#00C48C",
  },
  followUpText: { fontSize: 10, color: "#065F46", fontFamily: "Helvetica-Bold" },

  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 8,
  },
  footerText: { fontSize: 8, color: "#9ca3af" },
  footerBrand: { fontSize: 8, color: "#0F6FFF", fontFamily: "Helvetica-Bold" },
});

export default function ReportPDFDocument({ form, appt }) {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
  const meds = form.medications?.filter((m) => m.name?.trim());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>M</Text>
            </View>
            <Text style={styles.brandName}>MediBook</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.reportTitle}>Medical Report</Text>
            <Text style={styles.reportMeta}>Generated: {date}</Text>
          </View>
        </View>

        {/* Patient & Doctor info */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Patient</Text>
            <Text style={styles.infoValue}>{appt.patient || "—"}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Doctor</Text>
            <Text style={styles.infoValue}>{appt.doctor || "—"}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Appointment Date</Text>
            <Text style={styles.infoValue}>{appt.date || "—"}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Specialty</Text>
            <Text style={styles.infoValue}>{appt.specialty || "—"}</Text>
          </View>
        </View>

        {/* Diagnosis */}
        {form.diagnosis && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Diagnosis</Text>
            </View>
            <View style={styles.sectionBody}>
              <Text style={styles.bodyText}>{form.diagnosis}</Text>
            </View>
          </View>
        )}

        {/* Symptoms */}
        {form.symptoms && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Symptoms</Text>
            </View>
            <View style={styles.sectionBody}>
              <Text style={styles.bodyText}>{form.symptoms}</Text>
            </View>
          </View>
        )}

        {/* Treatment */}
        {form.treatment && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Treatment Plan</Text>
            </View>
            <View style={styles.sectionBody}>
              <Text style={styles.bodyText}>{form.treatment}</Text>
            </View>
          </View>
        )}

        {/* Medications */}
        {meds?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Prescribed Medications</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Medicine</Text>
              <Text style={styles.tableHeaderCell}>Dosage</Text>
              <Text style={styles.tableHeaderCell}>Frequency</Text>
              <Text style={styles.tableHeaderCell}>Duration</Text>
            </View>
            {meds.map((med, i) => (
              <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                <Text style={styles.tableCell}>{med.name || "—"}</Text>
                <Text style={styles.tableCell}>{med.dosage || "—"}</Text>
                <Text style={styles.tableCell}>{med.frequency || "—"}</Text>
                <Text style={styles.tableCell}>{med.duration || "—"}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Doctor Notes */}
        {form.notes && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Doctor Notes</Text>
            </View>
            <View style={styles.sectionBody}>
              <Text style={styles.bodyText}>{form.notes}</Text>
            </View>
          </View>
        )}

        {/* Follow-up */}
        {form.followUpDate && (
          <View style={styles.followUp}>
            <Text style={styles.followUpText}>Follow-up Appointment: {form.followUpDate}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>This document is confidential and intended for the patient only.</Text>
          <Text style={styles.footerBrand}>MediBook — Healthcare, Simplified.</Text>
        </View>
      </Page>
    </Document>
  );
}
