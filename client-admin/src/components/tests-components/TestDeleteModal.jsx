export default function TestDeleteModal({ test, onClose, onConfirm, isLoading, error }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Supprimer le test</h2>
        <p>Confirmer la suppression du test #{test.testId || test.id} ({test.user?.email || "utilisateur"}) ?</p>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Annuler</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
