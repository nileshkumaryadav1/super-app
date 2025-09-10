// app/api/message/send/route.js
import connectDB from "@/lib/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { chatId, senderId, text } = await req.json();
  await connectDB();
  const message = await Message.create({ chatId, sender: senderId, text });
  return NextResponse.json({ message });
}
