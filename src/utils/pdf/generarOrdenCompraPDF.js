import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generarOrdenCompraPDF = async (ordenData) => {

    if (!ordenData) return;

    const doc = new jsPDF("p", "mm", "a4");

    // COLORES
    const vino = [128, 0, 0];
    const dorado = [212, 175, 55];
    const gris = [80, 80, 80];

    // =========================
    // MARCO
    // =========================
    doc.setDrawColor(...vino);
    doc.setLineWidth(0.6);
    doc.rect(8, 8, 194, 281);

    // =========================
    // HEADER
    // =========================
    doc.setFillColor(...vino);
    doc.rect(8, 8, 194, 18, "F");

    // TITULO
    doc.setTextColor(255, 255, 255);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");

    doc.text(
        "ORDEN DE COMPRA",
        105,
        20,
        { align: "center" }
    );

    // =========================
    // EMPRESA
    // =========================
    doc.setTextColor(...gris);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    doc.text(
        ordenData.empresa.nombre || "",
        14,
        38
    );

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.text(
        `RUC: ${ordenData.empresa.ruc || ""}`,
        14,
        44
    );

    doc.text(
        ordenData.empresa.direccion || "",
        14,
        49
    );

    doc.text(
        ordenData.empresa.web || "",
        14,
        54
    );

    // =========================
    // CAJA OC
    // =========================
    doc.setDrawColor(...vino);

    doc.rect(140, 34, 50, 26);

    doc.setFont("helvetica", "bold");

    doc.setFontSize(10);

    doc.text(
        "N° ORDEN",
        165,
        42,
        { align: "center" }
    );

    doc.setFontSize(16);

    doc.text(
        ordenData.numero || "",
        165,
        52,
        { align: "center" }
    );

    // =========================
    // PROVEEDOR
    // =========================
    doc.setFillColor(245, 245, 245);

    doc.rect(14, 68, 176, 28, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");

    doc.setTextColor(...vino);

    doc.text(
        "DATOS DEL PROVEEDOR",
        18,
        76
    );

    doc.setTextColor(...gris);

    doc.setFontSize(9);

    doc.text(
        `Proveedor: ${ordenData.proveedor.nombre || ""}`,
        18,
        84
    );

    doc.text(
        `RUC: ${ordenData.proveedor.ruc || ""}`,
        18,
        90
    );

    doc.text(
        `Dirección: ${ordenData.proveedor.direccion || ""}`,
        90,
        84
    );

    doc.text(
        `Teléfono: ${ordenData.proveedor.telefono || ""}`,
        90,
        90
    );

    // =========================
    // TABLA ITEMS
    // =========================
    const rows = ordenData.items.map((item, index) => ([
        index + 1,
        item.descripcion || "",
        item.cantidad || 0,
        `S/ ${Number(item.precio).toFixed(2)}`,
        `S/ ${(item.cantidad * item.precio).toFixed(2)}`
    ]));

    autoTable(doc, {
        startY: 105,

        head: [[
            "ITEM",
            "DESCRIPCIÓN",
            "CANT.",
            "P. UNIT",
            "TOTAL"
        ]],

        body: rows,

        theme: "grid",

        headStyles: {
            fillColor: vino,
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center"
        },

        styles: {
            fontSize: 8,
            cellPadding: 3
        },

        columnStyles: {
            0: { halign: "center", cellWidth: 15 },
            2: { halign: "center", cellWidth: 20 },
            3: { halign: "right", cellWidth: 30 },
            4: { halign: "right", cellWidth: 30 }
        }
    });

    // =========================
    // TOTALES
    // =========================
    const subtotal = ordenData.items.reduce(
        (acc, item) => acc + (item.cantidad * item.precio),
        0
    );

    const igv = subtotal * 0.18;

    const total = subtotal + igv;

    let finalY = doc.lastAutoTable.finalY + 12;

    doc.setDrawColor(...vino);

    doc.rect(130, finalY, 60, 24);

    doc.setFontSize(9);

    doc.text("Subtotal:", 138, finalY + 7);
    doc.text(`S/ ${subtotal.toFixed(2)}`, 182, finalY + 7, {
        align: "right"
    });

    doc.text("IGV (18%):", 138, finalY + 14);
    doc.text(`S/ ${igv.toFixed(2)}`, 182, finalY + 14, {
        align: "right"
    });

    doc.setFont("helvetica", "bold");

    doc.text("TOTAL:", 138, finalY + 21);

    doc.text(`S/ ${total.toFixed(2)}`, 182, finalY + 21, {
        align: "right"
    });

    // =========================
    // FIRMAS
    // =========================
    const firmaY = 250;

    doc.line(20, firmaY, 80, firmaY);
    doc.line(120, firmaY, 180, firmaY);

    doc.setFontSize(8);

    doc.text(
        "SOLICITADO POR",
        50,
        firmaY + 5,
        { align: "center" }
    );

    doc.text(
        "AUTORIZADO POR",
        150,
        firmaY + 5,
        { align: "center" }
    );

    // =========================
    // DESCARGAR
    // =========================
    doc.save(
        `${ordenData.numero || "orden_compra"}.pdf`
    );
};

export default generarOrdenCompraPDF;