export function formatClockTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function formatClockDate(date: Date) {
  return date.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
