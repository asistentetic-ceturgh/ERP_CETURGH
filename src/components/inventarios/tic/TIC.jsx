import React, { useState } from "react";
import Oficina from "./Oficina";
import Moviles from "./Moviles";
import Herramientas from "./Herramientas";
import Consolidado from "./Consolidado";
import Accesorios from "./Accesorios"

const TIC = () => {
  const [sub, setSub] = useState("oficina");

  const tabs = [
    { id: "oficina", label: "Oficina" },
    { id: "moviles", label: "Móviles" },
    { id: "herramientas", label: "Herramientas" },
    { id: "accesorios", label: "Accesorios" },
    { id: "consolidado", label: "Consolidado" },
  ];

  return (
    <div style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>
      {/* TABS HEADER */}
      <div className="flex items-center gap-2 mb-6 p-1.5 bg-slate-100/80 rounded-[2rem] w-fit border border-slate-200/60 backdrop-blur-sm shadow-inner">
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
              {/* Texto */}
              <span className="relative z-10">{tab.label}</span>

              {/* Brillo activo */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-[1.8rem]" />
              )}
            </button>
          );
        })}
      </div>

      {/* CONTENIDO */}
      <div className="bg-white rounded-xl shadow-sm">
        {sub === "oficina" && <Oficina />}
        {sub === "moviles" && <Moviles />}
        {sub === "herramientas" && <Herramientas />}
        {sub === "accesorios" && <Accesorios />}
        {sub === "consolidado" && <Consolidado />}
      </div>
    </div>
  );
};

export default TIC;