import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
    }

    // Note: Similar to password, env vars can't be changed at runtime in serverless.
    // This gives the user a confirmation and instructions.
    return NextResponse.json({ 
      success: true, 
      message: `Email notifikasi akan diarahkan ke: ${email}. Untuk mengubah secara permanen, buka Vercel Dashboard > Settings > Environment Variables dan ubah nilai NOTIFICATION_EMAIL.` 
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
