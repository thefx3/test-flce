export default function AdminCard({ admin, isExpanded, onToggle, canDelete, onEdit, onDelete }) {
  return (
    <div
      className={`admin-card ${isExpanded ? "admin-card--expanded" : ""}`}
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
      <div className="admin-card__header">
        <div className="admin-avatar">{admin.email[0].toUpperCase()}</div>

        <div className="admin-card__identity">
          <span className="role-badge">{admin.role}</span>
          <p className="admin-email">{admin.email}</p>
        </div>

        <span className="admin-dot" />
      </div>

      <div
        className={`admin-actions ${isExpanded ? "admin-actions--visible" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="btn btn-ghost" onClick={() => onEdit(admin)}>
          Modifier
        </button>

        <button
          className="btn btn-danger"
          onClick={() => onDelete(admin)}
          disabled={!canDelete}
          title={!canDelete ? "Action réservée aux SUPERADMIN" : undefined}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
  
