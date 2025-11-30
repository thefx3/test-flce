import { useState } from "react";
import PersonnalInfos from "../components/PersonnalInfos";
import HostingFamily from "../components/HostingFamily";
import { startTest } from "../api/publicApi";
import "../components/TestForm.css";

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

        // numeric fields
        phone: form.phone.trim() ? Number(form.phone.trim()) : null,
        address_number: form.address_number.trim()
          ? Number(form.address_number.trim())
          : null,
        address_zipcode: form.address_zipcode.trim()
          ? Number(form.address_zipcode.trim())
          : null,

        // date fields
        birthdate: form.birthdate || null,
        arrival_date: form.arrival_date || null,

        // options
        aupair: auPair,
        firstregister: firstRegister,

        family: auPair
          ? {
              ...family,
              phone: family.phone.trim() ? Number(family.phone.trim()) : null,
            }
          : null,
      };

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
    <div className="test-wrapper">
      <h1 className="start-title">Informations Details</h1>

      <div className="form-section first-section">
        <p className="instructions">
          Please fill in your personal information to begin the placement test.
        </p>
      </div>

      <form className="start-form" onSubmit={handleSubmit}>
        <PersonnalInfos form={form} onChange={updateForm} />

        <div className="form-boolean">
          <div className="form-section">
            <label className="section-label">
              Is it your first registration at La CLEF?
            </label>

            <div className="radio-group">
              <label className="radio-line">
                <input
                  type="radio"
                  checked={firstRegister === true}
                  onChange={() => setFirstRegister(true)}
                />
                Yes
              </label>

              <label className="radio-line">
                <input
                  type="radio"
                  checked={firstRegister === false}
                  onChange={() => setFirstRegister(false)}
                />
                No
              </label>
            </div>
          </div>

          <div className="form-section">
            <label className="section-label">Are you an Au Pair?</label>

            <div className="radio-group">
              <label className="radio-line">
                <input
                  type="radio"
                  checked={auPair === true}
                  onChange={() => setAuPair(true)}
                />
                Yes
              </label>

              <label className="radio-line">
                <input
                  type="radio"
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
