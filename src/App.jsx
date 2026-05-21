import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Car, FileText, DollarSign, PieChart, UserKey, Truck, Users,
  Briefcase, BookCopy, LogOut, SquareLibrary, ClipboardList, Settings2, FileBarChart,
  Package, ShieldCheck, BriefcaseBusiness, Utensils, Laptop, Boxes, ChevronRight, Box, SquareChartGantt,
  GraduationCap, Bell, NotepadText
} from 'lucide-react';

import { API_BASE } from "./config/api";
import logo from "./logo.png";
import "./services/fetchInterceptor";

// COMPONENTES
import Usuarios from "./components/tabs/Usuarios";
import Departamentos from './components/tabs/Departamentos';
import AreasCostos from './components/tabs/AreasCostos';
import Proveedores from './components/tabs/Proveedores';
import Movilidad from './components/tabs/Movilidad';
import Requerimientos from './components/tabs/Requerimientos';
import Tesoreria from './components/tabs/Tesoreria';
import Propuestas from './components/tabs/Propuestas';
import CentrosCostos from './components/tabs/CentrosCostos';
import Personal from './components/tabs/Personal';
import OrdenCompra from "./components/tabs/OrdenCompra";
import Logistica from "./components/tabs/Logistica";
import Cocina from "./components/inventarios/cocina/Cocina";
import LogisticaInv from "./components/inventarios/logistica/Logistica";
import TIC from "./components/inventarios/tic/TIC";
import Pendientes from "./components/inventarios/Pendientes";
import CajaChica from "./components/tabs/CajaChica";
import Informes from "./components/tabs/Informes";
import Administracion from "./components/tabs/Administracion";
import Carreras from "./components/tabs/Carreras";
import Fondos from "./components/tabs/Fondos";
import PanelPrincipal from "./components/tabs/PanelPrincipal";

const HABILITAR_CAJA_CHICA = true;
const HABILITAR_FONDOS = true;
const API = API_BASE;

const TabContainer = ({ options, activeSubTab, onChange, children }) => (
  <div className="flex flex-col gap-6 animate-in fade-in duration-500">
    <div className="flex gap-1 p-1.5 bg-slate-200/60 backdrop-blur-sm rounded-2xl w-fit border border-slate-300/50 shadow-inner flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${activeSubTab === opt.id
            ? 'bg-white text-[#800000] shadow-sm scale-[1.02] ring-1 ring-black/5'
            : 'text-slate-500 hover:text-[#800000] hover:bg-white/50'
            }`}
        >
          {opt.icon && React.isValidElement(opt.icon)
            ? React.cloneElement(opt.icon, { size: 16 })
            : null}

          {opt.label}
        </button>
      ))}
    </div>

    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 min-h-[600px] p-8 transition-all">
      {children}
    </div>
  </div>
);

const App = ({ user, onLogout }) => {

  // =========================
  // USER ACTUALIZADO
  // =========================

  const [currentUser, setCurrentUser] = useState(() => {

    const stored = localStorage.getItem("user");

    return stored
      ? JSON.parse(stored)
      : user;
  });

  // =========================
  // DEPARTAMENTO ACTIVO
  // =========================

  const [departamentoActivo, setDepartamentoActivo] = useState(
    currentUser?.departamento || ''
  );

  const [departamentoActivoId, setDepartamentoActivoId] = useState(
    currentUser?.departamento_id || null
  );

  // =========================
  // SINCRONIZAR USER
  // =========================

  useEffect(() => {

    const stored = localStorage.getItem("user");

    if (stored) {

      const parsed = JSON.parse(stored);

      setCurrentUser(parsed);

      setDepartamentoActivo(parsed.departamento || '');

      setDepartamentoActivoId(parsed.departamento_id || null);
    }

  }, []);

  // =========================
  // PERMISOS
  // =========================

  const isAdminFull =
    departamentoActivo === 'ADMINISTRACION' ||
    departamentoActivo === 'TIC';

  const isAcademico =
    [
      'ACADEMICO INSTITUTO',
      'ACADEMICO CETPRO PIURA',
      'ACADEMICO CETPRO SULLANA'
    ].includes(departamentoActivo);

  // =========================
  // MENU PRINCIPAL
  // =========================

  const menuItems = [
    { label: 'Panel Principal', icon: <LayoutDashboard /> },
    { label: 'Operaciones', icon: <ShieldCheck /> },
    { label: 'Logistica', icon: <Package /> },
    { label: 'Administracion', icon: <BriefcaseBusiness /> },
    { label: 'Estructura', icon: <Settings2 /> },
    { label: 'Inventarios', icon: <Boxes /> },
    { label: 'TIC', icon: <UserKey /> }
  ];

  const menuFiltrado = menuItems.filter(item => {

    if (isAdminFull) return true;

    if (departamentoActivo === 'LOGISTICA') {
      return [
        'Panel Principal',
        'Operaciones',
        'Logistica',
        'Administracion',
        'Inventarios'
      ].includes(item.label);
    }

    if (departamentoActivo === 'TESORERIA') {
      return [
        'Panel Principal',
        'Operaciones',
        'Logistica',
        'Administracion'
      ].includes(item.label);
    }

    if (isAcademico) {
      return [
        'Panel Principal',
        'Operaciones',
        'Administracion'
      ].includes(item.label);
    }

    if (departamentoActivo === 'ALMACEN') {
      return [
        'Panel Principal',
        'Operaciones',
        'Inventarios',
        'Administracion'
      ].includes(item.label);
    }

    return [
      'Panel Principal',
      'Operaciones'
    ].includes(item.label);
  });

  // =========================
  // SUBTABS DINÁMICAS
  // =========================

  const getLogisticaTabs = () => {

    if (isAdminFull || departamentoActivo === 'LOGISTICA') {
      return [
        { id: 'Proveedores', label: 'PROVEEDORES', icon: <Truck /> },
        { id: 'Logistica', label: 'LOGÍSTICA', icon: <SquareLibrary /> },
        { id: 'Propuestas', label: 'PROPUESTAS', icon: <FileText /> }
      ];
    }

    if (departamentoActivo === 'TESORERIA') {
      return [
        { id: 'Proveedores', label: 'PROVEEDORES', icon: <Truck /> }
      ];
    }

    return [];
  };

  const getAdministracionTabs = () => {

    if (isAdminFull) {
      let tabs = [
        { id: 'Tesoreria', label: 'TESORERÍA', icon: <DollarSign /> },
        { id: 'Personal', label: 'PERSONAL', icon: <Users /> },
        { id: 'Administracion', label: 'ADMINISTRACION', icon: <SquareChartGantt /> }
      ];
      if (HABILITAR_CAJA_CHICA) {
        tabs.splice(2, 0, { id: 'CajaChica', label: 'CAJA CHICA', icon: <Box /> });
      }
      return tabs;
    }

    if (departamentoActivo === 'TESORERIA') {
      let tabs = [
        { id: 'Tesoreria', label: 'TESORERÍA', icon: <DollarSign /> },
        { id: 'Personal', label: 'PERSONAL', icon: <Users /> }
      ];
      if (HABILITAR_CAJA_CHICA) {
        tabs.push({ id: 'CajaChica', label: 'CAJA CHICA', icon: <Box /> });
      }
      return tabs;
    }

    if (departamentoActivo === 'LOGISTICA') {
      let tabs = [
        { id: 'Tesoreria', label: 'TESORERÍA', icon: <DollarSign /> }
      ];
      if (HABILITAR_CAJA_CHICA) {
        tabs.push({ id: 'CajaChica', label: 'CAJA CHICA', icon: <Box /> });
      }
      return tabs;
    }

    if (departamentoActivo === 'ALMACEN') {
      return HABILITAR_CAJA_CHICA ? [{ id: 'CajaChica', label: 'CAJA CHICA', icon: <Box /> }] : [];
    }

    if (isAcademico) {
      return [{ id: 'Personal', label: 'PERSONAL', icon: <Users /> }];
    }

    return [];
  };

  const getInventariosTabs = () => {

    if (isAdminFull) {
      return [
        { id: "pendientes", label: "Pendientes", icon: <Package size={18} /> },
        { id: 'Cocina', label: 'ALMACEN', icon: <Utensils /> },
        { id: 'LogisticaInv', label: 'LOGÍSTICA', icon: <Package /> },
        { id: 'TICInv', label: 'TIC', icon: <Laptop /> }
      ];
    }

    if (departamentoActivo === 'LOGISTICA') {
      return [
        { id: "pendientes", label: "Pendientes", icon: <Package size={18} /> },
        { id: 'Cocina', label: 'ALMACEN', icon: <Utensils /> },
        { id: 'LogisticaInv', label: 'LOGÍSTICA', icon: <Package /> }
      ];
    }

    if (departamentoActivo === 'ALMACEN') {
      return [
        { id: "pendientes", label: "Pendientes", icon: <Package size={18} /> },
        { id: 'Cocina', label: 'ALMACEN', icon: <Utensils /> }
      ];
    }

    return [];
  };

  // =========================
  // DEFAULT SUBTABS
  // =========================

  const getDefaultAdminTab = () => {
    const tabs = getAdministracionTabs();
    return tabs.length > 0 ? tabs[0].id : '';
  };

  const getDefaultLogisticaTab = () => {
    const tabs = getLogisticaTabs();
    return tabs.length > 0 ? tabs[0].id : '';
  };

  const getDefaultInventarioTab = () => {
    const tabs = getInventariosTabs();
    return tabs.length > 0 ? tabs[0].id : '';
  };

  // =========================
  // STATES
  // =========================

  const [activeTab, setActiveTab] = useState('Panel Principal');

  const [subTabs, setSubTabs] = useState({
    Operaciones: 'Requerimientos',
    Logistica: getDefaultLogisticaTab(),
    Administracion: getDefaultAdminTab(),
    Estructura: 'Departamento',
    Inventarios: getDefaultInventarioTab()
  });

  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [showOrdenCompra, setShowOrdenCompra] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [showNotificaciones, setShowNotificaciones] = useState(false);

  const handleSubTabChange = (group, value) => {
    setSubTabs(prev => ({ ...prev, [group]: value }));
  };

  const fetchNotificaciones = async () => {

    try {

      const res = await fetch(
        API + `notificaciones.php?usuario_id=${currentUser.id}`
      );

      const data = await res.json();

      if (data.success) {
        setNotificaciones(data.data || []);
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {

    fetchNotificaciones();

    const interval = setInterval(() => {
      fetchNotificaciones();
    }, 10000);

    return () => clearInterval(interval);

  }, [currentUser.id]);

  // =========================
  // CAMBIAR PERFIL
  // =========================

  const cambiarDepartamento = (nombreDepartamento) => {

    const deptoSeleccionado = currentUser.departamentos.find(
      d => d.nombre === nombreDepartamento
    );

    if (!deptoSeleccionado) return;

    const nuevoUser = {
      ...currentUser,
      departamento: deptoSeleccionado.nombre,
      departamento_id: deptoSeleccionado.id
    };

    localStorage.setItem(
      "user",
      JSON.stringify(nuevoUser)
    );

    setCurrentUser(nuevoUser);

    setDepartamentoActivo(deptoSeleccionado.nombre);

    setDepartamentoActivoId(deptoSeleccionado.id);

    // reset tabs
    setActiveTab('Panel Principal');

    setSubTabs({
      Operaciones: 'Requerimientos',
      Logistica: getDefaultLogisticaTab(),
      Administracion: getDefaultAdminTab(),
      Estructura: 'Departamento',
      Inventarios: getDefaultInventarioTab()
    });
  };

  // =========================
  // RENDER
  // =========================

  const renderContent = () => {

    if (showOrdenCompra) {
      return (
        <OrdenCompra
          orden={ordenSeleccionada}
          onClose={() => setShowOrdenCompra(false)}
        />
      );
    }

    switch (activeTab) {

      case 'Operaciones':
        const opcionesOperaciones = [
          { id: 'Requerimientos', label: 'REQUERIMIENTOS', icon: <ClipboardList /> },
          { id: 'Movilidad', label: 'MOVILIDAD', icon: <Car /> }
        ];
        if (HABILITAR_FONDOS) {
          opcionesOperaciones.push({ id: 'Fondos', label: 'FONDOS', icon: <NotepadText /> });
        }

        return (
          <TabContainer
            activeSubTab={subTabs.Operaciones}
            onChange={(val) => handleSubTabChange('Operaciones', val)}
            options={opcionesOperaciones}
          >
            {subTabs.Operaciones === 'Requerimientos' && <Requerimientos user={currentUser} />}
            {subTabs.Operaciones === 'Movilidad' && <Movilidad user={currentUser} />}
            {HABILITAR_FONDOS && subTabs.Operaciones === 'Fondos' && (
              <Fondos user={currentUser} />
            )}
          </TabContainer>
        );

      case 'Logistica':
        return (
          <TabContainer
            activeSubTab={subTabs.Logistica}
            onChange={(val) => handleSubTabChange('Logistica', val)}
            options={getLogisticaTabs()}
          >
            {subTabs.Logistica === 'Proveedores' && <Proveedores />}
            {subTabs.Logistica === 'Logistica' && <Logistica />}
            {subTabs.Logistica === 'Propuestas' && <Propuestas />}
          </TabContainer>
        );

      case 'Administracion':
        return (
          <TabContainer
            activeSubTab={subTabs.Administracion}
            onChange={(val) => handleSubTabChange('Administracion', val)}
            options={getAdministracionTabs()}
          >
            {subTabs.Administracion === 'Tesoreria' && (
              <Tesoreria
                setOrdenSeleccionada={setOrdenSeleccionada}
                setShowOrdenCompra={setShowOrdenCompra}
              />
            )}
            {subTabs.Administracion === 'Personal' && <Personal />}
            {HABILITAR_CAJA_CHICA && subTabs.Administracion === 'CajaChica' && <CajaChica />}
            {subTabs.Administracion === 'Administracion' && <Administracion />}
          </TabContainer>
        );

      case 'Estructura':

        if (!isAdminFull) return null;

        return (
          <TabContainer
            activeSubTab={subTabs.Estructura}
            onChange={(val) => handleSubTabChange('Estructura', val)}
            options={[
              { id: 'Departamento', label: 'DEPARTAMENTOS', icon: <Briefcase /> },
              { id: 'Costo de Area', label: 'COSTO DE ÁREA', icon: <BookCopy /> },
              { id: 'Centro de Costo', label: 'CENTRO DE COSTO', icon: <PieChart /> },
              { id: 'Carreras', label: 'CARRERAS', icon: <GraduationCap /> },
              { id: 'Informes', label: 'INFORMES', icon: <FileBarChart /> }
            ]}
          >
            {subTabs.Estructura === 'Departamento' && <Departamentos />}
            {subTabs.Estructura === 'Costo de Area' && <AreasCostos />}
            {subTabs.Estructura === 'Centro de Costo' && <CentrosCostos />}
            {subTabs.Estructura === 'Carreras' && <Carreras />}
            {subTabs.Estructura === 'Informes' && <Informes />}
          </TabContainer>
        );

      case 'Inventarios':
        return (
          <TabContainer
            activeSubTab={subTabs.Inventarios}
            onChange={(val) => handleSubTabChange('Inventarios', val)}
            options={getInventariosTabs()}
          >
            {subTabs.Inventarios === "pendientes" && <Pendientes />}
            {subTabs.Inventarios === 'Cocina' && <Cocina />}
            {subTabs.Inventarios === 'LogisticaInv' && <LogisticaInv />}
            {subTabs.Inventarios === 'TICInv' && <TIC />}
          </TabContainer>
        );

      case 'TIC':

        if (!isAdminFull) return null;

        return <Usuarios />;

      case 'Panel Principal':
        return <PanelPrincipal user={currentUser} />;

      default:
        return null;
    }
  };

  const noLeidas = notificaciones.filter(n => Number(n.leido) === 0).length;

  return (
    <div className="flex h-screen bg-[#FDFDFD] text-slate-900 font-sans">

      <aside className="w-72 bg-[#800000] text-white flex flex-col shadow-2xl z-10">

        <div className="p-10 flex flex-col items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-lg shadow-black/20">
            <img
              src={logo}
              className="h-12 w-auto object-contain"
              alt="Logo"
            />
          </div>

          <div className="h-px w-full bg-white/10 mt-4" />
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">

          {menuFiltrado.map(item => {

            const isActive = activeTab === item.label;

            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-white/10 text-[#D4AF37] shadow-inner'
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">

                  {item.icon && React.isValidElement(item.icon)
                    ? React.cloneElement(item.icon, {
                      size: 20,
                      strokeWidth: isActive ? 2.5 : 2
                    })
                    : null}

                  <span className={`text-sm font-semibold ${isActive ? 'tracking-wide' : ''
                    }`}>
                    {item.label}
                  </span>
                </div>

                {isActive && (
                  <ChevronRight
                    size={14}
                    className="animate-pulse"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 bg-black/10">

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C19A2E] text-[#800000] font-bold py-3.5 rounded-xl transition-transform active:scale-95 shadow-lg"
          >
            <LogOut size={18} />

            <span className="text-sm">
              CERRAR SESIÓN
            </span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">

        <header className="mb-8 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              {activeTab}
            </h1>

            <div className="h-1 w-12 bg-[#D4AF37] rounded-full mt-1" />
          </div>

          <div className="flex items-center gap-4">

            {/* 🔔 CAMPANITA */}
            <div className="relative">

              <button
                onClick={async () => {

                  setShowNotificaciones(!showNotificaciones);

                  await fetch(
                    API + "helpers/marcar_notificaciones.php",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        usuario_id: currentUser.id
                      })
                    }
                  );

                  fetchNotificaciones();
                }}
                className="relative bg-white border shadow-sm rounded-xl p-3 hover:bg-slate-50 transition"
              >
                <Bell size={20} />

                {noLeidas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold">
                    {noLeidas}
                  </span>
                )}
              </button>

              {showNotificaciones && (

                <div className="absolute right-0 mt-3 w-[380px] bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden">

                  <div className="p-4 border-b font-black text-sm text-slate-700">
                    Notificaciones
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">

                    {notificaciones.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-400">
                        No hay notificaciones
                      </div>
                    ) : (
                      notificaciones.map(n => (

                        <div
                          key={n.id}
                          className={`p-4 border-b hover:bg-slate-50 transition ${Number(n.leido) === 0
                            ? 'bg-red-50'
                            : ''
                            }`}
                        >
                          <div className="font-bold text-sm text-slate-700">
                            {n.titulo}
                          </div>

                          <div className="text-xs text-slate-500 mt-1">
                            {n.mensaje}
                          </div>

                          <div className="text-[10px] text-slate-400 mt-2">
                            {n.created_at}
                          </div>
                        </div>

                      ))
                    )}

                  </div>
                </div>
              )}
            </div>

            {/* USUARIO */}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border shadow-sm">

              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

              <select
                value={departamentoActivo}
                onChange={(e) => cambiarDepartamento(e.target.value)}
                className="outline-none text-sm font-semibold text-slate-700 bg-transparent"
              >

                {(currentUser?.departamentos || []).map(dep => (
                  <option
                    key={dep.id}
                    value={dep.nombre}
                  >
                    {dep.nombre}
                  </option>
                ))}

              </select>
            </div>

          </div>
        </header>

        <div className="max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;