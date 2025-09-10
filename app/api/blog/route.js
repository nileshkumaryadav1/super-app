import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 }); // latest first
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json(
      { message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { title, imageUrl, content, author } = await req.json();

    if (!title || !content || !author) {
      return NextResponse.json(
        { message: "Title, content, and author are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const blog = new Blog({ title, imageUrl, content, author });
    await blog.save();

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    console.error("POST /api/blog error:", error);
    return NextResponse.json(
      { message: "Failed to create blog" },
      { status: 500 }
    );
  }
}
