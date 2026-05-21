import React, { useState, useEffect } from "react";
import { Smartphone, Tag, Phone, CheckCircle2 } from "lucide-react";
import { API_BASE } from "../../../config/api";


const API = API_BASE + "moviles.php";



const Moviles = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      });
  }, []);

  return (
    <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#800000] p-3 rounded-2xl shadow-lg shadow-[#800000]/20">
            <Smartphone className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">
              EQUIPOS MÓVILES
            </h2>
            <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em]">
              Control Telefónico
            </p>
          </div>
        </div>

        <div className="hidden md:block bg-white px-4 py-2 rounded-xl border text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {data.length} Equipos
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-[2rem] border shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">

            <thead>
              <tr className="bg-gradient-to-r from-[#800000] to-[#5d0000]">
                <th className="px-6 py-5 text-[10px] text-white uppercase">
                  <div className="flex items-center gap-2">
                    <Tag size={12} className="text-[#D4AF37]" /> Código
                  </div>
                </th>
                <th className="px-6 py-5 text-[10px] text-white uppercase">
                  Modelo
                </th>
                <th className="px-6 py-5 text-[10px] text-white uppercase">
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-[#D4AF37]" /> Número
                  </div>
                </th>
                <th className="px-6 py-5 text-[10px] text-white uppercase text-center">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {data.map((item, i) => (
                <tr key={i} className="group hover:bg-slate-50 transition">

                  <td className="px-6 py-5">
                    <span className="bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-mono border">
                      {item.codigo}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm font-black text-slate-700 group-hover:text-[#800000]">
                    {item.modelo}
                  </td>

                  <td className="px-6 py-5 text-sm font-mono font-bold text-[#B4942F]">
                    {item.numero}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black">
                      <CheckCircle2 size={12} />
                      {item.estado.toUpperCase()}
                    </span>
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

export default Moviles;