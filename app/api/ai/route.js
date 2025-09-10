// deepseek
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { answer: "No query provided" },
        { status: 400 }
      );
    }

    // Call DeepSeek V3 via OpenRouter
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: query }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const answer = response.data.choices?.[0]?.message?.content || "No answer";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("DeepSeek API Error:", error.response?.data || error.message);

    return NextResponse.json(
      { answer: "⚠️ DeepSeek API error, please try again later." },
      { status: 500 }
    );
  }
}

// gemini
// // app/api/ai/route.js
// import { NextResponse } from "next/server";
// import OpenAI from "openai"; // DeepSeek uses OpenAI SDK
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const query = searchParams.get("query");

//   if (!query) {
//     return NextResponse.json({ error: "Missing query" }, { status: 400 });
//   }

//   // DeepSeek client (primary)
//   const deepseek = new OpenAI({
//     apiKey: process.env.DEEPSEEK_API_KEY,
//     baseURL: "https://api.deepseek.com",
//   });

//   // Gemini client (fallback)
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   try {
//     // Try DeepSeek first
//     const dsRes = await deepseek.chat.completions.create({
//       model: "deepseek-chat",
//       messages: [{ role: "user", content: query }],
//     });

//     const answer = dsRes.choices[0].message.content;
//     return NextResponse.json({ source: "deepseek", answer });
//   } catch (err) {
//     console.error("DeepSeek failed, switching to Gemini:", err.message);

//     try {
//       const geminiRes = await geminiModel.generateContent(query);
//       const answer = geminiRes.response.text();
//       return NextResponse.json({ source: "gemini", answer });
//     } catch (err2) {
//       console.error("Gemini also failed:", err2.message);
//       return NextResponse.json(
//         { error: "All AI providers failed. Please try again later." },
//         { status: 500 }
//       );
//     }
//   }
// }

// combine
// app/api/ai/route.js
// import { NextResponse } from "next/server";
// import OpenAI from "openai"; // for DeepSeek
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const query = searchParams.get("query");

//   if (!query) {
//     return NextResponse.json({ error: "Missing query" }, { status: 400 });
//   }

//   // DeepSeek client
//   const deepseek = new OpenAI({
//     apiKey: process.env.DEEPSEEK_API_KEY,
//     baseURL: "https://api.deepseek.com",
//   });

//   // Gemini client
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   let deepseekAnswer = null;
//   let geminiAnswer = null;

//   try {
//     const dsRes = await deepseek.chat.completions.create({
//       model: "deepseek-chat",
//       messages: [{ role: "user", content: query }],
//     });
//     deepseekAnswer = dsRes.choices[0].message.content;
//   } catch (err) {
//     console.error("DeepSeek failed:", err.message);
//   }

//   try {
//     const geminiRes = await geminiModel.generateContent(query);
//     geminiAnswer = geminiRes.response.text();
//   } catch (err) {
//     console.error("Gemini failed:", err.message);
//   }

//   // Combine response
//   return NextResponse.json({
//     deepseek: deepseekAnswer || "DeepSeek unavailable",
//     gemini: geminiAnswer || "Gemini unavailable",
//     combined:
//       (deepseekAnswer ? "🟢 DeepSeek:\n" + deepseekAnswer : "") +
//       "\n\n" +
//       (geminiAnswer ? "🔵 Gemini:\n" + geminiAnswer : ""),
//   });
// }
