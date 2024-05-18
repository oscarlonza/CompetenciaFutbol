import React, { useState } from "react";
import { useAuth } from "../providers/AuthContext"; // Asegúrate de que la ruta sea correcta
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      MySwal.fire({
        position: "top-end",
        icon: "success",
        title: "Inicio de sesión exitoso",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/");
    } catch (error) {
      setError(error.message); // Mostrar el mensaje de error completo
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="mb-6 text-2xl font-bold">Iniciar Sesión</h2>
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 bg-white rounded shadow-md"
      >
        <label htmlFor="email" className="block mb-2 font-semibold">
          Correo Electrónico
        </label>
        <input
          type="email"
          id="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <label htmlFor="password" className="block mb-2 font-semibold">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className={`w-full py-2 text-white rounded ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
