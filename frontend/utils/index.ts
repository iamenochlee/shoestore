export function formatRelativeTime(blockTimestamp: number) {
  const now = new Date().getTime() / 1000; // convert to Unix timestamp format
  const diffSeconds = now - blockTimestamp;

  if (diffSeconds < 60) {
    return "just now";
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
}
