import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Search, Truck, Apple, Save, Filter,
    ClipboardList, Send, FileCheck, Info, Building2,
    AlertTriangle, ChevronDown, UserCheck,
    Package, CheckCircle2, Loader2, RefreshCw,
    MoreHorizontal, CreditCard, Layers, MessageSquare, X, Eye, FileText,
    Calendar, ArrowUp, ArrowDown
} from 'lucide-react';

import { API_BASE } from "../../config/api";

const API = API_BASE;

// Colores de marca Ceturgh
const COLORS = {
    maroon: '#6B0000',
    gold: '#C5A059',
    goldLight: '#E5D5B7',
    white: '#FFFFFF',
    slate: '#F8FAFC'
};

const Logistica = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [providerFilter, setProviderFilter] = useState("todos");
    const [tab, setTab] = useState("logistica_pendiente");
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [proveedorSearch, setProveedorSearch] = useState("");
    const [proveedores, setProveedores] = useState([]);
    const [centros, setCentros] = useState([]);
    const [activeRowId, setActiveRowId] = useState(null);
    const [centrosFiltrados, setCentrosFiltrados] = useState([]);
    const [activeCCRowId, setActiveCCRowId] = useState(null);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
    const [sedeSeleccionada, setSedeSeleccionada] = useState(null);
    const [grupoFilter, setGrupoFilter] = useState("todos");
    const [archivo, setArchivo] = useState(null);
    const fileRef = useRef(null);
    const [dirtyItems, setDirtyItems] = useState(new Set());
    const [incluyeIgv, setIncluyeIgv] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedItemDetails, setSelectedItemDetails] = useState(null);

    // =====================
    // NUEVOS ESTADOS: PAGINACIÓN Y ORDENAMIENTO
    // =====================
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [fechaOrder, setFechaOrder] = useState('desc'); // 'asc' o 'desc'
    const [departamentoFilter, setDepartamentoFilter] = useState("todos");

    // =====================
    // SAFE ITEMS
    // =====================
    const safeItems = Array.isArray(items) ? items : [];

    // =====================
    // OBTENER DEPARTAMENTOS ÚNICOS
    // =====================
    const uniqueDepartamentos = useMemo(() => {
        const deptos = safeItems
            .map(it => it.departamento_nombre)
            .filter(d => d && d.trim() !== "");
        return ["todos", ...new Set(deptos)];
    }, [safeItems]);

    // =====================
    // FILTRADO BASE (sin orden, sin paginación)
    // =====================
    const baseFilteredItems = useMemo(() => {
        return safeItems.filter(item => {
            const matchesSearch =
                (item.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.requerimiento_id || "").toString().includes(searchTerm);

            const matchesProvider =
                providerFilter === "todos" || item.proveedor === providerFilter;

            const matchesEmpresa =
                !empresaSeleccionada ||
                Number(item.empresa_id) === Number(empresaSeleccionada);

            const matchesSede =
                !sedeSeleccionada ||
                Number(item.sede_id) === Number(sedeSeleccionada);

            const matchesGrupo =
                grupoFilter === "todos" ||
                Number(item.grupo_id) === Number(grupoFilter);

            const matchesDepartamento =
                departamentoFilter === "todos" ||
                (item.departamento_nombre || "").toLowerCase() === departamentoFilter.toLowerCase();

            return (
                matchesSearch &&
                matchesProvider &&
                matchesEmpresa &&
                matchesSede &&
                matchesGrupo &&
                matchesDepartamento
            );
        });
    }, [
        safeItems,
        searchTerm,
        providerFilter,
        empresaSeleccionada,
        sedeSeleccionada,
        grupoFilter,
        departamentoFilter
    ]);

    // =====================
    // ORDENAMIENTO POR FECHA (usa fecha_creacion o id como fallback)
    // =====================
    const sortedItems = useMemo(() => {
        const sorted = [...baseFilteredItems];
        sorted.sort((a, b) => {
            // Intentar ordenar por fecha_creacion, si no existe usar id (más reciente = id mayor)
            const dateA = a.fecha_creacion ? new Date(a.fecha_creacion) : a.id;
            const dateB = b.fecha_creacion ? new Date(b.fecha_creacion) : b.id;
            if (fechaOrder === 'asc') {
                return dateA > dateB ? 1 : -1;
            } else {
                return dateA < dateB ? 1 : -1;
            }
        });
        return sorted;
    }, [baseFilteredItems, fechaOrder]);

    // =====================
    // TABLAS POR ESTADO (ahora sobre los items ordenados)
    // =====================
    const tabItems = useMemo(() => {
        return {
            logistica_pendiente: sortedItems.filter(it =>
                (it.flujo_estado || "").toUpperCase() === "LOGISTICA" &&
                (it.estado_logistica || "").toUpperCase() === "PENDIENTE"
            ),
            logistica_enviado: sortedItems.filter(it =>
                (it.flujo_estado || "").toUpperCase() === "LOGISTICA" &&
                (it.estado_logistica || "").toUpperCase() === "ENVIADO"
            ),
            administracion_pendiente: sortedItems.filter(it =>
                (it.flujo_estado || "").toUpperCase() === "ADMINISTRACION" &&
                (it.estado_administracion || "").toUpperCase() === "PENDIENTE"
            ),
            administracion_aprobado: sortedItems.filter(it =>
                (it.flujo_estado || "").toUpperCase() === "ADMINISTRACION" &&
                (it.estado_administracion || "").toUpperCase() === "APROBADO"
            ),
            administracion_observado: sortedItems.filter(it =>
                (it.flujo_estado || "").toUpperCase() === "ADMINISTRACION" &&
                (it.estado_administracion || "").toUpperCase() === "OBSERVADO"
            ),
            administracion_denegado: sortedItems.filter(it =>
                (it.flujo_estado || "").toUpperCase() === "ADMINISTRACION" &&
                (it.estado_administracion || "").toUpperCase() === "DENEGADO"
            ),
            tesoreria_pendiente: sortedItems.filter(it =>
                (it.flujo_estado || "").toUpperCase() === "TESORERIA" &&
                (it.estado_tesoreria || "").toUpperCase() === "PENDIENTE"
            ),
            tesoreria_pagado: sortedItems.filter(it =>
                (it.flujo_estado || "").toUpperCase() === "TESORERIA" &&
                (it.estado_tesoreria || "").toUpperCase() === "PAGADO"
            ),
            finalizados: sortedItems.filter(it =>
                (it.flujo_estado || "").toUpperCase() === "FINALIZADO"
            )
        };
    }, [sortedItems]);

    // =====================
    // PAGINACIÓN: obtenemos el array actual según la pestaña
    // =====================
    const currentTabItems = tabItems[tab] || [];
    const totalItems = currentTabItems.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return currentTabItems.slice(start, end);
    }, [currentTabItems, currentPage, pageSize]);

    // Resetear página cuando cambia la pestaña o los filtros que afectan el total
    useEffect(() => {
        setCurrentPage(1);
    }, [tab, searchTerm, providerFilter, empresaSeleccionada, sedeSeleccionada, grupoFilter, departamentoFilter, fechaOrder]);

    // Handlers de paginación
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // =====================
    // FETCH DE DATOS (sin cambios)
    // =====================
    const fetchItems = () => {
        setLoading(true);
        fetch(API + "items.php")
            .then(res => res.json())
            .then(data => {
                const itemsLimpios = data.data.map(it => ({
                    ...it,
                    es_insumo: Number(it.es_insumo) || 0,
                    incluye_igv: Number(it.incluye_igv) || 0,
                    centro_costo_label: it.centro_codigo
                        ? `${it.centro_codigo} - ${it.centro_nombre}`
                        : ""
                }));
                setItems(itemsLimpios);
            })
            .catch(err => console.error("Error cargando items:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // =====================
    // RESTO DE FUNCIONES (sin cambios relevantes)
    // =====================
    const handleUpdate = (id, field, value) => {
        setItems(prev =>
            prev.map(it =>
                it.id === id
                    ? {
                        ...it,
                        [field]:
                            field === "precio_unitario" ||
                                field === "centro_costo_id" ||
                                field === "cantidad"
                                ? Number(value)
                                : value
                    }
                    : it
            )
        );
    };

    const toggleSelect = (id) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const verDetallesItem = (item) => {
        setSelectedItemDetails(item);
        setShowDetailsModal(true);
    };

    const guardarCambios = async () => {
        setIsSaving(true);
        let errores = [];

        try {
            // Hacer updates uno por uno para mejor control de errores
            for (const it of items) {
                // Solo guardar items que tienen cambios o todos? Mejor guardar todos los de la pestaña actual
                const payload = {
                    id: it.id,
                    descripcion: it.descripcion,
                    cantidad: Number(it.cantidad) || 0,
                    unidad: it.unidad || "",
                    precio_unitario: Number(it.precio_unitario) || 0,
                    total: (Number(it.precio_unitario) || 0) * (Number(it.cantidad) || 0),
                    proveedor: it.proveedor || "",
                    proveedor_id: it.proveedor_id ? Number(it.proveedor_id) : null,
                    estado_pago: it.estado_pago || "Pendiente",
                    es_insumo: it.es_insumo ? 1 : 0,
                    tipo: it.tipo || "Producto",
                    centro_costo_id: it.centro_costo_id ? Number(it.centro_costo_id) : null,
                    requiere_cotizacion: it.requiere_cotizacion ? 1 : 0,
                    estado_insumo: it.estado_insumo || "Pendiente",
                    comentario_solicitante: it.comentario_solicitante || null,
                    archivo_adjunto: it.archivo_adjunto || null,
                    incluye_igv: it.incluye_igv || 0
                };

                const res = await fetch(API + "items.php", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const text = await res.text();

                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error(`Error parsing JSON para item ${it.id}:`, text);
                    errores.push(`Item ${it.id}: ${text.substring(0, 100)}`);
                    continue;
                }

                if (!data.success && !data.error === undefined) {
                    // Si hay error en la respuesta
                    if (data.error) {
                        errores.push(`Item ${it.id}: ${data.error}`);
                    } else if (!data.success) {
                        errores.push(`Item ${it.id}: Error desconocido`);
                    }
                }
            }

            if (errores.length > 0) {
                alert(`Errores al guardar:\n${errores.join('\n')}`);
            } else {
                alert("Datos guardados correctamente ✅");
                fetchItems();
            }
        } catch (err) {
            console.error("Error en guardarCambios:", err);
            alert("Error al guardar: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const buscarProveedores = async (q, id) => {
        setActiveRowId(id);
        if (!q || q.length < 2) {
            setProveedores([]);
            return;
        }
        try {
            const res = await fetch(API + "proveedores_search.php?q=" + q);
            const data = await res.json();
            setProveedores(data);
        } catch (error) {
            console.error("Error buscando proveedores:", error);
            setProveedores([]);
        }
    };

    const uniqueProviders = useMemo(() => {
        const providers = safeItems
            .map(it => it.proveedor)
            .filter(p => p && p.trim() !== "");
        return ["todos", ...new Set(providers)];
    }, [safeItems]);

    const uniqueGroups = useMemo(() => {
        const gruposMap = new Map();
        safeItems.forEach(it => {
            if (!it.grupo_id) return;
            gruposMap.set(Number(it.grupo_id), {
                id: Number(it.grupo_id),
                nombre: it.grupo_nombre || `Grupo ${it.grupo_id}`
            });
        });
        return Array.from(gruposMap.values());
    }, [safeItems]);

    const resumenProveedores = useMemo(() => {
        const seleccionados = safeItems.filter(it =>
            selectedItems.includes(it.id)
        );
        const data = {};
        seleccionados.forEach(it => {
            const prov = it.proveedor || "POR ASIGNAR";
            if (!data[prov]) data[prov] = { total: 0, items: 0 };
            data[prov].total += (Number(it.precio_unitario) || 0) * (Number(it.cantidad) || 0);
            data[prov].items += 1;
        });
        return data;
    }, [selectedItems, safeItems]);

    const cargarCentros = async (requerimiento_id) => {
        const res = await fetch(API + "centros_costos_filtrados.php?requerimiento_id=" + requerimiento_id);
        const data = await res.json();
        setCentros(Array.isArray(data) ? data : []);
    };

    const buscarCentros = async (texto, req_id, itemId) => {
        try {
            const res = await fetch(`${API}centros_costos_filtrados.php?requerimiento_id=${req_id}&q=${texto}`);
            const data = await res.json();
            setCentrosFiltrados(Array.isArray(data) ? data : []);
            setActiveCCRowId(itemId);
        } catch (err) {
            console.error("Error buscando centros:", err);
        }
    };

    const toggleCotizacion = async (item) => {
        const nuevoValor = Number(item.requiere_cotizacion) === 1 ? 0 : 1;
        handleUpdate(item.id, "requiere_cotizacion", nuevoValor);
        try {
            await fetch(API + "items.php", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: item.id, requiere_cotizacion: nuevoValor })
            });
        } catch (err) {
            console.error("Error actualizando:", err);
        }
    };

    const toggleInsumo = async (item) => {
        const nuevoValor = Number(item.es_insumo) === 1 ? 0 : 1;
        handleUpdate(item.id, "es_insumo", nuevoValor);
        try {
            await fetch(API + "items.php", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: item.id, es_insumo: nuevoValor })
            });
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const enviarAdministracion = async () => {
        const itemsEnviar = items
            .filter(it => selectedItems.includes(it.id))
            .map(it => ({
                id: it.id,
                proveedor_id: it.proveedor_id,
                requerimiento_id: it.requerimiento_id,
                incluye_igv: incluyeIgv ? 1 : 0
            }));

        if (itemsEnviar.length === 0) {
            alert("Selecciona items");
            return;
        }

        const invalidos = items.filter(it => {
            if (!selectedItems.includes(it.id)) return false;
            return (
                !it.proveedor_id ||
                !it.requerimiento_id ||
                !it.centro_costo_id ||
                Number(it.precio_unitario) <= 0
            );
        });

        if (invalidos.length > 0) {
            alert("Hay items sin proveedor, centro de costo o precio");
            return;
        }

        try {
            const formData = new FormData();
            if (archivo) formData.append("archivo", archivo);
            formData.append("incluye_igv", incluyeIgv ? "1" : "0");
            formData.append("items", JSON.stringify(itemsEnviar));

            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const res = await fetch(API + "enviar_administracion.php", {
                method: "POST",
                body: formData
            });

            const text = await res.text(); 
            console.log("Respuesta raw:", text);  

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Error parsing JSON:", e);
                alert("Error del servidor: " + text.substring(0, 200));
                return;
            }

            if (data.success) {
                alert("Enviado ✅");
                setSelectedItems([]);
                setArchivo(null);
                fetchItems();
            } else {
                alert(data.error || "Error desconocido");
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión: " + err.message);
        }
    };

    useEffect(() => {
        if (items.length > 0) {
            cargarCentros(items[0].requerimiento_id);
        }
    }, [items]);

    const totalMonto = Object.values(resumenProveedores).reduce((a, b) => a + b.total, 0);

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-6 lg:p-10 font-sans text-slate-800 selection:bg-red-100">
            <div className="max-w-[1500px] mx-auto space-y-8">

                {/* TOP BAR */}
                <header className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-100 pb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 flex items-center justify-center rounded-xl shadow-lg" style={{ background: `linear-gradient(135deg, ${COLORS.maroon}, #4a0000)` }}>
                            <Layers className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif font-bold tracking-tight text-slate-900 flex items-center gap-2">
                                <span>Logística</span>
                                <span style={{ color: COLORS.maroon }} className="font-sans font-black uppercase tracking-tighter">Ceturgh</span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl border border-slate-100 shadow-sm">
                        <div className="text-right pr-4 border-r border-slate-100">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">Seleccionados</span>
                            <span className="text-lg font-black text-slate-800">{selectedItems.length}</span>
                        </div>
                        <div className="text-right px-4">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">Monto Total</span>
                            <span className="text-lg font-black" style={{ color: COLORS.maroon }}>
                                S/ {totalMonto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <button onClick={guardarCambios} disabled={isSaving} className="ml-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all flex items-center gap-2 shadow-md hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-50" style={{ backgroundColor: COLORS.maroon }}>
                            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {isSaving ? "Sincronizando..." : "Guardar Lote"}
                        </button>
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                            <button onClick={() => setIncluyeIgv(false)} className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${!incluyeIgv ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>PRECIO SUBTOTAL</button>
                            <button onClick={() => setIncluyeIgv(true)} className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all ${incluyeIgv ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>PRECIO TOTAL</button>
                        </div>
                        <button onClick={enviarAdministracion} disabled={selectedItems.length === 0} className="px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md hover:translate-y-[-2px] disabled:opacity-50" style={{ backgroundColor: "#D4AF37", color: "#800000" }}>
                            Enviar a Administrador
                        </button>
                        <div className="flex items-center gap-2">
                            <label className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-200">
                                Subir archivo
                                <input type="file" accept=".pdf,.jpg,.png" className="hidden" onChange={(e) => { if (e.target.files[0]) setArchivo(e.target.files[0]); }} />
                            </label>
                            {archivo && <span className="text-xs text-slate-500">{archivo.name}</span>}
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-1 gap-8">
                    <div className="space-y-6">
                        {/* FILTROS (MEJORADOS) */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center flex-wrap">
                            <div className="relative flex-1 min-w-[200px] group w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#6B0000] transition-colors" size={18} />
                                <input type="text" placeholder="Buscar descripción o código..." className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-[#6B0000]/20 focus:ring-4 focus:ring-[#6B0000]/5 rounded-xl py-3 pl-11 text-sm text-slate-600 transition-all outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>

                            <div className="relative min-w-[200px] w-full md:w-auto">
                                <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: COLORS.gold }} size={18} />
                                <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} className="w-full bg-slate-50 border-transparent rounded-xl py-3 pl-11 pr-10 text-xs font-bold text-slate-600 appearance-none focus:bg-white focus:ring-4 focus:ring-[#6B0000]/5 outline-none cursor-pointer uppercase transition-all">
                                    {uniqueProviders.map(p => <option key={p} value={p}>{p === 'todos' ? 'Todos los Proveedores' : p}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                            </div>

                            <div className="relative min-w-[200px] w-full md:w-auto">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: COLORS.maroon }} size={18} />
                                <select value={grupoFilter} onChange={(e) => setGrupoFilter(e.target.value)} className="w-full bg-slate-50 border-transparent rounded-xl py-3 pl-11 pr-10 text-xs font-bold text-slate-600 appearance-none focus:bg-white focus:ring-4 focus:ring-[#6B0000]/5 outline-none cursor-pointer uppercase transition-all">
                                    <option value="todos">Todos los grupos</option>
                                    {uniqueGroups.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                            </div>

                            {/* NUEVO ORDEN POR FECHA */}
                            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                                <button onClick={() => setFechaOrder('desc')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${fechaOrder === 'desc' ? 'bg-white text-[#800000] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                    <ArrowDown size={14} /> Más Reciente
                                </button>
                                <button onClick={() => setFechaOrder('asc')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${fechaOrder === 'asc' ? 'bg-white text-[#800000] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                    <ArrowUp size={14} /> Más Antigua
                                </button>
                            </div>

                            <button onClick={fetchItems} className="p-3 text-slate-400 hover:text-[#6B0000] hover:bg-red-50 rounded-xl transition-all" title="Refrescar datos">
                                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        {/* FILTROS DE EMPRESA Y SEDE (sin cambios) */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Empresa</label>
                                <div className="flex gap-2">
                                    {[{ id: 1, n: 'EDUTUR' }, { id: 2, n: 'KEVSTUR' }].map(e => (
                                        <button key={e.id} onClick={() => { setEmpresaSeleccionada(e.id); setSedeSeleccionada(null); }} className={`px-4 py-2 rounded-xl text-xs font-bold ${empresaSeleccionada === e.id ? 'bg-[#800000] text-white' : 'bg-white border text-slate-400'}`}>
                                            {e.n}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {empresaSeleccionada && (
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Sedes</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {[...new Set(items.filter(i => Number(i.empresa_id) === Number(empresaSeleccionada)).map(i => i.sede_id))].map(sedeId => {
                                            const sede = items.find(i => i.sede_id === sedeId);
                                            return (
                                                <button key={sedeId} onClick={() => setSedeSeleccionada(sedeId)} className={`px-3 py-1 rounded-lg text-xs font-bold ${sedeSeleccionada === sedeId ? 'bg-[#D4AF37] text-white' : 'bg-white border text-slate-400'}`}>
                                                    {sede?.sede_nombre}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* TABS (sin cambios) */}
                        <div className="flex gap-2 mb-4 flex-wrap">
                            <button onClick={() => setTab("logistica_pendiente")} className={`px-4 py-2 rounded-lg text-sm font-bold ${tab === "logistica_pendiente" ? "bg-[#6B0000] text-white" : "bg-white border text-slate-500"}`}>Logística Pendiente ({tabItems.logistica_pendiente.length})</button>
                            <button onClick={() => setTab("logistica_enviado")} className={`px-4 py-2 rounded-lg text-sm font-bold ${tab === "logistica_enviado" ? "bg-blue-600 text-white" : "bg-white border text-slate-500"}`}>Logística Enviado ({tabItems.logistica_enviado.length})</button>
                            <button onClick={() => setTab("administracion_pendiente")} className={`px-4 py-2 rounded-lg text-sm font-bold ${tab === "administracion_pendiente" ? "bg-amber-500 text-white" : "bg-white border text-slate-500"}`}>Admin Pendiente ({tabItems.administracion_pendiente.length})</button>
                            <button onClick={() => setTab("administracion_aprobado")} className={`px-4 py-2 rounded-lg text-sm font-bold ${tab === "administracion_aprobado" ? "bg-green-600 text-white" : "bg-white border text-slate-500"}`}>Admin Aprobado ({tabItems.administracion_aprobado.length})</button>
                            <button onClick={() => setTab("administracion_observado")} className={`px-4 py-2 rounded-lg text-sm font-bold ${tab === "administracion_observado" ? "bg-red-500 text-white" : "bg-white border text-slate-500"}`}>Observados ({tabItems.administracion_observado.length})</button>
                            <button onClick={() => setTab("administracion_denegado")} className={`px-4 py-2 rounded-lg text-sm font-bold ${tab === "administracion_denegado" ? "bg-black text-white" : "bg-white border text-slate-500"}`}>Denegados ({tabItems.administracion_denegado.length})</button>
                            <button onClick={() => setTab("tesoreria_pendiente")} className={`px-4 py-2 rounded-lg text-sm font-bold ${tab === "tesoreria_pendiente" ? "bg-yellow-500 text-white" : "bg-white border text-slate-500"}`}>Tesorería Pendiente ({tabItems.tesoreria_pendiente.length})</button>
                            <button onClick={() => setTab("tesoreria_pagado")} className={`px-4 py-2 rounded-lg text-sm font-bold ${tab === "tesoreria_pagado" ? "bg-emerald-600 text-white" : "bg-white border text-slate-500"}`}>Pagados ({tabItems.tesoreria_pagado.length})</button>
                            <button onClick={() => setTab("finalizados")} className={`px-4 py-2 rounded-lg text-sm font-bold ${tab === "finalizados" ? "bg-slate-700 text-white" : "bg-white border text-slate-500"}`}>Finalizados ({tabItems.finalizados.length})</button>
                        </div>

                        {/* MAIN TABLE (AHORA CON PAGINACIÓN) */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-separate border-spacing-0">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-6 py-4 text-center border-b border-slate-100">
                                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#6B0000] focus:ring-[#6B0000] transition-all cursor-pointer" onChange={(e) => setSelectedItems(e.target.checked ? currentTabItems.map(i => i.id) : [])} />
                                            </th>
                                            <th className="px-4 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">Referencia</th>
                                            <th className="px-4 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">Descripción</th>
                                            <th className="px-4 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">Precio U.</th>
                                            <th className="px-4 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">Proveedor</th>
                                            <th className="px-4 py-4 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">Centro Costo</th>
                                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">Detalles</th>
                                            <th className="px-4 py-4 text-center text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">Atributos</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {paginatedItems.map((it) => {
                                            const isSelected = selectedItems.includes(it.id);
                                            const isEditable = (it.flujo_estado || "").toUpperCase() === "LOGISTICA";
                                            return (
                                                <tr key={it.id} className={`group transition-all ${isSelected ? 'bg-amber-50/30' : 'hover:bg-slate-50/50'}`}>
                                                    <td className="px-6 py-4 text-center">
                                                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(it.id)} className="w-4 h-4 rounded border-slate-300 text-[#6B0000] focus:ring-[#6B0000] cursor-pointer" />
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span className="text-xs font-bold text-slate-900 block">ID {it.id}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium tracking-tight uppercase">REQ-{it.requerimiento_id}</span>
                                                    </td>
                                                    <td className="px-4 py-4 min-w-[200px]">
                                                        <p className="text-sm font-semibold text-slate-700 leading-tight mb-1">{it.descripcion}</p>
                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">{it.cantidad} {it.unidad}</span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="relative flex items-center">
                                                            <span className="absolute left-0 text-[10px] font-bold text-slate-400">S/</span>
                                                            <input
                                                                type="number"
                                                                value={it.precio_unitario || 0}
                                                                disabled={!isEditable}
                                                                onChange={(e) => handleUpdate(it.id, 'precio_unitario', e.target.value)}
                                                                className="w-24 bg-transparent border-b border-slate-200 focus:border-[#C5A059] pl-4 py-1 text-sm font-bold text-slate-700 outline-none transition-all disabled:opacity-40"
                                                            />
                                                        </div>
                                                        <span className="text-[8px] text-slate-400 mt-0.5 block">
                                                            {it.incluye_igv === 1 ? "(Precio incluye IGV)" : "(Precio + IGV)"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="relative w-full min-w-[180px]">
                                                            <input type="text" placeholder="Buscar proveedor..." value={it.proveedor || ""} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-maroon/5 outline-none transition-all" onChange={(e) => { handleUpdate(it.id, "proveedor", e.target.value); buscarProveedores(e.target.value, it.id); }} />
                                                            {activeRowId === it.id && proveedores.length > 0 && (
                                                                <div className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto custom-scrollbar">
                                                                    {proveedores.map(p => (
                                                                        <div key={p.id} onClick={() => { handleUpdate(it.id, "proveedor", p.nombre); handleUpdate(it.id, "proveedor_id", p.id); setProveedores([]); setActiveRowId(null); }} className="px-4 py-2 text-xs hover:bg-slate-50 cursor-pointer font-semibold text-slate-600 flex justify-between items-center border-b border-slate-50 last:border-0">
                                                                            {p.nombre} <span className="text-[9px] text-slate-400">ID: {p.id}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="relative w-full min-w-[180px]">
                                                            <input type="text" placeholder="Buscar CC..." value={it.centro_costo_label || ""} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs" onChange={(e) => { handleUpdate(it.id, "centro_costo_label", e.target.value); buscarCentros(e.target.value, it.requerimiento_id, it.id); }} />
                                                            {activeCCRowId === it.id && centrosFiltrados.length > 0 && (
                                                                <div className="absolute left-0 top-full mt-1 w-full bg-white border rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto">
                                                                    {centrosFiltrados.map(cc => (
                                                                        <div key={cc.id} onClick={() => { handleUpdate(it.id, "centro_costo_id", cc.id); handleUpdate(it.id, "centro_costo_label", `${cc.codigo} - ${cc.nombre}`); setCentrosFiltrados([]); setActiveCCRowId(null); }} className="px-4 py-2 text-xs hover:bg-slate-50 cursor-pointer font-semibold">
                                                                            {cc.codigo} - {cc.nombre}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        {(it.comentario_solicitante || it.archivo_adjunto) ? (
                                                            <button onClick={() => verDetallesItem(it)} className="p-2 rounded-lg transition-all border bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100" title="Ver comentario y archivo"><MessageSquare size={16} /></button>
                                                        ) : <span className="text-[10px] text-slate-300">-</span>}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <button onClick={() => toggleCotizacion(it)} className={`p-2 rounded-lg transition-all border ${Number(it.requiere_cotizacion) === 1 ? 'bg-amber-50 text-[#C5A059] border-amber-100' : 'bg-slate-50 text-slate-300 border-slate-100 hover:text-slate-400'}`} title="Cotización"><FileCheck size={16} /></button>
                                                            <button onClick={() => toggleInsumo(it)} className={`p-2 rounded-lg transition-all border ${Number(it.es_insumo) === 1 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-300 border-slate-100 hover:text-slate-400'}`} title="Insumo"><Apple size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {paginatedItems.length === 0 && !loading && (
                                            <tr><td colSpan="8" className="p-20 text-center"><div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-slate-100 text-slate-200"><Search size={32} /></div><p className="text-slate-400 font-medium">No se encontraron registros</p></td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* PAGINACIÓN */}
                            {totalItems > 0 && (
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
                                        Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} de {totalItems} elementos
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
                </main>
            </div>

            {/* MODAL DETALLES (sin cambios) */}
            {showDetailsModal && selectedItemDetails && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-[#800000] to-[#600000] px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3"><MessageSquare className="text-amber-400" size={20} /><h3 className="text-white font-bold">Detalles del Requerimiento</h3></div>
                            <button onClick={() => setShowDetailsModal(false)} className="text-white/70 hover:text-white transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100"><div><p className="text-[10px] font-bold text-slate-400 uppercase">Item ID</p><p className="text-sm font-bold text-slate-800">{selectedItemDetails.id}</p></div><div><p className="text-[10px] font-bold text-slate-400 uppercase">Requerimiento</p><p className="text-sm font-bold text-slate-800">REQ-{selectedItemDetails.requerimiento_id}</p></div></div>
                            <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Descripción</p><p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{selectedItemDetails.descripcion}</p></div>
                            <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-2"><MessageSquare size={12} /> Comentario del Solicitante</p><div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-xl"><p className="text-sm text-amber-800 italic">{selectedItemDetails.comentario_solicitante || "Sin comentarios"}</p></div></div>
                            <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-2"><FileText size={12} /> Archivo Adjunto</p>{selectedItemDetails.archivo_adjunto ? (<div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">{selectedItemDetails.archivo_adjunto.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (<img src={`${API}${selectedItemDetails.archivo_adjunto}`} alt="Adjunto" className="w-16 h-16 object-cover rounded-lg" />) : (<div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><FileText size={24} className="text-red-600" /></div>)}<div className="flex-1"><p className="text-xs font-medium text-slate-700 truncate">{selectedItemDetails.archivo_adjunto.split('/').pop()}</p><a href={`${API}${selectedItemDetails.archivo_adjunto}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-blue-600 hover:text-blue-800"><Eye size={14} /> Ver archivo</a></div></div>) : (<p className="text-sm text-slate-400 italic">No hay archivo adjunto</p>)}</div>
                        </div>
                        <div className="bg-slate-50 px-6 py-4 flex justify-end"><button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-300 transition-colors">Cerrar</button></div>
                    </div>
                </div>
            )}

            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; }
            .font-serif { font-family: 'Playfair Display', serif; }
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            input[type="number"]::-webkit-inner-spin-button, 
            input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        `}</style>
        </div>
    );
};

export default Logistica;