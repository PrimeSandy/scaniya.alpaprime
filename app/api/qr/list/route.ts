import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { QRCode } from "@/models/QRCode";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  try {
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findById((session.user as any).dbId || session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const qrCodes = await QRCode.find({ userId: user._id }).sort({ createdAt: -1 });
    return NextResponse.json({ qrCodes });
  } catch (error) {
    console.error("List QR error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
