import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const notificationEmail = process.env.NOTIFICATION_EMAIL || "admin@nichecollection.com";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Kolom wajib tidak boleh kosong." }, { status: 400 });
    }

    const data = await resend.emails.send({
      from: "Niche Collection <onboarding@resend.dev>", // Resend default test email
      to: notificationEmail,
      subject: `Pesan Baru: ${subject || "Tanpa Subjek"}`,
      text: `Dari: ${name} (${email})\n\nPesan:\n${message}`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
