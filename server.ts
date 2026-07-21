import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy load Gemini API to avoid startup crashes if key is unconfigured
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY" || key === "") {
      throw new Error("GEMINI_API_KEY is not configured. Please supply your key in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API healthcheck endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Post endpoint for bespoke digital certificate dedication texts
app.post("/api/dedication", async (req, res) => {
  try {
    const { ownerName, accessoryName, material, tone } = req.body;
    
    if (!ownerName || !accessoryName) {
      return res.status(400).json({ error: "Missing required registration parameters." });
    }

    const client = getGeminiClient();
    
    const materialLabelMap: Record<string, string> = {
      gold: "24K Sovereign Gold Alloy",
      silver: "Chiseled Solid Sterling Silver .925",
      emerald: "Urushi Emerald Lacquer over Solid Brass",
      damascus: "Pattern-Welded Damascus Steel",
      obsidian: "Obsidian Titanium PVD Coating",
    };

    const toneDescription = tone === "poetic" 
      ? "a lyrical poetic couplet/verse of acoustic light and fire" 
      : tone === "artisan" 
        ? "a detailed, technical-luxury workshop entry notes from the master metalsmith detailing physical acoustics and craftsmanship"
        : "a stately, timeless lineage legacy text fit for an heirloom bequeathal";

    const prompt = `Write a bespoke certificate dedication for Patron ${ownerName}, who has registered their custom "${accessoryName}" hand-fashioned with ${materialLabelMap[material] || material}. The desired stylistic tone is: ${toneDescription}. Refer specifically to the owner's name and the accessory name. Keep it short (2 to 3 sentences max) but exceptionally high-end, atmospheric, and inspiring.`;

    const systemInstruction = `You are the master brand copywriter and chief of acoustics at Maison LUXURE, an ultra-luxurious French boutique based in Place Vendôme, Paris. Famed for hand-sculpting the acoustic and visual singularity of fire. 
Write a highly elegant, personalized, short, atmospheric, 2-3 sentence dedication verse or prose of structural and acoustic provenance. 
The tone must be extremely luxurious, historic, refined, and professional. Use words of sophisticated caliber (e.g. "provenance", "alchemy", "resonance", "lineage", "bequeath", "artistry", "luminescence"). 
Do not use markdown formatting like bold, asterisks, or bullet points in the output. Provide only the text of the dedication.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.85,
      },
    });

    const text = response.text?.trim() || "";
    const serialNumber = `LX-${material.slice(0,2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    res.json({
      text,
      serialNumber,
    });
  } catch (err: any) {
    console.warn("[Gemini Dedication Error] Fallback triggered:", err.message);
    // Return gracefully to let client trigger its beautiful fallback certificate
    res.status(500).json({ 
      error: err.message || "Gemini unavailable",
      fallback: true 
    });
  }
});

// Configure Vite or production serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[LUXURE Server] running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

setupServer();
