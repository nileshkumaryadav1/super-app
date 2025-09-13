import RSSParser from "rss-parser";
import fetch from "node-fetch";
import { NextResponse } from "next/server";

export async function GET(req) {
  const parser = new RSSParser();
  // const feedUrl = "http://feeds.bbci.co.uk/news/rss.xml"; // change feed if needed
  const feedUrl = "https://www.indiatoday.in/rss/home";
  const defaultImage = "/news.jpg"; // fallback image

  // Get pagination params from query string
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;

  try {
    const feed = await parser.parseURL(feedUrl);

    // Paginate items
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedItems = feed.items.slice(start, end);

    const articles = await Promise.all(
      paginatedItems.map(async (item) => {
        // 1️⃣ Try media:content or enclosure
        let image = item.enclosure?.url || item["media:content"]?.url || defaultImage;

        // 2️⃣ Optional: Try fetching og:image from page
        if (image === defaultImage && item.link) {
          try {
            const res = await fetch(item.link);
            const html = await res.text();
            const ogMatch = html.match(/<meta property="og:image" content="(.*?)"/i);
            if (ogMatch && ogMatch[1]) image = ogMatch[1];
          } catch {
            // ignore errors
          }
        }

        return {
          title: item.title,
          description: item.contentSnippet || item.content || "",
          url: item.link,
          urlToImage: image,
          pubDate: item.pubDate,
        };
      })
    );

    // Determine if more news exists
    const hasMore = end < feed.items.length;

    return NextResponse.json({ articles, hasMore, page }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
