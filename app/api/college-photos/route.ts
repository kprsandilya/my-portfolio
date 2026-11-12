import { readdir } from "node:fs/promises";
import path from "node:path";

// Lists every image in public/college so the "More than Academics" section
// fills itself: drop a photo in that folder and it shows up, no code changes.
//
// force-static: on `next build` (e.g. a Vercel deploy after pushing to main)
// this runs once and is saved as a static JSON file. In `next dev` it runs on
// every request, so new photos appear on a page refresh.
export const dynamic = "force-static";

const PHOTO_DIR = path.join(process.cwd(), "public", "college");
const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;

// "purdue-football_game.jpg" -> "Purdue football game"
function altFromFilename(file: string) {
  const words = file.replace(IMAGE_EXT, "").replace(/[-_]+/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : "College photo";
}

export async function GET() {
  let files: string[] = [];
  try {
    files = await readdir(PHOTO_DIR);
  } catch {
    // Folder missing: show no photos rather than failing the build.
  }

  const photos = files
    .filter((f) => IMAGE_EXT.test(f) && !f.startsWith("."))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => ({ src: `/college/${encodeURIComponent(f)}`, alt: altFromFilename(f) }));

  return Response.json(photos);
}
