import AdminCard from "./AdminCard";

export default function AdminList({ admins, expandedId, onToggle, canDelete, onEdit, onDelete }) {
  if (admins.length === 0) {
    return (
      <div className="state-card">
        <p className="eyebrow">Aucun administrateur</p>
        <p>Ajoutez un premier compte pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="admin-grid">
      {admins.map((admin) => (
        <AdminCard
          key={admin.userId}
          admin={admin}
          isExpanded={expandedId === admin.userId}
          onToggle={() => onToggle(admin.userId)}
          canDelete={canDelete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
