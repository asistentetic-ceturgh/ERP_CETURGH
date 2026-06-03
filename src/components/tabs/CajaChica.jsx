import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus, FileText, DollarSign, Layers, Calendar, Trash2, Info, FileCheck,
  Award, Loader2, X, Paperclip, Eye, ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react';

import { API_BASE } from "../../config/api";

const API_BASE_URL = API_BASE;

export default function CajaChica() {
  // -------------------- OBTENER DATOS DEL USUARIO LOGUEADO --------------------
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [userId, setUserId] = useState(storedUser.id || null);
  const [rolUsuario, setRolUsuario] = useState(storedUser.tipo || 'asistente');
  const [departamentoNombre, setDepartamentoNombre] = useState(storedUser.departamento || '');

  useEffect(() => {
    const updateUser = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserId(user.id || null);
      setRolUsuario(user.tipo || 'asistente');
      setDepartamentoNombre(user.departamento || '');
    };
    window.addEventListener('storage', updateUser);
    return () => window.removeEventListener('storage', updateUser);
  }, []);

  // -------------------- ESTADOS PRINCIPALES --------------------
  const [cajas, setCajas] = useState([]);
  const [rendiciones, setRendiciones] = useState([]);
  const [loadingCajas, setLoadingCajas] = useState(true);
  const [loadingRendiciones, setLoadingRendiciones] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);
  const [rendicionesPendientes, setRendicionesPendientes] = useState([]);
  const [loadingPendientes, setLoadingPendientes] = useState(false);
  const [selectedRendicion, setSelectedRendicion] = useState(null);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [historialCajaSeleccionada, setHistorialCajaSeleccionada] = useState(null);
  const [historialPageModal, setHistorialPageModal] = useState(1);
  const rowsPerPageModal = 10;

  // -------------------- MODALES --------------------
  const [showSolicitudModal, setShowSolicitudModal] = useState(false);
  const [showRendicionModal, setShowRendicionModal] = useState(false);
  const [selectedCaja, setSelectedCaja] = useState(null);
  const [tipoSolicitud, setTipoSolicitud] = useState('APERTURA');
  const [motivoSolicitud, setMotivoSolicitud] = useState('');
  const [cajaParaRecarga, setCajaParaRecarga] = useState('');
  const [voucherFile, setVoucherFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal de observación
  const [showObservacionModal, setShowObservacionModal] = useState(false);
  const [observacionText, setObservacionText] = useState('');
  const [rendicionIdParaObservar, setRendicionIdParaObservar] = useState(null);

  // -------------------- DATOS MAESTROS --------------------
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
    codigo: '',
    monto_base: 1000.00,
  });

  // -------------------- RENDICIÓN (formulario) --------------------
  const [cabeceraRendicion, setCabeceraRendicion] = useState({
    numero: '',
    fecha_rendicion: new Date().toISOString().split('T')[0],
    fecha_deposito: '',
    saldo_inicial: 0,
  });
  const [itemsRendicion, setItemsRendicion] = useState([
    { id: 1, fecha: '', proveedor: '', ruc_dni: '', tipo_documento: 'FACTURA', numero_documento: '', descripcion: '', monto: 0 }
  ]);

  // -------------------- NOTIFICACIONES --------------------
  const [notification, setNotification] = useState(null);
  const triggerNotification = (msg, type = 'success') => {
    setNotification({ text: msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // -------------------- CÁLCULOS --------------------
  const totalRendido = itemsRendicion.reduce((acc, curr) => acc + (parseFloat(curr.monto) || 0), 0);
  const saldoCajaFinal = parseFloat(cabeceraRendicion.saldo_inicial) - totalRendido;

  // -------------------- FUNCIONES DE CARGA --------------------
  const loadEmpresas = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}empresas.php`);
      const data = await res.json();
      if (data.ok) setEmpresas(data.data);
    } catch (error) {
      triggerNotification('Error al cargar empresas', 'error');
    }
  }, []);

  const loadSedes = useCallback(async (empresaId) => {
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
  }, []);

  const searchCentrosCosto = useCallback(async (query, empresaId, sedeId) => {
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
  }, []);

  const verDetalleRendicion = async (rend) => {
    const res = await fetch(`${API_BASE_URL}rendiciones.php?id=${rend.id}`);
    const data = await res.json();
    if (data.ok) setSelectedRendicion(data.data);
  };

  const fetchCajas = useCallback(async () => {
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
  }, []);

  const fetchRendiciones = useCallback(async (cajaId) => {
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
  }, []);

  const fetchSolicitudes = useCallback(async () => {
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
  }, []);

  const fetchRendicionesPendientes = useCallback(async () => {
    setLoadingPendientes(true);
    try {
      const res = await fetch(`${API_BASE_URL}rendiciones.php?estado=ENVIADO`);
      const data = await res.json();
      if (data.ok) setRendicionesPendientes(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPendientes(false);
    }
  }, []);

  // Debounce para centros de costo
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
  }, [searchCentroTerm, nuevaCaja.empresa_id, nuevaCaja.sede_id, searchCentrosCosto]);

  // Carga inicial
  useEffect(() => {
    loadEmpresas();
    fetchCajas();
    fetchSolicitudes();
    fetchRendicionesPendientes();
  }, [loadEmpresas, fetchCajas, fetchSolicitudes, fetchRendicionesPendientes]);

  // -------------------- MANEJADORES DE SOLICITUD --------------------
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
    setIsSubmitting(false);
  };

  const generarPDFRendicion = async () => {
    if (!selectedRendicion) return;

    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Colores
    const COLOR_VINO = { r: 128, g: 0, b: 0 };
    const COLOR_ORO = { r: 212, g: 175, b: 55 };
    const COLOR_TEXTO_DARK = { r: 30, g: 41, b: 59 };
    const COLOR_TEXTO_MUTED = { r: 100, g: 116, b: 139 };

    let caja = cajas.find(c => c.id === selectedRendicion.caja_id);
    if (!caja && selectedRendicion.caja_id) {
      try {
        const res = await fetch(`${API_BASE_URL}cajas.php?id=${selectedRendicion.caja_id}`);
        const data = await res.json();
        if (data.ok && data.data) {
          caja = data.data;
          // Opcional: actualizar el estado global cajas para futuras veces
          setCajas(prev => {
            const exists = prev.some(c => c.id === caja.id);
            if (!exists) return [...prev, caja];
            return prev.map(c => c.id === caja.id ? caja : c);
          });
        }
      } catch (error) {
        console.error('Error fetching caja for PDF:', error);
      }
    }

    // Helper firmas (igual que antes)
    const obtenerFirmaBase64 = async (rutaFirma) => {
      if (!rutaFirma) return null;
      try {
        const res = await fetch(`${API_BASE_URL}${rutaFirma}`);
        const blob = await res.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error cargando firma:', error);
        return null;
      }
    };

    const usuarioRinde = storedUser;
    let jefeAdmin = null, jefeTesoro = null;
    try {
      const [resAdmin, resTesoro] = await Promise.all([
        fetch(`${API_BASE_URL}get_jefe_by_departamento.php?nombre=ADMINISTRACION&tipo=jefe`),
        fetch(`${API_BASE_URL}get_jefe_by_departamento.php?nombre=TESORERIA&tipo=jefe`)
      ]);
      const dataAdmin = await resAdmin.json();
      const dataTesoro = await resTesoro.json();
      if (dataAdmin.ok) jefeAdmin = dataAdmin.data;
      if (dataTesoro.ok) jefeTesoro = dataTesoro.data;
    } catch (error) { console.error(error); }

    const [firmaRinde, firmaAdmin, firmaTesoro] = await Promise.all([
      obtenerFirmaBase64(usuarioRinde?.firma),
      obtenerFirmaBase64(jefeAdmin?.firma),
      obtenerFirmaBase64(jefeTesoro?.firma)
    ]);

    // --- Cabecera institucional ---
    doc.setFillColor(COLOR_VINO.r, COLOR_VINO.g, COLOR_VINO.b);
    doc.rect(0, 0, 210, 14, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("SISTEMA DE GESTIÓN DE CAJA CHICA — CONTROL INTERNO", 15, 9);

    doc.setFontSize(16);
    doc.setTextColor(COLOR_VINO.r, COLOR_VINO.g, COLOR_VINO.b);
    doc.text("RENDICIÓN DE CAJA CHICA", 15, 26);
    doc.setFillColor(COLOR_ORO.r, COLOR_ORO.g, COLOR_ORO.b);
    doc.rect(15, 29, 45, 1, 'F');

    // --- Datos de la rendición (N°, fecha) ---
    doc.setTextColor(COLOR_TEXTO_DARK.r, COLOR_TEXTO_DARK.g, COLOR_TEXTO_DARK.b);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold"); doc.text("N° RENDICIÓN:", 15, 38);
    doc.setFont("helvetica", "normal"); doc.text(selectedRendicion.numero || "S/N", 42, 38);
    doc.setFont("helvetica", "bold"); doc.text("FECHA EMISIÓN:", 15, 44);
    doc.setFont("helvetica", "normal"); doc.text(selectedRendicion.fecha_rendicion || "-", 42, 44);

    // --- Datos de la Caja (código, empresa/sede) ---
    doc.setFont("helvetica", "bold"); doc.text("CÓDIGO CAJA:", 115, 38);
    doc.setFont("helvetica", "normal");
    // Mostrar código de caja
    const codigoCaja = caja?.codigo || (selectedRendicion.caja_id ? `ID: ${selectedRendicion.caja_id}` : "No asignada");
    doc.text(codigoCaja, 142, 38);

    doc.setFont("helvetica", "bold"); doc.text("EMPRESA / SEDE:", 115, 44);
    doc.setFont("helvetica", "normal");
    const empresaNombre = caja?.empresa_nombre || (caja?.empresa_id ? `Empresa ID: ${caja.empresa_id}` : "No especificada");
    const sedeNombre = caja?.sede_nombre || (caja?.sede_id ? `Sede ID: ${caja.sede_id}` : "No especificada");
    doc.text(`${empresaNombre} - ${sedeNombre}`, 145, 44);

    // --- Responsable ---
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(15, 49, 195, 49);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLOR_VINO.r, COLOR_VINO.g, COLOR_VINO.b);
    doc.text("PERSONAL RESPONSABLE", 15, 55);
    doc.setTextColor(COLOR_TEXTO_DARK.r, COLOR_TEXTO_DARK.g, COLOR_TEXTO_DARK.b);
    doc.setFont("helvetica", "bold"); doc.text("COLABORADOR:", 15, 61);
    doc.setFont("helvetica", "normal"); doc.text(usuarioRinde?.nombre || '-', 42, 61);
    doc.setFont("helvetica", "bold"); doc.text("DEPARTAMENTO:", 115, 61);
    doc.setFont("helvetica", "normal"); doc.text(usuarioRinde?.departamento || '-', 145, 61);
    doc.line(15, 66, 195, 66);

    // --- Tabla de comprobantes ---
    const items = selectedRendicion.items || [];
    let finalY = 72;

    if (items.length > 0) {
      const tableRows = items.map((item, idx) => [
        idx + 1,
        item.fecha || "-",
        item.proveedor || "-",
        item.ruc_dni || "-",
        item.tipo_documento || "-",
        item.numero_documento || "-",
        `S/ ${parseFloat(item.monto || 0).toFixed(2)}`
      ]);
      autoTable(doc, {
        startY: finalY,
        head: [["#", "FECHA EMISIÓN", "PROVEEDOR", "RUC/DNI", "TIPO", "N° DOCUMENTO", "IMPORTE"]],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [COLOR_VINO.r, COLOR_VINO.g, COLOR_VINO.b], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
        styles: { fontSize: 7.5, cellPadding: 2.5, textColor: [COLOR_TEXTO_DARK.r, COLOR_TEXTO_DARK.g, COLOR_TEXTO_DARK.b] },
        columnStyles: {
          0: { cellWidth: 8, halign: 'center' },
          1: { cellWidth: 24 },
          2: { cellWidth: 54 },
          3: { cellWidth: 24, fontStyle: 'bold' },
          4: { cellWidth: 18 },
          5: { cellWidth: 26 },
          6: { cellWidth: 26, halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 15, right: 15 }
      });
      finalY = doc.lastAutoTable.finalY + 10;
    } else {
      doc.setFont("helvetica", "italic");
      doc.text("No se registran comprobantes.", 15, finalY);
      finalY += 12;
    }

    // --- Resumen económico ---
    if (finalY > 220) { doc.addPage(); finalY = 25; }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLOR_VINO.r, COLOR_VINO.g, COLOR_VINO.b);
    doc.text("LIQUIDACIÓN Y RESUMEN ECONÓMICO", 15, finalY);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(15, finalY + 3, 180, 24, 'F');
    doc.setFontSize(9);
    doc.setTextColor(COLOR_TEXTO_DARK.r, COLOR_TEXTO_DARK.g, COLOR_TEXTO_DARK.b);
    doc.setFont("helvetica", "normal"); doc.text("Saldo Inicial Asignado:", 20, finalY + 10);
    doc.setFont("helvetica", "bold"); doc.text(`S/ ${parseFloat(selectedRendicion.saldo_inicial || 0).toFixed(2)}`, 65, finalY + 10);
    doc.setFont("helvetica", "normal"); doc.text("Total Gastado / Rendido:", 20, finalY + 16);
    doc.setFont("helvetica", "bold"); doc.text(`S/ ${parseFloat(selectedRendicion.total_rendido || 0).toFixed(2)}`, 65, finalY + 16);
    doc.setFont("helvetica", "normal"); doc.text("Saldo de Caja Remanente:", 20, finalY + 22);
    doc.setFont("helvetica", "bold"); doc.setTextColor(COLOR_VINO.r, COLOR_VINO.g, COLOR_VINO.b);
    doc.text(`S/ ${parseFloat(selectedRendicion.saldo_final || 0).toFixed(2)}`, 65, finalY + 22);

    // --- Declaración jurada ---
    finalY += 38;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_TEXTO_MUTED.r, COLOR_TEXTO_MUTED.g, COLOR_TEXTO_MUTED.b);
    const declaracion = `Declaro bajo juramento que los gastos detallados son verídicos y corresponden a la ejecución de operaciones autorizadas con cargo a la caja chica "${caja?.codigo || 'Sistema'}".`;
    const lines = doc.splitTextToSize(declaracion, 180);
    doc.text(lines, 15, finalY);

    // --- Firmas ---
    const firmaY = 265;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.line(15, firmaY, 65, firmaY);
    doc.line(80, firmaY, 130, firmaY);
    doc.line(145, firmaY, 195, firmaY);

    if (firmaRinde) { try { doc.addImage(firmaRinde, 'PNG', 20, firmaY - 16, 40, 13); } catch (e) { } }
    if (firmaAdmin) { try { doc.addImage(firmaAdmin, 'PNG', 85, firmaY - 16, 40, 13); } catch (e) { } }
    if (firmaTesoro) { try { doc.addImage(firmaTesoro, 'PNG', 150, firmaY - 16, 40, 13); } catch (e) { } }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(COLOR_TEXTO_DARK.r, COLOR_TEXTO_DARK.g, COLOR_TEXTO_DARK.b);
    doc.text(usuarioRinde?.nombre?.toUpperCase() || "RESPONSABLE", 40, firmaY + 4, { align: "center" });
    doc.text(jefeAdmin?.nombre?.toUpperCase() || "POR DESIGNAR", 105, firmaY + 4, { align: "center" });
    doc.text(jefeTesoro?.nombre?.toUpperCase() || "POR DESIGNAR", 170, firmaY + 4, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLOR_TEXTO_MUTED.r, COLOR_TEXTO_MUTED.g, COLOR_TEXTO_MUTED.b);
    doc.text("FIRMA DEL RESPONSABLE", 40, firmaY + 8, { align: "center" });
    doc.text("JEFE DE ADMINISTRACIÓN", 105, firmaY + 8, { align: "center" });
    doc.text("VOBO TESORERÍA GENERAL", 170, firmaY + 8, { align: "center" });

    doc.save(`Planilla_Rendicion_${selectedRendicion.numero || 'Caja_Chica'}.pdf`);
  };

  const handleFileUpload = async (itemId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('archivo', file);
    try {
      const res = await fetch(`${API_BASE_URL}upload.php`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.ok) {
        setItemsRendicion(itemsRendicion.map(item =>
          item.id === itemId ? { ...item, adjunto: data.filepath } : item
        ));
        triggerNotification('Archivo subido correctamente');
      } else {
        triggerNotification(data.error, 'error');
      }
    } catch (error) {
      triggerNotification('Error al subir archivo', 'error');
    }
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

  const cajaSeleccionadaRecarga = cajas.find(c => Number(c.id) === Number(cajaParaRecarga));

  const handleCreateSolicitud = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!motivoSolicitud.trim()) {
      triggerNotification('Ingrese un motivo', 'error');
      setIsSubmitting(false);
      return;
    }
    if (motivoSolicitud.trim().length < 10) {
      triggerNotification('El motivo debe tener al menos 10 caracteres', 'error');
      setIsSubmitting(false);
      return;
    }

    const monto = parseFloat(nuevaCaja.monto_base);
    if (isNaN(monto) || monto <= 0) {
      triggerNotification('El monto debe ser mayor a cero', 'error');
      setIsSubmitting(false);
      return;
    }

    if (tipoSolicitud === 'APERTURA') {
      if (!nuevaCaja.empresa_id || !nuevaCaja.sede_id || !nuevaCaja.centro_costo_id) {
        triggerNotification('Complete empresa, sede y centro de costo', 'error');
        setIsSubmitting(false);
        return;
      }
      const codigo = nuevaCaja.codigo.trim();
      if (!codigo) {
        triggerNotification('Ingrese un nombre para la caja', 'error');
        setIsSubmitting(false);
        return;
      }
      const codigoRegex = /^[a-zA-Z0-9_-]{3,50}$/;
      if (!codigoRegex.test(codigo)) {
        triggerNotification('El nombre debe tener 3-50 caracteres: letras, números, - o _', 'error');
        setIsSubmitting(false);
        return;
      }
      if (monto > 50000) {
        triggerNotification('El monto de apertura no puede exceder S/ 50,000', 'error');
        setIsSubmitting(false);
        return;
      }
    }

    if (tipoSolicitud === 'RECARGA') {
      if (!cajaParaRecarga) {
        triggerNotification('Seleccione una caja para recargar', 'error');
        setIsSubmitting(false);
        return;
      }
      if (!cajaSeleccionadaRecarga) {
        triggerNotification('Caja no encontrada', 'error');
        setIsSubmitting(false);
        return;
      }
      if (monto > 10000) {
        triggerNotification('El monto de recarga no puede exceder S/ 10,000', 'error');
        setIsSubmitting(false);
        return;
      }
      const nuevoSaldo = cajaSeleccionadaRecarga.saldo_actual + monto;
      if (nuevoSaldo > 50000) {
        triggerNotification(`La recarga excedería el saldo máximo permitido (S/ 50,000). Saldo actual: S/ ${cajaSeleccionadaRecarga.saldo_actual}`, 'error');
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      tipo: tipoSolicitud,
      empresa_id: tipoSolicitud === 'APERTURA' ? nuevaCaja.empresa_id : null,
      sede_id: tipoSolicitud === 'APERTURA' ? nuevaCaja.sede_id : null,
      centro_costo_id: tipoSolicitud === 'APERTURA' ? nuevaCaja.centro_costo_id : null,
      monto: monto,
      motivo: motivoSolicitud,
      caja_id: tipoSolicitud === 'RECARGA' ? parseInt(cajaParaRecarga) : null,
      codigo: tipoSolicitud === 'APERTURA' ? nuevaCaja.codigo.trim() : null,
      created_by: userId,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const actualizarEstado = async (solicitudId, accion, extras = {}) => {
    try {
      const body = { accion, usuario_id: userId, ...extras };
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

  const actualizarEstadoRendicion = async (rendicionId, nuevoEstado, observacion = null) => {
    try {
      const body = { estado: nuevoEstado };
      if (observacion) body.observacion = observacion;
      const res = await fetch(`${API_BASE_URL}rendiciones.php?id=${rendicionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.ok) {
        triggerNotification(`Rendición ${nuevoEstado === 'APROBADO' ? 'aprobada' : 'observada'}`);
        fetchRendicionesPendientes();
        fetchCajas();
        if (showHistorialModal && historialCajaSeleccionada) {
          fetchRendiciones(historialCajaSeleccionada.id);
        }
      } else {
        triggerNotification(data.error, 'error');
      }
    } catch (error) {
      triggerNotification('Error de conexión', 'error');
    }
  };

  // Funciones para el modal de observación
  const abrirModalObservacion = (rendicionId) => {
    setRendicionIdParaObservar(rendicionId);
    setObservacionText('');
    setShowObservacionModal(true);
  };

  const confirmarObservacion = () => {
    if (!observacionText.trim()) {
      triggerNotification('Debe ingresar una observación', 'error');
      return;
    }
    actualizarEstadoRendicion(rendicionIdParaObservar, 'OBSERVADO', observacionText.trim());
    setShowObservacionModal(false);
    setObservacionText('');
    setRendicionIdParaObservar(null);
  };

  const handleAprobarAdmin = (solicitudId) => actualizarEstado(solicitudId, 'aprobar_admin');
  const handleRechazarAdmin = (solicitudId) => actualizarEstado(solicitudId, 'rechazar_admin');

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

  // -------------------- RENDICIÓN (formulario) --------------------
  const handleOpenRendicion = (caja) => {
    setSelectedCaja(caja);
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
      created_by: userId,
      items: itemsRendicion.map(item => ({
        fecha: item.fecha,
        proveedor: item.proveedor,
        ruc_dni: item.ruc_dni,
        tipo_documento: item.tipo_documento,
        numero_documento: item.numero_documento,
        descripcion: item.descripcion,
        monto: parseFloat(item.monto),
        adjunto: item.adjunto || null,
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
        if (showHistorialModal && historialCajaSeleccionada && selectedCaja.id === historialCajaSeleccionada.id) {
          fetchRendiciones(selectedCaja.id);
        }
      } else {
        triggerNotification(data.error, 'error');
      }
    } catch (error) {
      triggerNotification('Error de conexión', 'error');
    }
  };

  // -------------------- CIERRE DE MODALES --------------------
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showSolicitudModal) setShowSolicitudModal(false);
        if (showRendicionModal) setShowRendicionModal(false);
        if (showHistorialModal) setShowHistorialModal(false);
        if (selectedRendicion) setSelectedRendicion(null);
        if (showObservacionModal) setShowObservacionModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showSolicitudModal, showRendicionModal, showHistorialModal, selectedRendicion, showObservacionModal]);

  useEffect(() => {
    if (showSolicitudModal || showRendicionModal || showHistorialModal || selectedRendicion || showObservacionModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showSolicitudModal, showRendicionModal, showHistorialModal, selectedRendicion, showObservacionModal]);

  // -------------------- RENDER --------------------
  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-900 custom-scrollbar">
      {notification && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 p-4 rounded-2xl shadow-2xl border animate-bounce ${notification.type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-200' : 'bg-emerald-50 text-emerald-950 border-emerald-200'}`}>
          <Info className="w-5 h-5" />
          <p className="text-sm font-bold">{notification.text}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 bg-slate-50 min-h-screen text-slate-800 antialiased">
        {/* HEADER */}
        <div className="bg-[#800000] p-6 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-b-4 border-[#D4AF37]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center text-[#800000] shadow-inner shrink-0">
              <Award size={28} />
            </div>
            <div>
              <span className="text-red-200 text-[10px] font-bold uppercase tracking-widest block opacity-80">
                Administración & Tesorería
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight font-serif mt-0.5">
                Módulo de Caja Chica
              </h3>
            </div>
          </div>
          <button
            onClick={() => setShowSolicitudModal(true)}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-950 text-[#D4AF37] border border-[#D4AF37]/40 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Plus size={16} /> Solicitar Caja Chica
          </button>
        </div>

        {/* MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cajas Activas</p>
              <h3 className="text-3xl font-black text-slate-900">{cajas.length}</h3>
            </div>
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100">
              <Layers className="w-5 h-5 text-[#800000]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fondos Disponibles</p>
              <h3 className="text-3xl font-black text-emerald-600">
                S/ {cajas.reduce((sum, c) => sum + parseFloat(c.saldo_actual), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rendido Acumulado</p>
              <h3 className="text-3xl font-black text-[#800000]">
                S/ {rendiciones.reduce((sum, r) => sum + parseFloat(r.total_rendido), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100">
              <FileCheck className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* COLUMNA IZQUIERDA: Cajas Activas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200/80">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#D4AF37] rounded-full shadow-sm shadow-[#D4AF37]/50"></span>
                <h4 className="font-extrabold text-slate-800 uppercase text-xs tracking-wider">
                  Cajas Activas de la Unidad
                </h4>
              </div>
            </div>

            {loadingCajas ? (
              <div className="flex justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Loader2 className="animate-spin w-9 h-9 text-[#800000]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cajas.map((c) => {
                  const porcentajeGastado = ((c.monto_base - c.saldo_actual) / c.monto_base) * 100;
                  const esCritico = porcentajeGastado >= 90;

                  return (
                    <div
                      key={c.id}
                      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      <div className="bg-slate-50/90 px-5 py-4 border-b border-slate-100 flex justify-between items-center gap-3">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <span className="bg-[#800000] text-amber-50 px-2.5 py-0.5 rounded-md font-mono font-bold text-[10px] tracking-wider uppercase inline-block shadow-sm shadow-[#800000]/20">
                            {c.codigo}
                          </span>
                          <h4 className="font-extrabold text-slate-800 text-sm truncate pr-2" title={c.empresa_nombre}>
                            {c.empresa_nombre || 'Sin empresa'}
                          </h4>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-extrabold tracking-wide shrink-0 shadow-sm ${c.estado === 'ACTIVA'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                          : 'bg-rose-50 text-rose-700 border-rose-200/60'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.estado === 'ACTIVA' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                            }`} />
                          {c.estado}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100/80">
                            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Sede</span>
                            <span className="font-bold text-slate-700 truncate block">{c.sede_nombre || '-'}</span>
                          </div>
                          <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100/80">
                            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Centro Costo</span>
                            <span className="font-bold text-slate-700 truncate block">{c.centro_costo_nombre || '-'}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-slate-500">
                            <span className="text-slate-600 font-semibold">Fondos Consumidos</span>
                            <span className={esCritico ? 'text-rose-600 font-black animate-pulse' : 'text-slate-800 font-bold'}>
                              {porcentajeGastado.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30 p-[2px]">
                            <div
                              className={`h-full rounded-full transition-all duration-500 shadow-sm ${esCritico ? 'bg-gradient-to-r from-rose-500 to-rose-600 animate-pulse' : 'bg-[#800000]'
                                }`}
                              style={{ width: `${porcentajeGastado}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-end pt-4 border-t border-slate-100 mt-2">
                          <div>
                            <span className="text-slate-400 text-[9px] block uppercase font-bold tracking-wider mb-0.5">Saldo Disponible</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-slate-900 tracking-tight">
                                S/ {parseFloat(c.saldo_actual).toFixed(2)}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                              Base: S/ {parseFloat(c.monto_base).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setHistorialCajaSeleccionada(c);
                                setShowHistorialModal(true);
                                setHistorialPageModal(1);
                                fetchRendiciones(c.id);
                              }}
                              className="text-[11px] text-slate-700 font-bold border border-slate-200 hover:border-[#D4AF37] hover:bg-amber-50/30 px-3 py-2 rounded-xl transition-all active:scale-95 shadow-2xs"
                            >
                              Historial
                            </button>

                            <button
                              onClick={() => handleOpenRendicion(c)}
                              className="bg-[#800000] hover:bg-[#600000] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-[#800000]/10 active:scale-95 shrink-0"
                            >
                              <FileText size={14} className="text-[#D4AF37]" />
                              <span>RENDIR</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: Solicitudes Pendientes y Tesorería */}
          <div className="space-y-6">
            {/* SECTION: Solicitudes Pendientes */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b pb-3 border-slate-100">
                <span className="w-1.5 h-5 bg-[#D4AF37] rounded-full shadow-sm shadow-[#D4AF37]/40"></span>
                <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                  Solicitudes Pendientes
                </h3>
              </div>

              {loadingSolicitudes ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-[#800000] w-6 h-6" />
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                  {solicitudes.filter(s => s.estado === 'PENDIENTE_ADMIN' || s.estado === 'APROBADO_ADMIN').length === 0 && (
                    <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-slate-400 text-xs font-medium">No hay solicitudes pendientes de trámite.</p>
                    </div>
                  )}

                  {solicitudes.filter(s => s.estado === 'PENDIENTE_ADMIN' || s.estado === 'APROBADO_ADMIN').map(sol => (
                    <div
                      key={sol.id}
                      className="border border-slate-100 rounded-xl p-4 bg-slate-50/40 space-y-3 hover:border-slate-200 hover:bg-slate-50/80 transition-all duration-200 shadow-2xs"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-0.5">
                          <h5 className="font-extrabold text-slate-900 text-xs tracking-tight">{sol.tipo}</h5>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{sol.motivo}</p>
                        </div>
                        <span className="text-xs font-black text-emerald-700 whitespace-nowrap bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 shadow-2xs">
                          S/ {parseFloat(sol.monto).toFixed(2)}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 font-medium space-y-1 pt-2 border-t border-slate-200/50 flex flex-wrap justify-between items-center gap-2">
                        <div className="flex items-center gap-3">
                          <div>
                            Estado: {' '}
                            <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${sol.estado === 'PENDIENTE_ADMIN'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                              }`}>
                              {sol.estado}
                            </span>
                          </div>
                          {sol.codigo_solicitado && (
                            <div>
                              Código: <span className="font-mono font-bold bg-slate-200/60 text-slate-700 px-1 rounded">{sol.codigo_solicitado}</span>
                            </div>
                          )}
                        </div>

                        {sol.voucher_pago && (
                          <a
                            href={`${API_BASE_URL}${sol.voucher_pago}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-[11px] font-bold inline-flex items-center gap-1 hover:underline bg-blue-50/50 px-2 py-0.5 rounded-md"
                          >
                            Ver Voucher
                          </a>
                        )}
                      </div>

                      {rolUsuario === 'jefe' && departamentoNombre === 'ADMINISTRACION' && sol.estado === 'PENDIENTE_ADMIN' && (
                        <div className="flex gap-2 pt-1 justify-end">
                          <button
                            onClick={() => handleRechazarAdmin(sol.id)}
                            className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                          >
                            Rechazar
                          </button>
                          <button
                            onClick={() => handleAprobarAdmin(sol.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                          >
                            Aprobar
                          </button>
                        </div>
                      )}

                      {rolUsuario === 'jefe' && departamentoNombre === 'TESORERIA' && sol.estado === 'APROBADO_ADMIN' && (
                        <div className="flex flex-col gap-2 pt-2 border-t border-slate-200/50 mt-1">
                          <label className="block">
                            <span className="sr-only">Seleccionar Voucher</span>
                            <input
                              type="file"
                              onChange={(e) => setVoucherFile(e.target.files[0])}
                              className="block w-full text-xs text-slate-500
                      file:mr-3 file:py-1.5 file:px-3
                      file:rounded-lg file:border-0
                      file:text-xs file:font-bold
                      file:bg-slate-100 file:text-slate-700
                      hover:file:bg-slate-200 file:cursor-pointer cursor-pointer"
                              accept="image/*,application/pdf"
                            />
                          </label>
                          <button
                            onClick={() => handlePagar(sol.id)}
                            className="w-full bg-[#800000] hover:bg-[#600000] text-white py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#800000]/10 active:scale-95"
                          >
                            Procesar Pago
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION: Rendiciones por Revisar (Tesorería) */}
            {rolUsuario === 'jefe' && departamentoNombre === 'TESORERIA' && (
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2.5 border-b pb-3 border-slate-100">
                  <span className="w-1.5 h-5 bg-[#800000] rounded-full shadow-sm shadow-[#800000]/40"></span>
                  <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                    Rendiciones por Revisar
                  </h3>
                </div>

                {loadingPendientes ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-[#800000] w-6 h-6" />
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {rendicionesPendientes.length === 0 && (
                      <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-slate-400 text-xs font-medium">No hay rendiciones pendientes de revisión.</p>
                      </div>
                    )}

                    {rendicionesPendientes.map(rend => (
                      <div
                        key={rend.id}
                        className="border border-slate-100 rounded-xl p-4 bg-slate-50/40 space-y-3 hover:border-slate-200 hover:bg-slate-50/80 transition-all duration-200 shadow-2xs"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="space-y-1">
                            <p className="text-xs font-extrabold text-slate-900 tracking-tight">N° {rend.numero}</p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              Caja:{' '}
                              <span className="font-mono font-bold bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                                {rend.caja_codigo}
                              </span>
                            </p>
                          </div>
                          <span className="text-xs font-black text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs">
                            S/ {parseFloat(rend.total_rendido).toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/50">
                          <button
                            onClick={() => verDetalleRendicion(rend)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-bold border border-blue-100 hover:border-blue-200 bg-blue-50/30 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            Ver Comprobantes
                          </button>

                          <div className="flex gap-2">
                            <button
                              onClick={() => abrirModalObservacion(rend.id)}
                              className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                            >
                              Observar
                            </button>
                            <button
                              onClick={() => actualizarEstadoRendicion(rend.id, 'APROBADO')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                            >
                              Aprobar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL SOLICITUD */}
      {showSolicitudModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowSolicitudModal(false)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl border-t-8 border-[#800000] max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-8 pb-4 flex justify-between border-b">
              <div><h3 className="font-black text-[#800000] text-2xl">Solicitar {tipoSolicitud === 'APERTURA' ? 'Apertura' : 'Recarga'}</h3></div>
              <button onClick={() => { setShowSolicitudModal(false); resetFormulario(); }} className="text-3xl font-light"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateSolicitud} className="p-8 pt-6 space-y-6">
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
                    <input type="text" className="w-full bg-slate-50 p-3 rounded-2xl uppercase font-mono" placeholder="Ej: TESORERIA, ALMACEN, OPERACIONES" value={nuevaCaja.codigo} onChange={(e) => setNuevaCaja({ ...nuevaCaja, codigo: e.target.value.toUpperCase() })} required />
                    <p className="text-[8px] text-slate-400 mt-1">Solo letras, números, guiones y guión bajo. 3-50 caracteres.</p>
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
                    {cajas.filter(c => c.estado === 'ACTIVA' || c.saldo_actual <= 0).map(c => (
                      <option key={c.id} value={c.id}>
                        {c.codigo} - {c.empresa_nombre} {c.saldo_actual <= 0 ? '(SALDO AGOTADO)' : `(Saldo: S/ ${parseFloat(c.saldo_actual).toFixed(2)})`}
                      </option>
                    ))}
                  </select>
                  {cajaSeleccionadaRecarga && (
                    <div className="mt-2 text-xs bg-slate-100 p-2 rounded-lg">
                      <span className="font-bold">Saldo actual:</span> S/ {parseFloat(cajaSeleccionadaRecarga.saldo_actual).toFixed(2)}
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="text-[10px] font-black uppercase">Monto (S/.)</label>
                <input type="number" step="0.01" min="0.01" className="w-full bg-slate-50 p-3 rounded-2xl" value={nuevaCaja.monto_base} onChange={(e) => setNuevaCaja({ ...nuevaCaja, monto_base: parseFloat(e.target.value) })} required />
                <p className="text-[8px] text-slate-400 mt-1">{tipoSolicitud === 'APERTURA' ? 'Máximo S/ 50,000' : 'Máximo S/ 10,000'}</p>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase">Motivo</label>
                <textarea className="w-full bg-slate-50 p-3 rounded-2xl" rows="3" value={motivoSolicitud} onChange={(e) => setMotivoSolicitud(e.target.value)} required minLength="10" />
                <p className="text-[8px] text-slate-400 mt-1">Mínimo 10 caracteres</p>
              </div>
              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-4">
                <button type="button" onClick={() => { setShowSolicitudModal(false); resetFormulario(); }} className="flex-1 border-2 py-3 rounded-2xl">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#800000] text-white font-black py-3 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Enviar Solicitud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HISTORIAL (con paginación) */}
      {showHistorialModal && historialCajaSeleccionada && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setShowHistorialModal(false)}
        >
          <div
            className="bg-white rounded-[2rem] max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border-t-[6px] border-[#800000] ring-1 ring-[#D4AF37]/20 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-50/60 p-6 px-8 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-[#D4AF37] rounded-full"></span>
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Auditoría de Caja</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl tracking-tight flex items-center gap-2">
                  Historial de Rendiciones
                  <span className="font-mono bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-lg text-xs font-bold">
                    {historialCajaSeleccionada.codigo}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setShowHistorialModal(false)}
                className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-2.5 rounded-xl border border-slate-200 shadow-2xs transition-all duration-200 active:scale-95"
              >
                <X size={16} className="stroke-[3]" />
              </button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto flex flex-col justify-between min-h-0 scrollbar-thin">
              <div className="overflow-hidden border border-slate-200/70 rounded-2xl bg-white shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-400 tracking-wider uppercase">
                        <th className="p-4 pl-6">N° Rendición</th>
                        <th className="p-4">Fecha de Registro</th>
                        <th className="p-4 text-right">Total Rendido</th>
                        <th className="p-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {rendiciones.slice((historialPageModal - 1) * rowsPerPageModal, historialPageModal * rowsPerPageModal).map(rend => (
                        <tr key={rend.id} className="hover:bg-amber-50/20 group transition-colors">
                          <td className="p-4 pl-6 font-mono font-bold text-slate-700 group-hover:text-[#800000]">
                            {rend.numero}
                          </td>
                          <td className="p-4 text-slate-500 font-medium">
                            {rend.fecha_rendicion}
                          </td>
                          <td className="p-4 text-right font-mono font-black text-sm text-[#800000]">
                            S/ {parseFloat(rend.total_rendido).toFixed(2)}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => verDetalleRendicion(rend)}
                              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg text-slate-600 hover:text-blue-600 font-bold transition-all shadow-2xs active:scale-95"
                            >
                              <Eye size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                              <span>Detalles</span>
                            </button>
                          </td>
                        </tr>
                      ))}

                      {rendiciones.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-12 text-center">
                            <div className="max-w-sm mx-auto space-y-1">
                              <p className="text-slate-400 text-sm font-bold">Sin registros contables</p>
                              <p className="text-slate-400 text-xs font-medium">Esta caja aún no cuenta con rendiciones aprobadas en el sistema.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {Math.ceil(rendiciones.length / rowsPerPageModal) > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 shrink-0">
                  <button
                    disabled={historialPageModal === 1}
                    onClick={() => setHistorialPageModal(p => p - 1)}
                    className="inline-flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-2xs"
                  >
                    <ChevronLeft size={16} />
                    <span>Anterior</span>
                  </button>

                  <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/40">
                    Página <span className="text-slate-800 font-black">{historialPageModal}</span> de <span className="text-slate-800 font-black">{Math.ceil(rendiciones.length / rowsPerPageModal)}</span>
                  </div>

                  <button
                    disabled={historialPageModal === Math.ceil(rendiciones.length / rowsPerPageModal)}
                    onClick={() => setHistorialPageModal(p => p + 1)}
                    className="inline-flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-2xs"
                  >
                    <span>Siguiente</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL PLANILLA DE RENDICIÓN */}
      {showRendicionModal && selectedCaja && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
          onClick={(e) => e.target === e.currentTarget && setShowRendicionModal(false)}
        >
          <div className="bg-white rounded-[2.5rem] border-t-[6px] border-[#800000] ring-1 ring-[#D4AF37]/20 max-w-7xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl transform transition-all">

            {/* Cabecera Principal */}
            <div className="bg-slate-50/50 p-6 px-8 flex justify-between items-center border-b border-slate-100 shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Contabilidad & Control</span>
                </div>
                <h3 className="font-black text-slate-900 text-2xl tracking-tight flex items-center gap-3">
                  Planilla de Rendición
                  <span className="font-mono bg-slate-200/60 text-slate-700 px-3 py-0.5 rounded-xl text-xs font-bold">
                    {selectedCaja.codigo}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setShowRendicionModal(false)}
                className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-2.5 rounded-xl border border-slate-200 shadow-2xs transition-all duration-200 active:scale-95"
              >
                <X size={16} className="stroke-[3]" />
              </button>
            </div>

            {/* Cuerpo del Formulario */}
            <div className="overflow-y-auto p-8 bg-slate-50/50 flex-1 space-y-6 scrollbar-thin">

              {/* Fila superior: Cabecera Contable */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Nº Planilla</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-mono font-bold text-slate-800 focus:border-[#800000] focus:bg-white focus:ring-2 focus:ring-[#800000]/10 transition-all outline-none"
                    value={cabeceraRendicion.numero}
                    onChange={e => setCabeceraRendicion({ ...cabeceraRendicion, numero: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Fecha Rendición</label>
                  <input
                    type="date"
                    className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-700 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 transition-all outline-none shadow-2xs"
                    value={cabeceraRendicion.fecha_rendicion}
                    onChange={e => setCabeceraRendicion({ ...cabeceraRendicion, fecha_rendicion: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Saldo Inicial (Fondo)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-bold text-slate-400">S/</span>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full bg-white border border-slate-200 p-2.5 pl-8 rounded-xl font-mono font-bold text-xs text-slate-800 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 transition-all outline-none shadow-2xs"
                      value={cabeceraRendicion.saldo_inicial}
                      onChange={e => setCabeceraRendicion({ ...cabeceraRendicion, saldo_inicial: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">Fecha de Depósito</label>
                  <input
                    type="date"
                    className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-700 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 transition-all outline-none shadow-2xs"
                    value={cabeceraRendicion.fecha_deposito}
                    onChange={e => setCabeceraRendicion({ ...cabeceraRendicion, fecha_deposito: e.target.value })}
                  />
                </div>
              </div>

              {/* Tabla Dinámica de Comprobantes */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse table-fixed min-w-[1200px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 tracking-wider uppercase">
                        <th className="p-3 pl-4 w-12 text-center">#</th>
                        <th className="p-3 w-36">Fecha Emisión</th>
                        <th className="p-3 w-48">Proveedor / Razón Social</th>
                        <th className="p-3 w-36">RUC / DNI</th>
                        <th className="p-3 w-36">Tipo Doc.</th>
                        <th className="p-3 w-36">N° Documento</th>
                        <th className="p-3 w-32 text-right">Importe (S/)</th>
                        <th className="p-3 w-56">Descripción del Gasto</th>
                        <th className="p-3 w-48">Sustento (PDF/IMG)</th>
                        <th className="p-3 w-12 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {itemsRendicion.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                          {/* Index */}
                          <td className="p-2 text-center font-mono font-bold text-slate-400 bg-slate-50/40">
                            {idx + 1}
                          </td>

                          {/* Fecha */}
                          <td className="p-2">
                            <input
                              type="date"
                              className="w-full bg-white border border-slate-200 p-1.5 rounded-lg text-xs font-medium focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20 transition-all outline-none"
                              value={item.fecha}
                              onChange={e => handleItemChange(item.id, 'fecha', e.target.value)}
                            />
                          </td>

                          {/* Proveedor */}
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="Nombre comercial..."
                              className="w-full bg-white border border-slate-200 p-1.5 rounded-lg text-xs font-bold text-slate-700 placeholder:text-slate-300 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20 transition-all outline-none"
                              value={item.proveedor}
                              onChange={e => handleItemChange(item.id, 'proveedor', e.target.value)}
                            />
                          </td>

                          {/* RUC / DNI */}
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="Identificación"
                              className="w-full bg-white border border-slate-200 p-1.5 rounded-lg text-xs font-mono focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20 transition-all outline-none"
                              value={item.ruc_dni}
                              onChange={e => handleItemChange(item.id, 'ruc_dni', e.target.value)}
                            />
                          </td>

                          {/* Tipo Doc */}
                          <td className="p-2">
                            <select
                              className="w-full bg-white border border-slate-200 p-1.5 rounded-lg text-xs font-bold text-slate-600 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20 transition-all outline-none appearance-none"
                              value={item.tipo_documento}
                              onChange={e => handleItemChange(item.id, 'tipo_documento', e.target.value)}
                            >
                              <option value="FACTURA">FACTURA</option>
                              <option value="BOLETA">BOLETA</option>
                              <option value="RXH">R.X.H.</option>
                              <option value="MOVILIDAD">MOVILIDAD</option>
                              <option value="NOTA DE VENTA">NOTA DE VENTA</option>
                              <option value="OTROS">OTROS</option>
                            </select>
                          </td>

                          {/* N° Doc */}
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="001-00002"
                              className="w-full bg-white border border-slate-200 p-1.5 rounded-lg text-xs font-mono font-semibold focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20 transition-all outline-none"
                              value={item.numero_documento}
                              onChange={e => handleItemChange(item.id, 'numero_documento', e.target.value)}
                            />
                          </td>

                          {/* Importe */}
                          <td className="p-2">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="w-full bg-white border border-slate-200 p-1.5 rounded-lg font-mono font-black text-xs text-right text-slate-800 focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20 transition-all outline-none"
                              value={item.monto || ''}
                              onChange={e => handleItemChange(item.id, 'monto', e.target.value)}
                            />
                          </td>

                          {/* Descripción */}
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="Detalle del gasto..."
                              className="w-full bg-white border border-slate-200 p-1.5 rounded-lg text-xs font-medium focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20 transition-all outline-none"
                              value={item.descripcion}
                              onChange={e => handleItemChange(item.id, 'descripcion', e.target.value)}
                            />
                          </td>

                          {/* Archivo Adjunto */}
                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              <label className="flex-1 flex items-center justify-center gap-1 border border-dashed border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg text-[10px] text-slate-500 font-bold cursor-pointer transition-all">
                                <Paperclip size={12} className="text-slate-400" />
                                <span className="truncate max-w-[80px]">Adjuntar</span>
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  onChange={(e) => handleFileUpload(item.id, e.target.files[0])}
                                  className="hidden"
                                />
                              </label>
                              {item.adjunto && (
                                <a
                                  href={`${API_BASE_URL}${item.adjunto}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors font-bold text-[10px] inline-flex items-center gap-0.5"
                                >
                                  <ExternalLink size={10} />
                                  Ver
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Eliminar Fila */}
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(item.id)}
                              className="text-slate-300 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Acciones de la tabla y Bloque de Liquidación de saldos */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                >
                  <Plus size={14} className="stroke-[3]" />
                  <span>Añadir comprobante</span>
                </button>

                {/* Tarjeta de Resumen Financiero */}
                <div className="bg-slate-100/80 border border-slate-200 p-4 rounded-2xl w-full sm:w-80 space-y-2 text-xs font-medium shadow-inner">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Total Rendido:</span>
                    <span className="font-mono font-bold text-slate-900">S/ {totalRendido.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-slate-200/80 w-full my-1"></div>
                  <div className="flex justify-between items-center text-slate-800">
                    <span className="font-bold">Saldo Final Disponible:</span>
                    <span className="font-mono font-black text-sm text-[#800000] bg-white px-2.5 py-0.5 rounded-lg border border-slate-200/60 shadow-2xs">
                      S/ {saldoCajaFinal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Pie de Página / Barra de Control Fija */}
            <div className="sticky bottom-0 bg-slate-100/90 border-t border-slate-200/60 px-8 py-5 flex flex-wrap justify-end items-center gap-3 shrink-0 z-10 backdrop-blur-xs">
              <button
                onClick={() => setShowRendicionModal(false)}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-2xs active:scale-95"
              >
                Cerrar Ventana
              </button>
              <button
                onClick={() => handleSaveRendicion('BORRADOR')}
                className="bg-amber-50 hover:bg-amber-100 border border-amber-200/70 text-amber-800 px-5 py-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-2xs"
              >
                Guardar como Borrador
              </button>
              <button
                onClick={() => handleSaveRendicion('ENVIADO')}
                className="bg-[#800000] hover:bg-[#600000] text-white px-6 py-3 rounded-xl font-black text-xs shadow-md shadow-[#800000]/20 transition-all active:scale-95"
              >
                Enviar a Tesorería
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL OBSERVACIÓN */}
      {showObservacionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowObservacionModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">Observar Rendición</h3>
              <button onClick={() => setShowObservacionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-2">Motivo de la observación</label>
                <textarea
                  rows="4"
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000]/50"
                  placeholder="Explique detalladamente qué debe corregir el usuario..."
                  value={observacionText}
                  onChange={(e) => setObservacionText(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setShowObservacionModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarObservacion}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700"
                >
                  Enviar Observación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE RENDICIÓN */}
      {selectedRendicion && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setSelectedRendicion(null)}
        >
          <div
            className="bg-white rounded-[2.5rem] max-w-6xl w-full max-h-[88vh] overflow-hidden flex flex-col shadow-2xl border-t-[6px] border-[#800000] ring-1 ring-[#D4AF37]/20 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del Visor */}
            <div className="bg-slate-50/60 p-6 px-8 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-[#D4AF37] rounded-full"></span>
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Consulta de Comprobantes</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl tracking-tight flex items-center gap-2">
                  Detalle de Rendición
                  <span className="font-mono bg-slate-200/70 text-slate-700 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                    {selectedRendicion.numero}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedRendicion(null)}
                className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 p-2.5 rounded-xl border border-slate-200 shadow-2xs transition-all duration-200 active:scale-95"
              >
                <X size={16} className="stroke-[3]" />
              </button>
            </div>

            {/* Cuerpo de la consulta */}
            <div className="p-8 bg-slate-50/40 flex-1 overflow-y-auto flex flex-col gap-6 scrollbar-thin">

              {/* Panel informativo superior / Metadatos rápidos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-2xs flex flex-col justify-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Comprobantes procesados</span>
                  <span className="text-xl font-black text-slate-800 font-mono">
                    {selectedRendicion.items?.length || 0} <span className="text-xs text-slate-400 font-sans font-medium">ítems totales</span>
                  </span>
                </div>

                <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-2xs flex flex-col justify-center sm:col-span-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Estado actual del documento</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                      Registrado para Auditoría
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabla de Lectura de Comprobantes */}
              <div className="bg-white border border-slate-200/70 rounded-2xl shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-[10px] font-black text-slate-300 tracking-wider uppercase">
                        <th className="p-4 pl-6 w-12 text-center text-slate-400">#</th>
                        <th className="p-4 w-32">Fecha Emisión</th>
                        <th className="p-4">Proveedor</th>
                        <th className="p-4 w-32">RUC / DNI</th>
                        <th className="p-4 w-28">Tipo Doc.</th>
                        <th className="p-4 w-32">N° Documento</th>
                        <th className="p-4 w-36 text-right">Importe</th>
                        <th className="p-4 max-w-xs">Descripción</th>
                        <th className="p-4 text-center w-36">Evidencia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {selectedRendicion.items?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-amber-50/10 transition-colors group">
                          {/* Index */}
                          <td className="p-4 pl-6 text-center font-mono font-bold text-slate-400 bg-slate-50/40">
                            {idx + 1}
                          </td>

                          {/* Fecha */}
                          <td className="p-4 text-slate-600 font-medium">
                            {item.fecha || '-'}
                          </td>

                          {/* Proveedor */}
                          <td className="p-4 font-bold text-slate-800 group-hover:text-[#800000] transition-colors">
                            {item.proveedor}
                          </td>

                          {/* RUC / DNI */}
                          <td className="p-4 text-slate-500 font-mono">
                            {item.ruc_dni || '-'}
                          </td>

                          {/* Tipo Doc */}
                          <td className="p-4">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-slate-600 font-bold text-[10px]">
                              {item.tipo_documento}
                            </span>
                          </td>

                          {/* N° Doc */}
                          <td className="p-4 text-slate-600 font-mono font-medium">
                            {item.numero_documento || '-'}
                          </td>

                          {/* Importe */}
                          <td className="p-4 text-right font-mono font-black text-sm text-[#800000]">
                            S/ {parseFloat(item.monto || 0).toFixed(2)}
                          </td>

                          {/* Descripción */}
                          <td className="p-4 text-slate-500 font-medium max-w-xs truncate" title={item.descripcion}>
                            {item.descripcion || '-'}
                          </td>

                          {/* Adjunto */}
                          <td className="p-4 text-center">
                            {item.adjunto ? (
                              <a
                                href={`${API_BASE_URL}${item.adjunto}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 bg-white hover:bg-[#800000] text-slate-600 hover:text-white border border-slate-200 hover:border-[#800000] px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-2xs active:scale-95"
                              >
                                <Paperclip size={12} className="opacity-70 group-hover:text-white" />
                                <span>Ver Adjunto</span>
                              </a>
                            ) : (
                              <span className="text-slate-300 font-bold font-mono">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Footer / Barra de salida fija */}
            <div className="sticky bottom-0 bg-slate-50 px-8 py-5 flex justify-end border-t border-slate-100 shrink-0">
              <button
                onClick={generarPDFRendicion}
                className="bg-[#800000] hover:bg-[#600000] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
              >
                <FileText size={14} /> Exportar PDF
              </button>
              <button
                onClick={() => setSelectedRendicion(null)}
                className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-2xs active:scale-95"
              >
                Cerrar Vista
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #800000; }
        body.modal-open { overflow: hidden; }
      `}</style>
    </div>
  );
}