import React, { useEffect, useState } from "react";
import { API_BASE } from "../../config/api";
import {ChevronDown, Package, Plus
} from 'lucide-react';
const API = API_BASE + "pendientes.php";

const Pendientes = () => {
    const [items, setItems] = useState([]);

    const fetchPendientes = async () => {
        const res = await fetch(API + "?accion=pendientes");
        const json = await res.json();
        if (json.success) setItems(json.data);
    };

    useEffect(() => {
        fetchPendientes();
    }, []);

    const actualizarTipo = (id, tipo) => {
        setItems(prev =>
            prev.map(i => (i.id === id ? { ...i, tipo_inventario: tipo } : i))
        );
    };

    const ingresarInventario = async (item) => {
        if (!item.tipo_inventario) {
            alert("Selecciona un tipo");
            return;
        }

        await fetch(API + "?accion=ingresar_desde_item", {
            method: "POST",
            body: new URLSearchParams({
                item_id: item.id,
                tipo: item.tipo_inventario
            })
        });

        fetchPendientes(); // refrescar
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Header con estilo */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <span className="w-2 h-6 bg-[#800000] rounded-full"></span>
                        Pendientes de Inventario
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 ml-4">
                        Asigne el tipo de categoría para procesar los ingresos.
                    </p>
                </div>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                    {items.length} Items por procesar
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</th>
                            <th className="text-center py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cant.</th>
                            <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categorización</th>
                            <th className="text-right py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Acción</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-700 text-sm group-hover:text-[#800000] transition-colors">
                                            {item.descripcion}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">ID: #{item.id.toString().padStart(4, '0')}</span>
                                    </div>
                                </td>

                                <td className="py-4 px-4 text-center">
                                    <span className="inline-flex items-center justify-center bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-black text-xs min-w-[40px]">
                                        {item.cantidad}
                                    </span>
                                </td>

                                <td className="py-4 px-4">
                                    <div className="relative group/select">
                                        <select
                                            value={item.tipo_inventario || ""}
                                            onChange={(e) => actualizarTipo(item.id, e.target.value)}
                                            className={`
                      w-full pl-3 pr-8 py-2 text-xs font-bold rounded-xl border-2 transition-all appearance-none cursor-pointer outline-none
                      ${item.tipo_inventario
                                                    ? "bg-white border-slate-200 text-slate-700 focus:border-[#800000]"
                                                    : "bg-amber-50 border-amber-100 text-amber-600 focus:border-amber-400"
                                                }
                    `}
                                        >
                                            <option value="">Definir Tipo...</option>
                                            <option value="MENAJE">Menaje</option>
                                            <option value="INSUMO">Insumo</option>
                                            <option value="MOVIL">Móvil</option>
                                            <option value="OFICINA">Oficina</option>
                                            <option value="HERRAMIENTA">Herramienta</option>
                                            <option value="LOGISTICA">Logística</option>
                                            <option value="DATA_CENTER">Data Center</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                </td>

                                <td className="py-4 px-6 text-right">
                                    <button
                                        onClick={() => ingresarInventario(item)}
                                        disabled={!item.tipo_inventario}
                                        className={`
                    group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[11px] uppercase tracking-tighter transition-all active:scale-95
                    ${item.tipo_inventario
                                                ? "bg-[#800000] text-white shadow-lg shadow-[#800000]/20 hover:bg-[#600000] hover:-translate-y-0.5"
                                                : "bg-slate-100 text-slate-300 cursor-not-allowed"
                                            }
                  `}
                                    >
                                        <Plus size={14} />
                                        Ingresar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {items.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                        <div className="bg-slate-100 p-4 rounded-full mb-3">
                            <Package size={32} className="opacity-20" />
                        </div>
                        <p className="text-sm font-bold">No hay pendientes en la lista</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pendientes;