// controllers/aiController.js
// Handles the AI assistant endpoint.
//
//   POST /api/ai/ask
//
// Flow:
//   1. Extract the user's message from req.body
//   2. Search the Resource collection for keyword matches
//   3. Build a prompt including the matching resources
//   4. Call Hugging Face Inference API (OpenAI-compatible) and return the response
//   5. If the call fails, return a graceful fallback message

const Resource = require("../models/Resource");

// Hugging Face Inference Router endpoint (OpenAI-compatible)
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";

// Model and provider combination confirmed to work with this account
const HF_MODEL = "openai/gpt-oss-20b:groq";

// ---------------------------------------------------------------
// askAI — POST /api/ai/ask
// Protected. Accepts a message, queries resources, calls HF API.
// ---------------------------------------------------------------
const askAI = async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ message: "Message is required" });
  }

  let matchingResources = [];

  try {
    // --- Step 1: Search resources using keyword matching ---
    // Split the user's message into individual words and search across
    // title, subject, description, department, and resourceType fields
    const keywords = message.trim().split(/\s+/).filter((w) => w.length > 2);

    // Build a $or query with $regex for each keyword across multiple fields
    const orConditions = [];
    keywords.forEach((keyword) => {
      orConditions.push({ title:        { $regex: keyword, $options: "i" } });
      orConditions.push({ subject:      { $regex: keyword, $options: "i" } });
      orConditions.push({ description:  { $regex: keyword, $options: "i" } });
      orConditions.push({ department:   { $regex: keyword, $options: "i" } });
      orConditions.push({ resourceType: { $regex: keyword, $options: "i" } });
    });

    if (orConditions.length > 0) {
      matchingResources = await Resource.find({ $or: orConditions })
        .limit(5)
        .select("title subject resourceType department year semester description");
    }
  } catch (dbError) {
    console.error("Resource search error:", dbError.message);
    // Continue even if resource search fails — AI can still answer
  }

  // --- Step 2: Build the prompt ---
  let prompt;

  if (matchingResources.length > 0) {
    const resourceList = matchingResources
      .map(
        (r, i) =>
          `${i + 1}. "${r.title}" — Subject: ${r.subject}, Type: ${r.resourceType}, Dept: ${r.department}, Year ${r.year} Sem ${r.semester}`
      )
      .join("\n");

    prompt = `You are EduNest AI, a helpful academic assistant for college students. A student asked: "${message}". Here are relevant resources found in the repository:\n${resourceList}\nProvide a helpful, concise academic response and mention the relevant resources by name where appropriate.`;
  } else {
    prompt = `You are EduNest AI, a helpful academic assistant for college students. A student asked: "${message}". No specific resources were found in the repository for this query. Provide a helpful, concise general academic response.`;
  }

  // --- Step 3: Call Hugging Face Inference API ---
  try {
    if (!process.env.HF_TOKEN) {
      throw new Error("HF_TOKEN is not configured");
    }

    // Use native Node.js fetch (available in Node 18+)
    // Do NOT log or expose process.env.HF_TOKEN
    const hfResponse = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Token is read from .env — never logged or returned to client
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: [
          { role: "user", content: prompt },
        ],
      }),
    });

    // Handle non-2xx HTTP responses from Hugging Face
    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error(`Hugging Face API HTTP ${hfResponse.status}:`, errorText);
      throw new Error(`Hugging Face API returned status ${hfResponse.status}`);
    }

    const data = await hfResponse.json();

    // Parse the OpenAI-compatible response: choices[0].message.content
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("Hugging Face returned empty or malformed response:", JSON.stringify(data));
      throw new Error("Empty response from Hugging Face API");
    }

    return res.status(200).json({
      reply,
      resources: matchingResources,
    });

  } catch (aiError) {
    console.error("AI API error:", aiError.message);

    // Return graceful fallback — never expose the token or internal details
    return res.status(200).json({
      reply: "AI assistant is currently unavailable. Please try again later.",
      resources: matchingResources,
    });
  }
};

module.exports = { askAI };
