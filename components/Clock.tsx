import { useState, useEffect } from 'react';
import { formatClockDate, formatClockTime } from '../lib/clock';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid mx-auto justify-center items-center text-center uppercase">
      <div className="text-9xl font-black text-ctp-text  tabular-nums">
        {formatClockTime(time)}
      </div>
      <div className="text-xl font-medium tracking-[0.2em] uppercase text-ctp-mauve mt-4">
        {formatClockDate(time)}
      </div>
    </div>
  );
}
