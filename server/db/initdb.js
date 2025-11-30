import prisma from "../prisma/prisma.js";

export async function initDb() {
  console.log("🔄 Checking existing questions…");

  const intendedCount = 32; // nombre exact de questions dans ton seed
  const existingCount = await prisma.question.count();

  // Si mismatch → wipe et reseed
  if (existingCount !== intendedCount) {
    console.log(`⚠️ Detected mismatch (${existingCount} existing vs ${intendedCount} expected).`);
    console.log("🧨 Clearing all questions + videos…");

    await prisma.testResponse.deleteMany();
    await prisma.test.deleteMany();
    await prisma.question.deleteMany();
    await prisma.video.deleteMany();

    console.log("✔ Database cleaned.");
  } else {
    console.log("➡️ Correct number of questions already present. Skipping seeding.");
    return;
  }

  // ------------------------------
  // 1. CREATE THE VIDEO ENTRY
  // ------------------------------
  const defaultVideo1 = await prisma.video.create({
    data: {
      url: "https://cyziosjggxrlajefzyzd.supabase.co/storage/v1/object/public/videos/Legends%20Never%20Die%20-%20Avengers%20Infinity%20War.mp4",
      title: "Legends Never Die",
    },
  });

  console.log(`🎬 Video 1 created with ID ${defaultVideo1.videoId}`);

  const defaultVideo2 = await prisma.video.create({
    data: {
      url: "https://cyziosjggxrlajefzyzd.supabase.co/storage/v1/object/public/videos/Warriors%20-%20League%20of%20Legends.mp4",
      title: "Warriors",
    },
  });

  console.log(`🎬 Video 2 created with ID ${defaultVideo2.videoId}`);

  // ------------------------------
  // 2. ALL QUESTIONS
  // ------------------------------

  const questions = [
    // -----------------------------
    // PARTIE 1 — QCM Grammaire
    // -----------------------------
    {
      order: 1,
      type: "QCM",
      text: "Il a invité Jean-Pierre. {{BLANK}} un ami de sa soeur.",
      choices: ["Il est", "Elle est", "C'est", "Lequel"],
      correctText: "C'est",
    },
    {
      order: 2,
      type: "QCM",
      text: "Sur la Côte d'Azur, il {{BLANK}} toujours beau.",
      choices: ["y a", "est", "fait", "faire"],
      correctText: "fait",
    },
    {
      order: 3,
      type: "QCM",
      text: "Achète-moi un paquet {{BLANK}} cigarettes, s'il te plaît.",
      choices: ["des", "de", "pour", "de les"],
      correctText: "de",
    },
    {
      order: 4,
      type: "QCM",
      text: "Elle se promène {{BLANK}} la rue.",
      choices: ["par", "dans", "sur", "pour"],
      correctText: "dans",
    },
    {
      order: 5,
      type: "QCM",
      text: "À midi, elle et moi {{BLANK}} dans un petit café.",
      choices: ["déjeunent", "déjeunons", "déjeune", "dînons"],
      correctText: "déjeunons",
    },
    {
      order: 6,
      type: "QCM",
      text: "Elle m'a beaucoup parlé de {{BLANK}} projets d'avenir.",
      choices: ["son", "leur", "ses", "sa"],
      correctText: "ses",
    },
    {
      order: 7,
      type: "QCM",
      text: "J'{{BLANK}} une douche avant de me coucher.",
      choices: ["ai fait", "ai eu", "avais", "ai pris"],
      correctText: "ai pris",
    },
    {
      order: 8,
      type: "QCM",
      text: "Jean-Pierre, je {{BLANK}} connais depuis 15 ans.",
      choices: ["le", "lui", "nous", "se"],
      correctText: "le",
    },
    {
      order: 9,
      type: "QCM",
      text: "Ils {{BLANK}} à l'aéroport en voiture.",
      choices: ["ont venu", "sont roulé", "sont allés", "ont conduit"],
      correctText: "sont allés",
    },
    {
      order: 10,
      type: "QCM",
      text: "Comme il n'était pas chez lui, elle {{BLANK}} un message.",
      choices: ["laissait", "a laissé", "laisse", "laisserait"],
      correctText: "a laissé",
    },
    {
      order: 11,
      type: "QCM",
      text: "Elle s'est trompée… elle a fait {{BLANK}} de ses parents.",
      choices: ["celui", "celui-là", "lequel", "ceux"],
      correctText: "celui",
    },
    {
      order: 12,
      type: "QCM",
      text: "Il a mangé tout le gâteau {{BLANK}} était sur la table !",
      choices: ["qui", "que", "lequel", "qu'il"],
      correctText: "qui",
    },
    {
      order: 13,
      type: "QCM",
      text: "Je ne savais pas que Pascal s'intéressait {{BLANK}} ces questions.",
      choices: ["à", "de", "pour", "concernant"],
      correctText: "à",
    },
    {
      order: 14,
      type: "QCM",
      text: "Il est minuit, et je suis {{BLANK}} d'appeler si tard.",
      choices: ["ennuyeuse", "dérangeante", "impossible", "ennuyée"],
      correctText: "ennuyée",
    },
    {
      order: 15,
      type: "QCM",
      text: "Il n'a pas reconnu mon frère sur la photo que je lui ai {{BLANK}}.",
      choices: ["montrais", "montrer", "montré", "montrée"],
      correctText: "montrée",
    },
    {
      order: 16,
      type: "QCM",
      text: "Il m'a montré un article de journal qui {{BLANK}} l'agriculture au Mali.",
      choices: ["parle de", "écrit sur", "s'agit de", "raconte sur"],
      correctText: "parle de",
    },
    {
      order: 17,
      type: "QCM",
      text: "Il m'a dit qu'il ne {{BLANK}} pas partir en vacances au bord de la mer.",
      choices: ["voudra", "veuille", "voudrait", "voulait"],
      correctText: "voulait",
    },
    {
      order: 18,
      type: "QCM",
      text: "Il ne veut pas que ses enfants {{BLANK}} du théâtre.",
      choices: ["feront", "fassent", "font", "feraient"],
      correctText: "fassent",
    },
    {
      order: 19,
      type: "QCM",
      text: "Il y a longtemps que je ne t'ai pas téléphoné mais j'ai {{BLANK}} beaucoup pensé à toi.",
      choices: ["au fait", "quand même", "alors", "comme même"],
      correctText: "quand même",
    },
    {
      order: 20,
      type: "QCM",
      text: "Quand l'homme au manteau blanc eut terminé son café, il {{BLANK}} brusquement.",
      choices: ["se leva", "se lève", "s'est levé", "se fut levé"],
      correctText: "se leva",
    },

    // -----------------------------
    // PARTIE 2 — QUESTIONS VIDÉO
    // -----------------------------
    {
      order: 21,
      type: "VIDEO",
      text: "Les étudiantes sont {{BLANK}}.",
      choices: ["Allemandes", "Anglaises", "Mexicaines"],
      correctText: "Mexicaines",
      videoId: defaultVideo1.videoId,
    },
    {
      order: 22,
      type: "VIDEO",
      text: "Il y a cours {{BLANK}}.",
      choices: ["5h par semaine", "6h par semaine", "8h par semaine"],
      correctText: "6h par semaine",
      videoId: defaultVideo1.videoId,
    },
    {
      order: 23,
      type: "VIDEO",
      text: "Les cours {{BLANK}}.",
      choices: ["ont commencé", "commencent bientôt", "on ne sait pas"],
      correctText: "commencent bientôt",
      videoId: defaultVideo1.videoId,
    },
    {
      order: 24,
      type: "VIDEO",
      text: "Le prix est de {{BLANK}}.",
      choices: ["2000 euros", "1700 euros", "1600 euros"],
      correctText: "1600 euros",
      videoId: defaultVideo2.videoId,
    },
    {
      order: 25,
      type: "VIDEO",
      text: "La personne au téléphone cherche {{BLANK}}.",
      choices: ["des cours de musique", "des cours de français", "des cours de danse"],
      correctText: "des cours de français",
      videoId: defaultVideo2.videoId,
    },
    {
      order: 26,
      type: "VIDEO",
      text: "L'étudiante fait {{BLANK}}.",
      choices: ["de la guitare", "de la danse", "du sport"],
      correctText: "de la danse",
      videoId: defaultVideo2.videoId,
    },

    // Question ouverte liée à la vidéo
    {
      order: 27,
      type: "OPEN",
      text: "Expliquez en une phrase le problème de la dame à la fin de la vidéo.",
      choices: [],
      correctText: null,
      videoId: defaultVideo2.videoId,
    },

    // -----------------------------
    // PARTIE 3 — QUESTIONS OUVERTES
    // -----------------------------
    {
      order: 28,
      type: "OPEN",
      text: "Est-ce que vous préférez les vacances calmes, culturelles ou pleines d'aventures ? Pourquoi ?",
      choices: [],
      correctText: null,
    },
    {
      order: 29,
      type: "OPEN",
      text: "Qu'avez-vous fait le week-end dernier ? Racontez ! (400 caractères max)",
      choices: [],
      correctText: null,
    },
    {
      order: 30,
      type: "OPEN",
      text: "Qu'est-ce que vous adoriez faire quand vous étiez petit ? (400 caractères max)",
      choices: [],
      correctText: null,
    },
    {
      order: 31,
      type: "OPEN",
      text: "Si vous pouviez voler comme un oiseau, où iriez-vous et que feriez-vous ? (400 caractères max)",
      choices: [],
      correctText: null,
    },
    {
      order: 32,
      type: "OPEN",
      text: "À votre avis, qu'est-ce que les gens devraient faire pour bien vivre dans votre pays ?",
      choices: [],
      correctText: null,
    },

  ];

  // Insert final
  await prisma.question.createMany({
    data: questions.map(q => ({
      order: q.order,
      type: q.type,
      text: q.text,
      choices: q.choices ?? [],
      correctText: q.correctText ?? null,
      correctBool: null,
      points: 1,
      videoId: q.videoId ?? null,
    })),
  });

  console.log("✔ All questions successfully inserted.");
}
