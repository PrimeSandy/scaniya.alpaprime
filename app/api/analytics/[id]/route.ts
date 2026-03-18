import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { QRCode } from "@/models/QRCode";
import { ScanLog } from "@/models/ScanLog";
import { User } from "@/models/User";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const { id } = params;
  try {
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const qr = await QRCode.findOne({ uniqueId: id });
    if (!qr) return NextResponse.json({ error: "QR not found" }, { status: 404 });

    const user = await User.findById((session.user as any).dbId || session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (qr.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { plan } = user;
    const scanCount = qr.scanCount;

    if (plan === "free") {
      return NextResponse.json({ scanCount, logs: [] });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await ScanLog.find({ qrId: qr._id, timestamp: { $gte: sevenDaysAgo } }).sort({ timestamp: -1 });

    return NextResponse.json({ scanCount, logs });
  } catch (error) {
    console.error("Fetch Analytics error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
