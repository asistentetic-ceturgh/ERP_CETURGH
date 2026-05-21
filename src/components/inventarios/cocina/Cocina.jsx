import React, { useState } from "react";
import Insumos from "./Insumos";
import Menaje from "./Menaje";
import ControlInsumos from "./ControlInsumos";

const Cocina = ({ requerimientos, setRequerimientos }) => {
  const [sub, setSub] = useState("insumos");

  const tabs = [
    { id: "insumos", label: "Stock Insumos" },
    { id: "menaje", label: "Menaje" },
    { id: "control", label: "Control Insumos" },
  ];

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>
      {/* NAVEGACIÓN DE PESTAÑAS */}
      <div className="flex items-center gap-2 mb-10 p-1.5 bg-slate-100/80 rounded-[2rem] w-fit border border-slate-200/60 backdrop-blur-sm shadow-inner">
        {tabs.map((tab) => {
          const isActive = sub === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setSub(tab.id)}
              className={`
          relative px-8 py-3 rounded-[1.8rem] text-[10px] font-black tracking-[0.18em] uppercase transition-all duration-500
          ${isActive
                  ? "bg-[#800000] text-white shadow-[0_8px_20px_-6px_rgba(128,0,0,0.4)]"
                  : "bg-transparent text-slate-500 hover:text-[#800000] hover:bg-white/50"
                }
        `}
            >
              {/* Texto del Tab */}
              <span className="relative z-10">{tab.label}</span>

              {/* Efecto de brillo sutil para el activo */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-[1.8rem]" />
              )}
            </button>
          );
        })}
      </div>

      {/* CONTENEDOR DE CONTENIDO CON TRANSICIÓN SUTIL */}
      <div className="animate-in fade-in duration-500">
        {sub === "insumos" && <Insumos />}
        {sub === "menaje" && <Menaje />}
        {sub === "control" && (
          <ControlInsumos
            requerimientos={requerimientos}
            setRequerimientos={setRequerimientos}
          />
        )}
      </div>
    </div>
  );
};

export default Cocina;