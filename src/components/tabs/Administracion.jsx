import React, { useEffect, useState, useMemo } from "react";
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Building2,
    Filter,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    ArrowUp,
    ArrowDown
} from "lucide-react";

import { API_BASE } from "../../config/api";

const API = API_BASE + "administracion.php";
const IGV_RATE = 0.18; // 18%

const Administracion = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalObs, setModalObs] = useState(false);
    const [itemSeleccionado, setItemSeleccionado] = useState(null);
    const [comentario, setComentario] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("ADMINISTRACION");
    const [expandedReq, setExpandedReq] = useState(null);

    // Estados para filtros
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [proveedorFilter, setProveedorFilter] = useState("");
    const [departamentoFilter, setDepartamentoFilter] = useState("");

    // Estados para ordenamiento
    const [fechaOrder, setFechaOrder] = useState(null); // 'asc' o 'desc'
    const [precioOrder, setPrecioOrder] = useState(null); // 'asc' o 'desc'

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const colors = {
        granate: "#800020",
        dorado: "#D4AF37",
        doradoSuave: "#F4EBD0"
    };

    const getPrecioVisual = (item) => {
        const precioBase = Number(item.precio_unitario) || 0;
        const incluyeIgv = Number(item.incluye_igv) === 1;
        return incluyeIgv ? precioBase * (1 + IGV_RATE) : precioBase;
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

    // Filtro por estado (original)
    const itemsFiltrados = items.filter(it => {
        if (filtroEstado === "TODOS") return true;
        if (filtroEstado === "ADMINISTRACION") {
            // Debe estar en flujo ADMINISTRACION y su estado_administracion sea PENDIENTE
            return (it.flujo_estado || "") === "ADMINISTRACION" &&
                (it.estado_administracion || "PENDIENTE").toUpperCase() === "PENDIENTE";
        }
        const estadoAdmin = (it.estado_administracion || "PENDIENTE").toUpperCase();
        return estadoAdmin === filtroEstado;
    });

    // Agrupación por requerimiento (base)
    const requerimientosBase = useMemo(() => {
        return Object.values(
            itemsFiltrados.reduce((acc, item) => {
                const reqId = item.requerimiento_id || item.id;
                if (!acc[reqId]) {
                    acc[reqId] = {
                        id: reqId,
                        codigo: item.requerimiento_codigo || "-",
                        fecha: item.fecha || "-",
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
    }, [itemsFiltrados]);

    // Listas únicas para autocompletado
    const proveedoresUnicos = useMemo(() => {
        const proveedores = new Set();
        requerimientosBase.forEach(req => {
            req.items.forEach(item => {
                if (item.proveedor && item.proveedor.trim()) {
                    proveedores.add(item.proveedor);
                }
            });
        });
        return Array.from(proveedores).sort();
    }, [requerimientosBase]);

    const departamentosUnicos = useMemo(() => {
        const deptos = new Set();
        requerimientosBase.forEach(req => {
            if (req.departamento && req.departamento.trim()) {
                deptos.add(req.departamento);
            }
        });
        return Array.from(deptos).sort();
    }, [requerimientosBase]);

    // Aplicar filtros adicionales
    const requerimientosConFiltros = useMemo(() => {
        return requerimientosBase.filter(req => {
            const totalReq = req.items.reduce((acc, i) => {
                const precioVis = getPrecioVisual(i);
                return acc + (precioVis * (Number(i.cantidad) || 0));
            }, 0);

            if (minPrice !== "" && totalReq < Number(minPrice)) return false;
            if (maxPrice !== "" && totalReq > Number(maxPrice)) return false;
            if (startDate && req.fecha < startDate) return false;
            if (endDate && req.fecha > endDate) return false;
            if (proveedorFilter) {
                const tieneProveedor = req.items.some(item =>
                    item.proveedor && item.proveedor.toLowerCase().includes(proveedorFilter.toLowerCase())
                );
                if (!tieneProveedor) return false;
            }
            if (departamentoFilter && req.departamento !== departamentoFilter) return false;
            return true;
        });
    }, [requerimientosBase, minPrice, maxPrice, startDate, endDate, proveedorFilter, departamentoFilter]);

    // Aplicar ordenamiento
    const requerimientosOrdenados = useMemo(() => {
        let ordenados = [...requerimientosConFiltros];

        // Orden por fecha
        if (fechaOrder === 'asc') {
            ordenados.sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));
        } else if (fechaOrder === 'desc') {
            ordenados.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
        }

        // Orden por precio (sobrescribe orden por fecha si ambos están activos? El usuario puede elegir uno a la vez o permitir ambos?
        // Según la lógica típica, se ordena por el último seleccionado. Vamos a permitir que solo uno esté activo a la vez.
        // Para evitar conflictos, al hacer clic en precio, se resetea fechaOrder, y viceversa.
        // Pero como el usuario pide botones separados, implementaré que al hacer clic en uno se desactive el otro.
        // Esto lo haremos en los handlers.
        if (precioOrder === 'asc') {
            ordenados.sort((a, b) => {
                const totalA = a.items.reduce((acc, i) => acc + (getPrecioVisual(i) * (Number(i.cantidad) || 0)), 0);
                const totalB = b.items.reduce((acc, i) => acc + (getPrecioVisual(i) * (Number(i.cantidad) || 0)), 0);
                return totalA - totalB;
            });
        } else if (precioOrder === 'desc') {
            ordenados.sort((a, b) => {
                const totalA = a.items.reduce((acc, i) => acc + (getPrecioVisual(i) * (Number(i.cantidad) || 0)), 0);
                const totalB = b.items.reduce((acc, i) => acc + (getPrecioVisual(i) * (Number(i.cantidad) || 0)), 0);
                return totalB - totalA;
            });
        }

        return ordenados;
    }, [requerimientosConFiltros, fechaOrder, precioOrder]);

    // Resetear página al cambiar filtros u ordenamiento
    useEffect(() => {
        setCurrentPage(1);
    }, [minPrice, maxPrice, startDate, endDate, proveedorFilter, departamentoFilter, filtroEstado, itemsPerPage, fechaOrder, precioOrder]);

    // Paginación
    const totalPages = Math.ceil(requerimientosOrdenados.length / itemsPerPage);
    const paginatedReqs = requerimientosOrdenados.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
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

    const limpiarFiltros = () => {
        setMinPrice("");
        setMaxPrice("");
        setStartDate("");
        setEndDate("");
        setProveedorFilter("");
        setDepartamentoFilter("");
        setFiltroEstado("ADMINISTRACION");
        setFechaOrder(null);
        setPrecioOrder(null);
    };

    // Handlers para ordenamiento con exclusión mutua
    const handleFechaOrder = (order) => {
        setPrecioOrder(null);  // desactivar orden por precio
        setFechaOrder(order === fechaOrder ? null : order); // toggle si se hace clic en el mismo
    };

    const handlePrecioOrder = (order) => {
        setFechaOrder(null);   // desactivar orden por fecha
        setPrecioOrder(order === precioOrder ? null : order);
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
                        <option value="ADMINISTRACION">Pendientes</option>
                        <option value="APROBADO">Aprobados</option>
                        <option value="DENEGADO">Rechazados</option>
                        <option value="TODOS">Todos</option>
                    </select>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Panel de filtros avanzados */}
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm mb-8 overflow-hidden">
                        {/* HEADER DEL PANEL */}
                        <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Filter size={14} className="text-slate-400" />
                                Filtros y ordenamiento
                            </h2>
                        </div>

                        {/* CUERPO DEL PANEL */}
                        <div className="p-8">
                            {/* GRID DE INPUTS (Simplificado a una sola malla orgánica de 3 columnas en LG) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {/* Rango de Precios */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">Rango de Precios (S/)</label>
                                    <div className="flex items-center gap-2">
                                        <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Mín: 0.00" className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/70 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all text-sm font-medium" />
                                        <span className="text-slate-300 text-xs">—</span>
                                        <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Máx: 999999" className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/70 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all text-sm font-medium" />
                                    </div>
                                </div>

                                {/* Rango de Fechas */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">Período de Fecha</label>
                                    <div className="flex items-center gap-2">
                                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/70 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all text-sm font-medium text-slate-600" />
                                        <span className="text-slate-300 text-xs">—</span>
                                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/70 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all text-sm font-medium text-slate-600" />
                                    </div>
                                </div>

                                {/* Proveedor */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">Proveedor</label>
                                    <div className="relative">
                                        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="text" value={proveedorFilter} onChange={(e) => setProveedorFilter(e.target.value)} placeholder="Buscar por proveedor..." list="proveedores-list" className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200/70 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all text-sm font-medium" />
                                        <datalist id="proveedores-list">
                                            {proveedoresUnicos.map(prov => <option key={prov} value={prov} />)}
                                        </datalist>
                                    </div>
                                </div>

                                {/* Departamento */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">Departamento</label>
                                    <select value={departamentoFilter} onChange={(e) => setDepartamentoFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200/70 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 outline-none transition-all text-sm font-medium text-slate-700 cursor-pointer">
                                        <option value="">Todos los departamentos</option>
                                        {departamentosUnicos.map(depto => <option key={depto} value={depto}>{depto}</option>)}
                                    </select>
                                </div>

                                {/* Botón de Limpieza integrado orgánicamente */}
                                <div className="flex items-end lg:col-span-2">
                                    <button onClick={limpiarFiltros} className="px-5 py-2.5 border border-dashed border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all flex items-center gap-2 text-sm font-bold">
                                        <X size={15} /> Limpiar todos los filtros
                                    </button>
                                </div>
                            </div>

                            {/* SECCIÓN DE ORDENAMIENTO DE BOTONES */}
                            <div className="border-t border-slate-100 pt-6 mt-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                                <div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2.5">Ordenar registros por</p>
                                    <div className="flex flex-wrap gap-3">
                                        {/* Fecha */}
                                        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                                            <button
                                                onClick={() => handleFechaOrder('desc')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${fechaOrder === 'desc' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                            >
                                                <ArrowDown size={13} /> Reciente
                                            </button>
                                            <button
                                                onClick={() => handleFechaOrder('asc')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${fechaOrder === 'asc' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                            >
                                                <ArrowUp size={13} /> Antigua
                                            </button>
                                        </div>

                                        {/* Precio */}
                                        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                                            <button
                                                onClick={() => handlePrecioOrder('desc')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${precioOrder === 'desc' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                            >
                                                <ArrowDown size={13} /> Precio Mayor
                                            </button>
                                            <button
                                                onClick={() => handlePrecioOrder('asc')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${precioOrder === 'asc' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                            >
                                                <ArrowUp size={13} /> Precio Menor
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* RESUMEN Y PAGINACIÓN INTEGRADO EN EL PIE DE LOS FILTROS */}
                                <div className="flex flex-row items-center gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 justify-between md:justify-end w-full md:w-auto">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Total: <span className="text-slate-700 font-black normal-case text-sm ml-1">{paginatedReqs.length} de {requerimientosOrdenados.length}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filas:</label>
                                        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:bg-white outline-none cursor-pointer">
                                            <option value={10}>10</option>
                                            <option value={15}>15</option>
                                            <option value={20}>20</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Tabla principal */}
                <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-white" style={{ backgroundColor: colors.granate }}>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest border-r border-white/10">Código</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest border-r border-white/10">Fecha</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest border-r border-white/10">Departamento</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest border-r border-white/10">Empresa / Sede</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-right border-r border-white/10">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center border-r border-white/10">AREA</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedReqs.map(req => {
                                    const totalReq = req.items.reduce((acc, i) => acc + (getPrecioVisual(i) * (Number(i.cantidad) || 0)), 0);
                                    const isExpanded = expandedReq === req.id;
                                    return (
                                        <React.Fragment key={req.id}>
                                            <tr className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50 border-l-4' : ''}`}
                                                style={{ borderLeftColor: isExpanded ? colors.dorado : 'transparent' }}
                                                onClick={() => setExpandedReq(isExpanded ? null : req.id)}>
                                                <td className="px-6 py-5 font-bold" style={{ color: colors.granate }}>{req.codigo}</td>
                                                <td className="px-6 py-5 font-bold text-slate-700"><div className="flex items-center gap-1"><Calendar size={12} className="text-slate-400" /><span>{req.fecha}</span></div></td>
                                                <td className="px-6 py-5 text-sm font-medium text-slate-600">{req.departamento}</td>
                                                <td className="px-6 py-5 text-sm text-slate-500">{req.empresa} <span className="mx-1 text-slate-300">|</span> {req.sede}</td>
                                                <td className="px-6 py-5 text-right font-bold text-slate-900 text-base">S/ {totalReq.toFixed(2)}</td>
                                                <td className="px-6 py-5 text-center"><Badge variant={req.flujo_estado}>{req.flujo_estado}</Badge></td>
                                                <td className="px-6 py-5 text-center"><div className={`inline-flex p-2 rounded-full transition-all ${isExpanded ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>{isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div></td>
                                            </tr>
                                            {isExpanded && (
                                                <tr><td colSpan="7" className="px-8 py-6 bg-slate-50">
                                                    <div className="bg-white rounded-lg shadow-inner border border-slate-200 overflow-hidden">
                                                        <table className="w-full">
                                                            <thead className="bg-slate-800 text-white">
                                                                <tr>
                                                                    <th className="px-4 py-3 text-[10px] uppercase font-bold tracking-wider">Descripción</th>
                                                                    <th className="px-4 py-3 text-[10px] uppercase font-bold tracking-wider">Cant.</th>
                                                                    <th className="px-4 py-3 text-[10px] uppercase font-bold tracking-wider text-right">Unitario</th>
                                                                    <th className="px-4 py-3 text-[10px] uppercase font-bold tracking-wider">Proveedor</th>
                                                                    <th className="px-4 py-3 text-[10px] uppercase font-bold tracking-wider text-center">Estado Admin</th>
                                                                    <th className="px-4 py-3 text-[10px] uppercase font-bold tracking-wider text-center">Gestión</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100">
                                                                {req.items.map(it => (
                                                                    <tr key={it.id} className="hover:bg-slate-50/50 transition-colors">
                                                                        <td className="px-4 py-3 text-sm font-medium">{it.descripcion}</td>
                                                                        <td className="px-4 py-3 text-sm">{it.cantidad} <span className="text-slate-400 text-xs">{it.unidad}</span></td>
                                                                        <td className="px-4 py-3 text-sm text-right font-bold">S/ {getPrecioVisual(it).toFixed(2)}</td>
                                                                        <td className="px-4 py-3 text-sm">{it.proveedor || "-"}</td>
                                                                        <td className="px-4 py-3 text-center"><Badge variant={(it.estado_administracion || "PENDIENTE").toUpperCase()}>{it.estado_administracion || "PENDIENTE"}</Badge></td>
                                                                        <td className="px-4 py-3">
                                                                            <div className="flex justify-center gap-2">
                                                                                {it.flujo_estado === "ADMINISTRACION" && (it.estado_administracion || "PENDIENTE") === "PENDIENTE" ? (
                                                                                    <>
                                                                                        <button onClick={(e) => { e.stopPropagation(); cambiarEstado(it.id, "APROBADO"); }} className="p-2 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100" title="Aprobar"><CheckCircle2 size={16} /></button>
                                                                                        <button onClick={(e) => { e.stopPropagation(); setItemSeleccionado(it); setModalObs(true); }} className="p-2 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-600 hover:text-white transition-all border border-amber-100" title="Observar"><AlertCircle size={16} /></button>
                                                                                        <button onClick={(e) => { e.stopPropagation(); cambiarEstado(it.id, "DENEGADO"); }} className="p-2 bg-rose-50 text-rose-600 rounded-md hover:bg-rose-600 hover:text-white transition-all border border-rose-100" title="Denegar"><XCircle size={16} /></button>
                                                                                    </>
                                                                                ) : <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Solo lectura</span>}
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td></tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {requerimientosOrdenados.length === 0 && (
                        <div className="text-center py-20 bg-slate-50/50">
                            <Filter size={48} className="mx-auto text-slate-200 mb-4" />
                            <h3 className="text-lg font-bold text-slate-400">Sin registros para mostrar</h3>
                            <button onClick={limpiarFiltros} className="mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium">Limpiar filtros</button>
                        </div>
                    )}

                    {/* Paginación inferior */}
                    {requerimientosOrdenados.length > 0 && (
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-3">
                            <div className="text-sm text-slate-500">Página {currentPage} de {totalPages}</div>
                            <div className="flex gap-2">
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}><ChevronLeft size={16} /> Anterior</button>
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) pageNum = i + 1;
                                        else if (currentPage <= 3) pageNum = i + 1;
                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else pageNum = currentPage - 2 + i;
                                        return (
                                            <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage === pageNum ? 'text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`} style={currentPage === pageNum ? { backgroundColor: colors.granate } : {}}>{pageNum}</button>
                                        );
                                    })}
                                </div>
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${currentPage === totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}`}>Siguiente <ChevronRight size={16} /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal observación (sin cambios) */}
            {modalObs && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ backgroundColor: colors.granate }}>
                            <div><h3 className="text-white font-bold text-lg">Observar Item</h3><p className="text-white/70 text-xs">Escribe el motivo de la observación</p></div>
                            <button onClick={() => { setModalObs(false); setComentario(""); setItemSeleccionado(null); }} className="text-white hover:text-red-200 transition"><XCircle size={22} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-slate-50 border rounded-xl p-4"><div className="text-xs text-slate-400 uppercase font-bold mb-1">Item seleccionado</div><div className="font-semibold text-slate-700">{itemSeleccionado?.descripcion}</div>{itemSeleccionado?.proveedor && <div className="text-xs text-slate-500 mt-1">Proveedor: {itemSeleccionado.proveedor}</div>}</div>
                            <div><label className="text-sm font-bold text-slate-700 block mb-2">Comentario</label><textarea value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Escribe el motivo de la observación..." className="w-full min-h-[140px] border rounded-xl p-4 outline-none focus:ring-2 focus:ring-amber-400 resize-none" /></div>
                        </div>
                        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => { setModalObs(false); setComentario(""); setItemSeleccionado(null); }} className="px-5 py-2 rounded-xl border font-semibold hover:bg-slate-100 transition">Cancelar</button>
                            <button onClick={async () => { if (!comentario.trim()) { alert("Ingrese un comentario"); return; } await cambiarEstado(itemSeleccionado.id, "OBSERVADO", comentario); setModalObs(false); setComentario(""); setItemSeleccionado(null); }} className="px-5 py-2 rounded-xl text-white font-bold transition hover:opacity-90" style={{ backgroundColor: colors.granate }}>Guardar Observación</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Administracion;