import React, { useEffect, useState, useMemo } from "react";
import {
    UserPlus,
    Trash2,
    Edit,
    X,
    Mail,
    Lock,
    Shield,
    Building,
    User,
    ShieldCheck,
    Search
} from "lucide-react";

import { API_BASE } from "../../config/api";

const API = API_BASE;

const Usuarios = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);

    const [modalUsuario, setModalUsuario] = useState(false);
    const [modalEditarUsuario, setModalEditarUsuario] = useState(null);

    const [telefono, setTelefono] = useState("");
    const [firma, setFirma] = useState(null);
    const [previewFirma, setPreviewFirma] = useState(null);

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [rolId, setRolId] = useState("");

    // =========================
    // MULTI DEPARTAMENTOS
    // =========================
    const [departamentosSeleccionados, setDepartamentosSeleccionados] = useState([]);

    const [nombre, setNombre] = useState("");
    const [documento, setDocumento] = useState("");
    const [tipoDocumento, setTipoDocumento] = useState("DNI");

    // =========================
    // FILTRO BÚSQUEDA
    // =========================
    const [searchText, setSearchText] = useState("");

    // =========================
    // LOAD
    // =========================
    useEffect(() => {

        fetchUsuarios();
        fetchDepartamentos();

    }, []);

    // =========================
    // USUARIOS
    // =========================
    const fetchUsuarios = async () => {

        try {

            const res = await fetch(
                API + "usuarios.php"
            );

            const text = await res.text();

            if (!text) return;

            const data = JSON.parse(text);

            const adaptados = data.map(u => ({

                id: u.id,

                correo: u.usuario,

                nombre: u.nombre,

                documento: u.documento,

                tipo_documento: u.tipo_documento,

                rol: u.tipo,

                departamento: u.departamento,

                departamento_id: u.departamento_id,

                departamentos: u.departamentos || [],

                departamentos_ids:
                    (u.departamentos || []).map(
                        d => Number(d.id)
                    ),

                telefono: u.telefono,

                firma: u.firma
            }));

            setUsuarios(adaptados);

        } catch (error) {

            console.error(error);
        }
    };

    // =========================
    // DEPARTAMENTOS
    // =========================
    const fetchDepartamentos = async () => {

        try {

            const res = await fetch(
                API + "departamentos.php"
            );

            const text = await res.text();

            if (!text) return;

            const data = JSON.parse(text);

            setDepartamentos(data);

        } catch (error) {

            console.error(
                "Error cargando departamentos:",
                error
            );
        }
    };

    // =========================
    // FILTRADO DE USUARIOS (MEMOIZADO)
    // =========================
    const filteredUsuarios = useMemo(() => {
        if (searchText.trim() === "") return usuarios;
        
        const term = searchText.toLowerCase();
        return usuarios.filter(u => 
            u.nombre?.toLowerCase().includes(term) ||
            u.correo?.toLowerCase().includes(term)
        );
    }, [usuarios, searchText]);

    // =========================
    // CREAR
    // =========================
    const crearUsuario = async () => {

        try {

            const formData = new FormData();

            formData.append(
                "usuario",
                correo
            );

            formData.append(
                "nombre",
                nombre
            );

            formData.append(
                "documento",
                documento
            );

            formData.append(
                "tipo_documento",
                tipoDocumento
            );

            formData.append(
                "password",
                password
            );

            formData.append(
                "tipo",
                rolId
            );

            formData.append(
                "departamentos_ids",
                JSON.stringify(
                    departamentosSeleccionados
                )
            );

            formData.append(
                "telefono",
                telefono
            );

            if (firma) {
                formData.append(
                    "firma",
                    firma
                );
            }

            const response = await fetch(
                API + "usuarios.php",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!data.success) {

                alert(
                    data.error || "Error al crear usuario"
                );

                return;
            }

            cerrarModal();

            fetchUsuarios();

        } catch (error) {

            console.error(error);

            alert(
                "Error al guardar usuario"
            );
        }
    };

    // =========================
    // EDITAR
    // =========================
    const editarUsuario = async () => {

        try {

            const formData = new FormData();

            formData.append(
                "id",
                modalEditarUsuario.id
            );

            formData.append(
                "usuario",
                correo
            );

            formData.append(
                "nombre",
                nombre
            );

            formData.append(
                "documento",
                documento
            );

            formData.append(
                "tipo_documento",
                tipoDocumento
            );

            formData.append(
                "password",
                password
            );

            formData.append(
                "tipo",
                rolId
            );

            formData.append(
                "departamentos_ids",
                JSON.stringify(
                    departamentosSeleccionados
                )
            );

            formData.append(
                "telefono",
                telefono
            );

            if (firma) {
                formData.append(
                    "firma",
                    firma
                );
            }

            const response = await fetch(
                API + "usuarios.php",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!data.success) {

                alert(
                    data.error || "Error al actualizar"
                );

                return;
            }

            cerrarModal();

            fetchUsuarios();

        } catch (error) {

            console.error(error);

            alert(
                "Error al actualizar usuario"
            );
        }
    };

    // =========================
    // DELETE
    // =========================
    const eliminarUsuario = async (id) => {

        const ok = window.confirm(
            "¿Eliminar usuario?"
        );

        if (!ok) return;

        try {

            await fetch(
                API + `usuarios.php?id=${id}`,
                {
                    method: "DELETE"
                }
            );

            fetchUsuarios();

        } catch (error) {

            console.error(error);
        }
    };

    // =========================
    // FIRMA
    // =========================
    const handleFirmaChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        if (
            file.size > 2 * 1024 * 1024
        ) {

            alert(
                "La firma no debe superar 2MB"
            );

            return;
        }

        const tiposPermitidos = [
            "image/png",
            "image/jpeg",
            "image/jpg"
        ];

        if (
            !tiposPermitidos.includes(file.type)
        ) {

            alert(
                "Solo se permiten PNG o JPG"
            );

            return;
        }

        setFirma(file);

        setPreviewFirma(
            URL.createObjectURL(file)
        );
    };

    // =========================
    // CERRAR
    // =========================
    const cerrarModal = () => {

        setModalUsuario(false);

        setModalEditarUsuario(null);

        setCorreo("");

        setPassword("");

        setRolId("");

        setDepartamentosSeleccionados([]);

        setNombre("");

        setDocumento("");

        setTipoDocumento("DNI");

        setTelefono("");

        setFirma(null);

        setPreviewFirma(null);
    };

    // =========================
    // ROLES
    // =========================
    const ROL_CONFIG = {

        jefe: {
            label: 'Jefe',
            styles:
                'bg-amber-50 text-amber-700 ring-amber-200',
            icon:
                <ShieldCheck size={12} />
        },

        asistente: {
            label: 'Asistente',
            styles:
                'bg-slate-50 text-slate-700 ring-slate-200',
            icon:
                <User size={12} />
        },

        admin: {
            label: 'Administrador',
            styles:
                'bg-red-50 text-red-700 ring-red-200',
            icon:
                <Lock size={12} />
        }
    };

    return (

        <div className="p-8 bg-gray-50 min-h-screen font-sans">

            {/* HEADER */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">

                <div>

                    <h2 className="text-3xl font-extrabold text-[#800000] tracking-tight">
                        Gestión de Usuarios
                    </h2>

                </div>

                <button
                    onClick={() => {

                        setModalEditarUsuario(null);

                        setModalUsuario(true);
                    }}
                    className="flex items-center gap-2 bg-[#800000] hover:bg-[#600000] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 active:scale-95"
                >
                    <UserPlus size={20} />

                    Crear Usuario
                </button>
            </div>

            {/* BARRA DE BÚSQUEDA */}
            <div className="max-w-6xl mx-auto mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <Search size={12} /> Buscar usuario
                            </label>
                            <input
                                type="text"
                                placeholder="Nombre o correo electrónico..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#800000]/30 focus:border-[#800000] transition-all"
                            />
                        </div>
                        <div className="text-right text-[10px] font-bold text-slate-400 whitespace-nowrap pb-1">
                            Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div className="max-w-6xl mx-auto bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-0 table-fixed">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="w-[30%] px-6 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b">
                                    Usuario
                                </th>
                                <th className="w-[15%] px-6 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b">
                                    Documento
                                </th>
                                <th className="w-[15%] px-6 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b">
                                    Acceso
                                </th>
                                <th className="w-[12%] px-6 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b text-center">
                                    Teléfono
                                </th>
                                <th className="w-[18%] px-6 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b">
                                    Departamentos
                                </th>
                                <th className="w-[10%] px-6 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b text-center">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 bg-white">
                            {filteredUsuarios.map((u) => (
                                <tr
                                    key={u.id}
                                    className="hover:bg-gray-50/50 transition-all group align-middle"
                                >
                                    {/* USUARIO */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-[#800000] font-bold shadow-sm border border-red-200/50">
                                                    {u.correo?.charAt(0)?.toUpperCase() || "?"}
                                                </div>
                                                <span className="absolute -top-1 -left-1 text-[9px] bg-white border border-gray-200 px-1 rounded text-gray-400 font-mono">
                                                    #{u.id}
                                                </span>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-bold text-gray-800 leading-tight truncate">
                                                    {u.nombre}
                                                </span>
                                                <span className="text-xs text-gray-500 truncate">
                                                    {u.correo}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* DOCUMENTO */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                                {u.tipo_documento}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700 font-mono tracking-tight">
                                                {u.documento}
                                            </span>
                                        </div>
                                    </td>

                                    {/* ROL */}
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ring-1 ring-inset ${ROL_CONFIG[u.rol]?.styles}`}>
                                            {ROL_CONFIG[u.rol]?.icon}
                                            {ROL_CONFIG[u.rol]?.label}
                                        </span>
                                    </td>

                                    {/* TELÉFONO */}
                                    <td className="px-6 py-4 text-gray-600 text-center text-sm">
                                        {u.telefono || "-"}
                                     </td>

                                    {/* DEPARTAMENTOS */}
                                    <td className="px-6 py-4 max-w-[220px]">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {u.departamentos?.slice(0, 2).map(dep => (
                                                <div
                                                    key={dep.id}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600 truncate max-w-[120px]"
                                                    title={dep.nombre}
                                                >
                                                    <Building size={11} className="text-slate-400 flex-shrink-0" />
                                                    <span className="truncate">{dep.nombre}</span>
                                                </div>
                                            ))}
                                            
                                            {u.departamentos && u.departamentos.length > 2 && (
                                                <div 
                                                    className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-600 cursor-help"
                                                    title={u.departamentos.slice(2).map(d => d.nombre).join(', ')}
                                                >
                                                    +{u.departamentos.length - 2}
                                                </div>
                                            )}

                                            {(!u.departamentos || u.departamentos.length === 0) && (
                                                <span className="text-xs text-gray-400 italic">Ninguno</span>
                                            )}
                                        </div>
                                     </td>

                                    {/* ACCIONES */}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-1.5">
                                            <button
                                                onClick={() => {
                                                    setModalEditarUsuario(u);
                                                    setNombre(u.nombre || "");
                                                    setDocumento(u.documento || "");
                                                    setTipoDocumento(u.tipo_documento || "DNI");
                                                    setCorreo(u.correo || "");
                                                    setRolId(u.rol || "");
                                                    setDepartamentosSeleccionados(u.departamentos_ids || []);
                                                    setTelefono(u.telefono || "");
                                                    setPreviewFirma(u.firma ? API + u.firma : null);
                                                    setFirma(null);
                                                    setPassword("");
                                                    setModalUsuario(true);
                                                }}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-xl transition-all active:scale-90"
                                            >
                                                <Edit size={18} />
                                            </button>

                                            <button
                                                onClick={() => eliminarUsuario(u.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all active:scale-90"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                     </td>
                                 </tr>
                            ))}
                        </tbody>
                     </table>
                </div>

                {filteredUsuarios.length === 0 && (
                    <div className="p-20 text-center text-gray-400">
                        No se encontraron usuarios con el criterio de búsqueda.
                    </div>
                )}
            </div>

            {/* MODAL (sin cambios) */}
            {modalUsuario && (

                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">

                        {/* HEADER */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#800000] text-white shrink-0">

                            <h3 className="text-xl font-bold flex items-center gap-2">

                                <UserPlus size={22} />

                                {modalEditarUsuario
                                    ? "Editar Usuario"
                                    : "Nuevo Usuario"}

                            </h3>

                            <button
                                onClick={cerrarModal}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">

                            {/* NOMBRE */}
                            <div className="space-y-1.5">

                                <label className="text-sm font-bold text-gray-700 ml-1">
                                    Nombre Completo
                                </label>

                                <input
                                    value={nombre}
                                    onChange={(e) =>
                                        setNombre(e.target.value)
                                    }
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all bg-gray-50"
                                    placeholder="Juan Pérez"
                                />
                            </div>

                            {/* DOCUMENTOS */}
                            <div className="grid grid-cols-2 gap-4">

                                <div className="space-y-1.5">

                                    <label className="text-sm font-bold text-gray-700 ml-1">
                                        Tipo Doc
                                    </label>

                                    <select
                                        value={tipoDocumento}
                                        onChange={(e) =>
                                            setTipoDocumento(
                                                e.target.value
                                            )
                                        }
                                        className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all bg-gray-50"
                                    >
                                        <option value="DNI">
                                            DNI
                                        </option>

                                        <option value="CE">
                                            Carnet Ext.
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">

                                    <label className="text-sm font-bold text-gray-700 ml-1">
                                        N° Documento
                                    </label>

                                    <input
                                        value={documento}
                                        onChange={(e) =>
                                            setDocumento(
                                                e.target.value
                                            )
                                        }
                                        className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all bg-gray-50"
                                        placeholder="12345678"
                                        maxLength={
                                            tipoDocumento === "DNI"
                                                ? 8
                                                : 12
                                        }
                                    />
                                </div>
                            </div>

                            {/* CORREO */}
                            <div className="space-y-1.5">

                                <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">

                                    <Mail size={14} />

                                    Correo Electrónico
                                </label>

                                <input
                                    type="email"
                                    placeholder="ejemplo@ceturgh.edu.pe"
                                    value={correo}
                                    onChange={(e) =>
                                        setCorreo(e.target.value)
                                    }
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all bg-gray-50"
                                />
                            </div>

                            {/* PASSWORD */}
                            <div className="space-y-1.5">

                                <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">

                                    <Lock size={14} />

                                    Contraseña
                                </label>

                                <input
                                    type="password"
                                    placeholder={
                                        modalEditarUsuario
                                            ? "Dejar vacío para mantener"
                                            : "••••••••"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all bg-gray-50"
                                />
                            </div>

                            {/* TELEFONO */}
                            <div className="space-y-1.5">

                                <label className="text-sm font-bold text-gray-700 ml-1">
                                    Teléfono
                                </label>

                                <input
                                    value={telefono}
                                    onChange={(e) =>
                                        setTelefono(
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all bg-gray-50"
                                    placeholder="987654321"
                                />
                            </div>

                            {/* ROL */}
                            <div className="space-y-1.5">

                                <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">

                                    <Shield size={14} />

                                    Rol
                                </label>

                                <select
                                    value={rolId}
                                    onChange={(e) =>
                                        setRolId(
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all bg-gray-50"
                                >
                                    <option value="">
                                        Seleccionar
                                    </option>

                                    <option value="admin">
                                        ADMIN
                                    </option>

                                    <option value="jefe">
                                        JEFE
                                    </option>

                                    <option value="asistente">
                                        ASISTENTE
                                    </option>
                                </select>
                            </div>

                            {/* DEPARTAMENTOS */}
                            <div className="space-y-1.5">

                                <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">

                                    <Building size={14} />

                                    Departamentos
                                </label>

                                <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 max-h-52 overflow-y-auto space-y-2">

                                    {departamentos.map((d) => {

                                        const checked =
                                            departamentosSeleccionados.includes(
                                                Number(d.id)
                                            );

                                        return (

                                            <label
                                                key={d.id}
                                                className="flex items-center gap-3 text-sm cursor-pointer"
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={(e) => {

                                                        if (e.target.checked) {

                                                            setDepartamentosSeleccionados(prev => [

                                                                ...prev,

                                                                Number(d.id)
                                                            ]);

                                                        } else {

                                                            setDepartamentosSeleccionados(prev =>
                                                                prev.filter(
                                                                    id =>
                                                                        id !== Number(d.id)
                                                                )
                                                            );
                                                        }
                                                    }}
                                                    className="w-4 h-4 accent-[#800000]"
                                                />

                                                <span className="font-medium text-slate-700">
                                                    {d.nombre}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>

                                <p className="text-[11px] text-slate-400 ml-1">
                                    El primer departamento seleccionado será el principal
                                </p>
                            </div>

                            {/* FIRMA */}
                            <div className="space-y-2">

                                <label className="text-sm font-bold text-gray-700 ml-1">
                                    Firma Digital
                                </label>

                                <input
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    onChange={handleFirmaChange}
                                    className="w-full border border-gray-200 rounded-xl p-2 bg-gray-50"
                                />

                                {previewFirma && (

                                    <div className="border rounded-xl p-3 bg-white">

                                        <img
                                            src={previewFirma}
                                            alt="Firma"
                                            className="h-24 w-full object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50 shrink-0">

                            <button
                                onClick={cerrarModal}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={
                                    modalEditarUsuario
                                        ? editarUsuario
                                        : crearUsuario
                                }
                                className="flex-1 bg-[#800000] text-white px-4 py-3 rounded-xl font-bold hover:bg-[#600000] transition-colors shadow-lg shadow-red-900/20"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #800000;
                }
            `}</style>
        </div>
    );
};

export default Usuarios;