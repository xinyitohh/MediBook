import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Renders the favicon SVG (gradient rounded rect + "M") onto a small canvas
 * and returns a PNG data-URL, or null on failure.
 */
function renderLogoDataUrl(size = 40) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Rounded rect clip
    const r = size * 0.25;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.clip();

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, "#0F6FFF");
    grad.addColorStop(1, "#00C48C");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // "M" text
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${size * 0.65}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("M", size / 2, size / 2 + size * 0.04);

    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

/**
 * Generate a clean, single-page MediBook medical report PDF.
 */
export function generateStyledPDF(form, appt, appointmentId) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();   // 210
  const ph = doc.internal.pageSize.getHeight();  // 297
  const ml = 15;   // left margin
  const mr = 15;   // right margin
  const cw = pw - ml - mr;
  let y = 0;

  // ── Palette ──────────────────────────────────────────────
  const blue   = [15, 111, 255];

  const dark   = [22, 28, 45];
  const mid    = [75, 85, 105];
  const light  = [148, 163, 184];
  const rule   = [226, 232, 240];
  const bgCard = [248, 250, 252];
  const white  = [255, 255, 255];

  const setColor = (rgb) => doc.setTextColor(...rgb);
  const font = (style, size) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
  };

  // ════════════════════════════════════════════════════════
  //  HEADER
  // ════════════════════════════════════════════════════════

  // Top accent bar (4 mm) — solid blue
  const barH = 4;
  doc.setFillColor(...white);
  doc.rect(0, 0, pw, barH, "F");

  y = barH + 5;  // 9mm

  // Logo (10×10 mm)
  const logoSize = 10;
  const logoX = ml;
  const logoY = y;

  const logoDataUrl = renderLogoDataUrl(80);
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", logoX, logoY, logoSize, logoSize);
  } else {
    // Fallback drawn logo
    doc.setFillColor(...blue);
    doc.roundedRect(logoX, logoY, logoSize, logoSize, 2, 2, "F");
    font("bold", 8);
    doc.setTextColor(...white);
    doc.text("M", logoX + 3, logoY + 7);
  }

  // Brand name + subtitle
  const textX = logoX + logoSize + 3;
  font("bold", 11);
  setColor(dark);
  doc.text("MediBook", textX, logoY + 4.5);
  font("normal", 6.5);
  setColor(mid);
  doc.text("Medical Report", textX, logoY + 8.5);

  // Ref + date — right aligned
  const reportDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
  font("bold", 6.5);
  setColor(dark);
  doc.text(`#${appointmentId}`, pw - mr, logoY + 4.5, { align: "right" });
  font("normal", 6);
  setColor(light);
  doc.text(reportDate, pw - mr, logoY + 8.5, { align: "right" });

  y = logoY + logoSize + 4;

  // Divider
  doc.setDrawColor(...rule);
  doc.setLineWidth(0.25);
  doc.line(ml, y, pw - mr, y);
  y += 5;

  // ════════════════════════════════════════════════════════
  //  PATIENT + DOCTOR — subtle card row
  // ════════════════════════════════════════════════════════
  const cardH = 18;
  doc.setFillColor(...bgCard);
  doc.roundedRect(ml, y, cw, cardH, 2, 2, "F");

  const halfW = cw / 2;

  // Patient column
  font("bold", 6);
  setColor(light);
  doc.text("PATIENT", ml + 4, y + 5);
  font("bold", 9);
  setColor(dark);
  doc.text(appt.patient || "—", ml + 4, y + 10);
  font("normal", 6.5);
  setColor(mid);
  doc.text(`${appt.date || "—"}  ·  ${appt.time || "—"}`, ml + 4, y + 14.5);

  // Vertical separator
  doc.setDrawColor(...rule);
  doc.setLineWidth(0.2);
  doc.line(ml + halfW, y + 3, ml + halfW, y + cardH - 3);

  // Doctor column
  font("bold", 6);
  setColor(light);
  doc.text("ATTENDING DOCTOR", ml + halfW + 4, y + 5);
  font("bold", 9);
  setColor(dark);
  doc.text(appt.doctor || "—", ml + halfW + 4, y + 10);
  font("normal", 6.5);
  setColor(mid);
  doc.text(appt.specialty || "—", ml + halfW + 4, y + 14.5);

  y += cardH + 6;

  // ════════════════════════════════════════════════════════
  //  HELPERS
  // ════════════════════════════════════════════════════════

  /** Section heading: uppercase label + full-width hairline */
  const section = (title) => {
    font("bold", 7);
    setColor(blue);
    doc.text(title.toUpperCase(), ml, y + 4);
    doc.setDrawColor(...blue);
    doc.setLineWidth(0.4);
    doc.line(ml, y + 6, pw - mr, y + 6);
    // Reset draw color back to rule for subsequent lines
    doc.setDrawColor(...rule);
    y += 11;
  };

  /**
   * Inline label + value on same line if short; wraps value otherwise.
   * Returns the number of mm consumed.
   */
  const field = (label, value) => {
    if (!value) return;
    const maxW = cw - 4;
    font("bold", 6.5);
    setColor(light);
    doc.text(`${label.toUpperCase()}:`, ml + 2, y);
    font("normal", 7.5);
    setColor(dark);
    const lines = doc.splitTextToSize(value, maxW - 28);
    // First line on same row
    doc.text(lines[0], ml + 28, y);
    if (lines.length > 1) {
      doc.text(lines.slice(1), ml + 2, y + 4);
      y += 4.5 + (lines.length - 1) * 3.5 + 2.5;
    } else {
      y += 5.5;
    }
  };

  // ════════════════════════════════════════════════════════
  //  DIAGNOSIS
  // ════════════════════════════════════════════════════════
  section("Diagnosis Details");
  field("Diagnosis", form.diagnosis);
  field("Symptoms", form.symptoms);
  field("Treatment Plan", form.treatment);
  y += 2;

  // ════════════════════════════════════════════════════════
  //  MEDICATIONS TABLE
  // ════════════════════════════════════════════════════════
  const meds = (form.medications || []).filter((m) => m.name?.trim());

  if (meds.length > 0) {
    section("Prescribed Medications");

    autoTable(doc, {
      startY: y,
      margin: { left: ml + 2, right: mr + 2 },
      head: [["#", "Medication", "Dosage", "Frequency", "Duration"]],
      body: meds.map((m, i) => [
        i + 1,
        m.name,
        m.dosage || "—",
        m.frequency || "—",
        m.duration || "—",
      ]),
      headStyles: {
        fillColor: blue,
        textColor: white,
        fontStyle: "bold",
        fontSize: 6.5,
        cellPadding: { top: 2, bottom: 2, left: 2, right: 2 },
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: { top: 2, bottom: 2, left: 2, right: 2 },
        textColor: dark,
      },
      alternateRowStyles: { fillColor: bgCard },
      columnStyles: {
        0: { cellWidth: 7,  halign: "center", fontStyle: "bold", textColor: light },
        1: { cellWidth: 40 },
      },
      theme: "grid",
      styles: { lineColor: rule, lineWidth: 0.15 },
      tableWidth: cw - 4,
    });

    y = doc.lastAutoTable.finalY + 5;
  }

  // ════════════════════════════════════════════════════════
  //  NOTES & FOLLOW-UP
  // ════════════════════════════════════════════════════════
  const hasNotes = form.notes || form.followUpDate;
  if (hasNotes) {
    section("Notes & Follow-up");
    field("Doctor's Notes", form.notes);

    if (form.followUpDate) {
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(ml + 2, y - 1, cw - 4, 8, 1.5, 1.5, "F");
      doc.setFillColor(...blue);
      doc.rect(ml + 2, y - 1, 2, 8, "F");
      font("bold", 7);
      setColor(blue);
      doc.text(`Follow-up appointment:`, ml + 7, y + 2.5);
      font("normal", 7);
      setColor(dark);
      doc.text(form.followUpDate, ml + 50, y + 2.5);
      y += 11;
    }
  }

  // ════════════════════════════════════════════════════════
  //  SIGNATURE BLOCK
  // ════════════════════════════════════════════════════════
  // Place signature at bottom-right, above footer
  const footerY = ph - 14;
  const sigY = Math.max(y + 6, footerY - 22);

  if (sigY + 18 < footerY) {
    // Signature line
    doc.setDrawColor(...rule);
    doc.setLineWidth(0.25);
    const sigLineW = 52;
    const sigLineX = pw - mr - sigLineW;
    doc.line(sigLineX, sigY + 10, pw - mr, sigY + 10);
    font("normal", 6);
    setColor(light);
    doc.text("Attending Doctor's Signature", sigLineX + sigLineW / 2, sigY + 14, { align: "center" });
    font("bold", 7);
    setColor(dark);
    doc.text(appt.doctor || "—", sigLineX + sigLineW / 2, sigY + 18, { align: "center" });
  }

  // ════════════════════════════════════════════════════════
  //  FOOTER
  // ════════════════════════════════════════════════════════
  doc.setDrawColor(...rule);
  doc.setLineWidth(0.2);
  doc.line(ml, footerY - 2, pw - mr, footerY - 2);

  font("normal", 5.5);
  setColor(light);
  doc.text(
    "This is a computer-generated document. No physical signature is required.",
    ml,
    footerY + 2,
  );

  font("bold", 6);
  setColor(blue);
  doc.text("MediBook", pw - mr, footerY + 1, { align: "right" });
  font("normal", 5.5);
  setColor(light);
  doc.text("Healthcare System", pw - mr, footerY + 4.5, { align: "right" });

  // Bottom accent bar (3 mm) — solid blue
  doc.setFillColor(...blue);
  doc.rect(0, ph - 3, pw, 3, "F");

  // ════════════════════════════════════════════════════════
  //  SAVE
  // ════════════════════════════════════════════════════════
  const safeName = (appt.patient || "Patient").replace(/\s+/g, "_");
  doc.save(`MediBook_Report_${safeName}_${appointmentId}.pdf`);
  return doc;
}
