import React, { useEffect, useState, useMemo } from "react";
import { Package, Tag, AlertTriangle, MapPin, Building2, Calendar, ClipboardList } from "lucide-react";

import { API_BASE } from "../../../config/api";

const API = API_BASE + "insumos.php";

const Insumos = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}?accion=listar`);
      const json = await res.json();

      if (json.success) {
        setData(json.data);
      } else {
        console.error(json.error);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const procesarItem = (item) => {
    const hoy = new Date();
    const lotes = item.lotes || [];

    const stock_actual = lotes.reduce((acc, l) => acc + Number(l.cantidad), 0);

    const tieneVencido = lotes.some(
      (l) => new Date(l.vencimiento) < hoy
    );

    const porVencer = lotes.some((l) => {
      const fechaVenc = new Date(l.vencimiento);
      const diasParaVencer = (fechaVenc - hoy) / (1000 * 60 * 60 * 24);
      const umbral = item.dias_alerta_vencimiento || 7;
      return diasParaVencer >= 0 && diasParaVencer <= umbral;
    });

    const bajoStock = stock_actual <= item.stock_min;

    let estado = "OK";
    if (tieneVencido) estado = "VENCIDO";
    else if (porVencer) estado = "POR VENCER";
    else if (bajoStock) estado = "REABASTECER";

    return {
      ...item,
      lotes,
      stock_actual,
      estado,
      bajoStock,
    };
  };

  const processedData = data.map(procesarItem);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">

          {/* HEADER MEJORADO */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#800000] p-4 rounded-2xl shadow-lg shadow-[#800000]/20">
                <ClipboardList className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">
                  KARDEX DE ALMACÉN
                </h2>
                <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  Control de Insumos Críticos
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Items</p>
                <p className="text-xl font-black text-slate-700 leading-none">{processedData.length}</p>
              </div>
              <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Alertas</p>
                <p className="text-xl font-black text-[#800000] leading-none">
                  {processedData.filter(i => i.estado !== "OK").length}
                </p>
              </div>
            </div>
          </div>

          {/* TABLA PROFESIONAL */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#800000] bg-gradient-to-r from-[#800000] to-[#5d0000]">
                    <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30">
                      <div className="flex items-center gap-2">
                        <Tag size={12} className="text-[#D4AF37]" /> Identificación
                      </div>
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30">
                      Producto y Marca
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30">
                      Logística (Ubicación/Prov)
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30 text-center">
                      Existencias
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30 text-center">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {processedData.map((item, i) => (
                    <tr key={i} className="group hover:bg-slate-50/80 transition-all duration-300">

                      {/* CODIGO Y CATEGORIA */}
                      <td className="px-6 py-6">
                        <span className="block w-fit bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border border-slate-200 group-hover:border-[#D4AF37]/30 transition-all mb-2">
                          {item.codigo}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#B4942F] uppercase">
                          <Package size={10} /> {item.categoria}
                        </div>
                      </td>

                      {/* NOMBRE Y MARCA */}
                      <td className="px-6 py-6">
                        <div className="text-base font-black text-slate-800 group-hover:text-[#800000] transition-colors uppercase tracking-tight">
                          {item.nombre}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mt-1">
                          <Building2 size={12} className="text-slate-400" />
                          {item.marca}
                        </div>
                        {/* DETALLE DE LOTES MINI */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(item.lotes || []).map((l, idx) => (
                            <div key={idx} className="bg-slate-100/50 border border-slate-200 px-2 py-1 rounded-md text-[9px] font-medium text-slate-500">
                              Lote {l.lote}: <span className="font-bold">{l.cantidad}{item.unidad}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* LOGISTICA */}
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                          <MapPin size={13} className="text-[#800000]" />
                          {item.ubicacion}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium mt-1 ml-5 italic">
                          Prov: {item.proveedor}
                        </div>
                      </td>

                      {/* STOCK */}
                      <td className="px-6 py-6 text-center">
                        <div className={`text-xl font-black leading-none ${item.bajoStock ? "text-[#800000]" : "text-slate-800"}`}>
                          {item.stock_actual}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {item.unidad}
                        </div>
                        <div className="mt-2 text-[9px] font-black text-slate-300 border-t border-slate-100 pt-1">
                          MÍN: {item.stock_min}
                        </div>
                      </td>

                      {/* ESTADO DINÁMICO */}
                      <td className="px-6 py-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                          {item.estado === "VENCIDO" && (
                            <span className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-100 text-red-700 text-[10px] font-black tracking-widest border border-red-200 shadow-sm">
                              ❌ VENCIDO
                            </span>
                          )}

                          {item.estado === "POR VENCER" && (
                            <span className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-600 text-[10px] font-black tracking-widest border border-amber-100 shadow-sm animate-pulse">
                              <Calendar size={12} /> PRÓX. VENCER
                            </span>
                          )}

                          {item.estado === "REABASTECER" && (
                            <span className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black tracking-widest border border-red-100 shadow-sm">
                              <AlertTriangle size={12} /> REABASTECER
                            </span>
                          )}

                          {item.estado === "OK" && (
                            <span className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-widest border border-emerald-100 shadow-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              OPERATIVO
                            </span>
                          )}

                          {/* Info adicional del vencimiento más cercano */}
                          {item.lotes.length > 0 && (
                            <p className="text-[8px] font-bold text-slate-400 uppercase">
                              Próx. Venc: {item.lotes.sort((a, b) => new Date(a.vencimiento) - new Date(b.vencimiento))[0]?.vencimiento}
                            </p>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insumos;