export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    const { prompt, imageBase64, mode } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY in Vercel Environment Variables." });
    }

    let systemPrompt = "You are StudyNova Lab AI Coach. Reply in Vietnamese unless the user asks otherwise.";

    if (mode === "vocab_image") {
      systemPrompt = "You convert vocabulary images into StudyNova Lab quick-import format. Output only lines in this exact format: term | meaning | topic | type | level | example | collocations | IELTS Writing example | IELTS Speaking example. Keep meanings in Vietnamese and examples natural for IELTS.";
    } else if (mode === "writing") {
      systemPrompt = "You are an IELTS Writing coach. Give concise but useful feedback in Vietnamese: estimated band, main mistakes, corrected sentences, improved version, and vocabulary/chunks to learn.";
    } else if (mode === "speaking") {
      systemPrompt = "You are an IELTS Speaking coach. Give feedback in Vietnamese on fluency, vocabulary, grammar, pronunciation suggestions, and provide a better sample answer.";
    }

    const content = [];
    content.push({ type: "input_text", text: `${systemPrompt}\n\n${prompt || "Help me study IELTS."}` });

    if (imageBase64) {
      content.push({ type: "input_image", image_url: imageBase64 });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [{ role: "user", content }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "OpenAI API error",
        details: data
      });
    }

    const text = data.output_text ||
      (data.output || [])
        .flatMap(item => item.content || [])
        .map(part => part.text || "")
        .filter(Boolean)
        .join("\n") || "";

    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
