import { useState } from "react";
import { useDeleteAdmin } from "../hooks/admin-hooks/useDeleteAdmin";

export default function AdminDeleteModal({ admin, onClose }) {
  const deleteMutation = useDeleteAdmin();
  const [text, setText] = useState("");

  const match = text.trim().toLowerCase() === admin.email.toLowerCase();

  const handleDelete = (e) => {
    e.preventDefault();
    deleteMutation.mutate(admin.userId, {
      onSuccess: onClose,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Supprimer l’administrateur</h2>
        <p>
          Tapez <strong>{admin.email}</strong> pour confirmer la suppression.
        </p>

        <form onSubmit={handleDelete}>
          <input
            type="email"
            placeholder={admin.email}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {deleteMutation.isError && (
            <p className="form-error">{deleteMutation.error?.message || "Suppression impossible."}</p>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Annuler
            </button>

            <button
              type="submit"
              className="btn btn-danger"
              disabled={!match || deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
