import { monogram } from "@/lib/site/monogram";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return monogram(size.width, true);
}
