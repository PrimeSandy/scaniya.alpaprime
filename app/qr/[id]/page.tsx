import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { headers } from "next/headers";
import { dbConnect } from "@/lib/mongodb";
import { QRCode } from "@/models/QRCode";
import { ScanLog } from "@/models/ScanLog";
import { TextPage } from "@/components/scan/TextPage";
import { ImagePage } from "@/components/scan/ImagePage";
import { MultiPage } from "@/components/scan/MultiPage";
import { LinkPage } from "@/components/scan/LinkPage";
import { CommentSection } from "@/components/scan/CommentSection";

export const dynamic = "force-dynamic";

async function getQR(id: string) {
  await dbConnect();
  return QRCode.findOne({ uniqueId: id, isActive: true }).lean();
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const qr = (await getQR(params.id)) as any;
  if (!qr) return { title: "Not Found" };

  let description = "Powered by Scaniya";
  if (qr.type === "text") description = qr.content?.body?.substring(0, 150) || description;
  if (qr.type === "image") description = qr.content?.caption || "View image on Scaniya";
  if (qr.type === "multi") description = qr.content?.title || "Choose an option";

  return {
    title: qr.name,
    description,
    openGraph: {
      title: qr.name,
      description,
      type: "website",
    },
  };
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
  let content;

  if (qr.type === "link") {
    const url = qr.content?.url;
    if (!url) notFound();
    content = <LinkPage url={url} qrName={qr.name} />;
  } else if (qr.type === "text") {
    content = <TextPage body={qr.content?.body || ""} qrName={qr.name} />;
  } else if (qr.type === "image") {
    content = (
      <ImagePage
        url={qr.content?.url || ""}
        caption={qr.content?.caption}
        qrName={qr.name}
      />
    );
  } else if (qr.type === "multi") {
    content = (
      <MultiPage
        title={qr.content?.title || "Choose an option"}
        actions={qr.content?.actions || []}
        qrName={qr.name}
      />
    );
  } else {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="flex-none">
        {content}
      </div>
      <div className="flex-1 w-full bg-zinc-50 dark:bg-zinc-950">
        <CommentSection qrId={qr._id.toString()} />
      </div>
    </div>
  );
}
