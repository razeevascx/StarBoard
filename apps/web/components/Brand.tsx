export function Brand({ href = "/" }: { href?: string }) {
  return (
    <a href={href} aria-label="Starboard home" className="inline-flex shrink-0 items-center gap-2.5 text-base font-semibold tracking-tight text-ctp-text">
      <span aria-hidden="true" className="text-2xl text-ctp-mauve">✦</span>
    </a>
  );
}
