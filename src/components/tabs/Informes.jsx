import React, { useState } from 'react';
import {
  FileBarChart,
  ChevronRight,
  Download,
  Calendar,
  Building2,
  ArrowLeft,
  Wallet,
  ShoppingBag,
  UserCheck,
  Loader2
} from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { API_BASE } from "../../config/api";

const API = API_BASE + "reportes.php";
const Informes = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaFin] = useState("");
  const [sede_id, setSedeId] = useState("");

  const secciones = [
    {
      titulo: "Tesorería / Caja Chica",
      icon: <Wallet className="text-red-800" size={24} />,
      items: [
        { nombre: "Movimientos de Caja Chica", tipo: "caja_movimientos", desc: "Ver ingresos y salidas de efectivo." },
        { nombre: "Entregas pendientes por rendir", tipo: "caja_pendientes", desc: "Listado de rendiciones no procesadas." }
      ]
    },
    {
      titulo: "Logística / Compras",
      icon: <ShoppingBag className="text-red-800" size={24} />,
      items: [
        { nombre: "Órdenes de compra", tipo: "ordenes_compra", desc: "Historial de adquisiciones por sede." }
      ]
    },
    {
      titulo: "Planillas",
      icon: <UserCheck className="text-red-800" size={24} />,
      items: [
        { nombre: "Planilla docente", tipo: "planilla_docente", desc: "Resumen de pagos y horas lectivas." }
      ]
    }
  ];

  const generarExcelBonito = async (data, nombreReporte) => {
    if (!Array.isArray(data) || data.length === 0) {
      alert("No se encontraron registros para los filtros seleccionados.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // 1. Configurar Columnas
    const columnas = Object.keys(data[0]).map(key => ({
      header: key.toUpperCase().replace(/_/g, ' '),
      key: key,
      width: 25 // Ancho base
    }));
    worksheet.columns = columnas;

    // 2. Estilo de Cabecera
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '800000' }
      };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true, size: 12 };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // 3. Agregar Datos
    worksheet.addRows(data);

    // 4. Estilo de Celdas de Datos (Cebreado y Bordes)
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'E2E8F0' } },
            left: { style: 'thin', color: { argb: 'E2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
            right: { style: 'thin', color: { argb: 'E2E8F0' } }
          };
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
          
          if (rowNumber % 2 === 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'F9FAFB' }
            };
          }
        });
      }
    });

    // 5. Descarga
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = `${nombreReporte.toUpperCase()}_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, fileName);
  };

  const exportar = async () => {
    if (!fecha_inicio || !fecha_fin) {
      alert("Por favor, selecciona un rango de fechas.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        tipo: selectedReport.tipo,
        fecha_inicio,
        fecha_fin,
        sede_id
      });

      const res = await fetch(`${API}?${params}`);
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      
      const data = await res.json();
      await generarExcelBonito(data, selectedReport.tipo);

    } catch (error) {
      console.error("Error al exportar:", error);
      alert("Hubo un error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // VISTA 1: MENÚ
  if (!selectedReport) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <header className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
            <FileBarChart className="text-red-800" size={32} />
            CENTRO DE INFORMES
          </h2>
          <p className="text-gray-500 mt-1">Gestión y exportación de reportes institucionales.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {secciones.map((sec, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                {sec.icon}
                <h3 className="font-bold text-gray-700 uppercase text-sm tracking-wider">{sec.titulo}</h3>
              </div>
              <div className="p-2">
                {sec.items.map((item, j) => (
                  <button
                    key={j}
                    onClick={() => setSelectedReport(item)}
                    className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <div className="text-left">
                      <p className="font-semibold text-gray-800 group-hover:text-red-800">{item.nombre}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-red-800" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // VISTA 2: FILTROS
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button
        onClick={() => {
            setSelectedReport(null);
            setFechaInicio("");
            setFechaFin("");
        }}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-red-800 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Regresar al menú
      </button>

      <div className="max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-red-800 p-6 text-white">
          <h2 className="text-xl font-bold">{selectedReport.nombre}</h2>
          <p className="text-red-100 text-sm mt-1">Selecciona los parámetros para generar el Excel.</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={16} /> Fecha de Inicio
              </label>
              <input
                type="date"
                value={fecha_inicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={16} /> Fecha de Fin
              </label>
              <input
                type="date"
                value={fecha_fin}
                onChange={(e) => setFechaFin(e.target.value)}
                min={fecha_inicio}
                className="w-full border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Building2 size={16} /> Sede Institucional
            </label>
            <select
              value={sede_id}
              onChange={(e) => setSedeId(e.target.value)}
              className="w-full border-gray-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none bg-white"
            >
              <option value="">Todas las sedes</option>
              <option value="1">Piura</option>
              <option value="2">Sullana</option>
              <option value="3">Piura (Empresa 2)</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={exportar}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-800 hover:bg-red-900 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  GENERANDO EXCEL...
                </>
              ) : (
                <>
                  <Download size={20} />
                  EXPORTAR DATOS
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Informes;