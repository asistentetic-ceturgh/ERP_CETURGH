import React, { useState } from "react";
import { API_BASE } from "./config/api";

const API = API_BASE;

const Login = ({ onLogin }) => {

    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) return;

        try {

            setLoading(true);

            const response = await fetch(
                API + "login.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        usuario,
                        password
                    })
                }
            );

            const data = await response.json();

            console.log(data);

            if (!data.success) {

                alert(
                    data.error || "Credenciales incorrectas"
                );

                return;
            }

            // =========================
            // USUARIO FINAL
            // =========================
            const userData = {

                id: data.id,
                usuario: data.usuario,
                nombre: data.nombre,
                tipo: data.tipo,

                // departamento activo
                departamento: data.departamento,
                departamento_id: data.departamento_id,

                // TODOS los departamentos
                departamentos: data.departamentos || []
            };

            // =========================
            // GUARDAR SESSION
            // =========================
            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );

            // =========================
            // LOGIN APP
            // =========================
            onLogin(userData);

        } catch (error) {

            console.error(error);

            alert("Error al conectar con el servidor");

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-[#800000]">

            <div className="bg-white p-10 rounded-3xl shadow-2xl w-[400px]">

                <h2 className="text-2xl font-black text-center text-[#800000] mb-6">
                    CETURGH ERP - LOGIN
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* USUARIO */}
                    <div>

                        <label className="text-xs font-bold text-gray-500 uppercase">
                            Usuario
                        </label>

                        <input
                            type="text"
                            value={usuario}
                            onChange={(e) =>
                                setUsuario(e.target.value)
                            }
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mt-1 focus:border-[#D4AF37] outline-none"
                            placeholder="Ingrese su usuario"
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>

                        <label className="text-xs font-bold text-gray-500 uppercase">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mt-1 focus:border-[#D4AF37] outline-none"
                            placeholder="Ingrese su contraseña"
                            required
                        />
                    </div>

                    {/* BOTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#800000] text-white font-black py-3 rounded-xl hover:bg-black transition-all disabled:opacity-50"
                    >
                        {loading
                            ? "INGRESANDO..."
                            : "INGRESAR"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Login;