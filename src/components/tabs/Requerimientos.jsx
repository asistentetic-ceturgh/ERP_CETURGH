import React, { useState, useEffect, useMemo } from 'react';
import {
    Database, ShoppingCart, CheckCircle2, XCircle, Clock, Layers, Check,
    FileText, ShieldCheck, Truck, Plus, ChevronDown, CalendarDays, Calendar,
    Trash2, Save, Send, Edit3, Eye, UserCheck, User, Package,
    Building2, MessageSquare, AlertCircle, Search, ClipboardCheck,
    X, List, ArrowRight
} from 'lucide-react';
import jsPDF from "jspdf";
import logo from "../../assets/logo.png";
import autoTable from "jspdf-autotable";
import { API_BASE } from "../../config/api";
const API = API_BASE;
const Requerimientos = () => {

    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('mis');
    const [carreras, setCarreras] = useState([]);
    const puedeVerCarreras = [
        "ALMACEN",
        "LOGISTICA",
        "ADMINISTRACION",
        "TIC"
    ].includes(currentUser?.depto);

    // --- DATOS ---
    const [requerimientos, setRequerimientos] = useState([]);

    // --- UI STATES ---
    const [showModal, setShowModal] = useState(false);
    const [editingReq, setEditingReq] = useState(null);
    const [viewingReq, setViewingReq] = useState(null);
    const [empresas, setEmpresas] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [observacionAdmin, setObservacionAdmin] = useState('');
    const [empresasSedes, setEmpresasSedes] = useState([]);

    const [ITEMS, setITEMS] = useState([]);

    const currentUserName = currentUser?.nombre || "Administración";

    const requerimientosFiltrados = requerimientos;
    const departamento = (currentUser?.depto || "")
        .toUpperCase()
        .trim();

    const requerimientosPropios = requerimientos.filter(req =>
        Number(req.departamento_id) === Number(currentUser?.departamento_id)
    );
    const puedeVerGeneral = ["LOGISTICA", "ADMINISTRACION", "TIC", "TESORERIA"]
        .includes(departamento);

    // CARGAR USUARIO 
    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user) {
                setCurrentUser({
                    id: user.id,
                    nombre: user.nombre,
                    correo: user.usuario,

                    rol: user.tipo,
                    depto: user.departamento,
                    departamento_id: user.departamento_id,

                    firma: user.firma,
                    telefono: user.telefono
                });
            }
        } catch (error) {
            console.error("Error leyendo usuario:", error);
        }
    }, []);

    useEffect(() => {

        if (!editingReq?.empresa_id || !editingReq?.sede_id) {
            setCarreras([]);
            return;
        }

        fetch(
            API +
            `requerimientos.php?carreras=1&empresa_id=${editingReq.empresa_id}&sede_id=${editingReq.sede_id}`
        )
            .then(res => res.json())
            .then(data => setCarreras(data));

    }, [editingReq?.empresa_id, editingReq?.sede_id]);

    useEffect(() => {
        fetch(API + "productos_select.php")
            .then(res => res.json())
            .then(data => {
                setITEMS(data.map(d => d.nombre));
            })
            .catch(() => {
                setITEMS([]); // fallback
            });
    }, []);

    const getBase64FromUrl = async (url) => {
        const data = await fetch(url);
        const blob = await data.blob();

        return new Promise((resolve) => {
            const reader = new FileReader();

            reader.readAsDataURL(blob);

            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    };

    const generarPDF = async (req) => {

        if (!req) return;

        const doc = new jsPDF();

        const r1 = 128, g1 = 0, b1 = 0;
        const r2 = 212, g2 = 175, b2 = 55;

        // =========================
        // MARCO
        // =========================
        doc.setDrawColor(r1, g1, b1);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, 190, 277);

        // =========================
        // HEADER
        // =========================
        doc.setFillColor(r1, g1, b1);
        doc.rect(10, 10, 190, 15, 'F');

        doc.addImage(logo, 'PNG', 15, 12, 35, 10);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);

        doc.text(
            "SISTEMA DE GESTIÓN DE CALIDAD",
            105,
            20,
            { align: "center" }
        );

        // =========================
        // TITULO
        // =========================
        doc.setTextColor(40, 40, 40);

        doc.setFontSize(14);

        doc.text(
            "SOLICITUD DE REQUERIMIENTO",
            105,
            35,
            { align: "center" }
        );

        doc.setDrawColor(r2, g2, b2);

        doc.setLineWidth(1);

        doc.line(70, 38, 140, 38);

        // =========================
        // INFO CABECERA
        // =========================
        doc.setFontSize(10);

        doc.setFont("helvetica", "bold");

        doc.text("Solicitud N°:", 14, 48);

        doc.setFont("helvetica", "normal");

        doc.text(
            String(req.codigo || "S/N"),
            40,
            48
        );

        doc.setFont("helvetica", "bold");

        doc.text("Fecha:", 150, 48);

        doc.setFont("helvetica", "normal");

        doc.text(
            String(req.fecha || "-"),
            165,
            48
        );

        // =========================
        // SOLICITANTE
        // =========================
        doc.setFillColor(245, 245, 245);

        doc.rect(14, 55, 182, 25, 'F');

        doc.setFont("helvetica", "bold");

        doc.setTextColor(r1, g1, b1);

        doc.text(
            "1. INFORMACIÓN DEL SOLICITANTE",
            18,
            62
        );

        doc.setFontSize(9);

        doc.setTextColor(40, 40, 40);

        doc.text("SOLICITANTE:", 18, 70);

        doc.setFont("helvetica", "normal");

        doc.text(
            String(req.creador || "-"),
            45,
            70
        );

        doc.setFont("helvetica", "bold");

        doc.text("ÁREA / DEPTO:", 18, 76);

        doc.setFont("helvetica", "normal");

        doc.text(
            String(req.depto || "-"),
            45,
            76
        );

        doc.setFont("helvetica", "bold");

        doc.text("EMPRESA:", 110, 70);

        doc.setFont("helvetica", "normal");

        doc.text(
            `${req.empresa || ""} - ${req.sede || ""}`,
            135,
            70
        );

        // =========================
        // ITEMS
        // =========================
        const rows = (req.items || []).map((it, i) => ([
            {
                content: i + 1,
                styles: { halign: 'center' }
            },

            it.descripcion || "",

            {
                content: it.cantidad || "0",
                styles: {
                    halign: 'center',
                    fontStyle: 'bold'
                }
            },

            {
                content: it.unidad || "",
                styles: { halign: 'center' }
            },

            it.observacion || '-'
        ]));

        autoTable(doc, {
            startY: 85,

            head: [[
                "ÍTEM",
                "DESCRIPCIÓN DE BIENES / SERVICIOS",
                "CANT.",
                "U.M.",
                "OBSERVACIONES"
            ]],

            body: rows,

            theme: 'grid',

            headStyles: {
                fillColor: [r1, g1, b1],
                textColor: [255, 255, 255]
            },

            styles: {
                fontSize: 8
            }
        });

        // =========================
        // DETALLES
        // =========================
        let finalY = doc.lastAutoTable.finalY + 12;

        doc.setFont("helvetica", "bold");

        doc.setFontSize(10);

        doc.setTextColor(40, 40, 40);

        doc.text("PRIORIDAD:", 14, finalY);

        const prioridadTxt = String(
            req.prioridad || "NORMAL"
        ).toUpperCase();

        doc.setTextColor(
            prioridadTxt === 'ALTA' ? 200 : 40,
            0,
            0
        );

        doc.text(prioridadTxt, 40, finalY);

        finalY += 10;

        doc.setTextColor(40, 40, 40);

        doc.text("COMENTARIOS:", 14, finalY);

        doc.setFont("helvetica", "normal");

        const comments = doc.splitTextToSize(
            String(req.comentarios || "Sin comentarios."),
            180
        );

        doc.text(comments, 14, finalY + 6);

        // =========================
        // CARGAR FIRMAS
        // =========================
        let firmaSolicitante = null;

        try {

            if (req.firma_solicitante) {

                firmaSolicitante = await getBase64FromUrl(
                    API + req.firma_solicitante
                );
            }

        } catch (error) {

            console.error(
                "Error cargando firma:",
                error
            );
        }

        // =========================
        // FIRMAS
        // =========================
        const firmaY = 260;

        doc.setDrawColor(150, 150, 150);

        // Líneas
        doc.line(14, firmaY, 70, firmaY);

        doc.line(140, firmaY, 196, firmaY);

        // =========================
        // FIRMA SOLICITANTE
        // =========================
        if (firmaSolicitante) {

            try {

                doc.addImage(
                    firmaSolicitante,
                    'PNG',
                    20,
                    firmaY - 18,
                    45,
                    15
                );

            } catch (e) {

                console.error(
                    "Error cargando firma solicitante"
                );
            }
        }

        doc.setFontSize(8);

        doc.setTextColor(40, 40, 40);

        doc.text(
            String(req.creador || "SOLICITANTE"),
            42,
            firmaY + 5,
            { align: "center" }
        );

        doc.text(
            "FIRMA SOLICITANTE",
            42,
            firmaY + 10,
            { align: "center" }
        );

        // =========================
        // AUTORIZADOR
        // =========================
        doc.text(
            "AUTORIZADO POR",
            168,
            firmaY + 10,
            { align: "center" }
        );

        // =========================
        // DESCARGAR
        // =========================
        doc.save(
            `Requerimiento_${req.codigo || "001"}.pdf`
        );
    };

    const cambiarEstadoItem = async (itemId, estado, motivo = null) => {
        await fetch(API + "items.php", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: itemId,
                estado: estado,
                motivo: motivo
            })
        });

        await fetchReqs();
    };

    // CARGAR EMPRESAS
    useEffect(() => {
        fetch(API + "requerimientos.php?empresas=1")
            .then(res => res.json())
            .then(data => setEmpresas(data));
    }, []);

    // CARGAR SEDES
    useEffect(() => {
        if (!editingReq?.empresa_id) return;

        fetch(API + `requerimientos.php?sedes=1&empresa_id=${editingReq.empresa_id}`)
            .then(res => res.json())
            .then(data => setSedes(data));
    }, [editingReq?.empresa_id]);

    // CARGAR REQUERIMIENTOS
    const fetchReqs = async () => {
        try {
            const res = await fetch(API + "requerimientos.php");
            const data = await res.json();
            setRequerimientos(data);
        } catch (error) {
            console.error("Error cargando requerimientos:", error);
        }
    };

    useEffect(() => {
        fetchReqs();
    }, []);

    // CARGAR COMBO EMPRESA-SEDE
    useEffect(() => {
        fetch(API + "requerimientos.php?combo=1")
            .then(res => res.json())
            .then(data => setEmpresasSedes(data));
    }, []);

    const dataMostrar = requerimientos.filter(req => {
        if (activeTab === 'general') return true;

        if (activeTab === 'mis') {
            return Number(req.departamento_id) === Number(currentUser?.departamento_id);
        }

        return true;
    });

    // LÓGICA DE NEGOCIO
    const canEdit = (req) => {
        if (!currentUser) return false;

        return (
            Number(currentUser.departamento_id) === Number(req.departamento_id) &&
            ['Sin firmar'].includes(req.estado)
        );
    };

    // GUARDAR REQUERIMIENTO
    const handleSaveReq = async (e) => {
        e.preventDefault();

        try {
            if (!editingReq.empresa_id) {
                return alert("Seleccione una empresa");
            }
            if (!editingReq.sede_id) {
                return alert("Seleccione una sede");
            }
            if (!editingReq.items || editingReq.items.length === 0) {
                return alert("Debe agregar al menos un ítem");
            }
            if (editingReq.items.some(i => !i.descripcion.trim())) {
                return alert("Todos los ítems deben tener descripción");
            }
            const payload = {
                id: editingReq?.id || null,
                creador_id: currentUser.id,
                codigo: editingReq?.codigo || `RQ-2026-${String(Date.now()).slice(-4)}`,
                departamento_id: editingReq?.departamento_id || currentUser.departamento_id,
                empresa_id: editingReq.empresa_id,
                sede_id: editingReq.sede_id,

                prioridad: editingReq.prioridad || 'Media',
                tipo: editingReq.tipo || 'Producto',

                tipo_destino: editingReq.tipo_destino || 'GENERAL',
                carrera_id: editingReq.carrera_id || null,
                curso_corto: editingReq.curso_corto || null,

                items: editingReq.items.map(it => ({
                    ...it,

                    carrera_id:
                        editingReq.tipo_destino === 'CARRERA'
                            ? editingReq.carrera_id
                            : null,

                    curso_corto:
                        editingReq.tipo_destino === 'CURSO_CORTO'
                            ? editingReq.curso_corto
                            : null
                }))
            };

            if (editingReq.estado === 'Observado') {

                const res = await fetch(API + "requerimientos.php", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if (!res.ok || data.error) {
                    throw new Error(data.error || "Error al guardar");
                }

                await cambiarEstado(editingReq.id, 'Pendiente');

            } else {

                const method = editingReq?.id ? "PUT" : "POST";

                const res = await fetch(API + "requerimientos.php", {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if (!res.ok || data.error) {
                    throw new Error(data.error || "Error al guardar");
                }
            }

            await fetchReqs();
            setShowModal(false);
            setEditingReq(null);

        } catch (error) {
            console.error("Error guardando requerimiento:", error);
            alert("Error al guardar requerimiento");
        }
    };



    // CAMBIAR ESTADO
    const cambiarEstado = async (id, nuevoEstado, extra = {}) => {
        try {
            await fetch(API + "requerimientos.php", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    estado: nuevoEstado,
                    ...extra
                })
            });

            await fetchReqs();

        } catch (error) {
            console.error("Error cambiando estado:", error);
        }
    };

    useEffect(() => {
        fetch(API + "requerimientos.php?empresas=1")
            .then(res => res.json())
            .then(data => setEmpresas(data));
    }, []);

    useEffect(() => {
        if (!editingReq?.empresa_id) return;

        fetch(API + `requerimientos.php?sedes=1&empresa_id=${editingReq.empresa_id}`)
            .then(res => res.json())
            .then(data => setSedes(data));
    }, [editingReq?.empresa_id]);

    // --- CARGAR REQUERIMIENTOS ---


    useEffect(() => {
        fetchReqs();
    }, []);



    // --- COMPONENTE ESTADO ---
    const StatusBadge = ({ estado }) => {
        const styles = {
            'Sin firmar': 'bg-gray-100 text-gray-700 border-gray-200',
            'Pendiente': 'bg-amber-100 text-amber-700 border-amber-200',
            'Cotizado': 'bg-blue-100 text-blue-700 border-blue-200',
            'Pagado': 'bg-cyan-100 text-cyan-700 border-cyan-200',
            'Evaluando': 'bg-indigo-100 text-indigo-700 border-indigo-200',
            'Aprobado': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Denegado': 'bg-red-100 text-red-700 border-red-200',
            'Observado': 'bg-orange-50 text-orange-600 border-orange-100',
        };

        return (
            <span
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide border ${styles[estado] || styles['Pendiente Firma']
                    }`}
            >
                {estado}
            </span>
        );
    };

    // --- PROTECCIÓN ---
    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-[#f1f3f6] font-sans text-slate-900">

            <div className="max-w-[1400px] mx-auto p-4 md:p-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#800000] p-3 rounded-2xl shadow-lg shadow-red-900/10">
                            <Database className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-tight text-slate-800">Panel de Requerimientos</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gestión de Compras y Servicios</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setEditingReq({
                                    empresa_id: "",
                                    sede_id: "",
                                    prioridad: 'Media',
                                    tipo: 'Producto',
                                    tipo_destino: "GENERAL",
                                    carrera_id: null,
                                    items: [
                                        { tempId: Date.now(), descripcion: '', cantidad: 1, unidad: 'Unidad' }
                                    ]
                                });
                                setShowModal(true);
                            }}
                            className="bg-[#800000] hover:bg-black text-white px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-red-900/20"
                        >
                            <Plus size={16} strokeWidth={3} />
                            <span className="font-bold text-[11px] uppercase tracking-wider">Nuevo Requerimiento</span>
                        </button>

                    </div>
                </div>

                <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit mb-4">
                    <button
                        onClick={() => setActiveTab('mis')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'mis'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <FileText size={14} />
                        Mis Requerimientos
                    </button>
                    {puedeVerGeneral && (
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'general'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <ShoppingCart size={14} />
                            Cotización General
                        </button>
                    )}
                </div>

                {/* TABLA PRINCIPAL */}
                {(activeTab === 'general' || activeTab === 'mis') && (
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Requerimiento</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Solicitante</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-center">Tipo / Ítems</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Seguimiento</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {(dataMostrar || []).map((req) => {
                                        const actual = req?.flujo_global || 'LOGISTICA';
                                        const pasos = ['LOGISTICA', 'ADMINISTRACION', 'TESORERIA', 'FINALIZADO'];
                                        const orden = { LOGISTICA: 1, ADMINISTRACION: 2, TESORERIA: 3, FINALIZADO: 4 };

                                        return (
                                            <tr key={req?.id} className="hover:bg-blue-50/30 transition-colors group">
                                                {/* CÓDIGO Y FECHA */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 leading-none">
                                                            {req?.codigo || 'SIN CÓDIGO'}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                                                            <Calendar size={10} /> {req?.fecha || '---'}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* USUARIO Y EMPRESA */}
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-slate-700 leading-tight">
                                                        {req?.usuario || req?.creador}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <Building2 size={11} className="text-slate-400" />
                                                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">
                                                            {req?.empresa} <span className="text-slate-300">•</span> {req?.sede}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* TIPO E ÍTEMS */}
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${req?.tipo === 'Producto'
                                                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                            : 'bg-purple-50 text-purple-600 border-purple-100'
                                                            }`}>
                                                            {req?.tipo || '---'}
                                                        </span>
                                                        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                                                            <Package size={12} /> {(req?.items || []).length} ítems
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* ESTADO Y FLUJO VISUAL */}
                                                <td className="px-6 py-4">
                                                    <div className="min-w-[140px]">
                                                        <StatusBadge estado={req?.estado} />
                                                        <div className="flex items-center gap-0 mt-3">
                                                            {pasos.map((step, idx) => {
                                                                const activo = orden[step] <= orden[actual];
                                                                const esUltimo = idx === pasos.length - 1;
                                                                return (
                                                                    <div key={step} className="flex items-center group/step relative">
                                                                        {/* Punto del flujo */}
                                                                        <div className={`h-2.5 w-2.5 rounded-full z-10 border-2 transition-colors ${activo ? 'bg-emerald-500 border-emerald-200' : 'bg-slate-200 border-white'
                                                                            }`} />

                                                                        {/* Línea conectora */}
                                                                        {!esUltimo && (
                                                                            <div className={`h-[2px] w-8 -mx-0.5 ${activo ? 'bg-emerald-400' : 'bg-slate-100'
                                                                                }`} />
                                                                        )}

                                                                        {/* Tooltip simple al hover del punto */}
                                                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover/step:scale-100 transition-transform bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded pointer-events-none uppercase">
                                                                            {step}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* ACCIONES RE-DISEÑADAS */}
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setViewingReq(req)}
                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            title="Ver detalle"
                                                        >
                                                            <Eye size={18} />
                                                        </button>

                                                        {canEdit(req) && (
                                                            <button
                                                                onClick={() => {
                                                                    setEditingReq(req);
                                                                    setShowModal(true);
                                                                }}
                                                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                                title="Editar"
                                                            >
                                                                <Edit3 size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* --- MODAL CREACIÓN / EDICIÓN --- */}
            {showModal && editingReq && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-5xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden max-h-[92vh] border border-amber-100/50">

                        {/* HEADER ESTILIZADO CON TOQUES DORADOS */}
                        <div className="relative bg-white px-8 py-7 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#800000] to-[#5a0000] rounded-2xl flex items-center justify-center shadow-xl shadow-red-900/20 rotate-3 border-2 border-amber-400/30">
                                    <Save className="text-amber-400 -rotate-3" size={26} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                                        {editingReq?.id ? 'Editar' : 'Nuevo'} <span className="text-[#800000]">Requerimiento</span>
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="h-[1px] w-4 bg-amber-400"></span>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Logística de Excelencia</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="group p-2.5 bg-slate-50 hover:bg-amber-50 rounded-full transition-all duration-300 border border-slate-100 hover:border-amber-200"
                            >
                                <X size={20} className="text-slate-400 group-hover:text-amber-600 transition-colors" />
                            </button>
                        </div>

                        {/* FORMULARIO */}
                        <form onSubmit={handleSaveReq} className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">

                                {/* SECCIÓN: INFORMACIÓN GENERAL */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                                    {/* EMPRESA / SEDE */}
                                    <div className="group space-y-3">
                                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                                            Empresa / Sede
                                        </label>

                                        {/* EMPRESA */}
                                        <div className="relative">
                                            <select
                                                value={editingReq.empresa_id || ""}
                                                onChange={(e) => {
                                                    setEditingReq({
                                                        ...editingReq,
                                                        empresa_id: Number(e.target.value),
                                                        sede_id: ""
                                                    });
                                                }}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-amber-400/50 focus:ring-4 ring-amber-400/5 focus:bg-white transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Seleccione empresa</option>
                                                {empresas.map(emp => (
                                                    <option key={emp.id} value={emp.id}>
                                                        {emp.nombre}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600/50">
                                                <ChevronDown size={18} />
                                            </div>
                                        </div>

                                        {/* SEDE */}
                                        <div className="relative">
                                            <select
                                                value={editingReq.sede_id || ""}
                                                onChange={(e) => {
                                                    setEditingReq({
                                                        ...editingReq,
                                                        sede_id: Number(e.target.value)
                                                    });
                                                }}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-amber-400/50 focus:ring-4 ring-amber-400/5 focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-50"
                                                disabled={!editingReq.empresa_id}
                                            >
                                                <option value="">Seleccione sede</option>
                                                {sedes.map(sed => (
                                                    <option key={sed.id} value={sed.id}>
                                                        {sed.nombre}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600/50">
                                                <ChevronDown size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* CLASIFICACIÓN */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                                            Clasificación
                                        </label>

                                        <div className="flex p-1.5 bg-slate-100/80 rounded-[1.5rem] border border-slate-200/50 h-[56px] items-center">
                                            {['Producto', 'Servicio'].map(t => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() =>
                                                        setEditingReq(prev => ({
                                                            ...prev,
                                                            tipo: t
                                                        }))
                                                    }
                                                    className={`flex-1 h-full rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${editingReq.tipo === t
                                                        ? 'bg-white text-[#800000] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-amber-200'
                                                        : 'text-slate-400 hover:text-slate-600'
                                                        }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* PRIORIDAD */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                                            Prioridad
                                        </label>

                                        <div className="relative">
                                            <select
                                                value={editingReq.prioridad}
                                                onChange={(e) => setEditingReq({ ...editingReq, prioridad: e.target.value })}
                                                className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold outline-none focus:border-amber-400/50 focus:ring-4 ring-amber-400/5 transition-all appearance-none ${editingReq.prioridad === 'Urgente'
                                                    ? 'text-red-600'
                                                    : 'text-slate-700'
                                                    }`}
                                            >
                                                <option>Baja</option>
                                                <option>Media</option>
                                                <option>Alta</option>
                                                <option>Urgente</option>
                                            </select>

                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600/50">
                                                <ChevronDown size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* DESTINO / CARRERA */}
                                    {puedeVerCarreras && (
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                                                Destino
                                            </label>

                                            {/* TIPO DESTINO */}
                                            <div className="flex p-1.5 bg-slate-100/80 rounded-[1.5rem] border border-slate-200/50 h-[56px] items-center">

                                                {[
                                                    'GENERAL',
                                                    'CARRERA',
                                                    'CURSO_CORTO'
                                                ].map(tipo => (
                                                    <button
                                                        key={tipo}
                                                        type="button"
                                                        onClick={() =>
                                                            setEditingReq(prev => ({
                                                                ...prev,
                                                                tipo_destino: tipo,

                                                                carrera_id:
                                                                    tipo === 'CARRERA'
                                                                        ? prev.carrera_id
                                                                        : null,

                                                                curso_corto:
                                                                    tipo === 'CURSO_CORTO'
                                                                        ? prev.curso_corto
                                                                        : null
                                                            }))
                                                        }
                                                        className={`flex-1 h-full rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${editingReq.tipo_destino === tipo
                                                            ? 'bg-white text-[#800000] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-amber-200'
                                                            : 'text-slate-400 hover:text-slate-600'
                                                            }`}
                                                    >
                                                        {tipo.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* SELECT CARRERA */}
                                            {editingReq.tipo_destino === 'CARRERA' && (
                                                <div className="relative">
                                                    <select
                                                        value={editingReq.carrera_id || ""}
                                                        onChange={(e) =>
                                                            setEditingReq({
                                                                ...editingReq,
                                                                carrera_id: Number(e.target.value),
                                                                curso_corto: null
                                                            })
                                                        }
                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-amber-400/50 focus:ring-4 ring-amber-400/5 focus:bg-white transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="">
                                                            Seleccione carrera
                                                        </option>

                                                        {carreras.map(c => (
                                                            <option
                                                                key={c.id}
                                                                value={c.id}
                                                            >
                                                                {c.nombre}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600/50">
                                                        <ChevronDown size={18} />
                                                    </div>
                                                </div>
                                            )}

                                            {/* INPUT CURSO CORTO */}
                                            {editingReq.tipo_destino === 'CURSO_CORTO' && (
                                                <input
                                                    type="text"
                                                    value={editingReq.curso_corto || ""}
                                                    onChange={(e) =>
                                                        setEditingReq({
                                                            ...editingReq,
                                                            curso_corto: e.target.value,
                                                            carrera_id: null
                                                        })
                                                    }
                                                    placeholder="Ej: Curso Corto de Preparación de Pizzas"
                                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-amber-400/50 focus:ring-4 ring-amber-400/5 focus:bg-white transition-all"
                                                />
                                            )}
                                        </div>
                                    )}

                                </div>

                                {/* SECCIÓN: LISTADO DE ÍTEMS CON BORDE DORADO */}
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center border-b border-amber-100 pb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-1.5 h-10 bg-gradient-to-b from-amber-400 to-[#800000] rounded-full"></div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em]">Detalle de Bienes</h4>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1">Especifique cantidades y unidades</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingReq({
                                                    ...editingReq,
                                                    items: [...editingReq.items,
                                                    {
                                                        tempId: Date.now(),
                                                        descripcion: '',
                                                        cantidad: 1,
                                                        unidad: 'Unidad'
                                                    }]
                                                })
                                            }
                                            className="group flex items-center gap-2 bg-gradient-to-r from-[#800000] to-[#a00000] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_10px_25px_-5px_rgba(128,0,0,0.4)] transition-all duration-300 border border-amber-400/20"
                                        >
                                            <Plus size={14} className="text-amber-400 group-hover:rotate-90 transition-transform duration-300" /> Añadir Ítem
                                        </button>
                                    </div>

                                    <div className="grid gap-5">
                                        {editingReq.items.map((it, idx) => (
                                            <div key={it.id || it.tempId} className="group grid grid-cols-12 gap-5 items-center bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-amber-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.1)] transition-all duration-500">

                                                <div className="col-span-12 md:col-span-6 space-y-2">
                                                    <label className="text-[9px] font-black text-amber-600/70 uppercase tracking-widest ml-1">Descripción del requerimiento</label>
                                                    <input
                                                        list={`productos-${idx}`}
                                                        value={it.descripcion || ""}
                                                        onChange={(e) => {
                                                            const newItems = [...editingReq.items];
                                                            newItems[idx].descripcion = e.target.value;
                                                            setEditingReq({ ...editingReq, items: newItems });
                                                        }}
                                                        placeholder="Escribe o selecciona..."
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 ring-amber-400/20 focus:bg-white focus:border-amber-200"
                                                    />

                                                    <datalist id={`productos-${idx}`}>
                                                        {ITEMS.map((item, i) => (
                                                            <option key={i} value={item} />
                                                        ))}
                                                    </datalist>
                                                </div>

                                                <div className="col-span-5 md:col-span-2 space-y-2">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Cantidad</label>
                                                    <input
                                                        required
                                                        type="number"
                                                        step="any"
                                                        min="0"
                                                        value={it.cantidad}
                                                        onChange={(e) => {
                                                            const newItems = [...editingReq.items];
                                                            newItems[idx].cantidad = parseFloat(e.target.value) || 1;
                                                            setEditingReq({ ...editingReq, items: newItems });
                                                        }}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 text-sm font-black text-slate-800 text-center outline-none focus:ring-2 ring-amber-400/20 focus:bg-white focus:border-amber-200"
                                                    />
                                                </div>

                                                <div className="col-span-5 md:col-span-3 space-y-2">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">U. Medida</label>
                                                    <div className="relative">
                                                        <select
                                                            value={it.unidad}
                                                            onChange={(e) => {
                                                                const newItems = [...editingReq.items];
                                                                newItems[idx].unidad = e.target.value;
                                                                setEditingReq({ ...editingReq, items: newItems });
                                                            }}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-black text-slate-700 outline-none focus:ring-2 ring-amber-400/20 focus:bg-white appearance-none"
                                                        >
                                                            <option>Unidad</option>
                                                            <option>Millar</option>
                                                            <option>Servicio</option>
                                                            <option>Metros</option>
                                                            <option>Cajas</option>
                                                            <option>Paquetes</option>
                                                            <option>Saco</option>
                                                            <option>Galón</option>
                                                            <option>Pares</option>
                                                            <option>KG</option>
                                                            <option>GR</option>
                                                            <option>LT</option>
                                                            <option>Latas</option>
                                                            <option>ML</option>
                                                        </select>
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600/40 pointer-events-none">
                                                            <ChevronDown size={14} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-span-2 md:col-span-1 flex justify-center pt-4 md:pt-6">
                                                    <button
                                                        type="button"
                                                        disabled={editingReq.items.length === 1}
                                                        onClick={() => setEditingReq({
                                                            ...editingReq,
                                                            items: editingReq.items.filter(item => (item.id || item.tempId) !== (it.id || it.tempId))
                                                        })}
                                                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all disabled:opacity-0"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* BOTONES DE ACCIÓN CON GRADIENTE PREMIUM */}
                            <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-5">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] hover:text-slate-800 rounded-2xl transition-all hover:bg-white border-2 border-transparent hover:border-slate-200"
                                >
                                    Cancelar Proceso
                                </button>

                                <button
                                    type="submit"
                                    className="flex-[2] bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/30 hover:shadow-amber-900/20 hover:bg-gradient-to-r hover:from-[#800000] hover:to-[#b8860b] transition-all duration-700 text-[11px] tracking-[0.3em] uppercase group active:scale-95"
                                >
                                    <Save size={18} className="group-hover:text-amber-400 transition-colors" /> Confirmar y Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* --- MODAL VISTA DETALLADA --- */}
            {viewingReq && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8 animate-in fade-in duration-500">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-6xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden max-h-[92vh] border border-amber-100/20">

                        {/* HEADER INSTITUCIONAL */}
                        <div className="bg-gradient-to-r from-[#800000] via-[#600000] to-[#400000] p-6 md:px-10 text-white flex justify-between items-center border-b-4 border-amber-500/30">
                            <div className="flex items-center gap-6">
                                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                                    <FileText size={28} className="text-amber-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">{viewingReq.codigo}</h3>
                                        <div className="scale-90 origin-left">
                                            <StatusBadge estado={viewingReq.estado} />
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-amber-200/60 uppercase tracking-[0.4em] mt-1">Expediente Logístico Digital</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingReq(null)}
                                className="p-3 hover:bg-white/10 rounded-full transition-all group active:scale-90"
                            >
                                <X size={24} className="text-white/70 group-hover:text-white" />
                            </button>
                        </div>

                        {/* CUERPO DEL DETALLE */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar bg-slate-50/30">

                            {/* GRID DE DATOS MAESTROS */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Solicitante', val: viewingReq.creador, sub: viewingReq.depto, icon: User },
                                    { label: 'Entidad', val: viewingReq.empresa, sub: viewingReq.sede, icon: Building2 },
                                    { label: 'Clasificación', val: viewingReq.tipo, sub: viewingReq.prioridad, icon: Layers, isPriority: true },
                                    { label: 'Fecha Registro', val: viewingReq.fecha, sub: 'Hora: --:--', icon: CalendarDays }
                                ].map((info, i) => (
                                    <div key={i} className="bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm flex items-start gap-4 hover:border-amber-200 transition-colors group">
                                        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-amber-50 transition-colors">
                                            <info.icon size={18} className="text-[#800000]" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">{info.label}</p>
                                            <p className="text-sm font-bold text-slate-800 leading-tight">{info.val}</p>
                                            <p className={`text-[10px] font-bold uppercase mt-1 ${info.isPriority && viewingReq.prioridad === 'Urgente' ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                                                {info.sub}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* SECCIÓN DE TABLA DE ÍTEMS */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 ml-2">
                                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <ShoppingCart size={16} className="text-amber-700" />
                                    </div>
                                    <h4 className="text-xs font-black uppercase text-slate-800 tracking-[0.2em]">Desglose de Cotización</h4>
                                    <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-200 to-transparent"></div>
                                </div>

                                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                                                    <th className="px-8 py-5">Descripción</th>
                                                    <th className="px-6 py-5 text-center">Cant.</th>
                                                    <th className="px-6 py-5">Precio</th>
                                                    <th className="px-6 py-5 text-right">Estado</th>
                                                </tr>
                                            </thead>

                                            <tbody className="text-xs divide-y divide-slate-100">
                                                {viewingReq.items?.map((it, idx) => (
                                                    <tr key={it.id} className="hover:bg-slate-50 transition-all">

                                                        {/* DESCRIPCIÓN */}
                                                        <td className="px-8 py-5 font-bold text-slate-700">
                                                            <span className="text-slate-300 font-mono text-[10px] mr-2">
                                                                {idx + 1}
                                                            </span>
                                                            {it.descripcion}
                                                        </td>

                                                        {/* CANTIDAD */}
                                                        <td className="px-6 py-5 text-center font-black text-slate-500">
                                                            {it.cantidad}{" "}
                                                            <span className="text-[10px] text-slate-400">
                                                                {it.unidad}
                                                            </span>
                                                        </td>

                                                        {/* PRECIO */}
                                                        <td className="px-6 py-5">
                                                            <span className="font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg">
                                                                S/ {(it.precio || 0).toLocaleString('es-PE', {
                                                                    minimumFractionDigits: 2
                                                                })}
                                                            </span>
                                                        </td>

                                                        <td className="px-6 py-5 text-right">
                                                            <div className="flex flex-col items-end gap-1">

                                                                {(() => {

                                                                    let estado = "PENDIENTE";
                                                                    let color = "bg-slate-100 text-slate-600";

                                                                    if (it.estado_administracion === "DENEGADO") {
                                                                        estado = "DENEGADO";
                                                                        color = "bg-rose-100 text-rose-700";
                                                                    }

                                                                    else if (it.estado_administracion === "OBSERVADO") {
                                                                        estado = "OBSERVADO";
                                                                        color = "bg-amber-100 text-amber-700";
                                                                    }

                                                                    else if (it.estado_tesoreria === "PAGADO") {
                                                                        estado = "PAGADO";
                                                                        color = "bg-emerald-100 text-emerald-700";
                                                                    }

                                                                    else if (it.flujo_estado === "TESORERIA") {
                                                                        estado = "EN TESORERÍA";
                                                                        color = "bg-cyan-100 text-cyan-700";
                                                                    }

                                                                    else if (
                                                                        it.flujo_estado === "ADMINISTRACION" ||
                                                                        it.estado_administracion === "APROBADO"
                                                                    ) {
                                                                        estado = "EN ADMINISTRACIÓN";
                                                                        color = "bg-violet-100 text-violet-700";
                                                                    }

                                                                    else if (
                                                                        it.flujo_estado === "LOGISTICA" &&
                                                                        it.estado_logistica === "ENVIADO"
                                                                    ) {
                                                                        estado = "EN LOGÍSTICA";
                                                                        color = "bg-blue-100 text-blue-700";
                                                                    }

                                                                    return (
                                                                        <>
                                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${color}`}>
                                                                                {estado}
                                                                            </span>

                                                                            {(it.comentario_estado &&
                                                                                ['OBSERVADO', 'DENEGADO'].includes(estado)) && (
                                                                                    <span className="text-[10px] text-slate-400 italic max-w-[180px] text-right leading-tight">
                                                                                        💬 {it.comentario_estado}
                                                                                    </span>
                                                                                )}
                                                                        </>
                                                                    );

                                                                })()}

                                                            </div>
                                                        </td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* OBSERVACIONES CON ESTILO DE NOTA */}
                            {viewingReq.comentarios && (
                                <div className="bg-amber-50/50 p-6 rounded-[2rem] border-2 border-dashed border-amber-200 flex items-start gap-5">
                                    <div className="bg-amber-100 p-3 rounded-2xl">
                                        <AlertCircle className="text-amber-700" size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-amber-800/60 uppercase tracking-[0.2em]">Nota de Administración</p>
                                        <p className="text-sm font-bold text-amber-900 leading-relaxed italic">"{viewingReq.comentarios}"</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* BOTONES DE ACCIÓN FLOTANTES */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center gap-4">
                            <div className="flex gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => generarPDF(viewingReq)}
                                    className="bg-[#800000] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase"
                                >
                                    Descargar PDF
                                </button>
                            </div>

                            {viewingReq.estado === 'Sin firmar' &&
                                currentUser.rol === 'jefe' &&
                                Number(currentUser.departamento_id) === Number(viewingReq.departamento_id) && (

                                    <button
                                        onClick={() => {
                                            cambiarEstado(viewingReq.id, 'Pendiente');
                                            setViewingReq(null);
                                        }}
                                        className="bg-white border border-amber-200 text-[#800000] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-amber-50 transition-all shadow-lg"
                                    >
                                        <ShieldCheck size={16} /> Firmar Requerimiento
                                    </button>
                                )}

                            <button
                                onClick={() => setViewingReq(null)}
                                className="w-full md:w-auto px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-all ml-auto rounded-2xl hover:bg-slate-200"
                            >
                                Regresar al Tablero
                            </button>
                        </div>
                    </div>
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

export default Requerimientos;