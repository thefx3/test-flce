import { useContext, useEffect, useState } from "react";
import { useUpdateAdmin } from "../hooks/admin-hooks/useUpdateAdmin";
import { AdminContext } from "../../context/AdminContext";

export default function AdminEditModal({ admin, onClose }) {
  const updateMutation = useUpdateAdmin();
  const { admin: currentAdmin, refreshAdmin } = useContext(AdminContext);

  const [form, setForm] = useState({
    email: admin.email || "",
    name: admin.name || "",
    lastname: admin.lastname || "",
    role: admin.role || "ADMIN",
    password: "",
  });

  useEffect(() => {
    if (!admin) return;
    setForm({
      email: admin.email || "",
      name: admin.name || "",
      lastname: admin.lastname || "",
      role: admin.role || "ADMIN",
      password: "",
    });
  }, [admin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(
      { adminId: admin.userId, data: form },
      {
        onSuccess: () => {
          if (admin.userId === currentAdmin?.userId) {
            refreshAdmin?.();
          }
          onClose();
        },
      }
    );
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Modifier l’administrateur</h2>

        <form onSubmit={handleSubmit}>
          <label>Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label>Prénom
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

          <label>Nom
            <input
              type="text"
              value={form.lastname}
              onChange={(e) => setForm({ ...form, lastname: e.target.value })}
            />
          </label>

          <label>Rôle
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="SUPERADMIN">SUPERADMIN</option>
            </select>
          </label>

          <label>Nouveau mot de passe (optionnel)
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Annuler
            </button>
            <button className="btn btn-primary">
              Modifier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
