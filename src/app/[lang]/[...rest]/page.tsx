import { notFound } from "next/navigation";

// Unknown paths inside a locale (e.g. /sk/foo) render the localized 404 page.
export default function CatchAll() {
  notFound();
}
