import React, { useState, useEffect, useMemo } from 'react';
import {
    Database, ShoppingCart, CheckCircle2, XCircle, Clock, Layers, Check,
    FileText, ShieldCheck, Truck, Plus, ChevronDown, CalendarDays, Calendar,
    Trash2, Save, Send, Edit3, Eye, UserCheck, User, Package,
    Building2, MessageSquare, AlertCircle, Search, ClipboardCheck,
    X, List, ArrowRight, ArrowUpDown, ArrowUp, ArrowDown, Filter,
    Paperclip
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
        "TIC",
        "VENTAS"
    ].includes(currentUser?.depto);

    // --- DATOS ---
    const [requerimientos, setRequerimientos] = useState([]);

    // --- FILTROS Y BÚSQUEDA ---
    const [searchCodigo, setSearchCodigo] = useState('');
    const [searchItem, setSearchItem] = useState('');
    const [fechaOrder, setFechaOrder] = useState('desc');
    const [pagadoFilter, setPagadoFilter] = useState('todos');

    // --- PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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
    const [openOptions, setOpenOptions] = useState({});
    const [tempFiles, setTempFiles] = useState({});

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
                setITEMS([]);
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
        doc.setDrawColor(r1, g1, b1);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, 190, 277);
        doc.setFillColor(r1, g1, b1);
        doc.rect(10, 10, 190, 15, 'F');
        doc.addImage(logo, 'PNG', 15, 12, 35, 10);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text("SISTEMA DE GESTIÓN DE CALIDAD", 105, 20, { align: "center" });
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(14);
        doc.text("SOLICITUD DE REQUERIMIENTO", 105, 35, { align: "center" });
        doc.setDrawColor(r2, g2, b2);
        doc.setLineWidth(1);
        doc.line(70, 38, 140, 38);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Solicitud N°:", 14, 48);
        doc.setFont("helvetica", "normal");
        doc.text(String(req.codigo || "S/N"), 40, 48);
        doc.setFont("helvetica", "bold");
        doc.text("Fecha:", 150, 48);
        doc.setFont("helvetica", "normal");
        doc.text(String(req.fecha || "-"), 165, 48);
        doc.setFillColor(245, 245, 245);
        doc.rect(14, 55, 182, 25, 'F');
        doc.setFont("helvetica", "bold");
        doc.setTextColor(r1, g1, b1);
        doc.text("1. INFORMACIÓN DEL SOLICITANTE", 18, 62);
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 40);
        doc.text("SOLICITANTE:", 18, 70);
        doc.setFont("helvetica", "normal");
        doc.text(String(req.creador || "-"), 45, 70);
        doc.setFont("helvetica", "bold");
        doc.text("ÁREA / DEPTO:", 18, 76);
        doc.setFont("helvetica", "normal");
        doc.text(String(req.depto || "-"), 45, 76);
        doc.setFont("helvetica", "bold");
        doc.text("EMPRESA:", 110, 70);
        doc.setFont("helvetica", "normal");
        doc.text(`${req.empresa || ""} - ${req.sede || ""}`, 135, 70);
        const rows = (req.items || []).map((it, i) => ([
            { content: i + 1, styles: { halign: 'center' } },
            it.descripcion || "",
            { content: it.cantidad || "0", styles: { halign: 'center', fontStyle: 'bold' } },
            { content: it.unidad || "", styles: { halign: 'center' } },
            it.observacion || '-'
        ]));
        autoTable(doc, {
            startY: 85,
            head: [["ÍTEM", "DESCRIPCIÓN DE BIENES / SERVICIOS", "CANT.", "U.M.", "OBSERVACIONES"]],
            body: rows,
            theme: 'grid',
            headStyles: { fillColor: [r1, g1, b1], textColor: [255, 255, 255] },
            styles: { fontSize: 8 }
        });
        let finalY = doc.lastAutoTable.finalY + 12;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);
        doc.text("PRIORIDAD:", 14, finalY);
        const prioridadTxt = String(req.prioridad || "NORMAL").toUpperCase();
        doc.setTextColor(prioridadTxt === 'ALTA' ? 200 : 40, 0, 0);
        doc.text(prioridadTxt, 40, finalY);
        finalY += 10;
        doc.setTextColor(40, 40, 40);
        doc.text("COMENTARIOS:", 14, finalY);
        doc.setFont("helvetica", "normal");
        const comments = doc.splitTextToSize(String(req.comentarios || "Sin comentarios."), 180);
        doc.text(comments, 14, finalY + 6);
        let firmaSolicitante = null;
        try {
            if (req.firma_solicitante) {
                firmaSolicitante = await getBase64FromUrl(API + req.firma_solicitante);
            }
        } catch (error) {
            console.error("Error cargando firma:", error);
        }
        const firmaY = 260;
        doc.setDrawColor(150, 150, 150);
        doc.line(14, firmaY, 70, firmaY);
        doc.line(140, firmaY, 196, firmaY);
        if (firmaSolicitante) {
            try {
                doc.addImage(firmaSolicitante, 'PNG', 20, firmaY - 18, 45, 15);
            } catch (e) {
                console.error("Error cargando firma solicitante");
            }
        }
        doc.setFontSize(8);
        doc.setTextColor(40, 40, 40);
        doc.text(String(req.creador || "SOLICITANTE"), 42, firmaY + 5, { align: "center" });
        doc.text("FIRMA SOLICITANTE", 42, firmaY + 10, { align: "center" });
        doc.text("AUTORIZADO POR", 168, firmaY + 10, { align: "center" });
        doc.save(`Requerimiento_${req.codigo || "001"}.pdf`);
    };

    const cambiarEstadoItem = async (itemId, estado, motivo = null) => {
        await fetch(API + "items.php", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: itemId, estado: estado, motivo: motivo })
        });
        await fetchReqs();
    };

    const removeTempFile = (idx) => {
        const newItems = [...editingReq.items];
        delete newItems[idx].archivo;
        delete newItems[idx].archivo_nombre;
        setEditingReq({ ...editingReq, items: newItems });
        if (tempFiles[idx]) {
            URL.revokeObjectURL(tempFiles[idx]);
            const newTempFiles = { ...tempFiles };
            delete newTempFiles[idx];
            setTempFiles(newTempFiles);
        }
    };

    const handleFileChange = (idx, file) => {
        const newItems = [...editingReq.items];
        newItems[idx].archivo = file;
        newItems[idx].archivo_nombre = file.name;
        setEditingReq({ ...editingReq, items: newItems });
        setTempFiles(prev => ({ ...prev, [idx]: URL.createObjectURL(file) }));
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

    const fetchReqs = async () => {
        try {
            const url = API + "requerimientos.php";
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            const data = await res.json();
            if (data && data.error === true) {
                console.error("Error de API:", data.message);
                setRequerimientos([]);
                return;
            }
            setRequerimientos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando requerimientos:", error);
            setRequerimientos([]);
        }
    };

    useEffect(() => {
        fetchReqs();
    }, []);

    useEffect(() => {
        fetch(API + "requerimientos.php?combo=1")
            .then(res => res.json())
            .then(data => setEmpresasSedes(data));
    }, []);

    // --- LÓGICA DE FILTRADO Y ORDENAMIENTO ---
    const filteredAndSortedReqs = useMemo(() => {
        let filtered = requerimientos.filter(req => {
            if (activeTab === 'general') return true;
            if (activeTab === 'mis') {
                return Number(req.departamento_id) === Number(currentUser?.departamento_id);
            }
            return true;
        });

        if (searchCodigo.trim() !== '') {
            filtered = filtered.filter(req =>
                req.codigo?.toLowerCase().includes(searchCodigo.toLowerCase())
            );
        }

        if (searchItem.trim() !== '') {
            const term = searchItem.toLowerCase();
            filtered = filtered.filter(req =>
                req.items?.some(item => item.descripcion?.toLowerCase().includes(term))
            );
        }

        if (pagadoFilter === 'pagado') {
            filtered = filtered.filter(req =>
                req.estado === 'Pagado' || req.estado === 'Finalizado'
            );
        } else if (pagadoFilter === 'no_pagado') {
            filtered = filtered.filter(req =>
                req.estado !== 'Pagado' && req.estado !== 'Finalizado'
            );
        }

        const sorted = [...filtered];
        sorted.sort((a, b) => {
            const dateA = new Date(a.fecha);
            const dateB = new Date(b.fecha);
            return fechaOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        return sorted;
    }, [requerimientos, activeTab, currentUser, searchCodigo, searchItem, pagadoFilter, fechaOrder]);

    // --- PAGINACIÓN ---
    useEffect(() => {
        setCurrentPage(1);
    }, [searchCodigo, searchItem, fechaOrder, pagadoFilter, activeTab, pageSize]);

    const paginatedReqs = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredAndSortedReqs.slice(start, end);
    }, [filteredAndSortedReqs, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredAndSortedReqs.length / pageSize);
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

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
            'Finalizado': 'bg-green-100 text-green-700 border-green-200',
        };
        return (
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide border ${styles[estado] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {estado}
            </span>
        );
    };

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
            if (!editingReq.empresa_id) return alert("Seleccione una empresa");
            if (!editingReq.sede_id) return alert("Seleccione una sede");
            if (!editingReq.items || editingReq.items.length === 0) return alert("Debe agregar al menos un ítem");
            if (editingReq.items.some(i => !i.descripcion.trim())) return alert("Todos los ítems deben tener descripción");

            // Guardar archivos temporalmente con su descripción para identificarlos después
            const archivosPendientes = [];
            const itemsCopy = editingReq.items.map((it, idx) => {
                const itemCopy = { ...it };
                if (it.archivo instanceof File) {
                    archivosPendientes.push({
                        idx: idx,
                        file: it.archivo,
                        descripcion: it.descripcion,
                        cantidad: it.cantidad,
                        unidad: it.unidad
                    });
                    delete itemCopy.archivo;
                    delete itemCopy.archivo_nombre;
                }
                return itemCopy;
            });

            const payload = {
                id: editingReq?.id || null,
                creador_id: currentUser.id,
                departamento_id: editingReq?.departamento_id || currentUser.departamento_id,
                empresa_id: editingReq.empresa_id,
                sede_id: editingReq.sede_id,
                prioridad: editingReq.prioridad || 'Media',
                tipo: editingReq.tipo || 'Producto',
                tipo_destino: editingReq.tipo_destino || 'GENERAL',
                carrera_id: editingReq.carrera_id || null,
                curso_corto: editingReq.curso_corto || null,
                items: itemsCopy.map((it, idx) => ({
                    ...it,
                    comentario_solicitante: it.comentario_solicitante || null,
                    archivo_idx: idx
                }))
            };

            const formData = new FormData();
            formData.append('data', JSON.stringify(payload));
            if (editingReq?.id) formData.append('_method', 'PUT');

            const res = await fetch(API + "requerimientos.php", { method: 'POST', body: formData });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.message || data.error || "Error al guardar");

            console.log("Respuesta del servidor:", data);

            const requerimientoId = data.id || editingReq?.id;

            // Obtener los IDs de los items desde la respuesta
            const itemIds = data.item_ids || [];

            console.log("IDs de items creados/actualizados:", itemIds);
            console.log("Archivos pendientes:", archivosPendientes);

            // Subir archivos usando los IDs devueltos
            if (archivosPendientes.length > 0) {
                for (let i = 0; i < archivosPendientes.length; i++) {
                    const pendiente = archivosPendientes[i];
                    // Usar el ID del item correspondiente por índice
                    const itemId = itemIds[i] || (editingReq?.items?.[pendiente.idx]?.id);

                    if (itemId) {
                        const formDataFile = new FormData();
                        formDataFile.append('archivo', pendiente.file);
                        formDataFile.append('item_id', itemId);

                        console.log(`Subiendo archivo para item ${itemId}: ${pendiente.file.name}`);

                        const uploadRes = await fetch(API + "subir_archivo.php", { method: 'POST', body: formDataFile });
                        const uploadData = await uploadRes.json();
                        console.log("Respuesta subida:", uploadData);

                        if (!uploadData.success) {
                            console.error(`Error subiendo archivo para item ${itemId}:`, uploadData.error);
                        }
                    } else {
                        console.error("No se encontró ID para el item con descripción:", pendiente.descripcion);
                    }
                }
            }

            await fetchReqs();
            setShowModal(false);
            setEditingReq(null);
            setTempFiles({});
            alert("Requerimiento guardado exitosamente");
        } catch (error) {
            console.error("Error guardando requerimiento:", error);
            alert(`Error al guardar requerimiento: ${error.message}`);
        }
    };

    // CAMBIAR ESTADO
    const cambiarEstado = async (id, nuevoEstado, extra = {}) => {
        try {
            await fetch(API + "requerimientos.php", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, estado: nuevoEstado, ...extra })
            });
            await fetchReqs();
        } catch (error) {
            console.error("Error cambiando estado:", error);
        }
    };

    // Eliminar archivo adjunto existente
    const eliminarArchivoAdjunto = async (itemId, idx) => {
        if (!itemId) return;
        try {
            const res = await fetch(API + "items.php", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: itemId })
            });
            const data = await res.json();
            if (data.success) {
                const newItems = [...editingReq.items];
                newItems[idx].archivo_adjunto = null;
                newItems[idx].archivo_nombre = null;
                setEditingReq({ ...editingReq, items: newItems });
                if (tempFiles[idx]) {
                    URL.revokeObjectURL(tempFiles[idx]);
                    const newTempFiles = { ...tempFiles };
                    delete newTempFiles[idx];
                    setTempFiles(newTempFiles);
                }
                alert("Archivo eliminado correctamente");
            } else {
                alert("Error al eliminar archivo");
            }
        } catch (error) {
            console.error("Error eliminando archivo:", error);
            alert("Error al eliminar archivo");
        }
    };

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
                                    items: [{
                                        tempId: Date.now(),
                                        descripcion: '',
                                        cantidad: 1,
                                        unidad: 'Unidad',
                                        comentario_solicitante: '',
                                        archivo: null,
                                        archivo_nombre: null,
                                        archivo_adjunto: null
                                    }]
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

                {/* TABS */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit mb-4">
                    <button
                        onClick={() => setActiveTab('mis')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'mis' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <FileText size={14} /> Mis Requerimientos
                    </button>
                    {puedeVerGeneral && (
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'general' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <ShoppingCart size={14} /> Cotización General
                        </button>
                    )}
                </div>

                {/* BARRA DE FILTROS */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Search size={12} /> Código Requerimiento</label>
                            <input type="text" placeholder="Ej: REQ-001" value={searchCodigo} onChange={(e) => setSearchCodigo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-300" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Package size={12} /> Descripción de Ítem</label>
                            <input type="text" placeholder="Buscar en productos/servicios..." value={searchItem} onChange={(e) => setSearchItem(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-300" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Filter size={12} /> Estado de Pago</label>
                            <select value={pagadoFilter} onChange={(e) => setPagadoFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/30">
                                <option value="todos">Todos</option>
                                <option value="pagado">Pagados / Finalizados</option>
                                <option value="no_pagado">No pagados</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><CalendarDays size={12} /> Orden por Fecha</label>
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
                        Mostrando {filteredAndSortedReqs.length} de {requerimientos.length} requerimientos
                    </div>
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
                                    {paginatedReqs.map((req) => {
                                        const actual = req?.flujo_global || 'LOGISTICA';
                                        const pasos = ['LOGISTICA', 'ADMINISTRACION', 'TESORERIA', 'FINALIZADO'];
                                        const orden = { LOGISTICA: 1, ADMINISTRACION: 2, TESORERIA: 3, FINALIZADO: 4 };
                                        return (
                                            <tr key={req?.id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900 leading-none">{req?.codigo || 'SIN CÓDIGO'}</span>
                                                        <span className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1"><Calendar size={10} /> {req?.fecha || '---'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-slate-700 leading-tight">{req?.usuario || req?.creador}</p>
                                                    <div className="flex items-center gap-1.5 mt-1"><Building2 size={11} className="text-slate-400" /><span className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">{req?.empresa} <span className="text-slate-300">•</span> {req?.sede}</span></div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center gap-1.5">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${req?.tipo === 'Producto' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                                                            {req?.tipo || '---'}
                                                        </span>
                                                        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1"><Package size={12} /> {(req?.items || []).length} ítems</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="min-w-[140px]">
                                                        <StatusBadge estado={req?.estado} />
                                                        <div className="flex items-center gap-0 mt-3">
                                                            {pasos.map((step, idx) => {
                                                                const activo = orden[step] <= orden[actual];
                                                                const esUltimo = idx === pasos.length - 1;
                                                                return (
                                                                    <div key={step} className="flex items-center group/step relative">
                                                                        <div className={`h-2.5 w-2.5 rounded-full z-10 border-2 transition-colors ${activo ? 'bg-emerald-500 border-emerald-200' : 'bg-slate-200 border-white'}`} />
                                                                        {!esUltimo && <div className={`h-[2px] w-8 -mx-0.5 ${activo ? 'bg-emerald-400' : 'bg-slate-100'}`} />}
                                                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 group-hover/step:scale-100 transition-transform bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded pointer-events-none uppercase">{step}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => setViewingReq(req)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver detalle"><Eye size={18} /></button>
                                                        {canEdit(req) && (
                                                            <button onClick={() => {
                                                                const itemsConArchivos = (req.items || []).map(item => ({ ...item, archivo_nombre: item.archivo_adjunto ? item.archivo_adjunto.split('/').pop() : null, archivo: null, comentario_solicitante: item.comentario_solicitante || '' }));
                                                                setEditingReq({ ...req, items: itemsConArchivos });
                                                                setShowModal(true);
                                                            }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Editar"><Edit3 size={18} /></button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {filteredAndSortedReqs.length === 0 && (
                            <div className="text-center py-12 text-slate-400 text-sm font-medium">No se encontraron requerimientos con los filtros aplicados.</div>
                        )}

                        {/* PAGINACIÓN */}
                        {filteredAndSortedReqs.length > 0 && (
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
                                    Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredAndSortedReqs.length)} de {filteredAndSortedReqs.length} requerimientos
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
                )}
            </div>

            {/* --- MODAL CREACIÓN / EDICIÓN --- (sin cambios estructurales) */}
            {showModal && editingReq && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-6xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden max-h-[92vh] border border-amber-100/50">
                        <div className="relative bg-white px-8 py-7 border-b border-slate-100 flex justify-between items-center">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#800000] to-[#5a0000] rounded-2xl flex items-center justify-center shadow-xl shadow-red-900/20 rotate-3 border-2 border-amber-400/30">
                                    <Save className="text-amber-400 -rotate-3" size={26} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{editingReq?.id ? 'Editar' : 'Nuevo'} <span className="text-[#800000]">Requerimiento</span></h3>
                                    <div className="flex items-center gap-2 mt-2"><span className="h-[1px] w-4 bg-amber-400"></span><p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Logística de Excelencia</p></div>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="group p-2.5 bg-slate-50 hover:bg-amber-50 rounded-full transition-all duration-300 border border-slate-100 hover:border-amber-200"><X size={20} className="text-slate-400 group-hover:text-amber-600 transition-colors" /></button>
                        </div>
                        <form onSubmit={handleSaveReq} className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="group space-y-3">
                                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>Empresa / Sede</label>
                                        <div className="relative">
                                            <select value={editingReq.empresa_id || ""} onChange={(e) => setEditingReq({ ...editingReq, empresa_id: Number(e.target.value), sede_id: "" })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-amber-400/50 focus:ring-4 ring-amber-400/5 focus:bg-white transition-all appearance-none cursor-pointer">
                                                <option value="">Seleccione empresa</option>
                                                {empresas.map(emp => (<option key={emp.id} value={emp.id}>{emp.nombre}</option>))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600/50"><ChevronDown size={18} /></div>
                                        </div>
                                        <div className="relative">
                                            <select value={editingReq.sede_id || ""} onChange={(e) => setEditingReq({ ...editingReq, sede_id: Number(e.target.value) })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-amber-400/50 focus:ring-4 ring-amber-400/5 focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-50" disabled={!editingReq.empresa_id}>
                                                <option value="">Seleccione sede</option>
                                                {sedes.map(sed => (<option key={sed.id} value={sed.id}>{sed.nombre}</option>))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600/50"><ChevronDown size={18} /></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>Clasificación</label>
                                        <div className="flex p-1.5 bg-slate-100/80 rounded-[1.5rem] border border-slate-200/50 h-[56px] items-center">
                                            {['Producto', 'Servicio'].map(t => (
                                                <button key={t} type="button" onClick={() => setEditingReq(prev => ({ ...prev, tipo: t }))} className={`flex-1 h-full rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${editingReq.tipo === t ? 'bg-white text-[#800000] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-amber-200' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>Prioridad</label>
                                        <div className="relative">
                                            <select value={editingReq.prioridad} onChange={(e) => setEditingReq({ ...editingReq, prioridad: e.target.value })} className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold outline-none focus:border-amber-400/50 focus:ring-4 ring-amber-400/5 transition-all appearance-none ${editingReq.prioridad === 'Urgente' ? 'text-red-600' : 'text-slate-700'}`}>
                                                <option>Baja</option><option>Media</option><option>Alta</option><option>Urgente</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600/50"><ChevronDown size={18} /></div>
                                        </div>
                                    </div>
                                    {puedeVerCarreras && (
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>Destino</label>
                                            <div className="flex p-1.5 bg-slate-100/80 rounded-[1.5rem] border border-slate-200/50 h-[56px] items-center">
                                                {['GENERAL', 'CARRERA', 'CURSO_CORTO'].map(tipo => (
                                                    <button key={tipo} type="button" onClick={() => setEditingReq(prev => ({ ...prev, tipo_destino: tipo, carrera_id: tipo === 'CARRERA' ? prev.carrera_id : null, curso_corto: tipo === 'CURSO_CORTO' ? prev.curso_corto : null }))} className={`flex-1 h-full rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${editingReq.tipo_destino === tipo ? 'bg-white text-[#800000] shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-amber-200' : 'text-slate-400 hover:text-slate-600'}`}>{tipo.replace('_', ' ')}</button>
                                                ))}
                                            </div>
                                            {editingReq.tipo_destino === 'CARRERA' && (
                                                <div className="relative">
                                                    <select value={editingReq.carrera_id || ""} onChange={(e) => setEditingReq({ ...editingReq, carrera_id: Number(e.target.value), curso_corto: null })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-amber-400/50 focus:ring-4 ring-amber-400/5 focus:bg-white transition-all appearance-none cursor-pointer">
                                                        <option value="">Seleccione carrera</option>
                                                        {carreras.map(c => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-600/50"><ChevronDown size={18} /></div>
                                                </div>
                                            )}
                                            {editingReq.tipo_destino === 'CURSO_CORTO' && (
                                                <input type="text" value={editingReq.curso_corto || ""} onChange={(e) => setEditingReq({ ...editingReq, curso_corto: e.target.value, carrera_id: null })} placeholder="Ej: Curso Corto de Preparación de Pizzas" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-amber-400/50 focus:ring-4 ring-amber-400/5 focus:bg-white transition-all" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center border-b border-amber-100 pb-6">
                                        <div className="flex items-center gap-4"><div className="w-1.5 h-10 bg-gradient-to-b from-amber-400 to-[#800000] rounded-full"></div><div><h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em]">Detalle de Bienes</h4><p className="text-[10px] font-bold text-slate-400 mt-1">Especifique cantidades, unidades y adjuntos</p></div></div>
                                        <button type="button" onClick={() => setEditingReq({ ...editingReq, items: [...editingReq.items, { tempId: Date.now(), descripcion: '', cantidad: 1, unidad: 'Unidad', comentario_solicitante: '', archivo: null, archivo_nombre: null }] })} className="group flex items-center gap-2 bg-gradient-to-r from-[#800000] to-[#a00000] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_10px_25px_-5px_rgba(128,0,0,0.4)] transition-all duration-300 border border-amber-400/20"><Plus size={14} className="text-amber-400 group-hover:rotate-90 transition-transform duration-300" /> Añadir Ítem</button>
                                    </div>
                                    <div className="grid gap-5">
                                        {editingReq.items.map((it, idx) => {
                                            const isOpen = !!openOptions[idx];
                                            const toggleOptions = () => setOpenOptions(prev => ({ ...prev, [idx]: !prev[idx] }));
                                            return (
                                                <div key={it.id || it.tempId} className="group flex flex-col bg-white p-5 rounded-2xl border border-slate-150 hover:border-amber-200/60 shadow-xs hover:shadow-[0_15px_30px_-10px_rgba(245,158,11,0.08)] transition-all duration-300 gap-4">
                                                    <div className="grid grid-cols-12 gap-4 items-end">
                                                        <div className="col-span-12 md:col-span-5 space-y-1.5">
                                                            <label className="text-[9px] font-black text-amber-600/70 uppercase tracking-widest ml-1">Descripción del requerimiento *</label>
                                                            <input list={`productos-${idx}`} value={it.descripcion || ""} onChange={(e) => { const newItems = [...editingReq.items]; newItems[idx].descripcion = e.target.value; setEditingReq({ ...editingReq, items: newItems }); }} placeholder="Escribe o selecciona..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 ring-amber-400/20 focus:bg-white focus:border-amber-200 transition-all" required />
                                                            <datalist id={`productos-${idx}`}>{ITEMS.map((item, i) => (<option key={i} value={item} />))}</datalist>
                                                        </div>
                                                        <div className="col-span-4 md:col-span-2 space-y-1.5">
                                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center block">Cantidad *</label>
                                                            <input required type="number" step="any" min="0" value={it.cantidad} onChange={(e) => { const newItems = [...editingReq.items]; newItems[idx].cantidad = parseFloat(e.target.value) || 1; setEditingReq({ ...editingReq, items: newItems }); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-sm font-black text-slate-800 text-center outline-none focus:ring-2 ring-amber-400/20 focus:bg-white focus:border-amber-200 transition-all" />
                                                        </div>
                                                        <div className="col-span-5 md:col-span-3 space-y-1.5">
                                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">U. Medida *</label>
                                                            <div className="relative">
                                                                <select value={it.unidad} onChange={(e) => { const newItems = [...editingReq.items]; newItems[idx].unidad = e.target.value; setEditingReq({ ...editingReq, items: newItems }); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black text-slate-700 outline-none focus:ring-2 ring-amber-400/20 focus:bg-white appearance-none transition-all">
                                                                    <option>Unidad</option><option>Millar</option><option>Servicio</option><option>Metros</option><option>Cajas</option><option>Paquetes</option><option>Envases</option><option>Saco</option><option>Galón</option><option>Pares</option><option>KG</option><option>GR</option><option>LT</option><option>Botella</option><option>Blister</option><option>Latas</option><option>ML</option>
                                                                </select>
                                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><ChevronDown size={14} /></div>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-1">
                                                            <button type="button" onClick={toggleOptions} className={`p-2.5 rounded-xl transition-all flex items-center gap-1 text-xs font-bold ${isOpen || it.comentario_solicitante || it.archivo_nombre ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`} title="Agregar comentarios o archivos"><Paperclip size={15} className={it.archivo_nombre ? "animate-pulse" : ""} /><span className="hidden lg:inline">{isOpen ? "Menos" : "Más"}</span></button>
                                                            <button type="button" disabled={editingReq.items.length === 1} onClick={() => { const newItems = editingReq.items.filter(item => (item.id || item.tempId) !== (it.id || it.tempId)); setEditingReq({ ...editingReq, items: newItems }); if (tempFiles[idx]) { URL.revokeObjectURL(tempFiles[idx]); const newTempFiles = { ...tempFiles }; delete newTempFiles[idx]; setTempFiles(newTempFiles); } }} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-0" title="Eliminar ítem"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-dashed border-slate-100 transition-all duration-300 ${isOpen ? "block opacity-100" : "hidden opacity-0"}`}>
                                                        <div className="space-y-1.5"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><MessageSquare size={10} /> Comentario (Opcional)</label><textarea value={it.comentario_solicitante || ""} onChange={(e) => { const newItems = [...editingReq.items]; newItems[idx].comentario_solicitante = e.target.value; setEditingReq({ ...editingReq, items: newItems }); }} placeholder="Especificaciones, marca, modelo, etc..." rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 ring-amber-400/20 focus:bg-white focus:border-amber-200 resize-none transition-all" /></div>
                                                        <div className="space-y-1.5"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><FileText size={10} /> Adjuntar archivo (Opcional)</label><div className="flex flex-col gap-2"><div className="flex items-center gap-2 flex-wrap"><label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"><Plus size={13} /> Seleccionar<input type="file" className="hidden" accept="image/*,.pdf,.doc,.docx,.xlsx,.txt" onChange={(e) => { if (e.target.files && e.target.files[0]) handleFileChange(idx, e.target.files[0]); }} /></label><span className="text-[9px] text-slate-400">JPG, PNG, PDF, DOC (Máx 5MB)</span></div>{(it.archivo_nombre || it.archivo_adjunto) && (<div className="flex items-center justify-between bg-amber-50/70 border border-amber-100 rounded-xl px-3 py-1.5"><div className="flex items-center gap-2 min-w-0">{tempFiles[idx] ? <img src={tempFiles[idx]} alt="Preview" className="w-7 h-7 object-cover rounded-md flex-shrink-0" /> : it.archivo_adjunto ? (it.archivo_adjunto.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? <img src={`${API}${it.archivo_adjunto}`} alt="Archivo existente" className="w-7 h-7 object-cover rounded-md flex-shrink-0" /> : <FileText size={14} className="text-amber-600 flex-shrink-0" />) : <FileText size={14} className="text-amber-600 flex-shrink-0" />}<span className="text-xs text-slate-600 truncate max-w-[180px]">{it.archivo_nombre || (it.archivo_adjunto?.split('/').pop())}</span></div><div className="flex gap-1">{it.archivo_adjunto && !tempFiles[idx] && (<a href={`${API}${it.archivo_adjunto}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 p-1 transition-colors" title="Ver archivo"><Eye size={13} /></a>)}<button type="button" onClick={() => { if (it.id && it.archivo_adjunto) eliminarArchivoAdjunto(it.id, idx); else if (tempFiles[idx]) removeTempFile(idx); }} className="text-red-400 hover:text-red-600 p-1 transition-colors" title="Eliminar archivo"><Trash2 size={13} /></button></div></div>)}</div></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-5">
                                <button type="button" onClick={() => { setShowModal(false); setTempFiles({}); }} className="flex-1 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] hover:text-slate-800 rounded-2xl transition-all hover:bg-white border-2 border-transparent hover:border-slate-200">Cancelar Proceso</button>
                                <button type="submit" className="flex-[2] bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/30 hover:shadow-amber-900/20 hover:bg-gradient-to-r hover:from-[#800000] hover:to-[#b8860b] transition-all duration-700 text-[11px] tracking-[0.3em] uppercase group active:scale-95"><Save size={18} className="group-hover:text-amber-400 transition-colors" /> Confirmar y Enviar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL VISTA DETALLADA --- (sin cambios) */}
            {viewingReq && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8 animate-in fade-in duration-500">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-6xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden max-h-[92vh] border border-amber-100/20">
                        <div className="bg-gradient-to-r from-[#800000] via-[#600000] to-[#400000] p-6 md:px-10 text-white flex justify-between items-center border-b-4 border-amber-500/30">
                            <div className="flex items-center gap-6"><div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner"><FileText size={28} className="text-amber-400" /></div><div><div className="flex items-center gap-3"><h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">{viewingReq.codigo}</h3><div className="scale-90 origin-left"><StatusBadge estado={viewingReq.estado} /></div></div><p className="text-[10px] font-bold text-amber-200/60 uppercase tracking-[0.4em] mt-1">Expediente Logístico Digital</p></div></div>
                            <button onClick={() => setViewingReq(null)} className="p-3 hover:bg-white/10 rounded-full transition-all group active:scale-90"><X size={24} className="text-white/70 group-hover:text-white" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar bg-slate-50/30">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Solicitante', val: viewingReq.creador, sub: viewingReq.depto, icon: User },
                                    { label: 'Entidad', val: viewingReq.empresa, sub: viewingReq.sede, icon: Building2 },
                                    { label: 'Clasificación', val: viewingReq.tipo, sub: viewingReq.prioridad, icon: Layers, isPriority: true },
                                    { label: 'Fecha Registro', val: viewingReq.fecha, sub: 'Hora: --:--', icon: CalendarDays }
                                ].map((info, i) => (
                                    <div key={i} className="bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm flex items-start gap-4 hover:border-amber-200 transition-colors group">
                                        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-amber-50 transition-colors"><info.icon size={18} className="text-[#800000]" /></div>
                                        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">{info.label}</p><p className="text-sm font-bold text-slate-800 leading-tight">{info.val}</p><p className={`text-[10px] font-bold uppercase mt-1 ${info.isPriority && viewingReq.prioridad === 'Urgente' ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>{info.sub}</p></div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 ml-2"><div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center"><ShoppingCart size={16} className="text-amber-700" /></div><h4 className="text-xs font-black uppercase text-slate-800 tracking-[0.2em]">Desglose de Cotización</h4><div className="flex-1 h-[1px] bg-gradient-to-r from-slate-200 to-transparent"></div></div>
                                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead><tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest"><th className="px-8 py-5">Descripción</th><th className="px-6 py-5 text-center">Cant.</th><th className="px-6 py-5">Comentario</th><th className="px-6 py-5">Adjunto</th><th className="px-6 py-5 text-right">Estado</th></tr></thead>
                                            <tbody className="text-xs divide-y divide-slate-100">
                                                {viewingReq.items?.map((it, idx) => (
                                                    <tr key={it.id} className="hover:bg-slate-50 transition-all">
                                                        <td className="px-8 py-5 font-bold text-slate-700"><span className="text-slate-300 font-mono text-[10px] mr-2">{idx + 1}</span>{it.descripcion}<div className="text-[10px] text-slate-400 mt-1">{it.cantidad} {it.unidad}</div></td>
                                                        <td className="px-6 py-5 text-center font-black text-slate-500">{it.cantidad}</td>
                                                        <td className="px-6 py-5">{it.comentario_solicitante ? (<div className="max-w-[200px]"><div className="bg-amber-50 border-l-2 border-amber-400 p-2 rounded-r-lg"><p className="text-[10px] font-medium text-amber-800 italic">"{it.comentario_solicitante}"</p></div></div>) : (<span className="text-[10px] text-slate-300 italic">Sin comentarios</span>)}</td>
                                                        <td className="px-6 py-5">{it.archivo_adjunto ? (<a href={`${API}${it.archivo_adjunto}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-amber-100 rounded-lg transition-colors group">{it.archivo_adjunto.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? <img src={`${API}${it.archivo_adjunto}`} alt="adjunto" className="w-8 h-8 object-cover rounded" /> : <FileText size={14} className="text-slate-500 group-hover:text-amber-600" />}<span className="text-[10px] font-medium text-slate-600 group-hover:text-amber-700 truncate max-w-[100px]">{it.archivo_adjunto.split('/').pop()}</span></a>) : (<span className="text-[10px] text-slate-300 italic">Sin adjunto</span>)}</td>
                                                        <td className="px-6 py-5 text-right"><div className="flex flex-col items-end gap-1">{(() => { let estado = "PENDIENTE"; let color = "bg-slate-100 text-slate-600"; if (it.estado_administracion === "DENEGADO") { estado = "DENEGADO"; color = "bg-rose-100 text-rose-700"; } else if (it.estado_administracion === "OBSERVADO") { estado = "OBSERVADO"; color = "bg-amber-100 text-amber-700"; } else if (it.estado_tesoreria === "PAGADO") { estado = "PAGADO"; color = "bg-emerald-100 text-emerald-700"; } else if (it.flujo_estado === "TESORERIA") { estado = "EN TESORERÍA"; color = "bg-cyan-100 text-cyan-700"; } else if (it.flujo_estado === "ADMINISTRACION" || it.estado_administracion === "APROBADO") { estado = "EN ADMINISTRACIÓN"; color = "bg-violet-100 text-violet-700"; } else if (it.flujo_estado === "LOGISTICA" && it.estado_logistica === "ENVIADO") { estado = "EN LOGÍSTICA"; color = "bg-blue-100 text-blue-700"; } return (<><span className={`px-3 py-1 rounded-full text-[10px] font-bold ${color}`}>{estado}</span>{(it.comentario_estado && ['OBSERVADO', 'DENEGADO'].includes(estado)) && (<span className="text-[10px] text-slate-400 italic max-w-[180px] text-right leading-tight">💬 {it.comentario_estado}</span>)}</>); })()}</div></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {viewingReq.comentarios && (
                                <div className="bg-amber-50/50 p-6 rounded-[2rem] border-2 border-dashed border-amber-200 flex items-start gap-5"><div className="bg-amber-100 p-3 rounded-2xl"><AlertCircle className="text-amber-700" size={24} /></div><div className="space-y-1"><p className="text-[10px] font-black text-amber-800/60 uppercase tracking-[0.2em]">Nota de Administración</p><p className="text-sm font-bold text-amber-900 leading-relaxed italic">"{viewingReq.comentarios}"</p></div></div>
                            )}
                        </div>
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center gap-4">
                            <div className="flex gap-3 w-full md:w-auto"><button onClick={() => generarPDF(viewingReq)} className="bg-[#800000] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase">Descargar PDF</button></div>
                            {viewingReq.estado === 'Sin firmar' && currentUser.rol === 'jefe' && Number(currentUser.departamento_id) === Number(viewingReq.departamento_id) && (<button onClick={() => { cambiarEstado(viewingReq.id, 'Pendiente'); setViewingReq(null); }} className="bg-white border border-amber-200 text-[#800000] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-amber-50 transition-all shadow-lg"><ShieldCheck size={16} /> Firmar Requerimiento</button>)}
                            <button onClick={() => setViewingReq(null)} className="w-full md:w-auto px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-all ml-auto rounded-2xl hover:bg-slate-200">Regresar al Tablero</button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; }.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }.custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #800000; }`}</style>
        </div>
    );
};

export default Requerimientos;