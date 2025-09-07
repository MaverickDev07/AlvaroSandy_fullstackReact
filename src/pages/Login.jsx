import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../components/LoadingModal";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Credenciales inválidas ❌");
      return;
    }

    navigate("/users");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <LoadingModal show={loading} />
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <label className="block mb-2">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded p-2 mt-1"
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Contraseña</span>
          <div className="flex">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-l p-2 mt-1"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="border rounded-r px-2 mt-1 bg-gray-200"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
