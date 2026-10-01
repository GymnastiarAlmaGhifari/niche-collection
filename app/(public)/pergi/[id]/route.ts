import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductBySlug(id);

  if (!product) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Increment click count for this product
    await redis.incr(`clicks:product:${product.id}`);
    
    // Also track today's total clicks for dashboard
    const today = new Date().toISOString().split("T")[0];
    await redis.incr(`clicks:daily:${today}`);
  } catch (error) {
    console.error("Failed to log click to Redis:", error);
    // Ignore error and proceed to redirect
  }

  // Redirect to affiliate URL
  return NextResponse.redirect(product.affiliateUrl);
}
