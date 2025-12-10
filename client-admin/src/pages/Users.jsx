import "./Dashboard.css";

export default function UsersPage() {
  return (
    <div className="admin-wrapper">
      <h1>Users</h1>
      <p>Welcome to the Users Page. Here you can see and manage all the users.</p>

      <div className="statistics-overview">
        <div className="statistic-card">
            <h2>Niveau A0</h2>
            <p>80</p>
          </div>
          <div className="statistic-card">
            <h2>Niveau A1</h2>
            <p>50</p>
          </div>
          <div className="statistic-card">
            <h2>Niveau A2</h2>
            <p>40</p>
          </div>
          <div className="statistic-card">
            <h2>Niveau B1</h2>
            <p>50</p>
          </div>
          <div className="statistic-card">
            <h2>Niveau B2</h2>
            <p>33</p>
          </div>
          <div className="statistic-card">
            <h2>Niveau C1</h2>
            <p>50</p>
          </div>
      </div>
    </div>
  );
}