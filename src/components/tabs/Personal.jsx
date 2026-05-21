import React, { useState, useEffect } from "react";
import {
  Plus, Search, Users, DollarSign,
  Trash2, Edit, X, UserPlus,
  BookOpen, GraduationCap, Briefcase, CreditCard, ChevronDown,
  ChevronRight, Filter, Calculator, Calendar, MapPin
} from "lucide-react";
import { API_BASE } from "../../config/api";
import OrdenCompra from "./OrdenCompra";


const API = API_BASE + "personal.php";

export default function App() {
  // =============================
  // ESTADOS
  // =============================
  const [tab, setTab] = useState("docentes");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);
  const [pagos, setPagos] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [programas, setProgramas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [tipoDoc, setTipoDoc] = useState("DNI");
  // DOCENTE
  const [empresaDocente, setEmpresaDocente] = useState("");
  const [sedeDocente, setSedeDocente] = useState("");

  // TRABAJADOR
  const [empresaTrabajador, setEmpresaTrabajador] = useState("");
  const [sedeTrabajador, setSedeTrabajador] = useState("");

  const [programaFiltro, setProgramaFiltro] = useState("");
  const [empresaFiltro, setEmpresaFiltro] = useState("");

  // MODALES
  const [showPago, setShowPago] = useState(false);
  const [showTrabajador, setShowTrabajador] = useState(false);
  const [showDocente, setShowDocente] = useState(false);

  const [current, setCurrent] = useState(null);
  const [edit, setEdit] = useState(false);

  // FORMULARIOS
  const [formPago, setFormPago] = useState({
    trabajador_id: "",
    sueldoBase: "",
    bonos: "",
    otrosDescuentos: "",
    metodo: "Transferencia BCP"
  });


  const departamento = (currentUser?.departamento || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();

  const puedeVerGeneral =
    departamento.includes("ADMINISTRACION") ||
    departamento.includes("TIC") ||
    departamento.includes("TESORERIA");

  // =============================
  // CARGA DE DATOS (FETCH)
  // =============================
  const getPagos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (data.success) setPagos(data.data);
    } catch (e) { console.error("Error cargando pagos"); }
  };

  const getTrabajadores = async () => {
    try {
      const res = await fetch(API + "?tipo=trabajadores");
      const data = await res.json();
      if (data.success) setTrabajadores(data.data);
    } catch (e) { console.error("Error cargando trabajadores"); }
  };

  const getDocentes = async () => {
    let url = API + "?tipo=docentes";

    if (programaFiltro) {
      url += "&programa_id=" + programaFiltro;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (data.success) setDocentes(data.data);
  };

  const getProgramas = async () => {
    const res = await fetch(API + "?tipo=programas");
    const data = await res.json();
    if (data.success) setProgramas(data.data);
  };

  const getEmpresas = async () => {
    const res = await fetch(API + "?tipo=empresas");
    const data = await res.json();
    if (data.success) setEmpresas(data.data);
  };

  const getSedes = async () => {
    const res = await fetch(API + "?tipo=sedes");
    const data = await res.json();
    if (data.success) setSedes(data.data);
  };

  useEffect(() => {
    getPagos();
    getTrabajadores();
    getDocentes();
    getProgramas();
    getEmpresas();
    getSedes();
  }, []);

  // Agrupación para planilla docente
  const docentesAgrupados = docentes.reduce((acc, curr) => {
    const nombre = curr.docente || "Sin Nombre";
    if (!acc[nombre]) acc[nombre] = [];
    acc[nombre].push(curr);
    return acc;
  }, {});

  // =============================
  // ACCIONES
  // =============================
  const handleDelete = async (id, tipo) => {
    if (!window.confirm(`¿Está seguro de eliminar este registro de ${tipo}?`)) return;

    let url = API;
    if (tipo === 'docente') url += "?tipo=docente";
    if (tipo === 'trabajador') url += "?tipo=trabajadores";

    try {
      await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      // Recargar según tipo
      if (tipo === 'pago') getPagos();
      if (tipo === 'trabajador') getTrabajadores();
      if (tipo === 'docente') getDocentes();
    } catch (e) { console.error("Error al eliminar"); }
  };

  const handlePagar = async (registros, nombre) => {

    const items = registros.map((r) => ({
      descripcion: `${r.curso} - ${r.unidad} (${r.grupo})`,
      cantidad: Number(r.horas),
      precio: Number(r.costo),
      total: Number(r.total)
    }));

    const total = registros.reduce((acc, r) => acc + Number(r.total), 0);

    const payload = {
      numero: `OS-${Date.now()}`,
      fecha: new Date().toISOString().split("T")[0],
      proveedor_id: registros[0]?.trabajador_id,
      empresa_id: registros[0]?.empresa_id,
      items,
      total
    };

    try {
      const res = await fetch(API_BASE + "create_orden.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setOrdenSeleccionada({ id: data.id }); // 👈 SOLO ID REAL
      }

    } catch (err) {
      console.error("Error creando orden:", err);
    }
  };

  const saveDocente = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    // Asegurar números
    payload.horas = Number(payload.horas);
    payload.costo = Number(payload.costo);
    payload.desc = Number(payload.desc || 0);

    try {
      const res = await fetch(API + "?tipo=docente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setShowDocente(false);
        getDocentes();
      }
    } catch (e) {
      console.error("Error guardando docente");
    }
  };

  const savePago = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    // Calcular neto: (Sueldo + Bonos) - Descuentos
    const neto = (Number(payload.sueldoBase) + Number(payload.bonos || 0)) - Number(payload.otrosDescuentos || 0);
    payload.neto = neto;
    payload.accion = "create_pago";

    try {
      const res = await fetch(API + "?tipo=pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowPago(false);
        getPagos();
      }
    } catch (e) { console.error("Error procesando pago"); }
  };

  // =============================
  // RENDER UI
  // =============================
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ENCABEZADO ESTILO PREMIUM */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#800000] rounded-2xl flex items-center justify-center shadow-lg shadow-[#800000]/20">
                <Briefcase className="text-[#D4AF37]" size={28} />
              </div>
              <h1 className="text-4xl font-black text-[#800000] tracking-tight">CETURGH <span className="text-[#D4AF37]">ERP</span></h1>
            </div>
            <p className="text-slate-500 font-medium ml-1">Sistema de Gestión de Talento y Planilla Académica</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setEdit(false);
                if (tab === "pagos") setShowPago(true);
                if (tab === "trabajadores") setShowTrabajador(true);
                if (tab === "docentes") setShowDocente(true);
              }}
              className="flex items-center gap-2 bg-[#800000] text-white hover:bg-[#600000] px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 group"
            >
              <Plus size={20} className="text-[#D4AF37] group-hover:rotate-90 transition-transform" />
              <span> {tab === 'docentes' ? 'Carga de Planilla' : tab === 'pagos' ? 'Nuevo Pago' : 'Agregar Personal'}</span>
            </button>
          </div>
        </header>

        {/* NAVEGACIÓN Y BÚSQUEDA */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-full lg:w-fit backdrop-blur-sm">
            {[
              { id: "docentes", icon: <BookOpen size={18} />, label: "Planilla Docente" },
              { id: "pagos", icon: <DollarSign size={18} />, label: "Pagos Adm." },
              { id: "trabajadores", icon: <Users size={18} />, label: "Personal" }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-1 lg:flex-none items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${tab === t.id ? "bg-white text-[#800000] shadow-md scale-[1.02]" : "text-slate-500 hover:bg-white/50"
                  }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#800000] transition-colors" size={20} />
            <input
              type="text"
              placeholder={`Buscar en ${tab}...`}
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#800000]/5 focus:border-[#800000] outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="flex gap-4 mb-6">
              {tab === "docentes" && (
                <div className="relative group">
                  <select
                    value={programaFiltro}
                    onChange={(e) => setProgramaFiltro(e.target.value)}
                    className="appearance-none pl-5 pr-12 py-3 bg-slate-100 border-2 border-transparent rounded-full text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-all cursor-pointer hover:bg-slate-200"
                  >
                    <option value="">Todos los programas</option>
                    {programas.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#800000]">
                    <ChevronDown size={18} strokeWidth={3} />
                  </div>
                </div>
              )}

              {tab === "pagos" && (
                <div className="relative group">
                  <select
                    value={empresaFiltro}
                    onChange={(e) => setEmpresaFiltro(e.target.value)}
                    className="appearance-none pl-5 pr-12 py-3 bg-slate-100 border-2 border-transparent rounded-full text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 transition-all cursor-pointer hover:bg-slate-200"
                  >
                    <option value="">Todas las empresas</option>
                    {empresas.map(e => (
                      <option key={e.id} value={e.nombre}>{e.nombre}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#800000]">
                    <ChevronDown size={18} strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl">


              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#800000] text-white">
                    {tab === "docentes" && (
                      <>
                        <th className="px-8 py-5 font-bold uppercase text-[11px] tracking-[0.15em]">Docente / Detalles del Curso</th>
                        <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-[0.15em] text-center">Horas</th>
                        <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-[0.15em] text-center">Costo</th>
                        <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-[0.15em] text-center">Total</th>
                        <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-[0.15em] text-center">Observación</th>
                        <th className="px-8 py-5 font-bold uppercase text-[11px] tracking-[0.15em] text-right">Acciones</th>
                      </>
                    )}
                    {tab === "pagos" && (
                      <>
                        <th className="px-8 py-5 font-bold uppercase text-[11px] tracking-[0.15em]">Beneficiario</th>
                        <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-[0.15em] text-center">Método</th>
                        <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-[0.15em] text-center">Monto Neto</th>
                        <th className="px-8 py-5 font-bold uppercase text-[11px] tracking-[0.15em] text-right">Acciones</th>
                      </>
                    )}
                    {tab === "trabajadores" && (
                      <>
                        <th className="px-8 py-5 font-bold uppercase text-[11px] tracking-[0.15em]">Colaborador</th>
                        <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-[0.15em] text-center">Cargo</th>
                        <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-[0.15em] text-center">Contrato</th>
                        <th className="px-8 py-5 font-bold uppercase text-[11px] tracking-[0.15em] text-right">Acciones</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">

                  {/* VISTA PLANILLA DOCENTE */}
                  {tab === "docentes" && Object.entries(docentesAgrupados)
                    .filter(([nombre, registros]) => {
                      const matchNombre = nombre.toLowerCase().includes(filtro.toLowerCase());

                      const matchPrograma = programaFiltro
                        ? registros.some(r => String(r.programa_id) === String(programaFiltro))
                        : true;

                      return matchNombre && matchPrograma;
                    })
                    .map(([nombre, registros]) => {
                      const totalH = registros.reduce((a, c) => a + Number(c.horas), 0);
                      const totalS = registros.reduce((a, c) => a + Number(c.total), 0);

                      return (
                        <React.Fragment key={nombre}>
                          <tr className="bg-slate-50/50">
                            <td colSpan="6" className="px-8 py-4 border-y border-slate-100">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center text-[#800000] font-black shadow-sm">
                                  {nombre.charAt(0)}
                                </div>
                                <span className="font-black text-[#800000] text-sm uppercase tracking-tight">{nombre}</span>
                                <div className="h-4 w-[1px] bg-slate-300 mx-2"></div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{registros.length} Cursos Asignados</span>
                              </div>
                            </td>
                          </tr>
                          {registros.map((reg) => (
                            <tr key={reg.id} className="group hover:bg-white transition-colors">
                              <td className="px-8 py-4">
                                <div className="font-bold text-slate-800 text-sm">{reg.curso}</div>
                                <div className="text-[10px] text-slate-400 font-medium mt-1">
                                  {reg.tipo_programa} • {reg.sede} • {reg.empresa}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">{reg.unidad}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">Grupo: {reg.grupo} • Semestre: {reg.semestre}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center font-bold text-slate-600">{reg.horas} <small className="text-slate-400 font-normal">hrs</small></td>
                              <td className="px-6 py-4 text-center text-slate-500 font-medium">S/ {Number(reg.costo).toFixed(2)}</td>
                              <td className="px-6 py-4 text-center font-black text-slate-900">S/ {Number(reg.total).toFixed(2)}</td>
                              <td className="px-6 py-4 text-center italic text-slate-400 text-xs">{reg.observacion || '-'}</td>
                              <td className="px-8 py-4 text-right">
                                {puedeVerGeneral && (
                                  <button
                                    onClick={() => handlePagar(registros, nombre)}
                                    className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                  >
                                    <CreditCard size={18} />
                                  </button>)}
                                <button
                                  onClick={() => handleDelete(reg.id, 'docente')}
                                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 size={18} />
                                </button>

                              </td>
                            </tr>
                          ))}
                          <tr className="bg-[#800000]/[0.02] border-b-2 border-slate-200">
                            <td className="px-8 py-3 text-right">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Subtotal {nombre.split(' ')[0]}:</span>
                            </td>
                            <td className="px-6 py-3 text-center font-black text-[#800000]">{totalH} h</td>
                            <td className="px-6 py-3"></td>
                            <td className="px-6 py-3 text-center">
                              <div className="inline-block px-4 py-1 bg-[#D4AF37]/20 rounded-full font-black text-[#800000] border border-[#D4AF37]/30">
                                S/ {totalS.toFixed(2)}
                              </div>
                            </td>
                            <td colSpan="2" className="px-6 py-3"></td>
                          </tr>
                        </React.Fragment>
                      );
                    })
                  }

                  {/* VISTA PAGOS */}
                  {tab === "pagos" && pagos
                    .filter(p => {
                      const matchNombre = (p.trabajador || "").toLowerCase().includes(filtro.toLowerCase());

                      const matchEmpresa = empresaFiltro
                        ? p.empresa === empresaFiltro
                        : true;

                      return matchNombre && matchEmpresa;
                    })
                    .map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-800 uppercase tracking-tight">{p.trabajador || "N/A"}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">{p.cargo}</div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className="text-xs font-bold text-slate-500 border border-slate-200 px-3 py-1 rounded-full bg-white">{p.metodo}</span>
                        </td>
                        <td className="px-6 py-6 text-center font-black text-[#800000] text-xl">
                          S/ {Number(p.neto).toFixed(2)}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => handleDelete(p.id, 'pago')} className="p-2 text-slate-300 hover:text-red-500 transition-all">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}

                  {/* VISTA PERSONAL */}
                  {tab === "trabajadores" && trabajadores
                    .filter(t => t.nombre.toLowerCase().includes(filtro.toLowerCase()))
                    .map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#800000] to-[#600000] flex items-center justify-center text-white font-black text-lg shadow-md shadow-red-900/10">
                              {t.nombre.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 uppercase text-sm tracking-tight">{t.nombre}</div>
                              <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                                <Calendar size={10} /> Registrado: {new Date(t.fecha_registro).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="bg-[#D4AF37]/10 text-[#800000] px-4 py-1 rounded-xl text-[11px] font-black border border-[#D4AF37]/20 uppercase">
                            {t.cargo}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="text-xs font-bold text-slate-600">{t.tipoContrato}</div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => { setCurrent(t); setEdit(true); setShowTrabajador(true); }} className="p-2 text-slate-300 hover:text-[#D4AF37] transition-colors">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(t.id, 'trabajador')} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {/* EMPTY STATE */}
                  {(tab === "pagos" ? pagos : tab === "trabajadores" ? trabajadores : docentes).length === 0 && (
                    <tr>
                      <td colSpan="8" className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                          <Search size={64} className="text-slate-300" />
                          <p className="text-xl font-bold text-slate-400 italic">No se encontraron resultados para esta sección</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL CARGA ACADÉMICA (DOCENTES) ================= */}
      {showDocente && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-[#800000] p-8 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                  <BookOpen className="text-[#D4AF37]" size={28} /> REGISTRAR CARGA ACADÉMICA
                </h2>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Planilla de Docentes 2026</p>
              </div>
              <button onClick={() => setShowDocente(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors relative">
                <X />
              </button>
            </div>

            <form onSubmit={saveDocente} className="p-10 grid grid-cols-2 gap-6 bg-white max-h-[80vh] overflow-y-auto">

              {/* Selector de Docente */}
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Seleccionar Docente de la Lista</label>
                <select name="trabajador_id" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] focus:bg-white transition-all font-bold text-slate-700">
                  <option value="">Seleccione personal...</option>
                  {trabajadores.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre} - {t.cargo}</option>
                  ))}
                </select>
              </div>

              {/* Empresa */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Empresa</label>
                <select
                  name="empresa_id"
                  required
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] focus:bg-white transition-all font-bold text-slate-700"
                  onChange={(e) => setEmpresaDocente(e.target.value)}
                >
                  <option value="">Seleccione empresa</option>
                  {empresas.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Sede */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Sede</label>
                <select
                  name="sede_id"
                  required
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] focus:bg-white transition-all font-bold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={(e) => setSedeDocente(e.target.value)}
                  disabled={!empresaDocente}
                >
                  <option value="">Seleccione sede</option>
                  {sedes
                    .filter(s => String(s.empresa_id) === String(empresaDocente))
                    .map(s => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                </select>
              </div>

              {/* Programa Académico */}
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Programa Académico</label>
                <select
                  name="programa_id"
                  required
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] focus:bg-white transition-all font-bold text-slate-700 disabled:opacity-50"
                  disabled={!sedeDocente}
                >
                  <option value="">Seleccione programa</option>
                  {programas
                    .filter(p =>
                      String(p.empresa_id) === String(empresaDocente) &&
                      String(p.sede_id) === String(sedeDocente)
                    )
                    .map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                </select>
              </div>

              {/* Curso y Unidad */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Unidad Didáctica / Curso</label>
                <input name="curso" placeholder="Ej. Cocina Peruana" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] focus:bg-white transition-all font-medium" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Programa de estudios</label>
                <input name="unidad" placeholder="Ej. Gastronomía" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] focus:bg-white transition-all font-medium" />
              </div>

              {/* Horas y Costo */}
              <div className="grid grid-cols-2 gap-4 col-span-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Horas</label>
                  <input type="number" step="0.01" name="horas" placeholder="0.00" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] focus:bg-white transition-all font-bold text-center" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Costo Hora</label>
                  <input type="number" step="0.01" name="costo" placeholder="S/ 0.00" required className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] focus:bg-white transition-all font-bold text-center text-[#800000]" />
                </div>
              </div>

              {/* Descuento */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Descuento</label>
                <input
                  type="number"
                  step="0.01"
                  name="desc"
                  defaultValue="0"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-red-600 font-bold text-red-600 text-center"
                />
              </div>

              {/* Grupo y Semestre */}
              <div className="grid grid-cols-2 gap-4 col-span-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Grupo</label>
                  <input name="grupo" placeholder="Ej. A1" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] focus:bg-white transition-all font-medium text-center" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Semestre</label>
                  <input name="semestre" placeholder="2026-I" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] focus:bg-white transition-all font-medium text-center" />
                </div>
              </div>

              {/* Observación */}
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Observación adicional</label>
                <textarea name="observacion" rows="2" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] focus:bg-white transition-all font-medium resize-none"></textarea>
              </div>

              {/* Botón Principal */}
              <button className="col-span-2 bg-[#800000] text-white py-5 rounded-2xl font-black shadow-xl shadow-red-900/20 hover:bg-[#600000] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4 text-lg">
                <Calculator size={24} className="text-[#D4AF37]" /> PROCESAR CARGA ACADÉMICA
              </button>
            </form>
          </div>
        </div>
      )}
      {/* MODAL TRABAJADOR (Reutilizado del diseño anterior pero pulido) */}
      {showTrabajador && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] ring-1 ring-black/5">

            {/* HEADER: Más esbelto */}
            <div className="bg-gradient-to-r from-[#800000] to-[#a00000] px-6 py-4 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md ring-1 ring-white/20">
                  <UserPlus size={20} className="text-[#D4AF37]" />
                </div>
                <h2 className="text-lg font-bold tracking-tight">
                  {edit ? "Editar" : "Nuevo"} Colaborador
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowTrabajador(false);
                  setCurrent(null);
                  setEmpresaTrabajador("");
                  setSedeTrabajador("");
                }}
                className="hover:bg-black/20 p-1.5 rounded-full transition-all group"
              >
                <X size={18} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* FORMULARIO: Optimizado en espacio */}
            <form
              className="p-6 space-y-4 overflow-y-auto custom-scrollbar bg-slate-50/30"
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.target);
                const body = {
                  id: current?.id,
                  nombre: form.get("nombre"),
                  cargo: form.get("cargo"),
                  tipoContrato: form.get("tipoContrato"),
                  tipo_personal: form.get("tipo_personal"),
                  empresa_id: form.get("empresa_id"),
                  sede_id: form.get("sede_id"),
                  tipo_documento: form.get("tipo_documento"),
                  numero_documento: form.get("numero_documento"),
                  numero_cuenta: form.get("numero_cuenta"),
                  cci: form.get("cci"),

                  accion: edit ? "update" : "create",
                };

                fetch(API, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.success) {
                      setShowTrabajador(false);
                      setCurrent(null);
                      setEmpresaTrabajador("");
                      setSedeTrabajador("");
                      getTrabajadores();
                    }
                  });
              }}
            >
              {/* GRUPO 1: DATOS PRINCIPALES (Compacto) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Nombre Completo
                  </label>
                  <input
                    name="nombre"
                    required
                    defaultValue={edit ? current?.nombre : ""}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] font-semibold text-slate-700 transition-all text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Tipo Doc / N° Documento
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="tipo_documento"
                      defaultValue={edit ? current?.tipo_documento : "DNI"}
                      onChange={(e) => setTipoDoc(e.target.value)}
                      className="w-20 px-2 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#800000] font-bold text-xs cursor-pointer"
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">C.E.</option>
                    </select>
                    <input
                      name="numero_documento"
                      defaultValue={edit ? current?.numero_documento : ""}
                      maxLength={tipoDoc === "DNI" ? 8 : 12}
                      onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, ''); }}
                      className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#800000] font-semibold text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Cargo / Función
                  </label>
                  <input
                    name="cargo"
                    required
                    defaultValue={edit ? current?.cargo : ""}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#800000] font-semibold text-sm"
                  />
                </div>
              </div>

              {/* GRUPO 2: ASIGNACIÓN (Grid 2x2) */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Empresa
                  </label>
                  <select
                    name="empresa_id"
                    required
                    defaultValue={edit ? current?.empresa_id : ""}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#800000] font-semibold text-xs transition-all"
                    onChange={(e) => {
                      setEmpresaTrabajador(e.target.value);
                      setSedeTrabajador("");
                    }}
                  >
                    <option value="">Seleccionar...</option>
                    {empresas.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Sede
                  </label>
                  <select
                    name="sede_id"
                    required
                    disabled={!empresaTrabajador && !edit}
                    defaultValue={edit ? current?.sede_id : ""}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#800000] font-semibold text-xs disabled:opacity-50"
                    onChange={(e) => setSedeTrabajador(e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {sedes
                      .filter((s) => String(s.empresa_id) === String(empresaTrabajador || current?.empresa_id))
                      .map((s) => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Tipo Personal
                  </label>
                  <select
                    name="tipo_personal"
                    defaultValue={edit ? current?.tipo_personal : "ADMIN"}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#800000] font-semibold text-xs"
                  >
                    <option value="ADMIN">Administrativo</option>
                    <option value="DOCENTE">Docente</option>
                    <option value="CHEF">Chef Instr.</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Contrato
                  </label>
                  <select
                    name="tipoContrato"
                    defaultValue={edit ? current?.tipoContrato : "Planilla"}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#800000] font-semibold text-xs"
                  >
                    <option value="Planilla">Planilla</option>
                    <option value="Recibo x Honorarios">Recibos</option>
                    <option value="Servicios Externos">Externo</option>
                  </select>
                </div>
              </div>

              {/* GRUPO 3: FINANZAS (Compacto) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Número de Cuenta
                    </label>
                    <input
                      name="numero_cuenta"
                      placeholder="0011-0234-..."
                      defaultValue={edit ? current?.numero_cuenta : ""}
                      maxLength={20}
                      onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9-]/g, ''); }}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#800000] font-bold text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      CCI
                    </label>
                    <input
                      name="cci"
                      placeholder="20 dígitos..."
                      defaultValue={edit ? current?.cci : ""}
                      maxLength={20}
                      onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, ''); }}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#800000] font-bold text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* BOTÓN: Sticky pero más integrado */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#800000] hover:bg-[#600000] text-white py-3.5 rounded-xl font-bold text-xs tracking-[0.15em] shadow-lg active:scale-[0.98] transition-all uppercase"
                >
                  {edit ? "Actualizar Datos" : "Registrar Personal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL NUEVO PAGO (TRABAJADORES / CHEFS) ================= */}
      {showPago && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-[#800000] p-8 text-white flex justify-between items-center relative overflow-hidden">
              <div className="relative">
                <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                  <DollarSign className="text-[#D4AF37]" size={28} /> EMITIR PAGO ADMINISTRATIVO
                </h2>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Personal Administrativo, Chefs e Instr.</p>
              </div>
              <button onClick={() => setShowPago(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"><X /></button>
            </div>

            <form onSubmit={savePago} className="p-10 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Colaborador / Beneficiario</label>
                <select
                  name="trabajador_id"
                  required
                  onChange={(e) => {
                    const t = trabajadores.find(x => String(x.id) === e.target.value);
                    setTrabajadorSeleccionado(t);
                  }}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] focus:bg-white transition-all font-bold text-slate-700"
                >
                  <option value="">Seleccione personal...</option>
                  {trabajadores.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre} - {t.cargo}</option>
                  ))}
                </select>

                {trabajadorSeleccionado && (
                  <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 space-y-2">

                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Datos Bancarios
                    </div>

                    <div className="text-sm font-bold text-slate-700">
                      {trabajadorSeleccionado.numero_cuenta
                        ? `Cuenta: ${trabajadorSeleccionado.numero_cuenta}`
                        : "Sin número de cuenta registrado"}
                    </div>

                    <div className="text-sm font-bold text-slate-700">
                      {trabajadorSeleccionado.cci
                        ? `CCI: ${trabajadorSeleccionado.cci}`
                        : "Sin CCI registrado"}
                    </div>

                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Sueldo Base</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">S/</span>
                    <input type="number" step="0.01" name="sueldoBase" placeholder="0.00" required className="w-full pl-10 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] font-bold" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Bonos / Extras</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">S/</span>
                    <input type="number" step="0.01" name="bonos" defaultValue="0" className="w-full pl-10 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-green-600 font-bold text-green-600" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Descuentos / Otros</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">S/</span>
                    <input type="number" step="0.01" name="otrosDescuentos" defaultValue="0" className="w-full pl-10 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-red-600 font-bold text-red-600" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Método de Pago</label>
                  <select name="metodo" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#800000] font-bold">
                    <option value="Transferencia BCP">Transferencia BCP</option>
                    <option value="Transferencia BBVA">Transferencia BBVA</option>
                  </select>
                </div>
              </div>

              <button className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black shadow-xl shadow-red-900/20 hover:bg-[#600000] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4 text-lg">
                <CreditCard size={24} className="text-[#D4AF37]" /> PROCESAR PAGO NETO
              </button>
            </form>
          </div>
        </div>

      )}

      {ordenSeleccionada && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
          <OrdenCompra
            orden={ordenSeleccionada}
            onClose={() => setOrdenSeleccionada(null)}
          />
        </div>
      )}


    </div>
  );
}

