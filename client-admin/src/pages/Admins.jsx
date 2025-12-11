import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminContext } from "../context/AdminContext";
import { getAllAdmins, registerAdmin } from "../api/adminApi";
import "./Dashboard.css";

export default function Admin() {
  const { token } = useContext(AdminContext);
  const queryClient = useQueryClient();
  const [expandedAdminId, setExpandedAdminId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    role: "ADMIN",
  })

  const getAdminsQuery = useQuery({
    queryKey: ["admins"],
    queryFn: () => getAllAdmins(token),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createAdminMutation = useMutation({
    mutationFn: (data) => registerAdmin(data),
    onSuccess: () => {
      // on ferme le formulaire
      setIsCreateOpen(false);
      setNewAdmin({ email: "", password: "", role: "ADMIN" });
      // on refetche la liste des admins
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
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

  const toggleActions = (adminId) => {
    setExpandedAdminId((current) => (current === adminId ? null : adminId));
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
        </div>
        <div className="admins-toolbar">
          <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
            Créer un administrateur
          </button>
        </div>
      </div>

        {isCreateOpen && (
            <div className="modal-backdrop" onClick={() => setIsCreateOpen(false)}>
            <div
            className="modal"
            onClick={(e) => e.stopPropagation()} // pour ne pas fermer quand on clique dans la modal
            >
            <h2>Nouvel administrateur</h2>

            <form onSubmit={(e) => {
                e.preventDefault();
                createAdminMutation.mutate(newAdmin);
            }}>
            <label> Email
                <input
                type="email"
                value={newAdmin.email}
                onChange={(e) =>
                    setNewAdmin((prev) => ({ ...prev, email: e.target.value }))
                }
                required/>
            </label>

            <label>
                Mot de passe
                <input
                type="password"
                value={newAdmin.password}
                onChange={(e) =>
                    setNewAdmin((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                />
            </label>

            <label>
                Rôle
                <select
                value={newAdmin.role}
                onChange={(e) =>
                    setNewAdmin((prev) => ({ ...prev, role: e.target.value }))
                }
                >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPERADMIN">SUPERADMIN</option>
                </select>
            </label>

            {createAdminMutation.isError && (
                <p className="form-error">
                {createAdminMutation.error.message}
                </p>
            )}

            <div className="modal-actions">
                <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsCreateOpen(false)}
                >
                Annuler
                </button>
                <button
                type="submit"
                className="btn btn-primary"
                disabled={createAdminMutation.isPending}
                >
                {createAdminMutation.isPending ? "Création..." : "Créer"}
                </button>
            </div>
            </form>
            </div>
            </div>
        )}


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
          {admins.map((admin) => {
            const adminId = admin.userId || admin.id || admin.email;
            const isExpanded = expandedAdminId === adminId;

            return (
              <div
                key={adminId}
                className={`admin-card ${isExpanded ? "admin-card--expanded" : ""}`}
                onClick={() => toggleActions(adminId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleActions(adminId);
                  }
                }}
              >
                <div className="admin-card__header">
                  <div className="admin-avatar">{(admin.email || "?")[0].toUpperCase()}</div>
                  <div className="admin-card__identity">
                    <span className="role-badge">{admin.role || "ADMIN"}</span>
                    <p className="admin-email">{admin.email}</p>
                  </div>
                  <span className="admin-dot" aria-hidden />
                </div>

                <div
                  className={`admin-actions ${isExpanded ? "admin-actions--visible" : ""}`}
                  onClick={(e) => e.stopPropagation()}
                >
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
            );
          })}
        </div>
      )}
    </div>
  );
}
