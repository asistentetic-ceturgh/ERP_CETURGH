import React, { useEffect, useState, useMemo } from "react";
import { 
  Utensils, Tag, AlertTriangle, MapPin, Layers, 
  ShieldCheck, RotateCcw, Loader2, RefreshCw 
} from "lucide-react";
import { API_BASE } from "../../../config/api";

const API = API_BASE + "menaje.php";

const Menaje = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ============================
  // 🔄 CARGAR DATA
  // ============================
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
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ============================
  // 🧠 PROCESAMIENTO
  // ============================
  const processedData = useMemo(() => {
    return data.map(item => {

      const stock_actual = Number(item.stock_actual || 0);
      const stock_min = Number(item.stock_min || 0);

      const bajoStock = stock_actual <= stock_min;

      let estadoLabel = "OPERATIVO";

      if (item.estado_conservacion === "Desgastado") {
        estadoLabel = "MANTENIMIENTO";
      }

      if (bajoStock) {
        estadoLabel = "REABASTECER";
      }

      return {
        ...item,
        bajoStock,
        estadoLabel
      };
    });
  }, [data]);

  // ============================
  // 📊 KPIs
  // ============================
  const totalItems = data.length;
  const stockBajo = processedData.filter(i => i.bajoStock).length;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            
            <div className="flex items-center gap-4">
              <div className="bg-[#800000] p-4 rounded-2xl shadow-lg shadow-[#800000]/20">
                <Utensils className="text-white" size={28} />
              </div>

              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter">
                  CONTROL DE MENAJE
                </h2>
                <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  Inventario de Vajilla y Cristalería
                </p>
              </div>
            </div>

            {/* KPIs */}
            <div className="flex gap-3">
              <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase">Items</p>
                <p className="text-xl font-black text-slate-700">{totalItems}</p>
              </div>

              <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase">Stock Bajo</p>
                <p className="text-xl font-black text-[#800000]">{stockBajo}</p>
              </div>

              {/* REFRESH */}
              <button
                onClick={fetchData}
                className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-100 transition"
              >
                <RefreshCw size={16} className="text-slate-600" />
              </button>
            </div>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-[#800000]" size={30} />
            </div>
          )}

          {/* TABLA */}
          {!loading && (
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">

                  <thead>
                    <tr className="bg-gradient-to-r from-[#800000] to-[#5d0000]">

                      <th className="px-6 py-5 text-[10px] font-black text-white uppercase">
                        <Tag size={12} className="inline mr-2 text-[#D4AF37]" />
                        Código
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-white uppercase">
                        Artículo
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-white uppercase">
                        Ubicación
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-white uppercase text-center">
                        Stock
                      </th>

                      <th className="px-6 py-5 text-[10px] font-black text-white uppercase text-center">
                        Estado
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {processedData.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition">

                        {/* CODIGO */}
                        <td className="px-6 py-6">
                          <span className="bg-slate-50 px-3 py-1 rounded text-xs font-mono border">
                            {item.codigo}
                          </span>

                          <div className="text-[10px] text-[#B4942F] font-bold mt-2 flex items-center gap-1">
                            <Layers size={10} /> {item.categoria}
                          </div>
                        </td>

                        {/* NOMBRE */}
                        <td className="px-6 py-6">
                          <div className="font-black text-slate-800">
                            {item.nombre}
                          </div>

                          <div className="text-[10px] text-slate-500 font-bold">
                            {item.material}
                          </div>

                          <div className="text-[9px] text-slate-400 mt-1">
                            Último conteo: {item.ultimo_inventario}
                          </div>
                        </td>

                        {/* UBICACION */}
                        <td className="px-6 py-6 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-[#800000]" />
                            {item.ubicacion}
                          </div>
                        </td>

                        {/* STOCK */}
                        <td className="px-6 py-6 text-center">
                          <div className={`text-xl font-black ${item.bajoStock ? "text-red-600" : "text-slate-800"}`}>
                            {item.stock_actual}
                          </div>

                          <div className="text-[10px] text-slate-400">
                            Min: {item.stock_min}
                          </div>
                        </td>

                        {/* ESTADO */}
                        <td className="px-6 py-6 text-center">

                          {item.estadoLabel === "REABASTECER" && (
                            <span className="px-3 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1">
                              <AlertTriangle size={12} /> CRÍTICO
                            </span>
                          )}

                          {item.estadoLabel === "MANTENIMIENTO" && (
                            <span className="px-3 py-2 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1">
                              <RotateCcw size={12} /> REVISIÓN
                            </span>
                          )}

                          {item.estadoLabel === "OPERATIVO" && (
                            <span className="px-3 py-2 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1">
                              <ShieldCheck size={12} /> OK
                            </span>
                          )}

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Menaje;