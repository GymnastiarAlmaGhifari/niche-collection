import { NextResponse } from "next/server";
import { translateText } from "@/lib/translate";

export async function POST(request: Request) {
  try {
    const { text, from = "id", to = "en" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const translated = await translateText(text, from, to);
    return NextResponse.json({ translated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Translation failed" },
      { status: 500 }
    );
  }
}
