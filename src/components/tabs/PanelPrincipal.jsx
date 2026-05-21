import React, { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Users,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Activity
} from "lucide-react";
import { API_BASE } from "../../config/api";

const API = API_BASE;

export default function PanelPrincipal({ user }) {
  const [data, setData] = useState({
    resumen: {},
    requerimientos: [],
    movilidad: [],
    usuarios: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.departamento_id) {
      setLoading(true);
      fetch(`${API}dashboard_departamento.php?id=${user.departamento_id}`)
        .then(res => res.json())
        .then(res => {
          setData(res);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error cargando dashboard:", err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-[#800000] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Cargando perfil de usuario...</p>
      </div>
    );
  }

  const presupuesto = data.resumen?.presupuesto || 0;
  const gastado = data.resumen?.gastado || 0;
  const disponible = presupuesto - gastado;
  const porcentajeGasto = presupuesto > 0 ? Math.min((gastado / presupuesto) * 100, 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4">
      
      {/* SECCIÓN DE BIENVENIDA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            ¡Bienvenido, {user.nombre?.split(' ')[0] || 'Compañero'}!
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Activity size={16} className="text-[#800000]" />
            Aquí tienes el resumen de <span className="font-bold text-slate-700">{user.departamento || 'tu departamento'}</span>
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-xl text-slate-600">
            <Calendar size={18} />
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Hoy</p>
            <p className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Presupuesto Asignado"
          value={presupuesto}
          icon={<DollarSign />}
          gradient="from-blue-600 to-indigo-700"
          trend="Total anual"
        />
        <MetricCard
          title="Gasto Acumulado"
          value={gastado}
          icon={<TrendingDown />}
          gradient="from-rose-500 to-red-700"
          trend={`${porcentajeGasto.toFixed(1)}% utilizado`}
        />
        <MetricCard
          title="Saldo Disponible"
          value={disponible}
          icon={<TrendingUp />}
          gradient="from-emerald-500 to-teal-700"
          trend="Disponible para uso"
        />
      </div>

      {/* ANALÍTICA DE GASTO */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Control de Ejecución</h2>
              <p className="text-sm text-slate-400">Progreso del gasto respecto al presupuesto total</p>
            </div>
            <div className="text-right">
              <span className={`text-3xl font-black ${porcentajeGasto > 90 ? 'text-rose-500' : 'text-indigo-600'}`}>
                {porcentajeGasto.toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${
                porcentajeGasto > 90 ? 'bg-rose-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${porcentajeGasto}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2 text-rose-500">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              Gastado: S/ {gastado.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              Total: S/ {presupuesto.toLocaleString()}
              <div className="w-3 h-3 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
        {/* Decoración de fondo */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
      </div>

      {/* GRID DE LISTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* REQUERIMIENTOS */}
        <ListContainer 
          title="Requerimientos Recientes" 
          icon={<Package className="text-blue-500" />}
          count={data.requerimientos?.length}
        >
          {data.requerimientos?.map((r, i) => (
            <ListItem 
              key={r.id || i}
              primary={r.codigo}
              secondary={r.fecha}
              amount={r.total}
              status={r.estado}
              statusColor={r.estado === 'PENDIENTE' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}
            />
          ))}
          {!data.requerimientos?.length && <EmptyState text="No hay requerimientos registrados" />}
        </ListContainer>

        {/* MOVILIDAD */}
        <ListContainer 
          title="Últimas Movilidades" 
          icon={<Truck className="text-emerald-500" />}
          count={data.movilidad?.length}
        >
          {data.movilidad?.map((m, i) => (
            <ListItem 
              key={m.id || i}
              primary={m.motivo}
              secondary={m.fecha}
              amount={m.monto_total}
              status={m.estado}
              statusColor="bg-emerald-100 text-emerald-700"
            />
          ))}
          {!data.movilidad?.length && <EmptyState text="No hay registros de movilidad" />}
        </ListContainer>
      </div>

      {/* COLABORADORES */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-400/20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Users size={24} className="text-indigo-400" /> 
              Equipo de Trabajo
            </h2>
            <p className="text-slate-400 text-sm">Colaboradores activos en {user.departamento}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.usuarios?.map((u, i) => (
            <div 
              key={u.id || i} 
              className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl transition-all cursor-default group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                  {u.nombre?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold group-hover:text-indigo-400 transition-colors">{u.nombre}</p>
                  <p className="text-[10px] text-slate-500 font-mono">@{u.usuario}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-lg border border-indigo-500/30">
                  {u.tipo}
                </span>
                <ArrowUpRight size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTES INTERNOS ================= */

function MetricCard({ title, value, icon, gradient, trend }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} p-6 rounded-[2rem] text-white shadow-lg hover:scale-[1.02] transition-transform duration-300`}>
      <div className="relative z-10">
        <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <p className="text-white/70 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-black mt-1 tracking-tight">S/ {(value || 0).toLocaleString()}</h3>
        {/* CORRECCIÓN: Se cambia <p> por <div> para evitar invalid nesting de <div> interno */}
        <div className="text-white/50 text-[10px] font-bold uppercase mt-3 tracking-widest flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-white/50" /> {trend}
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
    </div>
  );
}

function ListContainer({ title, icon, count, children }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
          {icon} {title}
        </h2>
        {count > 0 && (
          <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2.5 py-1 rounded-full">
            {count} TOTAL
          </span>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function ListItem({ primary, secondary, amount, status, statusColor }) {
  return (
    <div className="group flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-500 transition-colors shadow-sm">
          <ChevronRight size={18} />
        </div>
        <div>
          <p className="font-bold text-slate-700 text-sm">{primary}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar size={10} /> {secondary}
          </p>
        </div>
      </div>
      <div className="text-right">
        {/* CORRECCIÓN: Se añade (amount || 0) para prevenir errores de toLocaleString con valores undefined */}
        <p className="font-black text-slate-800 text-sm">S/ {(amount || 0).toLocaleString()}</p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg inline-block mt-1 uppercase ${statusColor}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-center py-10">
      <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
        <Activity size={32} />
      </div>
      <p className="text-slate-400 text-sm font-medium">{text}</p>
    </div>
  );
}