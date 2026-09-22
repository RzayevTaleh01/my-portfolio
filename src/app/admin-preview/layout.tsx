import "../globals.css";
import { AdminShell } from "../admin/_components/shell";

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
