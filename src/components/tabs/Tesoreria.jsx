import React, { useState, useEffect, useRef } from 'react';
import {
  Users, Receipt, Truck, ChevronDown, Calendar, Download, FileDown,
  CheckCircle2, AlertCircle, Building2, MapPin,
  Wallet, ArrowRightCircle, FileText
} from 'lucide-react';

import { API_BASE } from "../../config/api";

const API = API_BASE;

// Componente auxiliar para subir múltiples archivos
const FileUploader = ({ grupoId, tipo, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    e.target.value = ''; // permite volver a seleccionar los mismos archivos
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    onUpload(grupoId, selectedFiles);
    setSelectedFiles([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => fileInputRef.current.click()}
        className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-semibold transition"
      >
        + Agregar {tipo === 'comprobante' ? 'comprobante' : 'guía'}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
        accept={tipo === 'comprobante' ? '.pdf,.jpg,.jpeg,.png' : '.pdf'}
      />
      {selectedFiles.length > 0 && (
        <>
          <span className="text-[10px] text-gray-500">
            {selectedFiles.length} archivo(s) seleccionado(s)
          </span>
          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-[10px] font-semibold"
          >
            Subir {selectedFiles.length}
          </button>
        </>
      )}
    </div>
  );
};

const Tesoreria = ({ setOrdenSeleccionada, setShowOrdenCompra }) => {

  // --- ESTADOS ---
  const [expandedProveedor, setExpandedProveedor] = useState(null);
  const [pagosFiltrados, setPagosFiltrados] = useState([]);
  const [modoIGVTesoreria, setModoIGVTesoreria] = useState("incluido");
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [sedeSeleccionada, setSedeSeleccionada] = useState(null);
  const [tipoVista, setTipoVista] = useState("PENDIENTE");
  const [ordenGenerada, setOrdenGenerada] = useState(null);

  // --- Función para aplicar el modo IGV ---
  const aplicarModoIGV = (monto) => {
    if (modoIGVTesoreria === "incluido") return monto;
    return monto / 1.18;
  };

  // --- FETCH PAGOS ---
  const fetchPagos = async () => {
    try {
      const res = await fetch(API + "pagos.php");
      const json = await res.json();
      if (!json.success) {
        console.error("Error API:", json.error);
        setPagosFiltrados([]);
        return;
      }
      const safeData = (json.data || []).map(p => ({
        ...p,
        montoTotal: Number(p.montoTotal) || 0,
        grupos: (p.grupos || []).map(g => ({
          ...g,
          montoTotal: Number(g.montoTotal) || 0,
          items: (g.items || []).map(i => ({
            ...i,
            monto: Number(i.monto) || 0
          }))
        }))
      }));
      setPagosFiltrados(safeData);
    } catch (err) {
      console.error("Error cargando pagos:", err);
      setPagosFiltrados([]);
    }
  };

  // --- SUBIR COMPROBANTE (múltiples archivos) ---
  const subirComprobanteGrupo = async (grupoId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("grupo_id", grupoId);
    try {
      const res = await fetch(API + "subir_comprobante_grupo.php", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return true;
    } catch (err) {
      console.error(err);
      alert(`Error subiendo comprobante: ${err.message}`);
      throw err;
    }
  };

  // --- SUBIR GUÍA (múltiples archivos) ---
  const subirGuiaGrupo = async (grupoId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("grupo_id", grupoId);
    try {
      const res = await fetch(API + "subir_guia_grupo.php", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return true;
    } catch (err) {
      console.error(err);
      alert(`Error subiendo guía: ${err.message}`);
      throw err;
    }
  };

  // --- PAGAR GRUPO ---
  const handlePagarGrupo = async (grupo) => {
    try {
      const res = await fetch(API + "pagar_grupo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grupo_id: grupo.grupo_id })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.actualizados > 0 ? `Se pagaron ${data.actualizados} items` : "Este grupo ya estaba pagado");
        fetchPagos();
      } else {
        alert(data.message || "Error al pagar grupo");
      }
    } catch (error) {
      console.error("ERROR pagar grupo:", error);
    }
  };

  // --- GENERAR ORDEN DE COMPRA ---
  const generarOrdenCompra = async (grupo, pago) => {
    try {
      if (!grupo?.items || grupo.items.length === 0) {
        console.error("No hay items para enviar");
        return;
      }
      const payload = {
        proveedor_id: Number(pago.proveedor_id),
        empresa_id: Number(pago.empresa_id),
        sede_id: Number(pago.sede_id),
        grupo_id: Number(grupo.grupo_id),
        modo_igv: modoIGVTesoreria,
        items: grupo.items.map(i => {
          const cantidad = Number(i.cantidad) || 1;
          const total = Number(i.monto) || 0;
          const precioUnitario = total / cantidad;
          return {
            id: Number(i.id),
            descripcion: i.descripcion || "",
            cantidad: cantidad,
            precio_unitario: precioUnitario,
            total: total,
            centro_costo: i.centro_costo || "",
            area_costo: i.area_costo || "",
            departamento: i.departamento || pago.empresa_departamento || ""
          };
        })
      };
      const res = await fetch(API + "orden_compra.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) {
        console.error("❌ ERROR: respuesta no es JSON válido");
        return;
      }
      if (!data.success) {
        console.error("Error backend:", data.error);
        alert(data.error || "Error al generar orden");
        return;
      }
      setOrdenSeleccionada({
        ...data.orden,
        tipo: data.orden.tipo,
        modo_igv: modoIGVTesoreria,
        proveedor: {
          nombre: pago.proveedor || "",
          ruc: pago.proveedor_ruc || "",
          direccion: pago.proveedor_direccion || "",
          telefono: pago.proveedor_telefono || "",
          cuenta: pago.proveedor_cuenta || ""
        },
        empresa: {
          nombre: pago.empresa_nombre || "",
          ruc: pago.empresa_ruc || "",
          direccion: pago.empresa_direccion || "",
          web: pago.empresa_web || "",
          departamento: pago.empresa_departamento || ""
        },
        sede: { nombre: pago.sede_nombre || "" },
        items: grupo.items.map(i => {
          const cantidad = Number(i.cantidad) || 1;
          const total = Number(i.monto) || 0;
          const precioUnitario = total / cantidad;
          return {
            id: Number(i.id),
            descripcion: i.descripcion || "",
            cantidad: cantidad,
            precio_unitario: precioUnitario,
            total: total,
            centro_costo: i.centro_costo || "",
            area_costo: i.area_costo || "",
            departamento: i.departamento || pago.empresa_departamento || ""
          };
        })
      });
      setShowOrdenCompra(true);
    } catch (err) {
      console.error("🔥 ERROR OC:", err);
    }
  };

  // --- FILTRO FINAL CON IGV ---
  const pagosFiltradosFinal = pagosFiltrados
    .map(p => {
      const gruposFiltrados = (p.grupos || []).map(g => {
        let itemsFiltrados = g.items;
        if (tipoVista === "PENDIENTE") itemsFiltrados = g.items.filter(i => i.estado_pago === "Pendiente");
        else if (tipoVista === "PAGADO") itemsFiltrados = g.items.filter(i => i.estado_pago === "Pagado");
        const montoTotalGrupo = itemsFiltrados.reduce((acc, i) => acc + aplicarModoIGV(i.monto || 0), 0);
        return { ...g, items: itemsFiltrados, montoTotal: montoTotalGrupo };
      }).filter(g => g.items.length > 0);
      return { ...p, grupos: gruposFiltrados };
    })
    .filter(p => p.grupos.length > 0)
    .filter(p =>
      (!empresaSeleccionada || Number(p.empresa_id) === Number(empresaSeleccionada)) &&
      (!sedeSeleccionada || Number(p.sede_id) === Number(sedeSeleccionada))
    );

  useEffect(() => {
    fetchPagos();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#F8F9FA] overflow-hidden font-sans">
      {/* HEADER */}
      <header className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-10 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#800000] rounded-xl flex items-center justify-center shadow-lg shadow-maroon-200">
            <Wallet className="text-[#D4AF37]" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-800 uppercase leading-none">
              Módulo <span className="text-[#800000]">Tesorería</span>
            </h2>
            <p className="text-xs font-semibold text-gray-400 mt-1 flex items-center gap-1 uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Sistema de Pagos Masivos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-full border border-gray-100">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#800000] shadow-sm border border-gray-100">
            <Users size={20} />
          </div>
          <span className="pr-4 text-sm font-bold text-gray-600">Admin</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* FILTROS Y TOTAL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Seleccionar Entidad</label>
                <div className="flex gap-3">
                  {[{ id: 1, n: 'EDUTUR' }, { id: 2, n: 'KEVSTUR' }].map(e => (
                    <button
                      key={e.id}
                      onClick={() => { setEmpresaSeleccionada(e.id); setSedeSeleccionada(null); }}
                      className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 flex items-center gap-2 border-2 ${empresaSeleccionada === e.id
                        ? 'bg-[#800000] border-[#800000] text-white shadow-lg shadow-red-900/20 translate-y-[-2px]'
                        : 'bg-white border-transparent text-gray-400 hover:border-gray-200 shadow-sm'
                        }`}
                    >
                      <Building2 size={18} className={empresaSeleccionada === e.id ? "text-[#D4AF37]" : "text-gray-300"} />
                      {e.n}
                    </button>
                  ))}
                </div>
              </div>
              {empresaSeleccionada && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Sedes Disponibles</label>
                  <div className="flex flex-wrap gap-2">
                    {pagosFiltrados
                      .filter(p => Number(p.empresa_id) === Number(empresaSeleccionada))
                      .map(p => p.sede_id)
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .map(sedeId => (
                        <button
                          key={sedeId}
                          onClick={() => setSedeSeleccionada(sedeId)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${sedeSeleccionada === sedeId
                            ? 'bg-[#D4AF37] border-[#D4AF37] text-white shadow-md'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          {pagosFiltrados.find(p => p.sede_id === sedeId)?.sede_nombre}
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-br from-[#800000] to-[#500000] p-6 rounded-3xl shadow-xl border-b-4 border-[#D4AF37] relative overflow-hidden group">
              <div className="absolute top-[-20px] right-[-20px] text-white/5 group-hover:scale-110 transition-transform duration-700">
                <Receipt size={120} />
              </div>
              <div className="relative z-10">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Total Proyectado</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-[#D4AF37] text-xl font-black">S/</span>
                  <span className="text-white text-3xl font-black">
                    {pagosFiltradosFinal
                      .reduce((acc, pago) => acc + (pago.grupos || []).reduce((sum, g) => sum + Number(g.montoTotal || 0), 0), 0)
                      .toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTONES PENDIENTE/PAGADO/TODOS */}
          <div className="flex gap-2">
            {["PENDIENTE", "PAGADO", "TODOS"].map(tipo => (
              <button
                key={tipo}
                onClick={() => setTipoVista(tipo)}
                className={`px-4 py-2 rounded-xl font-bold ${tipoVista === tipo ? 'bg-[#800000] text-white' : 'bg-white border'}`}
              >
                {tipo}
              </button>
            ))}
          </div>

          {/* SELECTOR MODO IGV */}
          <div className="flex gap-4 items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Modo IGV:</span>
            <div className="flex gap-2">
              <button onClick={() => setModoIGVTesoreria("incluido")} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${modoIGVTesoreria === "incluido" ? "bg-[#800000] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Total incluye IGV</button>
              <button onClick={() => setModoIGVTesoreria("agregado")} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${modoIGVTesoreria === "agregado" ? "bg-[#800000] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>IGV se agrega al subtotal</button>
            </div>
          </div>

          {/* LISTADO DE PROVEEDORES */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <Truck size={16} className="text-[#800000]" />
              Proveedores Pendientes ({pagosFiltradosFinal.length})
            </h3>
            {pagosFiltradosFinal.length > 0 ? (
              pagosFiltradosFinal.map(pago => {
                const proveedorKey = `${pago.proveedor_id}-${pago.empresa_id}-${pago.sede_id}`;
                const montoTotal = (pago.grupos || []).reduce((acc, g) => acc + (g.montoTotal || 0), 0);
                return (
                  <div key={proveedorKey} className={`bg-white rounded-2xl transition-all duration-300 border ${expandedProveedor === proveedorKey ? 'ring-2 ring-[#800000] border-transparent shadow-2xl' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
                    <div onClick={() => setExpandedProveedor(expandedProveedor === proveedorKey ? null : proveedorKey)} className="p-5 flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${expandedProveedor === pago.proveedor_id ? 'bg-[#800000] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
                          <Truck size={20} />
                        </div>
                        <div>
                          <h4 className="font-black text-gray-800 uppercase tracking-tight">{pago.proveedor}</h4>
                          <p className="text-[11px] text-gray-400 font-bold tracking-wide">RUC: {pago.proveedor_ruc}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase"><Building2 size={10} /> {pago.empresa_nombre}</span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase"><MapPin size={10} /> {pago.sede_nombre}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5 tracking-tighter">Monto Acumulado</p>
                          <p className="text-xl font-black text-[#800000]"><span className="text-xs mr-0.5">S/</span>{Number(montoTotal).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className={`p-2 rounded-full transition-transform duration-300 ${expandedProveedor === proveedorKey ? 'rotate-180 bg-[#800000] text-white' : 'text-gray-300'}`}>
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    </div>

                    {expandedProveedor === proveedorKey && (
                      <div className="p-6 border-t border-gray-50 bg-[#FCFAFA] rounded-b-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                          <table className="w-full text-left border-collapse shadow-sm rounded-lg overflow-hidden">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider border-b-2 border-gray-200">
                              <tr><th className="px-6 py-4">Descripción</th><th className="px-6 py-4">Fecha</th><th className="px-6 py-4">Importe</th><th className="px-6 py-4 text-center">Estado</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                              {(pago.grupos || []).map(grupo => {
                                const grupoPagado = grupo.items?.every(item => item.estado_pago === "Pagado");
                                const comprobantesUrls = grupo.comprobante_url ? grupo.comprobante_url.split(',') : [];
                                const guiasUrls = grupo.guia_url ? grupo.guia_url.split(',') : [];
                                return (
                                  <React.Fragment key={grupo.grupo_id}>
                                    <tr className="bg-gray-50/80 border-t border-gray-200">
                                      <td colSpan="4" className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                          <div className="font-bold text-sm text-gray-700">Grupo #{grupo.grupo_id}</div>
                                          <div className="font-black text-base text-gray-800 bg-white px-4 py-1.5 rounded-lg shadow-sm">Total: S/ {grupo.montoTotal.toFixed(2)}</div>
                                        </div>
                                        <div className="mt-3 flex flex-wrap items-center gap-3">
                                          {comprobantesUrls.map((url, idx) => (
                                            <a key={idx} href={API + `descargar_comprobante.php?file=${url.trim()}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-700 text-[11px] font-bold bg-blue-50 px-3 py-1.5 rounded-md hover:underline">
                                              <FileDown size={12} /> Comprobante {idx+1}
                                            </a>
                                          ))}
                                          <FileUploader grupoId={grupo.grupo_id} tipo="comprobante" onUpload={async (id, files) => { for (const f of files) await subirComprobanteGrupo(id, f); fetchPagos(); }} />
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan="4" className="px-6 py-4 bg-white border-b border-gray-100">
                                        <div className="flex flex-wrap items-center gap-3">
                                          <button onClick={() => handlePagarGrupo(grupo)} disabled={grupoPagado} className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all duration-200 shadow-sm ${grupoPagado ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-md'}`}>
                                            <ArrowRightCircle size={14} /> {grupoPagado ? "Pagado" : "Pagar Grupo"}
                                          </button>
                                          <div className="flex flex-wrap items-center gap-3">
                                            {guiasUrls.map((url, idx) => (
                                              <a key={idx} href={API + `descargar_guia.php?file=${url.trim()}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-emerald-700 text-[11px] font-bold bg-emerald-50 px-3 py-1.5 rounded-md hover:underline">
                                                <Download size={12} /> Guía {idx+1}
                                              </a>
                                            ))}
                                            <FileUploader grupoId={grupo.grupo_id} tipo="guia" onUpload={async (id, files) => { for (const f of files) await subirGuiaGrupo(id, f); fetchPagos(); }} />
                                          </div>
                                          <button onClick={() => generarOrdenCompra(grupo, pago)} className="bg-white border-2 border-[#800000] text-[#800000] px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-red-50 transition-all">
                                            <FileText size={14} /> {ordenGenerada?.tipo === "OS" ? "Orden Servicio" : "Orden Compra"}
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                    {grupo.items.map(item => (
                                      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150 border-t border-gray-50">
                                        <td className="px-6 py-3.5 font-semibold text-gray-700 text-sm">{item.descripcion}</td>
                                        <td className="px-6 py-3.5"><div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium"><Calendar size={14} className="text-gray-400" /> {item.fecha}</div></td>
                                        <td className="px-6 py-3.5"><span className="font-black text-gray-800 text-sm bg-gray-50 px-2 py-1 rounded">S/ {aplicarModoIGV(item.monto || 0).toFixed(2)}</span></td>
                                        <td className="px-6 py-3.5 text-center">
                                          {item.estado_pago === "Pagado" ? <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-black"><CheckCircle2 size={12} /> Pagado</span>
                                          : <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black"><AlertCircle size={12} /> Pendiente</span>}
                                        </td>
                                      </tr>
                                    ))}
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-20 text-center space-y-3 shadow-inner">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto"><Receipt size={32} className="text-gray-200" /></div>
                <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">No se encontraron pagos pendientes</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #800000; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-left-4 { from { transform: translateX(-1rem); } to { transform: translateX(0); } }
        @keyframes zoom-in-95 { from { transform: scale(0.95); } to { transform: scale(1); } }
        .animate-in { animation: 0.3s ease-out forwards; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-left-4 { animation-name: slide-in-from-left-4; }
        .zoom-in-95 { animation-name: zoom-in-95; }
      `}</style>
    </div>
  );
};

export default Tesoreria;