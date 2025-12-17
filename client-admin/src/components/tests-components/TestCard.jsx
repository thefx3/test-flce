
function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR");
}

function computeAge(birthdate) {
  if (!birthdate) return "—";
  const d = new Date(birthdate);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Date.now() - d.getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

export default function TestCard({ test, isExpanded, onToggle, onView, onDelete, onCorrect }) {
  const user = test.user || {};
  const profile = user.profile || {};

  const date = formatDate(test.created);
  const lastname = user.lastname || "—";
  const firstname = user.name || "—";
  const nationality = profile.nationality || "—";
  const age = computeAge(profile.birthdate);
  const email = user.email || "—";
  const score = test.testscore ?? 0;
  const total = test.totalPoints ?? 0;
  const status = test.status ?? "DEFAULT";
  const isAuto = status === "AUTO_GRADED";
  const isCorrected = status === "CORRECTED";

  return (
    <div
      className={`test-table__row ${isExpanded ? "test-row--expanded" : ""}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="test-card__header">
        <span data-label="Date">{date}</span>
        <span data-label="Nom">{lastname}</span>
        <span data-label="Prénom">{firstname}</span>
        <span data-label="Nationalité">{nationality}</span>
        <span data-label="Âge">{age}</span>
        <span data-label="Email" className="email-cell">{email}</span>
        <span data-label="Score">{score} / {total}</span>
        <span data-label="Status" className={isCorrected ? "pill pill-success" : ""}>
          {isCorrected ? "CORRECTED" : status}
        </span>
      </div>
      <div
        className={`test-actions ${isExpanded ? "admin-actions--visible" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="btn btn-ghost" onClick={() => onView(test)}>
          Détails
        </button>
        <button
          className="btn btn-outline"
          onClick={() => onCorrect(test)}
          disabled={!isAuto}
          title={!isAuto ? "Disponible uniquement après auto-correction" : undefined}
        >
          Corriger
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(test)}>
          Supprimer
        </button>
      </div>
    </div>
  );
}
