import React, { useState } from "react";
import { Utensils, Monitor, HardHat, Package } from "lucide-react";

import Cocina from "./cocina/Cocina";
import TIC from "./tic/TIC";
import Logistica from "./logistica/Logistica.jsx";
import Pendientes from "./Pendientes.jsx";

const Inventarios = () => {
  const [tab, setTab] = useState("pendientes");

  const tabs = [
    { id: "pendientes", label: "Pendientes", icon: <Package size={18} /> },
    { id: "cocina", label: "Cocina", icon: <Utensils size={18} /> },
    { id: "tic", label: "TIC", icon: <Monitor size={18} /> },
    { id: "logistica", label: "Logística", icon: <HardHat size={18} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-3 border-b pb-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-xl font-bold text-xs ${
              tab === t.id ? "bg-[#800000] text-white" : "text-slate-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {tab === "pendientes" && <Pendientes />}
      {tab === "cocina" && <Cocina />}
      {tab === "tic" && <TIC />}
      {tab === "logistica" && <Logistica />}
    </div>
  );
};

export default Inventarios;