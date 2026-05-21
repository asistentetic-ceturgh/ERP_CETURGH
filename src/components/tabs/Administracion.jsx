import React, { useEffect, useState } from "react";
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    ChevronDown,
    ChevronUp,
    Building2,
    Filter
} from "lucide-react";

import { API_BASE } from "../../config/api";

const API = API_BASE + "administracion.php";

const Administracion = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalObs, setModalObs] = useState(false);
    const [itemSeleccionado, setItemSeleccionado] = useState(null);
    const [comentario, setComentario] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("TODOS");
    const [expandedReq, setExpandedReq] = useState(null);

    // Colores corporativos
    const colors = {
        granate: "#800020",
        dorado: "#D4AF37",
        doradoSuave: "#F4EBD0"
    };

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await fetch(API);
            const data = await res.json();
            if (data.success) setItems(data.data || []);
        } catch (err) {
            console.error("Error fetch:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const itemsFiltrados = items.filter(it => {
        if (filtroEstado === "TODOS") return true;
        if (filtroEstado === "ADMINISTRACION") return (it.flujo_estado || "") === "ADMINISTRACION";

        const estadoAdmin = (it.estado_administracion || "PENDIENTE").toUpperCase();
        return estadoAdmin === filtroEstado;
    });

    const requerimientosAgrupados = Object.values(
        itemsFiltrados.reduce((acc, item) => {
            const reqId = item.requerimiento_id || item.id;
            if (!acc[reqId]) {
                acc[reqId] = {
                    id: reqId,
                    codigo: item.requerimiento_codigo || "-",
                    empresa: item.empresa || "-",
                    sede: item.sede || "-",
                    departamento: item.departamento || "-",
                    flujo_estado: item.flujo_estado || "-",
                    items: []
                };
            }
            acc[reqId].items.push(item);
            return acc;
        }, {})
    );

    const cambiarEstado = async (id, estado, comentario = "") => {
        try {
            const res = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item_id: id, estado, comentario })
            });
            const data = await res.json();
            if (!data.success) alert(data.error || "Error");
            fetchItems();
        } catch (err) {
            console.error("Error update:", err);
        }
    };

    const Badge = ({ children, variant }) => {
        const variants = {
            APROBADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
            OBSERVADO: "bg-amber-50 text-amber-700 border-amber-200",
            DENEGADO: "bg-rose-50 text-rose-700 border-rose-200",
            PENDIENTE: "bg-slate-50 text-slate-600 border-slate-200",
            LOGISTICA: "bg-blue-50 text-blue-700 border-blue-200",
            ADMINISTRACION: `bg-[${colors.granate}]/10 text-[${colors.granate}] border-[${colors.granate}]/20`,
            TESORERIA: "bg-cyan-50 text-cyan-700 border-cyan-200",
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${variants[variant] || variants.PENDIENTE}`}>
                {children}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-slate-800">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3" style={{ color: colors.granate }}>
                        <div className="p-2 rounded-lg" style={{ backgroundColor: colors.granate }}>
                            <Building2 className="text-white" size={24} />
                        </div>
                        Administración
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Panel de control y aprobación de requerimientos.</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <Filter size={16} className="text-slate-400 ml-2" />
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="bg-transparent text-sm font-bold focus:outline-none pr-4 cursor-pointer text-slate-700"
                    >
                        {["ESTADOS", "APROBADO", "DENEGADO", "PENDIENTE"].map(f => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-white" style={{ backgroundColor: colors.granate }}>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest border-r border-white/10">Código</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest border-r border-white/10">Departamento</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest border-r border-white/10">Empresa / Sede</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-right border-r border-white/10">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center border-r border-white/10">AREA</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {requerimientosAgrupados.map(req => {
                                    const totalReq = req.items.reduce((acc, i) => acc + (Number(i.precio_unitario || 0) * Number(i.cantidad || 0)), 0);
                                    const isExpanded = expandedReq === req.id;

                                    return (
                                        <React.Fragment key={req.id}>
                                            <tr className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50 border-l-4' : ''}`}
                                                style={{ borderLeftColor: isExpanded ? colors.dorado : 'transparent' }}
                                                onClick={() => setExpandedReq(isExpanded ? null : req.id)}>
                                                <td className="px-6 py-5 font-bold" style={{ color: colors.granate }}>{req.codigo}</td>
                                                <td className="px-6 py-5 text-sm font-medium text-slate-600">{req.departamento}</td>
                                                <td className="px-6 py-5 text-sm text-slate-500">{req.empresa} <span className="mx-1 text-slate-300">|</span> {req.sede}</td>
                                                <td className="px-6 py-5 text-right font-bold text-slate-900 text-base">S/ {totalReq.toFixed(2)}</td>
                                                <td className="px-6 py-5 text-center">
                                                    <Badge variant={req.flujo_estado}>{req.flujo_estado}</Badge>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className={`inline-flex p-2 rounded-full transition-all ${isExpanded ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    </div>
                                                </td>
                                            </tr>

                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan="6" className="px-8 py-6 bg-slate-50">
                                                        <div className="bg-white rounded-lg shadow-inner border border-slate-200 overflow-hidden">
                                                            <table className="w-full">
                                                                <thead className="bg-slate-800 text-white">
                                                                    <tr>
                                                                        <th className="px-4 py-3 text-[10px] uppercase font-bold tracking-wider">Descripción</th>
                                                                        <th className="px-4 py-3 text-[10px] uppercase font-bold tracking-wider">Cant.</th>
                                                                        <th className="px-4 py-3 text-[10px] uppercase font-bold tracking-wider text-right">Unitario</th>
                                                                        <th className="px-4 py-3 text-[10px] uppercase font-bold tracking-wider text-center">Estado Admin</th>
                                                                        <th className="px-4 py-3 text-[10px] uppercase font-bold tracking-wider text-center">Gestión</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-100">
                                                                    {req.items.map(it => (
                                                                        <tr key={it.id} className="hover:bg-slate-50/50 transition-colors">
                                                                            <td className="px-4 py-3 text-sm font-medium">{it.descripcion}</td>
                                                                            <td className="px-4 py-3 text-sm">{it.cantidad} <span className="text-slate-400 text-xs">{it.unidad}</span></td>
                                                                            <td className="px-4 py-3 text-sm text-right font-bold">S/ {Number(it.precio_unitario || 0).toFixed(2)}</td>
                                                                            <td className="px-4 py-3 text-center">
                                                                                <Badge variant={(it.estado_administracion || "PENDIENTE").toUpperCase()}>
                                                                                    {it.estado_administracion || "PENDIENTE"}
                                                                                </Badge>
                                                                            </td>
                                                                            <td className="px-4 py-3">
                                                                                <div className="flex justify-center gap-2">
                                                                                    {it.flujo_estado === "ADMINISTRACION" &&
                                                                                        (it.estado_administracion || "PENDIENTE") === "PENDIENTE" ? (
                                                                                        <>
                                                                                            <button
                                                                                                onClick={(e) => { e.stopPropagation(); cambiarEstado(it.id, "APROBADO"); }}
                                                                                                className="p-2 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                                                                                                title="Aprobar">
                                                                                                <CheckCircle2 size={16} />
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={(e) => { e.stopPropagation(); setItemSeleccionado(it); setModalObs(true); }}
                                                                                                className="p-2 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-600 hover:text-white transition-all border border-amber-100"
                                                                                                title="Observar">
                                                                                                <AlertCircle size={16} />
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={(e) => { e.stopPropagation(); cambiarEstado(it.id, "DENEGADO"); }}
                                                                                                className="p-2 bg-rose-50 text-rose-600 rounded-md hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                                                                                                title="Denegar">
                                                                                                <XCircle size={16} />
                                                                                            </button>
                                                                                        </>
                                                                                    ) : (
                                                                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Solo lectura</span>
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {requerimientosAgrupados.length === 0 && (
                        <div className="text-center py-20 bg-slate-50/50">
                            <Filter size={48} className="mx-auto text-slate-200 mb-4" />
                            <h3 className="text-lg font-bold text-slate-400">Sin registros para mostrar</h3>
                        </div>
                    )}
                </div>
            </div>
            {/* MODAL OBSERVACION */}
            {modalObs && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

                        {/* HEADER */}
                        <div
                            className="px-6 py-4 border-b flex items-center justify-between"
                            style={{ backgroundColor: colors.granate }}
                        >
                            <div>
                                <h3 className="text-white font-bold text-lg">
                                    Observar Item
                                </h3>

                                <p className="text-white/70 text-xs">
                                    Escribe el motivo de la observación
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setModalObs(false);
                                    setComentario("");
                                    setItemSeleccionado(null);
                                }}
                                className="text-white hover:text-red-200 transition"
                            >
                                <XCircle size={22} />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-6 space-y-4">

                            <div className="bg-slate-50 border rounded-xl p-4">
                                <div className="text-xs text-slate-400 uppercase font-bold mb-1">
                                    Item seleccionado
                                </div>

                                <div className="font-semibold text-slate-700">
                                    {itemSeleccionado?.descripcion}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-2">
                                    Comentario
                                </label>

                                <textarea
                                    value={comentario}
                                    onChange={(e) =>
                                        setComentario(e.target.value)
                                    }
                                    placeholder="Escribe el motivo de la observación..."
                                    className="w-full min-h-[140px] border rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                                />
                            </div>

                        </div>

                        {/* FOOTER */}
                        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">

                            <button
                                onClick={() => {
                                    setModalObs(false);
                                    setComentario("");
                                    setItemSeleccionado(null);
                                }}
                                className="px-5 py-2 rounded-xl border font-semibold hover:bg-slate-100 transition"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={async () => {

                                    if (!comentario.trim()) {
                                        alert("Ingrese un comentario");
                                        return;
                                    }

                                    await cambiarEstado(
                                        itemSeleccionado.id,
                                        "OBSERVADO",
                                        comentario
                                    );

                                    setModalObs(false);
                                    setComentario("");
                                    setItemSeleccionado(null);

                                }}
                                className="px-5 py-2 rounded-xl text-white font-bold transition hover:opacity-90"
                                style={{
                                    backgroundColor: colors.granate
                                }}
                            >
                                Guardar Observación
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
};

export default Administracion;