// src/api/publicApi.js
const API_BASE = "http://localhost:3000/public";

export async function startTest(data) {
  const res = await fetch(`${API_BASE}/start-test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erreur lors du démarrage du test");
  }

  return res.json(); // { userId, testId, sessionToken }
}

export async function fetchQuestions() {
  const res = await fetch(`${API_BASE}/questions`);

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des questions");
  }

  return res.json(); // [{ id, type, text, mediaUrl, order }, ...]
}

export async function submitResponses(testId, sessionToken, responses) {
  const res = await fetch(`${API_BASE}/tests/${testId}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-test-session-id": sessionToken,
    },
    body: JSON.stringify(responses),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erreur lors de l'envoi des réponses");
  }

  return res.json();
}
