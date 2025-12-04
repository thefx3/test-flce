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

export async function fetchQuestionsOPEN() {
  const res = await fetch(`${API_BASE}/questions/OPEN`);
  if (!res.ok) {
    throw new Error("Erreur while fetching open questions");
  }
  return res.json(); // [{ id, type, text, mediaUrl, order }, ...]
}

// 1. Liste des vidéos
export async function fetchVideoList() {
  const res = await fetch(`${API_BASE}/videos`);
  if (!res.ok) throw new Error("Cannot fetch video list");
  return res.json();
}

// 2. Questions d'une vidéo
export async function fetchVideoQuestions(videoId) {
  const res = await fetch(`${API_BASE}/videos/${videoId}/questions`);
  if (!res.ok) throw new Error("Cannot fetch video questions");
  return res.json();
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

export async function autoCorrect(testId, sessionToken) {
  const res = await fetch(`${API_BASE}/tests/${testId}/grade-auto`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-test-session-id": sessionToken,
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erreur while auto-correcting");
  }
  return res.json();
}

export async function submitComment(testId, comment, sessionToken) {
  const res = await fetch(`${API_BASE}/tests/${testId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-test-session-id": sessionToken,
    },
    body: JSON.stringify({ comment }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erreur while submitting comment");
  }

  return res.json();
}
