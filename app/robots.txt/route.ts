import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://eddington.tech/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
