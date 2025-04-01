export function msToTime(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const minutesFormatted = minutes > 9 ? `${minutes}` : `0${minutes}`;
  const secondsFormatted = seconds > 9 ? `${seconds}` : minutes > 0 || hours > 0 ? `0${seconds}` : seconds;

  if (hours > 0) {
    return `${hours}:${minutesFormatted}:${secondsFormatted}`;
  }

  if (minutes > 0) {
    return `${minutes}:${secondsFormatted}`;
  }

  return `${secondsFormatted}`;
}
