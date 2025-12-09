
export default function DashboardPage() {
  return (
    <div className="admin-wrapper">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Here you can manage users, tests, and view statistics.</p>

      <div className="stattistics-overview">
        <div className="statistics-group">
          <div className="statistic-card">
            <h2>Total tests</h2>
            <p>1,2234</p>
          </div>
          <div className="statistic-card">
            <h2>Tests to corrects</h2>
            <p>50</p>
          </div>
          <div className="statistic-card">
            <h2>Taux de réussite</h2>
            <p>50%</p>
          </div>
        </div>

        <div className="statistics-group">
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
    </div>
  );
}