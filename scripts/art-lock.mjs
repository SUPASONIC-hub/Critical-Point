import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

/**
 * Which original each responsive variant was cut from.
 *
 * `build-art-variants.mjs` writes this file as it writes the variants, and
 * `check-art-budget.mjs` reads it. Nothing else about a 480px webp says which
 * painting it was shrunk from, so without the record a repainted original kept
 * its old variants and every check passed: the desktop showed the new picture
 * and every phone the old one.
 */
export const ART_LOCK = "scripts/art-variants.lock.json";

export const hashBytes = (bytes) => createHash("sha256").update(bytes).digest("hex");
export const hashFile = (file) => hashBytes(readFileSync(file));

/** Width and height of a webp, from its header: lossy, lossless or extended. */
export function readWebpSize(file) {
  const bytes = readFileSync(file);
  if (bytes.toString("latin1", 0, 4) !== "RIFF" || bytes.toString("latin1", 8, 12) !== "WEBP") return null;
  const chunk = bytes.toString("latin1", 12, 16);
  if (chunk === "VP8X") {
    return { width: 1 + bytes.readUIntLE(24, 3), height: 1 + bytes.readUIntLE(27, 3) };
  }
  if (chunk === "VP8 ") {
    return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const bits = bytes.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  return null;
}
