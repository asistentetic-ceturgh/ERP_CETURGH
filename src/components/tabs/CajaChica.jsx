import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, FileText, DollarSign, Layers, Calendar, Trash2, Info, FileCheck,
  Award, Loader2
} from 'lucide-react';

import { API_BASE } from "../../config/api";

const API_BASE_URL = API_BASE;

export default function CajaChica() {
  // ==================== ESTADOS PRINCIPALES ====================
  const [cajas, setCajas] = useState([]);
  const [rendiciones, setRendiciones] = useState([]);
  const [loadingCajas, setLoadingCajas] = useState(true);
  const [loadingRendiciones, setLoadingRendiciones] = useState(false);
  const [selectedCajaId, setSelectedCajaId] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);

  // ==================== CONTROL DE MODALES ====================
  const [showSolicitudModal, setShowSolicitudModal] = useState(false);
  const [showRendicionModal, setShowRendicionModal] = useState(false);
  const [selectedCaja, setSelectedCaja] = useState(null);
  const [tipoSolicitud, setTipoSolicitud] = useState('APERTURA');
  const [motivoSolicitud, setMotivoSolicitud] = useState('');
  const [cajaParaRecarga, setCajaParaRecarga] = useState('');
  const [rolUsuario] = useState('asistente');
  const [voucherFile, setVoucherFile] = useState(null);

  // ==================== DATOS MAESTROS ====================
  const [empresas, setEmpresas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [centrosCosto, setCentrosCosto] = useState([]);
  const [searchCentroTerm, setSearchCentroTerm] = useState('');
  const [loadingCentros, setLoadingCentros] = useState(false);
  const debounceRef = useRef(null);

  const [nuevaCaja, setNuevaCaja] = useState({
    empresa_id: '',
    sede_id: '',
    centro_costo_id: '',
    codigo: '',        // <--- Nombre de la caja (ej: Tesorería, Almacén)
    monto_base: 1000.00,
  });

  // ==================== FORMULARIO RENDICIÓN ====================
  const [cabeceraRendicion, setCabeceraRendicion] = useState({
    numero: '',
    fecha_rendicion: new Date().toISOString().split('T')[0],
    fecha_deposito: '',
    saldo_inicial: 0,
  });
  const [itemsRendicion, setItemsRendicion] = useState([
    { id: 1, fecha: '', proveedor: '', ruc_dni: '', tipo_documento: 'FACTURA', numero_documento: '', descripcion: '', monto: 0 }
  ]);

  // ==================== NOTIFICACIONES ====================
  const [notification, setNotification] = useState(null);
  const triggerNotification = (msg, type = 'success') => {
    setNotification({ text: msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ==================== CÁLCULOS RENDICIÓN ====================
  const totalRendido = itemsRendicion.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
  const saldoCajaFinal = parseFloat(cabeceraRendicion.saldo_inicial) - totalRendido;

  // ==================== FUNCIONES DE CARGA ====================
  const loadEmpresas = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}empresas.php`);
      const data = await res.json();
      if (data.ok) setEmpresas(data.data);
    } catch (error) {
      triggerNotification('Error al cargar empresas', 'error');
    }
  };

  const loadSedes = async (empresaId) => {
    if (!empresaId) {
      setSedes([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}sedes.php?empresa_id=${empresaId}`);
      const data = await res.json();
      if (data.ok) setSedes(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const searchCentrosCosto = async (query, empresaId, sedeId) => {
    if (!query || !empresaId || !sedeId) {
      setCentrosCosto([]);
      return;
    }
    setLoadingCentros(true);
    try {
      const url = `${API_BASE_URL}buscar_centros_costos.php?q=${encodeURIComponent(query)}&empresa_id=${empresaId}&sede_id=${sedeId}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.ok) setCentrosCosto(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCentros(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (nuevaCaja.empresa_id && nuevaCaja.sede_id && searchCentroTerm) {
        searchCentrosCosto(searchCentroTerm, nuevaCaja.empresa_id, nuevaCaja.sede_id);
      } else {
        setCentrosCosto([]);
      }
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [searchCentroTerm, nuevaCaja.empresa_id, nuevaCaja.sede_id]);

  const fetchCajas = async () => {
    setLoadingCajas(true);
    try {
      const res = await fetch(`${API_BASE_URL}cajas.php`);
      const data = await res.json();
      if (data.ok) setCajas(data.data);
      else triggerNotification('Error al cargar cajas', 'error');
    } catch (error) {
      triggerNotification('Error de conexión', 'error');
    } finally {
      setLoadingCajas(false);
    }
  };

  const fetchRendiciones = async (cajaId) => {
    if (!cajaId) return;
    setLoadingRendiciones(true);
    try {
      const res = await fetch(`${API_BASE_URL}rendiciones.php?caja_id=${cajaId}`);
      const data = await res.json();
      if (data.ok) setRendiciones(data.data);
      else setRendiciones([]);
    } catch (error) {
      setRendiciones([]);
    } finally {
      setLoadingRendiciones(false);
    }
  };

  const fetchSolicitudes = async () => {
    setLoadingSolicitudes(true);
    try {
      const res = await fetch(`${API_BASE_URL}solicitudes_caja.php`);
      const data = await res.json();
      if (data.ok) setSolicitudes(data.data);
      else console.error(data.error);
    } catch (error) {
      console.error('Error fetching solicitudes:', error);
      triggerNotification('Error al cargar solicitudes', 'error');
    } finally {
      setLoadingSolicitudes(false);
    }
  };

  useEffect(() => {
    loadEmpresas();
    fetchCajas();
    fetchSolicitudes();
  }, []);

  useEffect(() => {
    if (selectedCajaId) {
      fetchRendiciones(selectedCajaId);
    } else {
      setRendiciones([]);
    }
  }, [selectedCajaId]);

  // ==================== MANEJADORES DE SOLICITUD ====================
  const resetFormulario = () => {
    setNuevaCaja({
      empresa_id: '',
      sede_id: '',
      centro_costo_id: '',
      codigo: '',
      monto_base: 1000,
    });
    setSearchCentroTerm('');
    setCentrosCosto([]);
    setMotivoSolicitud('');
    setCajaParaRecarga('');
    setTipoSolicitud('APERTURA');
  };

  const handleEmpresaChange = async (empId) => {
    setNuevaCaja({ ...nuevaCaja, empresa_id: empId, sede_id: '', centro_costo_id: '' });
    await loadSedes(empId);
    setCentrosCosto([]);
    setSearchCentroTerm('');
  };

  const handleSedeChange = (sedeId) => {
    setNuevaCaja({ ...nuevaCaja, sede_id: sedeId, centro_costo_id: '' });
    setCentrosCosto([]);
    setSearchCentroTerm('');
  };

  const handleCentroCostoSelect = (centro) => {
    setNuevaCaja({ ...nuevaCaja, centro_costo_id: centro.id });
    setSearchCentroTerm(centro.nombre);
    setCentrosCosto([]);
  };

  const handleCreateSolicitud = async (e) => {
    e.preventDefault();
    if (tipoSolicitud === 'APERTURA') {
      if (!nuevaCaja.empresa_id || !nuevaCaja.sede_id || !nuevaCaja.centro_costo_id) {
        triggerNotification('Complete empresa, sede y centro de costo', 'error');
        return;
      }
      if (!nuevaCaja.codigo.trim()) {
        triggerNotification('Ingrese un nombre para la caja (código)', 'error');
        return;
      }
    }
    if (tipoSolicitud === 'RECARGA' && !cajaParaRecarga) {
      triggerNotification('Seleccione una caja para recargar', 'error');
      return;
    }
    if (!motivoSolicitud) {
      triggerNotification('Ingrese un motivo', 'error');
      return;
    }

    const payload = {
      tipo: tipoSolicitud,
      empresa_id: tipoSolicitud === 'APERTURA' ? nuevaCaja.empresa_id : null,
      sede_id: tipoSolicitud === 'APERTURA' ? nuevaCaja.sede_id : null,
      centro_costo_id: tipoSolicitud === 'APERTURA' ? nuevaCaja.centro_costo_id : null,
      monto: parseFloat(nuevaCaja.monto_base),
      motivo: motivoSolicitud,
      caja_id: tipoSolicitud === 'RECARGA' ? parseInt(cajaParaRecarga) : null,
      codigo: tipoSolicitud === 'APERTURA' ? nuevaCaja.codigo.trim() : null,  // Enviamos el nombre
      created_by: 1,
    };

    try {
      const res = await fetch(`${API_BASE_URL}solicitudes_caja.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        triggerNotification(`Solicitud de ${tipoSolicitud} creada correctamente`);
        setShowSolicitudModal(false);
        fetchSolicitudes();
        resetFormulario();
      } else {
        triggerNotification(data.error, 'error');
      }
    } catch (error) {
      triggerNotification('Error de conexión', 'error');
    }
  };

  const handleAprobarAdmin = async (solicitudId) => {
    await actualizarEstado(solicitudId, 'aprobar_admin');
  };

  const handleRechazarAdmin = async (solicitudId) => {
    await actualizarEstado(solicitudId, 'rechazar_admin');
  };

  const handlePagar = async (solicitudId) => {
    if (!voucherFile) {
      triggerNotification('Seleccione un voucher', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('voucher', voucherFile);
    try {
      const uploadRes = await fetch(`${API_BASE_URL}upload.php`, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.ok) throw new Error(uploadData.error);
      await actualizarEstado(solicitudId, 'pagar', { voucher: uploadData.filepath });
      setVoucherFile(null);
    } catch (error) {
      triggerNotification(error.message, 'error');
    }
  };

  const actualizarEstado = async (solicitudId, accion, extras = {}) => {
    try {
      const body = { accion, usuario_id: 1, ...extras };
      const res = await fetch(`${API_BASE_URL}solicitudes_caja.php?id=${solicitudId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.ok) {
        triggerNotification(`Solicitud ${accion} correctamente`);
        fetchSolicitudes();
        fetchCajas();
      } else {
        triggerNotification(data.error, 'error');
      }
    } catch (error) {
      triggerNotification('Error de conexión', 'error');
    }
  };

  // ==================== MANEJADORES RENDICIÓN ====================
  const handleOpenRendicion = (caja) => {
    setSelectedCaja(caja);
    // CORRECCIÓN: usar split(' ') en lugar de split('T')
    const fechaCreacion = caja.created_at?.split(' ')[0] || '';
    setCabeceraRendicion({
      numero: `REND-${Date.now()}`,
      fecha_rendicion: new Date().toISOString().split('T')[0],
      fecha_deposito: fechaCreacion,
      saldo_inicial: parseFloat(caja.saldo_actual),
    });
    setItemsRendicion([{ id: 1, fecha: '', proveedor: '', ruc_dni: '', tipo_documento: 'FACTURA', numero_documento: '', descripcion: '', monto: 0 }]);
    setShowRendicionModal(true);
  };

  const handleAddRow = () => {
    const nextId = itemsRendicion.length > 0 ? Math.max(...itemsRendicion.map(i => i.id)) + 1 : 1;
    setItemsRendicion([...itemsRendicion, { id: nextId, fecha: '', proveedor: '', ruc_dni: '', tipo_documento: 'FACTURA', numero_documento: '', descripcion: '', monto: 0 }]);
  };

  const handleRemoveRow = (id) => {
    if (itemsRendicion.length === 1) {
      triggerNotification('Debe haber al menos un ítem', 'error');
      return;
    }
    setItemsRendicion(itemsRendicion.filter(item => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItemsRendicion(itemsRendicion.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSaveRendicion = async (estadoRendicion) => {
    if (itemsRendicion.some(item => !item.proveedor || item.monto <= 0)) {
      triggerNotification('Complete proveedor e importe en todos los ítems', 'error');
      return;
    }
    if (!cabeceraRendicion.numero) {
      triggerNotification('Ingrese número de planilla', 'error');
      return;
    }

    const payload = {
      caja_id: selectedCaja.id,
      numero: cabeceraRendicion.numero,
      fecha_rendicion: cabeceraRendicion.fecha_rendicion,
      saldo_inicial: parseFloat(cabeceraRendicion.saldo_inicial),
      total_rendido: totalRendido,
      saldo_final: saldoCajaFinal >= 0 ? saldoCajaFinal : 0,
      estado: estadoRendicion,
      created_by: 1,
      items: itemsRendicion.map(item => ({
        fecha: item.fecha,
        proveedor: item.proveedor,
        ruc_dni: item.ruc_dni,
        tipo_documento: item.tipo_documento,
        numero_documento: item.numero_documento,
        descripcion: item.descripcion,
        monto: parseFloat(item.monto),
      })),
    };

    try {
      const res = await fetch(`${API_BASE_URL}rendiciones.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        triggerNotification(`Rendición guardada como ${estadoRendicion}`);
        setShowRendicionModal(false);
        fetchCajas();
        if (selectedCaja.id === selectedCajaId) {
          fetchRendiciones(selectedCaja.id);
        }
      } else {
        triggerNotification(data.error, 'error');
      }
    } catch (error) {
      triggerNotification('Error de conexión', 'error');
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-900 custom-scrollbar">
      {notification && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 p-4 rounded-2xl shadow-2xl border animate-bounce ${
          notification.type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-200' : 'bg-emerald-50 text-emerald-950 border-emerald-200'
        }`}>
          <Info className="w-5 h-5" />
          <p className="text-sm font-bold">{notification.text}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="bg-[#800000] p-6 sm:p-8 rounded-[2.5rem] text-white border-b-4 border-[#D4AF37] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-[#D4AF37] rounded-3xl flex items-center justify-center text-[#800000] shadow-lg">
              <Award size={36} />
            </div>
            <div>
              <span className="text-red-100 text-xs uppercase font-black tracking-widest">ADMINISTRACIÓN & TESORERÍA</span>
              <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-wider font-serif">Módulo de Caja Chica</h3>
            </div>
          </div>
          <button onClick={() => setShowSolicitudModal(true)} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-950 text-[#D4AF37] border border-[#D4AF37]/50 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
            <Plus size={18} /> Solicitar Caja Chica
          </button>
        </div>

        {/* MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border p-6 flex justify-between">
            <div><p className="text-[10px] font-black text-slate-400">Cajas Activas</p><h3 className="text-3xl font-black">{cajas.length}</h3></div>
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center"><Layers className="w-6 h-6 text-[#800000]" /></div>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-sm border p-6 flex justify-between">
            <div><p className="text-[10px] font-black text-slate-400">Fondos Disponibles</p><h3 className="text-3xl font-black text-emerald-700">S/ {cajas.reduce((sum, c) => sum + parseFloat(c.saldo_actual), 0).toLocaleString()}</h3></div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center"><DollarSign className="w-6 h-6 text-emerald-600" /></div>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-sm border p-6 flex justify-between">
            <div><p className="text-[10px] font-black text-slate-400">Rendido Acumulado</p><h3 className="text-3xl font-black text-[#800000]">S/ {rendiciones.reduce((sum, r) => sum + parseFloat(r.total_rendido), 0).toLocaleString()}</h3></div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center"><FileCheck className="w-6 h-6 text-[#D4AF37]" /></div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LISTADO DE CAJAS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border-l-4 border-[#D4AF37] pl-4">
              <h4 className="font-black text-slate-700 uppercase text-sm">Cajas Activas</h4>
            </div>
            {loadingCajas ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin w-8 h-8 text-[#800000]" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cajas.map((c) => {
                  const porcentajeGastado = ((c.monto_base - c.saldo_actual) / c.monto_base) * 100;
                  return (
                    <div key={c.id} className="bg-white rounded-[2.5rem] border shadow-sm hover:shadow-md transition">
                      <div className="bg-slate-50 px-6 py-5 border-b flex justify-between">
                        <div>
                          <span className="bg-[#800000] text-white px-3 py-1 rounded-full font-black text-[10px] font-mono">{c.codigo}</span>
                          <h4 className="font-serif font-black text-slate-800 text-sm mt-2">{c.empresa_nombre || 'Sin empresa'}</h4>
                        </div>
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${c.estado === 'ACTIVA' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${c.estado === 'ACTIVA' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                          <span className="text-[9px] font-black">{c.estado}</span>
                        </div>
                      </div>
                      <div className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                          <div className="bg-slate-50 p-2.5 rounded-2xl">
                            <span className="text-slate-400 block text-[8px]">Sede</span>
                            <span className="font-black">{c.sede_nombre || '-'}</span>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-2xl">
                            <span className="text-slate-400 block text-[8px]">Centro Costo</span>
                            <span className="font-black">{c.centro_costo_nombre || '-'}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xxs font-black">
                            <span>Fondos Consumidos</span>
                            <span className={porcentajeGastado >= 90 ? 'text-rose-600' : ''}>{porcentajeGastado.toFixed(0)}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div className={`h-full rounded-full ${porcentajeGastado >= 90 ? 'bg-rose-600' : 'bg-[#800000]'}`} style={{ width: `${porcentajeGastado}%` }} />
                          </div>
                        </div>
                        <div className="flex justify-between items-end pt-3 border-t">
                          <div>
                            <span className="text-slate-400 text-[9px]">Saldo Disponible</span>
                            <span className="text-2xl font-black">S/ {parseFloat(c.saldo_actual).toFixed(2)}</span>
                            <span className="text-[10px] text-slate-400 block">Monto Base: S/ {parseFloat(c.monto_base).toFixed(2)}</span>
                          </div>
                          <button onClick={() => handleOpenRendicion(c)} className="bg-slate-900 hover:bg-[#800000] text-white px-5 py-3 rounded-2xl text-[10px] font-black flex items-center gap-2">
                            <FileText size={14} className="text-[#D4AF37]" /> RENDIR CAJA
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* HISTORIAL Y SOLICITUDES */}
          <div className="space-y-6">
            <div className="border-l-4 border-[#D4AF37] pl-4">
              <h4 className="font-black text-slate-700 uppercase text-sm">Rendiciones Registradas</h4>
              <select className="mt-2 w-full text-xs border rounded-lg p-2" value={selectedCajaId || ''} onChange={(e) => setSelectedCajaId(e.target.value ? parseInt(e.target.value) : null)}>
                <option value="">Seleccione una caja</option>
                {cajas.map(c => <option key={c.id} value={c.id}>{c.codigo} - {c.empresa_nombre}</option>)}
              </select>
            </div>
            <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden divide-y">
              {loadingRendiciones && <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>}
              {!loadingRendiciones && rendiciones.length === 0 && selectedCajaId && (
                <div className="p-8 text-center text-slate-400">No hay rendiciones para esta caja</div>
              )}
              {!loadingRendiciones && rendiciones.map((rend) => (
                <div key={rend.id} className="p-6 hover:bg-slate-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black">{rend.numero}</span>
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[8px] font-black">{rend.estado}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar size={12} /> Fecha: {rend.fecha_rendicion}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-[#800000]">S/ {parseFloat(rend.total_rendido).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 bg-slate-50 rounded-2xl p-3 text-[10px]">
                    <div><span className="text-slate-400">Saldo Inicial</span><br />S/ {parseFloat(rend.saldo_inicial).toFixed(2)}</div>
                    <div><span className="text-slate-400">Comprobantes</span><br />{rend.items_count || 0} registros</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Panel de Solicitudes Pendientes */}
            <div className="bg-white rounded-[2.5rem] border p-6">
              <h3 className="font-black text-slate-700 mb-4">Solicitudes Pendientes</h3>
              {loadingSolicitudes ? <Loader2 className="animate-spin mx-auto" /> : (
                <div className="space-y-3">
                  {solicitudes.filter(s => s.estado === 'PENDIENTE_ADMIN' || s.estado === 'APROBADO_ADMIN').length === 0 && (
                    <p className="text-center text-slate-400 text-sm">No hay solicitudes pendientes</p>
                  )}
                  {solicitudes.filter(s => s.estado === 'PENDIENTE_ADMIN' || s.estado === 'APROBADO_ADMIN').map(sol => (
                    <div key={sol.id} className="border rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex-1">
                        <p><strong>{sol.tipo}</strong> - S/ {parseFloat(sol.monto).toFixed(2)}</p>
                        <p className="text-sm text-slate-500">{sol.motivo}</p>
                        <p className="text-xs text-slate-400">Estado: {sol.estado}</p>
                        {sol.codigo_solicitado && <p className="text-xs font-mono">Nombre: {sol.codigo_solicitado}</p>}
                      </div>
                      {rolUsuario === 'jefe' && sol.estado === 'PENDIENTE_ADMIN' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleAprobarAdmin(sol.id)} className="bg-emerald-600 text-white px-3 py-1 rounded text-xs">Aprobar</button>
                          <button onClick={() => handleRechazarAdmin(sol.id)} className="bg-rose-600 text-white px-3 py-1 rounded text-xs">Rechazar</button>
                        </div>
                      )}
                      {rolUsuario === 'tesoreria' && sol.estado === 'APROBADO_ADMIN' && (
                        <div className="flex gap-2 items-center">
                          <input type="file" onChange={(e) => setVoucherFile(e.target.files[0])} className="text-xs" accept="image/*,application/pdf" />
                          <button onClick={() => handlePagar(sol.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Pagar</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL SOLICITUD */}
      {showSolicitudModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border-t-8 border-[#800000] max-w-xl w-full">
            <div className="p-8 pb-4 flex justify-between">
              <div><h3 className="font-black text-[#800000] text-2xl">Solicitar {tipoSolicitud === 'APERTURA' ? 'Apertura' : 'Recarga'}</h3></div>
              <button onClick={() => { setShowSolicitudModal(false); resetFormulario(); }} className="text-3xl font-light">×</button>
            </div>
            <form onSubmit={handleCreateSolicitud} className="p-8 pt-0 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase">Tipo</label>
                <select className="w-full bg-slate-50 p-3 rounded-2xl" value={tipoSolicitud} onChange={(e) => setTipoSolicitud(e.target.value)}>
                  <option value="APERTURA">Apertura de nueva caja</option>
                  <option value="RECARGA">Recarga de caja existente</option>
                </select>
              </div>

              {tipoSolicitud === 'APERTURA' && (
                <>
                  <div>
                    <label className="text-[10px] font-black uppercase">Nombre de la Caja *</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 p-3 rounded-2xl uppercase font-mono" 
                      placeholder="Ej: TESORERIA, ALMACEN, OPERACIONES"
                      value={nuevaCaja.codigo} 
                      onChange={(e) => setNuevaCaja({ ...nuevaCaja, codigo: e.target.value.toUpperCase() })} 
                      required 
                    />
                    <p className="text-[8px] text-slate-400 mt-1">Identificador único de la caja (se usará como nombre)</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase">Empresa</label>
                    <select className="w-full bg-slate-50 p-3 rounded-2xl" value={nuevaCaja.empresa_id} onChange={(e) => handleEmpresaChange(e.target.value)} required>
                      <option value="">Seleccione</option>
                      {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase">Sede</label>
                    <select className="w-full bg-slate-50 p-3 rounded-2xl" value={nuevaCaja.sede_id} onChange={(e) => handleSedeChange(e.target.value)} required disabled={!nuevaCaja.empresa_id}>
                      <option value="">Seleccione</option>
                      {sedes.map(sede => <option key={sede.id} value={sede.id}>{sede.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase">Centro de Costo</label>
                    <input type="text" placeholder="Buscar por código o nombre" className="w-full bg-slate-50 p-3 rounded-2xl" value={searchCentroTerm} onChange={(e) => setSearchCentroTerm(e.target.value)} disabled={!nuevaCaja.sede_id} />
                    {loadingCentros && <div className="text-xs text-slate-400 mt-1">Buscando...</div>}
                    {centrosCosto.length > 0 && (
                      <ul className="border rounded-xl mt-1 max-h-40 overflow-auto bg-white">
                        {centrosCosto.map(cc => <li key={cc.id} className="p-2 hover:bg-slate-100 cursor-pointer text-sm" onClick={() => handleCentroCostoSelect(cc)}>{cc.codigo} - {cc.nombre}</li>)}
                      </ul>
                    )}
                  </div>
                </>
              )}

              {tipoSolicitud === 'RECARGA' && (
                <div>
                  <label className="text-[10px] font-black uppercase">Caja a recargar</label>
                  <select className="w-full bg-slate-50 p-3 rounded-2xl" value={cajaParaRecarga} onChange={(e) => setCajaParaRecarga(e.target.value)} required>
                    <option value="">Seleccione</option>
                    {cajas.filter(c => c.estado === 'ACTIVA').map(c => <option key={c.id} value={c.id}>{c.codigo} - {c.empresa_nombre}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] font-black uppercase">Monto (S/.)</label>
                <input type="number" step="0.01" className="w-full bg-slate-50 p-3 rounded-2xl" value={nuevaCaja.monto_base} onChange={(e) => setNuevaCaja({ ...nuevaCaja, monto_base: e.target.value })} required />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase">Motivo</label>
                <textarea className="w-full bg-slate-50 p-3 rounded-2xl" rows="3" value={motivoSolicitud} onChange={(e) => setMotivoSolicitud(e.target.value)} required />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowSolicitudModal(false); resetFormulario(); }} className="flex-1 border-2 py-3 rounded-2xl">Cancelar</button>
                <button type="submit" className="flex-1 bg-[#800000] text-white font-black py-3 rounded-2xl">Enviar Solicitud</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RENDICIÓN */}
      {showRendicionModal && selectedCaja && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2">
          <div className="bg-white rounded-[2.5rem] border-t-8 border-[#800000] max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            <div className="p-6 pb-2 flex justify-between shrink-0">
              <div><h3 className="font-black text-[#800000] text-2xl">Planilla de Rendición - {selectedCaja.codigo}</h3></div>
              <button onClick={() => setShowRendicionModal(false)} className="text-3xl font-light">×</button>
            </div>
            <div className="overflow-y-auto p-6 bg-slate-50 flex-grow">
              <div className="bg-white p-6 rounded-2xl border space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-bold">Nº Planilla</label><input className="border rounded p-2 w-full" value={cabeceraRendicion.numero} onChange={e => setCabeceraRendicion({ ...cabeceraRendicion, numero: e.target.value })} /></div>
                  <div><label className="text-xs font-bold">Fecha Rendición</label><input type="date" className="border rounded p-2 w-full" value={cabeceraRendicion.fecha_rendicion} onChange={e => setCabeceraRendicion({ ...cabeceraRendicion, fecha_rendicion: e.target.value })} /></div>
                  <div><label className="text-xs font-bold">Saldo Inicial</label><input type="number" step="0.01" className="border rounded p-2 w-full" value={cabeceraRendicion.saldo_inicial} onChange={e => setCabeceraRendicion({ ...cabeceraRendicion, saldo_inicial: e.target.value })} /></div>
                  <div><label className="text-xs font-bold">Fecha Depósito</label><input type="date" className="border rounded p-2 w-full" value={cabeceraRendicion.fecha_deposito} onChange={e => setCabeceraRendicion({ ...cabeceraRendicion, fecha_deposito: e.target.value })} /></div>
                </div>
                <div className="border rounded-xl overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead className="bg-slate-100">
                      <tr><th>#</th><th>Fecha</th><th>Proveedor</th><th>RUC/DNI</th><th>Tipo Doc</th><th>N° Doc</th><th>Importe</th><th>Descripción</th><th></th></tr>
                    </thead>
                    <tbody>
                      {itemsRendicion.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="p-1 text-center">{idx+1}</td>
                          <td><input type="date" className="border p-1 w-28" value={item.fecha} onChange={e => handleItemChange(item.id, 'fecha', e.target.value)} /></td>
                          <td><input className="border p-1 w-40" value={item.proveedor} onChange={e => handleItemChange(item.id, 'proveedor', e.target.value)} /></td>
                          <td><input className="border p-1 w-28" value={item.ruc_dni} onChange={e => handleItemChange(item.id, 'ruc_dni', e.target.value)} /></td>
                          <td><select className="border p-1 w-24" value={item.tipo_documento} onChange={e => handleItemChange(item.id, 'tipo_documento', e.target.value)}>
                                <option>FACTURA</option><option>BOLETA</option><option>RXH</option><option>MOVILIDAD</option><option>OTROS</option>
                              </select>
                          </td>
                          <td><input className="border p-1 w-28" value={item.numero_documento} onChange={e => handleItemChange(item.id, 'numero_documento', e.target.value)} /></td>
                          <td><input type="number" step="0.01" className="border p-1 w-24 text-right" value={item.monto || ''} onChange={e => handleItemChange(item.id, 'monto', e.target.value)} /></td>
                          <td><input className="border p-1 w-48" value={item.descripcion} onChange={e => handleItemChange(item.id, 'descripcion', e.target.value)} /></td>
                          <td><button type="button" onClick={() => handleRemoveRow(item.id)} className="text-rose-600"><Trash2 size={14} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between">
                  <button type="button" onClick={handleAddRow} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs">+ Añadir comprobante</button>
                  <div className="text-right space-y-1">
                    <div><span className="font-bold">Total Rendido:</span> S/ {totalRendido.toFixed(2)}</div>
                    <div><span className="font-bold">Saldo Final:</span> S/ {saldoCajaFinal.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-100 px-6 py-4 flex justify-end gap-3 shrink-0">
              <button onClick={() => setShowRendicionModal(false)} className="border px-5 py-2 rounded-xl">Cerrar</button>
              <button onClick={() => handleSaveRendicion('BORRADOR')} className="bg-[#D4AF37] px-5 py-2 rounded-xl font-black">Borrador</button>
              <button onClick={() => handleSaveRendicion('APROBADO')} className="bg-[#800000] text-white px-6 py-2 rounded-xl font-black">Confirmar Planilla</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #800000; }
      `}</style>
    </div>
  );
}