import React, { useEffect, useState } from "react";
import { Package, ClipboardCheck, Search } from "lucide-react";

import { API_BASE } from "../../../config/api";

const API = API_BASE;

const ControlInsumos = () => {
  const [requerimientos, setRequerimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================
  // FETCH DATA
  // =====================
  const fetchReqs = async () => {
    try {
      setLoading(true);

      const res = await fetch(API + "requerimientos.php");
      const data = await res.json();

      // 🔥 PROTECCIÓN
      setRequerimientos(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Error cargando requerimientos:", error);
      setRequerimientos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReqs();
  }, []);

  // =====================
  // INSUMOS (SAFE)
  // =====================
  const insumosItems = (requerimientos || [])
    .flatMap(r => r?.items || [])
    .filter(it => Number(it?.esInsumo) === 1);

  // =====================
  // UPDATE LOCAL STATE
  // =====================
  const updateItemLocal = (id, cambios) => {
    setRequerimientos(prev =>
      prev.map(r => ({
        ...r,
        items: (r.items || []).map(item =>
          item.id === id ? { ...item, ...cambios } : item
        )
      }))
    );
  };

  // =====================
  // GUARDAR BACKEND
  // =====================
  const guardarItem = async (it) => {
    if (
      (it.estadoInsumo === "Observado" || it.estadoInsumo === "Rechazado") &&
      !it.motivo
    ) {
      return alert("Debe ingresar un motivo ⚠️");
    }

    try {
      const res = await fetch(API + "requerimientos.php", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: it.id,
          estado_insumo: it.estadoInsumo,
          motivo: it.motivo || null
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Guardado correctamente ✅");
      } else {
        alert("Error al guardar ❌");
      }

    } catch (err) {
      console.error(err);
      alert("Error de conexión ⚠️");
    }
  };

  // =====================
  // LOADING
  // =====================
  if (loading) {
    return (
      <div className="p-10 text-center text-slate-400 font-bold">
        Cargando insumos...
      </div>
    );
  }

  // =====================
  // UI
  // =====================
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">

      <h2 className="text-lg font-black text-[#800000] mb-4">
        Control de Insumos
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">

          <thead>
            <tr className="bg-[#800000] text-white text-[10px] uppercase">
              <th className="px-6 py-4">Insumo</th>
              <th className="px-6 py-4 text-center">Cantidad</th>
              <th className="px-6 py-4">Centro de Costo</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>

          <tbody className="text-xs divide-y">

            {insumosItems.length > 0 ? (
              insumosItems.map((it) => (
                <tr key={it.id} className="hover:bg-slate-50">

                  {/* DESCRIPCIÓN */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold uppercase">
                        {it.descripcion || "SIN DESCRIPCIÓN"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {it.proveedor || "Sin proveedor"}
                      </span>
                    </div>
                  </td>

                  {/* CANTIDAD */}
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-slate-900 text-white rounded">
                      {it.cantidad || 0} {it.unidad || ""}
                    </span>
                  </td>

                  {/* CENTRO COSTO */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded">
                      <Search size={12} />
                      {it.centroCodigo || "CC-PENDIENTE"}
                    </div>
                  </td>

                  {/* ESTADO */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">

                      <select
                        value={it.estadoInsumo || "Pendiente"}
                        onChange={(e) => {
                          const val = e.target.value;

                          updateItemLocal(it.id, {
                            estadoInsumo: val,
                            motivo:
                              val === "Observado" || val === "Rechazado"
                                ? it.motivo || ""
                                : ""
                          });
                        }}
                        className="text-xs border rounded px-2 py-1"
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Recibido">Recibido</option>
                        <option value="Conforme">Conforme</option>
                        <option value="Observado">Observado</option>
                        <option value="Rechazado">Rechazado</option>
                      </select>

                      {(it.estadoInsumo === "Observado" ||
                        it.estadoInsumo === "Rechazado") && (
                        <textarea
                          value={it.motivo || ""}
                          onChange={(e) =>
                            updateItemLocal(it.id, {
                              motivo: e.target.value
                            })
                          }
                          placeholder="Motivo..."
                          className="text-xs border rounded p-1"
                        />
                      )}
                    </div>
                  </td>

                  {/* GUARDAR */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => guardarItem(it)}
                      className="p-2 text-[#800000] hover:bg-slate-100 rounded"
                    >
                      <ClipboardCheck size={18} />
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-10 text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Package size={40} />
                    No hay insumos registrados
                  </div>
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ControlInsumos;