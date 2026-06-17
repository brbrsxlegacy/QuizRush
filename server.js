import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function cleanJson(text) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, app: "QuizRush AI MAX" });
});

app.post("/api/generate-quiz", async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "GROQ_API_KEY eksik. .env dosyasına key ekle."
      });
    }

    const topic = String(req.body.topic || "Genel Kültür").slice(0, 120);
    const grade = String(req.body.grade || "6").slice(0, 20);
    const count = Math.min(Math.max(Number(req.body.count || 8), 3), 20);
    const difficulty = String(req.body.difficulty || "orta").slice(0, 20);

    const prompt = `
${grade}. sınıf seviyesinde "${topic}" konusu için ${count} adet çoktan seçmeli quiz sorusu üret.
Zorluk: ${difficulty}.

Sadece geçerli JSON döndür. Açıklama yazma.
Şema:
{
  "title": "Kısa quiz başlığı",
  "questions": [
    {
      "question": "Soru metni",
      "answers": ["A şıkkı", "B şıkkı", "C şıkkı", "D şıkkı"],
      "correct": 0,
      "explanation": "1 cümle kısa açıklama"
    }
  ]
}

Kurallar:
- Her soruda 4 cevap olsun.
- correct 0,1,2,3 değerlerinden biri olsun.
- Sorular Türkçe olsun.
- Yanlış şıklar mantıklı ama doğru cevaptan net ayrı olsun.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.55,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Sen güvenilir ve net quiz soruları hazırlayan bir eğitim asistanısın." },
        { role: "user", content: prompt }
      ]
    });

    const raw = cleanJson(completion.choices?.[0]?.message?.content || "{}");
    let parsed = JSON.parse(raw);

    if (!Array.isArray(parsed.questions)) throw new Error("AI geçerli questions listesi döndürmedi.");

    parsed.questions = parsed.questions.slice(0, count).map((q, i) => ({
      question: String(q.question || `Soru ${i + 1}`),
      answers: Array.isArray(q.answers) && q.answers.length === 4 ? q.answers.map(String) : ["A", "B", "C", "D"],
      correct: Number.isInteger(q.correct) && q.correct >= 0 && q.correct <= 3 ? q.correct : 0,
      explanation: String(q.explanation || "")
    }));

    res.json({ success: true, quiz: parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message || "AI soru üretirken hata oldu." });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`QuizRush AI MAX çalışıyor: http://localhost:${process.env.PORT || 3000}`);
});
