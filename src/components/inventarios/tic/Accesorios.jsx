import React, { useEffect, useState } from "react";
import {
    Server,
    Cable,
    Usb,
    MapPin,
    Info,
    CheckCircle2,
    AlertTriangle
} from "lucide-react";

import { API_BASE } from "../../../config/api";

const API = API_BASE + "data_center.php";

// ==============================
// 🎯 ICONO DINÁMICO SEGURO
// ==============================
const getIcon = (tipo) => {
    if (!tipo) return <Server size={14} />;

    const t = String(tipo).toUpperCase();

    if (t.includes("CABLE")) return <Cable size={14} />;
    if (t.includes("ADAPTADOR")) return <Usb size={14} />;

    return <Server size={14} />;
};

const DataCenter = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // ==============================
    // 🔄 FETCH
    // ==============================
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

    // ==============================
    // 📊 MÉTRICAS
    // ==============================
    const total = data.length;
    const disponibles = data.filter(i => i.estado === "DISPONIBLE").length;
    const enUso = data.filter(i => i.estado === "EN USO").length;
    const danados = data.filter(i => i.estado === "DAÑADO").length;

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-10 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto">
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-200/60">

                    {/* ================= HEADER ================= */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">

                        <div className="flex items-center gap-4">
                            <div className="bg-[#800000] p-4 rounded-2xl shadow-lg shadow-[#800000]/20">
                                <Server className="text-white" size={28} />
                            </div>

                            <div>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">
                                    INVENTARIO DATA CENTER
                                </h2>
                                <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                                    Control de cables y adaptadores
                                </p>
                            </div>
                        </div>

                        {/* KPIs */}
                        <div className="flex gap-3 flex-wrap">
                            <div className="bg-white px-5 py-3 rounded-2xl border text-center">
                                <p className="text-[9px] text-slate-400 font-black">TOTAL</p>
                                <p className="text-xl font-black">{total}</p>
                            </div>

                            <div className="bg-white px-5 py-3 rounded-2xl border text-center">
                                <p className="text-[9px] text-slate-400 font-black">DISP.</p>
                                <p className="text-xl font-black text-emerald-600">{disponibles}</p>
                            </div>

                            <div className="bg-white px-5 py-3 rounded-2xl border text-center">
                                <p className="text-[9px] text-slate-400 font-black">USO</p>
                                <p className="text-xl font-black text-amber-600">{enUso}</p>
                            </div>

                            <div className="bg-white px-5 py-3 rounded-2xl border text-center">
                                <p className="text-[9px] text-slate-400 font-black">DAÑADOS</p>
                                <p className="text-xl font-black text-red-600">{danados}</p>
                            </div>
                        </div>
                    </div>

                    {/* ================= TABLA ================= */}
                    <div className="bg-white rounded-[2rem] border shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">

                            <table className="w-full text-left">

                                <thead className="bg-[#800000] text-white text-[10px] uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Tipo</th>
                                        <th className="px-6 py-4">Descripción</th>
                                        <th className="px-6 py-4">Marca / Modelo</th>
                                        <th className="px-6 py-4">Serie</th>
                                        <th className="px-6 py-4">Ubicación</th>
                                        <th className="px-6 py-4 text-center">Estado</th>
                                        <th className="px-6 py-4">Observaciones</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {loading && (
                                        <tr>
                                            <td colSpan="7" className="text-center py-10 text-slate-400">
                                                Cargando...
                                            </td>
                                        </tr>
                                    )}

                                    {!loading && data.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center py-10 text-slate-400">
                                                Sin registros
                                            </td>
                                        </tr>
                                    )}

                                    {data.map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50">

                                            {/* TIPO */}
                                            <td className="px-6 py-4 text-xs font-bold text-[#B4942F]">
                                                <div className="flex items-center gap-2">
                                                    {getIcon(item.tipo_equipo)}
                                                    {item.tipo_equipo || "SIN TIPO"}
                                                </div>
                                            </td>

                                            {/* DESCRIPCIÓN */}
                                            <td className="px-6 py-4">
                                                <div className="font-black text-slate-800">
                                                    {item.descripcion || "SIN DESCRIPCIÓN"}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {item.codigo || "SIN CÓDIGO"}
                                                </div>
                                            </td>

                                            {/* MARCA */}
                                            <td className="px-6 py-4 text-sm">
                                                {item.marca_modelo || "-"}
                                            </td>

                                            {/* SERIE */}
                                            <td className="px-6 py-4 text-xs text-slate-400">
                                                {item.serie || "-"}
                                            </td>

                                            {/* UBICACION */}
                                            <td className="px-6 py-4 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={12} className="text-[#800000]" />
                                                    {item.ubicacion || "-"}
                                                </div>
                                            </td>

                                            {/* ESTADO */}
                                            <td className="px-6 py-4 text-center">
                                                {item.estado === "DISPONIBLE" && (
                                                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-xs font-black">
                                                        DISPONIBLE
                                                    </span>
                                                )}

                                                {item.estado === "EN USO" && (
                                                    <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-xl text-xs font-black">
                                                        EN USO
                                                    </span>
                                                )}

                                                {item.estado === "DAÑADO" && (
                                                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-xl text-xs font-black flex items-center justify-center gap-1">
                                                        <AlertTriangle size={12} /> DAÑADO
                                                    </span>
                                                )}

                                                {!item.estado && (
                                                    <span className="text-slate-400 text-xs">-</span>
                                                )}
                                            </td>

                                            {/* OBS */}
                                            <td className="px-6 py-4 text-xs text-slate-400">
                                                {item.observaciones || "-"}
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

export default DataCenter;