import React, { useState, useRef, useEffect } from 'react';
import {
    FileText, Download, Printer, X,
    Building2, Phone, Plus, Trash2,
    Calendar, CreditCard, ClipboardList,
    AlertCircle, MapPin
} from 'lucide-react';
import { API_BASE } from "../../config/api";

const API = API_BASE;
const OrdenCompra = ({ orden, onClose }) => {
    const [ordenData, setOrdenData] = useState(null);
    const printRef = useRef();
    const igvRate = 0.18;

    // Cargar orden desde el backend
    useEffect(() => {
        const cargarOrden = async () => {
            if (!orden?.id) {
                console.warn("❌ No hay ID de orden");
                return;
            }
            try {
                console.log("ORDEN RECIBIDA:", orden);
                const res = await fetch(API + `get_orden.php?id=${orden.id}`);
                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error("❌ No es JSON válido");
                    return;
                }
                if (!data.success) {
                    console.error("Error backend:", data.error);
                    return;
                }
                const o = data.orden;
                console.log("ORDEN BACKEND:", o);

                setOrdenData({
                    id: o.id,
                    numero: o.numero || "",
                    fecha: o.fecha || "",
                    fechaEntrega: o.fecha_entrega || "",
                    firmas: {
                        tesoreria: o.firmas?.tesoreria || null,
                        administracion: o.firmas?.administracion || null
                    },
                    proveedor: {
                        nombre: o.proveedor?.nombre || "",
                        ruc: o.proveedor?.ruc || "",
                        direccion: o.proveedor?.direccion || "",
                        telefono: o.proveedor?.telefono || o.proveedor?.contacto || "",
                        cuenta: o.proveedor?.cuenta || o.proveedor?.cuenta_bancaria || ""
                    },
                    empresa: {
                        nombre: o.empresa?.nombre || "",
                        ruc: o.empresa?.ruc || "",
                        direccion: o.empresa?.direccion || "",
                        web: o.empresa?.web || "",
                        departamento: ""
                    },
                    sede: {
                        nombre: o.sede?.nombre || ""
                    },
                    items: (o.items || []).map(i => ({
                        id: Number(i.id),
                        descripcion: i.descripcion || "",
                        precio: Number(i.precio_unitario ?? i.precio) || 0,
                        cantidad: Number(i.cantidad) || 1,
                        total: Number(i.total) || 0,
                        centro_costo: i.centro_costo_nombre || i.centro_costo || null,
                        area_costo: i.area_costo_nombre || i.area_costo || null,
                        departamento: i.departamento_nombre || i.departamento || ""
                    })),
                    condiciones: o.condiciones || "",
                    observaciones: o.observaciones || "",
                    subtotal: o.subtotal || 0,
                    igv: o.igv || 0,
                    total: o.total || 0,
                    modo_igv: o.modo_igv || "incluido"
                });
            } catch (err) {
                console.error("🔥 Error cargando orden:", err);
            }
        };
        cargarOrden();
    }, [orden]);

    // 🔥 Recalcular subtotal, igv y total cuando cambien items o modo_igv
    useEffect(() => {
        if (!ordenData) return;

        const base = ordenData.items.reduce(
            (acc, item) => acc + (item.cantidad * item.precio),
            0
        );

        let newSubtotal = 0, newIgv = 0, newTotal = 0;

        if (ordenData.modo_igv === "incluido") {
            newTotal = base;
            newSubtotal = newTotal / (1 + igvRate);
            newIgv = newTotal - newSubtotal;
        } else { // "agregado"
            newSubtotal = base;
            newIgv = newSubtotal * igvRate;
            newTotal = newSubtotal + newIgv;
        }

        setOrdenData(prev => ({
            ...prev,
            subtotal: newSubtotal,
            igv: newIgv,
            total: newTotal
        }));
    }, [ordenData?.items, ordenData?.modo_igv]);

    // Guardar cambios en el backend
    const guardarCambios = async () => {
        try {
            const payload = {
                id: ordenData.id,
                numero: ordenData.numero,
                fecha: ordenData.fecha,
                subtotal: ordenData.subtotal,
                igv: ordenData.igv,
                total: ordenData.total,
                modo_igv: ordenData.modo_igv,
                condiciones: ordenData.condiciones,
                observaciones: ordenData.observaciones,
                items: ordenData.items.map(i => ({
                    id: i.id,
                    descripcion: i.descripcion,
                    cantidad: i.cantidad,
                    precio: i.precio,
                    total: i.cantidad * i.precio
                }))
            };

            console.log("PAYLOAD UPDATE:", payload);

            const res = await fetch(API + "update_orden.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("❌ No es JSON válido");
                alert("Respuesta inválida del servidor");
                return;
            }

            if (!data.success) {
                alert(data.error || "Error guardando");
                return;
            }

            // Recargar orden actualizada
            const reloadRes = await fetch(API + `get_orden.php?id=${ordenData.id}`);
            const reloadData = await reloadRes.json();
            if (reloadData.success) {
                setOrdenData(reloadData.orden);
            }
            alert("Orden actualizada correctamente");
        } catch (err) {
            console.error("ERROR:", err);
            alert("Error de conexión");
        }
    };

    const handleDownloadPDF = () => {
        const element = printRef.current;
        const opt = {
            margin: 0,
            filename: `${ordenData.numero}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 3, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        if (window.html2pdf) {
            window.html2pdf().set(opt).from(element).save();
        } else {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
            script.onload = () => window.html2pdf().set(opt).from(element).save();
            document.head.appendChild(script);
        }
    };

    const updateItem = (id, field, value) => {
        setOrdenData(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (item.id !== id) return item;
                const updated = { ...item, [field]: value };
                if (field === 'cantidad' || field === 'precio') {
                    updated.total = (updated.cantidad || 0) * (updated.precio || 0);
                }
                return updated;
            })
        }));
    };

    if (!ordenData) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <p className="text-gray-400 font-medium">Cargando datos de la orden...</p>
            </div>
        </div>
    );

    // Usar los valores calculados automáticamente (subtotal, igv, total ya están en ordenData)
    const { subtotal, igv, total } = ordenData;

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900 select-none">
            {/* Botón Cerrar */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-50 bg-white shadow-xl border border-slate-100 rounded-full p-3 hover:bg-red-50 hover:text-red-600 transition-all group print:hidden"
            >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>

            {/* PANEL DE EDICIÓN (Izquierda) */}
            <div className="w-full lg:w-[400px] bg-white border-r border-slate-200 flex flex-col shadow-2xl z-10 print:hidden">
                <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-20">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-[#800000] rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/20">
                            <ClipboardList className="text-[#D4AF37]" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Gestión de Orden</h2>
                            <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">{ordenData.numero}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Información General */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 border-l-4 border-[#800000] pl-3">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">General</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Número OC</label>
                                <input type="text" value={ordenData.numero} disabled className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-400" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Fecha Emisión</label>
                                <input type="date" value={ordenData.fecha} onChange={e => setOrdenData({ ...ordenData, fecha: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#800000]/20" />
                            </div>
                        </div>
                    </section>

                    {/* Configuración IGV */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Configuración IGV</h3>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Tipo de cálculo</label>
                            <select
                                value={ordenData.modo_igv || "incluido"}
                                onChange={(e) => setOrdenData({ ...ordenData, modo_igv: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-200 outline-none"
                            >
                                <option value="incluido">Total incluye IGV</option>
                                <option value="agregado">IGV se agrega al subtotal</option>
                            </select>
                        </div>
                    </section>

                    {/* Proveedor */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 border-l-4 border-[#D4AF37] pl-3">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Proveedor</h3>
                        </div>
                        <div className="space-y-3">
                            <input value={ordenData.proveedor.nombre} disabled className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-400" />
                            <div className="grid grid-cols-2 gap-3">
                                <input value={ordenData.proveedor.ruc} disabled className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-400" />
                                <input value={ordenData.proveedor.telefono} disabled className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-400" />
                            </div>
                        </div>
                    </section>

                    {/* Items */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-l-4 border-slate-800 pl-3">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Detalle de Ítems</h3>
                        </div>
                        <div className="space-y-4">
                            {ordenData.items.map((item) => (
                                <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 shadow-sm">
                                    <textarea
                                        rows="2"
                                        value={item.descripcion}
                                        onChange={e => updateItem(item.id, 'descripcion', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-slate-200 resize-none font-medium"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden px-3 py-1">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase mr-2">Cant.</span>
                                            <input
                                                type="number"
                                                step="any"
                                                value={item.cantidad}
                                                onChange={e => updateItem(item.id, 'cantidad', parseFloat(e.target.value) || 0)}
                                                className="w-full text-right font-bold text-slate-800 text-xs bg-transparent outline-none"
                                            />
                                        </div>
                                        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden px-3 py-1">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase mr-2">Precio</span>
                                            <input
                                                type="number"
                                                value={item.precio}
                                                disabled
                                                className="w-full text-right font-bold text-slate-400 text-xs bg-transparent outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Condiciones y Observaciones */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 border-l-4 border-slate-300 pl-3">
                            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Condiciones y Notas</h3>
                        </div>
                        <div className="space-y-3">
                            <textarea
                                value={ordenData.condiciones || ''}
                                onChange={e => setOrdenData({ ...ordenData, condiciones: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs min-h-[80px] resize-none"
                                placeholder="Condiciones de compra..."
                            />
                            <textarea
                                value={ordenData.observaciones || ''}
                                onChange={e => setOrdenData({ ...ordenData, observaciones: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs min-h-[80px] resize-none italic"
                                placeholder="Observaciones internas..."
                            />
                        </div>
                    </section>
                </div>

                {/* Footer del Panel */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
                    <button onClick={guardarCambios} className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-700 transition-all">
                        Guardar Registro
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleDownloadPDF} className="bg-[#800000] text-white py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg hover:bg-[#600000]">
                            <Download size={14} className="text-[#D4AF37]" /> PDF
                        </button>
                        <button onClick={() => window.print()} className="bg-white border border-slate-200 text-slate-600 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-100">
                            <Printer size={14} /> Imprimir
                        </button>
                    </div>
                </div>
            </div>

            {/* VISTA PREVIA (Derecha) */}
            <div className="flex-1 bg-slate-200 p-8 lg:p-12 overflow-y-auto flex justify-center items-start custom-scrollbar print:p-0 print:bg-white print:overflow-visible">
                <div ref={printRef} className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-14 flex flex-col relative box-border print:shadow-none print:p-0 print:w-full" id="orden-hoja">
                    {/* Encabezado */}
                    <div className="flex justify-between items-start border-b-2 border-[#800000] pb-6">
                        <div className="space-y-4 max-w-[60%]">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-1">
                                    <img src="/Ceturgh.png" className="h-14 w-auto object-contain" alt="Logo" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-tight">{ordenData.empresa.nombre}</h1>
                                    <p className="text-[9px] text-[#800000] font-bold tracking-widest uppercase mt-0.5">EMBAJADORES DE LO NUESTRO</p>
                                </div>
                            </div>
                            <div className="text-[10px] text-slate-600 font-medium uppercase space-y-0.5 leading-tight">
                                <div><span className="font-bold">Dir:</span> {ordenData.empresa.direccion}</div>
                                <div><span className="font-bold">RUC:</span> {ordenData.empresa.ruc}</div>
                                <div className="font-bold text-[#800000] mt-1">{ordenData.empresa.web}</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end min-w-[240px]">
                            <div className="border border-slate-400 p-4 mb-3 w-full text-center bg-slate-50/50">
                                <h2 className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                                    {ordenData.numero?.startsWith("OS") ? "Orden de Servicio" : "Orden de Compra"}
                                </h2>
                                <p className="text-2xl font-mono font-black text-slate-900 tracking-tight">{ordenData.numero}</p>
                            </div>
                            <div className="text-right pr-2">
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Fecha de Emisión</span>
                                <span className="text-xs font-black text-slate-800">{ordenData.fecha}</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Proveedor y Entrega */}
                    <div className="grid grid-cols-2 gap-0 mt-8 border border-slate-300 rounded-sm overflow-hidden">
                        <div className="p-5 border-r border-slate-300 bg-slate-50/60">
                            <h3 className="text-[10px] font-black text-[#800000] uppercase mb-2.5 border-b border-slate-200 pb-1">Datos del Proveedor</h3>
                            <p className="text-xs font-black text-slate-900 uppercase">{ordenData.proveedor.nombre}</p>
                            <p className="text-[11px] text-slate-700">RUC: <span className="font-bold">{ordenData.proveedor.ruc}</span></p>
                            <p className="text-[10px] text-slate-500">{ordenData.proveedor.direccion}</p>
                            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-200 mt-4">
                                <div><p className="text-[8px] font-bold text-slate-400">Contacto</p><p className="text-[10px] font-bold">{ordenData.proveedor.telefono || '---'}</p></div>
                                <div><p className="text-[8px] font-bold text-slate-400">Cuenta</p><p className="text-[10px] font-bold">{ordenData.proveedor.cuenta || '---'}</p></div>
                            </div>
                        </div>
                        <div className="p-5 bg-white">
                            <h3 className="text-[10px] font-black text-[#800000] uppercase mb-2.5 border-b border-slate-200 pb-1">Detalles de Entrega</h3>
                            <div className="flex justify-between border-b border-slate-100 pb-1"><span className="text-[10px] font-bold text-slate-400">Moneda</span><span className="text-[11px] font-bold">Soles (S/)</span></div>
                            <div className="flex justify-between border-b border-slate-100 pb-1 mt-2">
                                <span className="text-[10px] font-bold text-slate-400">Fecha Límite</span>
                                <input type="date" value={ordenData.fechaEntrega || ''} onChange={e => setOrdenData({ ...ordenData, fechaEntrega: e.target.value })} className="bg-transparent text-[11px] font-bold text-right" />
                            </div>
                            <div className="flex justify-between mt-2"><span className="text-[10px] font-bold text-slate-400">Forma de Pago</span><span className="text-[11px] font-bold">{ordenData.proveedor.cuenta ? 'Transferencia' : 'A convenir'}</span></div>
                        </div>
                    </div>

                    {/* Tabla de Items */}
                    <div className="mt-8 border border-slate-300 bg-white overflow-hidden rounded-sm">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-800 text-white">
                                    <th className="px-3 py-2.5 text-[9px] font-black uppercase text-center w-10">Item</th>
                                    <th className="px-4 py-2.5 text-[9px] font-black uppercase text-left">Descripción</th>
                                    <th className="px-3 py-2.5 text-[9px] font-black uppercase text-center w-16">Cant.</th>
                                    <th className="px-4 py-2.5 text-[9px] font-black uppercase text-right w-24">P. Unitario</th>
                                    <th className="px-4 py-2.5 text-[9px] font-black uppercase text-right w-24">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {ordenData.items.map((item, idx) => (
                                    <tr key={item.id}>
                                        <td className="px-3 py-3 text-center text-[10px] font-bold text-slate-400">{idx+1}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-[11px] font-bold text-slate-800 uppercase">{item.descripcion}</p>
                                            <div className="flex gap-4 mt-1.5 text-[8px] text-slate-400 font-bold uppercase">
                                                <span>CC: <span className="text-slate-600">{item.centro_costo || "N/A"}</span></span>
                                                <span>DPTO: <span className="text-slate-600">{item.departamento || "N/A"}</span></span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 text-center text-[11px] font-black">{item.cantidad}</td>
                                        <td className="px-4 py-3 text-right text-[11px] font-medium">S/ {item.precio.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right text-[11px] font-black">S/ {(item.cantidad * item.precio).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Observaciones y Totales */}
                    <div className="mt-6 grid grid-cols-12 gap-6 items-start">
                        <div className="col-span-7 space-y-6">
                            <div className="border border-slate-300 p-4 bg-slate-50/50 rounded-sm">
                                <p className="text-[9px] font-black text-slate-800 uppercase mb-1.5">Observaciones y Condiciones</p>
                                <p className="text-[10px] text-slate-600 whitespace-pre-wrap">{ordenData.condiciones || "Sin observaciones."}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div className="text-center">
                                    <div className="h-[60px] flex items-end justify-center mb-1.5">
                                        {ordenData?.firmas?.tesoreria?.firma && <img src={API + ordenData.firmas.tesoreria.firma} className="max-h-[100px] object-contain mix-blend-multiply" />}
                                    </div>
                                    <div className="border-t border-slate-400 w-full mb-1"></div>
                                    <p className="text-[10px] font-black">{ordenData?.firmas?.tesoreria?.nombre || "Sin Responsable"}</p>
                                    <p className="text-[8px] font-bold text-slate-400">Jefe de Tesorería</p>
                                </div>
                                <div className="text-center">
                                    <div className="h-[60px] flex items-end justify-center mb-1.5">
                                        {ordenData?.firmas?.administracion?.firma && <img src={API + ordenData.firmas.administracion.firma} className="max-h-[100px] object-contain mix-blend-multiply" />}
                                    </div>
                                    <div className="border-t border-slate-400 w-full mb-1"></div>
                                    <p className="text-[10px] font-black">{ordenData?.firmas?.administracion?.nombre || "Sin Responsable"}</p>
                                    <p className="text-[8px] font-bold text-slate-400">Jefe de Administración</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-5">
                            <div className="border border-slate-400 rounded-sm overflow-hidden bg-white">
                                <div className="flex justify-between px-4 py-2.5 border-b"><span className="text-[9px] font-bold text-slate-400">Sub-Total</span><span className="text-xs font-bold">S/ {subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between px-4 py-2.5 border-b"><span className="text-[9px] font-bold text-slate-400">IGV (18%)</span><span className="text-xs font-bold">S/ {igv.toFixed(2)}</span></div>
                                <div className="flex justify-between px-4 py-3.5 bg-slate-800 text-white"><span className="text-[10px] font-black uppercase">Total Orden</span><span className="text-xl font-black">S/ {total.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto pt-8 text-center border-t border-slate-100">
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.25em]">Documento de Uso Interno - {ordenData.empresa.nombre}</p>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #800000; }
                @media print {
                    body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print\\:hidden { display: none !important; }
                    .print\\:p-0 { padding: 0 !important; }
                    .print\\:bg-white { background-color: #ffffff !important; }
                    .print\\:w-full { width: 100% !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .bg-slate-800 { background-color: #1e293b !important; -webkit-print-color-adjust: exact; }
                    #orden-hoja { width: 210mm; height: 297mm; padding: 14mm !important; margin: 0 auto; box-sizing: border-box; page-break-inside: avoid; }
                }
            `}</style>
        </div>
    );
};

export default OrdenCompra;