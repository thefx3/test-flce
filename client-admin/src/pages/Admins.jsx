import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminContext } from "../context/AdminContext";
import { getAllAdmins, registerAdmin, updateAdmin, deleteAdmin } from "../api/adminApi";
import "./Dashboard.css";

export default function Admin() {
  const { token, admin: currentAdmin, refreshAdmin } = useContext(AdminContext);
  const queryClient = useQueryClient();
  const [expandedAdminId, setExpandedAdminId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    role: "ADMIN",
  })

  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editForm, setEditForm] = useState({
    email: "",
    name: "",
    lastname: "",
    role: "ADMIN",
    password: "",
  });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

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

  const updateAdminMutation = useMutation({
    mutationFn: (payload) => updateAdmin(payload), // payload = { adminId, data }
    onSuccess: () => {
      setEditingAdmin(null);
      queryClient.invalidateQueries(["admins"]);
      if (editingAdmin?.userId && editingAdmin.userId === currentAdmin?.userId) {
        refreshAdmin?.();
      }
    },
  });
  
  const deleteAdminMutation = useMutation({
    mutationFn: (adminId) => deleteAdmin(adminId),
    onSuccess: () => {
      setPendingDelete(null);
      setDeleteConfirmText("");
      queryClient.invalidateQueries(["admins"]);
    },
  });

  const admins = getAdminsQuery.data || [];
  const isSuperAdmin = currentAdmin?.role === "SUPERADMIN";
  const canConfirmDelete =
    pendingDelete &&
    deleteConfirmText.trim().toLowerCase() === (pendingDelete.email || "").toLowerCase();
  
  const handleEdit = (admin) => {
    setEditingAdmin({
        ...admin,
        userId: admin.userId
      });
  
    setEditForm({
      email: admin.email || "",
      name: admin.name || "",
      lastname: admin.lastname || "",
      role: admin.role || "ADMIN",
      password: "", // volontairement vide
    });
  };
  

  const handleDelete = (admin) => {
    if (!isSuperAdmin) {
      alert("Seul un SUPERADMIN peut supprimer un compte.");
      return;
    }
    setPendingDelete(admin);
    setDeleteConfirmText("");
  };

  const confirmDelete = (e) => {
    e.preventDefault();
    if (!pendingDelete) return;
    const adminId = pendingDelete.userId || pendingDelete.id;
    if (!adminId) return;
    deleteAdminMutation.mutate(adminId);
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
            <div className="modal-backdrop">
            <div
            className="modal"
            onClick={(e) => e.stopPropagation()} // pour ne pas fermer quand on clique dans la modal
            >
            <h2>Nouvel administrateur</h2>

            <form autoComplete="off"
                onSubmit={(e) => {
                e.preventDefault();
                createAdminMutation.mutate(newAdmin);
            }}>
            <label> Email
                <input
                type="email"
                autoComplete="off"
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
                autoComplete="new-password"
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

        {editingAdmin && (
        <div className="modal-backdrop" onClick={() => setEditingAdmin(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Modifier l’administrateur</h2>

            <form
                onSubmit={(e) => {
                e.preventDefault();

                updateAdminMutation.mutate({
                    adminId: editingAdmin.userId,
                    data: {
                    email: editForm.email,
                    name: editForm.name,
                    lastname: editForm.lastname,
                    role: editForm.role,
                    ...(editForm.password ? { password: editForm.password } : {}),
                    },
                });
                }}
            >
                <label>Email
                <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                />
                </label>

                <label>Prénom
                <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                />
                </label>

                <label>Nom
                <input
                    type="text"
                    value={editForm.lastname}
                    onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, lastname: e.target.value }))
                    }
                />
                </label>

                <label>Rôle
                <select
                    value={editForm.role}
                    onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, role: e.target.value }))
                    }
                >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPERADMIN">SUPERADMIN</option>
                </select>
                </label>

                <label>Nouveau mot de passe (optionnel)
                <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                />
                </label>

                {updateAdminMutation.isError && (
                <p className="form-error">{updateAdminMutation.error.message}</p>
                )}

                <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setEditingAdmin(null)}>
                    Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                    Modifier
                </button>
                </div>
            </form>
            </div>
        </div>
        )}

        {pendingDelete && (
          <div className="modal-backdrop" onClick={() => setPendingDelete(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Supprimer l’administrateur</h2>
              <p>
                Vous êtes sur le point de supprimer <strong>{pendingDelete.email}</strong>.
                Tapez son email pour confirmer.
              </p>
              <form onSubmit={confirmDelete}>
                <label>
                  Email de confirmation
                  <input
                    type="email"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder={pendingDelete.email}
                    autoFocus
                  />
                </label>

                {deleteAdminMutation.isError && (
                  <p className="form-error">{deleteAdminMutation.error.message}</p>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setPendingDelete(null)}>
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={!canConfirmDelete || deleteAdminMutation.isPending}
                  >
                    {deleteAdminMutation.isPending ? "Suppression..." : "Supprimer"}
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
                  <button className="btn btn-ghost" onClick={() => handleEdit(admin)}>
                    Modifier
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(admin)}
                    disabled={!isSuperAdmin || deleteAdminMutation.isPending}
                    title={!isSuperAdmin ? "Action réservée aux SUPERADMIN" : undefined}
                  >
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
