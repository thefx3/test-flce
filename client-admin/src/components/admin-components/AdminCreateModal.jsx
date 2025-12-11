import { useState } from "react";
import { useCreateAdmin } from "../hooks/admin-hooks/useCreateAdmin"

export default function AdminCreateModal({ onClose }) {
  const [form, setForm] = useState({ email: "", password: "", role: "ADMIN" });
  const mutation = useCreateAdmin();
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.password.trim()) {
      setLocalError("Le mot de passe ne peut pas être vide.");
      return;
    }
    setLocalError("");
    mutation.mutate(form, {
      onSuccess: onClose,
      onError: (err) => {
        setLocalError(err.message || "Impossible de créer l’admin.");
      },
    });
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

          {(localError || mutation.isError) && (
            <p className="form-error">
              {localError || mutation.error?.message}
            </p>
          )}

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
