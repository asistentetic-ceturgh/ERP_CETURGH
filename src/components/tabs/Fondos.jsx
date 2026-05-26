import React, { useState, useEffect, useMemo } from 'react';
import {
    Coins, RefreshCw, FileText, Users, Plus, Inbox, Eye, Pencil, Trash2, X,
    DollarSign, Calendar, Info, AlertTriangle, Check, UploadCloud, Search,
    ArrowUp, ArrowDown, Filter, Building2, ChevronDown
} from 'lucide-react';
import { API_BASE } from "../../config/api";

const API = API_BASE;
const FONDO_ASIGNADO = 10000;

const Fondos = ({ user }) => {
    const currentUser = user || null;
    const currentUserId = currentUser?.id || null;
    const currentRole = (currentUser?.tipo || "").toLowerCase().trim();
    const currentDeptNombre = (currentUser?.departamento || "").toUpperCase().trim();
    const deptNombre = currentDeptNombre;

    // ===================== FILTROS Y BÚSQUEDA =====================
    const [searchText, setSearchText] = useState('');
    const [fechaOrder, setFechaOrder] = useState('desc');
    const [pagadoFilter, setPagadoFilter] = useState('todos');

    // ===================== DATOS DINÁMICOS (Empresas y Sedes) =====================
    const [empresas, setEmpresas] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [loadingEmpresas, setLoadingEmpresas] = useState(true);
    const [loadingSedes, setLoadingSedes] = useState(false);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
    const [sedeSeleccionada, setSedeSeleccionada] = useState("");

    // ===================== ESTADOS ORIGINALES =====================
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("mis");
    const [gastosEnviado, setGastosEnviado] = useState(false);
    const [showVerGastosModal, setShowVerGastosModal] = useState(false);
    const [archivosRendicion, setArchivosRendicion] = useState([]);
    const [rendiciones, setRendiciones] = useState([]);
    const [archivosTesoreria, setArchivosTesoreria] = useState([]);

    // Pagos
    const [showPagoModal, setShowPagoModal] = useState(false);
    const [archivoPago, setArchivoPago] = useState(null);
    const [showCerrarModal, setShowCerrarModal] = useState(false);
    const [archivoCierre, setArchivoCierre] = useState(null);

    // Gastos detallados
    const [gastos, setGastos] = useState([]);
    const [showGastoModal, setShowGastoModal] = useState(false);
    const [editandoGasto, setEditandoGasto] = useState(null);
    const [gastoForm, setGastoForm] = useState({
        fecha: new Date().toISOString().slice(0, 10),
        proveedor: "",
        tipo_comprobante: "",
        numero_comprobante: "",
        descripcion: "",
        monto: "",
        archivo: null
    });

    // Modales de solicitud
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingReq, setEditingReq] = useState(null);
    const [viewingReq, setViewingReq] = useState(null);
    const [formError, setFormError] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    // ===================== CARGAR EMPRESAS Y SEDES =====================
    useEffect(() => {
        fetch(API + "empresas.php")
            .then(res => res.json())
            .then(data => {
                const empresasArray = Array.isArray(data) ? data : (data.data || []);
                setEmpresas(empresasArray);
            })
            .catch(err => {
                console.error("Error cargando empresas:", err);
                setEmpresas([]);
            })
            .finally(() => setLoadingEmpresas(false));
    }, []);

    useEffect(() => {
        if (!empresaSeleccionada) {
            setSedes([]);
            return;
        }
        setLoadingSedes(true);
        fetch(API + `sedes.php?empresa_id=${empresaSeleccionada}`)
            .then(res => res.json())
            .then(data => {
                const sedesArray = Array.isArray(data) ? data : (data.data || []);
                setSedes(sedesArray);
            })
            .catch(err => {
                console.error("Error cargando sedes:", err);
                setSedes([]);
            })
            .finally(() => setLoadingSedes(false));
    }, [empresaSeleccionada]);

    // ===================== PERMISOS =====================
    const esTIC = deptNombre === "TIC";
    const esAdministracion = deptNombre.includes("ADMIN");
    const esTesoreria = deptNombre === "TESORERIA";
    const esJefe = currentRole === "jefe";
    const puedeVerGeneral = ["LOGISTICA", "ADMINISTRACION", "TIC", "TESORERIA"].includes(deptNombre);
    const puedeAprobar = esTIC || (esAdministracion && esJefe);
    const puedePagar = esTIC || esTesoreria;
    const puedeFirmar = viewingReq && Number(currentUserId) === Number(viewingReq.solicitante_id) && esJefe;

    // ===================== API CALLS =====================
    const obtenerSolicitudes = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}listar_solicitudes.php`);
            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error("La API no devolvió un array:", data);
                alert("Error al cargar solicitudes: " + (data.message || "Formato inválido"));
                setRegistros([]);
                return;
            }
            setRegistros(data);
        } catch (error) {
            console.error(error);
            setRegistros([]);
            alert("Error de conexión al cargar solicitudes");
        } finally { 
            setLoading(false); 
        }
    };

    const obtenerGastos = async (solicitudId) => {
        try {
            const res = await fetch(`${API}gastos.php?solicitud_id=${solicitudId}`);
            const data = await res.json();
            if (data.success) setGastos(data.gastos);
        } catch (err) { console.error(err); }
    };

    const obtenerArchivosSolicitud = async (id) => {
        try {
            const res = await fetch(`${API}listar_archivos_solicitud.php?id=${id}`);
            const data = await res.json();
            if (!data.success) return;
            const rend = data.archivos.filter(a => a.tipo === "RENDICION");
            const tes = data.archivos.filter(a => ["DEVOLUCION", "REEMBOLSO", "PAGO_TESORERIA"].includes(a.tipo));
            setRendiciones(rend);
            setArchivosTesoreria(tes);
        } catch (err) { console.error(err); }
    };

    const obtenerRendiciones = async (solicitudId) => {
        try {
            const res = await fetch(`${API}listar_rendiciones.php?solicitud_id=${solicitudId}`);
            const data = await res.json();
            setRendiciones(data);
        } catch (err) { console.error(err); }
    };

    // CRUD Gastos
    const agregarGasto = async () => {
        if (!gastoForm.descripcion || !gastoForm.monto || gastoForm.monto <= 0) {
            alert("Complete descripción y monto válido");
            return;
        }
        const formData = new FormData();
        formData.append("solicitud_id", viewingReq.id);
        formData.append("fecha", gastoForm.fecha);
        formData.append("proveedor", gastoForm.proveedor || "");
        formData.append("tipo_comprobante", gastoForm.tipo_comprobante || "");
        formData.append("numero_comprobante", gastoForm.numero_comprobante || "");
        formData.append("descripcion", gastoForm.descripcion);
        formData.append("monto", gastoForm.monto);
        formData.append("usuario_id", currentUserId);
        if (gastoForm.archivo) formData.append("archivo", gastoForm.archivo);
        try {
            const res = await fetch(`${API}gastos.php`, { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) {
                await obtenerGastos(viewingReq.id);
                setShowGastoModal(false);
                limpiarFormGasto();
            } else alert(data.message);
        } catch (error) { alert("Error al guardar el gasto"); }
    };

    const actualizarGasto = async () => {
        if (!editandoGasto) return;
        const payload = {
            id: editandoGasto.id,
            fecha: gastoForm.fecha,
            proveedor: gastoForm.proveedor || "",
            tipo_comprobante: gastoForm.tipo_comprobante || "",
            numero_comprobante: gastoForm.numero_comprobante || "",
            descripcion: gastoForm.descripcion,
            monto: parseFloat(gastoForm.monto)
        };
        try {
            const res = await fetch(`${API}gastos.php`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            const data = await res.json();
            if (data.success) {
                await obtenerGastos(viewingReq.id);
                setShowGastoModal(false);
                limpiarFormGasto();
            } else alert(data.message);
        } catch (error) { alert("Error al actualizar el gasto"); }
    };

    const eliminarGasto = async (id) => {
        if (!confirm("¿Eliminar este gasto?")) return;
        const res = await fetch(`${API}gastos.php?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) await obtenerGastos(viewingReq.id);
        else alert(data.message);
    };

    const enviarRendicionATesoreria = async () => {
        if (!viewingReq?.id) return alert("Solicitud inválida");
        if (gastos.length === 0) return alert("Debe registrar al menos un gasto antes de enviar");
        const confirmar = confirm("¿Está seguro que desea enviar la rendición a tesorería? Ya no podrá modificar los gastos.");
        if (!confirmar) return;
        try {
            const res = await fetch(`${API}flujo_fondos.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accion: "ENVIAR_RENDICION", solicitud_id: viewingReq.id, usuario_id: currentUserId })
            });
            const data = await res.json();
            if (!data.success) { alert(data.message); return; }
            alert(data.message);
            setGastosEnviado(true);
            await obtenerSolicitudes();
            setViewingReq(prev => ({ ...prev, estado: data.estado }));
        } catch (error) { alert("Error al enviar rendición"); }
    };

    const limpiarFormGasto = () => {
        setEditandoGasto(null);
        setGastoForm({
            fecha: new Date().toISOString().slice(0, 10),
            proveedor: "",
            tipo_comprobante: "",
            numero_comprobante: "",
            descripcion: "",
            monto: "",
            archivo: null
        });
    };

    const abrirModalNuevoGasto = () => { limpiarFormGasto(); setShowGastoModal(true); };
    const abrirModalEditarGasto = (gasto) => {
        setEditandoGasto(gasto);
        setGastoForm({
            fecha: gasto.fecha.slice(0, 10),
            proveedor: gasto.proveedor || "",
            tipo_comprobante: gasto.tipo_comprobante || "",
            numero_comprobante: gasto.numero_comprobante || "",
            descripcion: gasto.descripcion,
            monto: gasto.monto,
            archivo: null
        });
        setShowGastoModal(true);
    };

    const eliminarSolicitud = async (id) => {
        if (!confirm("¿Deseas eliminar esta solicitud?")) return;
        try {
            const res = await fetch(`${API}eliminar_solicitud.php?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data?.message || "Error");
            alert("Solicitud eliminada");
            await obtenerSolicitudes();
        } catch (error) { alert(error.message); }
    };

    const ejecutarFlujo = async (accion, solicitudId, observacion = "") => {
        if (!currentUserId) { alert("Usuario no válido"); return; }
        const payload = { solicitud_id: solicitudId, accion, usuario_id: currentUserId, observacion: observacion.trim() };
        try {
            const res = await fetch(`${API}flujo_fondos.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!data.success) { alert(data.message || "Error en el flujo"); return; }
            alert(data.message);
            await obtenerSolicitudes();
            setViewingReq(prev => prev?.id === solicitudId ? { ...prev, estado: data.estado || prev.estado } : prev);
        } catch (error) { alert("Error de conexión"); }
    };

    const ejecutarPago = async () => {
        if (!viewingReq?.id) return alert("Solicitud inválida");
        if (!archivoPago) return alert("Seleccione comprobante");
        const formData = new FormData();
        formData.append("solicitud_id", viewingReq.id);
        formData.append("usuario_id", currentUserId);
        formData.append("comprobante", archivoPago);
        let montoPagar = 0;
        const montoSolicitado = Number(viewingReq.monto_solicitado || 0);
        const montoRendidoReal = gastos.reduce((sum, g) => sum + parseFloat(g.monto || 0), 0);
        if (viewingReq.tipo === "ADELANTO") montoPagar = montoSolicitado;
        else montoPagar = montoRendidoReal;
        formData.append("monto_pagado", montoPagar);
        const res = await fetch(`${API}pago_tesoreria.php`, { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) {
            alert("Pago registrado");
            setShowPagoModal(false);
            setArchivoPago(null);
            await obtenerSolicitudes();
            setViewingReq(prev => ({ ...prev, estado: data.estado }));
        } else { alert(data.message); }
    };

    const cerrarRendicion = async () => {
        if (!archivoCierre) { alert("Debe subir comprobante"); return; }
        const formData = new FormData();
        formData.append("solicitud_id", viewingReq.id);
        formData.append("usuario_id", currentUserId);
        formData.append("comprobante", archivoCierre);
        try {
            const res = await fetch(`${API}cerrar_rendicion.php`, { method: "POST", body: formData });
            const data = await res.json();
            if (!data.success) { alert(data.message); return; }
            alert(data.message);
            setShowCerrarModal(false);
            setArchivoCierre(null);
            await obtenerSolicitudes();
            setViewingReq(prev => ({ ...prev, estado: "CERRADO" }));
        } catch (error) { alert("Error al cerrar rendición"); }
    };

    const enviarRendicion = async () => {
        if (!viewingReq?.id || !currentUserId) return alert("Datos inválidos");
        if (archivosRendicion.length === 0) return alert("Seleccione archivos");
        const formData = new FormData();
        formData.append("solicitud_id", viewingReq.id);
        formData.append("usuario_id", currentUserId);
        archivosRendicion.forEach(file => formData.append("files[]", file));
        try {
            const res = await fetch(`${API}subir_rendicion.php`, { method: "POST", body: formData });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            alert("Archivos subidos correctamente");
            setArchivosRendicion([]);
            await obtenerSolicitudes();
            setViewingReq(prev => ({ ...prev, estado: "EN_RENDICION" }));
        } catch (err) { alert("Error al subir archivos"); }
    };

    // ===================== FILTRADO Y ORDENAMIENTO =====================
    const registrosFiltrados = useMemo(() => {
        if (!Array.isArray(registros)) return [];
        let filtered = registros.filter(reg => {
            if (activeTab === 'general') return true;
            if (activeTab === 'mis') {
                const deptSolicitante = (reg.departamento_solicitante || "").toUpperCase().trim();
                return deptSolicitante === currentDeptNombre;
            }
            return false;
        });

        if (searchText.trim() !== '') {
            const term = searchText.toLowerCase();
            filtered = filtered.filter(reg =>
                (reg.codigo || "").toLowerCase().includes(term) ||
                (reg.concepto || "").toLowerCase().includes(term) ||
                (reg.empresa || "").toLowerCase().includes(term) ||
                (reg.sede || "").toLowerCase().includes(term) ||
                (reg.categoria || "").toLowerCase().includes(term)
            );
        }

        if (pagadoFilter === 'pagado') {
            filtered = filtered.filter(reg => reg.estado === 'PAGADO');
        } else if (pagadoFilter === 'no_pagado') {
            filtered = filtered.filter(reg => reg.estado !== 'PAGADO');
        }

        const sorted = [...filtered];
        sorted.sort((a, b) => {
            const dateA = new Date(a.fecha || a.created_at);
            const dateB = new Date(b.fecha || b.created_at);
            if (fechaOrder === 'asc') return dateA - dateB;
            else return dateB - dateA;
        });
        return sorted;
    }, [registros, activeTab, currentDeptNombre, searchText, pagadoFilter, fechaOrder]);

    // ===================== CARGA INICIAL =====================
    useEffect(() => { obtenerSolicitudes(); }, []);
    useEffect(() => {
        if (viewingReq?.id) {
            obtenerArchivosSolicitud(viewingReq.id);
            obtenerGastos(viewingReq.id);
        }
    }, [viewingReq]);

    // ===================== AUXILIARES =====================
    const traducirTipo = (tipo) => {
        switch (tipo) {
            case 'ADELANTO': return 'Anticipo';
            case 'REEMBOLSO': return 'Reembolso';
            case 'VIATICOS': return 'Viáticos';
            default: return tipo;
        }
    };
    const montoSolicitado = Number(viewingReq?.monto_solicitado || viewingReq?.monto || 0);
    const montoRendidoReal = gastos.reduce((sum, g) => sum + parseFloat(g.monto || 0), 0);
    const diferenciaMonto = montoSolicitado - montoRendidoReal;
    const formatearMoneda = (monto) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(monto);

    // ===================== MODALES DE SOLICITUD =====================
    const abrirModalCrear = () => {
        setFormError("");
        setEditingReq({
            id: "", codigo: "", tipo: "ADELANTO",
            fecha: new Date().toISOString().substring(0, 10),
            empresa: "", sede: "", categoria: "", monto_solicitado: "", concepto: "", estado: "PENDIENTE", firma_digital: ""
        });
        setEmpresaSeleccionada("");
        setSedeSeleccionada("");
        setShowModal(true);
    };

    const abrirModalEditar = (id) => {
        const reg = registros.find(r => r.id === id);
        if (!reg) return;
        setEditingReq({
            id: reg.id, codigo: reg.codigo || "", empresa: reg.empresa || "", sede: reg.sede || "",
            categoria: reg.categoria || "", concepto: reg.concepto || "", monto_solicitado: reg.monto_solicitado || "",
            estado: reg.estado || "PENDIENTE", fecha: reg.fecha || "", firma_digital: reg.firma_digital || "",
            tipo: reg.tipo === "Adelanto" ? "ADELANTO" : reg.tipo === "Reembolso" ? "REEMBOLSO" : reg.tipo === "Viaticos" ? "VIATICOS" : reg.tipo || "ADELANTO"
        });
        setEmpresaSeleccionada("");
        setSedeSeleccionada("");
        setShowModal(true);
    };

    const abrirModalVisualizar = async (id) => {
        const reg = registros.find(r => r.id === id);
        if (reg) {
            setViewingReq(reg);
            setShowViewModal(true);
            setGastosEnviado(false);
            await obtenerGastos(reg.id);
            await obtenerRendiciones(reg.id);
        }
    };

    const guardarRegistro = async (e) => {
        e.preventDefault();
        setFormError("");
        if (!empresaSeleccionada || !sedeSeleccionada || !editingReq.categoria || !editingReq.concepto || !editingReq.monto_solicitado) {
            setFormError("Complete todos los campos obligatorios (empresa, sede, categoría, concepto, monto).");
            return;
        }
        if (parseFloat(editingReq.monto_solicitado) <= 0) { setFormError("Monto mayor a cero."); return; }
        
        const empresaNombre = empresas.find(e => e.id == empresaSeleccionada)?.nombre || "";
        const sedeNombre = sedes.find(s => s.id == sedeSeleccionada)?.nombre || "";
        
        let tipoNormalizado = "ADELANTO";
        if (editingReq.tipo === "REEMBOLSO" || editingReq.tipo === "Reembolso") tipoNormalizado = "REEMBOLSO";
        else if (editingReq.tipo === "VIATICOS" || editingReq.tipo === "Viaticos") tipoNormalizado = "VIATICOS";
        
        try {
            if (editingReq.id) {
                const payload = {
                    id: editingReq.id,
                    empresa: empresaNombre,
                    sede: sedeNombre,
                    tipo: tipoNormalizado,
                    categoria: editingReq.categoria,
                    concepto: editingReq.concepto,
                    monto_solicitado: editingReq.monto_solicitado,
                    estado: editingReq.estado
                };
                const res = await fetch(`${API}actualizar_solicitud.php`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
                const data = await res.json();
                if (data.success) { alert("Solicitud actualizada"); await obtenerSolicitudes(); setShowModal(false); }
                else setFormError(data.message || "Error");
            } else {
                const payload = {
                    solicitante_id: currentUserId,
                    departamento_id: currentUser?.departamento_id || null,
                    empresa: empresaNombre,
                    sede: sedeNombre,
                    tipo: tipoNormalizado,
                    categoria: editingReq.categoria,
                    concepto: editingReq.concepto,
                    monto_solicitado: editingReq.monto_solicitado,
                    firma_digital: editingReq.firma_digital || ""
                };
                const res = await fetch(`${API}crear_solicitud.php`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
                const data = await res.json();
                if (data.success) { alert("Solicitud registrada"); await obtenerSolicitudes(); setShowModal(false); }
                else setFormError(data.message || "Error");
            }
        } catch (error) { setFormError("Error de conexión"); }
    };

    // ===================== RENDER =====================
    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
            <header className="bg-white border-b sticky top-0 z-30">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-[#800000] to-black p-3 rounded-2xl"><Coins className="w-7 h-7 text-white" /></div>
                        <div><h1 className="text-2xl font-black">Gestión de Fondos</h1><p className="text-[10px] font-bold text-slate-400">Solicitudes · Rendiciones · Fondos</p></div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={obtenerSolicitudes} className="h-11 px-4 rounded-xl border bg-white hover:bg-slate-50 flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Actualizar</button>
                        <div className="bg-slate-100 rounded-2xl px-4 py-3"><div className="text-[10px] font-black">Solicitudes Totales</div><div className="text-2xl font-black">{registros.length}</div></div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-2 bg-white border rounded-2xl p-2">
                        <button onClick={() => setActiveTab("mis")} className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase flex items-center gap-2 ${activeTab === "mis" ? "bg-[#800000] text-white" : "hover:bg-slate-100"}`}><FileText className="w-4 h-4" /> Mis Solicitudes</button>
                        {puedeVerGeneral && (
                            <button onClick={() => setActiveTab("general")} className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase flex items-center gap-2 ${activeTab === "general" ? "bg-[#800000] text-white" : "hover:bg-slate-100"}`}><Users className="w-4 h-4" /> Vista General</button>
                        )}
                    </div>
                    <button onClick={abrirModalCrear} className="bg-gradient-to-r from-[#800000] to-black text-white px-6 py-3 rounded-2xl flex items-center gap-2"><Plus className="w-5 h-5" /> Nueva Solicitud</button>
                </div>

                {/* BARRA DE FILTROS */}
                <div className="bg-white rounded-3xl border shadow-sm overflow-hidden mb-8">
                    <div className="p-5 border-b bg-slate-50/40">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Search size={12} /> Buscar</label>
                                <input type="text" placeholder="Código, concepto, empresa..." value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/30" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Filter size={12} /> Estado de Pago</label>
                                <select value={pagadoFilter} onChange={(e) => setPagadoFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium">
                                    <option value="todos">Todos</option>
                                    <option value="pagado">Pagados</option>
                                    <option value="no_pagado">No pagados</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Calendar size={12} /> Orden por Fecha</label>
                                <div className="flex gap-2">
                                    <button onClick={() => setFechaOrder('desc')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${fechaOrder === 'desc' ? 'bg-[#800000] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><ArrowDown size={14} /> Más Reciente</button>
                                    <button onClick={() => setFechaOrder('asc')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${fechaOrder === 'asc' ? 'bg-[#800000] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}><ArrowUp size={14} /> Más Antigua</button>
                                </div>
                            </div>
                            <div className="text-right text-[10px] font-bold text-slate-400 self-end pb-2">Mostrando {registrosFiltrados.length} de {registros.length} solicitudes</div>
                        </div>
                    </div>

                    {/* TABLA */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px]">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black">Código</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black">Solicitante</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black">Concepto</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black">Estado</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black">Monto</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrosFiltrados.length === 0 ? (
                                    <tr><td colSpan="6" className="py-20 text-center">No hay solicitudes</td></tr>
                                ) : (
                                    registrosFiltrados.map(reg => {
                                        const badge = reg.estado === "PENDIENTE" ? "bg-amber-50 text-amber-700" :
                                            reg.estado === "APROBADO" ? "bg-blue-50 text-blue-700" :
                                                reg.estado === "PAGADO" ? "bg-emerald-50 text-emerald-700" :
                                                    reg.estado === "CERRADO" ? "bg-slate-100 text-slate-700" : "bg-red-50 text-red-700";
                                        return (
                                            <tr key={reg.id} className="hover:bg-slate-50/70">
                                                <td className="px-6 py-5"><div><span className="text-xs font-black text-[#800000]">{reg.codigo}</span><span className="text-[10px] text-slate-400 block">{reg.created_at}</span></div></td>
                                                <td className="px-6 py-5"><p className="text-sm font-bold">{reg.solicitante || "Sin nombre"}</p><p className="text-[11px] text-slate-400">{reg.empresa} • {reg.sede}</p></td>
                                                <td className="px-6 py-5"><span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 mb-1">{traducirTipo(reg.tipo)}</span><p className="text-sm">{reg.concepto}</p></td>
                                                <td className="px-6 py-5"><span className={`inline-flex px-3 py-1.5 rounded-full border text-[10px] font-black ${badge}`}>{reg.estado}</span></td>
                                                <td className="px-6 py-5 text-right font-black">{formatearMoneda(reg.monto_solicitado)}</td>
                                                <td className="px-6 py-5 text-right"><div className="flex justify-end gap-2"><button onClick={() => abrirModalVisualizar(reg.id)} className="w-10 h-10 rounded-xl border hover:border-[#800000]/20 hover:bg-[#800000]/5"><Eye className="w-4 h-4" /></button><button onClick={() => eliminarSolicitud(reg.id)} className="w-10 h-10 rounded-xl border hover:border-red-200 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></div></td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* MODAL CREAR/EDITAR SOLICITUD */}
            {showModal && editingReq && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                        <div className="relative w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl border border-slate-200">
                            <div className="bg-gradient-to-r from-[#800000] via-[#650000] to-black px-7 py-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-lg font-black uppercase tracking-wide text-white">{editingReq.id ? `Editar Solicitud ${editingReq.codigo || ""}` : "Nueva Solicitud de Fondos"}</h2>
                                        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-red-100 font-semibold">Caja Chica • Gestión Financiera</p>
                                    </div>
                                    <button type="button" onClick={() => setShowModal(false)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20">✕</button>
                                </div>
                            </div>
                            <form onSubmit={guardarRegistro} className="max-h-[85vh] overflow-y-auto px-7 py-6 space-y-6 bg-slate-50/40">
                                {formError && <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-700 text-sm font-semibold">{formError}</div>}
                                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                                    <h3 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-slate-700">Datos Generales</h3>
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-[11px] font-black uppercase text-slate-500">Tipo</label>
                                            <select value={editingReq.tipo || "ADELANTO"} onChange={(e) => setEditingReq(prev => ({ ...prev, tipo: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                <option value="ADELANTO">Anticipo</option>
                                                <option value="REEMBOLSO">Reembolso</option>
                                                <option value="VIATICOS">Viáticos</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[11px] font-black uppercase text-slate-500">Empresa</label>
                                            <div className="relative">
                                                <select value={empresaSeleccionada} onChange={(e) => { setEmpresaSeleccionada(e.target.value); setSedeSeleccionada(""); }} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 appearance-none" required disabled={loadingEmpresas}>
                                                    <option value="">Seleccione empresa</option>
                                                    {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nombre}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[11px] font-black uppercase text-slate-500">Sede</label>
                                            <div className="relative">
                                                <select value={sedeSeleccionada} onChange={(e) => setSedeSeleccionada(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 appearance-none" disabled={!empresaSeleccionada || loadingSedes} required>
                                                    <option value="">Seleccione sede</option>
                                                    {Array.isArray(sedes) && sedes.map(sed => <option key={sed.id} value={sed.id}>{sed.nombre}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[11px] font-black uppercase text-slate-500">Categoría</label>
                                            <input type="text" value={editingReq.categoria || ""} onChange={(e) => setEditingReq(prev => ({ ...prev, categoria: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[11px] font-black uppercase text-slate-500">Monto Solicitado</label>
                                            <input type="number" step="0.01" value={editingReq.monto_solicitado || ""} onChange={(e) => setEditingReq(prev => ({ ...prev, monto_solicitado: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                                        </div>
                                        {editingReq.id && (
                                            <div>
                                                <label className="mb-2 block text-[11px] font-black uppercase text-slate-500">Estado</label>
                                                <select value={editingReq.estado || "PENDIENTE"} onChange={(e) => setEditingReq(prev => ({ ...prev, estado: e.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                    <option value="PENDIENTE">Pendiente</option>
                                                    <option value="APROBADO">Aprobado</option>
                                                    <option value="RECHAZADO">Rechazado</option>
                                                    <option value="PAGADO">Pagado</option>
                                                    <option value="EN_RENDICION">En Rendición</option>
                                                    <option value="POR_DEVOLVER">Por Devolver</option>
                                                    <option value="POR_REEMBOLSAR">Por Reembolsar</option>
                                                    <option value="CERRADO">Cerrado</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                                    <h3 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-slate-700">Concepto</h3>
                                    <textarea rows="4" value={editingReq.concepto || ""} onChange={(e) => setEditingReq(prev => ({ ...prev, concepto: e.target.value }))} className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                                </div>
                                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                                    <button type="button" onClick={() => setShowModal(false)} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-black uppercase">Cancelar</button>
                                    <button type="submit" className="rounded-2xl bg-gradient-to-r from-[#800000] to-black px-6 py-3 text-xs font-black uppercase text-white">{editingReq.id ? "Actualizar Solicitud" : "Registrar Solicitud"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DETALLE SOLICITUD (simplificado) */}
            {showViewModal && viewingReq && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div onClick={() => setShowViewModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                        <div className="relative w-full max-w-2xl overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-2xl">
                            <div className="bg-gradient-to-r from-[#800000] to-black px-8 py-6 text-white">
                                <div className="flex justify-between">
                                    <div>
                                        <div className="text-xs font-black uppercase tracking-wider text-amber-300">{viewingReq.codigo}</div>
                                        <h3 className="text-xl font-black">{viewingReq.concepto}</h3>
                                        <p className="text-sm opacity-80">Solicitado por: {viewingReq.solicitante}</p>
                                    </div>
                                    <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-white/20 rounded-full"><X size={20} /></button>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><span className="text-xs text-slate-400">Tipo</span><p className="font-bold">{traducirTipo(viewingReq.tipo)}</p></div>
                                    <div><span className="text-xs text-slate-400">Monto</span><p className="font-bold text-emerald-600">{formatearMoneda(viewingReq.monto_solicitado)}</p></div>
                                    <div><span className="text-xs text-slate-400">Estado</span><p className="font-bold">{viewingReq.estado}</p></div>
                                    <div><span className="text-xs text-slate-400">Categoría</span><p>{viewingReq.categoria}</p></div>
                                </div>
                                <div><span className="text-xs text-slate-400">Empresa / Sede</span><p>{viewingReq.empresa} - {viewingReq.sede}</p></div>
                                <div><span className="text-xs text-slate-400">Concepto</span><p className="bg-slate-50 p-3 rounded-xl">{viewingReq.concepto}</p></div>

                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => alert("Función PDF pendiente")} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold">PDF</button>
                                    {viewingReq.estado === "PENDIENTE" && puedeAprobar && (
                                        <button onClick={() => ejecutarFlujo("APROBAR", viewingReq.id)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs">Aprobar</button>
                                    )}
                                    {viewingReq.estado === "PENDIENTE" && puedeAprobar && (
                                        <button onClick={() => setShowRejectModal(true)} className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs">Rechazar</button>
                                    )}
                                    <button onClick={() => setShowViewModal(false)} className="ml-auto border px-4 py-2 rounded-xl text-xs">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODALES DE GASTOS, PAGO, CIERRE, RECHAZO, VER GASTOS */}
            {showGastoModal && (
                <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-5xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-black mb-4">{editandoGasto ? "Editar Gasto" : "Nuevo Gasto"}</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-slate-100"><tr><th className="border p-2">ITEM</th><th className="border p-2">FECHA</th><th className="border p-2">TIPO</th><th className="border p-2">N° DOC</th><th className="border p-2">DETALLE</th><th className="border p-2">MONTO</th><th className="border p-2">ARCHIVO</th><th className="border p-2">ACCIONES</th></tr></thead>
                                <tbody>
                                    {editandoGasto ? (
                                        <tr><td className="border p-2 text-center">Editar</td><td className="border p-2"><input type="date" value={gastoForm.fecha} onChange={e => setGastoForm({ ...gastoForm, fecha: e.target.value })} className="border rounded p-1 w-full" /></td><td className="border p-2"><select value={gastoForm.tipo_comprobante} onChange={e => setGastoForm({ ...gastoForm, tipo_comprobante: e.target.value })} className="border rounded p-1 w-full"><option value="">Seleccionar</option><option>Factura</option><option>Boleta</option><option>Ticket</option><option>RXH</option><option>Otro</option></select></td><td className="border p-2"><input type="text" value={gastoForm.numero_comprobante} onChange={e => setGastoForm({ ...gastoForm, numero_comprobante: e.target.value })} className="border rounded p-1 w-full" /></td><td className="border p-2"><textarea rows="2" value={gastoForm.descripcion} onChange={e => setGastoForm({ ...gastoForm, descripcion: e.target.value })} className="border rounded p-1 w-full" /></td><td className="border p-2"><input type="number" step="0.01" value={gastoForm.monto} onChange={e => setGastoForm({ ...gastoForm, monto: e.target.value })} className="border rounded p-1 w-full text-right" /></td><td className="border p-2"><input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setGastoForm({ ...gastoForm, archivo: e.target.files[0] })} className="text-xs" /></td><td className="border p-2 text-center"><button onClick={actualizarGasto} className="bg-green-600 text-white px-2 py-1 rounded text-xs">Guardar</button></td></tr>
                                    ) : (
                                        <tr><td className="border p-2 text-center">Nuevo</td><td className="border p-2"><input type="date" value={gastoForm.fecha} onChange={e => setGastoForm({ ...gastoForm, fecha: e.target.value })} className="border rounded p-1 w-full" /></td><td className="border p-2"><select value={gastoForm.tipo_comprobante} onChange={e => setGastoForm({ ...gastoForm, tipo_comprobante: e.target.value })} className="border rounded p-1 w-full"><option value="">Seleccionar</option><option>Factura</option><option>Boleta</option><option>Ticket</option><option>RXH</option><option>Otro</option></select></td><td className="border p-2"><input type="text" value={gastoForm.numero_comprobante} onChange={e => setGastoForm({ ...gastoForm, numero_comprobante: e.target.value })} className="border rounded p-1 w-full" /></td><td className="border p-2"><textarea rows="2" value={gastoForm.descripcion} onChange={e => setGastoForm({ ...gastoForm, descripcion: e.target.value })} className="border rounded p-1 w-full" /></td><td className="border p-2"><input type="number" step="0.01" value={gastoForm.monto} onChange={e => setGastoForm({ ...gastoForm, monto: e.target.value })} className="border rounded p-1 w-full text-right" /></td><td className="border p-2"><input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setGastoForm({ ...gastoForm, archivo: e.target.files[0] })} className="text-xs" /></td><td className="border p-2 text-center"><button onClick={agregarGasto} className="bg-[#800000] text-white px-2 py-1 rounded text-xs">Guardar</button></td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end gap-3 mt-6"><button onClick={() => { setShowGastoModal(false); limpiarFormGasto(); }} className="px-4 py-2 border rounded-xl">Cancelar</button></div>
                    </div>
                </div>
            )}

            {showCerrarModal && (
                <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-2xl p-8">
                        <h3 className="text-xl font-black mb-2">{viewingReq?.estado === "POR_DEVOLVER" ? "Registrar Devolución" : "Registrar Reembolso"}</h3>
                        <p className="text-sm text-slate-500 mb-6">{viewingReq?.estado === "POR_DEVOLVER" ? "Sube el voucher de devolución del dinero sobrante." : "Sube el comprobante del reembolso realizado."}</p>
                        <div className="mb-6 rounded-2xl bg-slate-100 p-5"><p className="text-xs font-black uppercase text-slate-500">Diferencia</p><h2 className="text-3xl font-black">{formatearMoneda(Math.abs(viewingReq?.diferencia || 0))}</h2></div>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setArchivoCierre(e.target.files[0])} className="w-full border p-4 rounded-2xl" />
                        {archivoCierre && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">📎 {archivoCierre.name}</div>}
                        <div className="flex gap-3 mt-8"><button onClick={cerrarRendicion} className="flex-1 bg-black text-white py-3 rounded-2xl font-black">Finalizar</button><button onClick={() => { setShowCerrarModal(false); setArchivoCierre(null); }} className="px-6 py-3 border rounded-2xl">Cancelar</button></div>
                    </div>
                </div>
            )}

            {showPagoModal && (
                <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-2xl p-8">
                        <h3 className="text-xl font-black mb-2">Registrar Pago</h3>
                        <p className="text-sm text-slate-500 mb-6">Suba el comprobante de transferencia</p>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setArchivoPago(e.target.files[0])} className="w-full border p-4 rounded-2xl" />
                        {archivoPago && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">📎 {archivoPago.name}</div>}
                        <div className="flex gap-3 mt-8"><button onClick={ejecutarPago} className="flex-1 bg-emerald-600 text-white py-3 rounded-2xl font-black">Registrar</button><button onClick={() => { setShowPagoModal(false); setArchivoPago(null); }} className="px-6 py-3 border rounded-2xl">Cancelar</button></div>
                    </div>
                </div>
            )}

            {showVerGastosModal && (
                <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-black">Lista de Gastos</h3><button onClick={() => setShowVerGastosModal(false)} className="text-slate-500">✕</button></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-slate-100"><tr><th className="border p-2">#</th><th className="border p-2">FECHA</th><th className="border p-2">TIPO</th><th className="border p-2">N° DOC</th><th className="border p-2">DETALLE</th><th className="border p-2">MONTO</th></tr></thead>
                                <tbody>{gastos.map((g, idx) => <tr key={g.id}><td className="border p-2 text-center">{idx + 1}</td><td className="border p-2">{g.fecha}</td><td className="border p-2">{g.tipo_comprobante}</td><td className="border p-2">{g.numero_comprobante}</td><td className="border p-2">{g.descripcion}</td><td className="border p-2 text-right font-bold">{formatearMoneda(g.monto)}</td></tr>)}</tbody>
                                <tfoot className="bg-slate-50"><tr><td colSpan="5" className="border p-2 text-right font-black">TOTAL:</td><td className="border p-2 text-right font-black text-emerald-600">{formatearMoneda(montoRendidoReal)}</td></tr></tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {showRejectModal && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                    <div onClick={() => setShowRejectModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-red-700 to-red-900 px-8 py-6 text-white"><h2 className="text-xl font-black">Rechazar Solicitud</h2><p className="text-sm text-red-100">Indique el motivo del rechazo</p></div>
                        <div className="p-8"><textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={5} className="w-full border rounded-2xl p-4" placeholder="Escriba las observaciones..." /><div className="mt-6 flex justify-end gap-3"><button onClick={() => setShowRejectModal(false)} className="border rounded-2xl px-5 py-3 text-xs font-black">Cancelar</button><button onClick={async () => { if (!rejectReason.trim()) return alert("Ingrese observaciones"); await ejecutarFlujo("RECHAZAR", viewingReq.id, rejectReason); setRejectReason(""); setShowRejectModal(false); }} className="bg-red-600 text-white rounded-2xl px-5 py-3 text-xs font-black">Confirmar</button></div></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fondos;