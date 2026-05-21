import React, { useState, useEffect } from 'react';
import {
    Plus, Building2, MapPin, Calendar, MessageCircle, Edit3, Trash2, Search, X, Briefcase, AlertCircle,
    Filter, Phone, ShieldCheck, Globe, MoreVertical
} from 'lucide-react';
import { API_BASE } from "../../config/api";

const API = API_BASE;

const Proveedores = ({ user = { rol: 'LOGISTICA', nombre: 'Admin' } }) => {
    // --- ESTADO LOCAL (SIMULACIÓN DE BD) ---
    const [activeTab, setActiveTab] = useState('Directorio');
    const [searchTerm, setSearchTerm] = useState("");
    const [showProvModal, setShowProvModal] = useState(false);
    const [editingProv, setEditingProv] = useState(null);
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingRuc, setLoadingRuc] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        ruc: "",
        sede: "Piura",
        especialidad: "",
        direccion: "",
        credito: "Contado",
        vigencia: "",
        telefono: "",
        email: "",
        medio_pago: "Transferencia",
        detalle_pago: ""
    });

    // --- FILTRADO EN TIEMPO REAL ---
    const proveedoresFiltrados = proveedores.filter(p => {
        const nombre = (p.nombre || "").toLowerCase();
        const ruc = (p.ruc || "");
        const especialidad = (p.especialidad || "").toLowerCase();
        const term = searchTerm.toLowerCase();

        return nombre.includes(term) || ruc.includes(term) || especialidad.includes(term);
    });

    useEffect(() => {
        fetchProveedores();
    }, []);

    const fetchProveedores = async () => {
        setLoading(true);
        try {
            const res = await fetch(API + "proveedores.php");
            const json = await res.json();

            if (json.success) {
                setProveedores(json.data);
            } else {
                setError(json.message);
            }
        } catch (err) {
            setError("Error de conexión");
        }
        setLoading(false);
    };

    const validar = () => {
        if (!formData.nombre) return "Nombre requerido";
        if (!/^\d{11}$/.test(formData.ruc)) return "RUC inválido";

        if (formData.telefono && !/^\d{9}$/.test(formData.telefono))
            return "Teléfono inválido";

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
            return "Email inválido";

        if (!formData.detalle_pago || formData.detalle_pago.trim() === "")
            return "Ingrese número de cuenta";

        return null;
    };

    // --- MANEJADORES ---
    const handleOpenProvModal = (prov = null) => {
        if (prov) {
            setEditingProv(prov);
            setFormData({
                nombre: prov?.nombre || "",
                ruc: prov?.ruc || "",
                sede: prov?.sede || "Piura",
                especialidad: prov?.especialidad || "",
                direccion: prov?.direccion || "",
                credito: prov?.credito || "Contado",
                vigencia: prov?.vigencia || "",
                telefono: prov?.telefono || "",
                email: prov?.email || "",
                medio_pago: prov?.medio_pago || "Transferencia",
                detalle_pago: prov?.detalle_pago || ""
            });
        } else {
            setEditingProv(null);
            setFormData({
                nombre: "",
                ruc: "",
                sede: "Piura",
                especialidad: "",
                direccion: "",
                credito: "Contado",
                vigencia: "",
                telefono: "",
                email: "",
                medio_pago: "Transferencia",
                detalle_pago: ""
            });
        }
        setShowProvModal(true);
    };
    const handleTelefonoChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 9);
        setFormData({ ...formData, telefono: value });
    };

    const saveProveedor = async (e) => {
        e.preventDefault();

        const error = validar();
        if (error) {
            alert(error);
            return;
        }

        try {
            const url = editingProv
                ? API + `proveedores.php?id=${editingProv.id}`
                : API + "proveedores.php";

            const method = editingProv ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const json = await res.json();

            if (json.success) {
                alert("Proveedor registrado ✅");
                fetchProveedores();
                setShowProvModal(false);
            } else {
                alert(json.message);
            }

        } catch {
            alert("Error de conexión");
        }
    };

    const deleteProveedor = async (id) => {
        if (!confirm("¿Seguro que desea eliminar?")) return;

        try {
            const res = await fetch(API + `proveedores.php?id=${id}`, {
                method: "DELETE"
            });

            const json = await res.json();

            if (json.success) {
                fetchProveedores();
            } else {
                alert(json.message);
            }

        } catch {
            alert("Error al eliminar");
        }
    };
    const rolesPermitidos = ['LOGISTICA', 'TIC', 'ADMINISTRACION'];
    const tienePermiso = rolesPermitidos.includes(user?.rol);

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
            {loading && (
                <div className="p-4 text-center text-sm font-bold text-gray-400">
                    Cargando proveedores...
                </div>
            )}

            {error && (
                <div className="p-4 text-center text-red-500 text-sm font-bold">
                    {error}
                </div>
            )}
            {activeTab === 'Directorio' && tienePermiso ? (
                <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">

                    {/* HEADER SECCIÓN */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-[#800000]/10 text-[#800000] p-1.5 rounded-lg">
                                    <Briefcase size={20} />
                                </span>
                                <h3 className="text-2xl font-black tracking-tight uppercase"> Directorio de Proveedores</h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar por RUC o Nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#800000]/20 transition-all"
                                />
                            </div>
                            {['LOGISTICA', 'TIC'].includes(user?.rol) && (
                                <button
                                    onClick={() => handleOpenProvModal()}
                                    className="bg-[#800000] text-white px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg shadow-red-900/20 hover:bg-[#600000] active:scale-95 transition-all whitespace-nowrap"
                                >
                                    <Plus size={16} strokeWidth={3} /> NUEVO REGISTRO
                                </button>
                            )}
                        </div>
                    </div>

                    {/* TABLA DE DATOS */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entidad Comercial</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría / Rubro</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Localización</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Crédito</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estatus</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Gestión</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {proveedoresFiltrados.length > 0 ? proveedoresFiltrados.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/80 transition-all group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#800000] group-hover:text-white transition-all duration-300 shadow-sm">
                                                        <Building2 size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 text-sm uppercase leading-tight mb-1">{p.nombre}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-slate-400 font-bold tracking-wider">RUC: {p.ruc}</span>
                                                            {p.email && <span className="text-[10px] text-slate-300">•</span>}
                                                            <span className="text-[10px] text-slate-400 font-medium lowercase italic">{p.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-[#800000] uppercase tracking-tighter bg-red-50 px-2.5 py-1 rounded-lg border border-red-100/50">
                                                    <ShieldCheck size={10} /> {p.especialidad}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-slate-500">
                                                        <MapPin size={12} className="text-[#800000]" />
                                                        <span className="text-[10px] font-bold uppercase truncate max-w-[180px]">{p.direccion}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-3.5">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${p.sede === 'Piura' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase">{p.sede}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${p.credito === 'Contado'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    }`}>
                                                    {p.credito}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                                                    <Calendar size={13} className="text-slate-300" />
                                                    <span>Vence: {p.vigencia}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    {p.telefono && (
                                                        <button
                                                            onClick={() => {
                                                                const mensaje = `Estimado(a) ${p.nombre}, le saludamos de parte de CETURGH Perú. Nos comunicamos con usted para realizar una consulta comercial. Quedamos atentos a su respuesta. ¡Embajadores de lo nuestro!`;
                                                                window.open(`https://wa.me/51${p.telefono}?text=${encodeURIComponent(mensaje)}`, "_blank");
                                                            }}
                                                            className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                            title="WhatsApp Business"
                                                        >
                                                            <MessageCircle size={18} />
                                                        </button>
                                                    )}
                                                    {user?.rol === 'LOGISTICA' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleOpenProvModal(p)}
                                                                className="p-2.5 text-slate-400 hover:text-[#800000] hover:bg-red-50 rounded-xl transition-all"
                                                            >
                                                                <Edit3 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteProveedor(p.id)}
                                                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="py-20 text-center">
                                                <div className="flex flex-col items-center opacity-20">
                                                    <Search size={64} className="mb-4" />
                                                    <p className="text-xl font-black uppercase tracking-widest">Sin resultados</p>
                                                    <p className="text-sm">Intenta con otro término de búsqueda</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-300">
                    <AlertCircle size={80} strokeWidth={1} className="mb-4 opacity-20" />
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Acceso Denegado</h2>
                    <p className="font-bold text-sm">No cuentas con los privilegios para gestionar el directorio maestro.</p>
                </div>
            )}

            {showProvModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="bg-[#800000] p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Briefcase size={24} className="text-[#D4AF37]" />
                                <h3 className="font-black text-xl uppercase tracking-tight">
                                    {editingProv ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                                </h3>
                            </div>
                            <button onClick={() => setShowProvModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={saveProveedor} className="p-8 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Razón Social</label>
                                <input
                                    required
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-[#800000] focus:bg-white transition-all outline-none font-bold text-sm"
                                    placeholder="Ej: Distribuidora Piura SAC"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">RUC</label>
                                    <input
                                        required
                                        maxLength={11}
                                        value={formData.ruc}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setFormData({ ...formData, ruc: value });
                                        }}
                                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl"
                                        placeholder="11 dígitos"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ciudad</label>
                                    <select
                                        required
                                        value={formData.sede}
                                        onChange={(e) => setFormData({ ...formData, sede: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-[#800000] outline-none font-bold text-sm"
                                    >
                                        <option value="">Ciudad...</option>
                                        <option value="Piura">Piura</option>
                                        <option value="Sullana">Sullana</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rubro / Especialidad</label>
                                <input
                                    required
                                    value={formData.especialidad}
                                    onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-[#800000] outline-none font-bold text-sm"
                                    placeholder="Ej: Electricidad, Tecnología, Útiles..."
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dirección Comercial</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <input
                                        value={formData.direccion}
                                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-[#800000] outline-none font-bold text-sm"
                                        placeholder="Calle, Avenida, Mz y Lote..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo de Crédito</label>
                                    <select
                                        value={formData.credito}
                                        onChange={(e) => setFormData({ ...formData, credito: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-[#800000] outline-none font-bold text-sm"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="Contado">Contado</option>
                                        <option value="7 días">7 días</option>
                                        <option value="15 días">15 días</option>
                                        <option value="30 días">30 días</option>
                                        <option value="45 días">45 días</option>
                                        <option value="60 días">60 días</option>
                                        <option value="+60 días">+60 días</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vigencia Contrato</label>
                                    <input
                                        type="date"
                                        value={formData.vigencia}
                                        onChange={(e) => setFormData({ ...formData, vigencia: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-[#800000] outline-none font-bold text-sm"
                                    />
                                </div>
                            </div>

                            {/* CONTACTO */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Teléfono / Celular
                                    </label>
                                    <input
                                        value={formData.telefono}
                                        onChange={handleTelefonoChange}
                                        maxLength={9}
                                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-[#800000] outline-none font-bold text-sm"
                                        placeholder="Solo números"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-[#800000] outline-none font-bold text-sm"
                                        placeholder="correo@empresa.com"
                                    />
                                </div>
                            </div>

                            {/* INPUT CUENTA BANCARIA */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Número de Cuenta Bancaria
                                </label>

                                <input
                                    value={formData.detalle_pago}
                                    onChange={(e) => {
                                        // Permitir números y guiones
                                        let value = e.target.value.replace(/[^0-9-]/g, "");

                                        setFormData({
                                            ...formData,
                                            medio_pago: "Transferencia",
                                            detalle_pago: value
                                        });
                                    }}
                                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-[#800000] outline-none font-bold text-sm"
                                    placeholder="Ej: 475-03598471-0-76"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowProvModal(false)} className="flex-1 bg-white border border-gray-200 text-gray-500 py-4 rounded-2xl font-black text-xs hover:bg-gray-50 transition-all uppercase">
                                    Cancelar
                                </button>
                                <button type="submit" className="flex-1 bg-[#800000] text-white py-4 rounded-2xl font-black text-xs hover:bg-red-900 transition-all shadow-xl shadow-red-900/20 uppercase">
                                    {editingProv ? 'Actualizar' : 'Registrar'}
                                </button>
                            </div>
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

export default Proveedores;