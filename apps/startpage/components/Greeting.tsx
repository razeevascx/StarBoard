import { getGreeting } from "../lib/greeting";

export default function Greeting() {
  return (
    <div className="text-4xl font-extrabold text-ctp-text">
      {getGreeting()},
    </div>
  );
}
