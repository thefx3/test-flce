// src/pages/StartTestForm.jsx
import { useState } from "react";
import { startTest } from "../api/publicApi";
import PersonnalInfos from "../components/PersonnalInfos";
import HostingFamily from "../components/HostingFamily";
import "../components/StartTestForm.css"

export default function StartTestForm({ onSuccess }) {
  const [auPair, setAuPair] = useState(false);
  const [firstRegister, setFirstRegister] = useState(null);

  const [form, setForm] = useState({
    email: "",
    name: "",
    lastname: "",
    civility: "",
    phone: "",
    birthdate: "",
    birthplace: "",
    nationality: "",
    aupair: false,

    address_number: "",
    address_street: "",
    address_city: "",
    address_zipcode: "",
    address_country: "",
  });

  const [family, setFamily] = useState({
    familyname1: "",
    familyname2: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleForm(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleFamily(e) {
    const { name, value } = e.target;
    setFamily(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        aupair: auPair,
        firstregister: firstRegister,
        family: auPair ? family : null,
      };

      const res = await startTest(payload);

      onSuccess({
        testId: res.testId,
        sessionToken: res.sessionToken
      });
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="start-form" onSubmit={handleSubmit}>
      <h2 className="section-title">Your Information</h2>

      <PersonnalInfos form={form} onChange={handleForm} />

      {/* First Registration */}
      <div className="form-section">
        <p className="section-label">Is it your first registration at La CLEF?</p>

        <label className="radio-line">
          <input
            type="radio"
            name="firstregister"
            value="true"
            checked={firstRegister === "true"}
            onChange={() => setFirstRegister("true")}
          />
          Yes
        </label>

        <label className="radio-line">
          <input
            type="radio"
            name="firstregister"
            value="false"
            checked={firstRegister === "false"}
            onChange={() => setFirstRegister("false")}
          />
          No
        </label>
      </div>

      {/* Au Pair */}
      <div className="form-section">
        <p className="section-label">Are you an Au Pair?</p>

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

      {auPair && (
        <HostingFamily family={family} onChange={handleFamily} />
      )}

      {error && <p className="form-error">{error}</p>}

      <button className="submit-btn" disabled={loading}>
        {loading ? "Loading..." : "Start the test"}
      </button>
    </form>
  );
}
