export default function TestCorrectModal({ test, onClose, onConfirm, isLoading, error }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Corriger manuellement</h2>
        <p>
          Vous allez marquer le test #{test.testId || test.id} comme corrigé manuellement.
          Statut actuel : <strong>{test.status}</strong>
        </p>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Validation..." : "Marquer corrigé"}
          </button>
        </div>
      </div>
    </div>
  );
}
