import { NextResponse } from "next/server";
import axios from "axios";

import SearchLog from "@/models/SearchLog";
import connectDB from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();

    const { query, email } = await req.json();

    if (!query) {
      return NextResponse.json({ answer: "No query provided" }, { status: 400 });
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

    // Save log with email
    await SearchLog.create({ query, answer, email: email || null });

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("DeepSeek API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { answer: "⚠️ DeepSeek API error, please try again later." },
      { status: 500 }
    );
  }
}
