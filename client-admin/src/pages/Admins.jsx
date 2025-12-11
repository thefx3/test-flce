import { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";

import { useAdminsQuery } from "../components/hooks/admin-hooks/useAdminsQuery";

import AdminToolbar from "../components/admin-components/AdminToolbar";
import AdminList from "../components/admin-components/AdminList";

import AdminCreateModal from "../components/admin-components/AdminCreateModal";
import AdminEditModal from "../components/admin-components/AdminEditModal";
import AdminDeleteModal from "../components/admin-components/AdminDeleteModal";

export default function AdminPage() {
  const { token, admin: currentAdmin } = useContext(AdminContext);

  const { data: admins = [], isLoading, isError } = useAdminsQuery(token);

  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur de chargement</p>;


  return (
    <div className="admin-wrapper">
        <div className="admins-header">
            <div> 
                <p className="eyebrow">Administration</p>
                <h1>Gestion des comptes</h1> 
            </div> 
            <AdminToolbar onCreate={() => setModal("create")} />
        </div>

      <AdminList
        admins={admins}
        expandedId={expandedId}
        onToggle={(id) => setExpandedId((prev) => (prev === id ? null : id))}
        onEdit={(admin) => {
          setSelected(admin);
          setModal("edit");
        }}
        onDelete={(admin) => {
          if (currentAdmin?.role !== "SUPERADMIN") return;
          setSelected(admin);
          setModal("delete");
        }}
      />

      {modal === "create" && (
        <AdminCreateModal
          onClose={() => {
            setModal(null);
            setSelected(null);
          }}
        />
      )}
      {modal === "edit" && selected && (
        <AdminEditModal
          admin={selected}
          onClose={() => {
            setModal(null);
            setSelected(null);
          }}
        />
      )}
      {modal === "delete" && selected && (
        <AdminDeleteModal
          admin={selected}
          onClose={() => {
            setModal(null);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
