export default function AdminToolbar({ onCreate }) {
    return (
      <div className="admins-toolbar">
        <button className="btn btn-primary" onClick={onCreate}>
          Créer un administrateur
        </button>
      </div>
    );
  }
  