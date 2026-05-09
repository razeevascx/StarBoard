import { useState } from 'react';
import { WEEK_DAYS, getCalendarDays, isToday } from '../lib/calendar';

export default function Calendar() {
  const [date] = useState(new Date());

  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const days = getCalendarDays(currentYear, currentMonth);

  const monthName = date.toLocaleString('default', { month: 'long' });

  return (
    <div className="p-6 rounded-3xl bg-ctp-surface0/30 backdrop-blur-sm border border-ctp-surface1/50 shadow-xl w-full max-w-sm select-none">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl font-bold text-ctp-mauve">
          {monthName} <span className="text-ctp-subtext0 font-medium">{currentYear}</span>
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="text-center text-[10px] font-bold uppercase tracking-wider text-ctp-overlay0 py-2">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          return (
            <div
              key={idx}
              className={`
                aspect-square flex items-center justify-center rounded-xl text-sm transition-all
                ${day === null ? '' : 'hover:bg-ctp-surface1'}
                ${isToday(day, currentMonth, currentYear) ? 'bg-ctp-blue text-ctp-base font-bold shadow-lg scale-110' : 'text-ctp-text'}
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
