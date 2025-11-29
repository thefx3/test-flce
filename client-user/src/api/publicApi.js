// src/api/publicApi.js
const API_BASE = "http://localhost:3000/public";

export async function startTest(data) {
  const res = await fetch(`${API_BASE}/start-test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error while ");
  }

  return res.json(); // { userId, testId, sessionToken }
}

export async function fetchQuestionsQCM() {
  const res = await fetch(`${API_BASE}/questions/QCM`);

  if (!res.ok) {
    throw new Error("Erreur while fetching qcm questions");
  }

  return res.json(); // [{ id, type, text, mediaUrl, order }, ...]
}

export async function fetchQuestionsVIDEO() {
  const res = await fetch(`${API_BASE}/questions/VIDEO`);

  if (!res.ok) {
    throw new Error("Erreur while fetching video questions");
  }

  return res.json(); // [{ id, type, text, mediaUrl, order }, ...]
}

export async function fetchQuestionsOPEN() {
  const res = await fetch(`${API_BASE}/questions/OPEN`);

  if (!res.ok) {
    throw new Error("Erreur while fetching open questions");
  }

  return res.json(); // [{ id, type, text, mediaUrl, order }, ...]
}

export async function fetchVideosWithQuestions() {
  const res = await fetch(`${API_BASE}/questions/videos`);

  if (!res.ok) {
    throw new Error("Erreur while fetching questions & videos");
  }

  return res.json(); // [{ id, type, text, mediaUrl, order }, ...]
}

export async function submitResponses(testId, responses, sessionToken) {
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
    throw new Error(err.message || "Erreur while submitting responses");
  }

  return res.json();
}
