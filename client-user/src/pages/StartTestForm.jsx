// src/pages/StartTestForm.jsx
import { useState } from "react";
import { startTest } from "../api/publicApi";

export default function StartTestForm({ onSuccess }) {
  const [form, setForm] = useState({
    email: "",
    name: "",
    lastname: "",
    aupair: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await startTest(form);
      // Optionnel : stocker dans localStorage si tu veux
      localStorage.setItem("testId", res.testId);
      localStorage.setItem("sessionToken", res.sessionToken);

      onSuccess({ testId: res.testId, sessionToken: res.sessionToken });
    } catch (err) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Démarrer le test de français</h1>
      <p className="mb-4 text-sm text-gray-600">
        Merci de renseigner vos informations avant de commencer le test.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="email"
          type="email"
          placeholder="Adresse email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <input
          name="name"
          type="text"
          placeholder="Prénom"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <input
          name="lastname"
          type="text"
          placeholder="Nom"
          value={form.lastname}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="aupair"
            checked={form.aupair}
            onChange={handleChange}
          />
          Je suis jeune au pair
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Démarrage..." : "Commencer le test"}
        </button>
      </form>
    </div>
  );
}
