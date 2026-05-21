import React, { useState, useEffect } from "react";
import { Wrench, Tag, Layers } from "lucide-react";

import { API_BASE } from "../../../config/api";


const API = API_BASE + "herramientas.php";
const Herramientas = () => {


  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(API_BASE + "herramientas.php")
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);
  return (
    <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#800000] p-3 rounded-2xl shadow-lg shadow-[#800000]/20">
            <Wrench className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter leading-none">
              CONTROL DE HERRAMIENTAS
            </h2>
            <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] mt-1">
              Sistema de Inventario
            </p>
          </div>
        </div>

        <div className="hidden md:block bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {data.length} Registros Totales
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">

            <thead>
              <tr className="bg-[#800000] bg-gradient-to-r from-[#800000] to-[#5d0000]">

                <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30">
                  <div className="flex items-center gap-2">
                    <Tag size={12} className="text-[#D4AF37]" /> Código
                  </div>
                </th>

                <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30">
                  Herramienta
                </th>

                <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Layers size={12} className="text-[#D4AF37]" /> Cantidad
                  </div>
                </th>

                <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30 text-center">
                  Estado
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.map((item, i) => (
                <tr key={i} className="group hover:bg-slate-50/80 transition-all duration-300">

                  {/* CODIGO */}
                  <td className="px-6 py-5">
                    <span className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border border-slate-200 group-hover:border-[#D4AF37]/30 transition-all">
                      {item.codigo}
                    </span>
                  </td>

                  {/* NOMBRE */}
                  <td className="px-6 py-5">
                    <div className="text-sm font-black text-slate-700 group-hover:text-[#800000] transition-colors">
                      {item.nombre}
                    </div>
                  </td>

                  {/* CANTIDAD */}
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-black text-[#B4942F]">
                      {item.cantidad}
                    </span>
                  </td>

                  {/* ESTADO */}
                  <td className="px-6 py-5 text-center">
                    {item.estado === "De baja" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black tracking-widest border border-red-100 shadow-sm">
                        DE BAJA
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-widest border border-emerald-100 shadow-sm">
                        DISPONIBLE
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default Herramientas;