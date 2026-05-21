import React, { useState, useEffect } from 'react';
import {
  Truck, UploadCloud, Download, PackageSearch, ClipboardList,
  CheckCircle2, Clock, CreditCard, Box, AlertCircle
} from 'lucide-react';
import { API_BASE } from "../../config/api";

const API = API_BASE;
const Propuestas = () => {
  const [activeTab, setActiveTab] = useState('Proveedores');
  const [currentRole] = useState("LOGISTICA");
  const [modalPropuesta, setModalPropuesta] = useState(null);
  const [proveedorId, setProveedorId] = useState(null);

  // Estados del formulario de propuesta
  const [proveedor, setProveedor] = useState("");
  const [monto, setMonto] = useState("");
  const [diasCredito, setDiasCredito] = useState("0");
  const [costoDelivery, setCostoDelivery] = useState("0");
  const [tiempoEntrega, setTiempoEntrega] = useState("");
  const [file, setFile] = useState(null);

  const [showProveedorList, setShowProveedorList] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [requerimientosParaCotizar, setRequerimientosParaCotizar] = useState([]);
  // Carga inicial
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(API + "propuestas.php?op=listar");
      const data = await res.json();
      setRequerimientosParaCotizar(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al listar requerimientos:", err);
    }
  };

  const handleUploadPropuesta = async (itemId) => {
    try {
      const formData = new FormData();
      formData.append("item_id", itemId);
      formData.append("proveedor_id", proveedorId);
      formData.append("proveedor", proveedor);
      formData.append("monto", monto);
      formData.append("dias_credito", diasCredito);
      formData.append("costo_delivery", costoDelivery);
      formData.append("tiempo_entrega", tiempoEntrega);
      if (file) formData.append("archivo", file);

      const res = await fetch(API + "propuestas.php?op=crear", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        setModalPropuesta(null);
        resetForm();
        fetchData();
      }
    } catch (err) {
      console.error("Error al subir propuesta:", err);
    }
  };

  const resetForm = () => {
    setProveedor("");
    setMonto("");
    setDiasCredito("0");
    setCostoDelivery("0");
    setTiempoEntrega("");
    setFile(null);
  };

  const buscarProveedor = async (texto) => {
    if (texto.length < 2) {
      setProveedores([]);
      return;
    }
    try {
      const res = await fetch(API + `propuestas.php?op=buscar_proveedores&q=${texto}`);
      const data = await res.json();
      setProveedores(data);
    } catch (err) {
      console.error(err);
    }
  };

  const seleccionarProveedor = async (propId, itemId, reqId) => {
    try {
      const res = await fetch(API + "propuestas.php?op=seleccionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propuesta_id: propId, item_id: itemId })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      {activeTab === 'Proveedores' ? (
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="bg-[#800000] p-6 rounded-3xl text-white border-b-4 border-[#D4AF37] shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-[#800000] shadow-lg">
                <Truck size={32} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-wider">
                  Módulo de Adquisiciones
                </h3>
                <p className="text-red-100 text-xs uppercase font-bold tracking-widest opacity-80">
                  Cuadro Comparativo
                </p>
              </div>
            </div>
          </div>

          {/* Requerimientos */}
          <div className="space-y-8">
            {requerimientosParaCotizar.length > 0 ? (
              requerimientosParaCotizar.map(req => (
                <div key={req.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">

                  {/* Expediente */}
                  <div className="bg-slate-50 px-8 py-5 border-b flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="bg-[#800000] text-white px-4 py-1.5 rounded-full font-black text-xs">
                        EXP {req.codigo}
                      </span>
                      <h4 className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                        {req.items?.filter(i => Number(i.requiereCotizacion) === 1).length} Items por adjudicar
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase">Evaluación de Mercado</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-8">
                    {req.items
                      ?.filter(item => Number(item.requiereCotizacion) === 1)
                      .map(item => {

                        const alreadySelected = item.propuestas?.some(
                          p => Number(p.seleccionada) === 1
                        );

                        return (
                          <div key={item.id} className="space-y-4">

                            {/* Título */}
                            <div className="flex justify-between items-center border-l-4 border-[#D4AF37] pl-4">
                              <div>
                                <h5 className="font-black text-slate-700 uppercase text-sm">
                                  {item.descripcion}
                                </h5>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">
                                  Especificaciones técnicas aprobadas
                                </p>
                              </div>

                              {currentRole === "LOGISTICA" && !alreadySelected && (
                                <button
                                  onClick={() => { setModalPropuesta(item); resetForm(); }}
                                  className="bg-slate-900 hover:bg-[#800000] text-white px-5 py-2.5 rounded-xl text-[10px] font-black flex items-center gap-2 transition-all shadow-lg active:scale-95"
                                >
                                  <UploadCloud size={16} />
                                  AÑADIR PROPUESTA
                                </button>
                              )}
                            </div>

                            {/* TARJETAS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {item.propuestas?.map(prop => {

                                const isWinner = Number(prop.seleccionada) === 1;
                                const total = Number(prop.monto || 0) + Number(prop.costo_delivery || 0);

                                return (
                                  <div
                                    key={prop.id}
                                    className={`relative p-5 rounded-3xl border-2 transition-all ${isWinner
                                      ? 'border-[#D4AF37] bg-amber-50/50 shadow-md'
                                      : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                                      }`}
                                  >

                                    {/* Badge ganador */}
                                    {isWinner && (
                                      <div className="absolute -top-3 left-6 bg-[#D4AF37] text-[#800000] px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm">
                                        <CheckCircle2 size={12} /> SELECCIONADO
                                      </div>
                                    )}

                                    <div className="space-y-4">

                                      {/* Header */}
                                      <div className="flex justify-between items-start">
                                        <div className="max-w-[70%]">
                                          <p className="text-[9px] font-bold text-slate-400 uppercase">Proveedor</p>
                                          <h6 className="font-black text-slate-800 text-xs truncate">
                                            {prop.proveedor}
                                          </h6>
                                        </div>

                                        <div className="text-right">
                                          <p className="text-[9px] font-bold text-slate-400 uppercase">Total</p>
                                          <p className="font-black text-lg text-slate-900">
                                            S/ {total.toFixed(2)}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Detalles */}
                                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                                        <div className="bg-slate-50 p-2 rounded-xl">
                                          <p className="text-[8px] font-bold uppercase text-slate-400">Crédito</p>
                                          <p className="text-[10px] font-black text-slate-700">
                                            {prop.dias_credito || 0} días
                                          </p>
                                        </div>

                                        <div className="bg-slate-50 p-2 rounded-xl">
                                          <p className="text-[8px] font-bold uppercase text-slate-400">Entrega</p>
                                          <p className="text-[10px] font-black text-slate-700">
                                            {prop.tiempo_entrega || 'N/A'}
                                          </p>
                                        </div>

                                        <div className="bg-slate-50 p-2 rounded-xl col-span-2 flex justify-between">
                                          <span className="text-[8px] font-bold uppercase text-slate-400">
                                            Costo envío
                                          </span>
                                          <span className="text-[10px] font-black text-slate-700">
                                            {Number(prop.costo_delivery) > 0
                                              ? `S/ ${Number(prop.costo_delivery).toFixed(2)}`
                                              : 'Sin delivery'}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Acciones */}
                                      <div className="flex gap-2 pt-2">
                                        {!isWinner && (
                                          <button
                                            disabled={alreadySelected}
                                            onClick={() => seleccionarProveedor(prop.id, item.id, req.id)}
                                            className={`flex-1 text-[10px] font-black py-2.5 rounded-xl uppercase transition-all ${alreadySelected
                                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                              }`}
                                          >
                                            {alreadySelected ? 'Adjudicado' : 'Adjudicar'}
                                          </button>
                                        )}

                                        {prop.pdfUrl && (
                                          <a
                                            href={prop.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 border rounded-xl flex items-center justify-center hover:border-[#800000] hover:text-[#800000]"
                                          >
                                            <Download size={16} />
                                          </a>
                                        )}
                                      </div>

                                    </div>
                                  </div>
                                );
                              })}

                              {(!item.propuestas || item.propuestas.length === 0) && (
                                <div className="col-span-full py-10 border-2 border-dashed border-slate-100 rounded-[2rem] text-center text-slate-300">
                                  Sin cotizaciones
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                <ClipboardList size={48} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-slate-400 font-bold uppercase text-sm">
                  No hay expedientes activos
                </h3>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <button
            onClick={() => setActiveTab('Proveedores')}
            className="bg-[#800000] text-white px-8 py-4 rounded-3xl font-black shadow-2xl"
          >
            VOLVER A GESTIÓN
          </button>
        </div>
      )}

      {/* MODAL MEJORADO CON LOS NUEVOS CAMPOS */}
      {modalPropuesta && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border-t-8 border-[#800000]">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-[#800000] text-2xl uppercase tracking-tighter">Registrar Cotización</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{modalPropuesta.descripcion}</p>
                </div>
                <button onClick={() => setModalPropuesta(null)} className="text-slate-300 hover:text-red-500 text-3xl font-light">×</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Proveedor con Autocompletado */}
                <div className="col-span-2 relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Nombre del Proveedor / RUC</label>
                  <input
                    className="w-full bg-slate-50 border-2 border-slate-50 p-3.5 rounded-2xl focus:border-[#D4AF37] focus:bg-white outline-none transition-all font-bold text-sm"
                    value={proveedor}
                    onChange={(e) => { setProveedor(e.target.value); buscarProveedor(e.target.value); setShowProveedorList(true); }}
                    placeholder="Buscar proveedor..."
                  />
                  {showProveedorList && proveedores.length > 0 && (
                    <div className="absolute z-10 w-full bg-white mt-2 rounded-2xl shadow-2xl border border-slate-100 max-h-40 overflow-auto">
                      {proveedores.map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setProveedor(p.nombre);
                            setProveedorId(p.id); 
                            setShowProveedorList(false);
                          }}
                          className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 text-xs font-bold"
                        >
                          {p.nombre} <span className="text-[9px] text-slate-400 font-normal ml-2">RUC: {p.ruc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Monto Base */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Precio Unitario (S/)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-50 p-3.5 rounded-2xl focus:border-[#D4AF37] focus:bg-white outline-none font-black text-lg text-[#800000]"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* Costo Delivery */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Costo Envío / Delivery</label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border-2 border-slate-50 p-3.5 rounded-2xl focus:border-[#D4AF37] focus:bg-white outline-none font-black text-lg"
                    value={costoDelivery}
                    onChange={(e) => setCostoDelivery(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* Días de Crédito */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Días de Crédito (0 = Contado)</label>
                  <select
                    className="w-full bg-slate-50 border-2 border-slate-50 p-3.5 rounded-2xl focus:border-[#D4AF37] focus:bg-white outline-none font-bold text-sm"
                    value={diasCredito}
                    onChange={(e) => setDiasCredito(e.target.value)}
                  >
                    <option value="0">Pago al Contado</option>
                    <option value="7">7 Días</option>
                    <option value="15">15 Días</option>
                    <option value="30">30 Días</option>
                    <option value="45">45 Días</option>
                  </select>
                </div>

                {/* Tiempo de Entrega */}
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Tiempo de Entrega</label>
                  <input
                    className="w-full bg-slate-50 border-2 border-slate-50 p-3.5 rounded-2xl focus:border-[#D4AF37] focus:bg-white outline-none font-bold text-sm"
                    value={tiempoEntrega}
                    onChange={(e) => setTiempoEntrega(e.target.value)}
                    placeholder="Ej: 24 horas, 3 días..."
                  />
                </div>

                {/* Archivo */}
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1.5 block">Documento PDF</label>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-[#D4AF37] transition-all group cursor-pointer">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
                    <UploadCloud className="mx-auto text-slate-300 group-hover:text-[#D4AF37] mb-1" size={24} />
                    <p className="text-[10px] font-bold text-slate-400">{file ? file.name : "Subir cotización oficial"}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleUploadPropuesta(modalPropuesta.id)}
                className="w-full bg-[#800000] text-white py-4 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-red-900/20 hover:bg-red-900 transition-all active:scale-95"
              >
                Registrar en el Sistema
              </button>
            </div>
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

export default Propuestas;