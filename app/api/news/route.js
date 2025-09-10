// app/api/news/route.js
import RSSParser from "rss-parser";
import { NextResponse } from "next/server";

export async function GET() {
  const parser = new RSSParser();

  // Example: BBC Top Stories RSS feed
  const feedUrl = "http://feeds.bbci.co.uk/news/rss.xml";

  try {
    const feed = await parser.parseURL(feedUrl);

    const articles = feed.items.map(item => ({
      title: item.title,
      description: item.contentSnippet,
      url: item.link,
      urlToImage: "", // RSS usually does not include images, you can add default or parse media
    }));

    return NextResponse.json({ articles });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
