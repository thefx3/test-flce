export default function TestDetailModal({ test, onClose }) {
  const user = test.user || {};
  const profile = user.profile || {};
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Détails du test #{test.testId || test.id}</h2>
        <p><strong>Statut :</strong> {test.status}</p>
        <p><strong>Email :</strong> {user.email || "—"}</p>
        <p><strong>Nom :</strong> {user.lastname || "—"} {user.name || ""}</p>
        <p><strong>Nationalité :</strong> {profile.nationality || "—"}</p>
        <p><strong>Score :</strong> {test.testscore ?? 0} / {test.totalPoints ?? 0}</p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}
