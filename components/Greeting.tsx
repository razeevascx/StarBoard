import { getGreeting } from "../lib/greeting";

export default function Greeting() {
  return (
    <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-ctp-mauve to-ctp-blue mb-2 animate-pulse">
      {getGreeting()},
    </div>
  );
}
