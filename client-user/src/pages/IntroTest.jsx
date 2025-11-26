// src/pages/IntroTest.jsx
import "shared-ui/styles/french-test.css";

export default function IntroTest({ onStart }) {
  return (
    <div className="intro">

      {/* HERO SECTION */}
      <section className="hero">
        <h1 className="hero-title">French Online Test</h1>
        <p className="hero-subtitle">
          Evaluate your French level for the French courses at LA CLEF
        </p>
      </section>

      {/* CLASSES SECTION */}
      <section className="classes">
        <div className="classes-grid">
          <div className="class-item">
            <img src="/icons/group.svg" alt="Group Classes" />
            <p><strong>Group classes</strong> – 8 to 12 students</p>
            <p><strong>Class Level</strong> – From A1 to C2</p>
            <p><strong>6+ hours/week</strong></p>
          </div>

          <div className="class-item">
            <img src="/icons/map.svg" alt="Localisation" />
            <p>
              <strong>LA CLEF St Germain-en-Laye</strong><br />
              46 rue de Mareil, 78100
            </p>
          </div>

          <div className="class-item workshop">
            <img src="/icons/levels.svg" alt="Levels" />
            <p>
              <strong>Friday Workshop </strong><em>(Paid option)</em><br />
              2h Reinforcement, oral practice
            </p>
          </div>
        </div>
      </section>

      {/* SCHEDULE SECTION */}
      <section className="schedule">

        {/* Version TABLEAU (desktop) */}
        <div className="schedule-table">
          <table>
            <thead>
              <tr>
                <th>Session</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Thursday</th>
                <th className="highlight">Friday</th>

              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Session 1</td>
                <td>9:00 – 11:00</td>
                <td>9:00 – 11:00</td>

                <td>9:00 – 11:00</td>
                <td className="highlight">9:00 – 11:00</td>
              </tr>

              <tr>
                <td>Session 2</td>
                <td>11:15 – 13:15</td>
                <td>11:15 – 13:15</td>

                <td>11:15 – 13:15</td>
                <td className="highlight">11:15 – 13:15</td>

                
              </tr>
            </tbody>
          </table>
        </div>

        <div className="schedule-cards">
          <table>
            <thead>
              <tr>
                <th>Days</th>
                <th>Session 1</th>
                <th>Session 2</th>
              </tr>
            </thead>
            <tbody>
              <tr className="schedule-card">
                <td className="schedule-card-day">Monday</td>
                <td>9:00 – 11:00</td>
                <td>11:15 – 13:15</td>
              </tr>
              <tr className="schedule-card">
                <td className="schedule-card-day">Tuesday</td>
                <td>9:00 – 11:00</td>
                <td>11:15 – 13:15</td>
              </tr>
              <tr className="schedule-card">
                <td className="schedule-card-day">Thursday</td>
                <td>9:00 – 11:00</td>
                <td>11:15 – 13:15</td>
              </tr>
              <tr className="schedule-card highlight" id="highlight">
                <td className="schedule-card-day">Friday</td>
                <td>9:00 – 11:00</td>
                <td>11:15 – 13:15</td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>


      {/* ABOUT THE TEST SECTION */}
      <section className="about-test">
        <h3 className="about-title">About the test</h3>

        <div className="about-grid">
            <div className="about-item">
            <img src="/icons/clock.svg" className="about-icon" alt="clock" />
            <p className="about-label">30–45 minutes</p>
            <p className="about-desc">Estimated duration</p>
            </div>

            <div className="about-item">
            <img src="/icons/book.svg" className="about-icon" alt="book" />
            <p className="about-label">3 sections</p>
            <p className="about-desc">Listen, writing, grammar</p>
            </div>

            <div className="about-item">
            <img src="/icons/award.svg" className="about-icon" alt="award" />
            <p className="about-label">Free Test</p>
            <p className="about-desc">For all</p>
            </div>
        </div>

        <p className="about-text">
            Ce test évaluera votre niveau en compréhension écrite, grammaire, vocabulaire et expression
            écrite. Vos résultats nous permettront de vous orienter vers le cours le plus adapté à votre niveau.
        </p>

        <div className="about-cta">
            <button className="about-btn" onClick={onStart}>
            Start the test
            </button>
        </div>

        <div className="about-link-wrapper">
            <button className="about-link" onClick={() => setView("student")}>
            Already did the test ? See your registration process
            </button>
        </div>
      </section>


    </div>
  );
}
