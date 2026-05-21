import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, LayoutDashboard, Users, X, Save, DollarSign, FileText, CheckCircle2, Target, Activity,
  Truck, CreditCard, ShieldCheck, Eye, Search, ClipboardList, Settings, AlertCircle, Coins, Link2,
  UploadCloud, Download, History, Filter, Calendar, PenTool, LogOut, Sparkles, FileCheck,
  PackageSearch, Edit3, MapPin, Building2, Briefcase, PieChart, Layers, ChevronUp, UserCheck, Info, Bell,
  ChevronDown, Hash, ListTree, BookCheck, Tag, FolderClock, Car, ChevronRight, Navigation, BookCopy, XCircle,
  Receipt, TrendingUp, PlusCircle, Building, BarChart3, Wallet, ArrowDownCircle, Image as ImageIcon, MessageCircle
} from 'lucide-react';

import { API_BASE } from "../../config/api";

const API = API_BASE;

const AreasCostos = () => {

  const [currentUser, setCurrentUser] = useState(null);
  // ESTADOS PRINCIPALES
  const [activeTab, setActiveTab] = useState('Presupuestos');
  const [activeEmpresa, setActiveEmpresa] = useState(null);

  // ESTADOS PARA SECCIÓN PRESUPUESTOS
  const [showPresupuestoModal, setShowPresupuestoModal] = useState(false);
  const [showAsociarModal, setShowAsociarModal] = useState(false);
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [expandedArea, setExpandedArea] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [areaEditando, setAreaEditando] = useState(null);

  // Data de Áreas de Costo (Padres)
  const [areasCostos, setAreasCostos] = useState([]);
  // Data de Departamentos/Áreas (Hijos a asociar)
  const [areasC, setAreasC] = useState([]);

  // Carga inicial de datos
  useEffect(() => {
    fetchAreasCostos();
    fetchDepartamentos();
  }, []);

  const fetchAreasCostos = async () => {
    try {
      const res = await fetch(API + "areas_costos.php?action=listar");
      const data = await res.json();
      if (data.success) setAreasCostos(data.data);
    } catch (error) {
      console.error("Error al cargar áreas de costos:", error);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const res = await fetch(API + "areas_costos.php?action=listar_departamentos");
      const data = await res.json();
      if (data.success) setAreasC(data.data);
    } catch (error) {
      console.error("Error al cargar departamentos:", error);
    }
  };

  const abrirModalEditar = (item) => {
    setAreaEditando(item);
    setShowEditModal(true);
  };

  // FUNCIONES DE MANEJO
  const toggleExpand = (id) => {
    setExpandedArea(expandedArea === id ? null : id);
  };

  const abrirModalAsociar = (item) => {
    setAreaSeleccionada(item);
    setShowAsociarModal(true);
  };

  const handleDesasociar = async (areaCostoId, departamentoId) => {
    if (!confirm("¿Quitar asociación?")) return;

    try {
      const res = await fetch(API + "areas_costos.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "desasignar_area",
          area_costo_id: areaCostoId,
          area_id: departamentoId
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Error");
        return;
      }

      fetchAreasCostos(); // 🔄 refresca

    } catch (error) {
      console.error("Error desasociando:", error);
    }
  };

  const cerrarModalAsociar = () => {
    setAreaSeleccionada(null);
    setShowAsociarModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa] font-sans p-6">
      {activeTab === 'Presupuestos' && (
        <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">

          {/* Header Superior Principal */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-slate-200 pb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
                <span className="w-2 h-8 bg-[#800000] rounded-full" />
                GESTIÓN DE COSTOS DE ÁREAS
              </h1>
              <p className="text-slate-400 text-sm font-medium mt-1">Control institucional de áreas de costo</p>
            </div>
            <button
              onClick={() => setShowPresupuestoModal(true)}
              className="w-full md:w-auto bg-[#800000] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-[#600000] shadow-xl shadow-[#800000]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus size={18} strokeWidth={3} /> Nuevo Registro
            </button>
          </div>

          {/* Listado de Instituciones */}
          <div className="space-y-6">
            {['KEVSTUR E.I.R.L.', 'EDUTUR E.I.R.L.'].map((empresa) => {
              const areasFiltradas = areasCostos.filter(a => a.empresa === empresa);
              const isKevstur = empresa === 'KEVSTUR E.I.R.L.';
              const isOpen = activeEmpresa === empresa; // Asegúrate de tener: const [activeEmpresa, setActiveEmpresa] = useState(null);

              return (
                <div
                  key={empresa}
                  className={`transition-all duration-500 rounded-[2.5rem] overflow-hidden border-2 ${isOpen
                    ? 'bg-white border-slate-200 shadow-2xl'
                    : 'bg-slate-50 border-transparent hover:border-slate-200 shadow-sm'
                    }`}
                >
                  {/* Header de Institución (Accionador) */}
                  <button
                    onClick={() => setActiveEmpresa(isOpen ? null : empresa)}
                    className={`w-full flex items-center justify-between p-6 md:p-8 transition-all ${isOpen
                      ? (isKevstur ? 'bg-[#800000] text-white' : 'bg-[#D4AF37] text-[#800000]')
                      : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-2xl transition-all shadow-inner ${isOpen ? 'bg-white/20' : 'bg-white text-slate-400'}`}>
                        {isKevstur ? <Building size={32} /> : <Layers size={32} />}
                      </div>
                      <div className="text-left">
                        <h3 className="font-black text-2xl tracking-tighter uppercase leading-none">{empresa}</h3>
                        <p className={`text-[10px] font-bold tracking-[0.3em] uppercase mt-1 opacity-70`}>
                          {isKevstur  ? 'Instituto Superior' : 'CETPRO'} • {areasFiltradas.length} Áreas de Costo
                        </p>
                      </div>
                    </div>
                    <div className={`p-2 rounded-full transition-all duration-500 ${isOpen ? 'rotate-180 bg-white/20' : 'bg-slate-200 text-slate-500'}`}>
                      <ChevronDown size={24} strokeWidth={3} />
                    </div>
                  </button>

                  {/* Contenido Desplegable de la Institución */}
                  <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="p-4 md:p-8">
                        <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-inner bg-slate-50/30">
                          <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                              <tr className="bg-white/50">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Área de Costo</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Presupuesto</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Ejecución</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Saldo</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Gestión</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {areasFiltradas.map((item) => {
                                const perc = (item.ejecutado / item.presupuesto) * 100 || 0;
                                const saldo = item.presupuesto - (item.ejecutado || 0);
                                const isExpanded = expandedArea === item.id;

                                return (
                                  <React.Fragment key={item.id}>
                                    {/* Fila Principal de Área */}
                                    <tr className={`group/row transition-colors ${isExpanded ? 'bg-white' : 'hover:bg-white'}`}>
                                      <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                          <button
                                            onClick={() => toggleExpand(item.id)}
                                            className={`p-1.5 rounded-lg transition-all ${isExpanded ? 'bg-[#D4AF37] text-white shadow-md' : 'bg-slate-200/50 text-slate-400 hover:bg-slate-200'}`}
                                          >
                                            {isExpanded ? <ChevronUp size={14} strokeWidth={3} /> : <ChevronDown size={14} strokeWidth={3} />}
                                          </button>
                                          <span className="text-sm font-black text-slate-700 tracking-tight">{item.nombre}</span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-5 text-right font-bold text-slate-600 text-sm">
                                        S/ {parseFloat(item.presupuesto).toLocaleString()}
                                      </td>
                                      <td className="px-6 py-5 text-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                          <div className="w-28 h-2 bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
                                            <div
                                              className={`h-full transition-all duration-1000 ${isKevstur ? 'bg-[#800000]' : 'bg-[#D4AF37]'}`}
                                              style={{ width: `${Math.min(perc, 100)}%` }}
                                            />
                                          </div>
                                          <span className="text-[9px] font-black text-slate-400">{perc.toFixed(1)}%</span>
                                        </div>
                                      </td>
                                      <td className={`px-6 py-5 text-right font-black text-sm ${saldo <= 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                        S/ {saldo.toLocaleString()}
                                      </td>
                                      <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                          {/* Botón Editar: Ahora en Granate suave */}
                                          <button
                                            onClick={() => abrirModalEditar(item)}
                                            className="flex items-center gap-1.5 bg-[#800000]/10 text-[#800000] border border-[#800000]/20 hover:bg-[#800000] hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-tight transition-all duration-200 shadow-sm"
                                          >
                                            <Edit3 size={12} />
                                            Editar
                                          </button>

                                          {/* Botón Asociar: Siempre visible en Dorado */}
                                          <button
                                            onClick={() => abrirModalAsociar(item)}
                                            className="flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#B8860B] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-tight transition-all duration-200 shadow-sm"
                                          >
                                            <Link2 size={12} />
                                            Asociar
                                          </button>
                                        </div>
                                      </td>
                                    </tr>

                                    {/* Sección de Departamentos Vinculados (Sub-áreas) */}
                                    {isExpanded && (
                                      <tr>
                                        <td colSpan="5" className="px-8 pb-6 pt-2 bg-white">
                                          <div className="flex flex-col gap-3 ml-10 border-l-2 border-slate-100 pl-8 py-2">
                                            <div className="flex items-center gap-3">
                                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Áreas Vinculados</span>
                                              <div className="h-[1px] flex-1 bg-slate-100" />
                                            </div>

                                            {item.areas && item.areas.length > 0 ? (
                                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {item.areas.map((area) => (
                                                  <div
                                                    key={area.id}
                                                    className="flex items-center justify-between bg-slate-50/50 border border-slate-100 px-4 py-3 rounded-2xl group/sub hover:border-[#D4AF37]/30 hover:bg-white transition-all"
                                                  >
                                                    <div className="flex items-center gap-3">
                                                      <div className={`w-2 h-2 rounded-full ${isKevstur ? 'bg-[#800000]' : 'bg-[#D4AF37]'}`} />
                                                      <span className="text-[11px] font-bold text-slate-600 uppercase">{area.nombre}</span>
                                                    </div>
                                                    <button
                                                      onClick={() => handleDesasociar(item.id, area.id)}
                                                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/sub:opacity-100"
                                                    >
                                                      <Trash2 size={14} />
                                                    </button>
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              <div className="py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sin vinculaciones registradas</p>
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: CREAR ÁREA DE COSTO */}
      {showPresupuestoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#800000]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="bg-[#800000] p-8 flex justify-between items-center border-b-4 border-[#D4AF37]">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Crear Área de Costo</h3>
              <button onClick={() => setShowPresupuestoModal(false)} className="text-white/60 hover:text-white"><X size={24} /></button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                try {
                  const resCrear = await fetch(API + "areas_costos.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      action: "crear",
                      nombre: formData.get("nombre"),
                      empresa: formData.get("empresa"),
                      presupuesto: parseFloat(formData.get("presupuesto"))
                    })
                  });
                  const resultCrear = await resCrear.json();
                  if (!resultCrear.success) throw new Error("Error al crear");

                  const areaCostoId = resultCrear.id;
                  const selectedAreas = formData.getAll("areas");
                  for (let areaId of selectedAreas) {
                    await fetch(API + "areas_costos.php", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ action: "asignar_area", area_costo_id: areaCostoId, area_id: parseInt(areaId) })
                    });
                  }
                  fetchAreasCostos();
                  setShowPresupuestoModal(false);
                } catch (error) { alert("Error al guardar"); }
              }}
              className="p-10 space-y-6"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#800000] uppercase tracking-widest">Empresa</label>
                <select name="empresa" required className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none">
                  <option value="">Seleccione...</option>
                  <option value="KEVSTUR">KEVSTUR (Instituto)</option>
                  <option value="EDUTUR">EDUTUR (CETPRO)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#800000] uppercase tracking-widest">Nombre del Área de Costo</label>
                <input name="nombre" type="text" required className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none" placeholder="Ej. MARKETING" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#800000] uppercase tracking-widest">Presupuesto (S/.)</label>
                <input name="presupuesto" type="number" step="0.01" required className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-[#800000] outline-none" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#800000] uppercase tracking-widest">Asociar Área</label>
                <div className="max-h-40 overflow-y-auto border-2 border-slate-100 rounded-xl p-3 space-y-2 bg-slate-50">
                  {areasC.map((area) => (
                    <label key={area.id} className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                      <input type="checkbox" name="areas" value={area.id} className="accent-[#800000]" /> {area.nombre}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-[#800000] py-4 rounded-2xl text-white text-sm font-black hover:bg-[#600000] shadow-xl">Guardar Área de Costo</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASOCIAR ÁREAS EXISTENTES */}
      {showAsociarModal && areaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#800000]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="bg-[#800000] p-8 flex justify-between items-center border-b-4 border-[#D4AF37]">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Asociar a: {areaSeleccionada.nombre}</h3>
              <button onClick={cerrarModalAsociar} className="text-white/60 hover:text-white"><X size={24} /></button>
            </div>
            <form
              className="p-10 space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const selectedAreas = formData.getAll("areas");
                for (let areaId of selectedAreas) {
                  await fetch(API + "areas_costos.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "asignar_area", area_costo_id: areaSeleccionada.id, area_id: parseInt(areaId) })
                  });
                }
                fetchAreasCostos();
                cerrarModalAsociar();
              }}
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#800000] uppercase tracking-widest">Selecciona Áreas</label>
                <div className="max-h-40 overflow-y-auto border-2 border-slate-100 rounded-xl p-3 space-y-2 bg-slate-50">
                  {areasC.map(area => (
                    <label key={area.id} className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                      <input type="checkbox" name="areas" value={area.id} className="accent-[#800000]" /> {area.nombre}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-[#800000] py-4 rounded-2xl text-white text-sm font-black hover:bg-[#600000] shadow-xl">Guardar Asociación</button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && areaEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">

          {/* Contenedor Principal con borde superior dorado decorativo */}
          <div className="bg-white w-full max-w-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border-t-4 border-[#D4AF37] transform transition-all">

            {/* Encabezado: Granate Institucional */}
            <div className="bg-[#800000] p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Edit3 size={20} className="text-[#D4AF37]" />
                </div>
                <h3 className="text-white font-bold text-lg tracking-tight">
                  Editar Área de Costo
                </h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="p-8 space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);

                try {
                  const res = await fetch(API + "areas_costos.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      action: "editar",
                      id: areaEditando.id,
                      nombre: formData.get("nombre"),
                      presupuesto: parseFloat(formData.get("presupuesto"))
                    })
                  });

                  const data = await res.json();
                  if (!data.success) throw new Error(data.error);

                  fetchAreasCostos();
                  setShowEditModal(false);

                } catch (error) {
                  alert("Error al editar");
                }
              }}
            >

              {/* Campo: Nombre */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase font-black text-slate-500 ml-1 tracking-widest">
                  Nombre de la Unidad
                </label>
                <input
                  name="nombre"
                  defaultValue={areaEditando.nombre}
                  placeholder="Ej. Logística de Cocina"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Campo: Presupuesto */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase font-black text-slate-500 ml-1 tracking-widest">
                  Presupuesto Asignado
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">S/</span>
                  <input
                    name="presupuesto"
                    type="number"
                    step="0.01"
                    defaultValue={areaEditando.presupuesto}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all text-slate-700 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Botón de Acción Principal */}
              <button className="w-full bg-[#800000] hover:bg-[#600000] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-red-900/20 transition-all active:scale-[0.98] mt-4 flex justify-center items-center gap-2">
                Guardar Cambios
              </button>

            </form>
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

export default AreasCostos;