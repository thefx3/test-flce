import { useState } from "react";
import { useCreateAdmin } from "../hooks/admin-hooks/useCreateAdmin"

export default function AdminCreateModal({ onClose }) {
  const [form, setForm] = useState({ email: "", password: "", role: "ADMIN" });
  const mutation = useCreateAdmin();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form, { onSuccess: onClose });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Nouvel administrateur</h2>

        <form onSubmit={handleSubmit}>
          <label>Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>

          <label>Mot de passe
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
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

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Annuler
            </button>
            <button className="btn btn-primary">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
