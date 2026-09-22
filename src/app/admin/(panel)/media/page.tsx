import { isAdmin } from "@/lib/admin-auth";
import { mediaUrl } from "@/lib/site/content";
import { readSiteDataFresh, siteStorage } from "@/lib/site/store";
import { MediaUploader } from "../../_components/media-uploader";

export default async function MediaPage() {
  if (!(await isAdmin())) return null;
  const storage = siteStorage();
  const version = storage === "none" ? 0 : (await readSiteDataFresh()).mediaVersion;

  return (
    <div>
      <header className="border-b px-5 py-3 lg:px-8">
        <h1 className="text-base font-semibold tracking-tight">Photos</h1>
        <p className="text-xs text-muted-foreground">Stored in Vercel Blob, not in the source code. Up to 5 MB each.</p>
      </header>
      <div className="space-y-4 px-5 py-6 lg:px-8">
        <MediaUploader
          mediaKey="avatar"
          title="Site photo"
          description="Shown in the sidebar and when the photo is opened. WebP, JPEG or PNG; a square photo works best."
          accept="image/webp,image/jpeg,image/png"
          src={mediaUrl("avatar", version)}
          disabled={storage === "none"}
        />
        <MediaUploader
          mediaKey="cv-photo"
          title="CV photo"
          description="Printed on the PDF resume. JPEG or PNG."
          accept="image/jpeg,image/png"
          src={mediaUrl("cv-photo", version)}
          disabled={storage === "none"}
        />
      </div>
    </div>
  );
}
