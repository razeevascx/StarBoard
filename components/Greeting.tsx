export default function Greeting() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-ctp-mauve to-ctp-blue mb-2 animate-pulse">
      {greeting}, User
    </div>
  );
}
