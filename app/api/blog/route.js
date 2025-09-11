import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

// helper to create slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
    .trim()
    .split(/\s+/)
    .slice(0, 6) // limit max 6 words
    .join("-"); // join with -
}

async function generateUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;

  while (await Blog.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

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
    const { title, description, imageUrl, content, author } = await req.json();

    if (!title || !content || !author) {
      return NextResponse.json(
        { message: "Title, content, and author are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Step 1: Create base slug
    const baseSlug = slugify(title || description);
    // Step 2: Ensure unique
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    // Step 3: Save blog with slug
    const blog = new Blog({
      title,
      description,
      imageUrl,
      content,
      author,
      slug: uniqueSlug,
    });

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
