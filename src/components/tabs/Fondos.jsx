import React, { useState, useEffect } from 'react';
import {
    Coins, RefreshCw, FileText, Users, Plus, Inbox, Eye, Pencil, Trash2, X,
    DollarSign, Calendar, Info, GitCommit, AlertTriangle, Check, UploadCloud
} from 'lucide-react';
import { API_BASE } from "../../config/api";

const API = API_BASE;
const FONDO_ASIGNADO = 10000;

// ============================================
// USUARIO ACTUAL
// ============================================
const Fondos = ({ user }) => {
    const currentUser = user || null;

    const currentUserId =
        currentUser?.id || null;

    const currentUserName =
        currentUser?.nombre || "";

    const currentRole =
        (currentUser?.tipo || "")
            .toLowerCase()
            .trim();

    const dept = (currentUser?.departamento || "")
        .toUpperCase()
        .trim();

    const currentDeptId =
        currentUser?.departamento_id || null;

    const currentDeptCode =
        currentUser?.departamento_codigo || "";

    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("mis");
    const [txtBuscar, setTxtBuscar] = useState("");
    const [selTipo, setSelTipo] = useState("todos");
    const [selEstado, setSelEstado] = useState("todos");
    const [showRendicionModal, setShowRendicionModal] = useState(false);
    const [archivosRendicion, setArchivosRendicion] = useState([]);
    const [rendiciones, setRendiciones] = useState([]);
    const [showPagoModal, setShowPagoModal] = useState(false);
    const [archivoPago, setArchivoPago] = useState(null);
    const [montoTesoreria, setMontoTesoreria] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const [showCerrarModal, setShowCerrarModal] = useState(false);
    const [archivoCierre, setArchivoCierre] = useState(null);
    const [archivosTesoreria, setArchivosTesoreria] = useState([]);

    const [editingReq, setEditingReq] = useState(null);
    const [viewingReq, setViewingReq] = useState(null);
    const [formError, setFormError] = useState("");
    const [showRejectModal, setShowRejectModal] =
        useState(false);

    const [rejectReason, setRejectReason] =
        useState("");



    // =========================
    // USUARIO LOGUEADO
    // =========================

    const usuarioSesion = JSON.parse(
        localStorage.getItem("usuario")
    );

    const traducirTipo = (tipo) => {
        switch (tipo) {
            case 'ADELANTO': return 'Anticipo';
            case 'REEMBOLSO': return 'Reembolso';
            case 'VIATICOS': return 'Viáticos';
            default: return tipo;
        }
    };

    // =========================
    // CARGAR SOLICITUDES
    // =========================

    useEffect(() => {
        obtenerSolicitudes();
    }, []);


    useEffect(() => {

        if (viewingReq?.id) {
            obtenerArchivosSolicitud(viewingReq.id);
        }

    }, [viewingReq]);

    useEffect(() => {

        if (!viewingReq) return;

        const montoSolicitado =
            Number(
                viewingReq?.monto_solicitado ||
                viewingReq?.monto ||
                0
            );

        const montoRendido =
            Number(
                viewingReq?.monto_rendido ||
                viewingReq?.total_rendido ||
                0
            );

        const diferencia =
            Math.abs(
                montoSolicitado - montoRendido
            );

        setMontoTesoreria(diferencia);

    }, [viewingReq]);

    const montoSolicitado =
        Number(
            viewingReq?.monto_solicitado ||
            viewingReq?.monto ||
            0
        );

    const montoRendido =
        Number(
            viewingReq?.monto_rendido ||
            viewingReq?.total_rendido ||
            0
        );

    const diferenciaMonto =
        montoSolicitado - montoRendido;

    // =========================
    // OBTENER SOLICITUDES
    // =========================

    const obtenerSolicitudes = async () => {

        try {

            setLoading(true);

            const res = await fetch(
                `${API}listar_solicitudes.php`
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data?.message || "Error al obtener solicitudes"
                );
            }

            setRegistros(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    };

    const obtenerArchivosSolicitud = async (id) => {

        try {

            const res = await fetch(
                `${API}listar_archivos_solicitud.php?id=${id}`
            );

            const data = await res.json();

            if (!data.success) return;

            const rend =
                data.archivos.filter(
                    a => a.tipo === "RENDICION"
                );

            const tes =
                data.archivos.filter(
                    a =>
                        a.tipo === "DEVOLUCION"
                        ||
                        a.tipo === "REEMBOLSO"
                        ||
                        a.tipo === "PAGO_TESORERIA"
                );

            setRendiciones(rend);

            setArchivosTesoreria(tes);

        } catch (err) {

            console.error(err);

        }
    };

    const obtenerRendiciones = async (solicitudId) => {

        try {

            const res = await fetch(
                `${API}listar_rendiciones.php?solicitud_id=${solicitudId}`
            );

            const data = await res.json();

            setRendiciones(data);

        } catch (err) {

            console.error(err);

        }
    };


    // =========================
    // ELIMINAR SOLICITUD
    // =========================

    const eliminarSolicitud = async (id) => {

        const confirmar = window.confirm(
            "¿Deseas eliminar esta solicitud?"
        );

        if (!confirmar) return;

        try {

            const res = await fetch(
                `${API}eliminar_solicitud.php?id=${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {

                throw new Error(
                    data?.message ||
                    "Error al eliminar"
                );
            }

            alert("Solicitud eliminada correctamente");
            await obtenerSolicitudes();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };
    // =========================
    // RESUMEN DE CAJA
    // =========================

    const {
        totalGastado,
        totalPendiente,
        disponible
    } = React.useMemo(() => {

        let gastado = 0;

        let pendientes = 0;

        registros.forEach(r => {

            const monto = parseFloat(
                r.monto_solicitado || 0
            );

            if (
                r.estado === 'APROBADO' ||
                r.estado === 'PAGADO' ||
                r.estado === 'CERRADO'
            ) {
                gastado += monto;
            }

            if (r.estado === 'PENDIENTE') {
                pendientes += 1;
            }

        });

        return {
            totalGastado: gastado,
            totalPendiente: pendientes,
            disponible: FONDO_ASIGNADO - gastado
        };

    }, [registros]);

    // =========================
    // PORCENTAJE
    // =========================

    const pctDisponible =
        (disponible / FONDO_ASIGNADO) * 100;

    // =========================
    // FORMATO MONEDA
    // =========================

    const formatearMoneda = (monto) => {

        return new Intl.NumberFormat(
            'es-PE',
            {
                style: 'currency',
                currency: 'PEN'
            }
        ).format(monto);

    };


    // =========================
    // FILTROS
    // =========================

    const registrosFiltrados = React.useMemo(() => {

        return registros.filter(reg => {

            // TAB

            const perteneceATab =
                activeTab === 'general'
                    ? true
                    : reg.solicitante_id === usuarioSesion?.id;

            // TEXTO

            const texto = txtBuscar.toLowerCase();

            const coincideTexto =
                (reg.codigo || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                (reg.concepto || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                (reg.empresa || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                (reg.sede || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                (reg.categoria || "")
                    .toLowerCase()
                    .includes(texto);

            // TIPO

            const coincideTipo =
                selTipo === 'todos'
                    ? true
                    : reg.tipo === selTipo;

            // ESTADO

            const coincideEstado =
                selEstado === 'todos'
                    ? true
                    : reg.estado === selEstado;

            return (
                perteneceATab &&
                coincideTexto &&
                coincideTipo &&
                coincideEstado
            );

        });

    }, [
        registros,
        activeTab,
        txtBuscar,
        selTipo,
        selEstado
    ]);

    // =========================
    // ABRIR CREAR
    // =========================

    const abrirModalCrear = () => {

        setFormError("");
        setEditingReq({
            id: "",
            codigo: "",
            tipo: "ADELANTO",
            fecha: new Date()
                .toISOString()
                .substring(0, 10),
            empresa: "",
            sede: "",
            categoria: "",
            monto_solicitado: "",
            concepto: "",
            estado: "PENDIENTE",
            firma_digital: ""
        });

        setShowModal(true);
    };

    const abrirModalEditar = (id) => {
        setFormError("");
        const reg = registros.find(
            r => r.id === id
        );
        if (!reg) return;
        setEditingReq({
            id: reg.id,
            codigo: reg.codigo || "",
            empresa: reg.empresa || "",
            sede: reg.sede || "",
            categoria: reg.categoria || "",
            concepto: reg.concepto || "",
            monto_solicitado: reg.monto_solicitado || "",
            estado: reg.estado || "PENDIENTE",
            fecha: reg.fecha || "",
            firma_digital: reg.firma_digital || "",
            // NORMALIZAR TIPO
            tipo: reg.tipo === "Adelanto" ? "ADELANTO" :
                reg.tipo === "Reembolso" ? "REEMBOLSO" :
                    reg.tipo === "Viaticos" ? "VIATICOS" :
                        reg.tipo || "ADELANTO"
        });
        setShowModal(true);
    };

    const abrirModalVisualizar = (id) => {

        const reg = registros.find(
            r => r.id === id
        );

        if (reg) {

            setViewingReq(reg);

            setShowViewModal(true);

            obtenerRendiciones(reg.id);
        }
    };

    const guardarRegistro = async (e) => {

        e.preventDefault();

        setFormError("");

        try {

            // =========================================
            // VALIDACIONES
            // =========================================

            if (
                !editingReq.empresa ||
                !editingReq.sede ||
                !editingReq.categoria ||
                !editingReq.concepto ||
                !editingReq.monto_solicitado
            ) {

                setFormError(
                    "Completa todos los campos obligatorios."
                );

                return;
            }

            if (
                parseFloat(editingReq.monto_solicitado) <= 0
            ) {

                setFormError(
                    "El monto debe ser mayor a cero."
                );

                return;
            }

            // =========================================
            // NORMALIZAR TIPO
            // =========================================

            let tipoNormalizado = "ADELANTO";
            if (editingReq.tipo === "REEMBOLSO" || editingReq.tipo === "Reembolso") {
                tipoNormalizado = "REEMBOLSO";
            } else if (editingReq.tipo === "VIATICOS" || editingReq.tipo === "Viaticos") {
                tipoNormalizado = "VIATICOS";
            }
            // =========================================
            // ACTUALIZAR
            // =========================================

            if (editingReq.id) {

                const payload = {

                    id: editingReq.id,

                    empresa: editingReq.empresa,

                    sede: editingReq.sede,

                    tipo: tipoNormalizado,

                    categoria: editingReq.categoria,

                    concepto: editingReq.concepto,

                    monto_solicitado:
                        editingReq.monto_solicitado,

                    estado: editingReq.estado
                };

                const res = await fetch(
                    `${API}actualizar_solicitud.php`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    }
                );

                const data = await res.json();

                if (data.success) {

                    alert(
                        "Solicitud actualizada correctamente"
                    );

                    await obtenerSolicitudes();

                    setShowModal(false);

                } else {

                    setFormError(
                        data.message ||
                        "No se pudo actualizar"
                    );
                }

            }

            // =========================================
            // CREAR
            // =========================================
            else {

                const payload = {
                    solicitante_id: currentUserId,
                    departamento_id: currentDeptId,
                    empresa: editingReq.empresa,
                    sede: editingReq.sede,
                    tipo: tipoNormalizado,
                    categoria: editingReq.categoria,
                    concepto: editingReq.concepto,
                    monto_solicitado: editingReq.monto_solicitado,
                    firma_digital: editingReq.firma_digital || ""
                };

                const res = await fetch(
                    `${API}crear_solicitud.php`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    }
                );
                const data = await res.json();
                if (data.success) {
                    alert(
                        "Solicitud registrada correctamente"
                    );
                    await obtenerSolicitudes();
                    setShowModal(false);
                } else {
                    setFormError(
                        data.message ||
                        "No se pudo registrar"
                    );
                }
            }

        } catch (error) {
            console.error(error);
            setFormError(
                "Error de conexión con el servidor."
            );
        }
    };

    // ============================================
    // EJECUTAR FLUJO
    // ============================================

    const ejecutarFlujo = async (
        accion,
        solicitudId,
        observacion = ""
    ) => {

        try {

            // =========================
            // VALIDACIÓN LOCAL
            // =========================

            if (!currentUserId) {
                alert("Usuario no válido");
                return;
            }

            const payload = {
                solicitud_id: solicitudId,
                accion,
                usuario_id: currentUserId,
                observacion: observacion.trim()
            };

            console.log("FLUJO PAYLOAD:", payload);

            const res = await fetch(
                `${API}flujo_fondos.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await res.json();

            console.log("FLUJO RESPONSE:", data);

            if (!data.success) {
                alert(data.message || "Error en el flujo");
                return;
            }

            alert(data.message);

            // =========================
            // OPTIMIZADO: SOLO UNA RECARGA
            // =========================

            await obtenerSolicitudes();

            // =========================
            // ACTUALIZAR MODAL SIN FETCH EXTRA
            // =========================

            setViewingReq(prev =>
                prev?.id === solicitudId
                    ? {
                        ...prev,
                        estado: data.estado || prev.estado
                    }
                    : prev
            );

        } catch (error) {

            console.error(error);

            alert("Error de conexión con el servidor");
        }
    };

    // ============================================
    // PERMISOS
    // ============================================

    const esTIC = dept === "TIC";
    const esAdministracion =
        dept.includes("ADMIN");
    const esTesoreria = dept === "TESORERIA";

    const esJefe =
        currentRole === "jefe";

    const esAsistente =
        currentRole === "asistente";

    // ============================================
    // PERMISOS DE FLUJO
    // ============================================

    const puedeEditar =
        viewingReq &&
        Number(currentUserId) === Number(viewingReq.solicitante_id) &&
        viewingReq.estado === "SIN_FIRMAR";

    // TIC = acceso total

    const puedeAprobar =
        esTIC ||
        (esAdministracion && esJefe);

    // TESORERIA = pagar
    const puedePagar =
        esTIC ||
        esTesoreria;

    // JEFE SOLICITANTE = firmar

    const puedeFirmar =
        viewingReq &&
        Number(currentUserId) === Number(viewingReq.solicitante_id) &&
        esJefe;


    const enviarRendicion = async () => {

        // =========================================
        // VALIDACIONES
        // =========================================

        if (!viewingReq?.id) {
            alert("Solicitud inválida");
            return;
        }

        if (!currentUserId) {
            alert("Usuario inválido");
            return;
        }

        if (archivosRendicion.length === 0) {
            alert("Debe seleccionar archivos");
            return;
        }

        try {

            const formData = new FormData();

            // =========================================
            // DATA
            // =========================================

            formData.append(
                "solicitud_id",
                viewingReq.id
            );

            formData.append(
                "usuario_id",
                currentUserId
            );

            // =========================================
            // ARCHIVOS
            // =========================================

            archivosRendicion.forEach(file => {

                formData.append(
                    "files[]",
                    file
                );

            });

            // DEBUG
            console.log("ENVIANDO RENDICION...");
            console.log("SOLICITUD:", viewingReq.id);
            console.log("USUARIO:", currentUserId);
            console.log("FILES:", archivosRendicion);

            // =========================================
            // REQUEST
            // =========================================

            const res = await fetch(
                `${API}subir_rendicion.php`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await res.json();

            console.log("RESPUESTA:", data);

            if (!data.success) {

                alert(
                    data.message ||
                    "Error al subir rendición"
                );

                return;
            }

            // =========================================
            // OK
            // =========================================

            alert(
                "Rendición subida correctamente"
            );

            setShowRendicionModal(false);

            setArchivosRendicion([]);

            await obtenerSolicitudes();

            // =========================================
            // ACTUALIZAR MODAL
            // =========================================

            setViewingReq(prev => ({
                ...prev,
                estado: "EN_RENDICION"
            }));

        } catch (err) {

            console.error(err);

            alert(
                "Error al subir rendición"
            );
        }
    };

    const ejecutarPago = async () => {

        try {

            // =========================================
            // VALIDACIONES
            // =========================================

            if (!viewingReq?.id) {

                alert("Solicitud inválida");
                return;
            }

            if (!currentUserId) {

                alert("Usuario inválido");
                return;
            }

            if (!archivoPago) {

                alert("Debe seleccionar un comprobante");
                return;
            }

            // =========================================
            // DEBUG
            // =========================================

            console.log("=== REGISTRANDO PAGO ===");

            console.log({
                solicitud_id: viewingReq.id,
                usuario_id: currentUserId,
                estado: viewingReq.estado,
                tipo: viewingReq.tipo,
                archivo: archivoPago
            });

            // =========================================
            // FORM DATA
            // =========================================

            const formData = new FormData();

            formData.append(
                "solicitud_id",
                String(viewingReq.id)
            );

            formData.append(
                "usuario_id",
                String(currentUserId)
            );

            formData.append(
                "comprobante",
                archivoPago
            );

            // =========================================
            // REQUEST
            // =========================================

            const response = await fetch(
                `${API}pago_tesoreria.php`,
                {
                    method: "POST",
                    body: formData
                }
            );

            // DEBUG RAW
            const raw = await response.text();

            console.log("RAW RESPONSE:", raw);

            let data;

            try {

                data = JSON.parse(raw);

            } catch (e) {

                console.error("JSON INVALIDO:", e);

                alert("El servidor devolvió una respuesta inválida");

                return;
            }

            console.log("DATA:", data);

            // =========================================
            // ERROR
            // =========================================

            if (!data.success) {

                alert(
                    data.message ||
                    "Error al registrar pago"
                );

                return;
            }

            // =========================================
            // SUCCESS
            // =========================================

            alert("Pago registrado correctamente");

            setShowPagoModal(false);

            setArchivoPago(null);

            // =========================================
            // RECARGAR
            // =========================================

            await obtenerSolicitudes();

            // =========================================
            // ACTUALIZAR MODAL
            // =========================================

            setViewingReq(prev => ({

                ...prev,

                estado:
                    viewingReq.tipo === "REEMBOLSO"
                        ? "PAGADO"
                        : "PAGADO"
            }));

        } catch (err) {

            console.error(err);

            alert("Error al registrar pago");
        }
    };

    const cerrarRendicion = async () => {

        if (!archivoCierre) {

            alert("Debe subir comprobante");

            return;
        }

        const formData = new FormData();

        formData.append(
            "solicitud_id",
            viewingReq.id
        );

        formData.append(
            "usuario_id",
            currentUserId
        );

        formData.append(
            "comprobante",
            archivoCierre
        );

        try {

            const res = await fetch(
                `${API}cerrar_rendicion.php`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await res.json();

            if (!data.success) {

                alert(data.message);

                return;
            }

            alert(data.message);

            setShowCerrarModal(false);

            setArchivoCierre(null);

            await obtenerSolicitudes();

            setViewingReq(prev => ({
                ...prev,
                estado: "CERRADO"
            }));

        } catch (error) {

            console.error(error);

            alert("Error al cerrar rendición");
        }
    };

    const diferencia = Number(
        viewingReq?.diferencia || 0
    );

    const hayReembolso =
        diferencia < 0;

    const hayDevolucion =
        diferencia > 0;

    const rendicionCuadrada =
        diferencia === 0;

    const esReembolsoOViaticos = viewingReq?.tipo === "REEMBOLSO" || viewingReq?.tipo === "VIATICOS";
    const pasosFlujo = esReembolsoOViaticos
        ? [
            {
                key: "PENDIENTE",
                title: "Solicitud Registrada",
                desc: "Solicitud creada por el departamento solicitante."
            },
            {
                key: "APROBADO",
                title: "Aprobación Administrativa",
                desc: "ADMINISTRACION validó la solicitud."
            },
            {
                key: "EN_RENDICION",
                title: "Rendición Enviada",
                desc: "El solicitante adjuntó los comprobantes."
            },
            {
                key: "CERRADO",
                title: "Reembolso Finalizado",
                desc: "TESORERIA realizó el reembolso."
            }
        ]
        : [
            {
                key: "PENDIENTE",
                title: "Solicitud Registrada",
                desc: "Solicitud creada por el departamento solicitante."
            },
            {
                key: "APROBADO",
                title: "Aprobación Administrativa",
                desc: "ADMINISTRACION validó y aprobó la solicitud."
            },
            {
                key: "PAGADO",
                title: "Pago Tesorería",
                desc: "TESORERIA realizó el desembolso."
            },
            {
                key: "EN_RENDICION",
                title: "En Rendición",
                desc: "Pendiente de sustento documentario."
            },
            {
                key: "CERRADO",
                title: "Proceso Cerrado",
                desc: "Solicitud finalizada correctamente."
            }
        ];

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased flex flex-col justify-between">

            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 backdrop-blur-sm">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">

                    {/* IZQUIERDA */}
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-[#800000] to-black p-3.5 rounded-2xl shadow-xl shadow-red-950/20 border border-[#800000]/20">
                            <Coins className="w-7 h-7 text-white" strokeWidth={2.2} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800 leading-none">
                                Gestión de Fondos
                            </h1>

                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-2">
                                Solicitudes · Rendiciones · Fondos
                            </p>
                        </div>
                    </div>

                    {/* DERECHA */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">

                        <button
                            onClick={obtenerSolicitudes}
                            className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm group"
                        >
                            <RefreshCw className="w-4 h-4 text-slate-500 group-hover:rotate-180 transition-transform duration-500" />

                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                                Actualizar
                            </span>
                        </button>

                        <div className="bg-slate-100 rounded-2xl px-4 py-3 border border-slate-200 min-w-[220px]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    Solicitudes Totales
                                </span>

                                <span className="text-[10px] font-black text-emerald-600 uppercase">
                                    Activo
                                </span>
                            </div>

                            <div className="text-2xl font-black text-slate-800 leading-none">
                                {registros.length}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* CUERPO PRINCIPAL */}
            <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 md:px-8 py-8">

                {/* TOP ACTIONS */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-8">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                        {/* TABS */}
                        <div className="flex flex-wrap items-center gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
                            <button
                                onClick={() => setActiveTab("mis")}
                                className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === "mis"
                                    ? "bg-[#800000] text-white shadow-lg shadow-red-900/20"
                                    : "text-slate-500 hover:bg-slate-100"
                                    }`}
                            >
                                <FileText className="w-4 h-4" strokeWidth={2} />
                                Mis Solicitudes
                            </button>

                            <button
                                onClick={() => setActiveTab("general")}
                                className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === "general"
                                    ? "bg-[#800000] text-white shadow-lg shadow-red-900/20"
                                    : "text-slate-500 hover:bg-slate-100"
                                    }`}
                            >
                                <Users className="w-4 h-4" strokeWidth={2} />
                                Vista General
                            </button>
                        </div>

                        {/* BOTÓN NUEVO */}
                        <button
                            onClick={abrirModalCrear}
                            className="bg-gradient-to-r from-[#800000] to-black hover:scale-[1.02] active:scale-[0.98] text-white px-6 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-950/20"
                        >
                            <Plus className="w-5 h-5" strokeWidth={3} />
                            <span className="font-black text-[11px] uppercase tracking-[0.18em]">
                                Nueva Solicitud
                            </span>
                        </button>
                    </div>
                </div>

                {/* FILTROS */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">

                    <div className="p-5 border-b border-slate-100 bg-slate-50/40">
                        <div className="flex flex-col lg:flex-row gap-4">

                            {/* BUSCADOR */}
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </span>

                                <input
                                    type="text"
                                    value={txtBuscar}
                                    onChange={(e) => setTxtBuscar(e.target.value)}
                                    placeholder="Buscar por código, solicitante, concepto o proveedor..."
                                    className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#800000]/10 focus:border-[#800000] transition-all"
                                />
                            </div>

                            {/* SELECTS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:w-[360px]">

                                <select
                                    value={selTipo}
                                    onChange={(e) => setSelTipo(e.target.value)}
                                    className="h-12 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 focus:outline-none focus:ring-4 focus:ring-[#800000]/10 focus:border-[#800000]"
                                >
                                    <option value="todos">Todos los Tipos</option>
                                    <option value="ADELANTO">Anticipo</option>
                                    <option value="REEMBOLSO">Reembolso</option>
                                    <option value="VIATICOS">Viáticos</option>
                                </select>

                                <select
                                    value={selEstado}
                                    onChange={(e) => setSelEstado(e.target.value)}
                                    className="h-12 px-4 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 focus:outline-none focus:ring-4 focus:ring-[#800000]/10 focus:border-[#800000]"
                                >
                                    <option value="todos">Todos los Estados</option>
                                    <option value="PENDIENTE">Pendiente</option>
                                    <option value="APROBADO">Aprobado</option>
                                    <option value="PAGADO">Pagado</option>
                                    <option value="CERRADO">Cerrado</option>
                                    <option value="RECHAZADO">Rechazado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* TABLA */}
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1100px]">
                            <thead className="bg-slate-50">
                                <tr>

                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 border-b border-slate-200">
                                        Código
                                    </th>

                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 border-b border-slate-200">
                                        Solicitante
                                    </th>

                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 border-b border-slate-200">
                                        Concepto
                                    </th>

                                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 border-b border-slate-200">
                                        Estado
                                    </th>

                                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 border-b border-slate-200">
                                        Monto
                                    </th>

                                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 border-b border-slate-200">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 bg-white">
                                {registrosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center">
                                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5 border border-slate-200">
                                                {/* Icono de estado vacío */}
                                                <Inbox className="w-9 h-9 text-slate-300" strokeWidth={1.8} />
                                            </div>

                                            <h3 className="text-base font-black text-slate-700 uppercase">
                                                No hay solicitudes
                                            </h3>

                                            <p className="text-sm text-slate-400 mt-2">
                                                No se encontraron registros con los filtros actuales.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    registrosFiltrados.map((reg) => {
                                        const badge =
                                            reg.estado === "PENDIENTE"
                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                : reg.estado === "APROBADO"
                                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                                    : reg.estado === "PAGADO"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : reg.estado === "CERRADO"
                                                            ? "bg-slate-100 text-slate-700 border-slate-200"
                                                            : "bg-red-50 text-red-700 border-red-200";

                                        return (
                                            <tr
                                                key={reg.id}
                                                className="hover:bg-slate-50/70 transition-all"
                                            >
                                                {/* CÓDIGO */}
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-[#800000]">
                                                            {reg.codigo}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                                                            {reg.created_at}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* SOLICITANTE */}
                                                <td className="px-6 py-5">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700">
                                                            {reg.solicitante || "Sin nombre"}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 uppercase font-bold mt-1">
                                                            {reg.empresa} • {reg.sede}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* CONCEPTO */}
                                                <td className="px-6 py-5">
                                                    <div className="max-w-[280px]">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-slate-100 text-slate-700 mb-2">
                                                            {traducirTipo(reg.tipo)}
                                                        </span>
                                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                                            {reg.concepto}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* ESTADO */}
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.15em] ${badge}`}>
                                                        {reg.estado}
                                                    </span>
                                                </td>

                                                {/* MONTO */}
                                                <td className="px-6 py-5 text-right">
                                                    <span className="text-sm font-black text-slate-800">
                                                        {formatearMoneda(reg.monto_solicitado)}
                                                    </span>
                                                </td>

                                                {/* ACCIONES */}
                                                <td className="px-6 py-5">
                                                    <div className="flex justify-end gap-2">
                                                        {/* Botón Visualizar */}
                                                        <button
                                                            onClick={() => abrirModalVisualizar(reg.id)}
                                                            className="w-10 h-10 rounded-xl border border-slate-200 hover:border-[#800000]/20 hover:bg-[#800000]/5 flex items-center justify-center text-slate-500 hover:text-[#800000] transition-all"
                                                            title="Visualizar"
                                                        >
                                                            <Eye className="w-4 h-4" strokeWidth={2.3} />
                                                        </button>

                                                        {/* Botón Editar */}
                                                        {puedeEditar && (
                                                            <button
                                                                onClick={() => abrirEditar(viewingReq)}
                                                                className="w-10 h-10 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-700 transition-all"
                                                                title="Editar"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* Botón Eliminar */}
                                                        <button
                                                            onClick={() => eliminarSolicitud(reg.id)}
                                                            className="w-10 h-10 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 flex items-center justify-center text-slate-500 hover:text-red-600 transition-all"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-4 h-4" strokeWidth={2.3} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* FOOTER */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3">

                        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                            {registrosFiltrados.length} registro(s) encontrados
                        </span>

                        <div className="flex items-center gap-2">

                            <button className="px-4 h-10 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-wider text-slate-400 cursor-not-allowed">
                                Anterior
                            </button>

                            <button className="px-4 h-10 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-wider text-slate-400 cursor-not-allowed">
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {showModal && editingReq && (

                <div className="fixed inset-0 z-50 overflow-y-auto">

                    <div className="flex min-h-screen items-center justify-center p-4">

                        {/* OVERLAY */}
                        <div
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* MODAL */}
                        <div className="relative w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl border border-slate-200">

                            {/* HEADER */}
                            <div className="bg-gradient-to-r from-[#800000] via-[#650000] to-black px-7 py-6">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <h2 className="text-lg font-black uppercase tracking-wide text-white">

                                            {editingReq.id
                                                ? `Editar Solicitud ${editingReq.codigo || ""}`
                                                : "Nueva Solicitud de Fondos"}

                                        </h2>

                                        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-red-100 font-semibold">
                                            Caja Chica • Gestión Financiera
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* BODY */}
                            <form
                                onSubmit={guardarRegistro}
                                className="max-h-[85vh] overflow-y-auto px-7 py-6 space-y-6 bg-slate-50/40"
                            >

                                {/* ERROR */}
                                {formError && (

                                    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-700 text-sm font-semibold">

                                        {formError}

                                    </div>
                                )}

                                {/* DATOS */}
                                <div className="rounded-3xl border border-slate-200 bg-white p-5">

                                    <h3 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-slate-700">

                                        Datos Generales

                                    </h3>

                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                        {/* TIPO */}
                                        <div>
                                            <label className="mb-2 block text-[11px] font-black uppercase text-slate-500">
                                                Tipo
                                            </label>

                                            <select
                                                value={editingReq.tipo || "ADELANTO"}
                                                onChange={(e) =>
                                                    setEditingReq(prev => ({
                                                        ...prev,
                                                        tipo: e.target.value
                                                    }))
                                                }
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                            >
                                                <option value="ADELANTO">Anticipo</option>
                                                <option value="REEMBOLSO">Reembolso</option>
                                                <option value="VIATICOS">Viáticos</option>
                                            </select>
                                        </div>

                                        {/* EMPRESA */}
                                        <div>

                                            <label className="mb-2 block text-[11px] font-black uppercase text-slate-500">

                                                Empresa

                                            </label>

                                            <input
                                                type="text"
                                                value={editingReq.empresa || ""}
                                                onChange={(e) =>
                                                    setEditingReq(prev => ({
                                                        ...prev,
                                                        empresa: e.target.value
                                                    }))
                                                }
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                            />
                                        </div>

                                        {/* SEDE */}
                                        <div>

                                            <label className="mb-2 block text-[11px] font-black uppercase text-slate-500">

                                                Sede

                                            </label>

                                            <input
                                                type="text"
                                                value={editingReq.sede || ""}
                                                onChange={(e) =>
                                                    setEditingReq(prev => ({
                                                        ...prev,
                                                        sede: e.target.value
                                                    }))
                                                }
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                            />
                                        </div>

                                        {/* CATEGORIA */}
                                        <div>

                                            <label className="mb-2 block text-[11px] font-black uppercase text-slate-500">

                                                Categoría

                                            </label>

                                            <input
                                                type="text"
                                                value={editingReq.categoria || ""}
                                                onChange={(e) =>
                                                    setEditingReq(prev => ({
                                                        ...prev,
                                                        categoria: e.target.value
                                                    }))
                                                }
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                            />
                                        </div>

                                        {/* MONTO */}
                                        <div>

                                            <label className="mb-2 block text-[11px] font-black uppercase text-slate-500">

                                                Monto Solicitado

                                            </label>

                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editingReq.monto_solicitado || ""}
                                                onChange={(e) =>
                                                    setEditingReq(prev => ({
                                                        ...prev,
                                                        monto_solicitado: e.target.value
                                                    }))
                                                }
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                            />
                                        </div>

                                        {/* ESTADO */}
                                        {editingReq.id && (

                                            <div>

                                                <label className="mb-2 block text-[11px] font-black uppercase text-slate-500">

                                                    Estado

                                                </label>

                                                <select
                                                    value={editingReq.estado || "PENDIENTE"}
                                                    onChange={(e) =>
                                                        setEditingReq(prev => ({
                                                            ...prev,
                                                            estado: e.target.value
                                                        }))
                                                    }
                                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                                >

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

                                {/* CONCEPTO */}
                                <div className="rounded-3xl border border-slate-200 bg-white p-5">

                                    <h3 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-slate-700">

                                        Concepto

                                    </h3>

                                    <textarea
                                        rows="4"
                                        value={editingReq.concepto || ""}
                                        onChange={(e) =>
                                            setEditingReq(prev => ({
                                                ...prev,
                                                concepto: e.target.value
                                            }))
                                        }
                                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                                    />
                                </div>

                                {/* FOOTER */}
                                <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-black uppercase"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="rounded-2xl bg-gradient-to-r from-[#800000] to-black px-6 py-3 text-xs font-black uppercase text-white"
                                    >

                                        {editingReq.id
                                            ? "Actualizar Solicitud"
                                            : "Registrar Solicitud"}

                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DETALLE SOLICITUD */}
            {showViewModal && viewingReq && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        {/* OVERLAY */}
                        <div
                            onClick={() => setShowViewModal(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        />
                        {/* MODAL */}
                        <div className="relative w-full max-w-2xl overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                            {/* HEADER */}
                            <div className="relative overflow-hidden bg-gradient-to-r from-[#800000] via-[#650000] to-black px-8 py-8 text-white">

                                {/* Círculos decorativos mejor posicionados */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none">
                                    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white blur-sm" />
                                    <div className="absolute -bottom-10 left-10 h-28 w-28 rounded-full bg-white blur-sm" />
                                </div>

                                {/* BOTÓN CERRAR */}
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition-all duration-300 hover:rotate-90 hover:bg-white/20 active:scale-95"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <div className="relative">
                                    {/* Código de requerimiento */}
                                    <div className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1">
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-100">
                                            {viewingReq.codigo || viewingReq.id}
                                        </span>
                                    </div>

                                    {/* Título principal */}
                                    <h2 className="max-w-xl text-2xl font-black uppercase leading-tight tracking-tight drop-shadow-sm">
                                        {viewingReq.concepto}
                                    </h2>

                                    {/* Badges de Tipo y Categoría */}
                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border ${viewingReq.tipo === "ADELANTO" ? "bg-blue-500/20 text-blue-100 border-blue-400/20" :
                                            viewingReq.tipo === "REEMBOLSO" ? "bg-amber-500/20 text-amber-100 border-amber-400/20" :
                                                "bg-purple-500/20 text-purple-100 border-purple-400/20"
                                            }`}>
                                            {traducirTipo(viewingReq.tipo)}
                                        </span>

                                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-100">
                                            {viewingReq.categoria}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* BODY */}
                            <div className="max-h-[75vh] overflow-y-auto bg-gradient-to-b from-white to-slate-50/60 p-8 space-y-6">

                                {/* RESUMEN DE TARJETAS PRINCIPALES */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                                    {/* MONTO */}
                                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 flex flex-col justify-between shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600">
                                                Monto Solicitado
                                            </p>
                                            <DollarSign className="h-4 w-4 text-emerald-500" />
                                        </div>
                                        <h3 className="mt-4 text-2xl font-black text-emerald-700 tracking-tight">
                                            {formatearMoneda(viewingReq.monto_solicitado || viewingReq.monto)}
                                        </h3>
                                    </div>

                                    {/* FECHA */}
                                    <div className="rounded-2xl border border-slate-100 bg-white p-5 flex flex-col justify-between shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                                Fecha de Registro
                                            </p>
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <h3 className="mt-4 text-sm font-black text-slate-700">
                                            {viewingReq.fecha || viewingReq.created_at}
                                        </h3>
                                    </div>

                                    {/* ESTADO */}
                                    <div className="rounded-2xl border border-slate-100 bg-white p-5 flex flex-col justify-between shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                                Estado Actual
                                            </p>
                                            <Info className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div className="mt-4">
                                            <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${viewingReq.estado === "PENDIENTE" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                                                viewingReq.estado === "APROBADO" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                                    viewingReq.estado === "PAGADO" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                                        viewingReq.estado === "RECHAZADO" ? "bg-red-50 text-red-700 border border-red-100" :
                                                            "bg-slate-50 text-slate-700 border border-slate-100"
                                                }`}>
                                                {viewingReq.estado}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* INFORMACIÓN GENERAL */}
                                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                    <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <div className="h-2.5 w-2.5 rounded-full bg-[#800000]" />
                                        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-700">
                                            Información General
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Solicitante</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                {viewingReq.solicitante || "No registrado"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Empresa</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">{viewingReq.empresa}</p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sede</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">{viewingReq.sede}</p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categoría</p>
                                            <p className="mt-1 text-sm font-semibold text-slate-800">{viewingReq.categoria}</p>
                                        </div>
                                    </div>

                                    {/* CONCEPTO / JUSTIFICACIÓN */}
                                    <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Concepto / Justificación</p>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                            {viewingReq.concepto}
                                        </p>
                                    </div>
                                </div>

                                {/* SECCIÓN COMPROBANTE (CONDICIONAL) */}
                                {(viewingReq.proveedor || viewingReq.numero_comprobante || viewingReq.nroComprobante) && (
                                    <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6 shadow-sm">
                                        <div className="mb-4 flex items-center gap-2">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-amber-800">
                                                Datos del Comprobante
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700/70">Proveedor</p>
                                                <p className="mt-1 text-sm font-semibold text-slate-800">{viewingReq.proveedor}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700/70">Número Documento</p>
                                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                                    {viewingReq.numero_comprobante || viewingReq.nroComprobante}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SEGUIMIENTO DEL FLUJO */}
                                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

                                    {/* HEADER */}
                                    <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                                        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-700">
                                            Seguimiento del Flujo
                                        </h3>
                                    </div>

                                    <div className="mb-8 rounded-2xl border border-slate-100 bg-slate-50/70 p-6">

                                        <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">

                                            <div>
                                                <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-700">
                                                    Acciones Disponibles
                                                </h3>

                                                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                    DEPARTAMENTO ACTUAL: {currentDeptId || "SIN DEPARTAMENTO"}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-[#800000] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                                                {currentRole || "SIN ROL"}
                                            </div>
                                        </div>

                                        {viewingReq?.estado !== "SIN_FIRMAR" && (

                                            <div
                                                className={`rounded-2xl px-5 py-4 border ${diferenciaMonto < 0
                                                    ? "border-emerald-100 bg-emerald-50"
                                                    : diferenciaMonto > 0
                                                        ? "border-amber-100 bg-amber-50"
                                                        : "border-slate-200 bg-slate-50"
                                                    }`}
                                            >

                                                {/* HEADER */}

                                                <div className="flex items-start justify-between gap-4">

                                                    <div>

                                                        <p
                                                            className={`text-[10px] font-black uppercase tracking-widest ${diferenciaMonto < 0
                                                                ? "text-emerald-700"
                                                                : diferenciaMonto > 0
                                                                    ? "text-amber-700"
                                                                    : "text-slate-600"
                                                                }`}
                                                        >

                                                            {diferenciaMonto < 0
                                                                ? "MONTO A REEMBOLSAR"
                                                                : diferenciaMonto > 0
                                                                    ? "MONTO A DEVOLVER"
                                                                    : "RENDICIÓN CUADRADA"}

                                                        </p>

                                                        <h3
                                                            className={`mt-2 text-3xl font-black ${diferenciaMonto < 0
                                                                ? "text-emerald-700"
                                                                : diferenciaMonto > 0
                                                                    ? "text-amber-700"
                                                                    : "text-slate-700"
                                                                }`}
                                                        >

                                                            S/ {Math.abs(diferenciaMonto).toFixed(2)}

                                                        </h3>

                                                    </div>

                                                    {(esTesoreria || puedePagar) && (

                                                        <div className="w-[220px]">

                                                            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                                MONTO A PROCESAR
                                                            </label>

                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={montoTesoreria}
                                                                onChange={(e) =>
                                                                    setMontoTesoreria(
                                                                        Number(e.target.value)
                                                                    )
                                                                }
                                                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none transition-all focus:border-[#800000] focus:ring-4 focus:ring-red-100"
                                                                placeholder="0.00"
                                                            />

                                                        </div>

                                                    )}

                                                </div>

                                                {/* MENSAJE */}

                                                <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 border border-white/60">

                                                    <p className="text-xs leading-relaxed text-slate-600">

                                                        {diferenciaMonto < 0
                                                            ? "El solicitante gastó MÁS de lo entregado. TESORERÍA debe reembolsar la diferencia."
                                                            : diferenciaMonto > 0
                                                                ? "El solicitante gastó MENOS de lo entregado. Debe devolver el saldo restante."
                                                                : "La rendición fue cuadrada correctamente. No existen diferencias monetarias."}

                                                    </p>

                                                </div>

                                            </div>

                                        )}
                                        <div className="flex flex-wrap gap-3">

                                            {/* FIRMAR */}

                                            {puedeFirmar &&
                                                viewingReq?.estado === "SIN_FIRMAR" && (

                                                    <button
                                                        onClick={() =>
                                                            ejecutarFlujo(
                                                                "FIRMAR",
                                                                viewingReq.id
                                                            )
                                                        }
                                                        className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-5 py-3 text-xs font-black uppercase tracking-wide text-white"
                                                    >
                                                        Firmar Solicitud
                                                    </button>
                                                )}

                                            {/* APROBAR */}

                                            {puedeAprobar &&
                                                viewingReq?.estado === "PENDIENTE" && (

                                                    <button
                                                        onClick={() =>
                                                            ejecutarFlujo(
                                                                "APROBAR",
                                                                viewingReq.id
                                                            )
                                                        }
                                                        className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3 text-xs font-black uppercase tracking-wide text-white"
                                                    >
                                                        Aprobar Solicitud
                                                    </button>
                                                )}

                                            {/* RECHAZAR */}

                                            {puedeAprobar &&
                                                viewingReq?.estado === "PENDIENTE" && (

                                                    <button
                                                        onClick={() =>
                                                            setShowRejectModal(true)
                                                        }
                                                        className="rounded-2xl bg-red-600 hover:bg-red-700 px-5 py-3 text-xs font-black uppercase tracking-wide text-white"
                                                    >
                                                        Rechazar
                                                    </button>
                                                )}

                                            {/* PAGAR ADELANTO */}

                                            {puedePagar &&
                                                viewingReq?.tipo === "ADELANTO" &&
                                                viewingReq?.estado === "APROBADO" && (

                                                    <button
                                                        onClick={() =>
                                                            setShowPagoModal(true)
                                                        }
                                                        className="rounded-2xl bg-amber-500 hover:bg-amber-600 px-5 py-3 text-xs font-black uppercase tracking-wide text-white"
                                                    >
                                                        Registrar Pago
                                                    </button>
                                                )}

                                            {puedePagar &&
                                                viewingReq?.estado === "POR_REEMBOLSAR" && (

                                                    <button
                                                        onClick={() =>
                                                            setShowPagoModal(true)
                                                        }
                                                        className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3 text-xs font-black uppercase tracking-wide text-white"
                                                    >
                                                        Registrar Reembolso
                                                    </button>
                                                )}

                                            {/* RENDICION ADELANTO */}

                                            {Number(currentUserId) === Number(viewingReq?.solicitante_id)
                                                && viewingReq?.tipo === "ADELANTO" &&
                                                viewingReq?.estado === "PAGADO" && (

                                                    <button onClick={() => setShowRendicionModal(true)}
                                                        className="rounded-2xl bg-slate-800 text-white px-5 py-3 text-xs font-black uppercase tracking-wide"
                                                    >
                                                        Subir Rendición
                                                    </button>
                                                )}

                                            {(viewingReq?.tipo === "REEMBOLSO" || viewingReq?.tipo === "VIATICOS")
                                                && Number(currentUserId) === Number(viewingReq?.solicitante_id)
                                                && viewingReq?.estado === "APROBADO" && (

                                                    <button onClick={() => setShowRendicionModal(true)}
                                                        className="rounded-2xl bg-indigo-700 text-white px-5 py-3 text-xs font-black uppercase tracking-wide"
                                                    >
                                                        Subir Sustento
                                                    </button>
                                                )}
                                            {/* TESORERIA CIERRA */}

                                            {esTesoreria &&
                                                (
                                                    viewingReq?.estado === "POR_DEVOLVER"
                                                    ||
                                                    viewingReq?.estado === "POR_REEMBOLSAR"
                                                ) && (

                                                    <button
                                                        onClick={() =>
                                                            setShowCerrarModal(true)
                                                        }
                                                        className="rounded-2xl bg-black text-white px-5 py-3 text-xs font-black uppercase tracking-wide"
                                                    >
                                                        Finalizar Rendición
                                                    </button>
                                                )}

                                        </div>
                                    </div>

                                    {viewingReq.estado === "RECHAZADO" ? (

                                        <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6">

                                            <div className="flex items-start gap-4">

                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                                                    <AlertTriangle className="h-5 w-5" />
                                                </div>

                                                <div>

                                                    <h4 className="text-sm font-black uppercase tracking-wide text-red-700">
                                                        Solicitud Rechazada
                                                    </h4>

                                                    <p className="mt-1 text-xs leading-relaxed text-red-600">
                                                        La solicitud fue rechazada por ADMINISTRACION.
                                                    </p>

                                                    {viewingReq.observaciones && (
                                                        <div className="mt-4 rounded-xl border border-red-100 bg-white/70 p-4">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
                                                                Observaciones
                                                            </p>

                                                            <p className="mt-2 text-xs leading-relaxed text-slate-600">
                                                                {viewingReq.observaciones}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                    ) : (

                                        <div className="relative pl-2 space-y-7">
                                            {pasosFlujo.map((paso, idx, arr) => {

                                                const flujoOrden = {
                                                    PENDIENTE: 0,
                                                    APROBADO: 1,
                                                    PAGADO: 2,
                                                    EN_RENDICION: 3,
                                                    POR_DEVOLVER: 3,
                                                    POR_REEMBOLSAR: 3,
                                                    CERRADO: 4
                                                };

                                                const actual =
                                                    flujoOrden[viewingReq.estado] ?? 0;

                                                const completado =
                                                    idx <= actual;

                                                const ultimo =
                                                    idx === arr.length - 1;

                                                return (

                                                    <div
                                                        key={paso.key}
                                                        className="relative flex gap-4"
                                                    >

                                                        {/* LADO IZQUIERDO */}
                                                        <div className="flex flex-col items-center">

                                                            <div
                                                                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl border-2 text-xs font-black transition-all ${completado
                                                                    ? "border-emerald-100 bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                                                    : "border-slate-200 bg-slate-50 text-slate-400"
                                                                    }`}
                                                            >
                                                                {completado
                                                                    ? <Check className="h-4 w-4 stroke-[3]" />
                                                                    : idx + 1}
                                                            </div>

                                                            {!ultimo && (
                                                                <div
                                                                    className={`absolute top-10 left-[19px] w-[2px] h-[calc(100%+12px)] rounded-full ${idx < actual
                                                                        ? "bg-emerald-500"
                                                                        : "bg-slate-200"
                                                                        }`}
                                                                />
                                                            )}
                                                        </div>

                                                        {/* TEXTO */}
                                                        <div className="pt-1 pb-3">

                                                            <h4
                                                                className={`text-xs font-black uppercase tracking-wide ${completado
                                                                    ? "text-slate-800"
                                                                    : "text-slate-400"
                                                                    }`}
                                                            >
                                                                {paso.title}
                                                            </h4>

                                                            <p
                                                                className={`mt-1 text-xs leading-relaxed ${completado
                                                                    ? "text-slate-500"
                                                                    : "text-slate-400/80"
                                                                    }`}
                                                            >
                                                                {paso.desc}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* ========================================= */}
                                {/* RENDICIONES */}
                                {/* ========================================= */}

                                {(rendiciones.length > 0 ||
                                    archivosTesoreria.length > 0) && (

                                        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

                                            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">

                                                <div>

                                                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-700">
                                                        Rendición Documentaria
                                                    </h3>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Archivos subidos por el solicitante
                                                    </p>

                                                </div>

                                                <div className="rounded-xl bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                                                    {rendiciones.length} archivos
                                                </div>

                                            </div>

                                            <div className="space-y-4">

                                                {rendiciones.map((archivo) => (

                                                    <div
                                                        key={archivo.id}
                                                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
                                                    >

                                                        <div className="flex items-center gap-4">

                                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#800000]">
                                                                <FileText className="h-5 w-5" />
                                                            </div>

                                                            <div>

                                                                <p className="text-sm font-bold text-slate-700">
                                                                    {archivo.nombre_original}
                                                                </p>

                                                                <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                                                                    SUBIDO POR {archivo.usuario}
                                                                </p>

                                                                <p className="text-[11px] text-slate-400">
                                                                    {archivo.created_at}
                                                                </p>

                                                            </div>

                                                        </div>

                                                        <a
                                                            href={`${API}${archivo.ruta}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="rounded-xl bg-[#800000] px-4 py-2 text-xs font-black uppercase tracking-wide text-white hover:bg-[#650000]"
                                                        >
                                                            VER ARCHIVO
                                                        </a>

                                                    </div>

                                                ))}

                                            </div>

                                        </div>

                                    )}

                                {/* TESORERIA */}

                                {archivosTesoreria.length > 0 && (

                                    <div className="mt-8">

                                        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">

                                            <div>

                                                <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-700">
                                                    Archivos Tesorería
                                                </h3>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Comprobantes de pago, devolución y reembolso
                                                </p>

                                            </div>

                                            <div className="rounded-xl bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700">
                                                {archivosTesoreria.length} archivos
                                            </div>

                                        </div>

                                        <div className="space-y-4">

                                            {archivosTesoreria.map((archivo) => (

                                                <div
                                                    key={archivo.id}
                                                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
                                                >

                                                    <div className="flex items-center gap-4">

                                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                                                            <FileText className="h-5 w-5" />
                                                        </div>

                                                        <div>

                                                            <p className="text-sm font-bold text-slate-700">
                                                                {archivo.nombre_original}
                                                            </p>

                                                            <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                                                                {archivo.tipo}
                                                            </p>

                                                            <p className="text-[11px] text-slate-400">
                                                                {archivo.created_at}
                                                            </p>

                                                        </div>

                                                    </div>

                                                    <a
                                                        href={`${API}${archivo.ruta}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="rounded-xl bg-black px-4 py-2 text-xs font-black uppercase tracking-wide text-white"
                                                    >
                                                        VER ARCHIVO
                                                    </a>

                                                </div>

                                            ))}

                                        </div>

                                    </div>

                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {showRendicionModal && (

                <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-slate-200">
                        {/* HEADER */}
                        <div className="bg-gradient-to-r from-[#800000] via-[#650000] to-black px-8 py-7 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight">
                                        Subir Rendición
                                    </h3>
                                    <p className="mt-2 text-sm text-red-100">
                                        Adjunta boletas, facturas y comprobantes
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowRendicionModal(false);
                                        setArchivosRendicion([]);
                                    }}
                                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                            </div>
                        </div>

                        {/* BODY */}
                        <div className="p-8">
                            {/* DROPZONE */}
                            <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-300 bg-slate-50/70 px-8 py-14 transition hover:border-[#800000] hover:bg-red-50/40">
                                <UploadCloud className="h-14 w-14 text-slate-400 group-hover:text-[#800000]" />
                                <h4 className="mt-5 text-lg font-black text-slate-700">
                                    Arrastra archivos aquí
                                </h4>
                                <p className="mt-2 text-sm text-slate-500 text-center">
                                    o haz click para seleccionar múltiples archivos
                                </p>
                                <p className="mt-4 text-[11px] uppercase tracking-widest text-slate-400">
                                    PDF · JPG · PNG
                                </p>
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => {

                                        const files = Array.from(
                                            e.target.files || []
                                        );

                                        setArchivosRendicion(files);
                                    }}
                                />
                            </label>

                            {/* LISTA */}
                            {archivosRendicion.length > 0 && (
                                <div className="mt-8">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h4 className="text-sm font-black uppercase tracking-wider text-slate-700">
                                            Archivos Seleccionados
                                        </h4>
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                                            {archivosRendicion.length} archivos
                                        </span>
                                    </div>

                                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                        {archivosRendicion.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#800000]">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-slate-400">
                                                            {(file.size / 1024).toFixed(1)} KB
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        const nuevos =
                                                            archivosRendicion.filter(
                                                                (_, i) => i !== index
                                                            );
                                                        setArchivosRendicion(nuevos);
                                                    }}
                                                    className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* ACTIONS */}
                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={enviarRendicion}
                                    className="flex-1 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-emerald-700"
                                >
                                    Enviar Rendición
                                </button>
                                <button
                                    onClick={() => {
                                        setShowRendicionModal(false);
                                        setArchivosRendicion([]);
                                    }}
                                    className="rounded-2xl border border-slate-200 px-6 py-4 text-sm font-black uppercase tracking-wide text-slate-600 hover:bg-slate-100"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===================================== */}
            {/* MODAL CERRAR RENDICION */}
            {/* ===================================== */}

            {showCerrarModal && (

                <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-xl rounded-[2rem] p-8">

                        <h3 className="text-xl font-black mb-2">

                            {viewingReq?.estado === "POR_DEVOLVER"
                                ? "Registrar Devolución"
                                : "Registrar Reembolso"}

                        </h3>

                        <p className="text-sm text-slate-500 mb-6">

                            {viewingReq?.estado === "POR_DEVOLVER"
                                ? "Sube el voucher de devolución del dinero sobrante."
                                : "Sube el comprobante del reembolso realizado."}

                        </p>

                        {/* DIFERENCIA */}

                        <div className="mb-6 rounded-2xl bg-slate-100 p-5">

                            <p className="text-xs font-black uppercase text-slate-500 mb-2">
                                Diferencia
                            </p>

                            <h2 className="text-3xl font-black text-slate-800">

                                {formatearMoneda(
                                    Math.abs(
                                        viewingReq?.diferencia || 0
                                    )
                                )}

                            </h2>
                        </div>

                        {/* FILE */}

                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                                setArchivoCierre(
                                    e.target.files[0]
                                )
                            }
                            className="w-full border p-4 rounded-2xl"
                        />

                        {/* PREVIEW */}

                        {archivoCierre && (

                            <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">

                                📎 {archivoCierre.name}

                            </div>
                        )}

                        {/* ACTIONS */}

                        <div className="flex gap-3 mt-8">

                            <button
                                onClick={cerrarRendicion}
                                className="flex-1 bg-black text-white py-3 rounded-2xl font-black"
                            >
                                FINALIZAR PROCESO
                            </button>

                            <button
                                onClick={() => {

                                    setShowCerrarModal(false);

                                    setArchivoCierre(null);

                                }}
                                className="px-6 py-3 border rounded-2xl"
                            >
                                CANCELAR
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {showPagoModal && (

                <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-xl rounded-[2rem] p-8">

                        <h3 className="text-xl font-black mb-2">
                            Registrar Pago
                        </h3>

                        <p className="text-sm text-slate-500 mb-6">
                            Suba el comprobante de transferencia
                        </p>

                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) =>
                                setArchivoPago(
                                    e.target.files[0]
                                )
                            }
                            className="w-full border p-4 rounded-2xl"
                        />

                        {archivoPago && (

                            <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">
                                📎 {archivoPago.name}
                            </div>
                        )}

                        <div className="flex gap-3 mt-8">

                            <button
                                onClick={ejecutarPago}
                                className="flex-1 bg-emerald-600 text-white py-3 rounded-2xl font-black"
                            >
                                REGISTRAR PAGO
                            </button>

                            <button
                                onClick={() => {

                                    setShowPagoModal(false);

                                    setArchivoPago(null);

                                }}
                                className="px-6 py-3 border rounded-2xl"
                            >
                                CANCELAR
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {showRejectModal && (

                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">

                    <div
                        onClick={() => setShowRejectModal(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <div className="relative w-full max-w-lg rounded-[30px] bg-white shadow-2xl overflow-hidden">

                        <div className="bg-gradient-to-r from-red-700 to-red-900 px-8 py-6 text-white">

                            <h2 className="text-xl font-black uppercase tracking-wide">
                                Rechazar Solicitud
                            </h2>

                            <p className="mt-1 text-sm text-red-100">
                                Indique el motivo del rechazo
                            </p>
                        </div>

                        <div className="p-8">

                            <textarea
                                value={rejectReason}
                                onChange={(e) =>
                                    setRejectReason(e.target.value)
                                }
                                rows={5}
                                className="w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-red-500"
                                placeholder="Escriba las observaciones..."
                            />

                            <div className="mt-6 flex justify-end gap-3">

                                <button
                                    onClick={() =>
                                        setShowRejectModal(false)
                                    }
                                    className="rounded-2xl border border-slate-200 px-5 py-3 text-xs font-black uppercase"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={async () => {

                                        if (!rejectReason.trim()) {
                                            alert("Ingrese observaciones");
                                            return;
                                        }

                                        await ejecutarFlujo(
                                            "RECHAZAR",
                                            viewingReq.id,
                                            rejectReason
                                        );

                                        setRejectReason("");

                                        setShowRejectModal(false);
                                    }}
                                    className="rounded-2xl bg-red-600 hover:bg-red-700 px-5 py-3 text-xs font-black uppercase text-white"
                                >
                                    Confirmar Rechazo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Fondos;