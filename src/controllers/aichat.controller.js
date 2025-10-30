const axios = require("axios");
const fs = require("fs");
const path = require("path");

// const fashionhubDataPath = path.join(__dirname, "..", "FashionHub.json");
const fashionhubDataPath = path.join(__dirname, "..", "src", "FashionHub.json");
let fashionhubData = {};

try {
  const data = fs.readFileSync(fashionhubDataPath, "utf-8");
  fashionhubData = JSON.parse(data);
  console.log("✅ FashionHub knowledge base loaded successfully.");
} catch (err) {
  console.error("❌ Error loading FashionHub.json:", err.message);
}

// 🔍 Function: find answer from FashionHub.json
function findAnswerInJSON(userMessage) {
  if (!fashionhubData || !fashionhubData.faq) return null;

  const normalizedMsg = userMessage.toLowerCase().trim();
  let bestMatch = null;
  let highestScore = 0;

  for (const item of fashionhubData.faq) {
    const question = item.question.toLowerCase();

    // Exact match
    if (normalizedMsg === question) return item.answer;

    // Similarity check
    const msgWords = normalizedMsg.split(" ").filter((w) => w.length > 2);
    const qWords = question.split(" ").filter((w) => w.length > 2);
    const commonWords = msgWords.filter((w) => qWords.includes(w));

    const score = commonWords.length / Math.max(msgWords.length, qWords.length);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item.answer;
    }
  }

  return highestScore >= 0.5 ? bestMatch : null;
}

// 🧠 In-memory conversation history
const userConversations = new Map();

// 💬 Chat Controller
exports.chatWithAI = async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Retrieve or initialize conversation history
    if (!userConversations.has(sessionId)) userConversations.set(sessionId, []);
    const conversation = userConversations.get(sessionId);

    // Save user message
    conversation.push({ role: "user", content: message });

    const lowerMsg = message.toLowerCase();

    // Step 1: Detect if related to FashionHub
    const isFashionHubRelated =
      lowerMsg.includes("fashionhub") ||
      lowerMsg.includes("fashion hub") ||
      lowerMsg.includes("product") ||
      lowerMsg.includes("offer") ||
      lowerMsg.includes("service") ||
      lowerMsg.includes("delivery") ||
      lowerMsg.includes("payment") ||
      lowerMsg.includes("owner") ||
      lowerMsg.includes("order") ||
      lowerMsg.includes("discount");

    // Step 2: Try to find answer in FashionHub.json
    if (isFashionHubRelated) {
      const localAnswer = findAnswerInJSON(message);
      if (localAnswer) {
        console.log("📚 Answer found in FashionHub.json");
        conversation.push({ role: "assistant", content: localAnswer });
        return res.json({ reply: localAnswer });
      } else {
        console.log("⚠️ Related to FashionHub but not found in JSON — fallback to AI.");
      }
    } else {
      console.log("🌍 Not FashionHub-related — using OpenRouter AI.");
    }

    // Step 3: Send entire conversation to OpenRouter
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a friendly and intelligent AI stylist for the FashionHub e-commerce website. If the question is about FashionHub, answer factually about its products, offers, and policies. Otherwise, give a helpful and conversational general response. Always reply in plain text — no markdown, no **, *, _, -, or emojis.",
          },
          ...conversation,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let botReply =
      response.data.choices?.[0]?.message?.content ||
      "Sorry, I couldn’t generate a response.";

    // Clean markdown/emojis
    botReply = botReply
      .replace(/\*\*/g, "")
      .replace(/[*_`#>]/g, "")
      .replace(/[-•]/g, "")
      .replace(/:\w+:/g, "")
      .replace(/[\u{1F600}-\u{1F64F}]/gu, "")
      .replace(/\n{2,}/g, "\n")
      .trim();

    // Save bot reply in conversation
    conversation.push({ role: "assistant", content: botReply });

    res.json({ reply: botReply });
  } catch (error) {
    console.error("❌ Error from OpenRouter:", error?.response?.data || error.message);
    res.status(500).json({
      error: "Failed to get response from OpenRouter",
      details: error?.response?.data || error.message,
    });
  }
};
