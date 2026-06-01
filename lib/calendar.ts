export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function getCalendarDays(year: number, month: number) {
  const days: Array<number | null> = [];
  const totalDays = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    days.push(day);
  }

  return days;
}

export function isToday(day: number | null, currentMonth: number, currentYear: number, today = new Date()) {
  return (
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear()
  );
}
