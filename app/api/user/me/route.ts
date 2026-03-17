import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  try {
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findById((session.user as any).dbId || session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      name: user.name,
      email: user.email,
      image: user.image,
      plan: user.plan,
      qrCount: user.qrCount,
    });
  } catch (error) {
    console.error("User ME error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
