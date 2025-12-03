// utils/loadTestData.js
import fs from "fs";
import path from "path";
import prisma from "../prisma/prisma.js";

function readJson(relativePath) {
  const absolutePath = path.join(process.cwd(), relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

/* PART 1 – QCM */
export async function loadQcmQuestions() {
  try {
    const qcm = await prisma.question.findMany({
      where: { type: "QCM", videoId: null },
      orderBy: { order: "asc" }
    });
    if (qcm.length > 0) return qcm;
  } catch {}

  return readJson("server/data/tests/qcm.json");
}

/* PART 2 – VIDEO + QUESTIONS */
export async function loadVideoQuestions() {
  try {
    const videos = await prisma.video.findMany({
      include: { questions: true },
      orderBy: { videoId: "asc" }
    });
    if (videos.length > 0) return withLocalVideoUrls(videos);
  } catch {}

  return withLocalVideoUrls(readJson("server/data/tests/videos.json"));
}

/* PART 3 – OPEN */
export async function loadOpenQuestions() {
  try {
    const open = await prisma.question.findMany({
      where: { type: "OPEN", videoId: null },
      orderBy: { order: "asc" }
    });
    if (open.length > 0) return open;
  } catch {}

  return readJson("server/data/tests/open.json");
}
