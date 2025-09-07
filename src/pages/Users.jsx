import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../components/LoadingModal";
import UserModal from "../components/UserModal";

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("creado", { ascending: false });
    setLoading(false);
    if (!error) setUsuarios(data);
  };

  const handleSaveUser = async (user) => {
    setLoading(true);
    if (user.id) {
      await supabase
        .from("usuarios")
        .update({
          nombre: user.nombre,
          email: user.email,
          password: user.password,
        })
        .eq("id", user.id);
    } else {
      await supabase.from("usuarios").insert([
        { nombre: user.nombre, email: user.email, password: user.password, activo: true },
      ]);
    }
    setLoading(false);
    setShowModal(false);
    setEditUser(null);
    cargarUsuarios();
  };

  const toggleEstado = async (id, estado) => {
    setLoading(true);
    await supabase.from("usuarios").update({ activo: !estado }).eq("id", id);
    setLoading(false);
    cargarUsuarios();
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    setLoading(true);
    await supabase.from("usuarios").delete().eq("id", id);
    setLoading(false);
    cargarUsuarios();
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    navigate("/login");
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideNombre = u.nombre.toLowerCase().includes(search.toLowerCase());
    const coincideEstado =
      filterEstado === "todos" ||
      (filterEstado === "activos" && u.activo) ||
      (filterEstado === "inactivos" && !u.activo);
    return coincideNombre && coincideEstado;
  });

  const totalPages = Math.ceil(usuariosFiltrados.length / limit);
  const inicio = (page - 1) * limit;
  const usuariosPagina = usuariosFiltrados.slice(inicio, inicio + limit);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <LoadingModal show={loading} />

      <UserModal
        show={showModal}
        onClose={() => { setShowModal(false); setEditUser(null); }}
        onSave={handleSaveUser}
        editUser={editUser}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
          >
            Crear usuario
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Buscador y filtro */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 flex-1"
        />
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="border rounded p-2"
        >
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
      </div>

      {/* Tabla responsive */}
      <div className="bg-white p-4 rounded shadow-md overflow-x-auto">
        <table className="min-w-full border text-sm md:text-base">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPagina.map((u) => (
              <tr key={u.id} className="border">
                <td className="p-2 border">{u.nombre}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.activo ? "✅ Activo" : "❌ Inactivo"}</td>
                <td className="p-2 border space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => { setEditUser(u); setShowModal(true); }}
                    className="bg-green-500 px-2 py-1 rounded text-white hover:bg-green-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleEstado(u.id, u.activo)}
                    className="bg-yellow-400 px-2 py-1 rounded text-white hover:bg-yellow-500"
                  >
                    {u.activo ? "Inactivar" : "Activar"}
                  </button>
                  <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {usuariosPagina.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No hay usuarios encontrados
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ⬅️ Anterior
          </button>
          <span>
            Página {page} de {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente ➡️
          </button>
        </div>
      </div>
    </div>
  );
}
