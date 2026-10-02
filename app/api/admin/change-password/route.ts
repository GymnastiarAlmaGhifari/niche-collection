import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (currentPassword !== adminPassword) {
      return NextResponse.json({ error: "Password saat ini salah." }, { status: 400 });
    }

    // Note: In this serverless architecture, we can't persist env vars at runtime.
    // The user must update ADMIN_PASSWORD in Vercel Environment Variables manually.
    // This endpoint validates the current password and gives the user confirmation.
    
    return NextResponse.json({ 
      success: true, 
      message: `Password terverifikasi. Untuk mengubah password secara permanen, buka Vercel Dashboard > Settings > Environment Variables dan ubah nilai ADMIN_PASSWORD menjadi: ${newPassword}` 
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
