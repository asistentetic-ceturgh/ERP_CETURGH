import React, { useEffect, useMemo, useState } from 'react';
import {
    Wallet,
    Plus,
    RefreshCcw,
    Receipt,
    ArrowUpCircle,
    ArrowDownCircle,
    Clock3,
    CheckCircle2,
    XCircle,
    Eye,
    Building2,
    Landmark,
    Search,
    ChevronDown,
    FileText,
    Upload,
    Trash2,
    Save,
    AlertCircle, X
} from 'lucide-react';

import { API_BASE } from "../../config/api";

const API = API_BASE;

const CajaChica = ({ user }) => {

    /* =========================================================
       STATES
    ========================================================= */

    const [tab, setTab] = useState('cajas');

    const [loading, setLoading] = useState(false);

    const [cajas, setCajas] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [movimientos, setMovimientos] = useState([]);
    const [rendiciones, setRendiciones] = useState([]);

    const [empresas, setEmpresas] = useState([]);
    const [sedes, setSedes] = useState([]);
    const [centros, setCentros] = useState([]);

    const [showModalCaja, setShowModalCaja] = useState(false);
    const [showModalRecarga, setShowModalRecarga] = useState(false);
    const [showModalRendicion, setShowModalRendicion] = useState(false);

    const [cajaSeleccionada, setCajaSeleccionada] = useState(null);

    /* =========================================================
       FORM NUEVA CAJA
    ========================================================= */

    const [formCaja, setFormCaja] = useState({
        empresa_id: '',
        sede_id: '',
        centro_costo_id: '',
        monto: '',
        motivo: ''
    });

    /* =========================================================
       FORM RECARGA
    ========================================================= */

    const [formRecarga, setFormRecarga] = useState({
        caja_id: '',
        centro_costo_id: '',
        monto: '',
        motivo: ''
    });

    /* =========================================================
       FORM RENDICION
    ========================================================= */

    const [formRendicion, setFormRendicion] = useState({
        fecha_rendicion: new Date().toISOString().slice(0, 10),
        items: []
    });

    /* =========================================================
       EFFECTS
    ========================================================= */

    useEffect(() => {
        fetchInitialData();
    }, []);

    /* =========================================================
       FETCHES
    ========================================================= */

    const fetchInitialData = async () => {

        setLoading(true);

        try {

            await Promise.all([
                fetchCajas(),
                fetchSolicitudes(),
                fetchEmpresas(),
                fetchRendiciones()
            ]);

        } catch (err) {
            console.error(err);
        }

        setLoading(false);

    };

    const fetchCajas = async () => {

        try {

            const res = await fetch(API + "listar_cajas.php");
            const data = await res.json();

            if (data.ok) {
                setCajas(data.data);
            }

        } catch (err) {
            console.error(err);
        }

    };

    const fetchSolicitudes = async () => {

        try {

            const res = await fetch(API + "listar_solicitudes_caja.php");
            const data = await res.json();

            if (data.ok) {
                setSolicitudes(data.data);
            }

        } catch (err) {
            console.error(err);
        }

    };

    const fetchRendiciones = async () => {

        try {

            const res = await fetch(API + "listar_rendiciones_caja.php");
            const data = await res.json();

            if (data.ok) {
                setRendiciones(data.data);
            }

        } catch (err) {
            console.error(err);
        }

    };

    const fetchEmpresas = async () => {

        try {

            const res = await fetch(API + "empresas.php");
            const data = await res.json();

            if (data.ok) {
                setEmpresas(data.data);
            }

        } catch (err) {
            console.error(err);
        }

    };

    const fetchSedes = async (empresa_id) => {

        try {

            const res = await fetch(
                API + "sedes.php?empresa_id=" + empresa_id
            );

            const data = await res.json();

            if (data.ok) {
                setSedes(data.data);
            }

        } catch (err) {
            console.error(err);
        }

    };

    const buscarCentros = async (q, empresa_id, sede_id) => {

        if (!q) return;

        try {

            const res = await fetch(
                API +
                "buscar_centros_costos.php?" +
                new URLSearchParams({
                    q,
                    empresa_id,
                    sede_id
                })
            );

            const data = await res.json();

            if (data.ok) {
                setCentros(data.data);
            }

        } catch (err) {
            console.error(err);
        }

    };

    /* =========================================================
       NUEVA CAJA
    ========================================================= */

    const handleCrearCaja = async () => {

        try {

            const payload = {
                tipo: 'APERTURA',
                ...formCaja
            };

            const res = await fetch(API + "crear_solicitud_caja.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!data.ok) {
                throw new Error(data.error);
            }

            alert("Solicitud enviada");

            setShowModalCaja(false);

            setFormCaja({
                empresa_id: '',
                sede_id: '',
                centro_costo_id: '',
                monto: '',
                motivo: ''
            });

            fetchSolicitudes();

        } catch (err) {
            alert(err.message);
        }

    };

    /* =========================================================
       RECARGA
    ========================================================= */

    const handleRecargarCaja = async () => {

        try {

            const payload = {
                tipo: 'RECARGA',
                caja_id: cajaSeleccionada.id,
                ...formRecarga
            };

            const res = await fetch(API + "crear_solicitud_caja.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!data.ok) {
                throw new Error(data.error);
            }

            alert("Solicitud de recarga enviada");

            setShowModalRecarga(false);

            setFormRecarga({
                caja_id: '',
                centro_costo_id: '',
                monto: '',
                motivo: ''
            });

            fetchSolicitudes();

        } catch (err) {
            alert(err.message);
        }

    };

    /* =========================================================
       RENDICION
    ========================================================= */

    const addItemRendicion = () => {

        setFormRendicion(prev => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    fecha: '',
                    proveedor: '',
                    ruc_dni: '',
                    tipo_documento: 'FACTURA',
                    numero_documento: '',
                    descripcion: '',
                    monto: '',
                    archivo: null
                }
            ]
        }));

    };

    const removeItemRendicion = (index) => {

        setFormRendicion(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));

    };

    const updateItem = (index, field, value) => {

        const updated = [...formRendicion.items];

        updated[index][field] = value;

        setFormRendicion(prev => ({
            ...prev,
            items: updated
        }));

    };

    const totalRendicion = useMemo(() => {

        return formRendicion.items.reduce((acc, item) => {
            return acc + Number(item.monto || 0);
        }, 0);

    }, [formRendicion]);

    const handleGuardarRendicion = async () => {

        try {

            const formData = new FormData();

            formData.append(
                "caja_id",
                cajaSeleccionada.id
            );

            formData.append(
                "fecha_rendicion",
                formRendicion.fecha_rendicion
            );

            formData.append(
                "items",
                JSON.stringify(formRendicion.items.map(item => ({
                    fecha: item.fecha,
                    proveedor: item.proveedor,
                    ruc_dni: item.ruc_dni,
                    tipo_documento: item.tipo_documento,
                    numero_documento: item.numero_documento,
                    descripcion: item.descripcion,
                    monto: item.monto
                })))
            );

            formRendicion.items.forEach((item, index) => {

                if (item.archivo) {
                    formData.append(
                        `archivo_${index}`,
                        item.archivo
                    );
                }

            });

            const res = await fetch(API + "guardar_rendicion.php", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (!data.ok) {
                throw new Error(data.error);
            }

            alert("Rendición registrada");

            setShowModalRendicion(false);

            setFormRendicion({
                fecha_rendicion: new Date().toISOString().slice(0, 10),
                items: []
            });

            fetchRendiciones();
            fetchCajas();

        } catch (err) {
            alert(err.message);
        }

    };

    /* =========================================================
       UI HELPERS
    ========================================================= */

    const EstadoBadge = ({ estado }) => {

        const styles = {
            ACTIVA: 'bg-emerald-100 text-emerald-700',
            AGOTADA: 'bg-red-100 text-red-700',
            CERRADA: 'bg-slate-200 text-slate-700',
            PENDIENTE_APERTURA: 'bg-amber-100 text-amber-700',

            PENDIENTE_ADMIN: 'bg-amber-100 text-amber-700',
            APROBADO_ADMIN: 'bg-blue-100 text-blue-700',
            PENDIENTE_TESORERIA: 'bg-violet-100 text-violet-700',
            PAGADO: 'bg-emerald-100 text-emerald-700',
            RECHAZADO_ADMIN: 'bg-red-100 text-red-700'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black ${styles[estado]}`}>
                {estado}
            </span>
        );

    };

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">

            {/* HEADER */}

            <div>
                {/* HEADER DE LA SECCIÓN */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Caja Chica
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                            Gestión financiera de cajas, recargas y rendiciones.
                        </p>
                    </div>

                    <div>
                        <button
                            onClick={() => setShowModalCaja(true)}
                            className="w-full sm:w-auto bg-[#800000] hover:bg-[#600000] text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-maroon-900/10"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            Nueva Caja
                        </button>
                    </div>
                </div>

                {/* NAVEGACIÓN POR PESTAÑAS (TABS STYLE) */}
                <div className="flex gap-1 p-1 bg-slate-100/80 rounded-xl mb-8 w-fit overflow-auto max-w-full backdrop-blur-sm">
                    {[
                        ['cajas', 'Cajas'],
                        ['solicitudes', 'Solicitudes'],
                        ['rendiciones', 'Rendiciones']
                    ].map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`
          px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap
          ${tab === key
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'}
        `}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* CONTENIDO DE LAS PESTAÑAS */}

                {/* VISTA: CAJAS */}
                {tab === 'cajas' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {cajas.map(caja => (
                            <div
                                key={caja.id}
                                className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                Código de Caja
                                            </span>
                                            <h3 className="text-lg font-bold text-slate-800 mt-0.5">
                                                {caja.codigo}
                                            </h3>
                                        </div>
                                        <EstadoBadge estado={caja.estado} />
                                    </div>

                                    <div className="space-y-2.5 py-3 border-y border-slate-50">
                                        <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                                            <Building2 size={16} className="text-slate-400" />
                                            <span>{caja.empresa}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                                            <Landmark size={16} className="text-slate-400" />
                                            <span>{caja.centro_costo}</span>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Base
                                            </p>
                                            <p className="text-base font-bold text-slate-700 mt-0.5">
                                                S/ {Number(caja.monto_base).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="bg-[#800000]/5 rounded-xl p-3 border border-[#800000]/10">
                                            <p className="text-[10px] font-bold text-[#800000] uppercase tracking-wider">
                                                Saldo Actual
                                            </p>
                                            <p className="text-base font-bold text-[#800000] mt-0.5">
                                                S/ {Number(caja.saldo_actual).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2.5 mt-6 pt-2">
                                    <button
                                        onClick={() => {
                                            setCajaSeleccionada(caja);
                                            setShowModalRecarga(true);
                                        }}
                                        className="flex-1 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                                    >
                                        Recargar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCajaSeleccionada(caja);
                                            setShowModalRendicion(true);
                                        }}
                                        className="flex-1 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
                                    >
                                        Rendir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* VISTA: SOLICITUDES */}
                {tab === 'solicitudes' && (
                    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                        <div className="overflow-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-200/50">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Tipo</th>
                                        <th className="px-6 py-4 font-semibold">Empresa</th>
                                        <th className="px-6 py-4 font-semibold">Monto</th>
                                        <th className="px-6 py-4 font-semibold">Estado</th>
                                        <th className="px-6 py-4 font-semibold">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {solicitudes.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-slate-900">{item.tipo}</td>
                                            <td className="px-6 py-4 text-slate-600">{item.empresa}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">S/ {Number(item.monto).toFixed(2)}</td>
                                            <td className="px-6 py-4"><EstadoBadge estado={item.estado} /></td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">{item.created_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* VISTA: RENDICIONES */}
                {tab === 'rendiciones' && (
                    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                        <div className="overflow-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-200/50">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Número</th>
                                        <th className="px-6 py-4 font-semibold">Caja</th>
                                        <th className="px-6 py-4 font-semibold">Fecha</th>
                                        <th className="px-6 py-4 font-semibold">Total</th>
                                        <th className="px-6 py-4 font-semibold">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {rendiciones.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900">{item.numero}</td>
                                            <td className="px-6 py-4 text-slate-600">{item.caja}</td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">{item.fecha_rendicion}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">S/ {Number(item.total_rendido).toFixed(2)}</td>
                                            <td className="px-6 py-4"><EstadoBadge estado={item.estado} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            {/* =========================================================
               MODAL NUEVA CAJA
            ========================================================= */}

            {showModalCaja && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* CABECERA DEL MODAL */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Nueva Caja Chica
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                    Completa los datos para aperturar o solicitar una nueva caja.
                                </p>
                            </div>

                            {/* Botón X de cierre rápido opcional */}
                            <button
                                onClick={() => setShowModalCaja(false)}
                                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* CUERPO DEL FORMULARIO */}
                        <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)] space-y-5">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Campo: Empresa */}
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">
                                        Empresa
                                    </label>
                                    <select
                                        value={formCaja.empresa_id}
                                        onChange={(e) => {
                                            setFormCaja({
                                                ...formCaja,
                                                empresa_id: e.target.value
                                            });
                                            fetchSedes(e.target.value);
                                        }}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 shadow-sm focus:border-slate-400 focus:ring-0 transition-all outline-none"
                                    >
                                        <option value="">Seleccione una empresa</option>
                                        {empresas.map(emp => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Campo: Sede */}
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">
                                        Sede
                                    </label>
                                    <select
                                        value={formCaja.sede_id}
                                        onChange={(e) =>
                                            setFormCaja({
                                                ...formCaja,
                                                sede_id: e.target.value
                                            })
                                        }
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 shadow-sm focus:border-slate-400 focus:ring-0 transition-all outline-none"
                                    >
                                        <option value="">Seleccione una sede</option>
                                        {sedes.map(sede => (
                                            <option key={sede.id} value={sede.id}>
                                                {sede.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Campo: Buscador de Centro de Costo */}
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">
                                    Centro de Costo
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        onChange={(e) =>
                                            buscarCentros(
                                                e.target.value,
                                                formCaja.empresa_id,
                                                formCaja.sede_id
                                            )
                                        }
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm shadow-sm placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 transition-all outline-none"
                                        placeholder="Escribe para buscar un centro de costo..."
                                    />
                                </div>

                                {/* Resultados de Búsqueda */}
                                {centros.length > 0 && (
                                    <div className="mt-2 border border-slate-200 rounded-xl overflow-hidden shadow-md max-h-48 overflow-y-auto bg-white divide-y divide-slate-100 z-10">
                                        {centros.map(cc => {
                                            const isSelected = formCaja.centro_costo_id === cc.id;
                                            return (
                                                <button
                                                    type="button"
                                                    key={cc.id}
                                                    onClick={() =>
                                                        setFormCaja({
                                                            ...formCaja,
                                                            centro_costo_id: cc.id
                                                        })
                                                    }
                                                    className={`w-full text-left px-4 py-3 text-xs font-medium transition-colors flex items-center justify-between
                      ${isSelected
                                                            ? 'bg-[#800000]/5 text-[#800000] font-semibold'
                                                            : 'text-slate-700 hover:bg-slate-50'}`}
                                                >
                                                    <span>{cc.codigo} — {cc.nombre}</span>
                                                    {isSelected && <span className="text-[10px] bg-[#800000] text-white px-2 py-0.5 rounded-md font-bold">Seleccionado</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Campo: Monto */}
                            <div className="flex flex-col sm:w-1/2">
                                <label className="text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">
                                    Monto Inicial (S/)
                                </label>
                                <div className="relative rounded-xl shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                                        <span className="text-slate-400 text-sm font-medium">S/</span>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formCaja.monto}
                                        onChange={(e) =>
                                            setFormCaja({
                                                ...formCaja,
                                                monto: e.target.value
                                            })
                                        }
                                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 font-semibold focus:border-slate-400 focus:ring-0 transition-all outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Campo: Motivo */}
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">
                                    Motivo / Justificación
                                </label>
                                <textarea
                                    value={formCaja.motivo}
                                    onChange={(e) =>
                                        setFormCaja({
                                            ...formCaja,
                                            motivo: e.target.value
                                        })
                                    }
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 h-24 resize-none focus:border-slate-400 focus:ring-0 transition-all outline-none"
                                    placeholder="Describe brevemente el propósito de esta caja chica..."
                                />
                            </div>

                        </div>

                        {/* ACCIONES / BOTONES */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowModalCaja(false)}
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm transition-colors"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleCrearCaja}
                                className="px-5 py-2 rounded-xl bg-[#800000] hover:bg-[#600000] text-white text-sm font-semibold shadow-sm shadow-maroon-900/10 transition-colors"
                            >
                                Crear Solicitud
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* =========================================================
               MODAL RECARGA
            ========================================================= */}

            {showModalRecarga && (

                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-xl rounded-[2rem] p-8">

                        <h2 className="text-2xl font-black mb-6">
                            Recargar Caja
                        </h2>

                        <div className="space-y-5">

                            <div>

                                <label className="text-xs font-black text-slate-500">
                                    Monto
                                </label>

                                <input
                                    type="number"
                                    value={formRecarga.monto}
                                    onChange={(e) =>
                                        setFormRecarga({
                                            ...formRecarga,
                                            monto: e.target.value
                                        })
                                    }
                                    className="w-full mt-2 p-4 rounded-2xl border border-slate-200"
                                />

                            </div>

                            <div>

                                <label className="text-xs font-black text-slate-500">
                                    Motivo
                                </label>

                                <textarea
                                    value={formRecarga.motivo}
                                    onChange={(e) =>
                                        setFormRecarga({
                                            ...formRecarga,
                                            motivo: e.target.value
                                        })
                                    }
                                    className="w-full mt-2 p-4 rounded-2xl border border-slate-200 h-32"
                                />

                            </div>

                        </div>

                        <div className="flex justify-end gap-3 mt-8">

                            <button
                                onClick={() => setShowModalRecarga(false)}
                                className="px-5 py-3 rounded-2xl bg-slate-100 font-black"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleRecargarCaja}
                                className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-black"
                            >
                                Solicitar Recarga
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* =========================================================
               MODAL RENDICION
            ========================================================= */}

            {showModalRendicion && (

                <div className="fixed inset-0 z-50 bg-black/40 overflow-auto p-6">

                    <div className="max-w-7xl mx-auto bg-white rounded-[2rem] p-8">

                        <div className="flex items-center justify-between mb-8">

                            <div>

                                <h2 className="text-3xl font-black">
                                    Rendición de Caja
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    Registra los gastos realizados.
                                </p>

                            </div>

                            <button
                                onClick={() => setShowModalRendicion(false)}
                                className="px-5 py-3 bg-slate-100 rounded-2xl font-black"
                            >
                                Cerrar
                            </button>

                        </div>

                        <div className="flex items-center justify-between mb-6">

                            <div>

                                <p className="text-sm text-slate-500">
                                    Caja:
                                </p>

                                <p className="text-xl font-black">
                                    {cajaSeleccionada?.codigo}
                                </p>

                            </div>

                            <button
                                onClick={addItemRendicion}
                                className="bg-[#800000] text-white px-5 py-3 rounded-2xl font-black flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Agregar Item
                            </button>

                        </div>

                        <div className="overflow-auto border rounded-2xl">

                            <table className="w-full min-w-[1400px]">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="p-3">Fecha</th>
                                        <th className="p-3">Proveedor</th>
                                        <th className="p-3">RUC/DNI</th>
                                        <th className="p-3">Tipo</th>
                                        <th className="p-3">Documento</th>
                                        <th className="p-3">Descripción</th>
                                        <th className="p-3">Monto</th>
                                        <th className="p-3">Archivo</th>
                                        <th className="p-3"></th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {formRendicion.items.map((item, index) => (

                                        <tr key={index} className="border-t">

                                            <td className="p-2">
                                                <input
                                                    type="date"
                                                    value={item.fecha}
                                                    onChange={(e) =>
                                                        updateItem(index, 'fecha', e.target.value)
                                                    }
                                                    className="p-3 border rounded-xl"
                                                />
                                            </td>

                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    value={item.proveedor}
                                                    onChange={(e) =>
                                                        updateItem(index, 'proveedor', e.target.value)
                                                    }
                                                    className="p-3 border rounded-xl w-full"
                                                />
                                            </td>

                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    value={item.ruc_dni}
                                                    onChange={(e) =>
                                                        updateItem(index, 'ruc_dni', e.target.value)
                                                    }
                                                    className="p-3 border rounded-xl w-full"
                                                />
                                            </td>

                                            <td className="p-2">

                                                <select
                                                    value={item.tipo_documento}
                                                    onChange={(e) =>
                                                        updateItem(index, 'tipo_documento', e.target.value)
                                                    }
                                                    className="p-3 border rounded-xl"
                                                >
                                                    <option value="FACTURA">FACTURA</option>
                                                    <option value="BOLETA">BOLETA</option>
                                                    <option value="RXH">RXH</option>
                                                    <option value="MOVILIDAD">MOVILIDAD</option>
                                                    <option value="OTROS">OTROS</option>
                                                </select>

                                            </td>

                                            <td className="p-2">
                                                <input
                                                    type="text"
                                                    value={item.numero_documento}
                                                    onChange={(e) =>
                                                        updateItem(index, 'numero_documento', e.target.value)
                                                    }
                                                    className="p-3 border rounded-xl w-full"
                                                />
                                            </td>

                                            <td className="p-2">
                                                <textarea
                                                    value={item.descripcion}
                                                    onChange={(e) =>
                                                        updateItem(index, 'descripcion', e.target.value)
                                                    }
                                                    className="p-3 border rounded-xl w-full"
                                                />
                                            </td>

                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    value={item.monto}
                                                    onChange={(e) =>
                                                        updateItem(index, 'monto', e.target.value)
                                                    }
                                                    className="p-3 border rounded-xl w-32"
                                                />
                                            </td>

                                            <td className="p-2">

                                                <input
                                                    type="file"
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            'archivo',
                                                            e.target.files[0]
                                                        )
                                                    }
                                                />

                                            </td>

                                            <td className="p-2">

                                                <button
                                                    onClick={() => removeItemRendicion(index)}
                                                    className="text-red-500"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                        <div className="mt-8 flex items-center justify-between">

                            <div>

                                <p className="text-sm text-slate-500">
                                    Total Rendición
                                </p>

                                <p className="text-4xl font-black text-[#800000]">
                                    S/ {totalRendicion.toFixed(2)}
                                </p>

                            </div>

                            <button
                                onClick={handleGuardarRendicion}
                                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2"
                            >
                                <Save size={20} />
                                Guardar Rendición
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );

};

export default CajaChica;