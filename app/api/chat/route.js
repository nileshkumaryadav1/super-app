// app/api/chat/route.js
import connectDB from "@/lib/db";
import Chat from "@/models/Chat";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { userIds } = await req.json(); // array of 2 user IDs
  await connectDB();
  let chat = await Chat.findOne({ members: { $all: userIds } });
  if (!chat) {
    chat = await Chat.create({ members: userIds });
  }
  return NextResponse.json({ chat });
}
