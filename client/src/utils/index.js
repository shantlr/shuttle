export const formatDuration = (duration) => {
  if (duration >= 1000 * 1000 * 1000) {
    return `${(duration / 1000 / 1000).toFixed(2)}s`;
  }
  if (duration >= 1000 * 1000) {
    return `${(duration / 1000 / 1000).toFixed(2)}ms`;
  }
  if (duration > 1000) {
    return `${duration / 1000}µs`;
  }
  return duration;
}