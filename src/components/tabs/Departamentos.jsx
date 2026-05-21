import React, { useState, useEffect } from 'react';
import {
  Plus,
  TrendingUp,
  Briefcase,
  Building,
  Building2,
  History,
  Eye,
  ChevronUp,
  PlusCircle,
  X,
  Receipt,
  MapPin, Edit,
  Trash2, Check
} from 'lucide-react';
import { API_BASE } from "../../config/api";

const API = API_BASE;
const PresupuestoMonitor = () => {

  // --- ESTADOS ---
  const [activeTab] = useState('Presupuesto Departamentos');
  const [expandedPresupuesto, setExpandedPresupuesto] = useState(null);
  const [showdepartamentosModal, setShowdepartamentosModal] = useState(false);
  const [showSubdepartamentosModal, setShowSubdepartamentosModal] = useState(null);
  const [viewDetaildepartamentos, setViewDetaildepartamentos] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editPresupuesto, setEditPresupuesto] = useState('');

  const [nuevadepartamentos, setNuevadepartamentos] = useState('');
  const [presupuestodepartamentos, setPresupuestodepartamentos] = useState('');
  const [nombreSubdepartamentos, setNombreSubdepartamentos] = useState('');

  const [departamentosFiltradas, setdepartamentosFiltradas] = useState([]);

  // --- FETCH ---
  useEffect(() => {
    fetchdepartamentos();
  }, []);

  const fetchdepartamentos = async () => {
    try {
      const res = await fetch(API + "departamentos.php");
      const data = await res.json();
      setdepartamentosFiltradas(data);
    } catch (error) {
      console.error("Error cargando departamentos:", error);
    }
  };

  // --- CREAR DEPARTAMENTO ---
  const handleCreatedepartamentos = async (e) => {
    e.preventDefault();

    try {
      await fetch(API + "departamentos.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nuevadepartamentos,
          presupuesto: parseFloat(presupuestodepartamentos),
          empresa_id: 1,
          sede_id: 1
        })
      });

      await fetchdepartamentos();

      setNuevadepartamentos('');
      setPresupuestodepartamentos('');
      setShowdepartamentosModal(false);

    } catch (error) {
      console.error("Error creando departamento:", error);
    }
  };

  // --- CREAR SUBDEPARTAMENTO ---
  const handleCreateSubdepartamentos = async () => {
    if (!showSubdepartamentosModal) return;

    try {
      await fetch(API + "departamentos.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreSubdepartamentos,
          presupuesto: 0,
          empresa_id: 1,
          sede_id: 1,
          parent_id: showSubdepartamentosModal.id
        })
      });

      await fetchdepartamentos();

      setNombreSubdepartamentos('');
      setShowSubdepartamentosModal(null);

    } catch (error) {
      console.error("Error creando subdepartamento:", error);
    }
  };

  // --- ELIMINAR ---
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar?")) return;

    try {
      const res = await fetch(API + `departamentos.php?id=${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error); // 👈 MOSTRAR MENSAJE REAL
        return;
      }

      await fetchdepartamentos();

    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  // --- EDITAR (SIMPLE con prompt) ---
  const startEdit = (dep) => {
    setEditingId(dep.id);
    setEditNombre(dep.nombre);
    setEditPresupuesto(dep.presupuestoTotal);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    try {
      await fetch(API + "departamentos.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          nombre: editNombre,
          presupuesto: parseFloat(editPresupuesto)
        })
      });

      await fetchdepartamentos();
      setEditingId(null);

    } catch (error) {
      console.error("Error editando:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans">

      {activeTab === 'Presupuesto Departamentos' && (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
                Monitor de Presupuesto
              </h3>
            </div>

            <button
              onClick={() => setShowdepartamentosModal(true)}
              className="bg-[#800000] text-white px-8 py-4 rounded-[1.5rem] font-black text-[11px] flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
            >
              <Plus size={16} /> NUEVA ÁREA
            </button>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
            {departamentosFiltradas.map((departamentos) => {
              const saldo = departamentos.presupuestoTotal - departamentos.gastado;
              const porc = (departamentos.gastado / departamentos.presupuestoTotal) * 100;
              const hasSubs = departamentos.subdepartamentos && departamentos.subdepartamentos.length > 0;
              const isExp = expandedPresupuesto === departamentos.id;

              return (
                <div
                  key={departamentos.id}
                  className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden flex flex-col transition-all hover:-translate-y-2"
                >
                  <div className="p-8 space-y-6">
                    {/* TOP: Icono y Saldo */}
                    <div className="flex justify-between items-start">
                      <div className="p-4 bg-red-50 rounded-[1.5rem] text-[#800000] group-hover:bg-[#800000] group-hover:text-white transition-colors duration-500">
                        <Briefcase size={24} />
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          Saldo Disponible
                        </p>
                        <p className="text-lg font-black text-emerald-600">
                          S/ {saldo.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* SECCIÓN TÍTULO Y EDICIÓN */}
                    <div className="p-4 bg-white border-l-4 border-[#800000] shadow-sm rounded-r-xl transition-all hover:shadow-md">
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                          {editingId === departamentos.id ? (
                            <div className="space-y-2 animate-in fade-in slide-in-from-left-1">
                              <input
                                value={editNombre}
                                onChange={(e) => setEditNombre(e.target.value)}
                                className="w-full border-b-2 border-[#D4AF37] p-1 text-lg font-black uppercase focus:outline-none bg-gray-50 text-gray-900"
                                placeholder="Nombre departamento"
                              />
                            </div>
                          ) : (
                            <div>
                              <h4 className="font-black text-gray-900 text-xl uppercase tracking-tighter leading-none">
                                {departamentos.nombre}
                              </h4>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                                <Building size={12} className="text-[#D4AF37]" />
                                {hasSubs
                                  ? `${departamentos.subdepartamentos.length} Subdepartamentos`
                                  : 'Área'}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Grupo de Botones Alineados */}
                        <div className="flex items-center gap-1 shrink-0">
                          {editingId === departamentos.id ? (
                            <>
                              <button
                                onClick={() => saveEdit(departamentos.id)}
                                className="bg-[#800000] text-[#D4AF37] p-2 rounded-xl hover:scale-105 transition-transform"
                                title="Guardar"
                              >
                                <Check size={18} strokeWidth={3} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="bg-gray-100 text-gray-400 p-2 rounded-xl hover:scale-105 transition-transform"
                                title="Cancelar"
                              >
                                <X size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(departamentos)}
                                className="p-2 text-gray-400 hover:text-[#800000] hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => setShowSubdepartamentosModal(departamentos)}
                                className="p-2 text-[#D4AF37] hover:bg-amber-50 rounded-xl transition-all"
                              >
                                <PlusCircle size={20} />
                              </button>
                              <button
                                onClick={() => handleDelete(departamentos.id)}
                                className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* PRESUPUESTO Y BARRA */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase">Gastado</p>
                          <p className="text-sm font-black text-gray-800 italic">
                            S/ {departamentos.gastado.toLocaleString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[9px] font-black text-gray-400 uppercase">Presupuesto</p>
                          {editingId === departamentos.id ? (
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#D4AF37] font-black text-xs">S/</span>
                              <input
                                type="number"
                                value={editPresupuesto}
                                onChange={(e) => setEditPresupuesto(e.target.value)}
                                className="border-2 border-gray-100 pl-6 pr-2 py-1 rounded-lg w-32 text-sm font-black focus:border-[#D4AF37] outline-none"
                              />
                            </div>
                          ) : (
                            <p className="text-sm font-black text-gray-900 italic">
                              S/ {departamentos.presupuestoTotal.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* BARRA DE PROGRESO */}
                      <div className="relative h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50 shadow-inner">
                        <div
                          className={`h-full transition-all duration-1000 ease-out ${porc > 85 ? 'bg-red-500' : 'bg-[#D4AF37]'
                            }`}
                          style={{ width: `${porc}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span
                          className={`text-[10px] font-black px-3 py-1 rounded-full ${porc > 85 ? 'bg-red-100 text-red-600' : 'bg-amber-50 text-amber-700'
                            }`}
                        >
                          {porc.toFixed(1)}% CONSUMIDO
                        </span>
                        <span className="text-[10px] font-bold text-gray-300 italic uppercase">
                          ACTUALIZADO
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BOTONES */}
                  <div className="mt-auto border-t border-gray-50 bg-gray-50/50 p-6 flex gap-3">
                    <button
                      onClick={() => setViewDetaildepartamentos(departamentos)}
                      className="flex-1 bg-white border border-gray-200 text-gray-600 p-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#800000] hover:text-white transition-all shadow-sm"
                    >
                      <History size={16} />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        Historial
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        setExpandedPresupuesto(isExp ? null : departamentos.id)
                      }
                      className={`flex-1 p-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm ${isExp
                        ? 'bg-[#D4AF37] text-white'
                        : 'bg-white border border-gray-200 text-[#D4AF37]'
                        }`}
                    >
                      {isExp ? <ChevronUp size={16} /> : <Eye size={16} />}
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {isExp ? 'Cerrar' : 'Detalles'}
                      </span>
                    </button>
                  </div>

                  {/* PANEL EXPANDIBLE */}

                  {isExp && (
                    <div className="bg-gray-100/50 p-6 space-y-3 animate-in slide-in-from-top-4 border-t border-gray-100 shadow-inner">
                      {hasSubs ? (
                        <>
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              Desglose por Sede
                            </p>
                            <button
                              onClick={() => setShowSubdepartamentosModal(departamentos)}
                              className="text-[9px] font-black text-[#D4AF37] hover:underline uppercase"
                            >
                              + Añadir Sede
                            </button>
                          </div>

                          {departamentos.subdepartamentos.map((sub, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center hover:border-[#D4AF37] transition-all"
                            >
                              <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase">
                                  {sub.nombre}
                                </p>

                                <p className="text-xs font-black text-gray-900 italic">
                                  S/ {Number(sub.gastado || 0).toLocaleString()}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-[9px] font-black text-gray-300 uppercase">
                                  Estado
                                </p>

                                <p className="text-[10px] font-bold text-[#800000]">
                                  {sub.gastado > 0 ? "En uso" : "Sin gasto"}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(sub)}
                                  className="text-blue-500 text-xs"
                                >
                                  <Edit size={14} />
                                </button>

                                <button
                                  onClick={() => handleDelete(sub.id)}
                                  className="text-red-500 text-xs"
                                >
                                  <Trash2 size={18} />
                                </button>

                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="bg-white p-6 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center gap-3 text-center">
                          <Building2 size={24} className="text-gray-200" />
                          <p className="text-[10px] font-black text-gray-400 uppercase">
                            Esta área no tiene sedes asignadas
                          </p>
                          <button
                            onClick={() => setShowSubdepartamentosModal(departamentos)}
                            className="bg-[#D4AF37] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                          >
                            Asignar División
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL NUEVO SUBDEPARTAMENTO */}
      {showSubdepartamentosModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-6">

          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in">

            {/* HEADER */}
            <div className="bg-[#D4AF37] p-10 text-white flex justify-between items-center">

              <div className="flex items-center gap-5">
                <div className="bg-white/20 p-4 rounded-3xl text-white shadow-xl">
                  <Building2 size={24} />
                </div>

                <div>
                  <h3 className="font-black text-2xl uppercase tracking-tighter">
                    Nueva Sub área
                  </h3>
                  <p className="text-[10px] font-bold text-amber-900 uppercase tracking-widest">
                    Padre: {showSubdepartamentosModal.nombre}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowSubdepartamentosModal(null)}
                className="p-3 hover:bg-black/10 rounded-full transition-all text-amber-900"
              >
                <X size={24} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateSubdepartamentos();
              }}
              className="p-12 space-y-8"
            >

              {/* NOMBRE */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">
                  Nombre da la Sub Área
                </label>

                <input
                  type="text"
                  value={nombreSubdepartamentos}
                  onChange={(e) => setNombreSubdepartamentos(e.target.value.toUpperCase())}
                  className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl outline-none font-black text-sm text-gray-700 focus:border-[#D4AF37] transition-all"
                  placeholder="Ej: SEDE SULLANA / SEDE PIURA"
                  required
                />
              </div>

              {/* BOTONES */}
              <div className="pt-6 grid grid-cols-2 gap-5">

                <button
                  type="button"
                  onClick={() => setShowSubdepartamentosModal(null)}
                  className="bg-white border-2 border-gray-100 text-gray-400 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-[#800000] text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-red-900/20 active:scale-95 transition-all"
                >
                  Registrar Sub Área
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HISTORIAL */}
      {viewDetaildepartamentos && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6">

          <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">

            {/* HEADER */}
            <div className="bg-[#800000] p-10 text-white flex justify-between items-center relative">

              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>

              <div className="flex items-center gap-6 relative">
                <div className="bg-[#D4AF37] p-4 rounded-[2rem] text-red-950 shadow-xl">
                  <Receipt size={32} />
                </div>

                <div>
                  <h3 className="font-black text-3xl uppercase tracking-tighter leading-none">
                    Detalle de Requerimientos
                  </h3>

                  <p className="text-[11px] font-bold text-red-200 uppercase tracking-widest mt-2 flex items-center gap-2">
                    <MapPin size={12} /> ÁREA: {viewDetaildepartamentos.nombre}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewDetaildepartamentos(null)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all relative"
              >
                <X size={28} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-12">
              <div className="overflow-hidden border border-gray-100 rounded-[2.5rem] shadow-inner bg-gray-50/30">

                <table className="w-full text-left">

                  <thead className="bg-gray-100/50">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase">Fecha</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase">Sub área</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase">Descripción</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase">Monto</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase text-right">Estado</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 font-bold text-sm">

                    {viewDetaildepartamentos.compras?.length > 0 ? (
                      viewDetaildepartamentos.compras.map((c, i) => (
                        <tr key={i} className="hover:bg-white transition-colors">

                          <td className="px-8 py-5 text-gray-400">{c.fecha || "-"}</td>

                          <td className="px-8 py-5">
                            <span className="text-[10px] bg-amber-50 text-[#D4AF37] px-3 py-1.5 rounded-xl font-black">
                              {c.subdepartamento || "GENERAL"}
                            </span>
                          </td>

                          <td className="px-8 py-5">{c.descripcion || "-"}</td>

                          <td className="px-8 py-5 text-[#800000] font-black">
                            S/ {Number(c.monto || 0).toLocaleString()}
                          </td>

                          <td className="px-8 py-5 text-right">
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-black">
                              {c.estado || "-"}
                            </span>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center text-gray-300 font-black uppercase">
                          Sin movimientos registrados
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL NUEVO DEPARTAMENTO */}
      {showdepartamentosModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">

          <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="bg-gray-950 p-10 text-white flex justify-between items-center">
              <div className="flex items-center gap-5">

                <div className="bg-[#D4AF37] p-4 rounded-3xl text-gray-900 shadow-xl">
                  <Plus size={24} />
                </div>

                <div>
                  <h3 className="font-black text-2xl uppercase tracking-tighter">
                    Nueva Área
                  </h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Presupuesto Base
                  </p>
                </div>
              </div>

              <button onClick={() => setShowdepartamentosModal(false)}>
                <X size={24} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleCreatedepartamentos} className="p-12 space-y-8">

              <input
                type="text"
                value={nuevadepartamentos}
                onChange={(e) => setNuevadepartamentos(e.target.value.toUpperCase())}
                placeholder="Nombre del Área"
                className="w-full p-5 border rounded-2xl"
                required
              />

              <input
                type="number"
                value={presupuestodepartamentos}
                onChange={(e) => setPresupuestodepartamentos(e.target.value)}
                placeholder="Presupuesto"
                className="w-full p-5 border rounded-2xl"
                required
              />

              <button className="bg-[#800000] text-white px-6 py-4 rounded-xl w-full">
                Guardar
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

export default PresupuestoMonitor;