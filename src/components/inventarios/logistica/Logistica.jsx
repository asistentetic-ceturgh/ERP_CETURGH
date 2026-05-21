import React, { useState, useEffect } from "react";
import {
  Truck,
  Tag,
  AlertTriangle,
  MapPin,
  Settings,
  ShieldAlert,
  Droplets,
  Hammer,
  ClipboardCheck,
  Plus,
  Search,
  Package,
  X
} from "lucide-react";
import { API_BASE } from "../../../config/api";

const API = API_BASE + "logistica.php";

const initialForm = {
  codigo: "",
  nombre: "",
  marca: "",
  categoria: "",
  subcategoria: "",
  unidad: "",
  stock_actual: 0,
  stock_min: 0,
};

const Logistica = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockModal, setStockModal] = useState(null);
  const [cantidadStock, setCantidadStock] = useState(0);
  const [editModal, setEditModal] = useState(null);

  const moverStock = async (tipo) => {
    await fetch(API + "?accion=mover_stock", {
      method: "POST",
      body: new URLSearchParams({
        articulo_id: stockModal.id,
        cantidad: cantidadStock,
        tipo: tipo
      })
    });

    setStockModal(null);
    fetchData();
  };

  const fetchData = async () => {
    try {
      const res = await fetch(API);
      const json = await res.json();
      if (json.success) setData(json.data);
      else setData([]);
    } catch (err) {
      setData([]);
    }
  };

  const abrirStock = (item) => {
    setStockModal(item);
    setCantidadStock(0);
  };

  const agregarStock = async () => {
    await fetch(API + "?accion=agregar_stock", {
      method: "POST",
      body: new URLSearchParams({
        articulo_id: stockModal.id,
        cantidad: cantidadStock
      })
    });

    setStockModal(null);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const procesarItem = (item) => {
    const stock = Number(item.stock_actual);
    const min = Number(item.stock_min);
    const sinStock = stock === 0;
    const bajoStock = stock <= min && stock > 0;

    return {
      ...item,
      status: sinStock ? "danger" : bajoStock ? "warning" : "success",
      label: sinStock ? "SIN STOCK" : bajoStock ? "REABASTECER" : "DISPONIBLE"
    };
  };

  const processedData = (Array.isArray(data) ? data : [])
    .map(procesarItem)
    .filter(item => item.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  const guardarArticulo = async () => {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        setForm(initialForm);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryIcon = (cat) => {
    const props = { size: 14, className: "text-gray-400" };
    switch (cat) {
      case "Limpieza": return <Droplets {...props} />;
      case "Ferretería": return <Hammer {...props} />;
      case "Seguridad": return <ShieldAlert {...props} />;
      default: return <Settings {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto p-4 md:p-8">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="bg-[#800000] p-2 rounded-lg text-white">
                <Truck size={28} />
              </div>
              Control Logístico
            </h2>
            <p className="text-slate-500 mt-1 ml-1">Gestión de inventarios y suministros</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar artículo..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000] focus:outline-none w-full md:w-64 transition-all shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#800000] hover:bg-[#600000] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-900/10 active:scale-95"
            >
              <Plus size={20} /> Nuevo
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Package /></div>
            <div><p className="text-sm text-slate-500 font-medium">Total Artículos</p><p className="text-2xl font-bold">{data.length}</p></div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600"><AlertTriangle /></div>
            <div><p className="text-sm text-slate-500 font-medium">Bajo Stock</p><p className="text-2xl font-bold">{data.filter(i => procesarItem(i).status === "warning").length}</p></div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-red-50 p-3 rounded-xl text-red-600"><ShieldAlert /></div>
            <div><p className="text-sm text-slate-500 font-medium">Agotados</p><p className="text-2xl font-bold">{data.filter(i => procesarItem(i).status === "danger").length}</p></div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Producto</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Detalles</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Ubicación</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Cantidades</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Estado</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {processedData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <Package size={48} className="mb-2" />
                      <p className="font-medium">No se encontraron artículos</p>
                    </div>
                  </td>
                </tr>
              ) : (
                processedData.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{item.codigo}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {getCategoryIcon(item.categoria)}
                        <span className="text-xs font-medium text-slate-400 uppercase">{item.subcategoria}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-700">{item.nombre}</div>
                      <div className="text-xs text-slate-400">Marca: {item.marca}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <MapPin size={14} className="text-[#800000]" /> {item.ubicacion || "N/A"}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                        <ClipboardCheck size={12} /> {item.responsable || "Sin asignar"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-lg font-bold text-slate-800">{item.stock_actual}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Min: {item.stock_min}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`
                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide
                        ${item.status === 'danger' ? 'bg-red-100 text-red-700' :
                          item.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                            'bg-emerald-100 text-emerald-700'}
                      `}>
                        {item.status !== 'success' && <AlertTriangle size={12} />}
                        {item.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => abrirStock(item)}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold"
                      >
                        + Stock
                      </button>

                      <button
                        onClick={() => setEditModal(item)}
                        className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-lg font-bold ml-2"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DESIGN */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#800000] p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <Package />
                <h3 className="text-xl font-bold">Nuevo Artículo</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(initialForm).map((key) => (
                  <div key={key} className={key === "nombre" ? "col-span-2" : "col-span-1"}>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">{key.replace('_', ' ')}</label>
                    <input
                      placeholder={`Ej: ${key}...`}
                      type={key.includes("stock") ? "number" : "text"}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-[#800000] focus:bg-white focus:outline-none transition-all"
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarArticulo}
                  className="flex-[2] bg-[#800000] hover:bg-[#600000] text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-red-900/20 transition-all active:scale-95"
                >
                  Guardar Artículo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {stockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="font-bold mb-3">Movimiento de Stock</h3>

            <input
              type="number"
              className="w-full border p-2 rounded"
              value={cantidadStock}
              onChange={(e) => setCantidadStock(e.target.value)}
              placeholder="Cantidad"
            />

            <div className="flex gap-2 mt-4">

              {/* ENTRADA */}
              <button
                onClick={() => moverStock("ENTRADA")}
                className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-bold"
              >
                + Entrada
              </button>

              {/* SALIDA */}
              <button
                onClick={() => moverStock("SALIDA")}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold"
              >
                - Salida
              </button>

            </div>

            <div className="mt-3 text-center">
              <button onClick={() => setStockModal(null)} className="text-sm text-gray-500">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[500px]">
            <h3 className="font-bold mb-4">Editar Artículo</h3>

            <div className="grid grid-cols-2 gap-3">

              <input
                placeholder="Código"
                value={editModal.codigo || ""}
                onChange={(e) => setEditModal({ ...editModal, codigo: e.target.value })}
              />

              <input
                placeholder="Nombre"
                value={editModal.nombre || ""}
                onChange={(e) => setEditModal({ ...editModal, nombre: e.target.value })}
              />

              <input
                placeholder="Marca"
                value={editModal.marca || ""}
                onChange={(e) => setEditModal({ ...editModal, marca: e.target.value })}
              />

              <input
                placeholder="Categoría"
                value={editModal.categoria || ""}
                onChange={(e) => setEditModal({ ...editModal, categoria: e.target.value })}
              />

              <input
                placeholder="Subcategoría"
                value={editModal.subcategoria || ""}
                onChange={(e) => setEditModal({ ...editModal, subcategoria: e.target.value })}
              />

              <input
                placeholder="Unidad"
                value={editModal.unidad || ""}
                onChange={(e) => setEditModal({ ...editModal, unidad: e.target.value })}
              />

              <input
                placeholder="Stock mínimo"
                type="number"
                value={editModal.stock_min || 0}
                onChange={(e) => setEditModal({ ...editModal, stock_min: e.target.value })}
              />

              <input
                placeholder="Ubicación"
                value={editModal.ubicacion || ""}
                onChange={(e) => setEditModal({ ...editModal, ubicacion: e.target.value })}
              />

              <input
                placeholder="Responsable"
                value={editModal.responsable || ""}
                onChange={(e) => setEditModal({ ...editModal, responsable: e.target.value })}
              />

            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditModal(null)}>Cancelar</button>

              <button
                onClick={async () => {
                  await fetch(API + "?accion=editar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editModal)
                  });

                  setEditModal(null);
                  fetchData();
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logistica;