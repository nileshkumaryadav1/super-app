import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import RSSParser from "rss-parser";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    if (!query) {
      return NextResponse.json({ blogs: [], news: [] });
    }

    const regex = new RegExp(query, "i");

    // Fetch matching blogs
    const blogs = await Blog.find(
      { $or: [{ title: regex }, { excerpt: regex }, { content: regex }] },
      { title: 1, slug: 1, excerpt: 1 }
    )
      .limit(5)
      .lean();

    // Fetch RSS news
    const parser = new RSSParser();
    const feedUrl = "http://feeds.bbci.co.uk/news/rss.xml"; // same as your news api
    const feed = await parser.parseURL(feedUrl);

    // Filter RSS articles by query
    const news = feed.items
      .filter(
        (item) =>
          regex.test(item.title || "") || regex.test(item.contentSnippet || "")
      )
      .slice(0, 5)
      .map((item) => ({
        title: item.title,
        description: item.contentSnippet,
        url: item.link,
        urlToImage: "", // still no image in most RSS
      }));

    return NextResponse.json({ blogs, news });
  } catch (err) {
    console.error("Error in related API:", err);
    return NextResponse.json(
      { error: "Failed to fetch related content" },
      { status: 500 }
    );
  }
}
