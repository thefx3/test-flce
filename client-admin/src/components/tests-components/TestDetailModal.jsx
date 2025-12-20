export default function TestDetailModal({ test, onClose }) {
  const user = test.user || {};
  const profile = user.profile || {};
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <div className="details-infos">
          <h2>Test #{test.testId || test.id}: {test.testscore} / {test.totalPoints} | {test.status}</h2>
          <p><strong>Email :</strong> {user.email || "—"}</p>
          <p><strong>User :</strong> {user.lastname || "—"} {user.name || ""}</p>
          <p><strong>Nationalité :</strong> {profile.nationality || "—"}</p>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={onClose}>Fermer</button>
          </div>
        </div>


      </div>
    </div>
  );
}
