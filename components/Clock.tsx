import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true ,});
  const dateString = time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="grid mx-auto justify-center items-center text-center uppercase">
      <div className="text-9xl font-black text-ctp-text  tabular-nums">
        {timeString}
      </div>
      <div className="text-xl font-medium tracking-[0.2em] uppercase text-ctp-mauve mt-4">
        {dateString}
      </div>
    </div>
  );
}
