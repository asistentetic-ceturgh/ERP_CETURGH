import React, { useState, useEffect, useMemo } from 'react';
import {
    Car, X, Save, CheckCircle2, XCircle, PenTool, Plus, Truck, Info, Edit3,
    Navigation, Calendar, Building2, Wallet, ArrowRight, LayoutDashboard,
    Search, Filter, ArrowUp, ArrowDown
} from 'lucide-react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo.png";

import { API_BASE } from "../../config/api";

const API = API_BASE + "movilidad.php";

const Movilidad = ({ user }) => {
    const [showMovilidadModal, setShowMovilidadModal] = useState(false);
    const [archivoPago, setArchivoPago] = useState(null);
    const [showPagoModal, setShowPagoModal] = useState(false);
    const isModalOnly = false;
    const currentUser = user || null;
    const currentUserName = user?.nombre || "Administración";
    const currentRole = user?.tipo || "";

    // --- FILTROS Y BÚSQUEDA ---
    const [searchText, setSearchText] = useState('');
    const [fechaOrder, setFechaOrder] = useState('desc');
    const [pagadoFilter, setPagadoFilter] = useState('todos');

    const getBase64FromUrl = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    };

    // =====================
    // NORMALIZAR
    // =====================
    const normalize = (text) =>
        text
            ?.normalize("NFD")
            .replace(/[\u0300-\u0301]/g, "")
            .toUpperCase();

    const currentDept = normalize(user?.departamento || "");

    // =====================
    // ESTADOS
    // =====================
    const [activeTab, setActiveTab] = useState('mis');
    const [planillaMovilidad, setPlanillaMovilidad] = useState([]);
    const [viewMovilidad, setViewMovilidad] = useState(null);
    const [editingMovilidad, setEditingMovilidad] = useState(false);
    const [editMovilidadData, setEditMovilidadData] = useState({});
    const [saving, setSaving] = useState(false);
    const [empresa, setEmpresa] = useState("EDUTUR");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [detalles, setDetalles] = useState([{ fecha: "", monto: "" }]);

    // =====================
    // PERMISOS
    // =====================
    const puedeVerTodo = ["TIC", "ADMINISTRACION", "TESORERIA"].includes(currentDept);

    // =====================
    // LOAD DATA
    // =====================
    const loadMovilidad = async () => {
        try {
            const res = await fetch(API);
            if (!res.ok) throw new Error("Error al obtener datos");
            const data = await res.json();
            const normalizado = (Array.isArray(data) ? data : []).map(m => ({
                ...m,
                detalles: Array.isArray(m.detalles) ? m.detalles : []
            }));
            setPlanillaMovilidad(prev => {
                const nuevo = JSON.stringify(normalizado);
                const actual = JSON.stringify(prev);
                return nuevo !== actual ? normalizado : prev;
            });
        } catch (err) {
            console.error("LOAD ERROR:", err);
        }
    };

    useEffect(() => {
        loadMovilidad();
        const interval = setInterval(() => loadMovilidad(), 5000);
        return () => clearInterval(interval);
    }, []);

    // =====================
    // FILTROS Y ORDENAMIENTO (MEMOIZADO)
    // =====================
    const filteredAndSortedMovilidad = useMemo(() => {
        let filtered = planillaMovilidad.filter(m => {
            if (activeTab === 'general' && puedeVerTodo) return true;
            if (activeTab === 'mis') {
                return Number(m.departamento_id) === Number(user?.departamento_id);
            }
            return false;
        });

        if (searchText.trim() !== '') {
            const term = searchText.toLowerCase();
            filtered = filtered.filter(m =>
                m.motivo?.toLowerCase().includes(term) ||
                m.origen?.toLowerCase().includes(term) ||
                m.destino?.toLowerCase().includes(term) ||
                `mov-${m.id}`.includes(term) ||
                m.id?.toString().includes(term)
            );
        }

        if (pagadoFilter === 'pagado') {
            filtered = filtered.filter(m => m.estado === 'Pagado');
        } else if (pagadoFilter === 'no_pagado') {
            filtered = filtered.filter(m => m.estado !== 'Pagado');
        }

        const sorted = [...filtered];
        sorted.sort((a, b) => {
            const dateA = new Date(a.fecha);
            const dateB = new Date(b.fecha);
            return fechaOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        return sorted;
    }, [planillaMovilidad, activeTab, puedeVerTodo, user, searchText, pagadoFilter, fechaOrder]);

    // =====================
    // PAGINACIÓN
    // =====================
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText, fechaOrder, pagadoFilter, activeTab, pageSize]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredAndSortedMovilidad.slice(start, end);
    }, [filteredAndSortedMovilidad, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredAndSortedMovilidad.length / pageSize);
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // =====================
    // CREAR
    // =====================
    const handleCreateMovilidad = async (e) => {
        e.preventDefault();
        setSaving(true);
        const form = new FormData(e.target);
        const empresa_id = empresa === "EDUTUR" ? 1 : 2;
        const sedeMap = {
            "CETPRO PIURA": 1,
            "CETPRO SULLANA": 2,
            "INSTITUTO": 3
        };
        const sede = form.get("sede");

        if (!user?.departamento_id) {
            alert("El usuario no tiene departamento asignado");
            setSaving(false);
            return;
        }

        const payload = {
            fecha: form.get("fecha"),
            empresa_id,
            sede_id: sedeMap[sede],
            departamento_id: user?.departamento_id,
            motivo: form.get("motivo"),
            origen: form.get("origen"),
            destino: form.get("destino"),
            detalles: detalles.filter(d => d.fecha && d.monto).map(d => ({ fecha: d.fecha, monto: Number(d.monto) })),
            creador_id: currentUser?.id
        };

        try {
            const res = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.ok) {
                const nuevaMovilidad = {
                    id: data.id,
                    ...payload,
                    empresa,
                    sede,
                    firmado_por: null,
                    detalles: payload.detalles || []
                };
                setPlanillaMovilidad(prev => [nuevaMovilidad, ...prev]);
                loadMovilidad();
                setShowMovilidadModal(false);
                setDetalles([{ fecha: "", monto: "" }]);
            } else {
                throw new Error(data.error || "Error al guardar");
            }
        } catch (err) {
            console.error("CREATE ERROR:", err);
            alert("Error al guardar");
        }
        setSaving(false);
    };

    // =====================
    // DETALLES
    // =====================
    const addDetalle = () => setDetalles(prev => [...prev, { fecha: "", monto: "" }]);
    const removeDetalle = (index) => setDetalles(prev => prev.filter((_, i) => i !== index));
    const updateDetalle = (index, field, value) => {
        const copy = [...detalles];
        copy[index][field] = value;
        setDetalles(copy);
    };

    // =====================
    // EDITAR
    // =====================
    const guardarEdicionMovilidad = async () => {
        if (editMovilidadData.estado !== "Sin firmar") return;
        if (!Array.isArray(editMovilidadData.detalles) || editMovilidadData.detalles.length === 0) {
            alert("Debe agregar al menos un detalle");
            return;
        }
        try {
            const payload = {
                action: "editar",
                id: editMovilidadData.id,
                motivo: editMovilidadData.motivo,
                origen: editMovilidadData.origen,
                destino: editMovilidadData.destino,
                detalles: editMovilidadData.detalles
            };
            const res = await fetch(API, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            setPlanillaMovilidad(prev =>
                prev.map(m => m.id === editMovilidadData.id ? { ...m, ...editMovilidadData } : m)
            );
            setViewMovilidad(prev => prev ? { ...prev, ...editMovilidadData } : prev);
            setEditingMovilidad(false);
        } catch (err) {
            console.error("EDIT ERROR:", err);
            alert("Error al editar");
        }
    };

    // =====================
    // ACCIONES
    // =====================
    const firmarMovilidad = async (id) => {
        try {
            await fetch(API, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, action: "firmar", firmado_por: currentUser.id })
            });
            const updated = { ...viewMovilidad, firmado_por: currentUser.id, usuario_nombre: currentUser.nombre, estado: "Pendiente" };
            setPlanillaMovilidad(prev => prev.map(m => m.id === id ? updated : m));
            setViewMovilidad(updated);
        } catch (err) {
            console.error(err);
        }
    };

    const aprobarMovilidad = async (id) => {
        try {
            await fetch(API, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, action: "aprobar", aprobado_por: currentUser.id })
            });
            const updated = { ...viewMovilidad, estado: "Aprobado" };
            setPlanillaMovilidad(prev => prev.map(m => m.id === id ? updated : m));
            setViewMovilidad(updated);
        } catch (err) {
            console.error(err);
        }
    };

    const denegarMovilidad = async (id) => {
        const obs = prompt("Observación (opcional):");
        try {
            await fetch(API, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, action: "denegar", comentario: obs || "" })
            });
            const updated = { ...viewMovilidad, estado: "Denegado" };
            setPlanillaMovilidad(prev => prev.map(m => m.id === id ? updated : m));
            setViewMovilidad(updated);
        } catch (err) {
            console.error(err);
        }
    };

    const pagarMovilidad = async (id) => {
        if (!archivoPago) {
            alert("Debe subir un comprobante");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("pagado_por", currentUser.id);
            formData.append("comprobante", archivoPago);
            const res = await fetch(API, { method: "POST", body: formData });
            const data = await res.json();
            if (!data.ok) {
                alert(data.msg || "Error");
                return;
            }
            setPlanillaMovilidad(prev =>
                prev.map(m =>
                    m.id === id
                        ? { ...m, estado: "Pagado", comprobante_pago: data.archivo, comprobante_tipo: archivoPago.type === "application/pdf" ? "pdf" : "imagen" }
                        : m
                )
            );
            setViewMovilidad(prev => ({ ...prev, estado: "Pagado", comprobante_pago: data.archivo, comprobante_tipo: archivoPago.type === "application/pdf" ? "pdf" : "imagen" }));
            setShowPagoModal(false);
            setArchivoPago(null);
        } catch (err) {
            console.error(err);
        }
    };

    const BadgeEstado = ({ estado }) => {
        const safeEstado = (estado || "Sin firmar").toUpperCase();
        const estilos = {
            "SIN FIRMAR": "bg-gray-200 text-gray-700",
            "PENDIENTE": "bg-yellow-100 text-yellow-700",
            "APROBADO": "bg-green-100 text-green-700",
            "DENEGADO": "bg-red-100 text-red-700",
            "OBSERVADO": "bg-orange-100 text-orange-700",
            "PAGADO": "bg-blue-100 text-blue-700"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${estilos[safeEstado] || "bg-gray-100 text-gray-600"}`}>
                {safeEstado}
            </span>
        );
    };

    const generarPDF = async (movilidad) => {
 
        const doc = new jsPDF();
        const mainColor = [128, 0, 0];
        const goldColor = [212, 175, 55];
        doc.setFillColor(...mainColor);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("PLANILLA DE MOVILIDAD", 105, 20, { align: "center" });
        doc.addImage(logo, 'PNG', 15, 12, 35, 10);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("SISTEMA DE GESTIÓN ACADÉMICA 2026", 105, 28, { align: "center" });
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Planilla N°:", 14, 50);
        doc.setFont("helvetica", "normal");
        doc.text(String(movilidad.id || "-"), 38, 50);
        doc.setFont("helvetica", "bold");
        doc.text("Empresa:", 14, 56);
        doc.setFont("helvetica", "normal");
        doc.text(String(movilidad.empresa || "-"), 38, 56);
        doc.setFont("helvetica", "bold");
        doc.text("Fecha Emisión:", 140, 50);
        doc.setFont("helvetica", "normal");
        doc.text(String(movilidad.fecha || "-"), 170, 50);
        doc.setDrawColor(...goldColor);
        doc.line(14, 62, 196, 62);
        const filas = (movilidad.detalles || []).map(d => ([
            d.fecha,
            movilidad.usuario_nombre || "Trabajador",
            movilidad.usuario_dni || "-",
            movilidad.motivo,
            `${movilidad.origen} - ${movilidad.destino}`,
            { content: `S/ ${Number(d.monto).toFixed(2)}`, styles: { fontStyle: 'bold', halign: 'right' } }
        ]));
        autoTable(doc, {
            startY: 70,
            head: [["Fecha", "Trabajador", "DNI", "Motivo", "Ruta", "Importe"]],
            body: filas,
            headStyles: { fillColor: mainColor, textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold', halign: 'center' },
            styles: { fontSize: 8, cellPadding: 4 },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });
        const finalY = doc.lastAutoTable.finalY;
        const total = (movilidad.detalles || []).reduce((acc, d) => acc + Number(d.monto || 0), 0);
        doc.setFillColor(240, 240, 240);
        doc.rect(140, finalY + 5, 56, 12, 'F');
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...mainColor);
        doc.text("TOTAL:", 145, finalY + 13);
        doc.text(`S/ ${total.toFixed(2)}`, 190, finalY + 13, { align: "right" });
        let firmaSolicitante = null;
        let firmaAprobador = null;
        try {
            if (movilidad.firma_creador) firmaSolicitante = await getBase64FromUrl(API_BASE + movilidad.firma_creador);
            if (movilidad.firma_aprobador) firmaAprobador = await getBase64FromUrl(API_BASE + movilidad.firma_aprobador);
        } catch (error) {
            console.error("Error cargando firmas:", error);
        }
        const firmaY = 260;
        doc.setDrawColor(180, 180, 180);
        doc.line(30, firmaY, 80, firmaY);
        doc.line(130, firmaY, 180, firmaY);
        if (firmaSolicitante) try { doc.addImage(firmaSolicitante, 'PNG', 32, firmaY - 18, 45, 15); } catch (e) {}
        if (firmaAprobador) try { doc.addImage(firmaAprobador, 'PNG', 132, firmaY - 18, 45, 15); } catch (e) {}
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "bold");
        doc.text(movilidad.usuario_nombre || "SOLICITANTE", 55, firmaY + 5, { align: "center" });
        doc.text(movilidad.aprobador_nombre || "ADMINISTRACIÓN", 155, firmaY + 5, { align: "center" });
        doc.setFontSize(8);
        doc.text("FIRMA SOLICITANTE", 55, firmaY + 10, { align: "center" });
        doc.text("APROBADO POR", 155, firmaY + 10, { align: "center" });
        doc.setFontSize(7);
        doc.setFont("helvetica", "italic");
        doc.text("Documento generado digitalmente - Copia interna", 105, 285, { align: "center" });
        doc.save(`Planilla_Movilidad_${movilidad.id}.pdf`);
    };

    return (
        <div className="p-6 bg-[#f1f3f6] min-h-screen font-sans text-slate-900">
            {!isModalOnly && (
                <div className="max-w-7xl mx-auto">
                    {/* HEADER & TABS */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#800000] p-3 rounded-2xl shadow-lg shadow-red-900/10">
                                <Car className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-black uppercase tracking-tight text-slate-800">Gestión de Movilidad</h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Control y seguimiento de viáticos de transporte</p>
                            </div>
                        </div>
                        <button onClick={() => setShowMovilidadModal(true)} className="bg-[#800000] hover:bg-black text-white px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-red-900/20">
                            <Plus size={16} strokeWidth={3} />
                            <span className="font-bold text-[11px] uppercase tracking-wider">Planilla Movilidad</span>
                        </button>
                    </div>

                    <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit mb-4">
                        <button onClick={() => setActiveTab('mis')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'mis' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            <Car size={14} /> Mis Movilidades
                        </button>
                        {puedeVerTodo && (
                            <button onClick={() => setActiveTab('general')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'general' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                <LayoutDashboard size={14} /> Todas las Movilidades
                            </button>
                        )}
                    </div>

                    {/* BARRA DE FILTROS */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Search size={12} /> Buscar</label>
                                <input type="text" placeholder="Motivo, origen, destino o #ID" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-300" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Filter size={12} /> Estado de Pago</label>
                                <select value={pagadoFilter} onChange={(e) => setPagadoFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/30">
                                    <option value="todos">Todos</option>
                                    <option value="pagado">Pagados</option>
                                    <option value="no_pagado">No pagados</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Calendar size={12} /> Orden por Fecha</label>
                                <div className="flex gap-2">
                                    <button onClick={() => setFechaOrder('desc')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${fechaOrder === 'desc' ? 'bg-[#800000] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                        <ArrowDown size={14} /> Más Reciente
                                    </button>
                                    <button onClick={() => setFechaOrder('asc')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${fechaOrder === 'asc' ? 'bg-[#800000] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                        <ArrowUp size={14} /> Más Antigua
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-right text-[10px] font-bold text-slate-400">
                            Mostrando {filteredAndSortedMovilidad.length} de {planillaMovilidad.length} movilidades
                        </div>
                    </div>

                    {/* TABLE CARD */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Detalles</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Departamento</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ruta</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Estado</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedData.map(m => (
                                        <tr key={m.id} onClick={() => { setViewMovilidad(m); setEditMovilidadData(m); setDetalles(m.detalles || [{ fecha: "", monto: "" }]); setEditingMovilidad(false); }} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                            <td className="px-6 py-4"><div className="flex items-center gap-2"><Calendar size={14} className="text-slate-400" /><span className="text-sm font-medium text-slate-700">{m.fecha}</span></div></td>
                                            <td className="px-6 py-4"><div className="flex flex-col"><span className="text-xs font-bold text-[#800000] uppercase tracking-tight">{m.empresa}</span><span className="text-sm text-slate-600 line-clamp-1">{m.motivo}</span></div></td>
                                            <td className="px-6 py-4"><span className="text-xs font-bold text-slate-600 uppercase">{m.departamento_nombre || m.departamento || `DEPTO #${m.departamento_id}`}</span></td>
                                            <td className="px-6 py-4"><div className="flex items-center gap-2 text-slate-600"><span className="text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">{m.origen}</span><ArrowRight size={12} className="text-slate-400" /><span className="text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">{m.destino}</span></div></td>
                                            <td className="px-6 py-4 text-center"><BadgeEstado estado={m?.estado} /></td>
                                            <td className="px-6 py-4 text-right"><div className="flex flex-col items-end"><span className="text-sm font-black text-slate-800 tracking-tight">S/ {parseFloat(m.monto_total || 0).toFixed(2)}</span></div></td>
                                        </tr>
                                    ))}
                                    {paginatedData.length === 0 && (
                                        <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic">No se encontraron registros de movilidad con los filtros aplicados.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* PAGINACIÓN - AHORA FUERA DEL TBODY */}
                        {filteredAndSortedMovilidad.length > 0 && (
                            <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Mostrar</label>
                                    <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/30">
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={20}>20</option>
                                    </select>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">por página</span>
                                </div>
                                <div className="text-sm text-slate-500">
                                    Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredAndSortedMovilidad.length)} de {filteredAndSortedMovilidad.length} movilidades
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all text-sm font-bold">Anterior</button>
                                    <div className="flex items-center gap-1">
                                        {(() => {
                                            const pages = [];
                                            const maxVisible = 5;
                                            let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                                            let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                                            if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);
                                            for (let i = startPage; i <= endPage; i++) pages.push(i);
                                            return pages.map(page => (
                                                <button key={page} onClick={() => goToPage(page)} className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${currentPage === page ? 'bg-[#800000] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                                                    {page}
                                                </button>
                                            ));
                                        })()}
                                    </div>
                                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-all text-sm font-bold">Siguiente</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL CREAR (sin cambios, igual al original) */}
            {showMovilidadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="bg-[#800000] p-6 md:p-8 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                            <div className="flex items-center gap-5 z-10">
                                <div className="h-14 w-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                                    <Car className="text-[#800000]" size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Movilidad</h3>
                                    <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Nueva Planilla de Registro</p>
                                </div>
                            </div>
                            <button onClick={() => setShowMovilidadModal(false)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateMovilidad} className="p-8 md:p-10 space-y-8 overflow-y-auto">
                            {/* SECCIÓN 1: EMPRESA Y CONFIGURACIÓN */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                                <div className="md:col-span-8">
                                    <label className="block text-[11px] font-black text-[#800000]/60 uppercase tracking-[0.15em] mb-3 ml-1">Seleccionar Empresa</label>
                                    <div className="flex flex-wrap gap-3">
                                        <label className="group cursor-pointer">
                                            <input type="radio" name="empresa" value="EDUTUR" checked={empresa === "EDUTUR"} className="hidden peer" onChange={(e) => setEmpresa(e.target.value)} />
                                            <div className="px-6 py-3 border-2 border-slate-100 rounded-2xl font-bold text-sm peer-checked:border-[#800000] peer-checked:bg-[#800000] peer-checked:text-white peer-checked:shadow-md transition-all group-hover:border-slate-300">EDUTUR</div>
                                        </label>
                                        <label className="group cursor-pointer">
                                            <input type="radio" name="empresa" value="KEVSTUR" checked={empresa === "KEVSTUR"} className="hidden peer" onChange={(e) => setEmpresa(e.target.value)} />
                                            <div className="px-6 py-3 border-2 border-slate-100 rounded-2xl font-bold text-sm peer-checked:border-[#D4AF37] peer-checked:bg-[#D4AF37] peer-checked:text-[#800000] peer-checked:shadow-md transition-all group-hover:border-slate-300">KEVSTUR</div>
                                        </label>
                                        {empresa === "EDUTUR" && (
                                            <select name="sede" className="px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm min-w-[140px] focus:border-[#800000] outline-none transition-all" defaultValue="CETPRO PIURA">
                                                <option value="CETPRO PIURA">PIURA</option>
                                                <option value="CETPRO SULLANA">SULLANA</option>
                                            </select>
                                        )}
                                        {empresa === "KEVSTUR" && <input type="hidden" name="sede" value="INSTITUTO" />}
                                    </div>
                                </div>
                                <div className="md:col-span-4">
                                    <label className="block text-[11px] font-black text-[#800000]/60 uppercase tracking-[0.15em] mb-3 ml-1">Fecha Registro</label>
                                    <input name="fecha" type="date" required className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-[#800000] transition-all" defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                            </div>
                            {/* SECCIÓN 2: MOTIVO */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-[#800000]/60 uppercase tracking-[0.15em] ml-1">Motivo de la Comisión</label>
                                <input name="motivo" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm focus:bg-white focus:border-[#800000] outline-none transition-all shadow-inner" placeholder="Ej. Gestión de cobranza externa..." />
                            </div>
                            {/* SECCIÓN 3: TABLA DE DÍAS */}
                            <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-[11px] font-black text-[#800000] uppercase tracking-widest ml-2">Detalle de Gastos por Día</label>
                                    <button type="button" onClick={addDetalle} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-blue-100 transition-colors">+ Añadir Fila</button>
                                </div>
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {detalles.map((d, i) => (
                                        <div key={i} className="flex gap-3 items-center group animate-in slide-in-from-left-2 duration-200">
                                            <div className="flex-1 grid grid-cols-2 gap-3">
                                                <input type="date" value={d.fecha} onChange={(e) => updateDetalle(i, "fecha", e.target.value)} className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 ring-blue-100 outline-none" required />
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">S/</span>
                                                    <input type="number" value={d.monto} onChange={(e) => { let val = Number(e.target.value); if (val > 41) val = 41; updateDetalle(i, "monto", val); }} className="w-full p-3 pl-8 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 ring-blue-100 outline-none" placeholder="0.00" required />
                                                </div>
                                            </div>
                                            {detalles.length > 1 && <button type="button" onClick={() => removeDetalle(i)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><X size={18} /></button>}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-200/60 flex justify-between items-center">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monto Máximo Diario: S/ 41.00</div>
                                    <div className="px-6 py-2 bg-white rounded-2xl border border-[#D4AF37]/30 shadow-sm">
                                        <span className="text-[11px] font-black text-slate-400 uppercase mr-3">Total Acumulado</span>
                                        <span className="text-xl font-black text-[#800000]">S/ {detalles.reduce((acc, d) => acc + Number(d.monto || 0), 0).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            {/* SECCIÓN 4: ORIGEN/DESTINO */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-[#800000]/60 uppercase tracking-[0.15em] ml-1">Origen</label>
                                    <input name="origen" required className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm focus:border-[#800000] outline-none transition-all" placeholder="Ej. Sede Central" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-[#800000]/60 uppercase tracking-[0.15em] ml-1">Destino</label>
                                    <input name="destino" required className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm focus:border-[#800000] outline-none transition-all" placeholder="Ej. Punto de cobranza" />
                                </div>
                            </div>
                            {/* FOOTER */}
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setShowMovilidadModal(false)} className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancelar y salir</button>
                                <button type="submit" disabled={saving} className="flex-[2] bg-[#800000] py-4 rounded-2xl text-white text-sm font-black hover:bg-[#600000] hover:shadow-lg hover:shadow-red-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                                    {saving ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Procesando...</span> : <><Save size={20} /> REGISTRAR PLANILLA</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL VIEW (sin cambios estructurales, solo la paginación ya está corregida arriba) */}
            {viewMovilidad && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8 animate-in fade-in duration-500">
                    <div className="bg-white rounded-[3rem] w-full max-w-5xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden max-h-[94vh] border border-white/20">
                        {/* HEADER */}
                        <div className="bg-gradient-to-r from-[#800000] via-[#600000] to-[#400000] p-6 md:p-8 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                            <div className="flex items-center gap-6 z-10">
                                <div className="bg-amber-400 p-3.5 rounded-[1.2rem] shadow-lg transform -rotate-3"><Truck size={28} className="text-[#800000]" /></div>
                                <div><div className="flex items-center gap-4"><h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic">MOV-{viewMovilidad.id}</h3><BadgeEstado estado={viewMovilidad.estado} /></div><p className="text-[10px] font-bold text-amber-200/60 uppercase tracking-[0.3em] mt-1">Comprobante Electrónico de Movilidad</p></div>
                            </div>
                            <button onClick={() => setViewMovilidad(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all active:scale-90 z-10"><X size={24} className="text-white" /></button>
                        </div>
                        {/* BODY */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-50/50 custom-scrollbar">
                            {/* KPI CARDS */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {[
                                    { label: 'Empresa', val: viewMovilidad.empresa, sub: viewMovilidad.sede, icon: Building2, color: 'text-blue-600' },
                                    { label: 'Fecha Registro', val: viewMovilidad.fecha, sub: 'Emisión', icon: Calendar, color: 'text-purple-600' },
                                    { label: 'Tipo Gasto', val: 'Movilidad', sub: 'Operativo', icon: Info, color: 'text-amber-600' },
                                    { label: 'Monto Total', val: `S/ ${Number(viewMovilidad.monto_total).toFixed(2)}`, sub: 'Total a Pagar', icon: Wallet, color: 'text-emerald-600' }
                                ].map((info, i) => (
                                    <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
                                        <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${info.color}`}><info.icon size={20} /></div>
                                        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{info.label}</p><p className="text-base font-black text-slate-800 leading-tight">{info.val}</p><p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{info.sub}</p></div>
                                    </div>
                                ))}
                            </div>
                            {/* SECCIÓN DINÁMICA: VISTA O EDICIÓN */}
                            {!editingMovilidad ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden"><div className="absolute top-0 left-0 w-1.5 h-full bg-[#800000]" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Concepto Detallado</p><p className="text-xl font-bold text-slate-800 leading-relaxed italic">"{viewMovilidad.motivo}"</p></div>
                                    <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-2 rounded-[2.5rem] border border-slate-200 shadow-sm"><div className="flex-1 p-6 text-center md:text-left"><p className="text-[10px] text-slate-400 uppercase font-black mb-1">Origen</p><p className="font-bold text-slate-700 text-lg">{viewMovilidad.origen}</p></div><div className="bg-slate-100 p-3 rounded-full text-slate-400 transform rotate-90 md:rotate-0"><ArrowRight size={20} /></div><div className="flex-1 p-6 text-center md:text-right"><p className="text-[10px] text-slate-400 uppercase font-black mb-1">Destino</p><p className="font-bold text-slate-700 text-lg">{viewMovilidad.destino}</p></div></div>
                                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm"><div className="flex justify-between items-center mb-4"><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Detalle de Gastos</p><span className="text-xs font-bold text-slate-400">{viewMovilidad.detalles?.length || 0} registros</span></div><div className="space-y-3 max-h-52 overflow-y-auto pr-2 custom-scrollbar">{(viewMovilidad.detalles || []).map((d, i) => (<div key={i} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"><div className="flex flex-col"><span className="text-[10px] font-bold text-slate-400 uppercase">Fecha</span><span className="text-sm font-black text-slate-700">{d.fecha}</span></div><div className="text-right"><span className="text-[10px] font-bold text-slate-400 uppercase">Monto</span><span className="text-sm font-black text-[#800000] block">S/ {Number(d.monto).toFixed(2)}</span></div></div>))}</div><div className="mt-5 pt-3 border-t border-slate-200 flex justify-end"><div className="px-5 py-2 bg-slate-100 rounded-xl border border-slate-200"><span className="text-xs font-black text-slate-500 mr-2">TOTAL:</span><span className="text-lg font-black text-[#800000]">S/ {(viewMovilidad.detalles || []).reduce((acc, d) => acc + Number(d.monto || 0), 0).toFixed(2)}</span></div></div></div>
                                </div>
                            ) : (
                                <div className="bg-amber-50/50 p-8 rounded-[2.5rem] border-2 border-amber-200 space-y-6 animate-in zoom-in-95 duration-300">
                                    <div className="flex items-center gap-3 mb-2"><div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center text-amber-700"><Edit3 size={16} /></div><h4 className="font-black text-amber-800 text-sm uppercase tracking-tighter">Modo Edición Activado</h4></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="col-span-full"><span className="text-[10px] font-black text-amber-800/60 uppercase ml-4">Motivo del Gasto</span><input value={editMovilidadData.motivo} onChange={(e) => setEditMovilidadData(prev => ({ ...prev, motivo: e.target.value }))} className="w-full mt-1 p-4 bg-white border-2 border-amber-100 rounded-2xl outline-none font-bold focus:border-amber-400 transition-all shadow-sm" /></label>
                                        <label><span className="text-[10px] font-black text-amber-800/60 uppercase ml-4">Punto de Origen</span><input value={editMovilidadData.origen} onChange={(e) => setEditMovilidadData(prev => ({ ...prev, origen: e.target.value }))} className="w-full mt-1 p-4 bg-white border-2 border-amber-100 rounded-2xl font-bold focus:border-amber-400 outline-none shadow-sm" /></label>
                                        <label><span className="text-[10px] font-black text-amber-800/60 uppercase ml-4">Punto de Destino</span><input value={editMovilidadData.destino} onChange={(e) => setEditMovilidadData(prev => ({ ...prev, destino: e.target.value }))} className="w-full mt-1 p-4 bg-white border-2 border-amber-100 rounded-2xl font-bold focus:border-amber-400 outline-none shadow-sm" /></label>
                                        <div className="col-span-full bg-white p-6 rounded-[2rem] border border-amber-200 shadow-inner">
                                            <div className="flex justify-between items-center mb-4"><span className="text-[11px] font-black text-amber-800 uppercase tracking-widest">Detalle de Gastos</span><button type="button" onClick={() => setEditMovilidadData(prev => ({ ...prev, detalles: [...(prev.detalles || []), { fecha: '', monto: '' }] }))} className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black hover:bg-amber-200 transition">+ Añadir</button></div>
                                            <div className="space-y-3 max-h-52 overflow-y-auto pr-2">{(editMovilidadData.detalles || []).map((d, i) => (<div key={i} className="flex gap-3 items-center"><div className="flex-1 grid grid-cols-2 gap-3"><input type="date" value={d.fecha} onChange={(e) => { const nuevos = [...editMovilidadData.detalles]; nuevos[i].fecha = e.target.value; setEditMovilidadData(prev => ({ ...prev, detalles: nuevos })); }} className="p-3 bg-white border border-amber-200 rounded-xl text-sm font-bold outline-none focus:ring-2 ring-amber-200" required /><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 font-bold text-sm">S/</span><input type="number" value={d.monto} onChange={(e) => { let val = Number(e.target.value); if (val > 41) val = 41; const nuevos = [...editMovilidadData.detalles]; nuevos[i].monto = val; setEditMovilidadData(prev => ({ ...prev, detalles: nuevos })); }} className="w-full p-3 pl-8 bg-white border border-amber-200 rounded-xl text-sm font-bold outline-none focus:ring-2 ring-amber-200" placeholder="0.00" required /></div></div>{(editMovilidadData.detalles || []).length > 1 && (<button type="button" onClick={() => { const nuevos = editMovilidadData.detalles.filter((_, idx) => idx !== i); setEditMovilidadData(prev => ({ ...prev, detalles: nuevos })); }} className="p-2 text-amber-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><X size={18} /></button>)}</div>))}</div>
                                            <div className="mt-5 pt-3 border-t border-amber-200 flex justify-end"><div className="px-5 py-2 bg-amber-50 rounded-xl border border-amber-200"><span className="text-xs font-black text-amber-700 mr-2">TOTAL:</span><span className="text-lg font-black text-[#800000]">S/ {(editMovilidadData.detalles || []).reduce((acc, d) => acc + Number(d.monto || 0), 0).toFixed(2)}</span></div></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4"><button onClick={guardarEdicionMovilidad} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-900/20 transition-all active:scale-95">GUARDAR CAMBIOS</button><button onClick={() => setEditingMovilidad(false)} className="px-8 py-4 bg-white text-slate-500 border border-slate-200 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all">CANCELAR</button></div>
                                </div>
                            )}
                            {/* FIRMA */}
                            <div className={`p-8 rounded-[2.5rem] border-2 border-dashed transition-all ${viewMovilidad.firmado_por ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-100/50 border-slate-300'}`}>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-5"><div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${viewMovilidad.firmado_por ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}><CheckCircle2 size={32} /></div><div><p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Estado de Autorización</p><p className={`text-xl font-black ${viewMovilidad.firmado_por ? 'text-emerald-700' : 'text-slate-500'}`}>{viewMovilidad.usuario_nombre ? `Validado por: ${viewMovilidad.usuario_nombre}` : 'Esperando firma de Jefatura'}</p></div></div>
                                    {!viewMovilidad.firmado_por && currentRole === "jefe" && user?.departamento_id == viewMovilidad.departamento_id && (<button onClick={() => firmarMovilidad(viewMovilidad.id)} className="w-full md:w-auto bg-[#800000] text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-[#600000] shadow-xl shadow-red-900/20 hover:-translate-y-1 transition-all active:translate-y-0">ESTAMPAR FIRMA DIGITAL</button>)}
                                </div>
                            </div>
                            {viewMovilidad.comprobante_pago && (
                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">Comprobante de Pago</p>{viewMovilidad.comprobante_tipo === 'imagen' ? <img src={`${API_BASE}/${viewMovilidad.comprobante_pago}`} alt="Comprobante" className="w-full rounded-2xl border border-slate-200" /> : <a href={`${API_BASE}/${viewMovilidad.comprobante_pago}`} target="_blank" rel="noreferrer" className="bg-red-600 text-white px-6 py-4 rounded-2xl inline-flex items-center gap-2 font-black">VER PDF</a>}</div>
                            )}
                        </div>
                        {/* FOOTER ACCIONES */}
                        <div className="p-8 bg-white border-t border-slate-100 flex flex-wrap items-center gap-4">
                            {viewMovilidad.estado === "Sin firmar" && !editingMovilidad && (<button onClick={() => { setEditingMovilidad(true); setEditMovilidadData({ ...viewMovilidad, detalles: Array.isArray(viewMovilidad.detalles) ? viewMovilidad.detalles : JSON.parse(viewMovilidad.detalles || '[]') }); }} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"><Edit3 size={16} /> MODIFICAR REGISTRO</button>)}
                            {currentDept === 'ADMINISTRACION' && viewMovilidad.estado === 'Pendiente' && (<div className="flex gap-3"><button onClick={() => aprobarMovilidad(viewMovilidad.id)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 transition-all">APROBAR</button><button onClick={() => denegarMovilidad(viewMovilidad.id)} className="bg-red-50 text-red-600 border border-red-200 px-8 py-4 rounded-2xl font-black text-xs hover:bg-red-100 transition-all">RECHAZAR</button></div>)}
                            {currentDept === 'TESORERIA' && viewMovilidad.estado === 'Aprobado' && (<button onClick={() => setShowPagoModal(true)} className="bg-[#D4AF37] text-[#800000] px-10 py-4 rounded-2xl font-black text-xs hover:shadow-lg shadow-amber-900/20 transition-all flex items-center gap-2"><Wallet size={16} /> EJECUTAR PAGO REEMBOLSABLE</button>)}
                            <button onClick={() => generarPDF(viewMovilidad)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-blue-700 transition-all">DESCARGAR PDF</button>
                            <button onClick={() => setViewMovilidad(null)} className="ml-auto px-8 py-4 text-xs font-black text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">Cerrar Vista</button>
                        </div>
                    </div>
                    {showPagoModal && (
                        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                            <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl">
                                <div className="flex items-center gap-4 mb-6"><div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center"><Wallet className="text-amber-700" /></div><div><h3 className="text-xl font-black text-slate-800">Registrar Pago</h3><p className="text-sm text-slate-500">Adjunte el comprobante del depósito</p></div></div>
                                <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-2xl p-4"><p className="text-[10px] uppercase font-black text-emerald-700 mb-1">Teléfono del solicitante</p><p className="text-2xl font-black text-emerald-800 tracking-wide">{viewMovilidad.usuario_telefono || 'No registrado'}</p><p className="text-xs text-emerald-600 mt-1">Útil para Yape o Plin</p></div>
                                <label className="block"><span className="text-[10px] font-black uppercase text-slate-500 ml-2">Comprobante</span><input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setArchivoPago(e.target.files[0])} className="w-full mt-2 border border-slate-200 rounded-2xl p-4" /></label>
                                {archivoPago && <div className="mt-4 bg-slate-100 rounded-xl p-3 text-sm font-bold text-slate-700">{archivoPago.name}</div>}
                                <div className="flex gap-3 mt-8"><button onClick={() => pagarMovilidad(viewMovilidad.id)} className="flex-1 bg-[#D4AF37] text-[#800000] py-4 rounded-2xl font-black">CONFIRMAR PAGO</button><button onClick={() => { setShowPagoModal(false); setArchivoPago(null); }} className="px-6 py-4 rounded-2xl border border-slate-200 font-black text-slate-500">CANCELAR</button></div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #800000; }
      `}</style>
        </div>
    );
};

export default Movilidad;