// src/pages/StartTestForm.jsx
import { useState } from "react";
import PersonnalInfos from "../components/PersonnalInfos";
import HostingFamily from "../components/HostingFamily";
import { startTest } from "../api/publicApi";
import "../components/StartTestForm.css"

export default function StartTestForm({ onSuccess }) {
  const [auPair, setAuPair] = useState(false);
  const [firstRegister, setFirstRegister] = useState(true);

  const [form, setForm] = useState({
    email: "",
    name: "",
    lastname: "",
    civility: "",
    phone: "",
    birthdate: "",
    birthplace: "",
    nationality: "",
    address_number: "",
    address_street: "",
    address_city: "",
    address_zipcode: "",
    address_country: "",
    arrival_date: "",
  });

  const [family, setFamily] = useState({
    familyname1: "",
    familyname2: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateForm(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function updateFamily(e) {
    const { name, value } = e.target;
    setFamily(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
      
        // ⏳ Convert numeric fields
        phone: form.phone ? Number(form.phone) : null,
        address_number: form.address_number ? Number(form.address_number) : null,
        address_zipcode: form.address_zipcode ? Number(form.address_zipcode) : null,
      
        // ⏳ Convert dates
        birthdate: form.birthdate ? new Date(form.birthdate) : null,
        arrivaldate: form.arrivaldate ? new Date(form.arrivaldate) : null, // ⚠ harmoniser le nom
      
        // Other
        aupair: auPair,
        firstregister: firstRegister,
      
        // Family block
        family: auPair
          ? {
              ...family,
              phone: family.phone ? Number(family.phone) : null,
            }
          : null,
      };
      
      
      

      //PUBLIC API FETCH
      const res = await startTest(payload);

      onSuccess({
        testId: res.testId,
        sessionToken: res.sessionToken,
      });

    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="start-container">
      <h1 className="start-title">Informations Details</h1>
      <p className="start-subtitle">
        
      </p>

      <div className="form-section first-section">
        <p className="instructions">
        Please fill in your personal information to begin the placement test.
        </p>
      </div>

      <form className="start-form" onSubmit={handleSubmit}>

        {/* ▶ PERSONAL INFOS */}
        <PersonnalInfos form={form} onChange={updateForm} />

        <div className="form-boolean">
        {/* ▶ FIRST REGISTRATION */}
        <div className="form-section">
          <label className="section-label">Is it your first registration at La CLEF?</label>

          <div className="radio-group">
            <label className="radio-line">
              <input
                type="radio"
                name="firstregister"
                value="yes"
                checked={firstRegister === true}
                onChange={() => setFirstRegister(true)}
              />
              Yes
            </label>

            <label className="radio-line">
              <input
                type="radio"
                name="firstregister"
                value="no"
                checked={firstRegister === false}
                onChange={() => setFirstRegister(false)}
              />
              No
            </label>
          </div>
        </div>

        {/* ▶ AU PAIR */}
        <div className="form-section">
          <label className="section-label">Are you an Au Pair?</label>

          <div className="radio-group">
            <label className="radio-line">
              <input
                type="radio"
                name="aupair"
                value="true"
                checked={auPair === true}
                onChange={() => setAuPair(true)}
              />
              Yes
            </label>

            <label className="radio-line">
              <input
                type="radio"
                name="aupair"
                value="false"
                checked={auPair === false}
                onChange={() => setAuPair(false)}
              />
              No
            </label>
          </div>
        </div>

        </div>
        {auPair && (
          <HostingFamily family={family} onChange={updateFamily} />
        )}

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="start-btn" disabled={loading}>
          {loading ? "Loading..." : "Begin the test"}
        </button>
      </form>
    </div>
  );
}
