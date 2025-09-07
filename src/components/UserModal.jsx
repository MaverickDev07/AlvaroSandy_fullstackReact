import React from "react";

export default function UserModal({ show, onClose, onSave, editUser }) {
  if (!show) return null;

  const [nombre, setNombre] = React.useState(editUser?.nombre || "");
  const [email, setEmail] = React.useState(editUser?.email || "");
  const [password, setPassword] = React.useState(editUser?.password || "");
  const [confirmPassword, setConfirmPassword] = React.useState(
    editUser?.password || ""
  );

  const [showPass, setShowPass] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden ❌");
      return;
    }
    onSave({ id: editUser?.id, nombre, email, password });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
        <h2 className="text-xl font-bold mb-4">
          {editUser ? "Editar usuario" : "Crear nuevo usuario"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded p-2"
          />

          {/* Contraseña */}
          <div className="flex">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-l p-2"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="border rounded-r px-2 bg-gray-200"
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div className="flex">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border rounded-l p-2"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="border rounded-r px-2 bg-gray-200"
            >
              {showConfirm ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full sm:w-auto"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
            >
              {editUser ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
