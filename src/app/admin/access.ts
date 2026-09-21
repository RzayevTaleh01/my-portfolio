/**
 * The admin code lives in the frontend, stored only as its SHA-256 hash.
 * To change it, print the hash of a new code and paste it below:
 *   node -e "console.log(require('crypto').createHash('sha256').update('NEW-CODE').digest('hex'))"
 *
 * This is a lock on the door, not a vault: the panel only reads public content,
 * and saving works only under `npm run dev` on your own machine.
 */
export const ADMIN_CODE_SHA256 = "3db94d1eb2862bbb1fd2621feaaf1803263fc49b0705eec89843fed0a44c5381";

export async function sha256(text: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}
