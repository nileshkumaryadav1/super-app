// app/api/message/route.js
import connectDB from "@/lib/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");
  await connectDB();
  const messages = await Message.find({ chatId }).populate("sender", "name");
  return NextResponse.json({ messages });
}
