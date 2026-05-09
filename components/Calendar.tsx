import { useState } from 'react';

export default function Calendar() {
  const [date] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const today = new Date();

  const days = [];
  const totalDays = daysInMonth(currentYear, currentMonth);
  const startDay = firstDayOfMonth(currentYear, currentMonth);

  // Padding for the first week
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let d = 1; d <= totalDays; d++) {
    days.push(d);
  }

  const monthName = date.toLocaleString('default', { month: 'long' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6 rounded-3xl bg-ctp-surface0/30 backdrop-blur-sm border border-ctp-surface1/50 shadow-xl w-full max-w-sm select-none">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl font-bold text-ctp-mauve">
          {monthName} <span className="text-ctp-subtext0 font-medium">{currentYear}</span>
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-[10px] font-bold uppercase tracking-wider text-ctp-overlay0 py-2">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const isToday = 
            day === today.getDate() && 
            currentMonth === today.getMonth() && 
            currentYear === today.getFullYear();

          return (
            <div
              key={idx}
              className={`
                aspect-square flex items-center justify-center rounded-xl text-sm transition-all
                ${day === null ? '' : 'hover:bg-ctp-surface1'}
                ${isToday ? 'bg-ctp-blue text-ctp-base font-bold shadow-lg scale-110' : 'text-ctp-text'}
                ${day === null ? 'opacity-0' : 'opacity-100'}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
