import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminContext } from "../context/AdminContext";
import { getAllAdmins } from "../api/adminApi";
import "./Dashboard.css";

export default function Admin() {
  const { token } = useContext(AdminContext);

  const getAdminsQuery = useQuery({
    queryKey: ["admins"],
    queryFn: () => getAllAdmins(token),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const admins = getAdminsQuery.data || [];

  const handleManage = (admin) => {
    console.log("Gérer l'administrateur", admin);
  };

  const handleEdit = (admin) => {
    console.log("Modifier l'administrateur", admin);
  };

  const handleDelete = (admin) => {
    console.log("Supprimer l'administrateur", admin);
  };

  if (getAdminsQuery.isLoading) {
    return (
      <div className="admin-wrapper">
        <div className="state-card">
          <p className="eyebrow">Chargement</p>
          <p>Récupération des administrateurs...</p>
        </div>
      </div>
    );
  }

  if (getAdminsQuery.isError) {
    return (
      <div className="admin-wrapper">
        <div className="state-card state-card__error">
          <p className="eyebrow">Erreur</p>
          <p>Impossible de charger les administrateurs pour le moment.</p>
          <button className="btn btn-outline" onClick={() => getAdminsQuery.refetch()}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <div className="admins-header">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>Gestion des comptes</h1>
          {/* <p className="subtitle">
            Surveillez les accès, mettez à jour les rôles et gardez la plateforme sécurisée.
          </p> */}
        </div>
        <div className="admins-toolbar">
          <button className="btn btn-primary" onClick={() => console.log("Créer un admin")}>
            Créer un administrateur
          </button>
        </div>
      </div>

      {admins.length === 0 ? (
        <div className="state-card">
          <p className="eyebrow">Aucun compte</p>
          <p>Ajoutez votre premier administrateur pour commencer la gestion des accès.</p>
          <button className="btn btn-primary" onClick={() => console.log("Créer un admin")}>
            Ajouter un admin
          </button>
        </div>
      ) : (
        <div className="admin-grid">
          {admins.map((admin) => (
            <div key={admin.userId || admin.id || admin.email} className="admin-card">
              <div className="admin-card__header">
                <div className="admin-avatar">{(admin.email || "?")[0].toUpperCase()}</div>
                <div className="admin-card__identity">
                    <span className="role-badge">{admin.role || "ADMIN"}</span>
                    <p className="admin-email">{admin.email}</p>
                </div>
                <span className="admin-dot" aria-hidden />
              </div>

              <div className="admin-actions">
                <button className="btn btn-ghost" onClick={() => handleManage(admin)}>
                  Gérer
                </button>
                <button className="btn btn-outline" onClick={() => handleEdit(admin)}>
                  Modifier
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(admin)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
