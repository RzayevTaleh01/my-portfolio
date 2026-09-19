import { notFound } from "next/navigation";

// Unknown paths inside a locale (e.g. /az/foo) render the localized 404 page.
export default function CatchAll() {
  notFound();
}
