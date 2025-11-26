// src/pages/IntroTest.jsx
import "shared-ui/styles/intro-test.css";
import { Link, useNavigate } from "react-router-dom";

import {
  Users,
  MapPin,
  BookOpenCheck,
  Clock,
  Book,
  Award
} from "lucide-react";

export default function IntroTest() {
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

          {/* GROUP CLASSES */}
          <div className="class-item">
            <Users className="lucide-icon" />
            <p><strong>Group class</strong> – 8 to 12 students</p>
            <p><strong>Class Level</strong> – From A1 to C2</p>
            <p><strong>6+ hours/week</strong></p>
          </div>

          {/* LOCATION */}
          <div className="class-item">
            <MapPin className="lucide-icon" />
            <p>
              <strong>LA CLEF St Germain-en-Laye</strong><br />
              46 rue de Mareil, 78100
            </p>
          </div>

          {/* WORKSHOP */}
          <div className="class-item workshop">
            <BookOpenCheck className="lucide-icon" />
            <p>
              <strong>Friday Workshop </strong><em>(Paid option)</em><br />
              2h Reinforcement, oral practice
            </p>
          </div>

        </div>
      </section>

      {/* SCHEDULE SECTION */}
      <section className="schedule">

        {/* DESKTOP TABLE */}
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

        {/* MOBILE CARDS */}
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
              {[
                ["Monday", "9:00 – 11:00", "11:15 – 13:15"],
                ["Tuesday", "9:00 – 11:00", "11:15 – 13:15"],
                ["Thursday", "9:00 – 11:00", "11:15 – 13:15"],
                ["Friday", "9:00 – 11:00", "11:15 – 13:15"],
              ].map(([day, s1, s2], i) => (
                <tr
                  key={i}
                  className={`schedule-card ${day === "Friday" ? "highlight" : ""}`}
                >
                  <td className="schedule-card-day">{day}</td>
                  <td>{s1}</td>
                  <td>{s2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>

      {/* ABOUT THE TEST SECTION */}
      <section className="about-test">
        <h3 className="about-title">About the test</h3>

        <div className="about-grid">
          
          {/* Duration */}
          <div className="about-item">
            <Clock className="about-icon" />
            <p className="about-label">30–45 minutes</p>
            <p className="about-desc">Estimated duration</p>
          </div>

          {/* Sections */}
          <div className="about-item">
            <Book className="about-icon" />
            <p className="about-label">3 sections</p>
            <p className="about-desc">Listen, writing, grammar</p>
          </div>

          {/* Free test */}
          <div className="about-item">
            <Award className="about-icon" />
            <p className="about-label">Free Test</p>
            <p className="about-desc">For all</p>
          </div>

        </div>

        <p className="about-text">
          This test evaluates your written comprehension, grammar, vocabulary and written expression.
          Your results help us assign you to the most appropriate French class level.
        </p>

        <div className="about-cta">
          <Link to="/test" className="about-btn">
            Start the test
          </Link>
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
