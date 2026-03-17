import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { dbConnect } from "@/lib/mongodb";
import { QRCode } from "@/models/QRCode";
import { ScanLog } from "@/models/ScanLog";
import { TextPage } from "@/components/scan/TextPage";
import { ImagePage } from "@/components/scan/ImagePage";
import { MultiPage } from "@/components/scan/MultiPage";

export const dynamic = "force-dynamic";

async function getQR(id: string) {
  await dbConnect();
  return QRCode.findOne({ uniqueId: id, isActive: true }).lean();
}

export default async function ScanPage({
  params,
}: {
  params: { id: string };
}) {
  const qr = (await getQR(params.id)) as any;
  if (!qr) notFound();

  // Increment scanCount and log — do async, no await to not block render
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "unknown";
  const country = headersList.get("cf-ipcountry") || undefined;

  (async () => {
    try {
      await dbConnect();
      await QRCode.findByIdAndUpdate(qr._id, { $inc: { scanCount: 1 } });
      await ScanLog.create({ qrId: qr._id, userAgent, country });
    } catch (e) {
      console.error("Scan log error:", e);
    }
  })();

  // Render based on type
  if (qr.type === "link") {
    const url = qr.content?.url;
    if (!url) notFound();
    redirect(url);
  }

  if (qr.type === "text") {
    return <TextPage body={qr.content?.body || ""} qrName={qr.name} />;
  }

  if (qr.type === "image") {
    return (
      <ImagePage
        url={qr.content?.url || ""}
        caption={qr.content?.caption}
        qrName={qr.name}
      />
    );
  }

  if (qr.type === "multi") {
    return (
      <MultiPage
        title={qr.content?.title || "Choose an option"}
        actions={qr.content?.actions || []}
        qrName={qr.name}
      />
    );
  }

  notFound();
}
