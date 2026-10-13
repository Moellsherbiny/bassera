
export function chunkText(
  text: string,
  chunkSize = 1200,
  overlap = 200,
): string[] {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .trim();

  const chunks: string[] = [];
  let start = 0;

  while (start < normalized.length) {
    let end = Math.min(start + chunkSize, normalized.length);

    if (end < normalized.length) {
      const boundary = normalized.lastIndexOf("\n", end);

      if (boundary > start + chunkSize * 0.6) {
        end = boundary;
      }
    }

    const chunk = normalized.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end === normalized.length) break;

    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}
