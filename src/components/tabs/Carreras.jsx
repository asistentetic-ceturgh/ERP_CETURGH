import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    Plus,
    Search,
    Edit3,
    TrendingUp,
    Target,
    AlertCircle,
    Save,
    X,
    ChevronRight,
    Filter
} from 'lucide-react';
import { API_BASE } from "../../config/api";

const API = API_BASE;

const PresupuestosCarreras = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCarrera, setEditingCarrera] = useState(null);
    const [empresas, setEmpresas] = useState([]);
    const [sedes, setSedes] = useState([]);

    const [empresaId, setEmpresaId] = useState("");
    const [sedeId, setSedeId] = useState("");

    const [carreras, setCarreras] = useState([]);

    const openModal = async (carrera = null) => {

        setEditingCarrera(carrera);

        if (carrera) {

            // cargar empresa y sede actuales
            setEmpresaId(carrera.empresa_id || "");
            setSedeId(carrera.sede_id || "");

            // cargar sedes de la empresa
            if (carrera.empresa_id) {

                try {

                    const res = await fetch(
                        API + `sedes.php?empresa_id=${carrera.empresa_id}`
                    );

                    const data = await res.json();

                    if (data.ok) {
                        setSedes(data.data);
                    }

                } catch (err) {
                    console.error(err);
                }
            }

        } else {

            // nuevo registro
            setEmpresaId("");
            setSedeId("");
            setSedes([]);
        }

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingCarrera(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetch(API + "presupuestos_carreras.php")
            .then(res => res.json())
            .then(data => setCarreras(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {

        fetch(API + "empresas.php")
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setEmpresas(data.data);
                }
            });

    }, []);

    const handleEmpresaChange = async (id) => {

        setEmpresaId(id);
        setSedeId("");

        try {

            const res = await fetch(
                API + `sedes.php?empresa_id=${id}`
            );

            const data = await res.json();

            if (data.ok) {
                setSedes(data.data);
            }

        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {

        try {

            const payload = {
                carrera_id: editingCarrera?.id || 0,
                empresa_id: empresaId || null,
                sede_id: sedeId || null,
                presupuesto: editingCarrera?.presupuesto || 0,
                estado: editingCarrera?.estado || 'ACTIVO'
            };

            if (!editingCarrera?.id) {
                alert("Seleccione una carrera");
                return;
            }

            const res = await fetch(API + "presupuestos_carreras.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.message || "Error guardando");
                console.log(data);
                return;
            }

            const nuevaLista = carreras.map(c =>
                c.id === editingCarrera.id
                    ? {
                        ...c,
                        presupuesto: editingCarrera.presupuesto
                    }
                    : c
            );

            setCarreras(nuevaLista);

            closeModal();

        } catch (error) {
            console.error(error);
        }
    };

    const totalAsignado = carreras.reduce(
        (acc, c) => acc + Number(c.presupuesto || 0),
        0
    );

    const totalEjecutado = carreras.reduce(
        (acc, c) => acc + Number(c.ejecutado || 0),
        0
    );
    const alertas = carreras.filter(
        c => Number(c.ejecutado) > Number(c.presupuesto)
    ).length;

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header de la sección */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <DollarSign className="text-[#800000]" />
                        PRESUPUESTO POR CARRERAS
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Gestión y control de techos presupuestales por programa académico.</p>
                </div>
            </div>

            {/* Grid de Resumen Rápido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Asignado</p>
                            <h3 className="text-2xl font-black text-slate-800 mt-1">S/ {totalAsignado.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Target size={20} /></div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Ejecutado</p>
                            <h3 className="text-2xl font-black text-slate-800 mt-1">S/ {totalEjecutado.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600"><TrendingUp size={20} /></div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alertas de Exceso</p>
                            <h3 className="text-2xl font-black text-red-600 mt-1">{alertas} Carreras</h3>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertCircle size={20} /></div>
                    </div>
                </div>
            </div>

            {/* Tabla de Datos */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Carrera / Programa</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Sede</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Presupuesto</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ejecutado</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado Consumo</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {carreras.map((c) => {
                            const porcentaje = (c.ejecutado / c.presupuesto) * 100;
                            const isExceeded = porcentaje > 100;

                            return (
                                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-700 text-sm">{c.nombre}</div>
                                        <div className="text-[10px] text-slate-400 font-medium">ID: {String(c.id).padStart(4, '0')}</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 font-semibold">{c.sede}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700 text-right">
                                        S/{c.presupuesto.toLocaleString()}
                                    </td>
                                    <td className={`px-6 py-4 text-sm font-bold text-right ${isExceeded ? 'text-red-500' : 'text-slate-700'}`}>
                                        S/{c.ejecutado.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                                            <div
                                                className={`h-full transition-all duration-1000 ${isExceeded ? 'bg-red-500' : 'bg-[#D4AF37]'}`}
                                                style={{ width: `${Math.min(porcentaje, 100)}%` }}
                                            />
                                        </div>
                                        <span className={`text-[10px] font-bold mt-1 block ${isExceeded ? 'text-red-500' : 'text-slate-400'}`}>
                                            {porcentaje.toFixed(1)}% utilizado
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => openModal(c)}
                                                className="p-2 text-slate-400 hover:text-[#800000] hover:bg-white rounded-lg transition-all shadow-sm"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal de Añadir/Editar Presupuesto */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-[#800000] p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">{editingCarrera ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</h3>
                                <p className="text-white/60 text-xs mt-0.5">Complete la información financiera de la carrera.</p>
                            </div>
                            <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-5">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Nombre de la Carrera</label>
                                <input
                                    type="text"
                                    defaultValue={editingCarrera?.nombre}
                                    placeholder="Ej. Ingeniería Industrial"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5 ml-1">
                                        Empresa
                                    </label>

                                    <select
                                        value={empresaId}
                                        onChange={(e) => handleEmpresaChange(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                    >

                                        <option value="">Seleccione</option>

                                        {empresas.map((emp) => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.nombre}
                                            </option>
                                        ))}

                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5 ml-1">
                                        Sede
                                    </label>

                                    <select
                                        value={sedeId}
                                        onChange={(e) => setSedeId(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                    >

                                        <option value="">Seleccione</option>

                                        {sedes.map((sede) => (
                                            <option key={sede.id} value={sede.id}>
                                                {sede.nombre}
                                            </option>
                                        ))}

                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Presupuesto Anual (S/)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="number"
                                        value={editingCarrera?.presupuesto || ""}
                                        onChange={(e) =>
                                            setEditingCarrera({
                                                ...editingCarrera,
                                                presupuesto: e.target.value
                                            })
                                        }
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#800000]/20 outline-none font-bold text-slate-700"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-500 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-6 py-3 bg-[#D4AF37] text-[#800000] font-bold text-sm rounded-xl shadow-lg shadow-[#D4AF37]/20 hover:bg-[#C19A2E] transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    GUARDAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PresupuestosCarreras;