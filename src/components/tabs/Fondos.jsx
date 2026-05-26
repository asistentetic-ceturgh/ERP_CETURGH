import React, { useState, useEffect, useMemo } from 'react';
import {
    Coins, RefreshCw, FileText, Users, Plus, Inbox, Eye, Pencil, Trash2, X,
    DollarSign, Calendar, Info, AlertTriangle, Check, UploadCloud, Search,
    ArrowUp, ArrowDown, Building2, ChevronDown, Receipt, Send
} from 'lucide-react';
import { API_BASE } from "../../config/api";

const API = API_BASE;
const FONDO_ASIGNADO = 10000;

const Fondos = ({ user }) => {
    const currentUser = user || null;
    const currentUserId = currentUser?.id || null;
    const currentRole = (currentUser?.tipo || "").toLowerCase().trim();
    const currentDeptNombre = (currentUser?.departamento || "").toUpperCase().trim();

    // ===================== DATOS DINÁMICOS =====================
    const [empresas, setEmpresas] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [loadingEmpresas, setLoadingEmpresas] = useState(true);
    const [loadingSedes, setLoadingSedes] = useState(false);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
    const [sedeSeleccionada, setSedeSeleccionada] = useState("");

    // ===================== FILTROS =====================
    const [searchText, setSearchText] = useState('');
    const [fechaOrder, setFechaOrder] = useState('desc');
    const [selTipo, setSelTipo] = useState('todos');
    const [selEstado, setSelEstado] = useState('todos');

    // ===================== ESTADOS PRINCIPALES =====================
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("mis");

    // Archivos
    const [archivosRendicion, setArchivosRendicion] = useState([]);
    const [rendiciones, setRendiciones] = useState([]);
    const [archivosTesoreria, setArchivosTesoreria] = useState([]);

    // Pagos y cierre
    const [showPagoModal, setShowPagoModal] = useState(false);
    const [archivoPago, setArchivoPago] = useState(null);
    const [showCerrarModal, setShowCerrarModal] = useState(false);
    const [archivoCierre, setArchivoCierre] = useState(null);
    const [showRendicionModal, setShowRendicionModal] = useState(false);

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
    const [montoTesoreria, setMontoTesoreria] = useState(0);

    // ===================== PERMISOS =====================
    const esTIC = currentDeptNombre === "TIC";
    const esAdministracion = currentDeptNombre.includes("ADMIN");
    const esTesoreria = currentDeptNombre === "TESORERIA";
    const esJefe = currentRole === "jefe";
    const puedeVerGeneral = ["LOGISTICA", "ADMINISTRACION", "TIC", "TESORERIA"].includes(currentDeptNombre);
    const puedeAprobar = esTIC || (esAdministracion && esJefe);
    const puedePagar = esTIC || esTesoreria;

    // SOLO se puede firmar si está SIN_FIRMAR
    const puedeFirmar = viewingReq && Number(currentUserId) === Number(viewingReq.solicitante_id) && esJefe && viewingReq?.estado === "SIN_FIRMAR";

    // SOLO se puede editar si está SIN_FIRMAR (aún no se ha firmado)
    const puedeEditarSolicitud = (solicitud) => {
        return Number(currentUserId) === Number(solicitud?.solicitante_id) && solicitud?.estado === "SIN_FIRMAR";
    };

    // Los gastos NO se pueden editar si la solicitud ya fue enviada a rendición o pagada
    const puedeEditarGasto = () => {
        const estadosBloqueados = ["EN_RENDICION", "POR_REEMBOLSAR", "POR_DEVOLVER", "CERRADO", "PAGADO"];
        return !estadosBloqueados.includes(viewingReq?.estado);
    };

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

    // ===================== API CALLS =====================
    const obtenerSolicitudes = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}listar_solicitudes.php`);
            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error("La API no devolvió un array:", data);
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
            else setGastos([]);
        } catch (err) {
            console.error(err);
            setGastos([]);
        }
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

    // CRUD Gastos (solo si se puede editar)
    const agregarGasto = async () => {
        if (!puedeEditarGasto()) {
            alert("No puede agregar gastos porque la solicitud ya está en proceso de rendición o pago");
            return;
        }
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
                alert("Gasto registrado correctamente");
            } else alert(data.message);
        } catch (error) { alert("Error al guardar el gasto"); }
    };

    const actualizarGasto = async () => {
        if (!puedeEditarGasto()) {
            alert("No puede editar gastos porque la solicitud ya está en proceso de rendición o pago");
            return;
        }
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
                alert("Gasto actualizado");
            } else alert(data.message);
        } catch (error) { alert("Error al actualizar el gasto"); }
    };

    const eliminarGasto = async (id) => {
        if (!puedeEditarGasto()) {
            alert("No puede eliminar gastos porque la solicitud ya está en proceso de rendición o pago");
            return;
        }
        if (!confirm("¿Eliminar este gasto?")) return;
        const res = await fetch(`${API}gastos.php?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) await obtenerGastos(viewingReq.id);
        else alert(data.message);
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

    const abrirModalNuevoGasto = () => {
        if (!puedeEditarGasto()) {
            alert("No puede agregar gastos porque la solicitud ya está en proceso de rendición o pago");
            return;
        }
        limpiarFormGasto();
        setShowGastoModal(true);
    };

    const abrirModalEditarGasto = (gasto) => {
        if (!puedeEditarGasto()) {
            alert("No puede editar gastos porque la solicitud ya está en proceso de rendición o pago");
            return;
        }
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
        const solicitud = registros.find(r => r.id === id);
        if (!puedeEditarSolicitud(solicitud)) {
            alert("No puede eliminar esta solicitud porque ya fue firmada o está en proceso");
            return;
        }
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

        // Para ANTICIPO y VIATICOS: pagar el monto solicitado
        if (viewingReq.tipo === "ADELANTO" || viewingReq.tipo === "VIATICOS") {
            montoPagar = montoSolicitado;
        } else {
            montoPagar = montoRendidoReal;
        }
        formData.append("monto_pagado", montoPagar);

        try {
            const res = await fetch(`${API}pago_tesoreria.php`, { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) {
                alert("Pago registrado correctamente");
                setShowPagoModal(false);
                setArchivoPago(null);
                await obtenerSolicitudes();
                setViewingReq(prev => ({ ...prev, estado: data.estado }));
            } else { alert(data.message); }
        } catch (error) { alert("Error al registrar pago"); }
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
            setShowRendicionModal(false);
            await obtenerSolicitudes();
            await obtenerArchivosSolicitud(viewingReq.id);
            setViewingReq(prev => ({ ...prev, estado: data.estado }));
        } catch (err) { alert("Error al subir archivos"); }
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
            await obtenerSolicitudes();
            await obtenerGastos(viewingReq.id);
            setViewingReq(prev => ({ ...prev, estado: data.estado }));
        } catch (error) { alert("Error al enviar rendición"); }
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

    // ===================== CÁLCULOS =====================
    const montoSolicitado = Number(viewingReq?.monto_solicitado || viewingReq?.monto || 0);
    const montoRendidoReal = gastos.reduce((sum, g) => sum + parseFloat(g.monto || 0), 0);
    const diferenciaMonto = montoSolicitado - montoRendidoReal;

    // ===================== FILTRADO =====================
    const registrosFiltrados = useMemo(() => {
        if (!Array.isArray(registros)) return [];

        let filtered = registros.filter(reg => {
            if (activeTab === 'general') {
                return puedeVerGeneral;
            }
            if (activeTab === 'mis') {
                return Number(reg.solicitante_id) === Number(currentUserId);
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

        if (selTipo !== 'todos') {
            filtered = filtered.filter(reg => reg.tipo === selTipo);
        }

        if (selEstado !== 'todos') {
            filtered = filtered.filter(reg => reg.estado === selEstado);
        }

        const sorted = [...filtered];
        sorted.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return fechaOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return sorted;
    }, [registros, activeTab, currentUserId, puedeVerGeneral, searchText, selTipo, selEstado, fechaOrder]);

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

    const formatearMoneda = (monto) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(monto);

    // Pasos del flujo - ANTICIPO y VIATICOS tienen el mismo flujo (pago antes)
    const esAnticipoOViaticos = viewingReq?.tipo === "ADELANTO" || viewingReq?.tipo === "VIATICOS";
    const pasosFlujo = esAnticipoOViaticos
        ? [
            { key: "SIN_FIRMAR", title: "Solicitud Registrada", desc: "Solicitud creada por el departamento solicitante." },
            { key: "PENDIENTE", title: "Firma de Jefe", desc: "Jefe de departamento firmó la solicitud." },
            { key: "APROBADO", title: "Aprobación Administrativa", desc: "ADMINISTRACION validó la solicitud." },
            { key: "PAGADO", title: "Pago Tesorería", desc: "TESORERIA realizó el desembolso." },
            { key: "EN_RENDICION", title: "En Rendición", desc: "Pendiente de sustento documentario." },
            { key: "CERRADO", title: "Proceso Cerrado", desc: "Solicitud finalizada correctamente." }
        ]
        : [
            { key: "SIN_FIRMAR", title: "Solicitud Registrada", desc: "Solicitud creada por el departamento solicitante." },
            { key: "PENDIENTE", title: "Firma de Jefe", desc: "Jefe de departamento firmó la solicitud." },
            { key: "APROBADO", title: "Aprobación Administrativa", desc: "ADMINISTRACION validó la solicitud." },
            { key: "EN_RENDICION", title: "Sustento Enviado", desc: "El solicitante adjuntó los comprobantes de gastos." },
            { key: "POR_REEMBOLSAR", title: "Pendiente de Pago", desc: "Tesorería debe realizar el reembolso." },
            { key: "CERRADO", title: "Proceso Finalizado", desc: "Solicitud cerrada correctamente." }
        ];

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
        if (!puedeEditarSolicitud(reg)) {
            alert("No puede editar esta solicitud porque ya fue firmada o está en proceso");
            return;
        }
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
            await obtenerGastos(reg.id);
            await obtenerArchivosSolicitud(reg.id);
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
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2"><Search size={12} /> Buscar</label>
                                <input type="text" placeholder="Código, concepto, empresa..." value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Tipo</label>
                                <select value={selTipo} onChange={(e) => setSelTipo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm">
                                    <option value="todos">Todos</option>
                                    <option value="ADELANTO">Anticipo</option>
                                    <option value="REEMBOLSO">Reembolso</option>
                                    <option value="VIATICOS">Viáticos</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Estado</label>
                                <select value={selEstado} onChange={(e) => setSelEstado(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm">
                                    <option value="todos">Todos</option>
                                    <option value="SIN_FIRMAR">Sin Firmar</option>
                                    <option value="PENDIENTE">Pendiente</option>
                                    <option value="APROBADO">Aprobado</option>
                                    <option value="PAGADO">Pagado</option>
                                    <option value="EN_RENDICION">En Rendición</option>
                                    <option value="POR_DEVOLVER">Por Devolver</option>
                                    <option value="POR_REEMBOLSAR">Por Reembolsar</option>
                                    <option value="CERRADO">Cerrado</option>
                                    <option value="RECHAZADO">Rechazado</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Orden por Fecha</label>
                                <div className="flex gap-2">
                                    <button onClick={() => setFechaOrder('desc')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${fechaOrder === 'desc' ? 'bg-[#800000] text-white' : 'bg-slate-100'}`}><ArrowDown size={12} /> Reciente</button>
                                    <button onClick={() => setFechaOrder('asc')} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${fechaOrder === 'asc' ? 'bg-[#800000] text-white' : 'bg-slate-100'}`}><ArrowUp size={12} /> Antigua</button>
                                </div>
                            </div>
                            <div className="text-right text-[10px] font-bold text-slate-400 self-end pb-2">Mostrando {registrosFiltrados.length} de {registros.length}</div>
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
                                        const badge = reg.estado === "SIN_FIRMAR" ? "bg-gray-100 text-gray-700" :
                                            reg.estado === "PENDIENTE" ? "bg-amber-50 text-amber-700" :
                                                reg.estado === "APROBADO" ? "bg-blue-50 text-blue-700" :
                                                    reg.estado === "PAGADO" ? "bg-emerald-50 text-emerald-700" :
                                                        reg.estado === "CERRADO" ? "bg-slate-100 text-slate-700" :
                                                            reg.estado === "RECHAZADO" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700";
                                        return (
                                            <tr key={reg.id} className="hover:bg-slate-50/70">
                                                <td className="px-6 py-5"><div><span className="text-xs font-black text-[#800000]">{reg.codigo}</span><span className="text-[10px] text-slate-400 block">{reg.created_at?.slice(0, 10)}</span></div></td>
                                                <td className="px-6 py-5"><p className="text-sm font-bold">{reg.solicitante || "Sin nombre"}</p><p className="text-[11px] text-slate-400">{reg.empresa} • {reg.sede}</p></td>
                                                <td className="px-6 py-5"><span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 mb-1">{traducirTipo(reg.tipo)}</span><p className="text-sm">{reg.concepto?.slice(0, 50)}</p></td>
                                                <td className="px-6 py-5"><span className={`inline-flex px-3 py-1.5 rounded-full border text-[10px] font-black ${badge}`}>{reg.estado}</span></td>
                                                <td className="px-6 py-5 text-right font-black">{formatearMoneda(reg.monto_solicitado)}</td>
                                                <td className="px-6 py-5 text-right"><div className="flex justify-end gap-2">
                                                    <button onClick={() => abrirModalVisualizar(reg.id)} className="w-10 h-10 rounded-xl border hover:border-[#800000]/20 hover:bg-[#800000]/5"><Eye className="w-4 h-4" /></button>
                                                    {puedeEditarSolicitud(reg) && (
                                                        <button onClick={() => abrirModalEditar(reg.id)} className="w-10 h-10 rounded-xl border border-amber-200 bg-amber-50"><Pencil className="w-4 h-4 text-amber-700" /></button>
                                                    )}
                                                    {puedeEditarSolicitud(reg) && (
                                                        <button onClick={() => eliminarSolicitud(reg.id)} className="w-10 h-10 rounded-xl border hover:border-red-200 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                                                    )}
                                                </div></td>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col">

                        {/* Header: Adaptado al estilo del primer modal */}
                        <div className="bg-[#800000] p-6 md:p-8 flex justify-between items-center relative overflow-hidden">
                            {/* Detalle decorativo sutil en el fondo */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />

                            <div className="flex items-center gap-5 z-10">
                                <div className="h-14 w-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                                    {/* Puedes cambiar este icono por un "DollarSign" o "Wallet" de lucide-react si lo usas */}
                                    <span className="text-[#800000] text-2xl font-black">S/</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                        {editingReq.id ? "Editar Solicitud" : "Nueva Solicitud"}
                                    </h3>
                                    <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                                        {editingReq.id ? `${editingReq.codigo || ""}` : "Caja Chica • Gestión Financiera"}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Cuerpo del Formulario */}
                        <form onSubmit={guardarRegistro} className="p-8 md:p-10 space-y-8 overflow-y-auto flex-1">

                            {/* Alerta de Error estilizada al estilo premium */}
                            {formError && (
                                <div className="rounded-2xl border-2 border-red-100 bg-red-50 px-5 py-3.5 text-red-700 text-xs font-black uppercase tracking-wider flex items-center gap-3 shadow-inner">
                                    <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
                                    {formError}
                                </div>
                            )}

                            {/* SECCIÓN 1: DATOS GENERALES */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tipo de Fondos */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-[#800000]/60 uppercase tracking-[0.15em] ml-1">
                                        Tipo de Fondos
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={editingReq.tipo || "ADELANTO"}
                                            onChange={(e) => setEditingReq(prev => ({ ...prev, tipo: e.target.value }))}
                                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-[#800000] focus:bg-white transition-all appearance-none"
                                        >
                                            <option value="ADELANTO">Anticipo</option>
                                            <option value="REEMBOLSO">Reembolso</option>
                                            <option value="VIATICOS">Viáticos</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-xs">▼</div>
                                    </div>
                                </div>

                                {/* Categoría */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-[#800000]/60 uppercase tracking-[0.15em] ml-1">
                                        Categoría
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Logística, Operaciones..."
                                        value={editingReq.categoria || ""}
                                        onChange={(e) => setEditingReq(prev => ({ ...prev, categoria: e.target.value }))}
                                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-[#800000] focus:bg-white transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            {/* SECCIÓN 2: EMPRESA Y SEDE */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Empresa */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-[#800000]/60 uppercase tracking-[0.15em] ml-1">
                                        Empresa
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={empresaSeleccionada}
                                            onChange={(e) => { setEmpresaSeleccionada(e.target.value); setSedeSeleccionada(""); }}
                                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-[#800000] focus:bg-white transition-all appearance-none disabled:opacity-50"
                                            required
                                            disabled={loadingEmpresas}
                                        >
                                            <option value="">Seleccione empresa</option>
                                            {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nombre}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-xs">▼</div>
                                    </div>
                                </div>

                                {/* Sede */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-[#800000]/60 uppercase tracking-[0.15em] ml-1">
                                        Sede
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={sedeSeleccionada}
                                            onChange={(e) => setSedeSeleccionada(e.target.value)}
                                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-[#800000] focus:bg-white transition-all appearance-none disabled:opacity-40"
                                            disabled={!empresaSeleccionada || loadingSedes}
                                            required
                                        >
                                            <option value="">Seleccione sede</option>
                                            {sedes.map(sed => <option key={sed.id} value={sed.id}>{sed.nombre}</option>)}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-xs">▼</div>
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN 3: CONCEPTO DETALLADO */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-[#800000]/60 uppercase tracking-[0.15em] ml-1">
                                    Concepto de la Solicitud
                                </label>
                                <textarea
                                    rows="3"
                                    placeholder="Escriba aquí los detalles correspondientes de los fondos solicitados..."
                                    value={editingReq.concepto || ""}
                                    onChange={(e) => setEditingReq(prev => ({ ...prev, concepto: e.target.value }))}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm focus:bg-white focus:border-[#800000] outline-none transition-all shadow-inner resize-none"
                                />
                            </div>

                            {/* SECCIÓN 4: MONTO DESTACADO */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-[#800000]/60 uppercase tracking-[0.15em] ml-1">
                                    Monto Solicitado
                                </label>
                                <div className="relative rounded-2xl">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#800000] font-black text-lg">S/</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={editingReq.monto_solicitado || ""}
                                        onChange={(e) => setEditingReq(prev => ({ ...prev, monto_solicitado: e.target.value }))}
                                        className="w-full p-4 pl-12 bg-white border-2 border-slate-100 rounded-2xl text-xl font-black text-slate-800 focus:border-[#800000] outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* FOOTER: Botones con mayor peso visual y consistentes */}
                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    Cancelar y salir
                                </button>

                                <button
                                    type="submit"
                                    className="flex-[2] bg-[#800000] py-4 rounded-2xl text-white text-sm font-black hover:bg-[#600000] hover:shadow-lg hover:shadow-red-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    {editingReq.id ? "ACTUALIZAR SOLICITUD" : "REGISTRAR SOLICITUD"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DETALLE SOLICITUD COMPLETO */}
            {showViewModal && viewingReq && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
                        {/* Backdrop con desenfoque suave */}
                        <div onClick={() => setShowViewModal(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" />

                        {/* Contenedor del Modal */}
                        <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl transition-all flex flex-col my-8">

                            {/* CABECERA (Premium & Limpia) */}
                            <div className="bg-gradient-to-r from-[#800000] to-[#500000] px-6 py-5 text-white relative">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-[11px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur-sm">
                                            {viewingReq.codigo}
                                        </div>
                                        <h3 className="text-xl font-extrabold tracking-tight leading-tight">{viewingReq.concepto}</h3>
                                        <p className="text-xs text-slate-200 font-medium">Solicitado por: <span className="text-white font-semibold">{viewingReq.solicitante}</span></p>
                                    </div>
                                    <button
                                        onClick={() => setShowViewModal(false)}
                                        className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* CUERPO DEL MODAL */}
                            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-6 space-y-6 bg-slate-50/40">

                                {/* METRICAS PRINCIPALES (Grid de tarjetas) */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipo</span>
                                        <p className="font-bold text-slate-700 text-sm">{traducirTipo(viewingReq.tipo)}</p>
                                    </div>
                                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Monto Solicitado</span>
                                        <p className="font-extrabold text-slate-800 text-base">{formatearMoneda(viewingReq.monto_solicitado)}</p>
                                    </div>
                                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Estado</span>
                                        <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                            {viewingReq.estado}
                                        </span>
                                    </div>
                                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Categoría</span>
                                        <p className="font-semibold text-slate-600 text-sm">{viewingReq.categoria || 'Sin asignar'}</p>
                                    </div>
                                </div>

                                {/* DETALLES DE ORIGEN */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Empresa / Sede</span>
                                        <p className="font-semibold text-slate-700 text-sm">{viewingReq.empresa} <span className="text-slate-300 mx-1.5">•</span> {viewingReq.sede}</p>
                                    </div>
                                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Concepto Detallado</span>
                                        <p className="text-slate-600 text-sm font-medium">{viewingReq.concepto}</p>
                                    </div>
                                </div>

                                {/* SECCIÓN DINÁMICA DE BALANCE/DIFERENCIA */}
                                {viewingReq.estado !== "SIN_FIRMAR" && viewingReq.estado !== "PENDIENTE" && viewingReq.estado !== "APROBADO" && (
                                    <div className={`rounded-xl p-4 border flex items-center justify-between shadow-sm ${diferenciaMonto < 0
                                        ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                                        : diferenciaMonto > 0
                                            ? "bg-amber-50/50 border-amber-100 text-amber-800"
                                            : "bg-slate-50 border-slate-200 text-slate-700"
                                        }`}>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                                                {diferenciaMonto < 0 ? "⚠️ Monto a Reembolsar" : diferenciaMonto > 0 ? "💰 Monto a Devolver" : "✅ Rendición Cuadrada"}
                                            </p>
                                            <h2 className="text-2xl font-black tracking-tight">{formatearMoneda(Math.abs(diferenciaMonto))}</h2>
                                        </div>
                                    </div>
                                )}

                                {/* TABLA DE DETALLE DE GASTOS */}
                                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                                        <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                            Detalle de Gastos
                                        </h4>
                                        {/* Botón condicional simplificado */}
                                        {puedeEditarGasto() && (
                                            ((viewingReq.tipo === "ADELANTO" || viewingReq.tipo === "VIATICOS") && viewingReq.estado === "PAGADO") ||
                                            (viewingReq.tipo === "REEMBOLSO" && viewingReq.estado === "APROBADO")
                                        ) && (
                                                <button
                                                    onClick={abrirModalNuevoGasto}
                                                    className="bg-[#800000] hover:bg-[#650000] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                                                >
                                                    <Plus size={13} /> Agregar Gasto
                                                </button>
                                            )}
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left border-collapse">
                                            <thead className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                <tr>
                                                    <th className="p-3 text-center w-12">#</th>
                                                    <th className="p-3">Fecha</th>
                                                    <th className="p-3">Tipo</th>
                                                    <th className="p-3">N° Doc</th>
                                                    <th className="p-3">Detalle</th>
                                                    <th className="p-3 text-right">Monto</th>
                                                    <th className="p-3 text-center w-24">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium text-[13px]">
                                                {gastos.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">
                                                            No hay gastos registrados en esta solicitud.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    gastos.map((g, idx) => (
                                                        <tr key={g.id} className="hover:bg-slate-50/40 transition-colors">
                                                            <td className="p-3 text-center text-slate-400 font-bold">{idx + 1}</td>
                                                            <td className="p-3 whitespace-nowrap">{g.fecha?.slice(0, 10)}</td>
                                                            <td className="p-3"><span className="bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-600 font-semibold">{g.tipo_comprobante}</span></td>
                                                            <td className="p-3 font-mono text-xs">{g.numero_comprobante}</td>
                                                            <td className="p-3 max-w-xs truncate">{g.descripcion}</td>
                                                            <td className="p-3 text-right font-bold text-slate-700">{formatearMoneda(g.monto)}</td>
                                                            <td className="p-3 text-center whitespace-nowrap">
                                                                {puedeEditarGasto() && (
                                                                    <div className="inline-flex items-center gap-1">
                                                                        <button onClick={() => abrirModalEditarGasto(g)} className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"><Pencil size={13} /></button>
                                                                        <button onClick={() => eliminarGasto(g.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={13} /></button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                            <tfoot className="bg-slate-50/80 border-t border-slate-200 text-slate-700 font-bold">
                                                <tr>
                                                    <td colSpan="5" className="p-3 text-right text-xs uppercase tracking-wider text-slate-400">Total Rendido:</td>
                                                    <td className="p-3 text-right text-base font-extrabold text-emerald-600">{formatearMoneda(montoRendidoReal)}</td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>

                                {/* ADJUNTOS DE RENDICIÓN Y TESORERÍA */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Rendición */}
                                    {rendiciones.length > 0 && (
                                        <div className="border border-slate-200/60 rounded-xl p-4 bg-white shadow-sm">
                                            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">Archivos de Rendición</h4>
                                            <div className="space-y-1.5">
                                                {rendiciones.map(arch => (
                                                    <div key={arch.id} className="flex justify-between items-center bg-slate-50 hover:bg-slate-100/80 px-3 py-2 rounded-lg border border-slate-100 transition-colors group">
                                                        <span className="text-xs font-medium text-slate-600 truncate max-w-[80%]">{arch.nombre_original}</span>
                                                        <a href={`${API}${arch.ruta}`} target="_blank" rel="noreferrer" className="text-[#800000] hover:underline text-xs font-bold tracking-wider shrink-0 pl-2">VER</a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tesorería */}
                                    {archivosTesoreria.length > 0 && (
                                        <div className="border border-slate-200/60 rounded-xl p-4 bg-white shadow-sm">
                                            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">Archivos de Tesorería</h4>
                                            <div className="space-y-1.5">
                                                {archivosTesoreria.map(arch => (
                                                    <div key={arch.id} className="flex justify-between items-center bg-slate-50 hover:bg-slate-100/80 px-3 py-2 rounded-lg border border-slate-100 transition-colors group">
                                                        <span className="text-xs font-medium text-slate-600 truncate max-w-[80%]">{arch.nombre_original} <span className="text-slate-400 font-normal">({arch.tipo})</span></span>
                                                        <a href={`${API}${arch.ruta}`} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline text-xs font-bold tracking-wider shrink-0 pl-2">VER</a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* PIE DEL MODAL (BOTONES DE ACCIÓN) */}
                            <div className="bg-white border-t border-slate-100 px-6 py-4 flex flex-wrap items-center justify-end gap-2.5">

                                {puedeFirmar && viewingReq.estado === "SIN_FIRMAR" && (
                                    <button onClick={() => ejecutarFlujo("FIRMAR", viewingReq.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors">Firmar Solicitud</button>
                                )}

                                {puedeAprobar && viewingReq.estado === "PENDIENTE" && (
                                    <>
                                        <button onClick={() => ejecutarFlujo("APROBAR", viewingReq.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors">Aprobar</button>
                                        <button onClick={() => setShowRejectModal(true)} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold transition-colors">Rechazar</button>
                                    </>
                                )}

                                {puedePagar && (viewingReq.tipo === "ADELANTO" || viewingReq.tipo === "VIATICOS") && viewingReq.estado === "APROBADO" && (
                                    <button onClick={() => setShowPagoModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors">Registrar Pago</button>
                                )}

                                {puedePagar && viewingReq.tipo === "REEMBOLSO" && (viewingReq.estado === "POR_REEMBOLSAR" || viewingReq.estado === "EN_RENDICION") && (
                                    <button onClick={() => setShowPagoModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors">Registrar Reembolso</button>
                                )}

                                {((viewingReq.tipo === "ADELANTO" || viewingReq.tipo === "VIATICOS") && Number(currentUserId) === Number(viewingReq.solicitante_id) && viewingReq.estado === "PAGADO") && (
                                    <button onClick={() => setShowRendicionModal(true)} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors">Subir Rendición</button>
                                )}

                                {viewingReq.tipo === "REEMBOLSO" && Number(currentUserId) === Number(viewingReq.solicitante_id) && viewingReq.estado === "APROBADO" && (
                                    <button onClick={() => setShowRendicionModal(true)} className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors">Subir Sustento</button>
                                )}

                                {gastos.length > 0 && viewingReq.estado === "EN_RENDICION" && Number(currentUserId) === Number(viewingReq.solicitante_id) && (
                                    <button onClick={enviarRendicionATesoreria} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"><Send size={13} /> Enviar Rendición</button>
                                )}

                                {esTesoreria && (viewingReq.estado === "POR_DEVOLVER" || viewingReq.estado === "POR_REEMBOLSAR") && (
                                    <button onClick={() => setShowCerrarModal(true)} className="bg-slate-950 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors">Finalizar Rendición</button>
                                )}

                                <button onClick={() => setShowViewModal(false)} className="border border-slate-200 hover:bg-slate-50 text-slate-500 px-4 py-2 rounded-xl text-xs font-bold transition-colors">Cerrar Vista</button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* MODAL SUBIR ARCHIVOS RENDICION */}
            {showRendicionModal && (
                <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-white rounded-2xl p-6">
                        <h3 className="text-xl font-black mb-4">Subir {viewingReq?.tipo === "ADELANTO" || viewingReq?.tipo === "VIATICOS" ? "Rendición" : "Sustento"}</h3>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#800000]" onClick={() => document.getElementById("fileInput").click()}>
                            <UploadCloud className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-sm">Haz click para seleccionar archivos</p>
                            <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG</p>
                        </div>
                        <input id="fileInput" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setArchivosRendicion(Array.from(e.target.files || []))} />
                        {archivosRendicion.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-bold mb-2">Archivos seleccionados:</p>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {archivosRendicion.map((file, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                            <span className="text-sm">{file.name}</span>
                                            <button onClick={() => setArchivosRendicion(archivosRendicion.filter((_, i) => i !== idx))} className="text-red-500"><X size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex gap-3 mt-6">
                            <button onClick={enviarRendicion} className="flex-1 bg-[#800000] text-white py-2 rounded-xl font-bold">Subir</button>
                            <button onClick={() => { setShowRendicionModal(false); setArchivosRendicion([]); }} className="px-6 py-2 border rounded-xl">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL PAGO */}
            {showPagoModal && (
                <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-2xl p-6">
                        <h3 className="text-xl font-black mb-2">Registrar Pago</h3>
                        <p className="text-sm text-slate-500 mb-4">Suba el comprobante de transferencia</p>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setArchivoPago(e.target.files[0])} className="w-full border p-3 rounded-xl" />
                        {archivoPago && <div className="mt-3 text-sm">📎 {archivoPago.name}</div>}
                        <div className="flex gap-3 mt-6">
                            <button onClick={ejecutarPago} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl font-bold">Registrar</button>
                            <button onClick={() => { setShowPagoModal(false); setArchivoPago(null); }} className="px-6 py-2 border rounded-xl">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CIERRE */}
            {showCerrarModal && (
                <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-2xl p-6">
                        <h3 className="text-xl font-black mb-2">{viewingReq?.estado === "POR_DEVOLVER" ? "Registrar Devolución" : "Registrar Reembolso"}</h3>
                        <div className="bg-slate-100 p-4 rounded-xl mb-4"><p className="text-xs font-black">Diferencia</p><h2 className="text-2xl font-black">{formatearMoneda(Math.abs(diferenciaMonto))}</h2></div>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setArchivoCierre(e.target.files[0])} className="w-full border p-3 rounded-xl" />
                        {archivoCierre && <div className="mt-3 text-sm">📎 {archivoCierre.name}</div>}
                        <div className="flex gap-3 mt-6">
                            <button onClick={cerrarRendicion} className="flex-1 bg-black text-white py-2 rounded-xl font-bold">Finalizar</button>
                            <button onClick={() => { setShowCerrarModal(false); setArchivoCierre(null); }} className="px-6 py-2 border rounded-xl">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL GASTOS */}
            {showGastoModal && (
                <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-black">{editandoGasto ? "Editar Gasto" : "Nuevo Gasto"}</h3>
                            <button onClick={() => { setShowGastoModal(false); limpiarFormGasto(); }} className="text-slate-500">✕</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold">Fecha</label><input type="date" value={gastoForm.fecha} onChange={e => setGastoForm({ ...gastoForm, fecha: e.target.value })} className="w-full border rounded-lg p-2" /></div>
                            <div><label className="text-xs font-bold">Proveedor</label><input type="text" value={gastoForm.proveedor} onChange={e => setGastoForm({ ...gastoForm, proveedor: e.target.value })} className="w-full border rounded-lg p-2" /></div>
                            <div><label className="text-xs font-bold">Tipo Comprobante</label><select value={gastoForm.tipo_comprobante} onChange={e => setGastoForm({ ...gastoForm, tipo_comprobante: e.target.value })} className="w-full border rounded-lg p-2"><option value="">Seleccionar</option><option>Factura</option><option>Boleta</option><option>Ticket</option><option>RXH</option></select></div>
                            <div><label className="text-xs font-bold">Número Documento</label><input type="text" value={gastoForm.numero_comprobante} onChange={e => setGastoForm({ ...gastoForm, numero_comprobante: e.target.value })} className="w-full border rounded-lg p-2" /></div>
                            <div className="md:col-span-2"><label className="text-xs font-bold">Descripción</label><textarea rows="2" value={gastoForm.descripcion} onChange={e => setGastoForm({ ...gastoForm, descripcion: e.target.value })} className="w-full border rounded-lg p-2" /></div>
                            <div><label className="text-xs font-bold">Monto</label><input type="number" step="0.01" value={gastoForm.monto} onChange={e => setGastoForm({ ...gastoForm, monto: e.target.value })} className="w-full border rounded-lg p-2" /></div>
                            <div><label className="text-xs font-bold">Archivo (opcional)</label><input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => setGastoForm({ ...gastoForm, archivo: e.target.files[0] })} className="w-full border rounded-lg p-2" /></div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={editandoGasto ? actualizarGasto : agregarGasto} className="flex-1 bg-[#800000] text-white py-2 rounded-xl font-bold">Guardar</button>
                            <button onClick={() => { setShowGastoModal(false); limpiarFormGasto(); }} className="px-6 py-2 border rounded-xl">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL RECHAZO */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                    <div onClick={() => setShowRejectModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-red-700 to-red-900 px-6 py-4 text-white">
                            <h2 className="text-xl font-black">Rechazar Solicitud</h2>
                            <p className="text-sm text-red-100">Indique el motivo del rechazo</p>
                        </div>
                        <div className="p-6">
                            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} className="w-full border rounded-xl p-3" placeholder="Escriba las observaciones..." />
                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={() => setShowRejectModal(false)} className="border rounded-xl px-5 py-2 text-sm">Cancelar</button>
                                <button onClick={async () => { if (!rejectReason.trim()) return alert("Ingrese observaciones"); await ejecutarFlujo("RECHAZAR", viewingReq.id, rejectReason); setRejectReason(""); setShowRejectModal(false); }} className="bg-red-600 text-white rounded-xl px-5 py-2 text-sm">Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fondos;