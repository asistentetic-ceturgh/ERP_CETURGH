import React, { useEffect, useState } from "react";
import {
  Monitor,
  Cpu,
  Tag,
  MapPin,
  User,
  Calendar,
  Info,
  Laptop,
  Printer,
  HardDrive,
  CheckCircle2,
  Settings
} from "lucide-react";

import { API_BASE } from "../../../config/api";

const API = API_BASE + "oficina.php";


const Oficina = () => {

  const [data, setData] = useState([]);


  const fetchData = async () => {
    try {
      const res = await fetch(`${API}?accion=listar`);
      const json = await res.json();

      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getInicial = (nombre) => {
    if (!nombre) return "?";
    return nombre.charAt(0).toUpperCase();
  };

  const totalOperativos = data.filter(i => i.estado === "OPERATIVO").length;
  const getEquipoIcon = (equipo) => {
    if (!equipo) return <Monitor size={14} />; // fallback seguro

    const e = equipo.toUpperCase();

    if (e.includes('LAPTOP')) return <Laptop size={14} />;
    if (e.includes('CPU') || e.includes('ALL IN ONE')) return <Cpu size={14} />;
    if (e.includes('IMPRESORA')) return <Printer size={14} />;

    return <Monitor size={14} />;
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#800000] p-4 rounded-2xl shadow-lg shadow-[#800000]/20">
                <Monitor className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">
                  INVENTARIO DE ACTIVOS TECNOLÓGICOS
                </h2>
                <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  Control Detallado de Equipos de Oficina
                </p>
              </div>
            </div>

            <div className="hidden md:flex gap-3">
              <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Activos</p>
                <p className="text-xl font-black text-slate-700 leading-none">{data.length}</p>
              </div>
              <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Periodo</p>
                <p className="text-xl font-black text-[#800000] leading-none">2025-26</p>
              </div>
            </div>
          </div>

          {/* TABLA DE EQUIPOS */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#800000] bg-gradient-to-r from-[#800000] to-[#5d0000]">
                    <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30">
                      <div className="flex items-center gap-2"><Calendar size={12} className="text-[#D4AF37]" /> Registro</div>
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30">
                      Descripción y Especificaciones
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30">
                      Hardware / Software
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30">
                      <div className="flex items-center gap-2"><MapPin size={12} className="text-[#D4AF37]" /> Asignación</div>
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-white/90 uppercase tracking-[0.15em] border-b border-[#D4AF37]/30 text-center">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data.map((item, i) => (
                    <tr key={i} className="group hover:bg-slate-50/80 transition-all duration-300">

                      {/* FECHA Y TIEMPO */}
                      <td className="px-6 py-6">
                        <div className="text-xs font-black text-slate-400 mb-1">{item.fecha_registro}</div>
                        <div className="inline-block px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-black text-slate-500 uppercase">
                          Adq: {item.tiempo}
                        </div>
                      </td>

                      {/* DESCRIPCION TECNICA */}
                      <td className="px-6 py-6 max-w-md">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-black text-slate-800 group-hover:text-[#800000] transition-colors uppercase tracking-tight">
                            {item.descripcion}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-[10px] font-mono font-bold border border-slate-200">
                            {item.codigo}
                          </span>
                          <span className="flex items-center gap-1 bg-[#D4AF37]/10 text-[#B4942F] px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider">
                            {getEquipoIcon(item.equipo)} {item.equipo}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium bg-slate-50 p-2 rounded-xl border border-dashed border-slate-200">
                          <span className="font-black text-slate-400 uppercase mr-1">[Obs]</span> {item.observacion}
                        </div>
                      </td>

                      {/* HARDWARE / SOFTWARE */}
                      <td className="px-6 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                            <Settings size={12} className="text-[#D4AF37]" />
                            <span className="text-slate-400">Modelo:</span> {item.marca} {item.modelo}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                            <HardDrive size={12} className="text-[#800000]" />
                            <span className="text-slate-400">OS:</span> {item.so}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                            <Info size={12} className="text-slate-400" />
                            <span className="text-slate-400">Office:</span> {item.office}
                          </div>
                        </div>
                      </td>

                      {/* UBICACION Y RESPONSABLE */}
                      <td className="px-6 py-6 text-xs font-bold text-slate-500">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-[#800000]/10 border border-[#800000]/20 flex items-center justify-center text-[11px] font-black text-[#800000]">
                            {getInicial(item.responsable)}
                          </div>
                          <div>
                            <p className="text-slate-800 font-black uppercase text-[10px] leading-tight">{item.responsable}</p>
                            <p className="text-slate-400 text-[9px] uppercase tracking-tighter">Responsable</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <MapPin size={12} className="text-[#D4AF37]" />
                          {item.ubicacion}
                        </div>
                      </td>

                      {/* ESTADO */}
                      <td className="px-6 py-6 text-center">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-widest border border-emerald-100 shadow-sm transition-all group-hover:bg-emerald-600 group-hover:text-white">
                          <CheckCircle2 size={12} />
                          {item.estado}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4">
            <p>© 2026 - Gestión de Activos Fijos IT</p>
            <p>Estado de Auditoría: Completo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Oficina;