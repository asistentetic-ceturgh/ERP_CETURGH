import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, X, Download, Edit3, MapPin, Building2, Layers, ChevronUp,
    ChevronDown, Hash, ListTree, Tag
} from 'lucide-react';
import { API_BASE } from "../../config/api";

const API = API_BASE + "centros_costos.php?action=";
const CentrosCostos = () => {

    const [currentUser, setCurrentUser] = useState(null);

    // --- ESTADOS ---
    const [activeTab, setActiveTab] = useState('Centros de Costos');
    const [filtroTipo, setFiltroTipo] = useState('INSTITUTO');
    const [expandedArea, setExpandedArea] = useState(null);
    const [expandedSubArea, setExpandedSubArea] = useState(null);

    const [showCCModal, setShowCCModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    const [showSubCCModal, setShowSubCCModal] = useState(false);

    const [editingCC, setEditingCC] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [editingSubArea, setEditingSubArea] = useState(null);

    const [selectedSubAreaId, setSelectedSubAreaId] = useState(null);
    const [selectedSubAreaCode, setSelectedSubAreaCode] = useState(null);
    const [selectedCentroId, setSelectedCentroId] = useState(null);

    const [centrosCostos, setCentrosCostos] = useState([]);

    const [formCC, setFormCC] = useState({
        codigo: "",
        area: "",
        sede: "",
        presupuestoAnual: ""
    });

    const [formSubArea, setFormSubArea] = useState({
        codigo: "",
        nombre: "",
        presupuesto: ""
    });

    const [formItem, setFormItem] = useState({
        codigo: "",
        nombre: "",
        presupuesto: ""
    });

    // --- INIT ---
    useEffect(() => {
        fetchCentrosCostos();
    }, []);

    // --- FETCH PRINCIPAL (CORREGIDO) ---
    const fetchCentrosCostos = async () => {
        try {
            const res = await fetch(API + "listar");

            const text = await res.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error(" Backend devolvió HTML:", text);
                alert("Error en servidor (PHP está fallando)");
                return;
            }

            if (!Array.isArray(data)) {
                console.error("Formato inesperado:", data);
                return;
            }

            const adaptado = data.map(cc => ({
                id: cc.id,
                codigo: cc.codigo,
                area: cc.nombre,
                sede: getSedeNombre(cc.sede_id),
                tipo: getTipo(cc.sede_id),
                presupuestoAnual: Number(cc.presupuesto) || 0,
                gastado: Number(cc.gastado) || 0,
                subAreas: (cc.subAreas || []).map(sub => ({
                    ...sub,
                    presupuesto: Number(sub.presupuesto) || 0,
                    items: (sub.items || []).map(item => ({
                        ...item,
                        presupuesto: Number(item.presupuesto) || 0,
                        gastado: Number(item.gastado) || 0
                    }))
                }))
            }));

            setCentrosCostos(adaptado);

        } catch (error) {
            console.error("Error cargando centros:", error);
        }
    };

    // --- HELPERS ---
    const getSedeNombre = (sede_id) => {
        if (sede_id == 1) return "PIURA";
        if (sede_id == 2) return "SULLANA";
        if (sede_id == 3) return "PIURA";
        return "N/A";
    };

    const getTipo = (sede_id) => {
        if (sede_id == 1) return "CETPRO PIURA";
        if (sede_id == 2) return "CETPRO SULLANA";
        if (sede_id == 3) return "INSTITUTO";
        return "INSTITUTO";
    };

    const getEmpresaId = (sede) => {
        if (sede === "INSTITUTO") return 2;
        return 1;
    };

    const getSedeId = (sede) => {
        if (sede === "INSTITUTO") return 3;
        if (sede === "CETPRO PIURA") return 1;
        if (sede === "CETPRO SULLANA") return 2;
    };

    // --- CRUD CENTRO ---
    const saveCentroCosto = async () => {
        try {
            const action = editingCC ? "editar" : "crear_centro";

            const res = await fetch(API + action, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingCC?.id,
                    codigo: formCC.codigo,
                    nombre: formCC.area,
                    empresa_id: getEmpresaId(formCC.sede),
                    sede_id: getSedeId(formCC.sede),
                    presupuesto: formCC.presupuestoAnual
                })
            });

            const data = await res.json();

            if (data.success) {
                setShowCCModal(false);
                setEditingCC(null);
                fetchCentrosCostos();
            }

        } catch (error) {
            console.error("Error centro:", error);
        }
    };

    // --- CRUD SUBAREA ---
    const saveSubArea = async (e) => {
        e.preventDefault();

        try {
            const action = editingSubArea ? "editar" : "crear_subcentro";

            const res = await fetch(API + action, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingSubArea?.id,
                    codigo: formSubArea.codigo,
                    nombre: formSubArea.nombre,
                    presupuesto: formSubArea.presupuesto,
                    parent_id: selectedCentroId
                })
            });

            const data = await res.json();

            if (data.success) {
                setShowSubCCModal(false);
                setEditingSubArea(null);
                fetchCentrosCostos();
            }

        } catch (error) {
            console.error("Error subcentro:", error);
        }
    };

    // --- DELETE ---
    const deleteCentro = async (id) => {
        if (!window.confirm("¿Eliminar centro y todo su contenido?")) return;

        await fetch(API + "eliminar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        fetchCentrosCostos();
    };

    const deleteSubArea = async (id) => {
        await deleteCentro(id);
    };

    const deleteItem = async (id) => {
        await deleteCentro(id);
    };

    // --- MODALES ---
    const openCCModal = (cc = null) => {
        if (cc) {
            setEditingCC(cc);
            setFormCC({
                codigo: cc.codigo,
                area: cc.area,
                sede: cc.sede,
                presupuestoAnual: cc.presupuestoAnual
            });
        } else {
            setEditingCC(null);
            setFormCC({
                codigo: "",
                area: "",
                sede: "",
                presupuestoAnual: ""
            });
        }
        setShowCCModal(true);
    };

    const openSubAreaModal = (sub = null, parentId = null) => {
        setEditingSubArea(sub);
        setSelectedCentroId(parentId);

        if (sub) {
            setFormSubArea({
                codigo: sub.codigo,
                nombre: sub.nombre,
                presupuesto: sub.presupuesto
            });
        } else {
            setFormSubArea({
                codigo: "",
                nombre: "",
                presupuesto: ""
            });
        }

        setShowSubCCModal(true);
    };

    const openItemModal = (item = null, sub = null) => {
        if (sub) {
            setSelectedSubAreaId(sub.id);
        }

        if (item) {
            setEditingItem(item);
            setFormItem({
                codigo: item.codigo,
                nombre: item.nombre,
                presupuesto: item.presupuesto
            });
        } else {
            setEditingItem(null);
            setFormItem({ codigo: "", nombre: "", presupuesto: "" });
        }

        setShowItemModal(true);
    };

    // --- FILTRO ---
    const filteredData = centrosCostos.filter(cc => cc.tipo === filtroTipo);

    const exportToExcel = () => {
        try {
            if (!centrosCostos || centrosCostos.length === 0) {
                alert("No hay datos para exportar");
                return;
            }

            const rows = [];

            centrosCostos.forEach(cc => {
                if (!cc.subAreas || cc.subAreas.length === 0) {
                    rows.push({
                        Centro: cc.codigo,
                        Area: cc.area,
                        Sede: cc.sede,
                        SubArea: "",
                        Item: "",
                        Presupuesto: cc.presupuestoAnual,
                        Gastado: cc.gastado
                    });
                }

                cc.subAreas.forEach(sub => {
                    if (!sub.items || sub.items.length === 0) {
                        rows.push({
                            Centro: cc.codigo,
                            Area: cc.area,
                            Sede: cc.sede,
                            SubArea: sub.nombre,
                            Item: "",
                            Presupuesto: sub.presupuesto,
                            Gastado: sub.gastado || 0
                        });
                    }

                    sub.items.forEach(item => {
                        rows.push({
                            Centro: cc.codigo,
                            Area: cc.area,
                            Sede: cc.sede,
                            SubArea: sub.nombre,
                            Item: item.nombre,
                            Presupuesto: item.presupuesto,
                            Gastado: item.gastado
                        });
                    });
                });
            });

            const headers = Object.keys(rows[0]).join(",");
            const csv = rows.map(r => Object.values(r).join(",")).join("\n");

            const blob = new Blob([headers + "\n" + csv], {
                type: "text/csv;charset=utf-8;"
            });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "centros_costos.csv";
            link.click();

            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error exportando:", error);
        }
    };


    return (
        <div className="min-h-screen bg-[#f7f9fa] p-4 md:p-8">

            {activeTab === 'Centros de Costos' ? (
                <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Centros de Costos</h3>
                            <p className="text-sm text-gray-500 italic">Desglose por Códigos de Centro de Costo.</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={exportToExcel}
                                className="bg-white text-gray-600 border border-gray-200 px-5 py-3 rounded-xl font-black text-[10px] flex items-center gap-2 hover:bg-gray-50 transition-all uppercase tracking-widest"
                            >
                                <Download size={14} /> EXCEL
                            </button>
                            <button
                                onClick={() => {
                                    setEditingCC(null);
                                    setFormCC({ codigo: "", area: "", sede: "", presupuestoAnual: "" });
                                    setShowCCModal(true);
                                }}
                                className="bg-[#800000] text-white px-6 py-3 rounded-xl font-black text-[10px] flex items-center gap-2 shadow-xl shadow-red-900/20 hover:scale-105 transition-all uppercase tracking-widest"
                            >
                                <Plus size={14} /> NUEVO CENTRO
                            </button>
                        </div>
                    </div>

                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 w-fit">
                        {['INSTITUTO', 'CETPRO PIURA', 'CETPRO SULLANA'].map((tipo) => (
                            <button
                                key={tipo}
                                onClick={() => setFiltroTipo(tipo)}
                                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filtroTipo === tipo ? 'bg-[#800000] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-6">
                        {filteredData.map((cc) => {

                            const presupuesto = Number(cc.presupuestoAnual) || 0;
                            const gastado = Number(cc.gastado) || 0;

                            const saldo = presupuesto - gastado;
                            const porcentaje = presupuesto > 0 ? (gastado / presupuesto) * 100 : 0;

                            const isExpanded = expandedArea === cc.id;

                            return (
                                <div key={cc.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                                    <div className="p-8">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                            <div className="flex items-start gap-5">
                                                <div className={`p-5 rounded-[1.5rem] ${isExpanded ? 'bg-[#800000] text-white' : 'bg-red-50 text-[#800000]'} transition-colors shadow-sm`}>
                                                    <Hash size={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-[10px] font-black bg-gray-900 text-white px-2 py-0.5 rounded-md tracking-widest uppercase italic">CÓDIGO {cc.codigo}</span>
                                                        <h4 className="font-black text-gray-900 text-xl uppercase tracking-tighter leading-none">{cc.area}</h4>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                                                            <MapPin size={12} className="text-[#D4AF37]" /> {cc.sede}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                                                            <ListTree size={12} className="text-[#D4AF37]" /> {cc.subAreas?.length || 0} SUB-ÁREAS
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 max-w-sm">
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">CONSUMO TOTAL ANUAL</span>
                                                    <span className="text-sm font-black text-gray-900 italic">
                                                        S/ {gastado.toLocaleString()} / <span className="text-gray-400">S/ {presupuesto.toLocaleString()}</span>
                                                    </span>
                                                </div>

                                                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden p-0.5 border border-gray-50">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${porcentaje > 90 ? 'bg-red-600' : 'bg-[#D4AF37]'}`}
                                                        style={{ width: `${Math.min(porcentaje, 100)}%` }}
                                                    ></div>
                                                </div>

                                                <div className="flex justify-between mt-1.5">
                                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                                        PROGRESO {porcentaje.toFixed(1)}%
                                                    </span>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest ${saldo < 5000 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                        SALDO: S/ {saldo.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => openSubAreaModal(null, cc.id)}
                                                    className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all shadow-sm group-hover:scale-105"
                                                >
                                                    <Plus size={18} strokeWidth={3} />
                                                </button>

                                                <button
                                                    onClick={() => setExpandedArea(isExpanded ? null : cc.id)}
                                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${isExpanded ? 'bg-gray-900 text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                                >
                                                    {isExpanded ? <><ChevronUp size={14} /> CERRAR</> : <><ChevronDown size={14} /> DESGLOSAR</>}
                                                </button>

                                                <button onClick={() => openCCModal(cc)} className="p-2 text-gray-400 hover:text-[#800000] hover:bg-red-50 rounded-lg transition-all">
                                                    <Edit3 size={14} />
                                                </button>

                                                <button onClick={() => deleteCentro(cc.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="mt-10 space-y-4 animate-in fade-in slide-in-from-top-4">
                                                <div className="bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100">
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {cc.subAreas?.map((sub, index) => {

                                                            const subKey = sub.id || index;
                                                            const subIsExpanded = expandedSubArea === subKey;

                                                            return (
                                                                <div key={subKey} className="bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden shadow-sm">
                                                                    <div className="p-5 flex items-center justify-between">
                                                                        <div
                                                                            className="flex items-center gap-4 cursor-pointer"
                                                                            onClick={() => setExpandedSubArea(subIsExpanded ? null : subKey)}
                                                                        >
                                                                            <div className="bg-amber-50 text-[#D4AF37] px-2 py-1 rounded text-[10px] font-black italic">
                                                                                {sub.codigo}
                                                                            </div>
                                                                            <h5 className="font-black text-gray-700 text-sm uppercase tracking-tight">
                                                                                {sub.nombre}
                                                                            </h5>
                                                                        </div>

                                                                        <div className="flex items-center gap-6">
                                                                            <div className="text-right hidden md:block">
                                                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">PRESUPUESTO</p>
                                                                                <p className="text-xs font-black text-gray-900 italic">
                                                                                    S/ {(Number(sub.presupuesto) || 0).toLocaleString()}
                                                                                </p>
                                                                            </div>

                                                                            <div className="flex items-center gap-2">
                                                                                <button onClick={() => openItemModal(null, sub)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm">
                                                                                    <Plus size={14} strokeWidth={3} />
                                                                                </button>

                                                                                <button
                                                                                    onClick={() => setExpandedSubArea(subIsExpanded ? null : subKey)}
                                                                                    className={`p-2 rounded-xl transition-all ${subIsExpanded ? "bg-gray-100 text-gray-900" : "bg-gray-50 text-gray-400"}`}
                                                                                >
                                                                                    {subIsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                                                </button>

                                                                                <button onClick={() => openSubAreaModal(sub , cc.id)} className="p-2 text-gray-400 hover:text-[#800000] hover:bg-red-50 rounded-lg transition-all">
                                                                                    <Edit3 size={14} />
                                                                                </button>

                                                                                <button onClick={() => deleteSubArea(sub.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                                                    <Trash2 size={14} />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {subIsExpanded && (
                                                                        <div className="bg-gray-50/80 p-5 border-t border-gray-50">
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                                {sub.items?.map((item, i) => (
                                                                                    <div key={item.id || i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">

                                                                                        <div>
                                                                                            <span className="text-[8px] font-black text-gray-300 italic uppercase">
                                                                                                CÓD {item.codigo}
                                                                                            </span>
                                                                                            <h6 className="text-[10px] font-black text-gray-600 uppercase">
                                                                                                {item.nombre}
                                                                                            </h6>
                                                                                        </div>

                                                                                        <div className="flex justify-between mt-4">
                                                                                            <p className="text-red-700 font-black text-[11px]">
                                                                                                S/ {(Number(item.gastado) || 0).toLocaleString()}
                                                                                            </p>
                                                                                            <p className="text-gray-900 font-black text-[11px]">
                                                                                                S/ {(Number(item.presupuesto) || 0).toLocaleString()}
                                                                                            </p>
                                                                                        </div>

                                                                                        {/* 🔥 BOTONES */}
                                                                                        <div className="flex justify-end gap-2 mt-3">
                                                                                            <button
                                                                                                onClick={() => openItemModal(item, sub)}
                                                                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                                                            >
                                                                                                <Edit3 size={14} />
                                                                                            </button>

                                                                                            <button
                                                                                                onClick={() => deleteItem(item.id)}
                                                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                                                            >
                                                                                                <Trash2 size={14} />
                                                                                            </button>
                                                                                        </div>

                                                                                    </div>
                                                                                ))}

                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-64 text-gray-400 italic">
                    Seleccione la pestaña de Centros de Costos para visualizar los datos.
                </div>
            )}
            {/* ================= MODAL CENTRO COSTO ================= */}
            {
                showCCModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">

                            <div className="bg-[#800000] p-10 text-white flex justify-between items-center relative overflow-hidden">
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="bg-[#D4AF37] p-3 rounded-2xl shadow-lg">
                                        <Building2 size={28} className="text-red-900" />
                                    </div>
                                    <div className="font-black text-2xl uppercase tracking-tighter leading-none">
                                        <h3>{editingCC ? "Editar Centro" : "Aperturar Centro"}</h3>
                                    </div>
                                </div>

                                <button onClick={() => setShowCCModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); saveCentroCosto(); }} className="p-10 space-y-6">

                                <select
                                    value={formCC.sede}
                                    onChange={(e) => setFormCC({ ...formCC, sede: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-sm"
                                    required
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="INSTITUTO">INSTITUTO</option>
                                    <option value="CETPRO PIURA">CETPRO PIURA</option>
                                    <option value="CETPRO SULLANA">CETPRO SULLANA</option>
                                </select>

                                <input
                                    value={formCC.codigo}
                                    onChange={(e) => setFormCC({ ...formCC, codigo: e.target.value })}
                                    className="w-full bg-gray-50 border p-4 rounded-2xl"
                                    placeholder="Código"
                                    required
                                />

                                <input
                                    value={formCC.area}
                                    onChange={(e) => setFormCC({ ...formCC, area: e.target.value })}
                                    className="w-full bg-gray-50 border p-4 rounded-2xl"
                                    placeholder="Área"
                                    required
                                />

                                <input
                                    type="number"
                                    value={formCC.presupuestoAnual}
                                    onChange={(e) => setFormCC({ ...formCC, presupuestoAnual: e.target.value })}
                                    className="w-full bg-gray-50 border p-4 rounded-2xl"
                                    placeholder="Presupuesto"
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <button type="button" onClick={() => setShowCCModal(false)} className="bg-gray-200 py-3 rounded-2xl">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="bg-[#800000] text-white py-3 rounded-2xl">
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* ================= MODAL SUB CENTRO ================= */}
            {
                showSubCCModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">

                            {/* HEADER */}
                            <div className="bg-emerald-600 p-10 text-white flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-2xl shadow-lg">
                                        <Layers size={28} className="text-white" />
                                    </div>

                                    <div>
                                        <h3 className="font-black text-2xl uppercase tracking-tighter leading-none">
                                            {editingSubArea ? "Editar Sub-Centro" : "Nuevo Sub-Centro"}
                                        </h3>

                                        <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-[0.2em] mt-2 italic">
                                            Nivel Jerárquico 1.X
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowSubCCModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* FORM FUNCIONAL ORIGINAL */}
                            <form onSubmit={saveSubArea} className="p-10 space-y-6">

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Código
                                    </label>

                                    <input
                                        value={formSubArea.codigo}
                                        onChange={(e) => setFormSubArea({ ...formSubArea, codigo: e.target.value })}
                                        placeholder="Código"
                                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-emerald-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Nombre
                                    </label>

                                    <input
                                        value={formSubArea.nombre}
                                        onChange={(e) => setFormSubArea({ ...formSubArea, nombre: e.target.value })}
                                        placeholder="Nombre"
                                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-emerald-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Presupuesto
                                    </label>

                                    <input
                                        type="number"
                                        value={formSubArea.presupuesto}
                                        onChange={(e) => setFormSubArea({ ...formSubArea, presupuesto: e.target.value })}
                                        placeholder="Presupuesto"
                                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-emerald-500"
                                        required
                                    />
                                </div>

                                <div className="pt-6 grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowSubCCModal(false)}
                                        className="bg-white border-2 border-gray-100 text-gray-400 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="bg-emerald-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-900/30"
                                    >
                                        Guardar
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )
            }

            {/* ================= MODAL ITEM ================= */}
            {
                showItemModal && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">

                        <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">

                            {/* HEADER */}
                            <div className="bg-blue-600 p-10 text-white flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-2xl shadow-lg">
                                        <Plus size={28} className="text-white" />
                                    </div>

                                    <div>
                                        <h3 className="font-black text-2xl uppercase tracking-tighter leading-none">
                                            {editingItem ? "Editar Item" : "Nuevo Item"}
                                        </h3>

                                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-[0.2em] mt-2 italic">
                                            Nivel Jerárquico 1.X.X
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowItemModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* FORM FUNCIONAL ORIGINAL */}
                            <form
                                className="p-10 space-y-6"
                                onSubmit={async (e) => {
                                    e.preventDefault();

                                    try {
                                        const action = editingItem ? "editar" : "crear_item";

                                        const res = await fetch(API + action, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                id: editingItem?.id,
                                                parent_id: selectedSubAreaId,
                                                codigo: formItem.codigo,
                                                nombre: formItem.nombre,
                                                presupuesto: formItem.presupuesto
                                            })
                                        });

                                        const data = await res.json();

                                        if (data.success) {
                                            setShowItemModal(false);
                                            setEditingItem(null);
                                            fetchCentrosCostos();
                                        }

                                    } catch (error) {
                                        console.error("Error item:", error);
                                    }
                                }}
                            >

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Código
                                    </label>

                                    <input
                                        value={formItem.codigo}
                                        onChange={(e) => setFormItem({ ...formItem, codigo: e.target.value })}
                                        placeholder="Código"
                                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Nombre
                                    </label>

                                    <input
                                        value={formItem.nombre}
                                        onChange={(e) => setFormItem({ ...formItem, nombre: e.target.value })}
                                        placeholder="Nombre"
                                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Presupuesto
                                    </label>

                                    <input
                                        type="number"
                                        value={formItem.presupuesto}
                                        onChange={(e) => setFormItem({ ...formItem, presupuesto: e.target.value })}
                                        placeholder="Presupuesto"
                                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="pt-6 grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowItemModal(false)}
                                        className="bg-white border-2 border-gray-100 text-gray-400 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-900/30"
                                    >
                                        Guardar
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )
            }
            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #800000; }
      `}</style>
        </div>
    );
};

export default CentrosCostos;